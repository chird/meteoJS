/**
 * @module meteoJS/synview/resource/GeoImage
 */

/**
 * Options for meteoJS/synview/resource/GeoImage.
 * 
 * @typedef {Object} meteoJS/synview/resource/GeoImage~options
 * @augments meteoJS/synview/resource
 * @param {number[]} extent Extent.
 */

/**
 * Object representing an image.
 * 
 * @constructor
 * @param {meteoJS/synview/resource~options} options Options.
 */
meteoJS.synview.resource.GeoImage = function (options) {
  meteoJS.synview.resource.call(this, options);
};
meteoJS.synview.resource.GeoImage.prototype = Object.create(meteoJS.synview.resource.prototype);
meteoJS.synview.resource.GeoImage.prototype.constructor = meteoJS.synview.resource.GeoImage;

/**
 * Returns layer for openlayers of this resource.
 * 
 * @return {ol.layer.Image} openlayers layer.
 * @override
 */
meteoJS.synview.resource.GeoImage.prototype.getOLLayer = function () {
  var sourceOptions = this.options.ol.source;
  sourceOptions.url = this.options.url;
  sourceOptions.imageExtent =
    ol.proj.transformExtent(this.options.extent,
                            srfJS.synview.Core.OL.projwgs84,
                            srfJS.synview.Core.OL.projmerc);
  return new ol.layer.Image({
    source: new ol.source.ImageStatic(sourceOptions)
  });
};