/**
 * @module meteoJS/synview/resource/VectorTile
 */

import $ from 'jquery';
import VectorTileSource from 'ol/source/VectorTile';
import VectorTileLayer from 'ol/layer/VectorTile';
import Vector from './Vector.js';
import { projwgs84 } from '../map/MapOL.js';

/**
 * Object representing a VectorTile-resource.
 * 
 * @constructor
 * @augments meteoJS/synview/resource/Vector
 * @param {meteoJS/synview/resource~options} options Options.
 */
export default class VectorTile extends Vector {

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
      sourceOptions.projection = projwgs84;
    opt.source = new VectorTileSource(sourceOptions);
  }
  if ('style' in opt &&
      typeof opt.style === 'function')
    opt.style = opt.style.bind(this);
  return new VectorTileLayer(opt);
}

}