// Backbone.Picky, v0.2.0
// Copyright (c)2013 Derick Bailey, Muted Solutions, LLC.
// Copyright (c)2013 Boris Kozorovitzky.
// Distributed under MIT license
// http://github.com/BorisKozo/backbone.picky


Backbone.Picky = (function (Backbone, _) {
    var Picky = {};

    // Picky.SingleSelect
    // ------------------
    // A single-select mixin for Backbone.Collection, allowing a single
    // model to be selected within a collection. Selection of another
    // model within the collection causes the previous model to be
    // deselected.

    Picky.SingleSelect = function () {
    };

    Picky.SingleSelect.mixInto = function (collection, options) {
        var singleSelect = new Picky.SingleSelect();
        _.extend(collection, singleSelect);

        if (options && options.selectOnAdd) {
            collection.on("add", function (model, collection) {
                collection.select(model);
            });
        }

        if (options && options.selectOnRemove) {
            collection.on("remove", function (model, collection, collectionOptions) {
                var index = collectionOptions.index,
                    prevIndex = Math.max(index - 1, 0),
                    nextIndex = Math.min(index, collection.length - 1);
                if (collection.selected === model) {
                    if (_.isFunction(options.selectOnRemove)) {
                        options.selectOnRemove(model, collection, collectionOptions);
                        return;
                    }

                    if (collection.length === 0) {
                        return;
                    }

                    // Select the model before the previously selected model
                    if (options.selectOnRemove === "prev") {
                        collection.at(prevIndex).select();
                        return;
                    }

                    // Select the model before the previously selected model
                    if (options.selectOnRemove === "next") {
                        collection.at(nextIndex).select();
                        return;
                    }

                }
            });
        } else {
            collection.on("remove", function (model, collection) {
                if (collection.selected === model) {
                    delete collection.selected;
                }
            });
        }

        collection.on("reset", function (collection) {
            collection.refreshSelection();
        });

        updateCollectionSelectionSingleSelect(collection);
    };

    _.extend(Picky.SingleSelect.prototype, {

        // Select a model, deselecting any previously
        // select model
        select: function (model) {
            if (model && this.selected === model) { return; }

            if (!this.some(function (innerModel) {
                return innerModel === model;
            })) {
                return;
            }

            this.deselect();

            this.selected = model;
            this.selected.select();
            this.trigger("collection:selected", model);
        },

        // Deselect a model, resulting in no model
        // being selected
        deselect: function (model) {
            var selected;

            if (!this.selected) { return; }

            model = model || this.selected;
            if (this.selected !== model) { return; }

            selected = this.selected;
            delete this.selected;
            this.trigger("collection:deselected", selected);
            selected.deselect();
        },

        //Finds the first selected model in the collection and selects it,
        //deselects all other models
        refreshSelection: function () {
            updateCollectionSelectionSingleSelect(this);
        }

    });

    // Picky.MultiSelect
    // -----------------
    // A mult-select mixin for Backbone.Collection, allowing a collection to
    // have multiple items selected, including `selectAll` and `deselectAll`
    // capabilities.

    Picky.MultiSelect = function () {
    };

    Picky.MultiSelect.mixInto = function (collection, options) {
        var multiSelect = new Picky.MultiSelect();

        multiSelect.selected = {};
        _.extend(collection, multiSelect);
        if (options && options.selectOnAdd) {
            collection.on("add", function (model, collection) {
                collection.select(model);
            });
        }

        collection.on("remove", function (model, collection) {
            if (collection.selected && collection.selected.hasOwnProperty(model.cid)) {
                delete collection.selected[model.cid];
                calculateSelectedLength(collection);
            }
        });


        collection.on("reset", function (collection) {
            collection.refreshSelection();
        });


        updateCollectionSelectionMultiSelect(collection);
    };

    _.extend(Picky.MultiSelect.prototype, {

        // Select a specified model, make sure the
        // model knows it's selected, and hold on to
        // the selected model.
        select: function (model) {
            if (this.selected[model.cid]) { return; }
            if (!this.some(function (innerModel) {
                return innerModel === model;
            })) { return; }

            this.selected[model.cid] = model;
            model.select();
            calculateSelectedLength(this);
        },

        // Deselect a specified model, make sure the
        // model knows it has been deselected, and remove
        // the model from the selected list.
        deselect: function (model) {
            if (!this.selected[model.cid]) { return; }

            delete this.selected[model.cid];
            model.deselect();
            calculateSelectedLength(this);
        },

        // Select all models in this collection
        selectAll: function () {
            this.each(function (model) { model.select(); });
            calculateSelectedLength(this);
        },

        // Deselect all models in this collection
        deselectAll: function () {
            if (this.selectedLength === 0) { return; }

            this.each(function (model) { model.deselect(); });
            calculateSelectedLength(this);
        },

        // Toggle select all / none. If some are selected, it
        // will select all. If all are selected, it will select 
        // none. If none are selected, it will select all.
        toggleSelectAll: function () {
            if (this.selectedLength === this.length) {
                this.deselectAll();
            } else {
                this.selectAll();
            }
        },

        // Updates the internal data structure of the collection to the selected state of models
        // in the collection. Triggers selected:none, selected:some, or selected:all event.
        refreshSelection: function () {
            updateCollectionSelectionMultiSelect(this);
        },

        // returns an array of all the selected models
        getSelected: function () {
            var modelCid, result = [];
            for (modelCid in this.selected) {
                if (this.selected.hasOwnProperty(modelCid)) {
                    result.push(this.selected[modelCid]);
                }
            }

            return result;
        }
    });

    // Picky.Selectable
    // ----------------
    // A selectable mixin for Backbone.Model, allowing a model to be selected,
    // enabling it to work with Picky.MultiSelect or on it's own

    Picky.Selectable = function () {
    };

    Picky.Selectable.mixInto = function (model) {
        var selectable = new Picky.Selectable();
        _.extend(model, selectable);
    };

    _.extend(Picky.Selectable.prototype, {

        // Select this model, and tell our
        // collection that we're selected
        select: function (options) {
            if (this.selected) { return; }

            if (this.collection && _.isFunction(this.collection.select)) {
                this.collection.select(this);
            }

            this.selected = true;

            if (options && options.silent) { return; }

            this.trigger("model:selected");

        },

        // Deselect this model, and tell our
        // collection that we're deselected
        deselect: function (options) {
            if (!this.selected) { return; }

            if (this.collection && _.isFunction(this.collection.deselect)) {
                this.collection.deselect(this);
            }

            this.selected = false;

            if (options && options.silent) { return; }

            this.trigger("model:deselected");

        },

        // Change selected to the opposite of what
        // it currently is
        toggleSelected: function (options) {
            if (this.selected) {
                this.deselect(options);
            } else {
                this.select(options);
            }
        },

        // Change the selection to the given value
        changeSelected: function (value, options) {
            if (value) {
                this.select(options);
            } else {
                this.deselect(options);
            }
        }

    });

    // Helper Methods
    // --------------

    // Calculate the number of selected items in a collection
    // and update the collection with that length. Trigger events
    // from the collection based on the number of selected items.
    var calculateSelectedLength = function (collection) {
        collection.selectedLength = _.size(collection.selected);

        var selectedLength = collection.selectedLength,
         length = collection.length;

        if (selectedLength === length) {
            collection.trigger("collection:selected:all", collection);
            return;
        }

        if (selectedLength === 0) {
            collection.trigger("collection:selected:none", collection);
            return;
        }

        if (selectedLength > 0 && selectedLength < length) {
            collection.trigger("collection:selected:some", collection);
            return;
        }
    },

    // Update the state of selected metadata on the collection based on 
    // the items contained in the collection
    updateCollectionSelectionSingleSelect = function (collection) {
        delete collection.selected;
        collection.each(function (model) {
            if (model.selected) {
                if (collection.selected) {
                    model.deselect({ silent: true });
                } else {
                    collection.selected = model;
                }
            }
        });
        if (collection.selected) {
            collection.trigger("collection:selected", collection.selected);
        }
    },


    // Update the state of selected metadata on the collection based on 
    // the items contained in the collection
    updateCollectionSelectionMultiSelect = function (collection) {
        collection.selected = {};
        collection.each(function (model) {
            if (model.selected) {
                collection.selected[model.cid] = model;
            }
        });
        calculateSelectedLength(collection);
    };


    return Picky;
})(Backbone, _);
