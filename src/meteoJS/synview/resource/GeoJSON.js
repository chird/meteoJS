/**
 * @module meteoJS/synview/resource/GeoJSON
 */

/**
 * Object representing a GeoJSON-resource.
 * 
 * @constructor
 * @param {meteoJS/synview/resource~options} options Options.
 */
meteoJS.synview.resource.GeoJSON = function (options) {
  meteoJS.synview.resource.call(this, options);
};
meteoJS.synview.resource.GeoJSON.prototype = Object.create(meteoJS.synview.resource.prototype);
meteoJS.synview.resource.GeoJSON.prototype.constructor = meteoJS.synview.resource.GeoJSON;

/**
 * Returns layer for openlayers of this resource.
 * 
 * @return {ol.layer.Vector} openlayers layer.
 * @override
 */
meteoJS.synview.resource.GeoJSON.prototype.getOLLayer = function () {
  var opt = this.options.ol;
  var sourceOptions = this.options.ol.source;
  sourceOptions.url = this.options.url;
  sourceOptions.projection = meteoJS.synview.map.ol.projwgs84;
  sourceOptions.format = new ol.format.GeoJSON();
  opt.source = new ol.source.Vector(sourceOptions);
  return new ol.layer.Vector(opt);
};