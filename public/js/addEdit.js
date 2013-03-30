(function(ImageGallery){

  ImageGallery.AddEditImage = {
    init: function(){
      _.bindAll(this, "addClicked");

      this.$main = $("#main");

      $("a.add-image").click(this.addClicked);
    },

    addClicked: function(e){
      e.preventDefault();
      this.addNewImage();
    },

    addNewImage: function(){
      // render the form and show it
      var addImageView = new AddImageView({
        collection: ImageGallery.images
      });
      this.$main.html(addImageView.render().$el);
    }
  };

  var AddImageView = Backbone.View.extend({
      // this.$main.on("change", "#url", this.showImagePreview);
      // this.$main.on("click", "#save", this.saveNewImage);

    events: {
      "change #url": "showImagePreview",
      "click #save": "saveNewImage"
    },

    initialize: function(){
      this.template = _.template($("#add-image-template").html());
    },

    showImagePreview: function(e){
      e.preventDefault();
      var url = $(e.currentTarget).val();
      this.$("#preview").attr("src", url);
    },

    saveNewImage: function(e){
      e.preventDefault();

      // get the data for the new image
      var data = {
        url: this.$("#url").val(),
        name: this.$("#name").val(),
        description: this.$("#description").val(),
      };

      // save it to the server
      this.collection.create(data, {
        wait: true,
        success: function(image){
          // add it to the image list
          ImageGallery.images.add(image);

          // show the updated list
          ImageGallery.ImageList.show(ImageGallery.images);
          ImageGallery.ImageViewer.show(image);
        }
      });
    },

    render: function(){
      var html = this.template();
      this.$el.html(html);
      return this;
    }
  });

})(ImageGallery);
