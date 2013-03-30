(function(ImageGallery){

  ImageGallery.ImageList = {
    init: function(){
      this.$imageList = $("#image-list");
    },

    show: function(images){
      var imageList = new ImagePreviewList({
        collection: images
      });
      this.$imageList.html(imageList.render().$el);
    }
  };

  var ImagePreview = Marionette.ItemView.extend({
    tagName: "li",
    template: "#image-preview-template",

    events: {
      "click a.image-preview": "imageClicked"
    },

    imageClicked: function(e){
      e.preventDefault();
      var image = this.model;
      ImageGallery.ImageViewer.show(image);
    }
  });

  var ImagePreviewList = Marionette.CollectionView.extend({
    tagName: "ul",
    itemView: ImagePreview,

    initialize: function(){
      this.listenTo(this.collection, "add", this.updateSize);
      this.updateSize();
    },

    updateSize: function(){
      var width = (this.collection.length * 160) + "px";
      this.$el.css({width: width});
    }
  });

})(ImageGallery);
