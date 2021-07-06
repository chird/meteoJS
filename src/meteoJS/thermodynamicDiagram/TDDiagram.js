/**
 * @module meteoJS/thermodynamicDiagram/tdDiagram
 */
import {
  tempCelsiusToKelvin,
  tempKelvinToCelsius,
  potentialTempByTempAndPres,
  saturationHMRByTempAndPres,
  lclByPotentialTempAndHMR,
  lclTemperatureByTempAndDewpoint,
  equiPotentialTempByTempAndDewpointAndPres,
  wetbulbTempByTempAndDewpointAndPres,
  altitudeISAByPres
} from '../calc.js';
import {
  getNormalizedLineStyleOptions,
  getNormalizedFontOptions,
  getFirstDefinedValue,
  drawTextInto
} from './Functions.js';
import PlotAltitudeDataArea from './PlotAltitudeDataArea.js';

/**
 * Object passed on events.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram/plotArea~event}
 *   module:meteoJS/thermodynamicDiagram/tdDiagram~event
 * @property {number} p - Pressure coordinate [hPa].
 * @property {number} T - Temperature coordinate [K].
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/tdDiagram#click
 * @type {module:meteoJS/thermodynamicDiagram/tdDiagram~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/tdDiagram#dblclick
 * @type {module:meteoJS/thermodynamicDiagram/tdDiagram~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/tdDiagram#mousedown
 * @type {module:meteoJS/thermodynamicDiagram/tdDiagram~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/tdDiagram#mouseup
 * @type {module:meteoJS/thermodynamicDiagram/tdDiagram~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/tdDiagram#mouseover
 * @type {module:meteoJS/thermodynamicDiagram/tdDiagram~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/tdDiagram#mouseout
 * @type {module:meteoJS/thermodynamicDiagram/tdDiagram~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/tdDiagram#mousemove
 * @type {module:meteoJS/thermodynamicDiagram/tdDiagram~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/tdDiagram#touchstart
 * @type {module:meteoJS/thermodynamicDiagram/tdDiagram~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/tdDiagram#touchmove
 * @type {module:meteoJS/thermodynamicDiagram/tdDiagram~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/tdDiagram#touchleave
 * @type {module:meteoJS/thermodynamicDiagram/tdDiagram~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/tdDiagram#touchend
 * @type {module:meteoJS/thermodynamicDiagram/tdDiagram~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/tdDiagram#touchcancel
 * @type {module:meteoJS/thermodynamicDiagram/tdDiagram~event}
 */

/**
 * Options for pressure label.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram~lineTextOptions}
 *   module:meteoJS/thermodynamicDiagram/tdDiagram~presLabelOptions
 * @property {string|Object} [fill]
 *   Fill option for background rect. Default is 'white' with opacity 0.7.
 * @property {number} [horizontalMargin=5] - Margin in x direction.
 * @property {number} [verticalMargin=0] - Margin in y direction.
 * @property {number|'100%'} [length=60]
 *   Length of the horizontal line. A number is in pixel unit. A string
 *   with a appended '%' indicates a length relative to the diagram width.
 * @property {'left'|'right'} [align='left']
 *   Align pressure label left/right in the diagram.
 */

/**
 * Options for labels.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram~lineTextOptions}
 *   module:meteoJS/thermodynamicDiagram/tdDiagram~labelsOptions
 * @property {string|Object} [fill]
 *   Fill option for background rect. Default is 'white' with opacity 0.7.
 * @property {number} [horizontalMargin=10] - Margin in x direction.
 * @property {number} [verticalMargin=0] - Margin in y direction.
 * @property {number} [radius=undefined] - Radius for hover circle.
 * @property {number} [radiusPlus=2]
 *   Radius relative to line width for hover circle.
 */

/**
 * Options for labels on hovering the thermodynamic diagram.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram/plotAltitudeDataArea~hoverLabelsOptions}
 *   module:meteoJS/thermodynamicDiagram/tdDiagram~hoverLabelsOptions
 * @property {module:meteoJS/thermodynamicDiagram/tdDiagram~presLabelOptions}
 *   [pres] - Options for pressure label.
 * @property {module:meteoJS/thermodynamicDiagram/tdDiagram~labelsOptions}
 *   [temp] - Options for temperature label.
 * @property {module:meteoJS/thermodynamicDiagram/tdDiagram~labelsOptions}
 *   [dewp] - Options for dew point label.
 * @property {module:meteoJS/thermodynamicDiagram/tdDiagram~labelsOptions}
 *   [wetbulb] - Options for wetbulb temperature label.
 */

/**
 * Options for parcels in the diagram.
 * 
 * @typedef {Object}
 *   module:meteoJS/thermodynamicDiagram/tdDiagram~parcelsOptions
 * @property {boolean} [visible=true] - Visibility of parcels.
 */

/**
 * Definition of lines in a thermodynamic diagram.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram~lineStyleOptions}
 *   module:meteoJS/thermodynamicDiagram/tdDiagram~linesOptions
 * @property {undefined|Array<number>} [highlightedLines=undefined]
 *   Highlight lines at this values.
 * @property {undefined|Array<number>} [lines=undefined]
 *   Draw values for this values.
 * @property {number} [max=undefined]
 *   Maximum value for a line. Ignored if lines is set.
 * @property {number} [min=undefined]
 *   Minimum value for a line. Ignored if lines is set.
 * @property {number} [interval=undefined]
 *   Interval between different lines. Ignored if lines is set.
 * @property {number} [maxPressure=undefined]
 *   Start line from this maximum pressure.
 * @property {number} [minPressure=undefined]
 *   End line at this minimum pressure.
 */

