/**
 * @module meteoJS/thermodynamicDiagram/coordinateSystem/skewTlogPDiagram
 */

/**
 * @classdesc
 * Coordinate system for a skew-T-log-P diagram.
 * Straight lines:
 * * pressure/isobars (horizontal)
 * * temperature/isotherms (45 degree inclination to the right)
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
  .isIsobarsStraightLine = function () {
  return true;
};

meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram.prototype
  .isIsothermsStraightLine = function () {
  return true;
};

meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram.prototype
  .isDryAdiabatStraightLine = function () {
  return false;
};

meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram.prototype
  .getPByXY = function (x, y) {
  return Math.pow(this.options.pressure.min, y / this.options.height) *
         Math.pow(this.options.pressure.max,
                  (this.options.height - y)/this.options.height);
};

meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram.prototype
  .getYByXP = function (x, p) {
  return this.options.height *
    Math.log(this.options.pressure.max / p) /
    Math.log(this.options.pressure.max / this.options.pressure.min);
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
  var a = this.getPByXY(x, 0);
  var b = this.getPByXY(x, this.options.height);
  if (meteoJS.calc.potentialTempByTempAndPres(this.getTByXP(x, b), b) < T ||
      T < meteoJS.calc.potentialTempByTempAndPres(this.getTByXP(x, a), a))
    return undefined;
  while (a-b > 10) {
    var p = b+(a-b)/2;
    var potTemp = meteoJS.calc.potentialTempByTempAndPres(this.getTByXP(x, p), p);
    if (potTemp === undefined)
      return undefined;
    if (potTemp < T)
      a = p;
    else
      b = p;
  }
  var y = this.getYByXP(x, b+(a-b)/2);
  return y;
};

meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram.prototype
  .getXByYPotentialTemperature = function (y, T) {
  var T = meteoJS.calc.tempByPotentialTempAndPres(T, this.getPByXY(0, y));
  return this.getXByYT(y, T);
};

meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram.prototype
  .getXByPPotentialTemperatur = function (p, potTemp) {
  var T = meteoJS.calc.tempByPotentialTempAndPres(potTemp, p);
  return this.getXByPT(p, T);
};

meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram.prototype
  .getYByPPotentialTemperatur = function (p, potTemp) {
  return this.getYByXPotentialTemperature(this.getXByPPotentialTemperatur(p, potTemp), potTemp);
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

meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram.prototype
  .getXByPHMR = function (p, hmr) {
  var dewpoint = meteoJS.calc.dewpointByHMRAndPres(hmr, p);
  return this.getXByPT(p, dewpoint);
};

meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram.prototype
  .getYByPHMR = function (p, hmr) {
  var dewpoint = meteoJS.calc.dewpointByHMRAndPres(hmr, p);
  return this.getYByPT(p, dewpoint);
};

meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram.prototype
  .getXByYEquiPotTemp = function (y, thetae) {
  var a = 0;
  var b = this.options.width;
  while (b-a > 10) {
    var x = a+(b-a)/2;
    var thetaEX = meteoJS.calc.tempByEquiPotTempAndPres(thetae, this.getPByXY(x, y));
    if (thetaEX === undefined)
      return undefined;
    if (thetaEX < thetae)
      b = x;
    else
      a = x;
  }
  return x;
};

meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram.prototype
  .getYByXEquiPotTemp = function (x, thetae) {
  var a = 0;
  var b = this.options.height;
  while (b-a > 10) {
    var y = a+(b-a)/2;
    var thetaEY = meteoJS.calc.tempByEquiPotTempAndPres(thetae, this.getPByXY(x, y));
    if (thetaEY === undefined)
      return undefined;
    if (thetaEY < thetae)
      b = y;
    else
      a = y;
  }
  return x;
};

meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram.prototype
  .getXByPEquiPotTemp = function (p, thetae) {
  var T = meteoJS.calc.tempByEquiPotTempAndPres(thetae, p);
  return this.getXByPT(p, T);
};

meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram.prototype
  .getYByPEquiPotTemp = function (p, thetae) {
  var T = meteoJS.calc.tempByEquiPotTempAndPres(thetae, p);
  return this.getYByPT(p, T);
};