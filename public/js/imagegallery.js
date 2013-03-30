var ImageGallery = new Marionette.Application();

ImageGallery.on("initialize:before", function(options){
  ImageGallery.images = new ImageGallery.ImageCollection(options.images);
});

ImageGallery.addRegions({
  main: "#main",
  imageList: "#image-list"
});

ImageGallery.Image = Backbone.Model.extend({
});

ImageGallery.ImageCollection = Backbone.Collection.extend({
  model: ImageGallery.Image,
  url: "/images"
});
