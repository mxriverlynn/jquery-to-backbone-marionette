var ImageGallery = new Marionette.Application({
  init: function(options){
    this.images = new ImageGallery.ImageCollection(options.images);

    ImageGallery.ImageList.init();
    ImageGallery.ImageList.show(this.images);

    ImageGallery.AddEditImage.init();
    ImageGallery.AddEditImage.addNewImage();

    ImageGallery.ImageViewer.init();
  }
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
