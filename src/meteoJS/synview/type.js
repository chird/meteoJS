/**
 * @module meteoJS/synview/type
 */

/**
 * Options for meteoJS/synview/type.
 * 
 * @typedef {Object} meteoJS/synview/type~options
 * @param {string|undefined} id ID.
 * @param {boolean} [visible] Visibility.
 * @param {undefined|number} [zIndex] zIndex on map.
 * @param {'nearest'|'floor'} [displayMethod]
 *   Method to determine the displayed resource.
 * @param {number} [displayMaxResourceAge]
 *   Maximum time space between display and resource time (in seconds).
 * @param {number} [displayFadeStart]
 *   Fade resource from this age to the display time (in seconds).
 * @param {number} [displayFadeStartOpacity]
 *   Opacity (between 0 and 1) at displayFadingTime.
 */

/**
 * Triggered on change of visibilty.
 * 
 * @event meteoJS.synview.type#change:visible
 */

/**
 * Triggered, if the set of timestamps changes (due to resource changes).
 * 
 * @event meteoJS.synview.type#change:times
 */

/**
 * Type to display by synview, like a serie of radar images.
 * 
 * @constructor
 * @param {meteoJS/synview/type~options} options Options.
 * requires openlayers Some code is dependent on the openlayers library.
 * @fires {meteoJS.synview.type#change:visible}
 */
meteoJS.synview.type = function (options) {
  /**
   * Options.
   * @member {meteoJS/synview/type~options}
   */
  this.options = $.extend(true, {
    id: undefined,
    visible: true,
    zIndex: undefined,
    displayMethod: 'floor',
    displayMaxResourceAge: 3*3600,
    displayFadeStart: 15*60,
    displayFadeStartOpacity: 0.95
  }, options);
  
  /**
   * The mapping group to display all the resources. (openlayers specific)
   * @member {undefined|ol.layer.Group}
   * @default
   */
  this.layerGroup = undefined;
  
  /**
   * Collection of resources.
   * @member {meteoJS.synview.resourceCollection}
   */
  this.collection = new meteoJS.synview.resourceCollection();
  
  /**
   * Object. Key: Number (timestamp), Value: OL-Layer
   * @member {Object}
   */
  this.layers = {};
  
  /**
   * Time of displayed resource.
   * @member {Date}
   */
  this.displayedResourceTime = new Date('invalid');
  
  // Collection initialisieren
  this.collection.on('add:item', function (resource) {
    this._addOLLayer(resource);
  }, this);
  this.collection.on('remove:item', function (resource) {
    this._removeOLLayer(resource);
  }, this);
  this.collection.on('replace:item', function (newResource, oldResource) {
    this._replaceOLLayer(newResource, oldResource);
  }, this);
};
meteoJS.events.addEventFunctions(meteoJS.synview.type.prototype);

/**
 * Returns ID of type.
 * 
 * @return {string|undefined}
 */
meteoJS.synview.type.prototype.getId = function () {
  return this.options.id;
};

/**
 * Sets ID of type.
 * 
 * @param {string|undefined} id ID.
 * @return {meteoJS/synview/type} This.
 */
meteoJS.synview.type.prototype.setId = function (id) {
  this.options.id = id;
  return this;
};

/**
 * Returns visibility.
 * 
 * @return {boolean} Visibility.
 */
meteoJS.synview.type.prototype.getVisible = function () {
  return this.options.visible;
};

/**
 * Sets visibility.
 * 
 * @param {boolean} visible Visibility.
 * @return {meteoJS/synview/type} This.
 * @fires meteoJS.synview.type#change:visible
 */
