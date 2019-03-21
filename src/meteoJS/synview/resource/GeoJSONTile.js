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
  meteoJS.synview.resource.VectorTile.call(this, options);
  
  this.options.ol.source.format = new ol.format.GeoJSON();
};
meteoJS.synview.resource.GeoJSONTile.prototype = Object.create(meteoJS.synview.resource.VectorTile.prototype);
meteoJS.synview.resource.GeoJSONTile.prototype.constructor = meteoJS.synview.resource.GeoJSONTile;