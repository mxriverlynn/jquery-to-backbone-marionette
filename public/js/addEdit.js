ImageGallery.AddEditImage = {
  init: function(){
    _.bindAll(this, "saveNewImage", "showImagePreview", "addClicked");

    this.addImageTemplate = _.template($("#add-image-template").html());

    this.$main = $("#main");
    this.$main.on("change", "#url", this.showImagePreview);
    this.$main.on("click", "#save", this.saveNewImage);

    $("a.add-image").click(this.addClicked);
  },

  addNewImage: function(){
    // render the form and show it
    var addForm = this.addImageTemplate();
    this.$main.html(addForm);
  },

  addClicked: function(e){
    e.preventDefault();
    this.addNewImage();
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
        ImageGallery.ImageViewer.show(image);
      }
    });
  }
};

