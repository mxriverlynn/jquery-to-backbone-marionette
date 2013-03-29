ImageGallery.Image = Backbone.Model.extend({
  urlRoot: "/images",

  initialize: function(){
    Backbone.Picky.Selectable.mixInto(this);

    this.on("model:selected", this.imageSelected);
  },

  imageSelected: function(){
    ImageGallery.vent.trigger("model:selected", this);
  }
});

ImageGallery.ImageCollection = Backbone.Collection.extend({
  url: "/images",

  model: ImageGallery.Image,

  initialize: function(){
    ImageGallery.vent.bind("image:previous", this.previousImage, this);
    ImageGallery.vent.bind("image:next", this.nextImage, this);

    Backbone.Picky.SingleSelect.mixInto(this);
  },

  previousImage: function(){
    var index = this.indexOf(this.selected);
    if (index > 0){
      index -= 1;
    } else {
      index = this.length - 1;
    }
    var image = this.at(index);
    image.select();
  },

  nextImage: function(){
    var index = this.indexOf(this.selected);
    if (index < this.length - 1){
      index += 1;
    } else {
      index = 0;
    }
    var image = this.at(index);
    image.select();
  },

  select: function(image){
    this.singleSelect.select(image);
  },

  deselect: function(image){
    this.singleSelect.deselect(image);
  }
});
