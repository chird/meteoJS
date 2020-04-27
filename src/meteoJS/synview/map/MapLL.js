/**
 * @module meteoJS/synview/map/ll
 */
import SynviewMap from '../SynviewMap.js';

/**
 * Object to "communicate" with Leaflet.
 * 
 * @extends module:meteoJS/synview/map.SynviewMap
 */
export class MapLL extends SynviewMap {
  
  constructor(options) {
    super (options);
    
    // Normalize options
    if (this.options.layerGroup === undefined)
      this.options.layerGroup = L.layerGroup().addTo(this.options.map);
  }
  
  /**
   * Returns a new layer group, already added to the map.
   * 
   * @inheritdoc
   * @return {L.layerGroup} New layer group.
   */
  makeLayerGroup() {
    return L.layerGroup().addTo(this.options.layerGroup);
  }
  
}
export default MapLL;