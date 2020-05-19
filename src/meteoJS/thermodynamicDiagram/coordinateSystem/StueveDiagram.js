/**
 * @module meteoJS/thermodynamicDiagram/coordinateSystem/stueveDiagram
 */

import CoordinateSystem from '../CoordinateSystem.js';

const k = 0.2857;

/**
 * Coordinate system for a Stüve-Diagram. Straight lines:
 * * pressure/isobars (horizontal)
 * * temperature/isotherms (vertical)
 * * potential temperature/dry adiabats
 * 
 * y-Axes in exponential Scale: p^k (k = 0.2857), thus dry adiabats are
 * straight lines (M. K. Yau and R. R. Rogers, Short Course in Cloud Physics,
 * Third Edition, published by Butterworth-Heinemann, pp. 8).
 * 
 * @see {@link https://en.wikipedia.org/wiki/St%C3%BCve_diagram}
 * @extends module:meteoJS/thermodynamicDiagram/coordinateSystem.CoordinateSystem
 */
export class StueveDiagram extends CoordinateSystem {

  /**
   * @inheritdoc
   */
  constructor({
    width = 100,
    height = 100,
    pressure = {},
    temperature = {}
  } = {}) {
    // vertical isotherms
    temperature.inclinationAngle = 0;
    
    super({
      width,
      height,
      pressure,
      temperature
    });
  }
  
  /**
   * @inheritdoc
   */
  isDryAdiabatStraightLine() {
    return true;
  }

  /**
   * @inheritdoc
   */
  getPByXY(x, y) {
    return Math.pow(
      Math.pow(this.options.pressure.max, k) -
      y *
      (Math.pow(this.options.pressure.max, k) -
       Math.pow(this.options.pressure.min, k)) /
      this.getHeight(),
      1/k);
  }

  /**
   * @inheritdoc
   */
  getYByXP(x, p) {
    return this.getHeight() *
    (Math.pow(this.options.pressure.max, k) - Math.pow(p, k)) /
    (Math.pow(this.options.pressure.max, k) -
     Math.pow(this.options.pressure.min, k));
  }

  /**
   * @inheritdoc
   */
  getYByXT() {
    return undefined;
  }

}
export default StueveDiagram;