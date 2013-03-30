(function(ImageGallery){

  ImageGallery.ImageList = {
    init: function(){
      this.$imageList = $("#image-list");
    },

    show: function(images){
      // resize the display area
      var width = (images.length * 160) + "px";
      this.$imageList.css({width: width});
      
      // render all the images to show
      var renderedImages = [];
      images.each(function(image){
        var imageView = new ImagePreview({
          model: image
        });
        renderedImages.push(imageView.render().$el);
      }, this);

      // show the list
      this.$imageList.empty();
      this.$imageList.html(renderedImages);
    }

  };

  var ImagePreview = Marionette.ItemView.extend({
    tagName: "span",
    template: "#image-preview-template",

    events: {
      "click a.image-preview": "imageClicked"
    },

    imageClicked: function(e){
      e.preventDefault();
      var image = this.model;
      ImageGallery.ImageViewer.show(image);
    }
  });

})(ImageGallery);
