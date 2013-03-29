ImageGallery.Controller = Marionette.Controller.extend({
  initialize: function(options){
    _.bindAll(this, "deleteSuccess", "deleteError");

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
    var editImageView = new ImageGallery.AddEditImageView({
      model: image,
      template: "#edit-image-template"
    });

    editImageView.on("image:added", function(image){
      this.showImage(image);
    }, this);

    editImageView.on("image:deleted", function(image){
      image.destroy({
        success: this.deleteSuccess,
        error: this.deleteError
      });
    }, this);

    this.region.show(editImageView);
  },

  deleteSuccess: function(){
    if (this.collection.length > 0){
      this.collection.previousImage();
    } else {
      this.newImage();
    }
  },

  deleteError: function(image, response){
    console.log(response);
    ImageGallery.showError("Error Deleting Image");
  },

  newImage: function(){
    this.collection.deselect();

    var image = new ImageGallery.Image();
    var addImageView = new ImageGallery.AddEditImageView({
      model: image,
      template: "#add-image-template"
    });

    addImageView.on("image:added", function(image){
      if (this.collection && !this.collection.include(image)){
        this.collection.add(image);
      }

      this.showImage(image);
    }, this);

    this.region.show(addImageView);
  },

});
