/**
 * @module meteoJS/synview/map/ll
 */

import SynviewMap from '../SynviewMap.js';

/**
 * Object to "communicate" with Leaflet.
 * 
 * @constructor
 * @param {meteoJS/synview/map~options} options Options.
 * @requires openlayers
 */
export default class MapLL extends SynviewMap {

constructor(options) {
  super (options);
  
  // Normalize options
  if (this.options.layerGroup === undefined)
    this.options.layerGroup = L.layerGroup().addTo(this.options.map);
}

/**
 * Returns a new layer group, already added to the map.
 * 
 * @augments makeLayerGroup
 * @return {L.layerGroup} New layer group.
 */
makeLayerGroup() {
  return L.layerGroup().addTo(this.options.layerGroup);
}

}