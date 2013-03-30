(function(ImageGallery){

  ImageGallery.ImageViewer = {
    init: function(){
      this.mainRegion = ImageGallery.main;
    },

    show: function(image){
      var imageView = new ImageView({
        model: image
      });
      this.mainRegion.show(imageView);
    }
  };

  var ImageView = Marionette.ItemView.extend({
    template: "#image-view-template"
  });

})(ImageGallery);
