/**
 * @module meteoJS/thermodynamicDiagram/tdDiagram
 */

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
meteoJS.thermodynamicDiagram.tdDiagram = function (main, options) {
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
};

meteoJS.thermodynamicDiagram.tdDiagram.prototype.getX = function () {
  return this.options.x;
};
meteoJS.thermodynamicDiagram.tdDiagram.prototype.getY = function () {
  return this.options.y;
};
meteoJS.thermodynamicDiagram.tdDiagram.prototype.getWidth = function () {
  return this.cos.getWidth();
};
meteoJS.thermodynamicDiagram.tdDiagram.prototype.getHeight = function () {
  return this.cos.getHeight();
};

/**
 * @internal
 */
meteoJS.thermodynamicDiagram.tdDiagram.prototype.plotGuideLines = function () {
  // Rand des Diagramms
  this.svgGroups.border.clear();
  var diagramBorder = this.svgGroups.border
    .rect(this.cos.getWidth(), this.cos.getHeight())
    .attr({stroke: 'black', 'stroke-width': 1, 'fill-opacity': 0});
  
  // Hilfelinien zeichnen
  this.plotIsobars();
  this.plotIsotherms();
  this.plotDryadiabats();
  this.plotPseudoadiabats();
  this.plotMixingratio();
};

/**
 * @internal
 */
meteoJS.thermodynamicDiagram.tdDiagram.prototype.plotIsobars = function () {
  var min = this.cos.getPByXY(0, this.cos.getHeight());
  var max = this.cos.getPByXY(0, 0);
  var delta = max - min;
  this._plotLines(this.svgGroups.isobars,
    this.options.isobars,
    min, max,
    (delta > 500) ? 50 : (delta > 50) ? 10 : 1,
    function (p) {
      var y = this.cos.getYByXP(0, p);
      return [[0, y], [this.cos.getWidth(), y]];
    }
  );
};

/**
 * @internal
 */
meteoJS.thermodynamicDiagram.tdDiagram.prototype.plotIsotherms = function () {
  var min = meteoJS.calc.tempKelvinToCelsius(
              this.cos.getTByXY(0, this.cos.getHeight()));
  var max = meteoJS.calc.tempKelvinToCelsius(
              this.cos.getTByXY(this.cos.getWidth(), 0));
  var delta = max - min;
  this._plotLines(this.svgGroups.isotherms,
    this.options.isotherms,
    min, max,
    (delta > 50) ? 5 : 1,
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
    }
  );
};

/**
 * @internal
 */
meteoJS.thermodynamicDiagram.tdDiagram.prototype.plotDryadiabats = function () {
  var min =
    meteoJS.calc.tempKelvinToCelsius(
      meteoJS.calc.potentialTempByTempAndPres(
        this.cos.getTByXY(0, 0),
        this.cos.getPByXY(0, 0)));
  var max =
    meteoJS.calc.tempKelvinToCelsius(
      meteoJS.calc.potentialTempByTempAndPres(
        this.cos.getTByXY(this.cos.getWidth(), this.cos.getHeight()),
        this.cos.getPByXY(this.cos.getWidth(), this.cos.getHeight())));
  var delta = max - min;
  this._plotLines(this.svgGroups.dryadiabats,
    this.options.dryadiabats,
    min, max,
    10,
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
    }
  );
};

/**
 * @internal
 */
meteoJS.thermodynamicDiagram.tdDiagram.prototype.plotPseudoadiabats = function () {
  var min = -30;
  var max = 35;
  var delta = max - min;
  this._plotLines(this.svgGroups.pseudoadiabats,
    this.options.pseudoadiabats,
    min, max,
    5,
    function (thetae) {
      var thetaeKelvin = meteoJS.calc.tempCelsiusToKelvin(thetae);
      var y0 = 0;
      var x0 = this.cos.getXByYEquiPotTemp(y0, thetaeKelvin);
      if (x0 < 0)
        y0 = this.cos.getYByYEquiPotTemp(x0 = 0, thetaeKelvin);
      if (this.cos.getWidth() < x0)
        y0 = this.cos.getYByYEquiPotTemp(x0 = this.cos.getWidth(), thetaeKelvin);
      var y1 = this.cos.getHeight();
      var x1 = this.cos.getXByYEquiPotTemp(y1, thetaeKelvin);
      if (x1 < 0)
        y1 = this.cos.getYByYEquiPotTemp(x1 = 0, thetaeKelvin);
      if (x1 > this.cos.getWidth())
        y1 = this.cos.getYByYEquiPotTemp(x1 = this.cos.getWidth(), thetaeKelvin);
      /*node.plain(thetae).attr({
        y: this.cos.getHeight()-y0,
        x: x0,
        color: options.style.color
      });*/
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
    }
  );
};

