/**
 * @module meteoJS/thermodynamicDiagram/tdDiagram
 */
import $ from 'jquery';
import { tempCelsiusToKelvin,
  tempKelvinToCelsius,
  potentialTempByTempAndPres } from '../calc.js';

/**
 * Definition of the options for the constructor.
 * @typedef {Object} module:meteoJS/thermodynamicDiagram/tdDiagram~options
 * @param {boolean} visible Visibility of the thermodynamic diagram.
 * @param {undefined|integer} x Horizontal position of the thermodynamic diagram.
 * @param {undefined|integer} y Vertical position of the thermodynamic diagram.
 * @param {undefined|integer} width Width of the thermodynamic diagram.
 * @param {undefined|integer} height Height of the thermodynamic diagram.
 * @param {Object} isobars Isobars configuration.
 * @param {boolean} isobars.visible Isobars visibility.
 * @param {module:meteoJS/thermodynamicDiagram~lineStyleOptions} isobars.style
 *   Isobars ratio style.
 * @param {Object} isotherms Isotherms configuration.
 * @param {boolean} isotherms.visible Isotherms visibility.
 * @param {module:meteoJS/thermodynamicDiagram~lineStyleOptions} isotherms.style
 *   Isotherms style.
 * @param {Object} dryadiabats Dry adiabats configuration.
 * @param {boolean} dryadiabats.visible Dry adiabats visibility.
 * @param {meteoJS/thermodynamicDiagram~lineStyleOptions} dryadiabats.style
 *   Dry adiabats style.
 * @param {Object} pseudoadiabats Pseudo adiabats configuration.
 * @param {boolean} pseudoadiabats.visible Pseudo adiabats visibility.
 * @param {module:meteoJS/thermodynamicDiagram~lineStyleOptions} pseudoadiabats.style
 *   Pseudo adiabats style.
 * @param {Object} mixingratio Mixing ratio configuration.
 * @param {boolean} mixingratio.visible Mixing ratio visibility.
 * @param {module:meteoJS/thermodynamicDiagram~lineStyleOptions} mixingratio.style
 *   Mixing ratio style.
 */

/**
 * Class to draw the real thermodynamic diagram.
 * Constructed by {@link module:meteoJS/thermodynamicDiagram.ThermodynamicDiagram}.
 * 
 * Preconditions for options:
 * * x, y, width, height mustn't be undefined.
 */
export class TDDiagram {
  
  /**
   * 
   * @param {module:meteoJS/thermodynamicDiagram.ThermodynamicDiagram} main
   * @param {module:meteoJS/thermodynamicDiagram/tdDiagram~options} options
   *   Diagram options.
   */
  constructor(main, options) {
    this.options = $.extend(true, {
      visible: true,
      x: undefined,
      y: undefined,
      width: undefined,
      height: undefined,
      isobars: {
        highlightedLines: undefined,
        interval: undefined,
        lines: undefined,
        max: undefined,
        min: undefined,
        style: {
          color: undefined,
          width: 1,
          opacity: undefined,
          linecap: undefined,
          linejoin: undefined,
          dasharray: undefined
        },
        visible: true
      },
      isotherms: {
        highlightedLines: [tempCelsiusToKelvin(0)],
        interval: undefined,
        lines: undefined,
        max: undefined,
        min: undefined,
        style: {
          color: undefined,
          width: 1,
          opacity: undefined,
          linecap: undefined,
          linejoin: undefined,
          dasharray: undefined
        },
        visible: true
      },
      dryadiabats: {
        highlightedLines: undefined,
        interval: undefined,
        lines: undefined,
        max: undefined,
        min: undefined,
        style: {
          color: 'green',
          width: 1,
          opacity: undefined,
          linecap: undefined,
          linejoin: undefined,
          dasharray: undefined
        },
        visible: true
      },
      pseudoadiabats: {
        highlightedLines: undefined,
        interval: undefined,
        lines: undefined,
        max: undefined,
        min: undefined,
        style: {
          color: 'blue',
          width: 1,
          opacity: undefined,
          linecap: undefined,
          linejoin: undefined,
          dasharray: undefined
        },
        visible: true
      },
      mixingratio: {
        highlightedLines: undefined,
        interval: undefined,
        lines: undefined,
        max: undefined,
        min: undefined,
        style: {
          color: 'red',
          width: 1,
          opacity: undefined,
          linecap: undefined,
          linejoin: undefined,
          dasharray: undefined
        },
        visible: true
      }
    }, options);
  
    this.main = main;
    this.cos = main.getCoordinateSystem();
  
    // SVG-Gruppen initialisieren
    let svgNode = main.getSVGNode().nested()
      .attr({
        x: this.options.x,
        y: this.options.y,
        width: this.cos.getWidth(),
        height: this.cos.getHeight()
      })
      .style({ overflow: 'hidden' });
    this.svgGroups = {
      border: svgNode.group(),
      isobars: svgNode.group(),
      isotherms: svgNode.group(),
      dryadiabats: svgNode.group(),
      mixingratio: svgNode.group(),
      pseudoadiabats: svgNode.group(),
      soundings: svgNode.group()
    };
    this.plotGuideLines();
  }

