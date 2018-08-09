/**
 * @module meteoJS/synview/resource/GeoJSONTile
 */

/**
 * Object representing a GeoJSON-Tile-resource.
 * 
 * @constructor
 * @param {meteoJS/synview/resource~options} options Options.
 */
meteoJS.synview.resource.GeoJSONTile = function (options) {
  meteoJS.synview.resource.call(this, options);
};
meteoJS.synview.resource.GeoJSONTile.prototype = Object.create(meteoJS.synview.resource.prototype);
meteoJS.synview.resource.GeoJSONTile.prototype.constructor = meteoJS.synview.resource.GeoJSONTile;

/**
 * Returns openlayers layer of this resource.
 * 
 * @augments makeOLLayer
 * @return {ol.layer.VectorTile} openlayers layer.
 */
meteoJS.synview.resource.GeoJSONTile.prototype.makeOLLayer = function () {
  var sourceOptions = this.options.ol.source;
  sourceOptions.url = this.options.url;
  sourceOptions.projection = meteoJS.synview.map.ol.projwgs84;
  sourceOptions.format = new ol.format.GeoJSON({
    featureProjection: meteoJS.synview.map.ol.projwgs84
  });
  return new ol.layer.VectorTile({
    source: new ol.source.VectorTile(sourceOptions)
  });
};