/**
 * Options for the constructor.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram/plotAltitudeDataArea~options}
 *   module:meteoJS/thermodynamicDiagram/tdDiagram~options
 * @param {module:meteoJS/thermodynamicDiagram/tdDiagram~linesOptions}
 *   [isobars] - Isobars configuration.
 * @param {module:meteoJS/thermodynamicDiagram/tdDiagram~linesOptions}
 *   [isotherms] - Isotherms configuration.
 * @param {module:meteoJS/thermodynamicDiagram/tdDiagram~linesOptions}
 *   [dryadiabats] - Dry adiabats configuration.
 * @param {module:meteoJS/thermodynamicDiagram/tdDiagram~linesOptions}
 *   [pseudoadiabats] - Pseudo adiabats configuration.
 * @param {module:meteoJS/thermodynamicDiagram/tdDiagram~linesOptions}
 *   [mixingratio] - Mixing ratio configuration.
 * @param {module:meteoJS/thermodynamicDiagram/tdDiagram~hoverLabelsOptions}
 *   [hoverLabels] - Hover labels options.
 * @param {module:meteoJS/thermodynamicDiagram/tdDiagram~parcelsOptions}
 *   [parcels] - Parcels options.
 */

/**
 * Class to draw the real thermodynamic diagram.
 * 
 * <pre><code>import TDDiagram from 'meteojs/thermodynamicDiagram/TDDiagram';</code></pre>
 * 
 * @extends module:meteoJS/thermodynamicDiagram/plotAltitudeDataArea.PlotAltitudeDataArea
 * 
 * @fires module:meteoJS/thermodynamicDiagram/tdDiagram#click
 * @fires module:meteoJS/thermodynamicDiagram/tdDiagram#dblclick
 * @fires module:meteoJS/thermodynamicDiagram/tdDiagram#mousedown
 * @fires module:meteoJS/thermodynamicDiagram/tdDiagram#mouseup
 * @fires module:meteoJS/thermodynamicDiagram/tdDiagram#mouseover
 * @fires module:meteoJS/thermodynamicDiagram/tdDiagram#mouseout
 * @fires module:meteoJS/thermodynamicDiagram/tdDiagram#mousemove
 * @fires module:meteoJS/thermodynamicDiagram/tdDiagram#touchstart
 * @fires module:meteoJS/thermodynamicDiagram/tdDiagram#touchmove
 * @fires module:meteoJS/thermodynamicDiagram/tdDiagram#touchleave
 * @fires module:meteoJS/thermodynamicDiagram/tdDiagram#touchend
 * @fires module:meteoJS/thermodynamicDiagram/tdDiagram#touchcancel
 */
export class TDDiagram extends PlotAltitudeDataArea {
  
