/**
 * @module meteoJS/synview/resource/GeoJSON
 */
import GeoJSONFormat from 'ol/format/GeoJSON';
import Vector from './Vector.js';

/**
 * Object representing a GeoJSON-resource.
 * 
 * @extends module:meteoJS/synview/resource/Vector.Vector
 */
export class GeoJSON extends Vector {
  
  constructor(options) {
    super(options);
    
    this.options.ol.source.url = this.options.url;
    this.options.ol.source.format = new GeoJSONFormat();
  }
  
}
export default GeoJSON;