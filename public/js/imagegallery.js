var ImageGallery = new Backbone.Marionette.Application();

ImageGallery.addRegions({
  mainRegion: "#main",
  imageList: "#image-list"
});

ImageGallery.on("initialize:before", function(options){
  options.images = new ImageGallery.ImageCollection(options.imageData);
});

ImageGallery.bind("initialize:after", function(){
  Backbone.history.start();
});