  /**
   * @param {module:meteoJS/thermodynamicDiagram/tdDiagram~linesOptions} [options]
   *   Options.
   */
  constructor({
    svgNode = undefined,
    coordinateSystem = undefined,
    x = 0,
    y = 0,
    width = 100,
    height = 100,
    style = {},
    visible = true,
    events = {},
    dataGroupIds = ['temp', 'dewp', 'wetbulb'],
    getCoordinatesByLevelData = (dataGroupId, sounding, levelData, plotArea) => {
      if (levelData.pres === undefined)
        return {};
      
      let value = undefined;
      switch (dataGroupId) {
      case 'temp':
        value = levelData.tmpk;
        break;
      case 'dewp':
        value = levelData.dwpk;
        break;
      case 'wetbulb':
        value = wetbulbTempByTempAndDewpointAndPres(
          levelData.tmpk,
          levelData.dwpk,
          levelData.pres
        );
        break;
      }
      if (value === undefined)
        return {};
      
      return {
        x: plotArea.coordinateSystem.getXByPT(levelData.pres, value),
        y: plotArea.coordinateSystem.height -
          plotArea.coordinateSystem.getYByPT(levelData.pres, value),
        value: Math.round(tempKelvinToCelsius(value)*10)/10,
        unit: '℃'
      };
    },
    insertDataGroupInto = (svgNode, dataGroupId, sounding, data) => {
      const options =
        (dataGroupId in sounding.options.diagram)
          ? sounding.options.diagram[dataGroupId].style : {};
      svgNode.group()
        .polyline(data.map(level => [ level.x, level.y ]))
        .fill('none').stroke(options);
    },
    filterDataPoint = undefined,
    minDataPointsDistance = 0,
    isobars = {},
    isotherms = {},
    dryadiabats = {},
    pseudoadiabats = {},
    mixingratio = {},
    hoverLabels = {},
    parcels = {}
  } = {}) {
    super({
      svgNode,
      coordinateSystem,
      x,
      y,
      width,
      height,
      style,
      visible,
      events,
      hoverLabels,
      getSoundingVisibility:
        sounding => sounding.visible && sounding.options.diagram.visible,
      dataGroupIds,
      getCoordinatesByLevelData,
      insertDataGroupInto,
      filterDataPoint,
      minDataPointsDistance
    });
    
    this.options = {
      isobars: getNormalizedDiagramLineOptions(isobars),
      isotherms:
        getNormalizedDiagramLineOptions(isotherms, {
          highlightedLines: [tempCelsiusToKelvin(0)]
        }),
      dryadiabats:
        getNormalizedDiagramLineOptions(dryadiabats),
      pseudoadiabats:
        getNormalizedDiagramLineOptions(pseudoadiabats, {
          style: {
            color: 'rgb(102, 51, 0)',
            dasharray: 6
          }
        }),
      mixingratio:
        getNormalizedDiagramLineOptions(mixingratio, {
          minPressure: 500,
          style: {
            color: 'rgb(102, 51, 0)',
            dasharray: 2
          }
        })
    };
    
    this.svgGroups = {
      border: this._svgNodeBackground.group(),
      isobars: this._svgNodeBackground.group(),
      isotherms: this._svgNodeBackground.group(),
      dryadiabats: this._svgNodeBackground.group(),
      mixingratio: this._svgNodeBackground.group(),
      pseudoadiabats: this._svgNodeBackground.group()
    };
    
    /**
     * @type module:meteoJS/thermodynamicDiagram/tdDiagram~parcelsOptions
     * @private
     */
    this._parcelsOptions = parcels;
    if (!('visible' in this._parcelsOptions))
      this._parcelsOptions.visible = true;
    
    /**
     * @typedef {module:meteoJS/thermodynamicDiagram/diagramSounding~parcelsItems}
     * @property {undefined|external:SVG} parcelsGroup
     *   SVG Group to plot the parcels.
     * @property {Map.<module:meteoJS/thermodynamicDiagram/diagramParcel.DiagramParcel,external:SVG>} parcelsGroup
     *   Pairs of DiagramParcel objects and SVG Group. The parcel is plotted
     *   into the group. The group is contained in 'parcelsGroup'.
     * @property {undefined|mixed} addItemListenerKey
     *   Listener key for the {@link module:meteoJS/base/collection#add:item} event
     *   on {@link module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding#diagramParcelCollection}
     *   for each sounding plotted in this diagram.
     * @property {Object[]} changeVisibleListeners
     * @property {Object[]} changeOptionsListeners
     */
    
    /**
     * @type Map.<module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding,module:meteoJS/thermodynamicDiagram/diagramSounding~parcelsItems>
     * @private
     */
    this._parcels = new Map();
    this.on('add:sounding', sounding => {
      /** @type module:meteoJS/thermodynamicDiagram/diagramSounding~parcelsItems */
      const soundingParcelsItems = {
        parcelsGroup: undefined,
        parcelsGroups: new Map(),
        addItemListenerKey: undefined,
        removeItemListenerKey: undefined,
        changeVisibleListeners: [],
        changeOptionsListeners: []
      };
      const onAddParcel = diagramParcel => {
        soundingParcelsItems.changeVisibleListeners.push({
          diagramParcel,
          listenerKey: diagramParcel.on('change:visible', () => {
            if (!soundingParcelsItems.parcelsGroups.has(diagramParcel))
              return;
            const group = soundingParcelsItems.parcelsGroups.get(diagramParcel);
            diagramParcel.visible ? group.show() : group.hide();
          })
        });
        soundingParcelsItems.changeOptionsListeners.push({
          diagramParcel,
          listenerKey: diagramParcel.on('change:options', () => {
            // Delte old parcel
            const soundingParcelsItems = this._parcels.get(sounding);
            if (soundingParcelsItems !== undefined) {
              const group =
                soundingParcelsItems.parcelsGroups.get(diagramParcel);
              if (group !== undefined) {
                soundingParcelsItems.parcelsGroups.delete(diagramParcel);
                group.remove();
              }
            }
            // Redraw
            this.drawParcel(sounding, diagramParcel);
          })
        });
      };
      soundingParcelsItems.addItemListenerKey =
        sounding.diagramParcelCollection.on('add:item', diagramParcel => {
          onAddParcel(diagramParcel);
          this.drawParcel(sounding, diagramParcel);
        });
      soundingParcelsItems.removeItemListenerKey =
        sounding.diagramParcelCollection.on('remove:item', diagramParcel => {
          const group =
            soundingParcelsItems.parcelsGroups.get(diagramParcel);
          if (group !== undefined) {
            soundingParcelsItems.parcelsGroups.delete(diagramParcel);
            group.remove();
          }
        });
      for (let diagramParcel of sounding.diagramParcelCollection)
        onAddParcel(diagramParcel);
      this._parcels.set(sounding, soundingParcelsItems);
      /* After this event, {@link module:meteoJS/thermodynamicDiagram/tdDiagram.TDDiagram#drawSounding}
       * is executed and therefore also
       * {@link module:meteoJS/thermodynamicDiagram/tdDiagram.TDDiagram#drawParcels}.
       */
    });
    // Remove all listeners on the parcels contained in the removed sounding.
    this.on('remove:sounding', sounding => {
      if (this._parcels.has(sounding)) {
        /** @type module:meteoJS/thermodynamicDiagram/diagramSounding~parcelsItems */
        const soundingParcelsItems = this._parcels.get(sounding);
        sounding.diagramParcelCollection
          .un('add:item', soundingParcelsItems.addItemListenerKey);
        sounding.diagramParcelCollection
          .un('remove:item', soundingParcelsItems.removeItemListenerKey);
        soundingParcelsItems.changeVisibleListeners
          .forEach(listenerObj =>
            listenerObj.diagramParcel
              .un('change:visible', listenerObj.listenerKey));
        soundingParcelsItems.changeOptionsListeners
          .forEach(listenerObj =>
            listenerObj.diagramParcel
              .un('change:options', listenerObj.listenerKey));
      }
      this._parcels.delete(sounding);
    });
    
    this.init();
  }
  
