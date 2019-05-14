/**
 * @module meteoJS/thermodynamicDiagram/coordinateSystem/stueveDiagram
 */

import CoordinateSystem from '../CoordinateSystem.js';

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
export default class StueveDiagram extends CoordinateSystem {

constructor(options) {
  this.k = 0.2857;
  
  // vertical isotherms
  if (!('temperature' in options))
    options.temperature = {};
  options.temperature.inclinationAngle = 0;
  
  super(options);
}

isDryAdiabatStraightLine() {
  return true;
}

getPByXY(x, y) {
  return Math.pow(
    Math.pow(this.options.pressure.max, this.k) -
      y *
      (Math.pow(this.options.pressure.max, this.k) -
       Math.pow(this.options.pressure.min, this.k)) /
      this.getHeight(),
    1/this.k);
}

getYByXP(x, p) {
  return this.getHeight() *
    (Math.pow(this.options.pressure.max, this.k) - Math.pow(p, this.k)) /
    (Math.pow(this.options.pressure.max, this.k) -
     Math.pow(this.options.pressure.min, this.k));
}

getYByXT(x, T) {
  return undefined;
}

}