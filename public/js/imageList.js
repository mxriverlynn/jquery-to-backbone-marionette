(function(ImageGallery){

  ImageGallery.ImageList = {
    init: function(){
      _.bindAll(this, "imageClicked");
      
      this.$imageList = $("#image-list");

      this.$imageList.on("click", "a.image-preview", this.imageClicked)
    },

    imageClicked: function(e){
      e.preventDefault();

      var id = $(e.currentTarget).data("id");
      var image = _.select(ImageGallery.images, function(image){
        return image.id === id;
      })[0];

      ImageGallery.ImageViewer.show(image);
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
    template: "#image-preview-template"
  });

})(ImageGallery);
