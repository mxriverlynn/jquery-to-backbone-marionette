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


