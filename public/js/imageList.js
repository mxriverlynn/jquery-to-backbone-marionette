ImageGallery.module("ImageList", function(Mod, App, Backbone, Marionette, $, _){

  var ImagePreview = Marionette.ItemView.extend({
    tagName: "li",

    className: "image-list-preview",

    template: "#image-preview-template",

    triggers: {
      "click a": "image:selected"
    },

    initialize: function(){
      this.model.bind("model:selected", this.imageSelected, this);
      this.model.bind("model:deselected", this.imageDeselected, this);
      this.model.bind("change", this.render, this);
    },

    imageSelected: function(){
      this.$("img").addClass("selected");
    },

    imageDeselected: function(){
      this.$("img").removeClass("selected");
    }
  });

  var ImageListView = Marionette.CollectionView.extend({
    tagName: "ul",
    itemView: ImagePreview,

    initialize: function(){
      this.on("before:item:added", this.adjustScrollSize, this);
      this.on("item:removed", this.adjustScrollSize, this);
    },

    adjustScrollSize: function(){
      var newWidth = this.collection.length * 160;
      this.$el.css({width: newWidth + "px"});
    }
  });

  var Controller = Marionette.Controller.extend({
    initialize: function(options){
      this.region = options.region;
      this.images = options.images;
    },

    show: function(){
      var imageListView = new ImageListView({
        collection: this.images
      });

      this.listenTo(imageListView, "itemview:image:selected", function(options){
        options.model.select();
      });

      ImageGallery.imageList.show(imageListView);
    }
  });

  this.addInitializer(function(options){
    var controller = new Controller({
      region: ImageGallery.imageList,
      images: options.images
    });

    controller.show();
  });

});
