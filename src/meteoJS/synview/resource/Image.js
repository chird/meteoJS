/**
 * @module meteoJS/synview/resource/Image
 */
import Static from 'ol/source/ImageStatic';
import ImageLayer from 'ol/layer/Image';
import { transformExtent } from 'ol/proj';
import Resource from '../Resource.js';
import { projmerc, projwgs84 } from '../map/MapOL.js';

/**
 * Options for module:meteoJS/synview/resource/Image~Image.
 * 
 * @typedef {module:meteoJS/synview/resource~options}
 *   module:meteoJS/synview/resource/Image~options
 * @param {number[]} extent - Extent.
 */

/**
 * @classdesc Object representing an image.
 */
export class Image extends Resource {
  
  /**
   * @param {module:meteoJS/synview/resource/Image~options} options - Options.
   */
  constructor({
    url = undefined,
    datetime = undefined,
    mimetype = undefined,
    reloadTime = undefined,
    className = undefined,
    extent,
    ol = {}
  } = {}) {
    super({
      url,
      datetime,
      mimetype,
      reloadTime,
      className,
      ol
    });
    
    this.options.extent = extent;
  }
  
  /**
   * Returns openlayers layer of this resource.
   * 
   * @augments makeOLLayer
   * @return {module:ol/layer/Image~ImageLayer} Openlayers layer.
   */
  makeOLLayer() {
    let sourceOptions = this.options.ol.source;
    sourceOptions.url = this.options.url;
    sourceOptions.imageExtent =
      transformExtent(this.options.extent,
                      projwgs84,
                      projmerc);
    return new ImageLayer({
      source: new Static(sourceOptions),
      className: this.className
    });
  }
  
  /**
   * Returns Leaflet layer of this resource.
   * 
   * @augments makeLLLayer
   * @return {L.imageOverlay} Leaflet layer.
   */
  makeLLLayer() {
    return L.imageOverlay(this.options.url, [
      [this.options.extent[1], this.options.extent[0]],
      [this.options.extent[3], this.options.extent[2]]
    ]);
  }
  
}
export default Image;