  /**
   * Return the visibility of the isobars.
   * @returns {boolean} Visibility of the isobars.
   * @deprecated
   */
  getIsobarsVisible() {
    return this.options.isobars.visible;
  }
  
  /**
   * Sets the visibility of the isobars.
   * @param {boolean} visible Visibility of the isobars.
   * @returns {module:meteoJS/thermodynamicDiagram/tdDiagram.TDDiagram} this.
   * @deprecated
   */
  setIsobarsVisible(visible) {
    this.options.isobars.visible = visible ? true : false;
    this.plotIsobars();
    return this;
  }
  
  /**
   * Return the visibility of the isotherms.
   * @returns {boolean} Visibility of the isotherms.
   * @deprecated
   */
  getIsothermsVisible() {
    return this.options.isotherms.visible;
  }
  
  /**
   * Sets the visibility of the isotherms.
   * @param {boolean} visible Visibility of the isotherms.
   * @returns {module:meteoJS/thermodynamicDiagram/tdDiagram.TDDiagram} this.
   * @deprecated
   */
  setIsothermsVisible(visible) {
    this.options.isotherms.visible = visible ? true : false;
    this.plotIsotherms();
    return this;
  }
  
  /**
   * Return the visibility of the dry adiabats.
   * @returns {boolean} Visibility of the dry adiabats.
   * @deprecated
   */
  getDryadiabatsVisible() {
    return this.options.dryadiabats.visible;
  }
  
  /**
   * Sets the visibility of the dry adiabats.
   * @param {boolean} visible Visibility of the dry adiabats.
   * @returns {module:meteoJS/thermodynamicDiagram/tdDiagram.TDDiagram} this.
   * @deprecated
   */
  setDryadiabatsVisible(visible) {
    this.options.dryadiabats.visible = visible ? true : false;
    this.plotDryadiabats();
    return this;
  }
  
  /**
   * Return the visibility of the pseudo adiabats.
   * @returns {boolean} Visibility of the pseudo adiabats.
   * @deprecated
   */
  getPseudoadiabatsVisible() {
    return this.options.pseudoadiabats.visible;
  }
  
  /**
   * Sets the visibility of the pseudo adiabats.
   * @param {boolean} visible Visibility of the pseudo adiabats.
   * @returns {module:meteoJS/thermodynamicDiagram/tdDiagram.TDDiagram} this.
   * @deprecated
   */
  setPseudoadiabatsVisible(visible) {
    this.options.pseudoadiabats.visible = visible ? true : false;
    this.plotPseudoadiabats();
    return this;
  }
  
  /**
   * Return the visibility of the mixing ratio.
   * @returns {boolean} Visibility of the mixing ratio.
   * @deprecated
   */
  getMixingratioVisible() {
    return this.options.mixingratio.visible;
  }
  
  /**
   * Sets the visibility of the mixing ratio.
   * @param {boolean} visible Visibility of the mixing ratio.
   * @returns {module:meteoJS/thermodynamicDiagram/tdDiagram.TDDiagram} this.
   * @deprecated
   */
  setMixingratioVisible(visible) {
    this.options.mixingratio.visible = visible ? true : false;
    this.plotMixingratio();
    return this;
  }
  
  /**
   * Draw the sounding into the SVG group.
   * 
   * @override
   */
  drawSounding(sounding, group) {
    super.drawSounding(sounding, group);
    
    // Draw parcels
    if (this._parcels.has(sounding)) {
      let parcelsObj = this._parcels.get(sounding);
      parcelsObj.parcelsGroup = group.group();
      if (!sounding.options.parcels.visible)
        parcelsObj.parcelsGroup.hide();
      this._parcels.set(sounding, parcelsObj);
    }
    this.drawParcels(sounding);
  }
  
  /**
   * Draws parcels of a sounding.
   * 
   * @param {module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding}
   *   sounding - Sounding.
   */
  drawParcels(sounding) {
    if (!this._parcelsOptions.visible)
      return;
    if (!this._parcels.has(sounding))
      return;
    
    /** @type module:meteoJS/thermodynamicDiagram/diagramSounding~parcelsItems */
    const soundingParcelsItems = this._parcels.get(sounding);
    soundingParcelsItems.parcelsGroup.clear();
    soundingParcelsItems.parcelsGroups.clear();
    for (let diagramParcel of sounding.diagramParcelCollection)
      this.drawParcel(sounding, diagramParcel);
  }
  
