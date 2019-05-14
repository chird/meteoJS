/**
 * @module meteoJS/synview
 */

import $ from 'jquery';
import Map from './synview/Map.js';
import Timeline from './Timeline.js';
import TypeCollection from './synview/TypeCollection.js';
import Tooltip from './synview/Tooltip.js';

/**
 * Options for meteoJS/synview.
 * 
 * @typedef {Object} meteoJS/synview~options
 * @param {meteoJS.synview.map|undefined} [map] Synview map object.
 * @param {meteoJS.timeline|undefined} [timeline] Timeline object.
 */

/**
 * Mapping object to show map data for different timestamps. Create one object
 * per map.
 * 
 * @constructor
 * @param {meteoJS/synview~options} options Options.
 * @requires {openlayers}
 * Maybe the code could be written more generic to support also other mapping
 * libraries like leaflet.
 */
export default class Synview {
  
constructor(options) {
  /**
   * Options.
   * @member {meteoJS/synview~options}
   */
  this.options = $.extend(true, {
    map: undefined,
    timeline: undefined,
    tooltipOptions: undefined
  }, options);
  // Normalize options
  if (this.options.map === undefined)
    this.options.map = new Map();
  if (this.options.timeline === undefined)
    this.options.timeline = new Timeline();
  
  /**
   * Collection of synview types.
   * @member {meteoJS.synview.typeCollection}
   */
  this.typeCollection = new TypeCollection();
  /** @type meteoJS/synview/tooltip|undefined */
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
        tooltipOptions: this.options.tooltipOptions
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
getMap(ol) {
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

}