ImageGallery.Controller = Marionette.Controller.extend({
  initialize: function(options){
    _.bindAll(this, "_deleteSuccess", "_deleteError", "_saveSuccess", "_saveError");

    this.collection = options.collection;
    this.region = options.region;

    ImageGallery.vent.on("model:selected", function(image){
      this.showImage(image);
    }, this);

  },
  
  showImage: function(image){
    image.select();

    var imageView = new ImageGallery.ImageView({
      model: image
    });

    this.region.show(imageView);
    Backbone.history.navigate("images/" + image.id);
  },

  editImage: function(image){
    image.select();

    var editImageView = new ImageGallery.AddEditImageView({
      model: image,
      template: "#edit-image-template"
    });

    editImageView.on("image:save", function(image){
      image.save(undefined, {
        success: this._saveSuccess,
        error: this._saveError
      });
    }, this);

    editImageView.on("image:deleted", function(image){
      image.destroy({
        success: this._deleteSuccess,
        error: this._deleteError
      });
    }, this);

    this.region.show(editImageView);
    Backbone.history.navigate("images/" + image.id + "/edit");
  },

  newImage: function(){
    this.collection.deselect();

    var image = new ImageGallery.Image();
    var addImageView = new ImageGallery.AddEditImageView({
      model: image,
      template: "#add-image-template"
    });

    addImageView.on("image:save", function(image){
      image.save(undefined, {
        success: this._saveSuccess,
        error: this._saveError
      });
    }, this);

    this.region.show(addImageView);
    Backbone.history.navigate("images/new");
  },

  _saveSuccess: function(image, response){
    if (this.collection && !this.collection.include(image)){
      this.collection.add(image);
    }

    this.trigger("image:added", image);
    image.deselect();
    this.showImage(image);
  },

  _saveError: function(image, response){
    ImageGallery.showError("Error Saving Image");
  },

  _deleteSuccess: function(){
    if (this.collection.length > 0){
      this.collection.previousImage();
    } else {
      this.newImage();
    }
  },

  _deleteError: function(image, response){
    console.log(response);
    ImageGallery.showError("Error Deleting Image");
  }
});
