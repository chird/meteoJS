/**
 * @module meteoJS/synview/resource/OSM
 */

/**
 * Object representing a OSM-resource.
 * 
 * @constructor
 * @param {meteoJS/synview/resource~options} options Options.
 */
meteoJS.synview.resource.OSM = function (options) {
  meteoJS.synview.resource.call(this, options);
};
meteoJS.synview.resource.OSM.prototype = Object.create(meteoJS.synview.resource.prototype);
meteoJS.synview.resource.OSM.prototype.constructor = meteoJS.synview.resource.OSM;

/**
 * Returns layer for openlayers of this resource.
 * 
 * @return {ol.layer.Tile} openlayers layer.
 * @override
 */
meteoJS.synview.resource.OSM.prototype.getOLLayer = function () {
  var sourceOptions = this.options.ol.source;
  sourceOptions.url = this.options.url;
  return new ol.layer.Tile({
    source: new ol.source.OSM(sourceOptions)
  });
};