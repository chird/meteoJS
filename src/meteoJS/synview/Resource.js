/**
 * @module meteoJS/synview/resource
 */

import $ from 'jquery';
import VectorLayer from 'ol/layer/Vector';
import addEventFunctions from '../Events.js';

/**
 * Options for meteoJS/synview/resource.
 * 
 * @typedef {Object} meteoJS/synview/resource~options
 * @param {undefined|string} url URL to resource.
 * @param {undefined|Date} datetime
 *   Datetime for this resource, undefined if resource have no datetime.
 * @param {undefined|string} mimetype MIME-Type of the resource.
 * @param {undefined|integer} reloadTime
 *   After this time period the resource will be reloaded. Undefined for no
 *   reload. (in seconds)
 * @param {Object} ol Options for openlayers.
 * @param {Object|ol/source/Source~Source|undefined} ol.source
 *   Options for openlayers source object or OL source object already.
 * @param {Object.<string,function>|undefined} ol.events 
 *   Function to listen to ol/render/Event~RenderEvent.
 * @param {ol/style/Style~Style|ol/style/Style~Style|ol/style/Style~StyleFunction} [ol.style]
 *   Style for features. If this is a ol/style/Style~StyleFunction,
 *   then "this" is bound to the meteoJS.synview.resource.
 */

/**
 * Object representing a resource.
 * 
 * @constructor
 * @param {meteoJS/synview/resource~options} options Options.
 */
