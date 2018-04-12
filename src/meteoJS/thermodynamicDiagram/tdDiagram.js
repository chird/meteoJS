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
      visible: true,
      style: {
        color: undefined,
        width: 1,
        opacity: undefined,
        linecap: undefined,
        linejoin: undefined,
        dasharray: undefined
      }
    },
    isotherms: {
      visible: true,
      style: {
        color: undefined,
        width: 1,
        opacity: undefined,
        linecap: undefined,
        linejoin: undefined,
        dasharray: undefined
      }
    },
    dryadiabats: {
      visible: true,
      style: {
        color: 'green',
        width: 1,
        opacity: undefined,
        linecap: undefined,
        linejoin: undefined,
        dasharray: undefined
      }
    },
    pseudoadiabats: {
      visible: true,
      style: {
        color: 'blue',
        width: 1,
        opacity: undefined,
        linecap: undefined,
        linejoin: undefined,
        dasharray: undefined
      }
    },
    mixingratio: {
      visible: true,
      style: {
        color: 'red',
        width: 1,
        opacity: undefined,
        linecap: undefined,
        linejoin: undefined,
        dasharray: undefined
      }
    }
  }, options);
  
  this.main = main;
  this.cos = main.getCoordinateSystem();
  
  this.svgNode = main.getSVGNode().nested()
    .attr({
      x: this.options.x,
      y: this.options.y,
      width: this.options.width,
      height: this.options.height
    })
    .style({ overflow: 'hidden' });
  this.plotDiagram();
};

meteoJS.thermodynamicDiagram.tdDiagram.prototype.getX = function () {
  return this.options.x;
};
meteoJS.thermodynamicDiagram.tdDiagram.prototype.getY = function () {
  return this.options.y;
};
meteoJS.thermodynamicDiagram.tdDiagram.prototype.getWidth = function () {
  return this.options.width;
};
meteoJS.thermodynamicDiagram.tdDiagram.prototype.getHeight = function () {
  return this.options.height;
};

/**
 * @internal
 */
meteoJS.thermodynamicDiagram.tdDiagram.prototype.plotDiagram = function () {
  this.svgNode.clear();
  
  // Erster Diagramm-Versuch
  var diagramBorder = this.svgNode
    .rect(this.options.width, this.options.height)
    .attr({stroke: 'black', 'stroke-width': 1, 'fill-opacity': 0});
  
  this.svgIsobarsGroup = this.svgNode.group();
  this.svgIsothermsGroup = this.svgNode.group();
  this.svgDryadiabatsGroup = this.svgNode.group();
  this.svgMixingRatioGroup = this.svgNode.group();
  this.svgPseudoadiabatsGroup = this.svgNode.group();
  this.plotIsobars(this.svgIsobarsGroup, this.options.isobars);
  this.plotIsotherms(this.svgIsothermsGroup, this.options.isotherms);
  this.plotDryadiabats(this.svgDryadiabatsGroup, this.options.dryadiabats);
  this.plotMixingratio(this.svgMixingRatioGroup, this.options.mixingratio);
  this.plotPseudoadiabats(this.svgPseudoadiabatsGroup, this.options.pseudoadiabats);
  this.soundingsGroup = this.svgNode.group();
};

/**
 * @internal
 */
meteoJS.thermodynamicDiagram.tdDiagram.prototype.plotIsobars = function (node, options) {
  node.clear();
  if (!options.visible)
    return;
  var isobarsAzimut = 50;
  var minLevel = Math.ceil(this.cos.getPByXY(0, this.options.height)/isobarsAzimut)*isobarsAzimut;
  var maxLevel = Math.floor(this.cos.getPByXY(0, 0)/isobarsAzimut)*isobarsAzimut;
  for (var level=minLevel; level<=maxLevel; level+=isobarsAzimut) {
    var y = this.cos.getYByXP(0, level);
    node.line(0, this.options.height-y, this.options.width, this.options.height-y)
        .stroke(options.style);
  }
};

/**
 * @internal
 */