meteoJS.synview.type.prototype.setVisible = function (visible) {
  // Nur etwas unternehmen, falls Visible ändert
  if (this.options.visible ? !visible : visible) {
    this.options.visible = visible ? true : false;
    if (this.layerGroup !== undefined)
      this.layerGroup.setVisible(this.options.visible);
    if (this.options.visible) {
      this.collection.getResources().forEach(function (resource) {
        this._addOLLayer(resource);
      }, this);
    }
    else {
      this._hideVisibleOLLayer();
      //this._removeCollectionEvents();
      Object.keys(this.layers).forEach(function (timeValue) {
        this._removeOLLayerByTime(timeValue);
      }, this);
    }
    this.trigger('change:visible');
  }
  return this;
};

/**
 * Returns the z Index.
 * 
 * @return {undefined|number}
 */
meteoJS.synview.type.prototype.getZIndex = function () {
  return this.options.zIndex;
};

/**
 * Sets the z Index.
 * 
 * @param {undefined|number} zIndex z-Index.
 * @return {meteoJS/synview/type} This.
 */
meteoJS.synview.type.prototype.setZIndex = function (zIndex) {
  this.options.zIndex = zIndex;
  if (this.getLayerGroup() !== undefined)
    this.getLayerGroup().getLayers().forEach(function (layer) {
      layer.setZIndex(zIndex);
    });
  return this;
};

/**
 * Returns layer-group of this type on the map.
 * 
 * return {ol.layer.Group} Layer-group.
 */
meteoJS.synview.type.prototype.getLayerGroup = function () {
  return (this.layerGroup === undefined) ? new ol.layer.Group() : this.layerGroup;
};

/**
 * Sets layer-group on the map.
 * 
 * @param {ol.layer.Group} group layer-group.
 * @return {meteoJS/synview/type} This.
 */
meteoJS.synview.type.prototype.setLayerGroup = function (group) {
  this.layerGroup = group;
  return this;
};

/**
 * Returns collection of the resources.
 * 
 * @return {meteoJS.synview.resourceCollection} resourceCollection.
 */
meteoJS.synview.type.prototype.getResourceCollection = function () {
  return this.collection;
};

/**
 * Replaces collection of resources.
 * If type is visible, this changes also the resources on the map.
 * 
 * @param {meteoJS.synview.resourceCollection} collection resourceCollection.
 * @return {meteoJS/synview/type} This.
 * @fires meteoJS.synview.type#change:times
 */
meteoJS.synview.type.prototype.setResourceCollection = function (collection) {
  // hide current layer
  var currentTime = this.displayedResourceTime;
  this._hideVisibleOLLayer();
  
  this.collection.swapResources(collection.getItems());
  
  // show current layer again
  if (currentTime !== undefined)
    this.setDisplayTime(currentTime);
  
  /* Trigger nach setTime() ausführen. Hier wird bsp. vom letzten Zeitpunkt
   * wieder auf den letzten Zeitpunkt gesprungen. Das würde setTime() rückgängig
   * machen. XXX */
  this.trigger('change:times');
  return this;
};

/**
 * Returns resource of the displayed resource.
 * 
 * @return {meteoJS.synview.resource} Resource.
 */
meteoJS.synview.type.prototype.getDisplayedResource = function () {
  return (this.getVisible()) ?
    this.collection.getResourceByTime(this.displayedResourceTime) :
    new meteoJS.synview.resource();
};

/**
 * Sets time to display. Corresponding to the options an adequate resource will
 * be searched and displayed. (accessible via getDisplayedResource())
 * 
 * @param {Date} time Display time.
 * @return {meteoJS/synview/type} This.
 */
meteoJS.synview.type.prototype.setDisplayTime = function (time) {
  if (!this.getVisible())
    return this;
  var time_to_show = this._getResourceTimeByDisplayTime(time);
  if (time_to_show === undefined ||
      time_to_show !== undefined &&
      !isNaN(this.displayedResourceTime) &&
      this.displayedResourceTime.valueOf() != time_to_show.valueOf())
    this._hideVisibleOLLayer();
  if (time_to_show !== undefined) {
    this.displayedResourceTime = time_to_show;
    if (time_to_show.valueOf() in this.layers) {
      this.layers[time_to_show.valueOf()].setVisible(true);
      var opacity = 1.0;
      if (Math.abs(time.valueOf() - time_to_show.valueOf()) > this.options.displayMaxResourceAge*1000) // 3h
        opacity = 0.0;
      else if (Math.abs(time.valueOf() - time_to_show.valueOf()) > this.options.displayFadeStart*1000) // 15min
        opacity = this.options.displayFadeStartOpacity *
          (Math.abs(time.valueOf() - time_to_show.valueOf()) -
           this.options.displayMaxResourceAge * 1000) /
          (1000 *
           (this.options.displayFadeStart - this.options.displayMaxResourceAge));
      this.layers[time_to_show.valueOf()].setOpacity(opacity);
    }
  }
  return this;
};

