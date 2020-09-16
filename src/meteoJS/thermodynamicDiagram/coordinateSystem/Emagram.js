/**
 * @module meteoJS/thermodynamicDiagram/coordinateSystem/emagram
 */
import CoordinateSystem from '../CoordinateSystem.js';

/**
 * Coordinate system for an emagram. This diagram has straight lines:
 * Straight lines:
 * * pressure/isobars (horizontal)
 * * temperature/isotherms (vertical)
 * 
 * @see {@link https://en.wikipedia.org/wiki/Emagram}
 * @extends module:meteoJS/thermodynamicDiagram/coordinateSystem.CoordinateSystem
 */
export class Emagram extends CoordinateSystem {
  
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

}
export default Emagram;