/**
 * @module meteoJS/synview/resource/GeoJSON
 */

/**
 * Object representing a GeoJSON-resource.
 * 
 * @constructor
 * @augments meteoJS/synview/resource/Vector
 * @param {meteoJS/synview/resource~options} options Options.
 */
meteoJS.synview.resource.GeoJSON = function (options) {
  meteoJS.synview.resource.Vector.call(this, options);
  
  this.options.ol.source.url = this.options.url;
  this.options.ol.source.format = new ol.format.GeoJSON();
};
meteoJS.synview.resource.GeoJSON.prototype = Object.create(meteoJS.synview.resource.Vector.prototype);
meteoJS.synview.resource.GeoJSON.prototype.constructor = meteoJS.synview.resource.GeoJSON;