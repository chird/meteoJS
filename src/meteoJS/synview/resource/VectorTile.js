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
export class VectorTile extends Vector {

constructor(options) {
  super(options);
}

/**
 * Returns openlayers layer of this resource.
 * 
 * @augments makeOLLayer
 * @return {ol.layer.VectorTile} Openlayers layer.
 */
makeOLLayer() {
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
}

}