/**
 * @module meteoJS/synview/resource/GeoJSONTile
 */
import GeoJSON from 'ol/format/GeoJSON';
import VectorTile from './VectorTile.js';

/**
 * @classdesc Object representing a GeoJSON-Tile-resource.
 */
export class GeoJSONTile extends VectorTile {
  
  constructor(options) {
    super(options);
    
    this.options.ol.source.format = new GeoJSON();
  }
  
}
export default GeoJSONTile;