/**
 * @module meteoJS/synview/map
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
   * @member {meteoJS/synview~options}
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