export default class Resource {

constructor(options) {
  /**
   * Options.
   * @member {meteoJS/synview/resource~options}
   */
  this.options = $.extend(true, {
    url: undefined,
    datetime: undefined,
    mimetype: undefined,
    reloadTime: undefined,
    ol: {
      source: undefined,
      events: undefined
    }
  }, options);
  // Normalize
  this.options.ol.source =
    (this.options.ol.source === undefined) ? {} : this.options.ol.source;
  
  /** @type {ol.layer.Layer|undefined} */
  this.layer = undefined;
  
  /** @type {ol.layer.Group|L.layerGroup|undefined} */
  this.layerGroup = undefined;
  
  /** @type {number|undefined} */
  this.reloadTimerId = undefined;
  
  /** @type {boolean} */
  this.visible = false;
  
  /** @type {number|undefined} */
  this.zIndex = undefined;
  
  /** @type {number} */
  this.opacity = 1.0;
}

/**
 * Returns an ID for this resource. Should change, if content of resource
 * changes.
 * 
 * @return {mixed} Id.
 */
getId() {
  return this.getUrl();
}

/**
 * Returns URL to the resource. Undefined if unknown.
 * 
 * @return {string|undefined} URL.
 */
getUrl() {
  return this.options.url;
}

/**
 * Returns the datetime of the resource.
 * 
 * @return {Date|undefined} Date.
 */
getDatetime() {
  return this.options.datetime;
}

/**
 * Returns MIME-Type of the resource.
 * 
 * @return {string} MIME-Type.
 */
getMIMEType() {
  return (this.options.mimetype === undefined) ?
    'application/octet-stream' : this.options.mimetype;
}

/**
 * Returns the current reload time.
 * 
 * @return {undefined|integer} Reload time period.
 */
getReloadTime() {
  return this.options.reloadTime;
}

/**
 * Sets the reload time.
 * 
 * @param {undefined|integer} reloadTime Reload time period.
 * @return {meteoJS/synview/resource} This.
 */
setReloadTime(reloadTime) {
  this.options.reloadTime = reloadTime;
  this._reload(); // starts or stops frequent reload
  return this;
}

/**
 * Returns the visibility of the resource layer.
 * 
 * @return {boolean} Visible.
 */
getVisible() {
  return this.visible;
}

/**
 * Sets the visibility of the resource layer.
 * 
 * @param {boolean} visible Visible.
 * @return {meteoJS/synview/resource} This.
 */
setVisible(visible) {
  this.visible = visible;
  if (this.layer !== undefined) {
    // OpenLayers
    if ('setVisible' in this.layer)
      this.layer.setVisible(visible);
    // Leaflet
    else {
      if (this.visible)
        this.layer.addTo(this.layerGroup);
      else
        this.layerGroup.removeLayer(this.layer);
    }
  }
  return this;
}

/**
 * Returns the z-Index of the resource layer.
 * 
 * @return {number|undefined} z-Index.
 */
getZIndex() {
  return this.zIndex;
}

/**
 * Sets the z-Index of the resource layer.
 * 
 * @param {number|undefined} zIndex z-Index.
 * @return {meteoJS/synview/resource} This.
 */
setZIndex(zIndex) {
  this.zIndex = zIndex;
  if (this.layer !== undefined)
    this.layer.setZIndex(zIndex);
  return this;
}

/**
 * Returns opacity of the resource layer.
 * 
 * @return {number} Opacity.
 */
getOpacity() {
  return this.opacity;
}

/**
 * Sets opacity of the resource layer.
 * 
 * @param {number} opacity Opacity.
 * @return {meteoJS/synview/resource} This.
 */
setOpacity(opacity) {
  this.opacity = opacity;
  if (this.layer !== undefined)
    this.layer.setOpacity(opacity);
  return this;
}

/**
 * Returns the layer group of the resource layer.
 * 
 * @return {ol.layer.group|L.layerGroup|undefined} Layer group.
 */
getLayerGroup() {
  return this.layerGroup;
}

/**
 * Sets the layer group and adds the resource layer to this group.
 * If undefined is passed, the resource layer will be deleted and removed for
 * any layer group.
 * 
 * @param {ol.layer.group|L.layerGroup|undefined} layerGroup Layer group.
 * @return {meteoJS/synview/resource} This.
 */
setLayerGroup(layerGroup) {
  if (this.layerGroup !== undefined &&
      this.layer !== undefined) {
    // OpenLayers
    if ('remove' in this.layerGroup.getLayers())
      this.layerGroup.getLayers().remove(this.layer);
    // Leaflet
    else
      this.layerGroup.removeLayer(this.layer);
  }
  if (layerGroup === undefined)
    this.layer = undefined;
  this.layerGroup = layerGroup;
  if (this.layerGroup !== undefined) {
    // Leaflet
    if ('addLayer' in this.layerGroup) {
      var layer = this.getLLLayer();
      if (this.getVisible())
        this.layerGroup.addLayer(layer);
    }
    // OpenLayers
    else
      this.layerGroup.getLayers().push(this.getOLLayer());
  }
  this.setReloadTime(this.getReloadTime()); // Trigger reload interval
  return this;
}

/**
 * Returns layer for openlayers of this resource.
 * 
 * @return {ol.layer.Layer} openlayers layer.
 */
getOLLayer() {
  if (this.layer !== undefined)
    return this.layer;
  this.layer = this._makeOLLayer();
  return this.layer;
}

/**
 * Returns openlayers layer of this resource. Must be overwritten by child
 * classes.
 * 
 * @protected
 * @return {ol.layer.Layer} openlayers layer.
 */
makeOLLayer() {
  // Dies on instantiation of ol.layer.Layer, so use ol.layer.Vector
  return new VectorLayer();
}

/**
 * Returns a ready to use OpenLayers layer.
 * 
 * @private
 * @return {ol.layer.Layer} openlayers layer.
 */
_makeOLLayer() {
  var layer = this.makeOLLayer();
  layer.setVisible(this.visible);
  layer.setZIndex(this.zIndex);
  layer.setOpacity(this.opacity);
  if ('events' in this.options.ol &&
      this.options.ol.events !== undefined)
    ['precompose', 'postcompose', 'render'].forEach(function (eventName) {
      if (eventName in this.options.ol.events &&
          this.options.ol.events[eventName] !== undefined)
        layer.on(eventName, (function (event) {
          this.options.ol.events[eventName].call(this, event, layer);
        }).bind(this));
    }, this);
  return layer;
}

/**
 * Returns layer for Leaflet of this resource.
 * 
 * @return {L.layer} Leaflet layer.
 */
getLLLayer() {
  if (this.layer !== undefined)
    return this.layer;
  this.layer = this._makeLLLayer();
  return this.layer;
}

/**
 * Returns Leaflet layer of this resource. Must be overwritten by child
 * classes.
 * 
 * @protected
 * @return {L.Layer} Leaflet layer.
 */
makeLLLayer() {
  // Dies on instantiation of ol.layer.Layer, so use ol.layer.Vector
  return L.Layer();
}

/**
 * Returns a ready to use Leaflet layer.
 * 
 * @private
 * @return {L.Layer} Leaflet layer.
 */
_makeLLLayer() {
  return this.makeLLLayer();
}

/**
 * Reload source.
 * 
 * @private
 * @return {meteoJS/synview/resource} This.
 */
_reload() {
  // Stop possible earlier reload
  if (this.reloadTimerId !== undefined) {
    clearTimeout(this.reloadTimerId);
    this.reloadTimerId = undefined;
  }
  // No frequent reload
  if (this.options.reloadTime === undefined)
    return;
  // Reload could only be handled, if layerGroup is defined
  if (this.layerGroup === undefined)
    return;
  var reloadFunction = (function () {
    this.reloadTimerId = undefined;
    if (this.layerGroup === undefined)
      return;
    var layer = this._makeOLLayer();
    // Hackish reload of sources, it is not handled properly by OpenLayers.
    // 1. Non-tile sources, they have a 'getUrl' method.
    if ('getUrl' in layer.getSource()) {
      var layerGroup = this.layerGroup;
      // event triggered, even if source is cached.
      var key = layer.getSource().on('change', (function () {
        if (layer.getSource().getState() == 'ready' ||
            layer.getSource().getState() == 'error') {
          // Execute code once, once the data is loaded.
          ol.Observable.unByKey(key);
          if (layer.getSource().getState() == 'ready' &&
              this.layerGroup !== undefined) {
            layer.setVisible(this.layer.getVisible());
            layer.setOpacity(this.layer.getOpacity());
            layer.setZIndex(this.layer.getZIndex());
            this.layerGroup.getLayers().remove(this.layer);
            this.layer = layer;
          }
          else if (this.layerGroup !== undefined)
            this.layerGroup.getLayers().remove(layer);
          else
            layerGroup.getLayers().remove(layer);
          if (this.reloadTimerId === undefined &&
              this.options.reloadTime !== undefined &&
              this.layerGroup !== undefined)
            this.reloadTimerId =
              setTimeout(reloadFunction, this.options.reloadTime * 1000);
        }
      }).bind(this));
      this.layerGroup.getLayers().push(layer);
      layer.setVisible(true); // Force load of data by make the layer visible.
    }
    else {
      /* Tile sources in OpenLayers doesn't support a request to check, if all
       * tiles are loaded, because cached tiles doesn't generate any event.
       * Uncached tiles fire tileloadstart/end/error events.
       * So we wait a second and exchange then the old with the new layer. If
       * the reload of the data is smaller of one second, this suppresses that
       * neither the old layer nor the new data is visible. */
      this.layerGroup.getLayers().push(layer);
      layer.setVisible(true);
      setTimeout((function () {
        var oldLayer = this.layer;
        this.layer = layer;
        if (this.reloadTimerId === undefined &&
            this.options.reloadTime !== undefined)
          this.reloadTimerId =
            setTimeout(reloadFunction, this.options.reloadTime * 1000);
      }).bind(this), 1000);
    }
  }).bind(this);
  this.reloadTimerId =
    setTimeout(reloadFunction, this.options.reloadTime * 1000);
  return this;
}

}
/* Events-Methoden auf das Objekt draufsetzen */
addEventFunctions(Resource.prototype);