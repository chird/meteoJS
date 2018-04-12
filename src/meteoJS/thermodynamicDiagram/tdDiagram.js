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
 * 
 * Noch integrieren:
 * @param {Object} xAxis
 * @param {} xAxis.min [?] Einheit
 * @param {} xAxis.max [?] Einheit
 * @param {} xAxis.isotherms ?gehört eigentlich eher in die diagram dings rein
 * @param {} xAxis.isotherms.color
 * @param {} xAxis.dryadiabats ?name?
 * @param {} xAxis.dryadiabats.color
 * @param {} xAxis.pseudoadiabats ?name?
 * @param {} xAxis.pseudoadiabats.color
 * @param {} xAxis.mixingratio ?name?
 * @param {} xAxis.mixingratio.color ?in ein style-Objekt integrieren?
 * @param {Object} xAxis.title
 * @param {string|undefined} xAxis.title.text
 * @param {Object} yAxis
 * @param {} yAxis.min [hPa]
 * @param {} yAxis.max [hPa]
 * @param {Object} yAxis.isobars
 * @param {} yAxis.isobars.color
 * @param {Object} yAxis.title
 * @param {string|undefined} yAxis.title.text
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
    height: undefined
  }, options);
  
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
  // Isobars
  var svgIsobarGroup = this.svgNode.group();
  var isobarsAzimut = 50;
  var minLevel = Math.ceil(this.cos.getPByXY(0, this.options.height)/isobarsAzimut)*isobarsAzimut;
  var maxLevel = Math.floor(this.cos.getPByXY(0, 0)/isobarsAzimut)*isobarsAzimut;
  for (var level=minLevel; level<=maxLevel; level+=isobarsAzimut) {
    var y = this.cos.getYByXP(0, level);
    svgIsobarGroup
      .line(0, this.options.height-y, this.options.width, this.options.height-y)
      .attr({stroke: 'black', 'stroke-width': 1});
  }
  
  // Isotherms
  var svgIsothermGroup = this.svgNode.group();
  var isothermsAzimut = 5;
  var minT = Math.ceil(srfJS.ap.tempKelvinToCelsius(this.cos.getTByXY(0, this.options.height))/isothermsAzimut)*isothermsAzimut;
  var maxT = Math.floor(srfJS.ap.tempKelvinToCelsius(this.cos.getTByXY(this.options.width, 0))/isothermsAzimut)*isothermsAzimut;
  for (var T=minT; T<=maxT; T+=isothermsAzimut) {
    var TKelvin = srfJS.ap.tempCelsiusToKelvin(T);
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
    var isotherm = svgIsothermGroup
      .line(x0, this.options.height-y0, x1, this.options.height-y1)
      .attr({stroke: 'black', 'stroke-width': 1});
    if (T > -0.01 && T < 0.01)
      isotherm.attr({'stroke-width' : 3});
  }
  
  // Dry Adiabats
  /*var svgDryadiabatGroup = this.svgNode.group();
  var dryadiabatsAzimut = 5;
  var minT = srfJS.ap.tempKelvinToCelsius(srfJS.ap.potentialTempByTempAndPres(this.cos.getTByXY(0, 0), this.cos.getPByXY(0, 0)));
  minT = Math.ceil(minT/dryadiabatsAzimut)*dryadiabatsAzimut;
  var maxT = srfJS.ap.tempKelvinToCelsius(srfJS.ap.potentialTempByTempAndPres(this.cos.getTByXY(this.options.width, this.options.height), this.cos.getPByXY(this.options.width, this.options.height)));
  maxT = Math.floor(maxT/dryadiabatsAzimut)*dryadiabatsAzimut;
  for (var T=minT; T<=maxT; T+=dryadiabatsAzimut) {
    var TKelvin = srfJS.ap.tempCelsiusToKelvin(T);
    var y0 = 0;
    var x0 = this.cos.getXByYPotentialTemperature(0, TKelvin);
    if (x0 > this.options.width)
      y0 = this.cos.getYByXPotentialTemperature(x0 = this.options.width, TKelvin);
    var x1 = 0;
    var y1 = this.cos.getYByXPotentialTemperature(x1, TKelvin);
    if (y1 > this.options.height)
      x1 = this.cos.getXByYPotentialTemperature(y1 = this.options.height, TKelvin);
    console.log([T, TKelvin, x0, y0, x1, y1]);
    svgDryadiabatGroup
      .line(x0, this.options.height-y0, x1, this.options.height-y1)
      .attr({stroke: 'black', 'stroke-width': 1});
  }*/
  
  // Mixing ratio
  /*var svgMixingRatioGroup = this.svgNode.group().attr({stroke: 'red'});
  var mixingRatioAzimut = 0.1;
  var minT = this.cos.getTByXY(0, 0);
  var maxT = this.cos.getTByXY(this.options.width, 0);
  var minHMR = srfJS.ap.saturationHMRByTempAndPres(minT, this.cos.getPByXY(0,0));
  minHMR = Math.ceil(minHMR/mixingRatioAzimut)*mixingRatioAzimut;
  var maxHMR = srfJS.ap.saturationHMRByTempAndPres(maxT, this.cos.getPByXY(this.options.width,0));
  maxHMR = Math.ceil(maxHMR/mixingRatioAzimut)*mixingRatioAzimut;
  [0.01, 0.1, 1, 2, 4, 7, 10, 16, 21, 32, 40].forEach(function (hmr) {
    var y0 = 0;
    var x0 = this.cos.getXByYHMR(y0, hmr);
    var y1 = this.options.height;
    var x1 = this.cos.getXByYHMR(y1, hmr);
    if (x1 > this.options.width)
      y1 = this.cos.getYByXHMR(x1 = this.options.width, hmr);
    svgMixingRatioGroup
      .line(x0, this.options.height-y0, x1, this.options.height-y1);
      //.attr({stroke: 'black', 'stroke-width': 1});
  }, this);*/
};
meteoJS.thermodynamicDiagram.tdDiagram.prototype.addSounding = function (sounding, options) {
  var tempPolylines = [];
  var dewpPolylines = [];
  sounding.getLevels().forEach(function (level) {
    if (level === undefined)
      return;
    var levelData = sounding.getData(level);
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
      console.log(polyline);
    this.svgNode.polyline(polyline).fill('none').stroke(options.temp.style);
  }, this);
  dewpPolylines.forEach(function (polyline) {
    this.svgNode.polyline(polyline).fill('none').stroke(options.dewp.style);
  }, this);
};