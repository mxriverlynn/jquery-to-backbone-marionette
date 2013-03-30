ImageGallery.ImageViewer = {
  init: function(){
    this.$main = $("#main");
    this.showImageTemplate = _.template($("#image-view-template").html());
  },

  show: function(image){
    var html = this.showImageTemplate(image);
    this.$main.html(html);
  }
};
