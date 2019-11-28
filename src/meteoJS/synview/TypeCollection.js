/**
 * @module meteoJS/synview/typeCollection
 */

import $ from 'jquery';
import Collection from './Collection.js';
import Type from './Type.js';

/**
 * Options for meteoJS/synview/typeCollection.
 * 
 * @typedef {Object} meteoJS/synview/typeCollection~options
 * @param {boolean} [exclusiveVisibility]
 *   At the same time, only one single type is visible.
 * @param {boolean} [syncVisibility]
 *   If the visibility of a type changes, all other types are also adjusted.
 *   If exclusiveVisibility is set to true, this will be ignored.
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
export default class TypeCollection extends Collection {

constructor(options) {
  super();
  
  /**
   * Options.
   * @member {meteoJS/synview~options}
   */
  this.options = $.extend(true, {
    exclusiveVisibility: false,
    syncVisibility: false
  }, options);
}

/**
 * Returns type with the passed ID or empty type if not existant.
 * 
 * @augment getItemById
 * @param {mixed} id ID.
 * @return {meteoJS.synview.type} Type.
 */
getItemById(id) {
  var item = super.getItemById(id);
  return (item === undefined) ? new Type() : this.items[id];
}

/**
 * Append type to this collection. If type with same ID is present, the type
 * will be exchanged.
 * 
 * @augment append
 * @param {meteoJS.synview.type} type Type.
 * @return {meteoJS.synview.typeCollection} This.
 */
append(type) {
  var that = this;
  if (this.options.exclusiveVisibility &&
      type.getVisible() &&
      this.isVisible()) {
    type.setVisible(false);
  }
  else if (that.options.syncVisibility) {
    if (type.getVisible()) {
      if (!this.isVisible())
        this.getItems().forEach(function (t) {
          t.setVisible(true);
        }, this);
    }
    else {
      if (this.isVisible())
        type.setVisible(true);
    }
  }
  type.on('change:visible', function () {
    if (that.options.exclusiveVisibility) {
      if (this.getVisible())
        that.getItems().forEach(function (t) {
          if (t.getId() != this.getId())
            t.setVisible(false);
        }, this);
    }
    else if (that.options.syncVisibility) {
      that.getItems().forEach(function (t) {
        if (t.getId() != this.getId())
          t.setVisible(this.getVisible());
      }, this);
    }
  });
  return super.append(type);
}

/**
 * Returns the types of this collection with getVisible() == true.
 * 
 * @return {meteoJS.synview.type[]} Types.
 */
getVisibleTypes() {
  return this.getItems().filter(function (type) { return type.getVisible(); });
}

/**
 * Returns, if at least one type is visible.
 * 
 * @return {boolean}
 */
isVisible() {
  return this.getVisibleTypes().length > 0;
}

/**
 * Sets the option exclusiveVisibility.
 * If several types are visible and this will be set to true, then the first
 * type in the getItems() iterator will stay visible.
 * 
 * @return {meteoJS.synview.typeCollection} This.
 */
setExclusiveVisibility(exclusiveVisibility) {
  if (this.options.exclusiveVisibility != exclusiveVisibility &&
      exclusiveVisibility) {
    var isVisibleType = false;
    this.getItems().forEach(function (t) {
      if (!isVisibleType)
        isVisibleType = t.getVisible();
      else
        t.setVisible(false);
    }, this);
  }
  this.options.exclusiveVisibility = exclusiveVisibility;
  return this;
}

/**
 * Sets the option syncVisibility.
 * If any type is visible and this will be set to true, then every type will
 * be set visible.
 * 
 * @return {meteoJS.synview.typeCollection} This.
 */
setSyncVisibility(syncVisibility) {
  if (this.options.syncVisibility != syncVisibility &&
      syncVisibility &&
      this.isVisible()) {
    this.getItems().forEach(function (t) {
      t.setVisible(true);
    }, this);
  }
  this.options.syncVisibility = syncVisibility;
  return this;
}

}