/**
 * Blendet aktuell dargestellten OL-Layer aus.
 * @private
 */
meteoJS.synview.type.prototype._hideVisibleOLLayer = function () {
  if (!isNaN(this.displayedResourceTime) &&
      this.displayedResourceTime.valueOf() in this.layers)
    this.layers[this.displayedResourceTime.valueOf()].setVisible(false);
  this.displayedResourceTime = new Date('invalid');
};

/**
 * Erstelle aus einer Resource einen OL-Layer
 * @private
 * @param {meteoJS.synview.resource} resource Resource für OL-Layer
 * @return {ol.layer.Layer} OL-Layer zur Resource
 */
meteoJS.synview.type.prototype._getOLLayerByResource = function (resource) {
  var layer = resource.getOLLayer();
  if (this.getZIndex() !== undefined)
    layer.setZIndex(this.getZIndex());
  layer.setVisible(false);
  return layer;
};

/**
 * @private
 */
meteoJS.synview.type.prototype._getLayerIdByTime = function (time) {
  return isNaN(time) ? '' : time.valueOf();
};

/**
 * Füge dem layers-Objekt einen neuen OL-Layer hinzu
 * @private
 * @param {meteoJS.synview.resource} resource Entsprechende Resource zum Hinzufügen
 */
meteoJS.synview.type.prototype._addOLLayer = function (resource) {
  var id = this._getLayerIdByTime(resource.getDatetime());
  this.layers[id] = this._getOLLayerByResource(resource);
  // Show static resources if visible
  if (id == '')
    this.layers[id].setVisible(this.getVisible());
  this.getLayerGroup().getLayers().push(this.layers[id]);
};

/**
 * Löscht aus layers-Objekt einen OL-Layer
 * @private
 * @param {meteoJS.synview.resource} resource Entsprechende Resource zum Hinzufügen
 */
meteoJS.synview.type.prototype._removeOLLayer = function (resource) {
  this._removeOLLayerByTime(this._getLayerIdByTime(resource.getDatetime()));
};

/**
 * Löscht aus layers-Objekt einen OL-Layer gemäss Zeit
 * @private
 * @param {integer} time Zeit-Wert für layers-Objekt
 */
meteoJS.synview.type.prototype._removeOLLayerByTime = function (timeValue) {
  if (timeValue in this.layers) {
    this.getLayerGroup().getLayers().remove(this.layers[timeValue]);
    delete this.layers[timeValue];
  }
};

/**
 * Ersetzt im layers-Objekt einen OL-Layer
 * @private
 * @param {meteoJS.synview.resource} newResource Resource zum Hinzufügen
 * @param {meteoJS.synview.resource} oldResource Resource zum Ersetzen
 */
