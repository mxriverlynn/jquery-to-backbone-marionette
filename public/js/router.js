ImageGallery.module("Router", function(Mod, App, Backbone, Marionette, $, _){

  ImageGallery.Router = Marionette.AppRouter.extend({
    appRoutes: {
      "": "newImage",
      "images/new": "newImage",
      "images/:id": "showImage",
      "images/:id/edit": "editImage",
    }
  });


  this.addInitializer(function(options){
    var controller = new ImageGallery.Controller({
      collection: options.images,
      region: App.mainRegion
    });

    var router = new ImageGallery.Router({
      controller: controller
    });
  });

});