  getX() {
    return this.options.x;
  }
  getY() {
    return this.options.y;
  }
  getWidth() {
    return this.cos.getWidth();
  }
  getHeight() {
    return this.cos.getHeight();
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
   * @internal
   */
  plotGuideLines() {
    Object.keys(this.svgGroups).forEach(function (key) {
      if (key == 'soundings')
        return;
      this.svgGroups[key].clear();
    }, this);
  
    // Rand des Diagramms
    this.svgGroups.border.clear();
    this.svgGroups.border
      .rect(this.cos.getWidth(), this.cos.getHeight())
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
    let min = this.cos.getPByXY(0, this.cos.getHeight());
    let max = this.cos.getPByXY(0, 0);
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
        let y = this.cos.getYByXP(0, p);
        return [[0, y], [this.cos.getWidth(), y]];
      },
      redraw
    );
  }

  /**
   * @internal
   */
  plotIsotherms(redraw) {
    let min = tempKelvinToCelsius(
      this.cos.getTByXY(0, this.cos.getHeight()));
    let max = tempKelvinToCelsius(
      this.cos.getTByXY(this.cos.getWidth(), 0));
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
        if (this.cos.isIsothermsVertical()) {
          result[0][1] = 0;
          result[1][1] = this.cos.getHeight();
          result[0][0] = result[1][0] = this.cos.getXByYT(result[0][1], T);
        }
        else {
          result[0][1] = 0;
          result[0][0] = this.cos.getXByYT(result[0][1], T);
          if (result[0][0] < 0)
            result[0][1] = this.cos.getYByXT(result[0][0] = 0, T);
          result[1][0] = this.cos.getWidth();
          result[1][1] = this.cos.getYByXT(result[1][0], T);
          if (result[1][1] === undefined) {
            result[1][0] = result[0][0];
            result[1][1] = this.cos.getHeight();
          }
          else if (result[1][1] > this.cos.getHeight()) {
            result[1][1] = this.cos.getHeight();
            result[1][0] = this.cos.getXByYT(result[1][1], T);
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
            this.cos.getTByXY(0, 0),
            this.cos.getPByXY(0, 0))),
        max: tempKelvinToCelsius(
          potentialTempByTempAndPres(
            this.cos.getTByXY(this.cos.getWidth(), this.cos.getHeight()),
            this.cos.getPByXY(this.cos.getWidth(), this.cos.getHeight()))),
        interval: 10
      },
      function (T) {
        let TKelvin = tempCelsiusToKelvin(T);
        let y0 = 0;
        let x0 = this.cos.getXByYPotentialTemperature(y0, TKelvin);
        if (x0 === undefined ||
          x0 > this.cos.getWidth()) {
          x0 = this.cos.getWidth();
          y0 = this.cos.getYByXPotentialTemperature(x0, TKelvin);
        }
        let x1 = 0;
        let y1 = this.cos.getYByXPotentialTemperature(x1, TKelvin);
        if (y1 === undefined ||
          y1 > this.cos.getHeight()) {
          y1 = this.cos.getHeight();
          x1 = this.cos.getXByYPotentialTemperature(y1, TKelvin);
        }
        if (x0 === undefined ||
          y0 === undefined ||
          x1 === undefined ||
          y1 === undefined)
          return undefined;
        if (this.cos.isDryAdiabatStraightLine()) {
          return [[x0, y0], [x1, y1]];
        }
        else {
          let points = [[x0, y0]];
          let yInterval = 10;
          for (let y=y0+yInterval; y<y1; y+=yInterval) {
            points.push([
              this.cos.getXByYPotentialTemperature(y, TKelvin),
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
        let x0 = this.cos.getXByYEquiPotTemp(y0, thetaeKelvin);
        let y1 = this.cos.getHeight();
        let x1 = this.cos.getXByYEquiPotTemp(y1, thetaeKelvin);
        let points = [[x0, y0]];
        let yInterval = 10;
        for (let y=y0+yInterval; y<y1; y+=yInterval) {
          points.push([
            this.cos.getXByYEquiPotTemp(y, thetaeKelvin),
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
        let x0 = this.cos.getXByYHMR(y0, hmr);
        let y1 = this.cos.getHeight();
        let x1 = this.cos.getXByYHMR(y1, hmr);
        let points = [[x0, y0]];
        let yInterval = 10;
        for (let y=y0+yInterval; y<y1; y+=yInterval) {
          points.push([
            this.cos.getXByYHMR(y, hmr),
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
        node.line(points[0][0], this.cos.getHeight()-points[0][1],
          points[1][0], this.cos.getHeight()-points[1][1])
          .stroke(options.style) :
        node.polyline(points.map(function (point) {
          point[1] = this.cos.getHeight() - point[1];
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
   * Adds Sounding to the thermodynamic diagram.
   * 
   * @internal
   * @param {module:meteoJS/thermodynamicDiagram/sounding.DiagramSounding} sounding Sounding object.
   */
  addSounding(sounding) {
    let group = this.svgGroups.soundings.group();
    sounding.on('change:visible', function () {
      group.style('display', this.visible() ? 'inline' : 'none');
    });
    sounding.trigger('change:visible');
  
    // Zeichnen
    let tempPolylines = [];
    let dewpPolylines = [];
    sounding.getSounding().getLevels().forEach(function (level) {
      if (level === undefined)
        return;
      let levelData = sounding.getSounding().getData(level);
      if (levelData.tmpk === undefined)
        return;
      if (tempPolylines.length == 0)
        tempPolylines.push([]);
      tempPolylines[tempPolylines.length-1].push([
        this.cos.getXByPT(level, levelData.tmpk),
        this.cos.getHeight()-this.cos.getYByPT(level, levelData.tmpk)
      ]);
      if (dewpPolylines.length == 0)
        dewpPolylines.push([]);
      dewpPolylines[dewpPolylines.length-1].push([
        this.cos.getXByPT(level, levelData.dwpk),
        this.cos.getHeight()-this.cos.getYByPT(level, levelData.dwpk)
      ]);
    }, this);
    tempPolylines.forEach(function (polyline) {
      group.polyline(polyline)
        .fill('none').stroke(sounding.options.diagram.temp.style);
    }, this);
    dewpPolylines.forEach(function (polyline) {
      group.polyline(polyline)
        .fill('none').stroke(sounding.options.diagram.dewp.style);
    }, this);
  }

}
export default TDDiagram;