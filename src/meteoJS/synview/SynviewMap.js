/**
 * @module meteoJS/synview/map
 */
import $ from 'jquery';
import addEventFunctions from '../Events.js';

/** 
 * Event object.
 * 
 * @typedef {Object} module:meteoJS/synview/map~extendedEvent
 * @param {module:meteoJS/synview/type.Type} type Type belonging to the event.
 * @param {Object} layer Layer belonging to the event.
 * @param {Object} feature Vector feature, if present.
 * @param {Mixed[]} color Color of pixel (rgba), if present.
 */

/**
 * Options for meteoJS/synview/map.
 * 
 * @typedef {Object} module:meteoJS/synview/map~options
 * @param {mixed} map Map object.
 * @param {mixed} layerGroup Layer group within synview will operate.
 */

/**
 * Triggered on view changes.
 * 
 * @event module:meteoJS/synview/map#change:view
 */

/**
 * Triggered on pointer moves over map.
 * 
 * @event module:meteoJS/synview/map#move:pointer
 */

/**
 * Triggered on pointer clicks into the map, with no dragging. A double click
 * will fire two events.
 * 
 * @event module:meteoJS/synview/map#click:pointer
 */

/**
 * Triggered on pointer clicks into the map, with no dragging and no double
 * click.
 * 
 * @event module:meteoJS/synview/map#singleclick:pointer
 */

/**
 * Triggered on pointer double clicks into the map, with no dragging.
 * 
 * @event module:meteoJS/synview/map#dblclick:pointer
 */

/**
 * Triggered on pointer dragging.
 * 
 * @event module:meteoJS/synview/map#drag:pointer
 */

/**
 * Abstract class to defined interface to the mapping library.
 * 
 * @abstract
 * @fires module:meteoJS/synview/map#change:view
 */
export class SynviewMap {
  
  /**
   * @param {module:meteoJS/synview/map~options} options Options.
   */
  constructor(options) {
    /**
     * @member {meteoJS/synview/map~options}
     * @private
     */
    this.options = $.extend(true, {
      map: undefined,
      layerGroup: undefined
    }, options);
  }
  
  /**
   * Returns map object.
   * 
   * @return {mixed} Map object.
   */
  getMap() {
    return this.options.map;
  }
  
  /**
   * Helper function. Returns the view center in WGS84 coordinates, lat/lon.
   * 
   * @abstract
   * @return {number[]|undefined} Center.
   */
  getViewCenter() {}
  
  /**
   * Helper function. Sets the view center in WGS84 coordinates, lat/lon.
   * 
   * @abstract
   * @param {number[]|undefined} center Center.
   * @return {module:meteoJS/synview/map.SynviewMap} This.
   */
  setViewCenter() {
    return this;
  }
  
  /**
   * Helper function. Returns the view zoom level.
   * 
   * @abstract
   * @return {number|undefined} Zoom level.
   */
  getViewZoom() {}
  
  /**
   * Helper function. Sets the view zoom level.
   * 
   * @abstract
   * @param {number|undefined} zoom Zoom level.
   * @return {module:meteoJS/synview/map.SynviewMap} This.
   */
  setViewZoom() {
    return this;
  }
  
  /**
   * Returns a new layer group, already added to the map.
   * 
   * @abstract
   * @return {mixed} New layer group.
   */
  makeLayerGroup() {}
  
  /**
   * Returns an event object, that is extended by several keys.
   * Synview internal method.
   * 
   * @abstract
   * @param {object} event Map event object.
   * @param {module:meteoJS/synview/typeCollection.TypeCollection} collection Type collection.
   * @return {module:meteoJS/synview/map~extendedEvent} Event object.
   */
  getExtendedEventByTypeCollection(event) {
    event.synviewType = undefined;
    event.layer = undefined;
    event.feature = undefined;
    event.color = undefined;
    return event;
  }
  
  /**
   * Returns index of the passed layer inside the layer group of the passed type.
   * Synview internal method.
   * 
   * @abstract
   * @param {object} layer Layer object.
   * @param {module:meteoJS/synview/type.Type} type Type.
   * @return {integer} Index.
   */
  findLayerInType() {
    return -1;
  }
  
}
addEventFunctions(SynviewMap.prototype);
export default SynviewMap;