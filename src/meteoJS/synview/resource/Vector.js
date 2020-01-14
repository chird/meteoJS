/**
 * @module meteoJS/synview/resource/Vector
 */
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Resource from '../Resource.js';
import { projwgs84 } from '../map/MapOL.js';

/**
 * @classdesc Object representing a Vector-resource.
 * @augments module:meteoJS/synview/resource~Resource
 */
export class Vector extends Resource {
  
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
    let opt = {
      source: this.options.ol.source,
      events: this.options.ol.events,
      style: this.options.ol.style
    };
    this.options.ol;
    // source not an ol/source/Source~Source object (via duck typing)
    if (!('refresh' in opt.source)) {
      let sourceOptions = opt.source;
      if (this.options.url !== undefined &&
          'format' in sourceOptions &&
          sourceOptions.format !== undefined)
        sourceOptions.url = this.options.url;
      if (!('projection' in sourceOptions) ||
          sourceOptions.projection === undefined)
        sourceOptions.projection = projwgs84;
      opt.source = new VectorSource(sourceOptions);
    }
    if (typeof opt.style === 'function')
      opt.style = opt.style.bind(this);
    if (this.className)
      opt.className = this.className;
    return new VectorLayer(opt);
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
export default Vector;