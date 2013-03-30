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

  var ImageView = Backbone.View.extend({
    
    initialize: function(){
      this.template = _.template($("#image-view-template").html());
    },

    render: function(){
      var html = this.template(this.model);
      this.$el.html(html);
      return this;
    }
  });

})(ImageGallery);
