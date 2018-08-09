/**
 * @module meteoJS/synview/resource
 */

/**
 * Options for meteoJS/synview/resource.
 * 
 * @typedef {Object} meteoJS/synview/resource~options
 * @param {undefined|string} url URL to resource.
 * @param {undefined|Date} datetime
 *   Datetime for this resource, undefined if resource have no datetime.
 * @param {undefined|string} mimetype MIME-Type of the resource.
 * @param {Object} ol Options for openlayers.
 * @param {Object} ol.source Options for openlayers source object.
 */

/**
 * Object representing a resource.
 * 
 * @constructor
 * @param {meteoJS/synview/resource~options} options Options.
 */
meteoJS.synview.resource = function (options) {
  /**
   * Options.
   * @member {meteoJS/synview/resource~options}
   */
  this.options = $.extend(true, {
    url: undefined,
    datetime: undefined,
    mimetype: undefined,
    ol: {
      source: undefined,
      events: undefined
    }
  }, options);
  // Normalize
  this.options.ol.source =
    (this.options.ol.source === undefined) ? {} : this.options.ol.source;
  
  /** @type {ol.layer.Layer|undefined} */
  this.layer = undefined;
};
/* Events-Methoden auf das Objekt draufsetzen */
meteoJS.events.addEventFunctions(meteoJS.synview.resource.prototype);

/**
 * Returns an ID for this resource. Should change, if content of resource
 * changes.
 * 
 * @return {mixed} Id.
 */
meteoJS.synview.resource.prototype.getId = function () {
  return this.getUrl();
};

/**
 * Returns URL to the resource. Undefined if unknown.
 * 
 * @return {string|undefined} URL.
 */
meteoJS.synview.resource.prototype.getUrl = function () {
  return this.options.url;
};

/**
 * Returns the datetime of the resource.
 * 
 * @return {Date|undefined} Date.
 */
meteoJS.synview.resource.prototype.getDatetime = function () {
  return this.options.datetime;
};

/**
 * Returns MIME-Type of the resource.
 * 
 * @return {string} MIME-Type.
 */
meteoJS.synview.resource.prototype.getMIMEType = function () {
  return (this.options.mimetype === undefined) ?
    'application/octet-stream' : this.options.mimetype;
};

/**
 * Returns layer for openlayers of this resource.
 * 
 * @return {ol.layer.Layer} openlayers layer.
 */
meteoJS.synview.resource.prototype.getOLLayer = function () {
  if (this.layer !== undefined)
    return this.layer;
  var layer = this.makeOLLayer();
  if ('events' in this.options.ol &&
      this.options.ol.events !== undefined)
    ['precompose', 'postcompose', 'render'].forEach(function (eventName) {
      if (eventName in this.options.ol.events &&
          this.options.ol.events[eventName] !== undefined)
        layer.on(eventName, function (event) {
          this.options.ol.events[eventName].call(this, event, layer);
        }, this);
    }, this);
  return layer;
};

/**
 * Returns openlayers layer of this resource. Must be overwritten by child
 * classes.
 * 
 * @protected
 * @return {ol.layer.Layer} openlayers layer.
 */
meteoJS.synview.resource.prototype.makeOLLayer = function () {
  // Dies on instantiation of ol.layer.Layer, so use ol.layer.Vector
  return new ol.layer.Vector();
};

/**
 * Clears internal layer cache. Should be called, if layer and resource isn't
 * used anymore.
 * 
 * @return {meteoJS/synview/resource} This.
 */
meteoJS.synview.resource.prototype.clearLayer = function () {
  this.layer = undefined;
  return this;
};