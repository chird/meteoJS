/**
 * @module meteoJS/synview/resource/xyz
 */
import XYZSource from 'ol/source/XYZ';
import TileLayer from 'ol/layer/Tile';
import Resource from '../Resource.js';

/**
 * Object representing a XYZ-resource.
 * 
 * @extends  module:meteoJS/synview/resource.Resource
 */
export class XYZ extends Resource {
  
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
      source: new XYZSource(sourceOptions)
    });
  }
  
}
export default XYZ;