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
 * @param {ol.layer.Layer} ol.layer Layer for openlayers.
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
      source: undefined
    }
  }, options);
};
/* Events-Methoden auf das Objekt draufsetzen */
meteoJS.events.addEventFunctions(meteoJS.synview.resource.prototype);

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
  return new ol.layer.Layer();
};