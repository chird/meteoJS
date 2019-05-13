/**
 * @module meteoJS/synview/resource/OSM
 */

/**
 * Object representing a OSM-resource.
 * 
 * @constructor
 * @param {meteoJS/synview/resource~options} options Options.
 */
export class OSM extends Resource {

constructor(options) {
  super(options);
}

/**
 * Returns openlayers layer of this resource.
 * 
 * @augments makeOLLayer
 * @return {ol.layer.Tile} openlayers layer.
 */
makeOLLayer() {
  var sourceOptions = this.options.ol.source;
  sourceOptions.url = this.options.url;
  return new ol.layer.Tile({
    source: new ol.source.OSM(sourceOptions)
  });
}

}