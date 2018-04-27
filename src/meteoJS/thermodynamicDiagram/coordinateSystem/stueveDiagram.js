/**
 * @module meteoJS/thermodynamicDiagram/coordinateSystem/stueveDiagram
 */

/**
 * @classdesc
 * Coordinate system for a Stüve-Diagram.
 * https://en.wikipedia.org/wiki/St%C3%BCve_diagram
 * Straight lines:
 * * pressure/isobars (horizontal)
 * * temperature/isotherms (vertical)
 * * potential temperature/dry adiabats
 * y-Axes in exponential Scale: p^k (k = 0.2857)
 * * thus dry adiabats are straight lines
 *   (M. K. Yau and R. R. Rogers, Short Course in Cloud Physics, Third Edition,
 *    published by Butterworth-Heinemann, pp. 8)
 * 
 * @constructor
 * @extends meteoJS/thermodynamicDiagram/coordinateSystem
 * @param {meteoJS/thermodynamicDiagram/coordinateSystem~options} options
 */
meteoJS.thermodynamicDiagram.coordinateSystem.stueveDiagram = function (options) {
  this.k = 0.2857;
  
  // vertical isotherms
  if (!('temperature' in options))
    options.temperature = {};
  options.temperature.inclinationAngle = 0;
  
  meteoJS.thermodynamicDiagram.coordinateSystem.call(this, options);
};
meteoJS.thermodynamicDiagram.coordinateSystem.stueveDiagram.prototype =
  Object.create(meteoJS.thermodynamicDiagram.coordinateSystem.prototype);
meteoJS.thermodynamicDiagram.coordinateSystem.stueveDiagram.prototype.constructor =
  meteoJS.thermodynamicDiagram.coordinateSystem.stueveDiagram;

meteoJS.thermodynamicDiagram.coordinateSystem.stueveDiagram.prototype
  .isDryAdiabatStraightLine = function () {
  return true;
};

meteoJS.thermodynamicDiagram.coordinateSystem.stueveDiagram.prototype
  .getPByXY = function (x, y) {
  return Math.pow(
    Math.pow(this.options.pressure.max, this.k) -
      y *
      (Math.pow(this.options.pressure.max, this.k) -
       Math.pow(this.options.pressure.min, this.k)) /
      this.getHeight(),
    1/this.k);
};

meteoJS.thermodynamicDiagram.coordinateSystem.stueveDiagram.prototype
  .getYByXP = function (x, p) {
  return this.getHeight() *
    (Math.pow(this.options.pressure.max, this.k) - Math.pow(p, this.k)) /
    (Math.pow(this.options.pressure.max, this.k) -
     Math.pow(this.options.pressure.min, this.k));
};

meteoJS.thermodynamicDiagram.coordinateSystem.stueveDiagram.prototype
  .getYByXT = function (x, T) {
  return undefined;
};