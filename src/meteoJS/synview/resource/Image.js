/**
 * @module meteoJS/synview/resource/Image
 */

import Static from 'ol/source/ImageStatic';
import ImageLayer from 'ol/layer/Image';
import { Leaflet as L } from 'leaflet';
import Resource from '../Resource.js';
import { projmerc, projwgs84 } from '../map/MapOL.js';

/**
 * Options for meteoJS/synview/resource/Image.
 * 
 * @typedef {Object} meteoJS/synview/resource/Image~options
 * @augments meteoJS/synview/resource
 * @param {number[]} extent Extent.
 */

/**
 * Object representing an image.
 * 
 * @constructor
 * @param {meteoJS/synview/resource/Image~options} options Options.
 */
export default class Image extends Resource {

/**
 * Returns openlayers layer of this resource.
 * 
 * @augments makeOLLayer
 * @return {ol.layer.Image} openlayers layer.
 */
makeOLLayer() {
  var sourceOptions = this.options.ol.source;
  sourceOptions.url = this.options.url;
  sourceOptions.imageExtent =
    ol.proj.transformExtent(this.options.extent,
                            projwgs84,
                            projmerc);
  return new ImageLayer({
    source: new Static(sourceOptions)
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