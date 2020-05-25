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
  wetbulbTempByTempAndDewpointAndPres
} from '../calc.js';
import { drawTextInto } from './Functions.js';
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
 * @property {number|'100%'} [length=10]
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
 * @param {undefined|Array.<>} [highlightedLines=undefined] - .
 * @param {number} [interval=undefined] - .
 * @param {undefined|Array.<>} [lines=undefined] - .
 * @param {number} [max=undefined] - .
 * @param {number} [min=undefined] - .
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
   * @param {module:meteoJS/thermodynamicDiagram/tdDiagram~options} options
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
      insertDataGroupInto
    });
    
    this.options = {
      isobars: getNormalizedDiagramLineOptions(isobars),
      isotherms: getNormalizedDiagramLineOptions(isotherms),
      dryadiabats: getNormalizedDiagramLineOptions(dryadiabats),
      pseudoadiabats: getNormalizedDiagramLineOptions(pseudoadiabats),
      mixingratio: getNormalizedDiagramLineOptions(mixingratio)
    };
    if (this.options.isotherms.highlightedLines === undefined)
      this.options.isotherms.highlightedLines = [tempCelsiusToKelvin(0)];
    if (this.options.dryadiabats.style.color === undefined)
      this.options.dryadiabats.style.color = 'green';
    if (this.options.pseudoadiabats.style.color === undefined)
      this.options.pseudoadiabats.style.color = 'blue';
    if (this.options.mixingratio.style.color === undefined)
      this.options.mixingratio.style.color = 'red';
    Object.keys(this.options).forEach(key => {
      if (this.options[key].style.color === undefined)
        this.options[key].style.color = 'black';
    });
    
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
     * @type Map.<module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding, Object>
     * @private
     */
    this._parcels = new Map();
    this.on('add:sounding', sounding => {
      this._parcels.set(sounding, {
        parcelsGroup: undefined,
        listenerKey: sounding.sounding.parcelCollection
          .on('add:item', () => this.drawParcels(sounding))
      })
    });
    this.on('remove:sounding', sounding => {
      if (this._parcels.has(sounding))
        sounding.sounding.parcelCollection
          .un('add:item', this._parcels.get(sounding).listenerKey);
      this._parcels.delete(sounding);
    });
    
    this.init();
  }
  
  /**
   * Return the visibility of the isobars.
   * @returns {boolean} Visibility of the isobars.
   */
  getIsobarsVisible() {
    return this.options.isobars.visible;
  }
  
  /**
   * Sets the visibility of the isobars.
   * @param {boolean} visible Visibility of the isobars.
   * @returns {module:meteoJS/thermodynamicDiagram/tdDiagram.TDDiagram} this.
   */
  setIsobarsVisible(visible) {
    this.options.isobars.visible = visible ? true : false;
    this.plotIsobars();
    return this;
  }
  
  /**
   * Return the visibility of the isotherms.
   * @returns {boolean} Visibility of the isotherms.
   */
  getIsothermsVisible() {
    return this.options.isotherms.visible;
  }
  
  /**
   * Sets the visibility of the isotherms.
   * @param {boolean} visible Visibility of the isotherms.
   * @returns {module:meteoJS/thermodynamicDiagram/tdDiagram.TDDiagram} this.
   */
  setIsothermsVisible(visible) {
    this.options.isotherms.visible = visible ? true : false;
    this.plotIsotherms();
    return this;
  }
  
  /**
   * Return the visibility of the dry adiabats.
   * @returns {boolean} Visibility of the dry adiabats.
   */
  getDryadiabatsVisible() {
    return this.options.dryadiabats.visible;
  }
  
  /**
   * Sets the visibility of the dry adiabats.
   * @param {boolean} visible Visibility of the dry adiabats.
   * @returns {module:meteoJS/thermodynamicDiagram/tdDiagram.TDDiagram} this.
   */
  setDryadiabatsVisible(visible) {
    this.options.dryadiabats.visible = visible ? true : false;
    this.plotDryadiabats();
    return this;
  }
  
  /**
   * Return the visibility of the pseudo adiabats.
   * @returns {boolean} Visibility of the pseudo adiabats.
   */
  getPseudoadiabatsVisible() {
    return this.options.pseudoadiabats.visible;
  }
  
  /**
   * Sets the visibility of the pseudo adiabats.
   * @param {boolean} visible Visibility of the pseudo adiabats.
   * @returns {module:meteoJS/thermodynamicDiagram/tdDiagram.TDDiagram} this.
   */
  setPseudoadiabatsVisible(visible) {
    this.options.pseudoadiabats.visible = visible ? true : false;
    this.plotPseudoadiabats();
    return this;
  }
  
  /**
   * Return the visibility of the mixing ratio.
   * @returns {boolean} Visibility of the mixing ratio.
   */
  getMixingratioVisible() {
    return this.options.mixingratio.visible;
  }
  
  /**
   * Sets the visibility of the mixing ratio.
   * @param {boolean} visible Visibility of the mixing ratio.
   * @returns {module:meteoJS/thermodynamicDiagram/tdDiagram.TDDiagram} this.
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
    
    const parcelsGroup = this._parcels.get(sounding).parcelsGroup;
    parcelsGroup.clear();
    for (let parcel of sounding.sounding.parcelCollection)
      this.drawParcel(sounding, parcel, parcelsGroup.group());
  }
  
  /**
   * Draws a parcel lift.
   * 
   * @param {module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding}
   *   sounding - Corresponding sounding.
   * @param {module:meteoJS/sounding/parcel.Parcel}
   *   parcel - Parcel lift to draw.
   * @param {external:SVG} group - SVG group to draw parcel into.
   * @private
   */
  drawParcel(sounding, parcel, group) {
    if (parcel.pres === undefined ||
        parcel.tmpc === undefined ||
        parcel.dwpc === undefined)
      return;
    
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
    
    const options = sounding.getParcelOptions(parcel);
    
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
  drawBackground(svgNode) {
    super.drawBackground(svgNode);
    
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
   * @internal
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
        interval: (delta > 500) ? 50 : (delta > 50) ? 10 : 1
      },
      function (p) {
        let y = this.coordinateSystem.getYByXP(0, p);
        return [[0, y], [this.coordinateSystem.width, y]];
      },
      redraw
    );
  }
  
  /**
   * @internal
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
        interval: (delta > 50) ? 5 : 1
      },
      function (T) {
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
   * @internal
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
      function (T) {
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
   * @internal
   */
  plotPseudoadiabats(redraw) {
    this._plotLines(
      this.svgGroups.pseudoadiabats,
      this.options.pseudoadiabats,
      {
        lines: [-18, -5, 10, 30, 60, 110, 180]
      },
      function (thetae) {
        let thetaeKelvin = tempCelsiusToKelvin(thetae);
        let y0 = 0;
        let x0 = this.coordinateSystem.getXByYEquiPotTemp(y0, thetaeKelvin);
        let y1 = this.coordinateSystem.height;
        let x1 = this.coordinateSystem.getXByYEquiPotTemp(y1, thetaeKelvin);
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
   * @internal
   */
  plotMixingratio(redraw) {
    this._plotLines(
      this.svgGroups.mixingratio,
      this.options.mixingratio,
      {
        lines: [0.01, 0.1, 1, 2, 4, 7, 10, 16, 21, 32, 40]
      },
      function (hmr) {
        let y0 = 0;
        let x0 = this.coordinateSystem.getXByYHMR(y0, hmr);
        let y1 = this.coordinateSystem.height;
        let x1 = this.coordinateSystem.getXByYHMR(y1, hmr);
        let points = [[x0, y0]];
        let yInterval = 10;
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
   * @internal
   */
  _plotLines(node, options, valuesOptions, pointsFunc, redraw) {
    node.style('display', options.visible ? 'inline' : 'none');
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
    snapToData = true,
    remote = true,
    insertLabelsFunc = undefined,
    pres = {},
    temp = {},
    dewp = {},
    wetbulb = {}
  }) {
    if (!('visible' in pres))
      pres.visible = true;
    if (!('style' in pres))
      pres.style = {};
    if (!('font' in pres))
      pres.font = {};
    pres.length = ('length' in pres) ? pres.length : 10;
    pres.align = ('align' in pres) ? pres.align : 'left';
    if (pres.font.anchor === undefined)
      pres.font.anchor = (pres.align == 'right') ? 'end' : 'start';
    if (!('visible' in temp))
      temp.visible = true;
    if (!('style' in temp))
      temp.style = {};
    if (!('font' in temp))
      temp.font = {};
    if (temp.font['alignment-baseline'] === undefined)
      temp.font['alignment-baseline'] = 'bottom';
    temp.radius = ('radius' in temp) ? temp.radius : undefined;
    temp.radiusPlus = ('radiusPlus' in temp) ? temp.radiusPlus : 2;
    if (temp.font.anchor === undefined)
      temp.font.anchor = 'start';
    if (!('visible' in dewp))
      dewp.visible = true;
    if (!('style' in dewp))
      dewp.style = {};
    if (!('font' in dewp))
      dewp.font = {};
    if (dewp.font['alignment-baseline'] === undefined)
      dewp.font['alignment-baseline'] = 'bottom';
    dewp.radius = ('radius' in dewp) ? dewp.radius : undefined;
    dewp.radiusPlus = ('radiusPlus' in dewp) ? dewp.radiusPlus : 2;
    if (dewp.font.anchor === undefined)
      dewp.font.anchor = 'end';
    if (!('visible' in wetbulb))
      wetbulb.visible = true;
    if (!('style' in wetbulb))
      wetbulb.style = {};
    if (!('font' in wetbulb))
      wetbulb.font = {};
    wetbulb.radius = ('radius' in wetbulb) ? wetbulb.radius : undefined;
    wetbulb.radiusPlus = ('radiusPlus' in wetbulb) ? wetbulb.radiusPlus : 2;
    if (wetbulb.font.anchor === undefined)
      wetbulb.font.anchor = 'middle';
    
    if (insertLabelsFunc === undefined)
      insertLabelsFunc =
        this._makeInsertLabelsFunc(pres, temp, dewp, wetbulb);
    
    super._initHoverLabels({
      visible,
      type,
      snapToData,
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
        drawPressureHoverLabelInto(group, levelData.pres, this.coordinateSystem, pres);
      
      this.dataGroupIds.forEach(dataGroupId => {
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
          font: labelOptions.font
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
 * @param {module:meteoJS/thermodynamicDiagram/tdDiagram~presLabelOptions}
 *   [options] - Options.
 */
export function drawPressureHoverLabelInto(svgNode, pres, coordinateSystem, {
  length = 10,
  align = 'left',
  style = {},
  font = {}
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
    coordinateSystem.getYByXP(0, pres);
  svgNode
    .line([
      [Math.min(x0, x1), y],
      [Math.max(x0, x1), y]
    ])
    .stroke(style);
  drawTextInto({
    node: svgNode,
    text: `${Math.round(pres)} hPa`,
    x: x0,
    y,
    font
  });
}

function getNormalizedDiagramLineOptions({
  highlightedLines = undefined,
  interval = undefined,
  lines = undefined,
  max = undefined,
  min = undefined,
  style = {},
  visible = true
}) {
  return {
    highlightedLines,
    interval,
    lines,
    max,
    min,
    style: getNormalizedDiagramStyleOptions(style),
    visible
  };
}

function getNormalizedDiagramStyleOptions({
  color = undefined,
  width = 1,
  opacity = undefined,
  linecap = undefined,
  linejoin = undefined,
  dasharray = undefined
}) {
  return {
    color,
    width,
    opacity,
    linecap,
    linejoin,
    dasharray
  };
}