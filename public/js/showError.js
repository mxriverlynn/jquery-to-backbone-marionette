ImageGallery.ErrorView = Backbone.View.extend({
  template: "#error-view-template",
  className: "error",

  render: function(){
    var data = {message: this.options.message};
    var template = $(this.template).html();
    var html = _.template(template, data);
    $(this.el).html(html);
  }
});

ImageGallery.showError = function(message){
  var errorView = new ImageGallery.ErrorView({
    message: message
  });
  ImageGallery.mainRegion.show(errorView);
}
