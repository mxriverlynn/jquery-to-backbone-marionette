ImageGallery.Controller = Marionette.Controller.extend({
  initialize: function(options){
    this.collection = options.collection;
    this.region = options.region;

    ImageGallery.vent.on("model:selected", function(image){
      this.showImage(image);
    }, this);

  },
  
  showImage: function(id){
    this._workWithImage(id, function(image){
      image.select();

      var imageView = new ImageGallery.ImageView({
        model: image
      });

      this.region.show(imageView);

      Backbone.history.navigate("images/" + image.id);
    });
  },

  editImage: function(id){
    this._workWithImage(id, function(image){
      var editImageView = new ImageGallery.AddEditImageView({
        model: image,
        template: "#edit-image-template"
      });

      editImageView.on("image:added", function(image){
        this.showImage(image);
      }, this);

      editImageView.on("image:deleted", function(image){
        image.destroy({
          success: function(){},
          error: this.deleteError
        });
      }, this);

      this.region.show(editImageView);
    });
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
      image.select();

      if (this.collection && !this.collection.include(image)){
        this.collection.add(image);
      }

      this.newImage();
    }, this);

    this.region.show(addImageView);
  },

  _workWithImage: function(id, cb){
    var image = this.collection.get(id);
    if (image){
      cb.call(this, image);
    } else {
      ImageGallery.showError("Image #" + id + " Not Found");
    }
  }
});
