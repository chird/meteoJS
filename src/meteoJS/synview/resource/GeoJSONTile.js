/**
 * @module meteoJS/synview/resource/GeoJSONTile
 */

import GeoJSON from 'ol/format/GeoJSON';
import VectorTile from './VectorTile.js';

/**
 * Object representing a GeoJSON-Tile-resource.
 * 
 * @constructor
 * @param {meteoJS/synview/resource~options} options Options.
 */
export class GeoJSONTile extends VectorTile {

constructor(options) {
  super(options);
  
  this.options.ol.source.format = new GeoJSON();
}

}