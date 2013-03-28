ImageGallery.ImageView = Backbone.View.extend({
  template: "#image-view-template",
  className: "image-view",

  events: {
    "click .nav-previous a": "previousImage",
    "click .nav-next a": "nextImage"
  },

  previousImage: function(e){
    e.preventDefault();
    ImageGallery.vent.trigger("image:previous");
  },

  nextImage: function(e){
    e.preventDefault();
    ImageGallery.vent.trigger("image:next");
  },

  render: function(){
    var template = $(this.template).html();
    var html = _.template(template, this.model.toJSON());
    $(this.el).html(html);
  }
});

ImageGallery.showImage = function(image){
  var imageView = new ImageGallery.ImageView({
    model: image
  });
  ImageGallery.mainRegion.show(imageView);
}
