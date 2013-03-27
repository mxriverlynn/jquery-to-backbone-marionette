var ImageGallery = new Backbone.Marionette.Application();

ImageGallery.addRegions({
  mainRegion: "#main"
});

ImageGallery.Image = Backbone.Model.extend({
  urlRoot: "/images",

  select: function(){
    if (!this.get("selected")){
      this.set({selected: true}, {silent: true});
      this.trigger("selected");
      this.collection.select(this);
    }
    ImageGallery.vent.trigger("image:selected", this);
  },

  deselect: function(){
    this.unset("selected", {silent: true});
    this.trigger("deselected");
  }
});

ImageGallery.ImageCollection = Backbone.Collection.extend({
  url: "/images",

  model: ImageGallery.Image,

  initialize: function(){
    ImageGallery.vent.bind("image:previous", this.previousImage, this);
    ImageGallery.vent.bind("image:next", this.nextImage, this);
    this.bind("remove", this.imageDeleted, this);
  },

  imageDeleted: function(){
    if (this.length > 0){
      this.previousImage();
    } else {
      this.trigger("cleared");
    }
  },

  nextImage: function(){
    var index = this.indexOf(this.selectedImage);
    if (index > 0){
      index -= 1;
    } else {
      index = this.length - 1;
    }
    var image = this.at(index);
    image.select();
  },

  previousImage: function(){
    var index = this.indexOf(this.selectedImage);
    if (index < this.length - 1){
      index += 1;
    } else {
      index = 0;
    }
    var image = this.at(index);
    image.select();
  },

  select: function(image){
    this.deselect();
    this.selectedImage = image;
  },

  deselect: function(){
    if (this.selectedImage){
      this.selectedImage.deselect();
      delete this.selectedImage;
    }
  }
});

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

ImageGallery.ImagePreview = Marionette.ItemView.extend({
  tagName: "li",

  className: "image-list-preview",

  template: "#image-preview-template",

  events: {
    "click a": "imageClicked",
  },

  initialize: function(){
    this.model.bind("selected", this.imageSelected, this);
    this.model.bind("deselected", this.imageDeselected, this);
    this.model.bind("change", this.render, this);
    this.model.bind("remove", this.imageDeleted, this);
  },

  imageDeleted: function(){
    this.remove();
  },

  imageSelected: function(){
    this.$("img").addClass("selected");
  },

  imageDeselected: function(){
    this.$("img").removeClass("selected");
  },

  imageClicked: function(e){
    e.preventDefault();
    this.model.select();
  }
});

ImageGallery.ImageListView = Marionette.CollectionView.extend({
  tagName: "ul",
  itemView: ImageGallery.ImagePreview,

  initialize: function(){
    this.on("before:item:added", this.adjustScrollSize, this);
    this.on("item:removed", this.adjustScrollSize, this);
  },

  adjustScrollSize: function(){
    var newWidth = this.collection.length * 160;
    this.$el.css({width: newWidth + "px"});
  }
});

ImageGallery.ImageView = Backbone.View.extend({
  template: "#image-view-template",
  className: "image-view",

  events: {
    "click .nav-previous a": "previousImage",
    "click .nav-next a": "nextImage"
  },

  previousImage: function(e){
    e.preventDefault();
    ImageGallery.vent.trigger("image:previous");
  },

  nextImage: function(e){
    e.preventDefault();
    ImageGallery.vent.trigger("image:next");
  },

  render: function(){
    var template = $(this.template).html();
    var html = _.template(template, this.model.toJSON());
    $(this.el).html(html);
  }
});

ImageGallery.ErrorView = Backbone.View.extend({
  template: "#error-view-template",
  className: "error",

  render: function(){
    var data = {message: this.options.message};
    var template = $(this.template).html();
    var html = _.template(template, data);
    $(this.el).html(html);
  }
});

ImageGallery.Router = Backbone.Router.extend({
  routes: {
    "": "newImage",
    "images/new": "newImage",
    "images/:id": "showImage",
    "images/:id/edit": "editImage",
  },

  initialize: function(options){
    this.collection = options.collection;
  },
  
  showImage: function(id){
    var image = this.collection.get(id);
    if (image){
      image.select();
      ImageGallery.showImage(image);
    } else {
      ImageGallery.showError("Image #" + id + " Not Found");
    }
  },

  editImage: function(id){
    var image = this.collection.get(id);
    if (image){
      ImageGallery.editImage(image);
    } else {
      ImageGallery.showError("Image #" + id + " Not Found");
    }
  },

  newImage: function(){
    ImageGallery.addImage(this.collection);
  }
});

ImageGallery.showError = function(message){
  var errorView = new ImageGallery.ErrorView({
    message: message
  });
  ImageGallery.mainRegion.show(errorView);
}

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

ImageGallery.showImage = function(image){
  var imageView = new ImageGallery.ImageView({
    model: image
  });
  ImageGallery.mainRegion.show(imageView);
}

ImageGallery.addInitializer(function(options){
  var images = new ImageGallery.ImageCollection(options.imageData);

  images.bind("cleared", function(){
    ImageGallery.addImage(images);
  });

  images.bind("add", function(){
    ImageGallery.addImage(images);
  });

  ImageGallery.vent.bind("image:selected", function(image){
    ImageGallery.showImage(image);
    router.navigate("images/" + image.id);
  });

  var imageListView = new ImageGallery.ImageListView({
    collection: images
  });
  imageListView.render();

  $("#image-list").html(imageListView.el);

  var router = new ImageGallery.Router({
    collection: images
  });
});

ImageGallery.bind("initialize:after", function(){
  Backbone.history.start();
});