  /**
   * Draws a parcel.
   * 
   * @param {module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding}
   *   diagramSounding - DiagramSounding object, which contains the parcel.
   * @param {module:meteoJS/thermodynamicDiagram/diagramParcel.DiagramParcel}
   *   diagramParcel - Parcel lift to draw.
   * @param {external:SVG} group - SVG group to draw parcel into.
   * @private
   */
  drawParcel(diagramSounding, diagramParcel) {
    const parcel = diagramParcel.parcel;
    if (parcel.pres === undefined ||
        parcel.tmpc === undefined ||
        parcel.dwpc === undefined)
      return;
    if (!this._parcels.has(diagramSounding))
      return;
    const soundingParcelsItems = this._parcels.get(diagramSounding);
    const group = soundingParcelsItems.parcelsGroup.group();
    soundingParcelsItems.parcelsGroups.set(diagramParcel, group);
    this._parcels.set(diagramSounding, soundingParcelsItems);
    
    const pottmpk =
      potentialTempByTempAndPres(tempCelsiusToKelvin(parcel.tmpc), parcel.pres);
    const hmr =
      saturationHMRByTempAndPres(tempCelsiusToKelvin(parcel.dwpc), parcel.pres);
    const lclpres = lclByPotentialTempAndHMR(pottmpk, hmr);
    const lcltmpk = lclTemperatureByTempAndDewpoint(
      tempCelsiusToKelvin(parcel.tmpc),
      tempCelsiusToKelvin(parcel.dwpc));
    const lclthetaek = equiPotentialTempByTempAndDewpointAndPres(
      lcltmpk, lcltmpk, lclpres);
    
    const options = diagramParcel.options;
    
    // SVG groups
    if (!options.visible)
      group.hide();
    const tempGroup = group.group();
    if (!options.temp.visible)
      tempGroup.hide();
    let dewpGroup = group.group();
    if (!options.dewp.visible)
      dewpGroup.hide();
    
    // Draw temp curve
    const yInterval = 10;
    const y0 = this.coordinateSystem
      .getYByPT(parcel.pres, tempCelsiusToKelvin(parcel.tmpc));
    const x0 = this.coordinateSystem.getXByYPotentialTemperature(y0, pottmpk);
    const y1 = this.coordinateSystem.getYByPPotentialTemperatur(lclpres, pottmpk);
    const x1 = this.coordinateSystem.getXByYPotentialTemperature(y1, pottmpk);
    let tempPolyline = [[x0, y0]];
    if (!this.coordinateSystem.isDryAdiabatStraightLine())
      for (let y=y0+yInterval; y<y1; y+=yInterval) {
        tempPolyline.push([
          this.coordinateSystem.getXByYPotentialTemperature(y, pottmpk),
          y
        ]);
      }
    tempPolyline.push([x1, y1]);
    const y2 = this.coordinateSystem.height;
    const x2 = this.coordinateSystem.getXByYEquiPotTemp(y2, lclthetaek);
    for (let y=y1+yInterval; y<y2; y+=yInterval) {
      tempPolyline.push([
        this.coordinateSystem.getXByYEquiPotTemp(y, lclthetaek),
        y
      ]);
    }
    tempPolyline.push([x2, y2]);
    tempGroup
      .polyline(tempPolyline.map(point => {
        point[1] = this.coordinateSystem.height - point[1];
        return point;
      }))
      .fill('none')
      .stroke(options.temp.style);
    
    // Draw mixing ratio curve
    const x0dwp = this.coordinateSystem.getXByYHMR(y0, hmr);
    const x1dwp = this.coordinateSystem.getXByYHMR(y1, hmr);
    let dewpPolyline = [[x0dwp, y0]];
    for (let y=y0+yInterval; y<y1; y+=yInterval) {
      dewpPolyline.push([
        this.coordinateSystem.getXByYHMR(y, hmr),
        y
      ]);
    }
    dewpPolyline.push([x1dwp, y1]);
    dewpGroup
      .polyline(dewpPolyline.map(point => {
        point[1] = this.coordinateSystem.height - point[1];
        return point;
      }))
      .fill('none')
      .stroke(options.dewp.style);
  }
  
  /**
   * Draw background into SVG group.
   * 
   * @override
   */
  _drawBackground(svgNode) {
    super._drawBackground(svgNode);
    
    this.svgGroups = {
      border: svgNode.group(),
      isobars: svgNode.group(),
      isotherms: svgNode.group(),
      dryadiabats: svgNode.group(),
      mixingratio: svgNode.group(),
      pseudoadiabats: svgNode.group()
    };
    
    // Rand des Diagramms
    this.svgGroups.border.clear();
    this.svgGroups.border
      .rect(this.coordinateSystem.width, this.coordinateSystem.height)
      .attr({stroke: 'black', 'stroke-width': 1, 'fill-opacity': 0});
    
    // Hilfelinien zeichnen
    this.plotIsobars(true);
    this.plotIsotherms(true);
    this.plotDryadiabats(true);
    this.plotPseudoadiabats(true);
    this.plotMixingratio(true);
  }
   
  /**
   * @private
   */
  plotIsobars(redraw) {
    let min = this.coordinateSystem.getPByXY(0, this.coordinateSystem.height);
    let max = this.coordinateSystem.getPByXY(0, 0);
    let delta = max - min;
    this._plotLines(
      this.svgGroups.isobars,
      this.options.isobars,
      {
        min: min,
        max: max,
        interval: (delta > 500) ? 100 : (delta > 50) ? 10 : 1
      },
      p => {
        let y = this.coordinateSystem.getYByXP(0, p);
        return [[0, y], [this.coordinateSystem.width, y]];
      },
      redraw
    );
  }
  
