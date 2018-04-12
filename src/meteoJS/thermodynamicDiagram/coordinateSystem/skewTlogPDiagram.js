/**
 * @module meteoJS/thermodynamicDiagram/coordinateSystem/skewTlogPDiagram
 */

/**
 * @classdesc
 * Coordinate system for a skew-T-log-P diagram.
 * 
 * @constructor
 * @extends meteoJS/thermodynamicDiagram/coordinateSystem
 * @param {meteoJS/thermodynamicDiagram/coordinateSystem~options} options
 */
meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram = function (options) {
  this.options = $.extend(true, {
    width: 100,
    height: 100,
    pressure: {
      min: 100,
      max: 1000
    },
    temperature: {
      min: meteoJS.calc.tempCelsiusToKelvin(-40),
      max: meteoJS.calc.tempCelsiusToKelvin(45),
      reference: 'base'
    }
  }, options);
  this.parameterM = -this.options.height /
    (meteoJS.calc.altitudeISAByPres(this.options.pressure.max) -
     meteoJS.calc.altitudeISAByPres(this.options.pressure.min));
  this.parameterB = - this.parameterM * meteoJS.calc.altitudeISAByPres(this.options.pressure.max);
};

meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram.prototype
  .getMaxX = function () {
  return this.options.width;
};

meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram.prototype
  .getMaxY = function () {
  return this.options.height;
};

meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram.prototype
  .isIsobarsLine = function () {
  return true;
};

meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram.prototype
  .getPByXY = function (x, y) {
  var z = (y - this.parameterB) / this.parameterM;
  return Math.exp(Math.log(1 - z/44330.769)/0.19029496 + Math.log(1013.25));
};

meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram.prototype
  .getYByXP = function (x, p) {
  return this.parameterM*meteoJS.calc.altitudeISAByPres(p) + this.parameterB;
};

meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram.prototype
  .isIsothermsLine = function () {
  return true;
};

meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram.prototype
  .getXByYT = function (y, T) {
  var x0 = this.options.width/(this.options.temperature.max-this.options.temperature.min)*(T-this.options.temperature.min);
  return x0 + y;
};

meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram.prototype
  .getYByXT = function (x, T) {
  return x - this.getXByYT(0, T);
};

meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram.prototype
  .getXByPT = function (p, T) {
  return this.getXByYT(this.getYByXP(0, p), T);
};

meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram.prototype
  .getYByPT = function (p, T) {
  return this.getYByXP(0, p);
};

meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram.prototype
  .getTByXY = function (x, y) {
  var x0 = x - y;
  return x0*(this.options.temperature.max-this.options.temperature.min)/this.options.width + this.options.temperature.min;
};

meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram.prototype
  .getTByXP = function (x, p) {
  return this.getTByXY(x, this.getYByXP(x, p));
};

meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram.prototype
  .getYByXPotentialTemperature = function (x, T) {
  console.log(T);
  var a = this.getPByXY(x, 0);
  var b = this.getPByXY(x, this.options.height);
  while (a-b > 10) {
    var p = b+(a-b)/2;
    console.log(x + ','+ p + ' -> T=' + this.getTByXP(x, p) + ' -> Theta='+meteoJS.calc.potentialTempByTempAndPres(this.getTByXP(x, p), p));
    var potTemp = meteoJS.calc.potentialTempByTempAndPres(this.getTByXP(x, p), p);
    if (potTemp === undefined)
      return undefined;
    if (potTemp < T)
      b = p;
    else
      a = p;
  }
  var y = this.getYByXP(x, b+(a-b)/2);
  console.log(x + ', ' + T + ' -> ' + y + ' (T='+ this.getTByXY(x,y) +',' +meteoJS.calc.tempKelvinToCelsius(this.getTByXY(x,y)) +')');
  return y;
};

meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram.prototype
  .getXByYPotentialTemperature = function (y, T) {
  var T = meteoJS.calc.tempByPotentialTempAndPres(T, this.getPByXY(0, y));
  return this.getXByYT(y, T);
};

meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram.prototype
  .getXByYHMR = function (y, hmr) {
  var p = this.getPByXY(0, y); // P unabhängig von x
  return this.getXByYT(y, meteoJS.calc.dewpointByHMRAndPres(hmr, p));
};

meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram.prototype
  .getYByXHMR = function (x, hmr) {
  var a = this.getPByXY(x, 0);
  var b = this.getPByXY(x, this.options.height);
  while (a-b > 10) {
    var p = b+(a-b)/2;
    var hmrp = meteoJS.calc.saturationHMRByTempAndPres(this.getTByXP(x, p), p);
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