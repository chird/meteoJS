/**
 * @module meteoJS/synview/resource
 */
import VectorLayer from 'ol/layer/Vector';
import { unByKey } from 'ol/Observable';
import addEventFunctions from '../Events.js';

/**
 * Options for the constructor.
 * 
 * @typedef {Object} module:meteoJS/synview/resource~options
 * @param {undefined|String} url - URL to resource.
 * @param {undefined|Date} datetime
 *   Datetime for this resource, undefined if resource have no datetime.
 * @param {undefined|String} mimetype - MIME-Type of the resource.
 * @param {undefined|Integer} reloadTime
 *   After this time period the resource will be reloaded. Undefined for no
 *   reload. (in seconds)
 * @param {undefined|String} className - Type's classname.
 * @param {undefined|boolean} [imageSmoothingEnabled=undefined]
 *   Value of
 *   {@link https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled|imageSmoothingEnabled}
 *   when drawing the layer to canvas.
 *   Undefined uses the default (true).
 * @param {Object} ol - Options for openlayers.
 * @param {Object|external:ol/source/Source~Source|undefined} ol.source
 *   Options for openlayers source object or OL source object already.
 * @param {Object.<string,Function>|undefined} ol.events 
 *   Function to listen to module:ol/render/Event~RenderEvent.
 * @param {undefined|external:ol/style/Style~Style|external:ol/style/Style~Style|external:ol/style/Style~StyleFunction} [ol.style]
 *   Style for features. If this is a module:ol/style/Style~StyleFunction,
 *   then "this" will be bound to this module:meteoJS/synview/resource~Resource.
 */

/**
 * Object representing a resource.
 */
export class Resource {
  
  /**
   * @param {module:meteoJS/synview/resource~options} options - Options.
   */
  constructor({
    url = undefined,
    datetime = undefined,
    mimetype = undefined,
    reloadTime = undefined,
    className = undefined,
    imageSmoothingEnabled = undefined,
    ol = {}
  } = {}) {
    /**
     * @type {Object}
     * @private
     */
    this.options = {
      url,
      datetime,
      mimetype,
      reloadTime,
      className,
      imageSmoothingEnabled,
      ol
    };
    this._normalizeOLOptions(this.options.ol);
    
    /**
     * @type {external:ol.layer.Layer|undefined}
     * @private
     */
    this.layer = undefined;
    
    /**
     * @type {ol.layer.Group|L.layerGroup|undefined}
     * @private
     */
    this.layerGroup = undefined;
    
    /**
     * @type {number|undefined}
     * @private
     */
    this.reloadTimerId = undefined;
    
    /**
     * @type {boolean}
     * @private
     */
    this.visible = false;
    
    /**
     * @type {number|undefined}
     * @private
     */
    this.zIndex = undefined;
    
    /**
     * @type {number}
     * @private
     */
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
   * @return {module:meteoJS/synview/resource.Resource} This.
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
   * @return {module:meteoJS/synview/resource.Resource} This.
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
   * @return {module:meteoJS/synview/resource.Resource} This.
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
   * @return {module:meteoJS/synview/resource.Resource} This.
   */
  setOpacity(opacity) {
    this.opacity = opacity;
    if (this.layer !== undefined)
      this.layer.setOpacity(opacity);
    return this;
  }
  
  /**
   * Classname.
   * 
   * @type undefined|String
   */
  get className() {
    return this.options.className;
  }
  set className(className) {
    this.options.className = className;
  }
  
  /**
   * imageSmoothingEnabled.
   * 
   * @type undefined|boolean
   */
  get imageSmoothingEnabled() {
    return this.options.imageSmoothingEnabled;
  }
  set imageSmoothingEnabled(imageSmoothingEnabled) {
    this.options.imageSmoothingEnabled = imageSmoothingEnabled;
  }
  
  /**
   * Returns the layer group of the resource layer.
   * 
   * @return {external:ol.layer.group|external:L.layerGroup|undefined} Layer group.
   */
  getLayerGroup() {
    return this.layerGroup;
  }
  
  /**
   * Sets the layer group and adds the resource layer to this group.
   * If undefined is passed, the resource layer will be deleted and removed for
   * any layer group.
   * 
   * @param {external:ol.layer.group|external:L.layerGroup|undefined} layerGroup Layer group.
   * @return {module:meteoJS/synview/resource.Resource} This.
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
   * @return {external:ol.layer.Layer} openlayers layer.
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
   * @return {external:ol.layer.Layer} openlayers layer.
   */
  makeOLLayer() {
    // Dies on instantiation of ol.layer.Layer, so use ol.layer.Vector
    return new VectorLayer({
      className: this.className
    });
  }
  
  /**
   * Returns a ready to use OpenLayers layer.
   * 
   * @private
   * @return {external:ol.layer.Layer} openlayers layer.
   */
  _makeOLLayer() {
    let layer = this.makeOLLayer();
    layer.setVisible(this.visible);
    layer.setZIndex(this.zIndex);
    layer.setOpacity(this.opacity);
    if ('events' in this.options.ol &&
        this.options.ol.events !== undefined)
      ['prerender', 'postrender'].forEach(eventName => {
        if (eventName in this.options.ol.events &&
            this.options.ol.events[eventName] !== undefined)
          layer.on(eventName, event => {
            this.options.ol.events[eventName].call(this, event, layer);
          });
      });
    
    if (this.options.imageSmoothingEnabled !== undefined &&
        !this.options.imageSmoothingEnabled) {
      layer.on('prerender', event => {
        event.context.imageSmoothingEnabled =
          this.options.imageSmoothingEnabled;
      });
      layer.on('postrender', event => {
        event.context.imageSmoothingEnabled =
          !this.options.imageSmoothingEnabled;
      });
    }
    
    return layer;
  }
  
  /**
   * Returns layer for Leaflet of this resource.
   * 
   * @return {external:L.layer} Leaflet layer.
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
   * @return {external:L.Layer} Leaflet layer.
   */
  makeLLLayer() {
    // Dies on instantiation of ol.layer.Layer, so use ol.layer.Vector
    return L.Layer();
  }
  
  /**
   * Returns a ready to use Leaflet layer.
   * 
   * @private
   * @return {external:L.Layer} Leaflet layer.
   */
  _makeLLLayer() {
    return this.makeLLLayer();
  }
  
  /**
   * Reload source.
   * 
   * @private
   * @return {module:meteoJS/synview/resource.Resource} This.
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
            unByKey(key);
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
  
  /**
   * Normalizes this.options.ol.
   * 
   * @private
   * @param {Object|external:ol/source/Source~Source|undefined} source
   * @param {Object.<string,Function>|undefined} events
   * @param {external:ol/style/Style~Style|external:ol/style/Style~StyleLike|external:ol/style/Style~StyleFunction|undefined} [style]
   */
  _normalizeOLOptions({
    source = {},
    events = undefined,
    style = undefined
  }) {
    this.options.ol = {
      source,
      events,
      style
    };
  }
  
}
addEventFunctions(Resource.prototype);
export default Resource;