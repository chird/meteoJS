/**
 * @module meteoJS/synview/typeCollection
 */

/**
 * Options for meteoJS/synview/typeCollection.
 * 
 * @typedef {Object} meteoJS/synview/typeCollection~options
 * @param {boolean} [exclusiveVisibility]
 *   At the same time, only one single type is visible.
 */

/**
 * Collection of type-objects.
 * Could ensure, that only a single type of this collection is visible.
 * 
 * @constructor
 * @augments meteoJS.synview.collection
 * @param {meteoJS/synview/typeCollection~options} options Options.
 * @fires {meteoJS.synview.typeCollection#change:typeVisible}
 */
meteoJS.synview.typeCollection = function (options) {
  meteoJS.synview.collection.call(this);
  
  /**
   * Options.
   * @member {meteoJS/synview~options}
   */
  this.options = $.extend(true, {
    exclusiveVisibility: false
  }, options);
};
meteoJS.synview.typeCollection.prototype = Object.create(meteoJS.synview.collection.prototype);
meteoJS.synview.typeCollection.prototype.constructor = meteoJS.synview.typeCollection;

/**
 * Returns type with the passed ID or empty type if not existant.
 * 
 * @augment getById
 * @param {mixed} id ID.
 * @return {meteoJS.synview.type} Type.
 */
meteoJS.synview.typeCollection.prototype.getById = function (id) {
  var item = meteoJS.synview.collection.prototype.getById.call(this, id);
  return (item === undefined) ? new meteoJS.synview.type() : this.items[id];
};

/**
 * Append type to this collection. If type with same ID is present, the type
 * will be exchanged.
 * 
 * @augment append
 * @param {meteoJS.synview.type} type Type.
 * @return {meteoJS.synview.typeCollection} This.
 */
meteoJS.synview.typeCollection.prototype.append = function (type) {
  var that = this;
  if (this.options.exclusiveVisibility) {
    if (this.isVisible())
      type.setVisible(false);
    type.on('change:visible', function () {
      if (this.getVisible())
        that.getItems().forEach(function (t) {
          if (t.getId() != this.getId())
            t.setVisible(false);
        });
    });
  }
  return meteoJS.synview.collection.prototype.append.call(this, type);
};

/**
 * Returns the types of this collection with getVisible() == true.
 * 
 * @return {meteoJS.synview.type[]} Types.
 */
meteoJS.synview.typeCollection.prototype.getVisibleTypes = function () {
  return this.getItems().filter(function (type) { return type.getVisible(); });
};

/**
 * Returns, if at least one type is visible.
 * 
 * @return {boolean}
 */
meteoJS.synview.typeCollection.prototype.isVisible = function () {
  return this.getVisibleTypes().length > 0;
};