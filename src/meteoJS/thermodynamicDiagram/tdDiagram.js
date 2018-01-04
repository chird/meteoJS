/**
 * @module meteoJS/thermodynamicDiagram/tdDiagram
 */

/**
 * Definition of the options for the constructor.
 * @typedef {Object} meteoJS/thermodynamicDiagram/tdDiagram~options
 * @param {meteoJS/thermodynamicDiagram/coordinateSystem|string} type
 * @param {} diagram.x
 * @param {} diagram.y
 * @param {} diagram.width
 * @param {} diagram.height
 */

/**
 * @classdesc
 * Class to draw the actual thermodynamic diagram.
 * Called by meteoJS.thermodynamicDiagram.
 * 
 * @constructor
 * @internal
 * @param {SVG} svgNode SVG-Node to render diagram into.
 * @param {meteoJS/thermodynamicDiagram/tdDiagram~options} options
 *   Diagram options.
 */
meteoJS.thermodynamicDiagram.tdDiagram = function (svgNode, options) {
  this.options = $.extend(true, {
    x: 0,
    y: 0,
    width: 100,
    height: 100
  }, options);
  
  this.cos = new meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram({ //stueveDiagram({
    width: this.options.width,
    height: this.options.height,
    maxPLevel: 1050,
    minPLevel: 100
  });
  this.svgNode = svgNode.nested()
    .attr({
      x: this.options.x,
      y: this.options.y,
      width: this.options.width,
      height: this.options.height
    });
  this.plotDiagram();
};

meteoJS.thermodynamicDiagram.tdDiagram.prototype.getCoordinateSystem = function () {
  return this.cos;
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
    /*svgIsobarGroup
      .rect(70, 30).attr({x: 10, y: this.options.height-y-15})
      .attr({stroke: 'black', 'stroke-width': 1, 'fill-opacity': 0});*/
    svgIsobarGroup
      .text(level + ' hPa')
      .attr({x: 10, y: this.options.height-y-15, 'alignment-baseline': 'middle'});
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
  var svgMixingRatioGroup = this.svgNode.group().attr({stroke: 'red'});
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
  }, this);
};