  /**
   * @private
   */
  plotIsotherms(redraw) {
    let min = tempKelvinToCelsius(
      this.coordinateSystem.getTByXY(0, this.coordinateSystem.height));
    let max = tempKelvinToCelsius(
      this.coordinateSystem.getTByXY(this.coordinateSystem.width, 0));
    let delta = max - min;
    this._plotLines(
      this.svgGroups.isotherms,
      this.options.isotherms,
      {
        min: min,
        max: max,
        interval: (delta > 50) ? 10 : 5
      },
      T => {
        T = tempCelsiusToKelvin(T);
        let result = [[undefined, undefined], [undefined, undefined]];
        if (this.coordinateSystem.isIsothermsVertical()) {
          result[0][1] = 0;
          result[1][1] = this.coordinateSystem.height;
          result[0][0] = result[1][0] = this.coordinateSystem.getXByYT(result[0][1], T);
        }
        else {
          result[0][1] = 0;
          result[0][0] = this.coordinateSystem.getXByYT(result[0][1], T);
          if (result[0][0] < 0)
            result[0][1] = this.coordinateSystem.getYByXT(result[0][0] = 0, T);
          result[1][0] = this.coordinateSystem.width;
          result[1][1] = this.coordinateSystem.getYByXT(result[1][0], T);
          if (result[1][1] === undefined) {
            result[1][0] = result[0][0];
            result[1][1] = this.coordinateSystem.height;
          }
          else if (result[1][1] > this.coordinateSystem.height) {
            result[1][1] = this.coordinateSystem.height;
            result[1][0] = this.coordinateSystem.getXByYT(result[1][1], T);
          }
        }
        return result;
      },
      redraw
    );
  }
  
  /**
   * @private
   */
  plotDryadiabats(redraw) {
    this._plotLines(
      this.svgGroups.dryadiabats,
      this.options.dryadiabats,
      {
        min: tempKelvinToCelsius(
          potentialTempByTempAndPres(
            this.coordinateSystem.getTByXY(0, 0),
            this.coordinateSystem.getPByXY(0, 0))),
        max: tempKelvinToCelsius(
          potentialTempByTempAndPres(
            this.coordinateSystem.getTByXY(this.coordinateSystem.width, this.coordinateSystem.height),
            this.coordinateSystem.getPByXY(this.coordinateSystem.width, this.coordinateSystem.height))),
        interval: 10
      },
      T => {
        let TKelvin = tempCelsiusToKelvin(T);
        let y0 = 0;
        let x0 = this.coordinateSystem.getXByYPotentialTemperature(y0, TKelvin);
        if (x0 === undefined ||
          x0 > this.coordinateSystem.width) {
          x0 = this.coordinateSystem.width;
          y0 = this.coordinateSystem.getYByXPotentialTemperature(x0, TKelvin);
        }
        let x1 = 0;
        let y1 = this.coordinateSystem.getYByXPotentialTemperature(x1, TKelvin);
        if (y1 === undefined ||
          y1 > this.coordinateSystem.height) {
          y1 = this.coordinateSystem.height;
          x1 = this.coordinateSystem.getXByYPotentialTemperature(y1, TKelvin);
        }
        if (x0 === undefined ||
          y0 === undefined ||
          x1 === undefined ||
          y1 === undefined)
          return undefined;
        if (this.coordinateSystem.isDryAdiabatStraightLine()) {
          return [[x0, y0], [x1, y1]];
        }
        else {
          let points = [[x0, y0]];
          let yInterval = 10;
          for (let y=y0+yInterval; y<y1; y+=yInterval) {
            points.push([
              this.coordinateSystem.getXByYPotentialTemperature(y, TKelvin),
              y
            ]);
          }
          points.push([x1, y1]);
          return points;
        }
      },
      redraw
    );
  }
  
  /**
   * @private
   */
  plotPseudoadiabats(redraw) {
    this._plotLines(
      this.svgGroups.pseudoadiabats,
      this.options.pseudoadiabats,
      {
        lines: [-18, -5, 10, 30, 60, 110, 180]
      },
      thetae => {
        let thetaeKelvin = tempCelsiusToKelvin(thetae);
        const y0 =
          Math.max(
            0,
            (this.options.pseudoadiabats.maxPressure === undefined)
              ? 0
              : this.coordinateSystem.getYByPEquiPotTemp(
                this.options.pseudoadiabats.maxPressure, thetaeKelvin)
          );
        const x0 = this.coordinateSystem.getXByYEquiPotTemp(y0, thetaeKelvin);
        const y1 =
          Math.min(
            this.coordinateSystem.height,
            (this.options.pseudoadiabats.minPressure === undefined)
              ? this.coordinateSystem.height
              : this.coordinateSystem.getYByPEquiPotTemp(
                this.options.pseudoadiabats.minPressure, thetaeKelvin)
          );
        const x1 = this.coordinateSystem.getXByYEquiPotTemp(y1, thetaeKelvin);
        let points = [[x0, y0]];
        let yInterval = 10;
        for (let y=y0+yInterval; y<y1; y+=yInterval) {
          points.push([
            this.coordinateSystem.getXByYEquiPotTemp(y, thetaeKelvin),
            y
          ]);
        }
        points.push([x1, y1]);
        return points;
      },
      redraw
    );
  }
  
  /**
   * @private
   */
  plotMixingratio(redraw) {
    this._plotLines(
      this.svgGroups.mixingratio,
      this.options.mixingratio,
      {
        lines: [0.01, 0.1, 1, 2, 4, 7, 10, 16, 21, 32, 40]
      },
      hmr => {
        const y0 =
          Math.max(
            0,
            (this.options.mixingratio.maxPressure === undefined)
              ? 0
              : this.coordinateSystem.getYByPHMR(
                this.options.mixingratio.maxPressure, hmr)
          );
        const x0 = this.coordinateSystem.getXByYHMR(y0, hmr);
        const y1 =
          Math.min(
            this.coordinateSystem.height,
            (this.options.mixingratio.minPressure === undefined)
              ? this.coordinateSystem.height
              : this.coordinateSystem.getYByPHMR(
                this.options.mixingratio.minPressure, hmr)
          );
        const x1 = this.coordinateSystem.getXByYHMR(y1, hmr);
        let points = [[x0, y0]];
        const yInterval = 10;
        for (let y=y0+yInterval; y<y1; y+=yInterval) {
          points.push([
            this.coordinateSystem.getXByYHMR(y, hmr),
            y
          ]);
        }
        points.push([x1, y1]);
        return points;
      },
      redraw
    );
  }
  
