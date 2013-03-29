ImageGallery.module("Router", function(Mod, App, Backbone, Marionette, $, _){

  ImageGallery.Router = Marionette.AppRouter.extend({
    appRoutes: {
      "": "newImage",
      "images/new": "newImage",
      "images/:id": "showImage",
      "images/:id/edit": "editImage",
    }
  });

  ImageGallery.RouteHandlers = Marionette.Controller.extend({
    initialize: function(options){
      this.collection = options.collection;
      this.controller = new ImageGallery.Controller(options);
    },

    newImage: function(){
      this.controller.newImage();
    },

    showImage: function(id){
      this.loadImage(id, function(image){
        this.controller.showImage(image);
      });
    },

    editImage: function(id){
      this.loadImage(id, function(image){
        this.controller.editImage(image);
      });
    },

    loadImage: function(id, cb){
      var image = this.collection.get(id);
      if (image){
        cb.call(this, image);
      } else {
        ImageGallery.showError("Image #" + id + " Not Found");
      }
    }
  });

  this.addInitializer(function(options){
    var controller = new ImageGallery.RouteHandlers({
      collection: options.images,
      region: App.mainRegion
    });

    var router = new ImageGallery.Router({
      controller: controller
    });
  });

});
