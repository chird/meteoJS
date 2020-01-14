/**
 * @module meteoJS/synview/resource/VectorTile
 */
import VectorTileSource from 'ol/source/VectorTile';
import VectorTileLayer from 'ol/layer/VectorTile';
import Vector from './Vector.js';
import { projwgs84 } from '../map/MapOL.js';

/**
 * @classdesc Object representing a VectorTile-resource.
 * @augments module:meteoJS/synview/resource/Vector~Vector
 */
export class VectorTile extends Vector {
  
  /**
   * Returns openlayers layer of this resource.
   * 
   * @augments makeOLLayer
   * @return {module:ol/layer/VectorTile~VectorTileLayer} Openlayers layer.
   */
  makeOLLayer() {
    let opt = {
      source: this.options.ol.source,
      events: this.options.ol.events,
      style: this.options.ol.style
    };
    // source not an ol/source/Source~Source object (via duck typing)
    if (!('refresh' in opt.source)) {
      let sourceOptions = opt.source;
      if (!('tileUrlFunction' in sourceOptions) &&
          this.options.url !== undefined &&
          'format' in sourceOptions &&
          sourceOptions.format !== undefined)
        sourceOptions.url = this.options.url;
      if (!('projection' in sourceOptions) ||
          sourceOptions.projection === undefined)
        sourceOptions.projection = projwgs84;
      opt.source = new VectorTileSource(sourceOptions);
    }
    if (typeof opt.style === 'function')
      opt.style = opt.style.bind(this);
    if (this.className)
      opt.className = this.className;
    return new VectorTileLayer(opt);
  }
  
}
export default VectorTile;