  /**
   * @private
   */
  _plotLines(node, options, valuesOptions, pointsFunc, redraw) {
    options.visible
      ? node.show()
      : node.hide();
    if (!redraw)
      return;
    node.clear();
    let lines = [];
    if (options.lines !== undefined)
      lines = options.lines;
    else if (options.min === undefined &&
           options.max === undefined &&
           options.interval === undefined &&
           valuesOptions.lines !== undefined)
      lines = valuesOptions.lines;
    else {
      if (options.min !== undefined)
        valuesOptions.min = options.min;
      if (options.max !== undefined)
        valuesOptions.max = options.max;
      let interval = options.interval;
      if (interval === undefined)
        interval = valuesOptions.interval;
      let start = Math.ceil(valuesOptions.min/interval)*interval;
      let end = Math.floor(valuesOptions.max/interval)*interval;
      for (let v=start; v<=end; v+=interval) {
        lines.push(v);
      }
    }
    let highlightLineWidth = 3;
    if (options.style.width !== undefined)
      highlightLineWidth = options.style.width+2;
    lines.forEach(function (v) {
      let points = pointsFunc.call(this, v);
      let line = (points.length == 2) ?
        node.line(points[0][0], this.coordinateSystem.height-points[0][1],
          points[1][0], this.coordinateSystem.height-points[1][1])
          .stroke(options.style) :
        node.polyline(points.map(function (point) {
          point[1] = this.coordinateSystem.height - point[1];
          return point;
        }, this))
          .fill('none').stroke(options.style);
      if (options.highlightedLines !== undefined)
        options.highlightedLines.forEach(function (vHighlight) {
          if (v == vHighlight)
            line.stroke({width: highlightLineWidth});
        }, this);
    }, this);
  }
  
  /**
   * Extend an event with temperature and pressure.
   * 
   * @override
   */
  getExtendedEvent(e, p) {
    e = super.getExtendedEvent(e, p);
    e.diagramTmpk =
      this.coordinateSystem.getTByXY(e.elementX,
        this.coordinateSystem.height - e.elementY);
    return e;
  }
  
  /**
   * Initialize hover labels options.
   * 
   * @param {module:meteoJS/thermodynamicDiagram/tdDiagram~hoverLabelsOptions}
   *   options - Hover labels options.
   * @override
   */
  _initHoverLabels({
    visible = true,
    type = 'mousemove',
    maxDistance = undefined,
    remote = true,
    insertLabelsFunc = undefined,
    pres = {},
    temp = {},
    dewp = {},
    wetbulb = {}
  }) {
    pres.length = ('length' in pres) ? pres.length : 60;
    pres.align = ('align' in pres) ? pres.align : 'left';
    if (!('visible' in pres))
      pres.visible = true;
    if (!('style' in pres))
      pres.style = {};
    pres.font = getNormalizedFontOptions(pres.font, {
      anchor: (pres.align == 'right') ? 'end' : 'start'
    });
    if (!('fill' in pres))
      pres.fill = {};
    if (pres.fill.opacity === undefined)
      pres.fill.opacity = 0.7;
    if (pres.horizontalMargin === undefined)
      pres.horizontalMargin = 5;
    
    if (!('visible' in temp))
      temp.visible = true;
    if (!('style' in temp))
      temp.style = {};
    temp.font = getNormalizedFontOptions(temp.font, {
      anchor: 'start',
      'alignment-baseline': 'bottom'
    });
    if (!('fill' in temp))
      temp.fill = {};
    if (temp.fill.opacity === undefined)
      temp.fill.opacity = 0.7;
    temp.radius = ('radius' in temp) ? temp.radius : undefined;
    temp.radiusPlus = ('radiusPlus' in temp) ? temp.radiusPlus : 2;
    if (temp.horizontalMargin === undefined)
      temp.horizontalMargin = 10;
    
    if (!('visible' in dewp))
      dewp.visible = true;
    if (!('style' in dewp))
      dewp.style = {};
    dewp.font = getNormalizedFontOptions(dewp.font, {
      anchor: 'end',
      'alignment-baseline': 'bottom'
    });
    if (!('fill' in dewp))
      dewp.fill = {};
    if (dewp.fill.opacity === undefined)
      dewp.fill.opacity = 0.7;
    dewp.radius = ('radius' in dewp) ? dewp.radius : undefined;
    dewp.radiusPlus = ('radiusPlus' in dewp) ? dewp.radiusPlus : 2;
    if (dewp.horizontalMargin === undefined)
      dewp.horizontalMargin = 10;
    
    if (!('visible' in wetbulb))
      wetbulb.visible = true;
    if (!('style' in wetbulb))
      wetbulb.style = {};
    wetbulb.font = getNormalizedFontOptions(wetbulb.font, {
      anchor: 'middle'
    });
    if (!('fill' in wetbulb))
      wetbulb.fill = {};
    if (wetbulb.fill.opacity === undefined)
      wetbulb.fill.opacity = 0.7;
    wetbulb.radius = ('radius' in wetbulb) ? wetbulb.radius : undefined;
    wetbulb.radiusPlus = ('radiusPlus' in wetbulb) ? wetbulb.radiusPlus : 2;
    if (wetbulb.verticalMargin === undefined)
      wetbulb.verticalMargin = 10;
    
    if (insertLabelsFunc === undefined)
      insertLabelsFunc =
        this._makeInsertLabelsFunc(pres, temp, dewp, wetbulb);
    
    super._initHoverLabels({
      visible,
      type,
      maxDistance,
      remote,
      insertLabelsFunc
    });
  }
  
