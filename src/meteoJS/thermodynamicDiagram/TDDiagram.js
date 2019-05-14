/**
 * @module meteoJS/thermodynamicDiagram/tdDiagram
 */

import $ from 'jquery';

/**
 * Definition of the options for the constructor.
 * @typedef {Object} meteoJS/thermodynamicDiagram/tdDiagram~options
 * @param {boolean} visible Visibility of the thermodynamic diagram.
 * @param {undefined|integer} x Horizontal position of the thermodynamic diagram.
 * @param {undefined|integer} y Vertical position of the thermodynamic diagram.
 * @param {undefined|integer} width Width of the thermodynamic diagram.
 * @param {undefined|integer} height Height of the thermodynamic diagram.
 * @param {Object} isobars Isobars configuration.
 * @param {boolean} isobars.visible Isobars visibility.
 * @param {meteoJS/thermodynamicDiagram~lineStyleOptions} isobars.style
 *   Isobars ratio style.
 * @param {Object} isotherms Isotherms configuration.
 * @param {boolean} isotherms.visible Isotherms visibility.
 * @param {meteoJS/thermodynamicDiagram~lineStyleOptions} isotherms.style
 *   Isotherms style.
 * @param {Object} dryadiabats Dry adiabats configuration.
 * @param {boolean} dryadiabats.visible Dry adiabats visibility.
 * @param {meteoJS/thermodynamicDiagram~lineStyleOptions} dryadiabats.style
 *   Dry adiabats style.
 * @param {Object} pseudoadiabats Pseudo adiabats configuration.
 * @param {boolean} pseudoadiabats.visible Pseudo adiabats visibility.
 * @param {meteoJS/thermodynamicDiagram~lineStyleOptions} pseudoadiabats.style
 *   Pseudo adiabats style.
 * @param {Object} mixingratio Mixing ratio configuration.
 * @param {boolean} mixingratio.visible Mixing ratio visibility.
 * @param {meteoJS/thermodynamicDiagram~lineStyleOptions} mixingratio.style
 *   Mixing ratio style.
 */

/**
 * @classdesc
 * Class to draw the real thermodynamic diagram.
 * Called by meteoJS.thermodynamicDiagram.
 * 
 * Preconditions for options:
 * * x, y, width, height mustn't be undefined.
 * 
 * @constructor
 * @internal
 * @param {meteoJS.thermodynamicDiagram} main
 * @param {meteoJS/thermodynamicDiagram/tdDiagram~options} options
 *   Diagram options.
 */
export default class TDDiagram {

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
      highlightedLines: [meteoJS.calc.tempCelsiusToKelvin(0)],
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
  var svgNode = main.getSVGNode().nested()
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
 * @returns {meteoJS/thermodynamicDiagram/tdDiagram} this.
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
 * @returns {meteoJS/thermodynamicDiagram/tdDiagram} this.
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
 * @returns {meteoJS/thermodynamicDiagram/tdDiagram} this.
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
 * @returns {meteoJS/thermodynamicDiagram/tdDiagram} this.
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
 * @returns {meteoJS/thermodynamicDiagram/tdDiagram} this.
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
  var diagramBorder = this.svgGroups.border
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
  var min = this.cos.getPByXY(0, this.cos.getHeight());
  var max = this.cos.getPByXY(0, 0);
  var delta = max - min;
  this._plotLines(
    this.svgGroups.isobars,
    this.options.isobars,
    {
      min: min,
      max: max,
      interval: (delta > 500) ? 50 : (delta > 50) ? 10 : 1
    },
    function (p) {
      var y = this.cos.getYByXP(0, p);
      return [[0, y], [this.cos.getWidth(), y]];
    },
    redraw
  );
}

/**
 * @internal
 */
plotIsotherms(redraw) {
  var min = meteoJS.calc.tempKelvinToCelsius(
              this.cos.getTByXY(0, this.cos.getHeight()));
  var max = meteoJS.calc.tempKelvinToCelsius(
              this.cos.getTByXY(this.cos.getWidth(), 0));
  var delta = max - min;
  this._plotLines(
    this.svgGroups.isotherms,
    this.options.isotherms,
    {
      min: min,
      max: max,
      interval: (delta > 50) ? 5 : 1
    },
    function (T) {
      T = meteoJS.calc.tempCelsiusToKelvin(T);
      var result = [[undefined, undefined], [undefined, undefined]];
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
      min: meteoJS.calc.tempKelvinToCelsius(
             meteoJS.calc.potentialTempByTempAndPres(
               this.cos.getTByXY(0, 0),
               this.cos.getPByXY(0, 0))),
      max: meteoJS.calc.tempKelvinToCelsius(
             meteoJS.calc.potentialTempByTempAndPres(
               this.cos.getTByXY(this.cos.getWidth(), this.cos.getHeight()),
               this.cos.getPByXY(this.cos.getWidth(), this.cos.getHeight()))),
      interval: 10
    },
    function (T) {
      var TKelvin = meteoJS.calc.tempCelsiusToKelvin(T);
      var y0 = 0;
      var x0 = this.cos.getXByYPotentialTemperature(y0, TKelvin);
      if (x0 === undefined ||
          x0 > this.cos.getWidth()) {
        x0 = this.cos.getWidth();
        y0 = this.cos.getYByXPotentialTemperature(x0, TKelvin);
      }
      var x1 = 0;
      var y1 = this.cos.getYByXPotentialTemperature(x1, TKelvin);
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
        var points = [[x0, y0]];
        var yInterval = 10;
        for (var y=y0+yInterval; y<y1; y+=yInterval) {
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
      var thetaeKelvin = meteoJS.calc.tempCelsiusToKelvin(thetae);
      var y0 = 0;
      var x0 = this.cos.getXByYEquiPotTemp(y0, thetaeKelvin);
      var y1 = this.cos.getHeight();
      var x1 = this.cos.getXByYEquiPotTemp(y1, thetaeKelvin);
      var points = [[x0, y0]];
      var yInterval = 10;
      for (var y=y0+yInterval; y<y1; y+=yInterval) {
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
      var y0 = 0;
      var x0 = this.cos.getXByYHMR(y0, hmr);
      var y1 = this.cos.getHeight();
      var x1 = this.cos.getXByYHMR(y1, hmr);
      var points = [[x0, y0]];
      var yInterval = 10;
      for (var y=y0+yInterval; y<y1; y+=yInterval) {
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
  var lines = [];
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
    var interval = options.interval;
    if (interval === undefined)
      interval = valuesOptions.interval;
    var start = Math.ceil(valuesOptions.min/interval)*interval;
    var end = Math.floor(valuesOptions.max/interval)*interval;
    for (var v=start; v<=end; v+=interval) {
      lines.push(v);
    }
  }
  var highlightLineWidth = 3;
  if (options.style.width !== undefined)
    highlightLineWidth = options.style.width+2;
  lines.forEach(function (v) {
    var points = pointsFunc.call(this, v);
    var line = (points.length == 2) ?
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
 * @param {meteoJS/thermodynamicDiagram/sounding} sounding Sounding object.
 */
addSounding(sounding) {
  var group = this.svgGroups.soundings.group();
  sounding.on('change:visible', function () {
    group.style('display', this.visible() ? 'inline' : 'none');
  });
  sounding.trigger('change:visible');
  
  // Zeichnen
  var tempPolylines = [];
  var dewpPolylines = [];
  sounding.getSounding().getLevels().forEach(function (level) {
    if (level === undefined)
      return;
    var levelData = sounding.getSounding().getData(level);
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