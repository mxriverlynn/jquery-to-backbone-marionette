var ImageGallery = {
  init: function(options){
    this.images = new ImageGallery.ImageCollection(options.images);

    ImageGallery.ImageList.init();
    ImageGallery.ImageList.show(options.images);

    ImageGallery.AddEditImage.init();
    ImageGallery.AddEditImage.addNewImage();

    ImageGallery.ImageViewer.init();
  }
};

ImageGallery.Image = Backbone.Model.extend({
});

ImageGallery.ImageCollection = Backbone.Collection.extend({
  model: ImageGallery.Image,
  url: "/images"
});