  /**
   * Makes a default insertLabelsFunc.
   * 
   * @param {Object} pres
   * @param {Object} temp
   * @param {Object} dewp
   * @param {Object} wetbulb
   * @private
   */
  _makeInsertLabelsFunc(pres, temp, dewp, wetbulb) {
    return (sounding, levelData, group) => {
      group.clear();
      
      if (levelData.pres === undefined)
        return;
      
      if (pres.visible)
        drawPressureHoverLabelInto(group, levelData, this.coordinateSystem, pres);
      
      this.dataGroupIds.reverse().forEach(dataGroupId => {
        let labelOptions = {
          visible: false
        };
        switch (dataGroupId) {
        case 'temp': labelOptions = temp; break;
        case 'dewp': labelOptions = dewp; break;
        case 'wetbulb': labelOptions = wetbulb; break;
        }
        if (!labelOptions.visible)
          return;
        
        const { x, y, value, unit } =
          this._getCoordinatesByLevelData(dataGroupId,
            sounding, levelData, this);
        if (x === undefined ||
            y === undefined)
          return;
        
        const lineWidth =
          (dataGroupId in this.hoverLabelsSounding.options.diagram)
            ? this.hoverLabelsSounding.options.diagram[dataGroupId].style.width
            : 3;
        const radius = (labelOptions.radius === undefined)
          ? lineWidth + labelOptions.radiusPlus
          : labelOptions.radius;
        const fillOptions = labelOptions.style;
        if (!('color' in fillOptions) &&
            (dataGroupId in this.hoverLabelsSounding.options.diagram))
          fillOptions.color = sounding.options.diagram[dataGroupId].style.color;
        group
          .circle(2 * radius)
          .attr({ cx: x, cy: y })
          .fill(fillOptions);
        drawTextInto({
          node: group,
          text: `${value} ${unit}`,
          x,
          y,
          horizontalMargin: labelOptions.horizontalMargin,
          verticalMargin: labelOptions.verticalMargin,
          font: labelOptions.font,
          fill: labelOptions.fill
        });
      });
    };
  }
}
export default TDDiagram;

/**
 * Draws pressure hover label.
 * 
 * @param {external:SVG} svgNode - SVG node to draw into.
 * @param {number} pres - Pressure.
 * @param {module:meteoJS/thermodynamicDiagram/coordinateSystem.CoordinateSystem}
 *   coordinateSystem - Coordinate system.
 * @param {module:meteoJS/thermodynamicDiagram/tdDiagram~presLabelOptions}
 *   [options] - Options.
 */
export function drawPressureHoverLabelInto(svgNode, levelData, coordinateSystem, {
  length = 60,
  align = 'left',
  horizontalMargin = undefined,
  verticalMargin = undefined,
  style = {},
  font = {},
  fill = {}
} = {}) {
  let x0 = 0;
  let x1 = length;
  const match = /^([0-9]+)%$/.exec(x1);
  if (match)
    x1 = match[1] / 100 * coordinateSystem.width;
  if (align == 'right') {
    x0 = coordinateSystem.width;
    x1 = coordinateSystem.width - x1;
  }
  const y = coordinateSystem.height -
    coordinateSystem.getYByXP(0, levelData.pres);
  style = getNormalizedLineStyleOptions(style);
  svgNode
    .line([
      [Math.min(x0, x1), y],
      [Math.max(x0, x1), y]
    ])
    .stroke(style);
  font = getNormalizedFontOptions(font);
  font['alignment-baseline'] = 'bottom';
  drawTextInto({
    node: svgNode,
    text: `${Math.round(levelData.pres)} hPa`,
    x: x0,
    y,
    horizontalMargin,
    verticalMargin,
    font,
    fill
  });
  
  font['alignment-baseline'] = 'top';
  let hghtStr = (levelData.hght === undefined)
    ? `~${Math.round(altitudeISAByPres(levelData.pres))} m`
    : `${Math.round(levelData.hght)} m`;
  drawTextInto({
    node: svgNode,
    text: hghtStr,
    x: x0,
    y: y,
    horizontalMargin,
    verticalMargin,
    font,
    fill
  });
}

function getNormalizedDiagramLineOptions({
  highlightedLines = undefined,
  interval = undefined,
  lines = undefined,
  max = undefined,
  min = undefined,
  maxPressure = undefined,
  minPressure = undefined,
  style = undefined,
  visible = undefined
}, defaults = {}) {
  return {
    highlightedLines: getFirstDefinedValue(highlightedLines, defaults.highlightedLines),
    interval: getFirstDefinedValue(interval, defaults.interval),
    lines: getFirstDefinedValue(lines, defaults.lines),
    max: getFirstDefinedValue(max, defaults.max),
    min: getFirstDefinedValue(min, defaults.min),
    maxPressure: getFirstDefinedValue(maxPressure, defaults.maxPressure),
    minPressure: getFirstDefinedValue(minPressure, defaults.minPressure),
    style: getNormalizedLineStyleOptions(style, defaults.style),
    visible: getFirstDefinedValue(visible, defaults.visible, true)
  };
}