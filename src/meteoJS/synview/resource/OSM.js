/**
 * @module meteoJS/synview/resource/OSM
 */
import OSMSource from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import Resource from '../Resource.js';

/**
 * Object representing a OSM-resource.
 * 
 * @extends  module:meteoJS/synview/resource.Resource
 */
export class OSM extends Resource {
  
  /**
   * Returns openlayers layer of this resource.
   * 
   * @inheritdoc
   * @return {external:ol/layer/Tile~TileLayer} Openlayers layer.
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