meteoJS.thermodynamicDiagram.tdDiagram.prototype.plotIsotherms = function (node, options) {
  node.clear();
  if (!options.visible)
    return;
  var isothermsAzimut = 5;
  var minT = Math.ceil(meteoJS.calc.tempKelvinToCelsius(this.cos.getTByXY(0, this.options.height))/isothermsAzimut)*isothermsAzimut;
  var maxT = Math.floor(meteoJS.calc.tempKelvinToCelsius(this.cos.getTByXY(this.options.width, 0))/isothermsAzimut)*isothermsAzimut;
  for (var T=minT; T<=maxT; T+=isothermsAzimut) {
    var TKelvin = meteoJS.calc.tempCelsiusToKelvin(T);
    var y0 = 0;
    var x0 = this.cos.getXByYT(y0, TKelvin);
    if (x0 < 0)
      y0 = this.cos.getYByXT(x0 = 0, TKelvin);
    var x1 = this.options.width;
    var y1 = this.cos.getYByXT(x1, TKelvin);
    if (y1 === undefined) {
      x1 = x0;
      y1 = this.options.height;
    }
    else if (y1 > this.options.height)
      x1 = this.cos.getXByYT(y1 = this.options.height, TKelvin);
    var isotherm =
      node.line(x0, this.options.height-y0, x1, this.options.height-y1)
          .stroke(options.style);
    if (T > -0.01 && T < 0.01)
      isotherm.attr({'stroke-width' : 3});
  }
};

/**
 * @internal
 */
meteoJS.thermodynamicDiagram.tdDiagram.prototype.plotDryadiabats = function (node, options) {
  node.clear();
  if (!options.visible)
    return;
  var dryadiabatsEquidistance = 10;
  var minT = meteoJS.calc.tempKelvinToCelsius(meteoJS.calc.potentialTempByTempAndPres(this.cos.getTByXY(0, 0), this.cos.getPByXY(0, 0)));
  minT = Math.ceil(minT/dryadiabatsEquidistance)*dryadiabatsEquidistance;
  var maxT = meteoJS.calc.tempKelvinToCelsius(meteoJS.calc.potentialTempByTempAndPres(this.cos.getTByXY(this.options.width, this.options.height), this.cos.getPByXY(this.options.width, this.options.height)));
  maxT = Math.floor(maxT/dryadiabatsEquidistance)*dryadiabatsEquidistance;
  for (var T=minT; T<=maxT; T+=dryadiabatsEquidistance) {
    var TKelvin = meteoJS.calc.tempCelsiusToKelvin(T);
    var y0 = 0;
    var x0 = this.cos.getXByYPotentialTemperature(y0, TKelvin);
    if (x0 === undefined ||
        x0 > this.options.width)
      y0 = this.cos.getYByXPotentialTemperature(x0 = this.options.width, TKelvin);
    var x1 = 0;
    var y1 = this.cos.getYByXPotentialTemperature(x1, TKelvin);
    if (y1 === undefined ||
        y1 > this.options.height)
      x1 = this.cos.getXByYPotentialTemperature(y1 = this.options.height, TKelvin);
    if (x0 === undefined ||
        y0 === undefined ||
        x1 === undefined ||
        y1 === undefined)
      continue;
    if (this.cos.isDryAdiabatStraightLine()) {
      node.line(x0, this.options.height-y0, x1, this.options.height-y1)
          .stroke(options.style);
    }
    else {
      var points = [[x0, this.options.height-y0]];
      var pressureEquidistance = 10;
      var p0 = this.cos.getPByXY(x0, y0);
      var pStart = Math.floor(p0/pressureEquidistance)*pressureEquidistance;
      if (pStart == p0)
        pStart -= pressureEquidistance;
      var p1 = this.cos.getPByXY(x1, y1);
      var pEnd = Math.ceil(p1/pressureEquidistance)*pressureEquidistance;
      if (pEnd == p1)
        pEnd += pressureEquidistance;
      for (var p=pStart; p>=pEnd; p-=pressureEquidistance) {
        points.push([
          this.cos.getXByPPotentialTemperatur(p, TKelvin),
          this.options.height-this.cos.getYByPPotentialTemperatur(p, TKelvin)
        ]);
      }
      points.push([x1, this.options.height-y1]);
      node.polyline(points)
          .fill('none')
          .stroke(options.style);
    }
  }
};

/**
 * @internal
 */
