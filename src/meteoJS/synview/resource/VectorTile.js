/**
 * @module meteoJS/synview/resource/VectorTile
 */

/**
 * Object representing a VectorTile-resource.
 * 
 * @constructor
 * @augments meteoJS/synview/resource/Vector
 * @param {meteoJS/synview/resource~options} options Options.
 */
meteoJS.synview.resource.VectorTile = function (options) {
  meteoJS.synview.resource.Vector.call(this, options);
};
meteoJS.synview.resource.VectorTile.prototype = Object.create(meteoJS.synview.resource.Vector.prototype);
meteoJS.synview.resource.VectorTile.prototype.constructor = meteoJS.synview.resource.VectorTile;

/**
 * Returns openlayers layer of this resource.
 * 
 * @augments makeOLLayer
 * @return {ol.layer.VectorTile} Openlayers layer.
 */
meteoJS.synview.resource.VectorTile.prototype.makeOLLayer = function () {
  var opt = $.extend(true, {}, this.options.ol);
  // source not an ol/source/Source~Source object (via duck typing)
  if (!('source' in opt &&
        'refresh' in opt.source)) {
    var sourceOptions = $.extend(true, {}, ('source' in opt) ? opt.source : {});
    if (!('tileUrlFunction' in sourceOptions) &&
        this.options.url !== undefined &&
        'format' in sourceOptions &&
        sourceOptions.format !== undefined)
      sourceOptions.url = this.options.url;
    if (!('projection' in sourceOptions) ||
        sourceOptions.projection === undefined)
      sourceOptions.projection = meteoJS.synview.map.ol.projwgs84;
    opt.source = new ol.source.VectorTile(sourceOptions);
  }
  if ('style' in opt &&
      typeof opt.style === 'function')
    opt.style = opt.style.bind(this);
  return new ol.layer.VectorTile(opt);
};