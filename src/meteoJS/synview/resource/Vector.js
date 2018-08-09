/**
 * @module meteoJS/synview/resource/Vector
 */

/**
 * Object representing a Vector-resource.
 * 
 * @constructor
 * @param {meteoJS/synview/resource~options} options Options.
 */
meteoJS.synview.resource.Vector = function (options) {
  meteoJS.synview.resource.call(this, options);
};
meteoJS.synview.resource.Vector.prototype = Object.create(meteoJS.synview.resource.prototype);
meteoJS.synview.resource.Vector.prototype.constructor = meteoJS.synview.resource.Vector;

/**
 * @override
 */
meteoJS.synview.resource.Vector.prototype.getId = function () {
  var d = this.getDatetime();
  return isNaN(d) ? '' : d.toISOString();
};

/**
 * Returns openlayers layer of this resource.
 * 
 * @augments makeOLLayer
 * @return {ol.layer.Vector} Openlayers layer.
 */
meteoJS.synview.resource.Vector.prototype.makeOLLayer = function () {
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
  return new ol.layer.Vector(opt);
};