/**
 * @module meteoJS/synview
 */

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
meteoJS.synview = function (options) {
  /**
   * Options.
   * @member {meteoJS/synview~options}
   */
  this.options = $.extend(true, {
    map: undefined,
    timeline: undefined
  }, options);
  // Normalize options
  if (this.options.map === undefined)
    this.options.map = new meteoJS.synview.map();
  if (this.options.timeline === undefined)
    this.options.timeline = new meteoJS.timeline();
  
  /**
   * Collection of synview types.
   * @member {meteoJS.synview.typeCollection}
   */
  this.typeCollection = new meteoJS.synview.typeCollection();
  
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
    type.setDisplayTime(this.getTimeline().getSelectedTime());
    type.on('change:resources', updateTimes);
    // Zeitpunkte bei visible-Änderungen löschen oder hinzufügen
    type.on('change:visible', updateTimes);
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
};

/**
 * Returns timeline object.
 * 
 * @return {meteoJS.timeline} Timeline.
 */
meteoJS.synview.prototype.getTimeline = function () {
  return this.options.timeline;
};

/**
 * Returns map object.
 * 
 * @return {meteoJS.synview.map} Map object.
 */
meteoJS.synview.prototype.getMap = function (ol) {
  return this.options.map;
};

/**
 * Returns collection object of appended types.
 * 
 * @return {meteoJS.synview.typeCollection} Type collection.
 */
meteoJS.synview.prototype.getTypeCollection = function () {
  return this.typeCollection;
};