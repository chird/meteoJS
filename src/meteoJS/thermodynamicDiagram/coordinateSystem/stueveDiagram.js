/**
 * @module meteoJS/thermodynamicDiagram/coordinateSystem/stueveDiagram
 */

/**
 * @classdesc
 * Class to represent the coordinate system of a Stüve-Diagram.
 * https://en.wikipedia.org/wiki/St%C3%BCve_diagram
 * 
 * @constructor
 */
meteoJS.thermodynamicDiagram.coordinateSystem.stueveDiagram = function (options) {
  this.options = $.extend(true, {
    width: 100,
    height: 100,
    maxPLevel: 1000,
    minPLevel: 100,
    minT: srfJS.ap.tempCelsiusToKelvin(-80),
    maxT: srfJS.ap.tempCelsiusToKelvin(40)
  }, options);
  this.parameterB = Math.log(this.options.maxPLevel/this.options.minPLevel)/(this.options.maxPLevel-this.options.minPLevel);
  this.parameterA = this.options.maxPLevel / Math.exp(this.parameterB * this.options.maxPLevel);
  this.parameterC = this.options.height/(1-this.options.minPLevel/this.options.maxPLevel);
};

meteoJS.thermodynamicDiagram.coordinateSystem.stueveDiagram.prototype
  .getMaxX = function () {
  return this.options.width;
};

meteoJS.thermodynamicDiagram.coordinateSystem.stueveDiagram.prototype
  .getMaxY = function () {
  return this.options.height;
};

meteoJS.thermodynamicDiagram.coordinateSystem.stueveDiagram.prototype
  .isIsobarsLine = function () {
  return true;
};

meteoJS.thermodynamicDiagram.coordinateSystem.stueveDiagram.prototype
  .getPByXY = function (x, y) {
  return Math.log(this.options.maxPLevel/this.parameterA*(this.parameterC-y)/this.parameterC)/this.parameterB;
};

meteoJS.thermodynamicDiagram.coordinateSystem.stueveDiagram.prototype
  .getYByXP = function (x, p) {
  var y0 = this.parameterA * Math.exp(this.parameterB * p);
  return -this.parameterC/this.options.maxPLevel * y0 + this.parameterC;
};

meteoJS.thermodynamicDiagram.coordinateSystem.stueveDiagram.prototype
  .isIsothermsLine = function () {
  return true;
};

meteoJS.thermodynamicDiagram.coordinateSystem.stueveDiagram.prototype
  .getXByYT = function (y, T) {
  return this.options.width/(this.options.maxT-this.options.minT)*(T-this.options.minT);
};

meteoJS.thermodynamicDiagram.coordinateSystem.stueveDiagram.prototype
  .getYByXT = function (x, T) {
  return 0;
};

meteoJS.thermodynamicDiagram.coordinateSystem.stueveDiagram.prototype
  .getTByXY = function (x, y) {
  return x*(this.options.maxT-this.options.minT)/this.options.width + this.options.minT;
};

meteoJS.thermodynamicDiagram.coordinateSystem.stueveDiagram.prototype
  .getTByXP = function (x, p) {
  return this.getTByXY(x, this.getYByXP(x, p));
};

meteoJS.thermodynamicDiagram.coordinateSystem.stueveDiagram.prototype
  .getYByXPotentialTemperature = function (x, T) {
  console.log(T);
  var a = this.getPByXY(x, 0);
  var b = this.getPByXY(x, this.options.height);
  while (a-b > 10) {
    var p = b+(a-b)/2;
    console.log(x + ','+ p + ' -> T=' + this.getTByXP(x, p) + ' -> Theta='+srfJS.ap.potentialTempByTempAndPres(this.getTByXP(x, p), p));
    var potTemp = srfJS.ap.potentialTempByTempAndPres(this.getTByXP(x, p), p);
    if (potTemp === undefined)
      return undefined;
    if (potTemp < T)
      b = p;
    else
      a = p;
  }
  var y = this.getYByXP(x, b+(a-b)/2);
  console.log(x + ', ' + T + ' -> ' + y + ' (T='+ this.getTByXY(x,y) +',' +srfJS.ap.tempKelvinToCelsius(this.getTByXY(x,y)) +')');
  return y;
};

meteoJS.thermodynamicDiagram.coordinateSystem.stueveDiagram.prototype
  .getXByYPotentialTemperature = function (y, T) {
  var T = srfJS.ap.tempByPotentialTempAndPres(T, this.getPByXY(0, y));
  return this.getXByYT(y, T);
};

meteoJS.thermodynamicDiagram.coordinateSystem.stueveDiagram.prototype
  .getXByYHMR = function (y, hmr) {
  var p = this.getPByXY(0, y); // P unabhängig von x
  return this.getXByYT(y, srfJS.ap.dewpointByHMRAndPres(hmr, p));
};

meteoJS.thermodynamicDiagram.coordinateSystem.stueveDiagram.prototype
  .getYByXHMR = function (x, hmr) {
  var a = this.getPByXY(x, 0);
  var b = this.getPByXY(x, this.options.height);
  while (a-b > 10) {
    var p = b+(a-b)/2;
    var hmrp = srfJS.ap.saturationHMRByTempAndPres(this.getTByXP(x, p), p);
    if (hmrp === undefined)
      return undefined;
    if (hmrp < hmr)
      b = p;
    else
      a = p;
  }
  var y = this.getYByXP(x, b+(a-b)/2);
  return y;
};