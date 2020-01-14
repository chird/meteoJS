/**
 * @module meteoJS/synview/resource/OSM
 */
import OSMSource from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import Resource from '../Resource.js';

/**
 * @classdesc Object representing a OSM-resource.
 */
export class OSM extends Resource {
  
  /**
   * Returns openlayers layer of this resource.
   * 
   * @augments makeOLLayer
   * @return {module:ol/layer/Tile~TileLayer} Openlayers layer.
   */
  makeOLLayer() {
    let sourceOptions = this.options.ol.source;
    sourceOptions.url = this.options.url;
    return new TileLayer({
      source: new OSMSource(sourceOptions)
    });
  }
  
}
export default OSM;