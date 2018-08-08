/**
 * @module meteoJS/synview/map/ol
 */

/**
 * Object to "communicate" with openlayers.
 * 
 * @constructor
 * @param {meteoJS/synview/map~options} options Options.
 * @requires openlayers
 */
meteoJS.synview.map.ol = function (options) {
  meteoJS.synview.map.call(this, options);
  
  // Normalize options
  if (this.options.layerGroup === undefined) {
    this.options.layerGroup = new ol.layer.Group();
    this.options.map.addLayer(this.options.layerGroup);
  }
  
  // Listen to view changes.
  this.options.map.getView().on('change:center', function () {
    this.trigger('change:view', this);
  }, this);
  this.options.map.getView().on('change:resolution', function () {
    this.trigger('change:view', this);
  }, this);
  this.options.map.on('pointermove', function (e) {
    this.trigger('move:pointer', e);
  }, this);
};
meteoJS.synview.map.ol.prototype = Object.create(meteoJS.synview.map.prototype);
meteoJS.synview.map.ol.prototype.constructor = meteoJS.synview.map.ol;

/**
 * Name of mercator projection in openlayers
 * 
 * @constant {string}
 */
meteoJS.synview.map.ol.projmerc = 'EPSG:3857';

/**
 * Name of wgs84 projection in openlayers (lat/lon in degrees)
 * 
 * @constant {string}
 */
meteoJS.synview.map.ol.projwgs84 = 'EPSG:4326';

/**
 * Helper function. Returns the view center in WGS84 coordinates, lat/lon.
 * 
 * @augments getViewCenter
 * @return {number[]} Center.
 */
meteoJS.synview.map.ol.prototype.getViewCenter = function () {
  return ol.proj.transform(
    this.options.map.getView().getCenter(),
    this.options.map.getView().getProjection(),
    meteoJS.synview.map.ol.projwgs84
  );
};

/**
 * Helper function. Sets the view center in WGS84 coordinates, lat/lon.
 * 
 * @augments setViewCenter
 * @param {number[]} center Center.
 * @return {meteoJS.synview.map.ol} This.
 */
meteoJS.synview.map.ol.prototype.setViewCenter = function (center) {
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
};

/**
 * Helper function. Returns the view zoom level.
 * 
 * @augments getViewZoom
 * @return {number|undefined} Zoom level.
 */
meteoJS.synview.map.ol.prototype.getViewZoom = function () {
  return this.options.map.getView().getZoom();
};

/**
 * Helper function. Sets the view zoom level.
 * 
 * @augments setViewZoom
 * @param {number|undefined} zoom Zoom level.
 * @return {meteoJS.synview.map.ol} This.
 */
meteoJS.synview.map.ol.prototype.setViewZoom = function (zoom) {
  if (!isNaN(zoom))
    this.options.map.getView().setZoom(zoom*1);
  return this;
};

/**
 * Returns a new layer group, already added to the map.
 * 
 * @augments makeLayerGroup
 * @return {ol.layer.Group} New layer group.
 */
meteoJS.synview.map.ol.prototype.makeLayerGroup = function () {
  var group = new ol.layer.Group();
  this.options.layerGroup.getLayers().push(group);
  return group;
};

/**
 * Turns image smoothing on/off.
 * 
 * @augments setImageSmoothing
 * @param {boolean} imageSmoothing
 *   True to turn image smoothing on, false otherwise.
 * @return {meteoJS.synview.map.ol} This.
 * @todo On canvas resize, precompose-event should be triggered again
 */
meteoJS.synview.map.ol.prototype.setImageSmoothing = function (imageSmoothing) {
  this.options.map.once('precompose', function(evt) {
    evt.context.imageSmoothingEnabled = imageSmoothing;
    evt.context.mozImageSmoothingEnabled = imageSmoothing;
    evt.context.msImageSmoothingEnabled = imageSmoothing;
  });
  this.options.map.render();
  return this;
};

/**
 * Returns an event object, that is extended by several keys.
 * Synview internal method.
 * 
 * @augments getExtendedEventByTypeCollection
 * @param {ol/MapBrowserPointerEvent} event Map event object.
 * @param {meteoJS/synview/typeCollection} collection Type collection.
 * @return {meteoJS.synview.map~extendedEvent} Event object.
 */
meteoJS.synview.map.ol.prototype.getExtendedEventByTypeCollection = function (event, collection) {
  event = meteoJS.synview.map.prototype.getExtendedEventByTypeCollection.call(this, event, collection);
  var visibleTypes = collection.getVisibleTypes()
    .filter(function (r) { return type.getTooltip() !== undefined; });
  var visibleLayers = [].concat.apply([], visibleTypes
    .map(function (type) { return type.getLayerGroup().getLayers().getArray().filter(function (l) { return l.getVisible(); }); })
    .filter(function (layers) { return layers.length > 0; }));
  this.map.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
    event.feature = feature;
    event.layer = layer;
    var i = visibleTypes.findIndex(function (type) {
      return this.findLayerInType(event.layer, type);
    }, this);
    event.type = (i < -1) ? undefined : visibleTypes[i];
    return true;
  }, {
    hitTolerance: 5,
    layerFilter: visibleLayers
  });
  if (event.feature === undefined) {
    this.map.forEachLayerAtPixel(event.pixel, function (layer, color) {
      if (color != null) {
        event.color = color;
        event.layer = layer;
        var i = visibleTypes.findIndex(function (type) {
          return this.findLayerInType(event.layer, type);
        }, this);
        event.type = (i < -1) ? undefined : visibleTypes[i];
        return true;
      }
    }, {
      hitTolerance: 5,
      layerFilter: visibleLayers
    });
  }
  return event;
};

/**
 * Returns index of the passed layer inside the layer group of the passed type.
 * Synview internal method.
 * 
 * @augments findLayerInType
 * @param {ol.layer.Layer} layer Layer object.
 * @param {meteoJS/synview/type} type Type.
 * @return {integer} Index.
 */
meteoJS.synview.map.ol.prototype.findLayerInType = function (layer, type) {
  return type.getLayerGroup().getLayers().findIndex(function (l) {
    return l == layer;
  }) > -1;
};