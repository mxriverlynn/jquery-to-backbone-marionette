ImageGallery.ImageList = {
  init: function(){
    _.bindAll(this, "imageClicked");
    
    this.$imageList = $("#image-list");
    this.imagePreviewTemplate = _.template($("#image-preview-template").html());

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
    _.each(images, function(image){
      var html = this.imagePreviewTemplate(image);
      renderedImages.push(html);
    }, this);

    // show the list
    this.$imageList.empty();
    this.$imageList.html(renderedImages);
  }

};

