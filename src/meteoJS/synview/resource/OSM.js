/**
 * @module meteoJS/synview/resource/OSM
 */

import { OSM as OSMSource } from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import Resource from '../Resource.js';

/**
 * Object representing a OSM-resource.
 * 
 * @constructor
 * @param {meteoJS/synview/resource~options} options Options.
 */
export default class OSM extends Resource {

/**
 * Returns openlayers layer of this resource.
 * 
 * @augments makeOLLayer
 * @return {ol.layer.Tile} openlayers layer.
 */
makeOLLayer() {
  var sourceOptions = this.options.ol.source;
  sourceOptions.url = this.options.url;
  return new TileLayer({
    source: new OSMSource(sourceOptions)
  });
}

}