/**
 * @module meteoJS/synview/map/ol
 */

import LayerGroup from 'ol/layer/Group';

/**
 * Name of mercator projection in openlayers
 * 
 * @constant {string}
 */
export const projmerc = 'EPSG:3857';

/**
 * Name of wgs84 projection in openlayers (lat/lon in degrees)
 * 
 * @constant {string}
 */
export const projwgs84 = 'EPSG:4326';

/**
 * Object to "communicate" with openlayers.
 * 
 * @constructor
 * @param {meteoJS/synview/map~options} options Options.
 * @requires openlayers
 */
export class MapOL extends Map {

constructor(options) {
  super(options);
  
  // Normalize options
  if (this.options.layerGroup === undefined) {
    this.options.layerGroup = new LayerGroup();
    this.options.map.addLayer(this.options.layerGroup);
  }
  
  // Listen to view changes.
  this.options.map.getView().on('change:center', (function () {
    this.trigger('change:view', this);
  }).bind(this));
  this.options.map.getView().on('change:resolution', (function () {
    this.trigger('change:view', this);
  }).bind(this));
  this.options.map.on('pointermove', (function (e) {
    this.trigger('move:pointer', e);
  }).bind(this));
  this.options.map.on('click', (function (e) {
    this.trigger('click:pointer', e);
  }).bind(this));
  this.options.map.on('singleclick', (function (e) {
    this.trigger('singleclick:pointer', e);
  }).bind(this));
  this.options.map.on('dblclick', (function (e) {
    this.trigger('dblclick:pointer', e);
  }).bind(this));
  this.options.map.on('pointerdrag', (function (e) {
    this.trigger('drag:pointer', e);
  }).bind(this));
}

/**
 * Helper function. Returns the view center in WGS84 coordinates, lat/lon.
 * 
 * @augments getViewCenter
 * @return {number[]} Center.
 */
getViewCenter() {
  return ol.proj.transform(
    this.options.map.getView().getCenter(),
    this.options.map.getView().getProjection(),
    meteoJS.synview.map.ol.projwgs84
  );
}

/**
 * Helper function. Sets the view center in WGS84 coordinates, lat/lon.
 * 
 * @augments setViewCenter
 * @param {number[]} center Center.
 * @return {meteoJS.synview.map.ol} This.
 */
setViewCenter(center) {
  var valid = true;
  center = center.map(function (a) {
    if (isNaN(a)) {
      valid = false;
      return undefined;
    }
    else
      return a*1;
  });
  if (valid)
    this.options.map.getView().setCenter(ol.proj.fromLonLat(center));
  return this;
}

/**
 * Helper function. Returns the view zoom level.
 * 
 * @augments getViewZoom
 * @return {number|undefined} Zoom level.
 */
getViewZoom() {
  return this.options.map.getView().getZoom();
}

/**
 * Helper function. Sets the view zoom level.
 * 
 * @augments setViewZoom
 * @param {number|undefined} zoom Zoom level.
 * @return {meteoJS.synview.map.ol} This.
 */
setViewZoom(zoom) {
  if (!isNaN(zoom))
    this.options.map.getView().setZoom(zoom*1);
  return this;
}

/**
 * Returns a new layer group, already added to the map.
 * 
 * @augments makeLayerGroup
 * @return {ol.layer.Group} New layer group.
 */
makeLayerGroup() {
  var group = new LayerGroup();
  this.options.layerGroup.getLayers().push(group);
  return group;
}

/**
 * Turns image smoothing on/off.
 * 
 * @augments setImageSmoothing
 * @param {boolean} imageSmoothing
 *   True to turn image smoothing on, false otherwise.
 * @return {meteoJS.synview.map.ol} This.
 * @todo On canvas resize, precompose-event should be triggered again
 */
setImageSmoothing(imageSmoothing) {
  this.options.map.once('precompose', function(evt) {
    evt.context.imageSmoothingEnabled = imageSmoothing;
    evt.context.mozImageSmoothingEnabled = imageSmoothing;
    evt.context.msImageSmoothingEnabled = imageSmoothing;
  });
  this.options.map.render();
  return this;
}

/**
 * Returns an event object, that is extended by several keys.
 * Synview internal method.
 * 
 * @augments getExtendedEventByTypeCollection
 * @param {ol/MapBrowserPointerEvent} event Map event object.
 * @param {meteoJS/synview/typeCollection} collection Type collection.
 * @return {meteoJS.synview.map~extendedEvent} Event object.
 */
getExtendedEventByTypeCollection(event, collection) {
  event = meteoJS.synview.map.prototype.getExtendedEventByTypeCollection.call(this, event, collection);
  var visibleTypes = collection.getVisibleTypes()
    .filter(function (type) { return type.getTooltip() !== undefined; });
  var visibleLayers = [].concat.apply([], visibleTypes
    .map(function (type) { return type.getLayerGroup().getLayers().getArray().filter(function (l) { return l.getVisible(); }); })
    .filter(function (layers) { return layers.length > 0; }));
  var that = this;
  this.options.map.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
    var i = visibleTypes.findIndex(function (type) {
      return this.findLayerInType(layer, type);
    }, that);
    if (i < 0)
      return false;
    event.feature = feature;
    event.layer = layer;
    event.type = visibleTypes[i];
    return true;
  }, {
    hitTolerance: 5,
    layerFilter: function (layer) {
      return visibleLayers.findIndex(function (l) { return l == layer; }) > -1;
    }
  });
  if (event.feature === undefined) {
    this.options.map.forEachLayerAtPixel(event.pixel, function (layer, color) {
      if (color != null) {
        var i = visibleTypes.findIndex(function (type) {
          return this.findLayerInType(layer, type);
        }, that);
        if (i < 0)
          return false;
        event.color = color;
        event.layer = layer;
        event.type = visibleTypes[i];
        return true;
      }
    }, {
      hitTolerance: 5,
      layerFilter: function (layer) {
        return visibleLayers.findIndex(function (l) { return l == layer; }) > -1;
      }
    });
  }
  return event;
}

/**
 * Returns index of the passed layer inside the layer group of the passed type.
 * Synview internal method.
 * 
 * @augments findLayerInType
 * @param {ol.layer.Layer} layer Layer object.
 * @param {meteoJS/synview/type} type Type.
 * @return {integer} Index.
 */
findLayerInType(layer, type) {
  return type.getLayerGroup().getLayers().getArray().findIndex(function (l) {
    return l == layer;
  }) > -1;
}

}