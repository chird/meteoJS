/**
 * @module meteoJS/thermodynamicDiagram/coordinateSystem/stueveDiagram
 */

import CoordinateSystem from '../CoordinateSystem.js';

const k = 0.2857;

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
      Math.pow(this.options.pressure.max, k) -
      y *
      (Math.pow(this.options.pressure.max, k) -
       Math.pow(this.options.pressure.min, k)) /
      this.getHeight(),
      1/k);
  }

  getYByXP(x, p) {
    return this.getHeight() *
    (Math.pow(this.options.pressure.max, k) - Math.pow(p, k)) /
    (Math.pow(this.options.pressure.max, k) -
     Math.pow(this.options.pressure.min, k));
  }

  getYByXT(x, T) {
    return undefined;
  }

}