/**
 * @internal
 */
meteoJS.thermodynamicDiagram.tdDiagram.prototype.plotMixingratio = function () {
  var min = 1;
  var max = 40;
  var delta = max - min;
  this._plotLines(this.svgGroups.mixingratio,
    this.options.mixingratio,
    min, max,
    1,
    function (hmr) {
      var y0 = 0;
      var x0 = this.cos.getXByYHMR(y0, hmr);
      if (x0 < 0)
        y0 = this.cos.getYByXHMR(x0 = 0, hmr);
      if (this.cos.getWidth() < x0)
        y0 = this.cos.getYByXHMR(x0 = this.cos.getWidth(), hmr);
      var y1 = this.cos.getHeight();
      var x1 = this.cos.getXByYHMR(y1, hmr);
      if (x1 < 0)
        y1 = this.cos.getYByXHMR(x1 = 0, hmr);
      if (x1 > this.cos.getWidth())
        y1 = this.cos.getYByXHMR(x1 = this.cos.getWidth(), hmr);
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
    }
  );
};

/**
 * @internal
 */
meteoJS.thermodynamicDiagram.tdDiagram.prototype._plotLines =
    function (node, options, min, max, fallbackInterval, pointsFunc) {
  node.clear();
  if (!options.visible)
    return;
  var lines = [];
  if (options.lines !== undefined)
    lines = options.lines;
  else {
    if (options.min !== undefined)
      min = options.min;
    if (options.max !== undefined)
      max = options.max;
    var interval = options.interval;
    if (interval === undefined)
      interval = fallbackInterval;
    var start = Math.ceil(min/interval)*interval;
    var end = Math.floor(max/interval)*interval;
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
};

/**
 * Adds Sounding to the thermodynamic diagram.
 * 
 * @internal
 * @param {meteoJS/thermodynamicDiagram/sounding} sounding Sounding object.
 */
meteoJS.thermodynamicDiagram.tdDiagram.prototype.addSounding = function (sounding) {
  sounding.on('change:visible', function (s) {
    this.drawSoundings();
  }, this);
  this.drawSoundings();
};

/**
 * @internal
 */
meteoJS.thermodynamicDiagram.tdDiagram.prototype.drawSoundings = function () {
  this.svgGroups.soundings.clear();
  this.main.soundings.forEach(function (sounding) {
    if (!sounding.visible() ||
        !sounding.options.diagram.visible)
      return;
  var tempPolylines = [];
  var dewpPolylines = [];
  sounding.getSounding().getLevels().forEach(function (level) {
    if (level === undefined)
      return;
    var levelData = sounding.getSounding().getData(level);
    if (levelData.ttt === undefined)
      return;
    if (tempPolylines.length == 0)
      tempPolylines.push([]);
    tempPolylines[tempPolylines.length-1].push([
      this.cos.getXByPT(level, levelData.ttt),
      this.cos.getHeight()-this.cos.getYByPT(level, levelData.ttt)
    ]);
    if (dewpPolylines.length == 0)
      dewpPolylines.push([]);
    dewpPolylines[dewpPolylines.length-1].push([
      this.cos.getXByPT(level, levelData.ttd),
      this.cos.getHeight()-this.cos.getYByPT(level, levelData.ttd)
    ]);
  }, this);
  tempPolylines.forEach(function (polyline) {
    this.svgGroups.soundings.polyline(polyline).fill('none').stroke(sounding.options.diagram.temp.style);
  }, this);
  dewpPolylines.forEach(function (polyline) {
    this.svgGroups.soundings.polyline(polyline).fill('none').stroke(sounding.options.diagram.dewp.style);
  }, this);
  }, this);
};