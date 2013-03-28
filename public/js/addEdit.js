ImageGallery.AddEditImageView = Marionette.ItemView.extend({
  id: "add-image-form",

  events: {
    "change #name": "nameChanged",
    "change #description": "descriptionChanged",
    "change #url": "urlChanged",
    "click #save": "saveImage",
    "click #cancel": "cancel",
    "click #delete": "deleteImage"
  },

  initialize: function(options){
    _.bindAll(this, "saveSuccess", "saveError");
    this.template = options.template;
  },

  nameChanged: function(e){
    var value = $(e.currentTarget).val();
    this.model.set({name: value});
  },

  descriptionChanged: function(e){
    var value = $(e.currentTarget).val();
    this.model.set({description: value});
  },

  urlChanged: function(e){
    var value = $(e.currentTarget).val();
    this.model.set({url: value});
    this.$("#preview").attr("src", value);
  },

  deleteImage: function(e){
    e.preventDefault();
    this.model.destroy({
      error: this.deleteError
    });
  },

  deleteError: function(image, response){
    ImageGallery.showError("Error Deleting Image");
  },

  cancel: function(e){
    e.preventDefault();
    if (this.model.isNew()){
      this.render();
    } else {
      this.model.select();
    }
  },

  saveImage: function(e){
    e.preventDefault();
    var data = Backbone.Syphon.serialize(this);
    this.model.set(data);
    this.model.save(undefined, {
      success: this.saveSuccess,
      error: this.saveError
    });
  },

  saveSuccess: function(image, response){
    if (this.collection && !this.collection.include(image)){
      this.collection.add(image);
    }
    image.select();
  },

  saveError: function(image, response){
    ImageGallery.showError("Error Saving Image");
  }

});

ImageGallery.addImage = function(images){
  images.deselect();

  var image = new ImageGallery.Image();
  var addImageView = new ImageGallery.AddEditImageView({
    model: image,
    collection: images,
    template: "#add-image-template"
  });
  ImageGallery.mainRegion.show(addImageView);
}

ImageGallery.editImage = function(image){
  var editImageView = new ImageGallery.AddEditImageView({
    model: image,
    template: "#edit-image-template"
  });
  ImageGallery.mainRegion.show(editImageView);
}
