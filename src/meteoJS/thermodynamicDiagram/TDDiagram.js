/**
 * @module meteoJS/thermodynamicDiagram/tdDiagram
 */
import { tempCelsiusToKelvin,
  tempKelvinToCelsius,
  potentialTempByTempAndPres } from '../calc.js';
import PlotDataArea from './PlotDataArea.js';

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
 * @typedef {module:meteoJS/thermodynamicDiagram/plotDataArea~options}
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
 */

/**
 * Class to draw the real thermodynamic diagram.
 * 
 * @extends {module:meteoJS/thermodynamicDiagram/plotDataArea.PlotDataArea}
 */
export class TDDiagram extends PlotDataArea {
  
  /**
   * @param {module:meteoJS/thermodynamicDiagram/tdDiagram~options} options
   *   Options.
   */
  constructor({
    svgNode,
    coordinateSystem,
    x,
    y,
    width,
    height,
    style = {},
    visible = true,
    isobars = {},
    isotherms = {},
    dryadiabats = {},
    pseudoadiabats = {},
    mixingratio = {}
  }) {
    super({
      svgNode,
      coordinateSystem,
      x,
      y,
      width,
      height,
      style,
      visible,
      getSoundingVisibility:
        sounding => sounding.visible && sounding.options.diagram.visible
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
    
    // Zeichnen
    let tempPolylines = [];
    let dewpPolylines = [];
    sounding.sounding.getLevels().forEach(level => {
      if (level === undefined)
        return;
      let levelData = sounding.sounding.getData(level);
      if (levelData.tmpk === undefined)
        return;
      if (tempPolylines.length == 0)
        tempPolylines.push([]);
      tempPolylines[tempPolylines.length-1].push([
        this.coordinateSystem.getXByPT(level, levelData.tmpk),
        this.coordinateSystem.getHeight()-this.coordinateSystem.getYByPT(level, levelData.tmpk)
      ]);
      if (dewpPolylines.length == 0)
        dewpPolylines.push([]);
      dewpPolylines[dewpPolylines.length-1].push([
        this.coordinateSystem.getXByPT(level, levelData.dwpk),
        this.coordinateSystem.getHeight()-this.coordinateSystem.getYByPT(level, levelData.dwpk)
      ]);
    });
    tempPolylines.forEach(polyline => {
      group.polyline(polyline)
        .fill('none').stroke(sounding.options.diagram.temp.style);
    });
    dewpPolylines.forEach(polyline => {
      group.polyline(polyline)
        .fill('none').stroke(sounding.options.diagram.dewp.style);
    });
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
      .rect(this.coordinateSystem.getWidth(), this.coordinateSystem.getHeight())
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
    let min = this.coordinateSystem.getPByXY(0, this.coordinateSystem.getHeight());
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
        return [[0, y], [this.coordinateSystem.getWidth(), y]];
      },
      redraw
    );
  }
  
  /**
   * @internal
   */
  plotIsotherms(redraw) {
    let min = tempKelvinToCelsius(
      this.coordinateSystem.getTByXY(0, this.coordinateSystem.getHeight()));
    let max = tempKelvinToCelsius(
      this.coordinateSystem.getTByXY(this.coordinateSystem.getWidth(), 0));
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
          result[1][1] = this.coordinateSystem.getHeight();
          result[0][0] = result[1][0] = this.coordinateSystem.getXByYT(result[0][1], T);
        }
        else {
          result[0][1] = 0;
          result[0][0] = this.coordinateSystem.getXByYT(result[0][1], T);
          if (result[0][0] < 0)
            result[0][1] = this.coordinateSystem.getYByXT(result[0][0] = 0, T);
          result[1][0] = this.coordinateSystem.getWidth();
          result[1][1] = this.coordinateSystem.getYByXT(result[1][0], T);
          if (result[1][1] === undefined) {
            result[1][0] = result[0][0];
            result[1][1] = this.coordinateSystem.getHeight();
          }
          else if (result[1][1] > this.coordinateSystem.getHeight()) {
            result[1][1] = this.coordinateSystem.getHeight();
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
            this.coordinateSystem.getTByXY(this.coordinateSystem.getWidth(), this.coordinateSystem.getHeight()),
            this.coordinateSystem.getPByXY(this.coordinateSystem.getWidth(), this.coordinateSystem.getHeight()))),
        interval: 10
      },
      function (T) {
        let TKelvin = tempCelsiusToKelvin(T);
        let y0 = 0;
        let x0 = this.coordinateSystem.getXByYPotentialTemperature(y0, TKelvin);
        if (x0 === undefined ||
          x0 > this.coordinateSystem.getWidth()) {
          x0 = this.coordinateSystem.getWidth();
          y0 = this.coordinateSystem.getYByXPotentialTemperature(x0, TKelvin);
        }
        let x1 = 0;
        let y1 = this.coordinateSystem.getYByXPotentialTemperature(x1, TKelvin);
        if (y1 === undefined ||
          y1 > this.coordinateSystem.getHeight()) {
          y1 = this.coordinateSystem.getHeight();
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
        let y1 = this.coordinateSystem.getHeight();
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
        let y1 = this.coordinateSystem.getHeight();
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
        node.line(points[0][0], this.coordinateSystem.getHeight()-points[0][1],
          points[1][0], this.coordinateSystem.getHeight()-points[1][1])
          .stroke(options.style) :
        node.polyline(points.map(function (point) {
          point[1] = this.coordinateSystem.getHeight() - point[1];
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
  
}
export default TDDiagram;

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