meteoJS.thermodynamicDiagram.tdDiagram.prototype.plotPseudoadiabats = function (node, options) {
  node.clear();
  if (!options.visible)
    return;
  [-30, -15, 0, 10, 15, 20, 25, 30, 35].forEach(function (thetae) {
    var thetaeKelvin = meteoJS.calc.tempCelsiusToKelvin(thetae);
    var y0 = 0;
    var x0 = this.cos.getXByYEquiPotTemp(y0, thetaeKelvin);
    if (x0 < 0)
      y0 = this.cos.getYByYEquiPotTemp(x0 = 0, thetaeKelvin);
    if (this.options.width < x0)
      y0 = this.cos.getYByYEquiPotTemp(x0 = this.options.width, thetaeKelvin);
    var y1 = this.options.height;
    var x1 = this.cos.getXByYEquiPotTemp(y1, thetaeKelvin);
    if (x1 < 0)
      y1 = this.cos.getYByYEquiPotTemp(x1 = 0, thetaeKelvin);
    if (x1 > this.options.width)
      y1 = this.cos.getYByYEquiPotTemp(x1 = this.options.width, thetaeKelvin);
    node.plain(thetae).attr({
      y: this.options.height-y0,
      x: x0,
      color: options.style.color
    });
    var points = [[x0, this.options.height-y0]];
    var pressureEquidistance = 10;
    var p0 = this.cos.getPByXY(x0, y0);
    var pStart = Math.floor(p0/pressureEquidistance)*pressureEquidistance;
    if (pStart == p0)
      pStart -= pressureEquidistance;
    var p1 = this.cos.getPByXY(x1, y1);
    var pEnd = Math.ceil(p1/pressureEquidistance)*pressureEquidistance;
    if (pEnd == p1)
      pEnd += pressureEquidistance;
    for (var p=pStart; p>=pEnd; p-=pressureEquidistance) {
      points.push([
        this.cos.getXByPEquiPotTemp(p, thetaeKelvin),
        this.options.height-this.cos.getYByPEquiPotTemp(p, thetaeKelvin)
      ]);
    }
    points.push([x1, this.options.height-y1]);
    node.polyline(points)
        .fill('none')
        .stroke(options.style);
  }, this);
};

/**
 * @internal
 */
meteoJS.thermodynamicDiagram.tdDiagram.prototype.plotMixingratio = function (node, options) {
  node.clear();
  if (!options.visible)
    return;
  [0.01, 0.1, 0.5, 1, 2, 4, 7, 10, 16, 21, 32, 40].forEach(function (hmr) {
    var y0 = 0;
    var x0 = this.cos.getXByYHMR(y0, hmr);
    if (x0 < 0)
      y0 = this.cos.getYByXHMR(x0 = 0, hmr);
    if (this.options.width < x0)
      y0 = this.cos.getYByXHMR(x0 = this.options.width, hmr);
    var y1 = this.options.height;
    var x1 = this.cos.getXByYHMR(y1, hmr);
    if (x1 < 0)
      y1 = this.cos.getYByXHMR(x1 = 0, hmr);
    if (x1 > this.options.width)
      y1 = this.cos.getYByXHMR(x1 = this.options.width, hmr);
    node.plain(hmr).attr({
      y: this.options.height-y0,
      x: x0
    });
    var points = [[x0, this.options.height-y0]];
    var pressureEquidistance = 10;
    var p0 = this.cos.getPByXY(x0, y0);
    var pStart = Math.floor(p0/pressureEquidistance)*pressureEquidistance;
    if (pStart == p0)
      pStart -= pressureEquidistance;
    var p1 = this.cos.getPByXY(x1, y1);
    var pEnd = Math.ceil(p1/pressureEquidistance)*pressureEquidistance;
    if (pEnd == p1)
      pEnd += pressureEquidistance;
    for (var p=pStart; p>=pEnd; p-=pressureEquidistance) {
      points.push([
        this.cos.getXByPHMR(p, hmr),
        this.options.height-this.cos.getYByPHMR(p, hmr)
      ]);
    }
    points.push([x1, this.options.height-y1]);
    node.polyline(points)
        .fill('none')
        .stroke(options.style);
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
  this.soundingsGroup.clear();
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
      this.options.height-this.cos.getYByPT(level, levelData.ttt)
    ]);
    if (dewpPolylines.length == 0)
      dewpPolylines.push([]);
    dewpPolylines[dewpPolylines.length-1].push([
      this.cos.getXByPT(level, levelData.ttd),
      this.options.height-this.cos.getYByPT(level, levelData.ttd)
    ]);
  }, this);
  tempPolylines.forEach(function (polyline) {
    this.soundingsGroup.polyline(polyline).fill('none').stroke(sounding.options.diagram.temp.style);
  }, this);
  dewpPolylines.forEach(function (polyline) {
    this.soundingsGroup.polyline(polyline).fill('none').stroke(sounding.options.diagram.dewp.style);
  }, this);
  }, this);
};