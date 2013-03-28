var ImageGallery = new Backbone.Marionette.Application();

ImageGallery.addRegions({
  mainRegion: "#main"
});

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

