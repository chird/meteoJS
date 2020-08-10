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
 * Object representing an image.
 * 
 * <pre><code>import Image from 'meteoJS/synview/resource/Image';
import { Image } from 'meteoJS/synview/resource/Image';
import { ImageStatic } from 'meteoJS/synview/resource/Image';</code></pre>
 * 
 * @extends  module:meteoJS/synview/resource.Resource
 */
export class ImageStatic extends Resource {
  
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
   * @inheritdoc
   * @return {external:ol/layer/Image~ImageLayer} Openlayers layer.
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
   * @inheritdoc
   * @return {external:L.imageOverlay} Leaflet layer.
   */
  makeLLLayer() {
    return L.imageOverlay(this.options.url, [
      [this.options.extent[1], this.options.extent[0]],
      [this.options.extent[3], this.options.extent[2]]
    ]);
  }
  
  
  /**
   * @inheritdoc
   */
  preload() {
    this.getOLLayer().getSource().image_.load();
  }
}
export { ImageStatic as Image };
export default ImageStatic;