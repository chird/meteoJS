/**
 * @module meteoJS/synview/map
 */

import $ from 'jquery';
import addEventFunctions from '../Events.js';

/** 
 * Event object.
 * 
 * @typedef {Object} meteoJS.synview.map~extendedEvent
 * @param {meteoJS/synview/type} type Type belonging to the event.
 * @param {Object} layer Layer belonging to the event.
 * @param {Object} feature Vector feature, if present.
 * @param {Mixed[]} color Color of pixel (rgba), if present.
 */

/**
 * Options for meteoJS/synview/map.
 * 
 * @typedef {Object} meteoJS/synview/map~options
 * @param {mixed} map Map object.
 * @param {mixed} layerGroup Layer group within synview will operate.
 */

/**
 * Triggered on view changes.
 * 
 * @event meteoJS.synview.map#change:view
 */

/**
 * Triggered on pointer moves over map.
 * 
 * @event meteoJS.synview.map#move:pointer
 */

/**
 * Triggered on pointer clicks into the map, with no dragging. A double click
 * will fire two events.
 * 
 * @event meteoJS.synview.map#click:pointer
 */

/**
 * Triggered on pointer clicks into the map, with no dragging and no double
 * click.
 * 
 * @event meteoJS.synview.map#singleclick:pointer
 */

/**
 * Triggered on pointer double clicks into the map, with no dragging.
 * 
 * @event meteoJS.synview.map#dblclick:pointer
 */

/**
 * Triggered on pointer dragging.
 * 
 * @event meteoJS.synview.map#drag:pointer
 */

/**
 * Abstract class to defined interface to the mapping library.
 * 
 * @constructor
 * @abstract
 * @param {meteoJS/synview/map~options} options Options.
 * @fires meteoJS.synview.map#change:view
 */
export default class SynviewMap {
  
  constructor(options) {
    /**
     * Options.
     * @member {meteoJS/synview/map~options}
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
   * @return {meteoJS.synview.map} This.
   */
  setViewCenter(center) {
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
   * @return {meteoJS.synview.map} This.
   */
  setViewZoom(zoom) {
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
   * Turns image smoothing on/off.
   * 
   * @abstract
   * @param {boolean} imageSmoothing
   *   True to turn image smoothing on, false otherwise.
   * @return {meteoJS.synview.map} This.
   */
  setImageSmoothing(imageSmoothing) {
    return this;
  }
  
  /**
   * Returns an event object, that is extended by several keys.
   * Synview internal method.
   * 
   * @abstract
   * @param {object} event Map event object.
   * @param {meteoJS/synview/typeCollection} collection Type collection.
   * @return {meteoJS.synview.map~extendedEvent} Event object.
   */
  getExtendedEventByTypeCollection(event, collection) {
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
   * @param {meteoJS/synview/type} type Type.
   * @return {integer} Index.
   */
  findLayerInType(layer, type) {
    return -1;
  }
  
}
addEventFunctions(SynviewMap.prototype);