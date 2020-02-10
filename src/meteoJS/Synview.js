/**
 * @module meteoJS/synview
 */

import $ from 'jquery';
import SynviewMap from './synview/SynviewMap.js';
import Timeline from './Timeline.js';
import TypeCollection from './synview/TypeCollection.js';
import Tooltip from './synview/Tooltip.js';

/**
 * Options for constructor.
 * 
 * @typedef {Object} module:meteoJS/synview~options
 * @param {module:meteoJS/synview/map.SynviewMap|undefined} [map]
 *   Synview map object.
 * @param {module:meteoJS/timeline.Timeline|undefined} [timeline]
 *   Timeline object.
 * @param {module:meteoJS/tooltip.Tooltip} [tooltip] - Tooltip object.
 */

/**
 * Mapping object to show map data for different timestamps. Create one object
 * per map.
 */
export default class Synview {
  
  /**
   * @param {module:meteoJS/synview~options} options - Options.
   */
  constructor(options) {
    /**
     * @type {module:meteoJS/synview~options}
     * @private
     */
    this.options = $.extend(true, {
      map: undefined,
      timeline: undefined,
      tooltip: undefined
    }, options);
    // Normalize options
    if (this.options.map === undefined)
      this.options.map = new SynviewMap();
    if (this.options.timeline === undefined)
      this.options.timeline = new Timeline();
    
    /**
     * Collection of synview types.
     * @member {module:meteoJS/synview/typecollection.TypeCollection}
     */
    this.typeCollection = new TypeCollection();
    /** @type meteoJS/synview/tooltip~Tooltip|undefined */
    this.tooltip = undefined;
    
    // Timeline initialisieren
    this.options.timeline.on('change:time', function () {
      this.getTypeCollection().getItems().map(function (type) {
        type.setDisplayTime(this.options.timeline.getSelectedTime());
      }, this);
    }, this);
    
    // typeCollection initialisieren
    var timeline = this.options.timeline;
    var updateTimes = function () {
      var isLastTime = timeline.isLastEnabledTime();
      // Zeitpunkte einlesen
      if (this.getVisible())
        timeline.setTimesBySetID(this.getId(), this.getResourceCollection().getTimes());
      else
        timeline.setTimesBySetID(this.getId(), []);
      // Switch to last timestamp, if it was the last one already before.
      if (isLastTime)
        timeline.last();
      else if (isNaN(timeline.getSelectedTime()))
        timeline.first();
    };
    var appendType = function (type) {
      type.setLayerGroup(this.options.map.makeLayerGroup());
      updateTimes.call(type);
      type.setDisplayTime(this.getTimeline().getSelectedTime());
      type.on('change:resources', updateTimes);
      // Zeitpunkte bei visible-Änderungen löschen oder hinzufügen
      type.on('change:visible', updateTimes);
      if (type.getTooltip() !== undefined &&
          this.tooltip === undefined) {
        this.tooltip = new Tooltip({
          map: this.options.map,
          typeCollection: this.typeCollection,
          tooltip: this.options.tooltip
        });
      }
    };
    var removeType = function (type) {
      this.getTimeline().deleteSetID(type.getId());
      // Layer-Group löschen (bzw. aus OL entfernen)
      // Events aus dem Type löschen
    };
    this.typeCollection.on('add:item', appendType, this);
    this.typeCollection.on('remove:item', removeType, this);
    this.typeCollection.on('replace:item', function (type, removedType) {
      appendType.call(this, type);
      removeType.call(this, removedType);
    }, this);
  }
  
  /**
   * Returns timeline object.
   * 
   * @return {meteoJS.timeline} Timeline.
   */
  getTimeline() {
    return this.options.timeline;
  }
  
  /**
   * Returns map object.
   * 
   * @return {meteoJS.synview.map} Map object.
   */
  getMap() {
    return this.options.map;
  }
  
  /**
   * Returns collection object of appended types.
   * 
   * @return {meteoJS.synview.typeCollection} Type collection.
   */
  getTypeCollection() {
    return this.typeCollection;
  }
  
  /**
   * Append a type to this synview. Wrapper for getTypeCollection().append(type),
   * but ensures, that the new type has an id different than undefined.
   * 
   * @param {meteoJS.synview.type} type Type to append.
   * @return {meteoJS.synview} This.
   */
  appendType(type) {
    if (type.getId() === undefined) {
      var prefixId = 'synview-type-';
      var i = 0;
      var newId;
      do {
        newId = prefixId + (i++);
      } while (this.getTypeCollection().containsId(newId));
      type.setId(newId);
    }
    this.getTypeCollection().append(type);
    return this;
  }
  
  /**
   * Returns the tooltip object.
   * 
   * @returns {module:meteoJS/tooltip~Tooltip} - Tooltip object.
   */
  getTooltip() {
    return this.options.tooltip;
  }
  
}