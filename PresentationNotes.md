## Section 1: jQuery and first Backbone.View

Review the current jQuery app code

Convert the image viewer to a Backbone.View

## Section 2: Form manipulation

Convert the AddImageForm to a Backbone.View

show events configuration

show pulling data from this.$ instead of this.$main.find / this.$el.find

## Section 3: Backbone.Model

Define Image model in AddEdit.js

convert this.model to Image in the AddImageView initializer

Persist it w/ .save instead of ajax call

pass data to model.save

adjust success to use .toJSON of image result

## Section 4: Backbone.Collection

Move Image to ImageGallery.js/ImageGallery.Image

Add ImageCollection w/ url attr

change "this.images" to ImageCollection in ImageGallery.init

show how the image list is still working because of _.each iterating