meteoJS.synview.type.prototype._replaceOLLayer = function (newResource, oldResource) {
  var update = 0;
  // Update des OL Layers, wenn die URL neu (bei Layer-Wechsel)
  if (oldResource.getUrl() !== undefined &&
      newResource.getUrl() !== undefined &&
      newResource.getUrl() != oldResource.getUrl() ||
      oldResource.getOLLayerClassname() != newResource.getOLLayerClassname())
    update = 1;
  else if (this.isTemporaryResource(newResource)) {
    /* Update des OL Layers, wenn dieser Layer bei jedem Update aktualisiert
     * werden muss (durch temporary_count, bsp. Bitze) */
    update = 2;
  }
  if (update) {
    if (update == 2) {
      var time = newResource.getDatetime();
      var tIndex = this._getLayerIdByTime(time);
      if (tIndex in this.layers) {
        var oldLayer = this.layers[tIndex];
        var that = this;
        var layer = this._getOLLayerByResource(newResource);
        // Neuer Layer durch alten Layer ersetzen (ausser alte Layer wurde erstetzt)
        var updateLayer = function () {
          if (tIndex in that.layers &&
              oldLayer === that.layers[tIndex]) {
            layer.setVisible(that.layers[tIndex].getVisible());
            layer.setOpacity(that.layers[tIndex].getOpacity());
            that.getLayerGroup().getLayers().remove(that.layers[tIndex]);
            that.layers[tIndex] = layer;
          }
          else
            that.getLayerGroup().getLayers().remove(layer);
        };
        if ('getUrl' in layer.getSource()) { // Tile-Sources haben keine getUrl-Methode
          // change-Event wird auch getriggert, wenn Source gechached ist.
          var key = layer.getSource().on('change', function () {
            if (layer.getSource().getState() == 'ready' ||
                layer.getSource().getState() == 'error') {
              // Sobald Daten geladen, nur einmal ausführen
              ol.Observable.unByKey(key);
              if (layer.getSource().getState() == 'ready')
                updateLayer();
              else
                that.getLayerGroup().getLayers().remove(layer);
            }
          });
          this.getLayerGroup().getLayers().push(layer);
          layer.setVisible(true); // Forciere durch Anzeigen das Laden der Daten
        }
        else {
          /* Für Tile-Sources gibt es keine einfache Abfrage, ob alle Tiles
           * geladen sind. Tiles aus dem Cache generieren keine Events. Solche
           * die geladen werden die tileloadstart/end/error-Events. Daher wird
           * hier einfach der neue Layer angezeigt und nach 1s der alte gelöscht.
           * Ohne das Warten von 1s gibt es jede Minute ein Blinken auf dem
           * Bildschirm. */
          this.getLayerGroup().getLayers().push(layer);
          layer.setVisible(true);
          setTimeout(function () { updateLayer(); }, 1000);
        }
      }
      else
        this._addOLLayer(newResource);
    }
    else {
      this._removeOLLayer(oldResource);
      this._addOLLayer(newResource);
    }
  }
};

/**
 * Gibt eine Zeit mit vorhandener Resource zu einer darzustellenden Zeit zurück.
 * Es gibt dazu verschiedene Optionen (this.options.displayMethod):
 * 'nearest': Wähle die zeitlich nächstgelegene Resource aus
 * 'floor':   Wähle die Resource direkt zum Zeitpunkt oder zeitlich direkt vor
 *            dem Termin.
 * @private
 * @return {undefined|Date} Resource time or undefined if not existing.
 */
meteoJS.synview.type.prototype._getResourceTimeByDisplayTime = function (time) {
  if (isNaN(time))
    return undefined;
  var resultTime = undefined;
  this.collection.getTimes().forEach(function (resourceTime) {
    /*if (resultTime === undefined)
      resultTime = resourceTime;
    else {*/
      switch (this.options.displayMethod) {
        case 'exact':
          if (time.valueOf() == resourceTime.valueOf())
            resultTime = resourceTime;
          break;
        case 'nearest':
          if (resultTime === undefined ||
              Math.abs(time.valueOf() - resourceTime.valueOf()) <
                Math.abs(time.valueOf() - resultTime.valueOf()))
            resultTime = resourceTime;
          break;
        case 'floor':
        default:
          if (resultTime === undefined ||
              resourceTime.valueOf() <= time.valueOf() &&
              (time.valueOf() - resourceTime.valueOf() <
               time.valueOf() - resultTime.valueOf()))
            resultTime = resourceTime;
      }
    //}
  }, this);
  return resultTime;
};