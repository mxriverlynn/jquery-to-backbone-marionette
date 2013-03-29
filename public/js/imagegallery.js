var ImageGallery = {
  init: function(options){
    this.images = options.images;

    ImageGallery.ImageList.init();
    ImageGallery.ImageList.show(options.images);

    ImageGallery.AddEditImage.init();
    ImageGallery.AddEditImage.addNewImage();
  }
};

ImageGallery.ImageList = {
  init: function(){
    this.$imageList = $("#image-list");
    this.imagePreviewTemplate = _.template($("#image-preview-template").html());
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

ImageGallery.AddEditImage = {
  init: function(){
    _.bindAll(this, "saveNewImage", "showImagePreview");

    this.$main = $("#main");
    this.addImageTemplate = _.template($("#add-image-template").html());
    this.showImageTemplate = _.template($("#image-view-template").html());
  },

  addNewImage: function(){
    // render the form and show it
    var addForm = this.addImageTemplate();
    this.$main.html(addForm);

    this.$main.on("change", "#url", this.showImagePreview);
    this.$main.on("click", "#save", this.saveNewImage);
  },

  showImagePreview: function(e){
    e.preventDefault();
    var url = $(e.currentTarget).val();
    this.$main.find("#preview").attr("src", url);
  },

  saveNewImage: function(e){
    e.preventDefault();

    // get the data for the new image
    var data = {
      url: this.$main.find("#url").val(),
      name: this.$main.find("#name").val(),
      description: this.$main.find("#description").val(),
    };

    // save it to the server
    $.ajax({
      url: "/images",
      type: "POST",
      dataType: "JSON",
      data: data,
      success: function(image){
        // add it to the image list
        ImageGallery.images.push(image);

        // show the updated list
        ImageGallery.ImageList.show(ImageGallery.images);
      }
    });
  }
};

