/**
 * @module meteoJS/synview/map/ll
 */

/**
 * Object to "communicate" with Leaflet.
 * 
 * @constructor
 * @param {meteoJS/synview/map~options} options Options.
 * @requires openlayers
 */
meteoJS.synview.map.ll = function (options) {
  meteoJS.synview.map.call(this, options);
  
  // Normalize options
  if (this.options.layerGroup === undefined)
    this.options.layerGroup = L.layerGroup().addTo(this.options.map);
};
meteoJS.synview.map.ll.prototype = Object.create(meteoJS.synview.map.prototype);
meteoJS.synview.map.ll.prototype.constructor = meteoJS.synview.map.ll;

/**
 * Returns a new layer group, already added to the map.
 * 
 * @augments makeLayerGroup
 * @return {L.layerGroup} New layer group.
 */
meteoJS.synview.map.ll.prototype.makeLayerGroup = function () {
  return L.layerGroup().addTo(this.options.layerGroup);
};