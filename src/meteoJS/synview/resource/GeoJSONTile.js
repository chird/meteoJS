/**
 * @module meteoJS/synview/resource/GeoJSONTile
 */
import GeoJSON from 'ol/format/GeoJSON';
import VectorTile from './VectorTile.js';

/**
 * Object representing a GeoJSON-Tile-resource.
 * 
 * @extends module:meteoJS/synview/resource/VectorTile.VectorTile
 */
export class GeoJSONTile extends VectorTile {
  
  constructor(options) {
    super(options);
    
    this.options.ol.source.format = new GeoJSON();
  }
  
}
export default GeoJSONTile;