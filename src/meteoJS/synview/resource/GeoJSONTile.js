/**
 * @module meteoJS/synview/resource/GeoJSONTile
 */

/**
 * Object representing a GeoJSON-Tile-resource.
 * 
 * @constructor
 * @param {meteoJS/synview/resource~options} options Options.
 */
export class GeoJSONTile extends VectorTile {

constructor(options) {
  super(options);
  
  this.options.ol.source.format = new ol.format.GeoJSON();
}

}