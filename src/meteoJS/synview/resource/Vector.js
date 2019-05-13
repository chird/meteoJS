/**
 * @module meteoJS/synview/resource/Vector
 */

/**
 * Object representing a Vector-resource.
 * 
 * @constructor
 * @param {meteoJS/synview/resource~options} options Options.
 */
export class Vector extends Resource {

constructor(options) {
  super(options);
}

/**
 * @override
 */
getId() {
  var d = this.getDatetime();
  return isNaN(d) ? '' : d.toISOString();
}

/**
 * Returns openlayers layer of this resource.
 * 
 * @augments makeOLLayer
 * @return {ol.layer.Vector} Openlayers layer.
 */
makeOLLayer() {
  var opt = $.extend(true, {}, this.options.ol);
  // source not an ol/source/Source~Source object (via duck typing)
  if (!('source' in opt &&
        'refresh' in opt.source)) {
    var sourceOptions = $.extend(true, {}, ('source' in opt) ? opt.source : {});
    if (this.options.url !== undefined &&
        'format' in sourceOptions &&
        sourceOptions.format !== undefined)
      sourceOptions.url = this.options.url;
    if (!('projection' in sourceOptions) ||
        sourceOptions.projection === undefined)
      sourceOptions.projection = meteoJS.synview.map.ol.projwgs84;
    opt.source = new ol.source.Vector(sourceOptions);
  }
  if ('style' in opt &&
      typeof opt.style === 'function')
    opt.style = opt.style.bind(this);
  return new ol.layer.Vector(opt);
}

/**
 * Sets style of the OpenLayers vector layer.
 * If argument 'style' is omitted, the style will be updated.
 * 
 * @param {ol/style/Style~Style} [style] OpenLayers style.
 * @returns {meteoJS/synview/resource} This.
 */
setOLStyle(style) {
  if (this.layer === undefined)
    this.getOLLayer();
  if (this.layer === undefined ||
      !('setStyle' in this.layer))
    return this;
  if (arguments.length == 0)
    this.layer.setStyle(this.layer.getStyle());
  else
    this.layer.setStyle(style);
  return this;
}

}