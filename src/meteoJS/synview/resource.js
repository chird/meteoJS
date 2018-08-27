/**
 * @module meteoJS/synview/resource
 */

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
 */

/**
 * Object representing a resource.
 * 
 * @constructor
 * @param {meteoJS/synview/resource~options} options Options.
 */
meteoJS.synview.resource = function (options) {
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
  
  /** @type {ol.layer.Group|undefined} */
  this.layerGroup = undefined;
  
  /** @type {number|undefined} */
  this.reloadTimerId = undefined;
};
/* Events-Methoden auf das Objekt draufsetzen */
meteoJS.events.addEventFunctions(meteoJS.synview.resource.prototype);

/**
 * Returns an ID for this resource. Should change, if content of resource
 * changes.
 * 
 * @return {mixed} Id.
 */
meteoJS.synview.resource.prototype.getId = function () {
  return this.getUrl();
};

/**
 * Returns URL to the resource. Undefined if unknown.
 * 
 * @return {string|undefined} URL.
 */
meteoJS.synview.resource.prototype.getUrl = function () {
  return this.options.url;
};

/**
 * Returns the datetime of the resource.
 * 
 * @return {Date|undefined} Date.
 */
meteoJS.synview.resource.prototype.getDatetime = function () {
  return this.options.datetime;
};

/**
 * Returns MIME-Type of the resource.
 * 
 * @return {string} MIME-Type.
 */
meteoJS.synview.resource.prototype.getMIMEType = function () {
  return (this.options.mimetype === undefined) ?
    'application/octet-stream' : this.options.mimetype;
};

/**
 * Returns the current reload time.
 * 
 * @return {undefined|integer} Reload time period.
 */
meteoJS.synview.resource.prototype.getReloadTime = function () {
  return this.options.reloadTime;
};

/**
 * Sets the reload time.
 * 
 * @param {undefined|integer} reloadTime Reload time period.
 * @return {meteoJS/synview/resource} This.
 */
meteoJS.synview.resource.prototype.setReloadTime = function (reloadTime) {
  this.options.reloadTime = reloadTime;
  this._reload(); // starts or stops frequent reload
  return this;
};

/**
 * Sets the layer group.
 * 
 * @param {ol.layer.group|undefined} layerGroup Layer group.
 * @return {meteoJS/synview/resource} This.
 */
meteoJS.synview.resource.prototype.setLayerGroup = function (layerGroup) {
  this.layerGroup = layerGroup;
  this.setReloadTime(this.getReloadTime()); // Trigger reload interval
  return this;
};

/**
 * Returns layer for openlayers of this resource.
 * 
 * @return {ol.layer.Layer} openlayers layer.
 */
meteoJS.synview.resource.prototype.getOLLayer = function () {
  if (this.layer !== undefined)
    return this.layer;
  this.layer = this._makeOLLayer();
  return this.layer;
};

/**
 * Returns openlayers layer of this resource. Must be overwritten by child
 * classes.
 * 
 * @protected
 * @return {ol.layer.Layer} openlayers layer.
 */
meteoJS.synview.resource.prototype.makeOLLayer = function () {
  // Dies on instantiation of ol.layer.Layer, so use ol.layer.Vector
  return new ol.layer.Vector();
};

/**
 * Clears internal layer cache. Should be called, if layer and resource isn't
 * used anymore.
 * 
 * @return {meteoJS/synview/resource} This.
 */
meteoJS.synview.resource.prototype.clearLayer = function () {
  this.layer = undefined;
  return this;
};

/**
 * Returns a ready to use OpenLayers layer.
 * 
 * @private
 * @return {ol.layer.Layer} openlayers layer.
 */
meteoJS.synview.resource.prototype._makeOLLayer = function () {
  var layer = this.makeOLLayer();
  if ('events' in this.options.ol &&
      this.options.ol.events !== undefined)
    ['precompose', 'postcompose', 'render'].forEach(function (eventName) {
      if (eventName in this.options.ol.events &&
          this.options.ol.events[eventName] !== undefined)
        layer.on(eventName, function (event) {
          this.options.ol.events[eventName].call(this, event, layer);
        }, this);
    }, this);
  return layer;
};

/**
 * Reload source.
 * 
 * @private
 * @return {meteoJS/synview/resource} This.
 */
meteoJS.synview.resource.prototype._reload = function () {
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
    var layer = this._makeOLLayer();
    // Hackish reload of sources, it is not handled properly by OpenLayers.
    // 1. Non-tile sources, they have a 'getUrl' method.
    if ('getUrl' in layer.getSource()) {
      if (this.layerGroup === undefined)
        return;
      // event triggered, even if source is cached.
      var key = layer.getSource().on('change', function () {
        if (layer.getSource().getState() == 'ready' ||
            layer.getSource().getState() == 'error') {
          // Execute code once, once the data is loaded.
          ol.Observable.unByKey(key);
          if (layer.getSource().getState() == 'ready') {
            var oldLayer = this.layer;
            this.layer = layer;
            this.trigger('change:layer', oldLayer);
          }
          else if (this.layerGroup !== undefined)
            this.layerGroup.getLayers().remove(layer);
          if (this.reloadTimerId === undefined &&
              this.options.reloadTime !== undefined)
            setTimeout(reloadFunction, this.options.reloadTime * 1000);
        }
      }, this);
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
        this.trigger('change:layer', oldLayer);
        if (this.reloadTimerId === undefined &&
            this.options.reloadTime !== undefined)
          setTimeout(reloadFunction, this.options.reloadTime * 1000);
      }).bind(this), 1000);
    }
  }).bind(this);
  this.reloadTimerId =
    setTimeout(reloadFunction, this.options.reloadTime * 1000);
  return this;
};