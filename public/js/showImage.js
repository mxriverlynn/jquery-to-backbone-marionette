(function(){

  ImageGallery.ImageViewer = {
    init: function(){
      this.$main = $("#main");
    },

    show: function(image){
      var imageView = new ImageView({
        model: image
      });
      this.$main.html(imageView.render().$el);
    }
  };

  var ImageView = Marionette.ItemView.extend({
    template: "#image-view-template"
  });

})(ImageGallery);
