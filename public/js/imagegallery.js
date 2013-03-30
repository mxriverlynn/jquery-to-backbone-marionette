var ImageGallery = {
  init: function(options){
    this.images = options.images;

    ImageGallery.ImageList.init();
    ImageGallery.ImageList.show(options.images);

    ImageGallery.AddEditImage.init();
    ImageGallery.AddEditImage.addNewImage();

    ImageGallery.ImageViewer.init();
  }
};
