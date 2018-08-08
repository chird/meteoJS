/**
 * @module meteoJS/synview/map
 */

/** 
 * Event object.
 * 
 * @typedef {Object} meteoJS.synview.map~extendedEvent
 * @param {meteoJS/synview/type} type Type belonging to the event.
 * @param {Object} layer Layer belonging to the event.
 * @param {Object} feature Vector feature, if present.
 * @param {Mixed[]} color Color of pixel (rgba), if present.
 */

/**
 * Options for meteoJS/synview/map.
 * 
 * @typedef {Object} meteoJS/synview/map~options
 * @param {mixed} map Map object.
 * @param {mixed} layerGroup Layer group within synview will operate.
 */

/**
 * Triggered on view changes.
 * 
 * @event meteoJS.synview.map#change:view
 */

/**
 * Triggered on pointer moves.
 * 
 * @event meteoJS.synview.map#move:pointer
 */

/**
 * Abstract class to defined interface to the mapping library.
 * 
 * @constructor
 * @abstract
 * @param {meteoJS/synview/map~options} options Options.
 * @fires meteoJS.synview.map#change:view
 */
meteoJS.synview.map = function (options) {
  /**
   * Options.
   * @member {meteoJS/synview/map~options}
   */
  this.options = $.extend(true, {
    map: undefined,
    layerGroup: undefined
  }, options);
};
meteoJS.events.addEventFunctions(meteoJS.synview.map.prototype);

/**
 * Returns map object.
 * 
 * @return {mixed} Map object.
 */
meteoJS.synview.map.prototype.getMap = function () {
  return this.options.map;
};

/**
 * Helper function. Returns the view center in WGS84 coordinates, lat/lon.
 * 
 * @abstract
 * @return {number[]|undefined} Center.
 */
meteoJS.synview.map.prototype.getViewCenter = function () {};

/**
 * Helper function. Sets the view center in WGS84 coordinates, lat/lon.
 * 
 * @abstract
 * @param {number[]|undefined} center Center.
 * @return {meteoJS.synview.map} This.
 */
meteoJS.synview.map.prototype.setViewCenter = function (center) {
  return this;
};

/**
 * Helper function. Returns the view zoom level.
 * 
 * @abstract
 * @return {number|undefined} Zoom level.
 */
meteoJS.synview.map.prototype.getViewZoom = function () {};

/**
 * Helper function. Sets the view zoom level.
 * 
 * @abstract
 * @param {number|undefined} zoom Zoom level.
 * @return {meteoJS.synview.map} This.
 */
meteoJS.synview.map.prototype.setViewZoom = function (zoom) {
  return this;
};

/**
 * Returns a new layer group, already added to the map.
 * 
 * @abstract
 * @return {mixed} New layer group.
 */
meteoJS.synview.map.prototype.makeLayerGroup = function () {};

/**
 * Turns image smoothing on/off.
 * 
 * @abstract
 * @param {boolean} imageSmoothing
 *   True to turn image smoothing on, false otherwise.
 * @return {meteoJS.synview.map} This.
 */
meteoJS.synview.map.prototype.setImageSmoothing = function (imageSmoothing) {
  return this;
};

/**
 * Returns an event object, that is extended by several keys.
 * Synview internal method.
 * 
 * @abstract
 * @param {object} event Map event object.
 * @param {meteoJS/synview/typeCollection} collection Type collection.
 * @return {meteoJS.synview.map~extendedEvent} Event object.
 */
meteoJS.synview.map.prototype.getExtendedEventByTypeCollection = function (event, collection) {
  event.type = undefined;
  event.layer = undefined;
  event.feature = undefined;
  event.color = undefined;
  return event;
};

/**
 * Returns index of the passed layer inside the layer group of the passed type.
 * Synview internal method.
 * 
 * @abstract
 * @param {object} layer Layer object.
 * @param {meteoJS/synview/type} type Type.
 * @return {integer} Index.
 */
meteoJS.synview.map.prototype.findLayerInType = function (layer, type) {
  return -1;
};