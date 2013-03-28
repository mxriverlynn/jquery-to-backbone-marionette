ImageGallery.Image = Backbone.Model.extend({
  urlRoot: "/images",

  select: function(){
    if (!this.get("selected")){
      this.set({selected: true}, {silent: true});
      this.trigger("selected");
      this.collection.select(this);
    }
    ImageGallery.vent.trigger("image:selected", this);
  },

  deselect: function(){
    this.unset("selected", {silent: true});
    this.trigger("deselected");
  }
});

ImageGallery.ImageCollection = Backbone.Collection.extend({
  url: "/images",

  model: ImageGallery.Image,

  initialize: function(){
    ImageGallery.vent.bind("image:previous", this.previousImage, this);
    ImageGallery.vent.bind("image:next", this.nextImage, this);
    this.bind("remove", this.imageDeleted, this);
  },

  imageDeleted: function(){
    if (this.length > 0){
      this.previousImage();
    } else {
      this.trigger("cleared");
    }
  },

  nextImage: function(){
    var index = this.indexOf(this.selectedImage);
    if (index > 0){
      index -= 1;
    } else {
      index = this.length - 1;
    }
    var image = this.at(index);
    image.select();
  },

  previousImage: function(){
    console.log('previous');
    var index = this.indexOf(this.selectedImage);
    if (index < this.length - 1){
      index += 1;
    } else {
      index = 0;
    }
    var image = this.at(index);
    image.select();
  },

  select: function(image){
    this.deselect();
    this.selectedImage = image;
  },

  deselect: function(){
    if (this.selectedImage){
      this.selectedImage.deselect();
      delete this.selectedImage;
    }
  }
});


