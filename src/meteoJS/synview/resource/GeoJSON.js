/**
 * @module meteoJS/synview/resource/GeoJSON
 */

/**
 * Object representing a GeoJSON-resource.
 * 
 * @constructor
 * @augments meteoJS/synview/resource/Vector
 * @param {meteoJS/synview/resource~options} options Options.
 */
export class GeoJSON extends Vector {

constructor(options) {
  super(options);
  
  this.options.ol.source.url = this.options.url;
  this.options.ol.source.format = new ol.format.GeoJSON();
}

}