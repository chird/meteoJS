/**
 * @module meteoJS/synview/resource/Image
 */

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
export class Image extends Resource {

constructor(options) {
  super(options);
}

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
                            meteoJS.synview.map.ol.projwgs84,
                            meteoJS.synview.map.ol.projmerc);
  return new ol.layer.Image({
    source: new ol.source.ImageStatic(sourceOptions)
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