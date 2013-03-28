ImageGallery.ImagePreview = Marionette.ItemView.extend({
  tagName: "li",

  className: "image-list-preview",

  template: "#image-preview-template",

  events: {
    "click a": "imageClicked",
  },

  initialize: function(){
    this.model.bind("selected", this.imageSelected, this);
    this.model.bind("deselected", this.imageDeselected, this);
    this.model.bind("change", this.render, this);
    this.model.bind("remove", this.imageDeleted, this);
  },

  imageDeleted: function(){
    this.remove();
  },

  imageSelected: function(){
    this.$("img").addClass("selected");
  },

  imageDeselected: function(){
    this.$("img").removeClass("selected");
  },

  imageClicked: function(e){
    e.preventDefault();
    this.model.select();
  }
});

ImageGallery.ImageListView = Marionette.CollectionView.extend({
  tagName: "ul",
  itemView: ImageGallery.ImagePreview,

  initialize: function(){
    this.on("before:item:added", this.adjustScrollSize, this);
    this.on("item:removed", this.adjustScrollSize, this);
  },

  adjustScrollSize: function(){
    var newWidth = this.collection.length * 160;
    this.$el.css({width: newWidth + "px"});
  }
});
