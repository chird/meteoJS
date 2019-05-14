/**
 * @module meteoJS/thermodynamicDiagram/coordinateSystem/emagram
 */

import CoordinateSystem from '../CoordinateSystem.js';

/**
 * @classdesc
 * Coordinate system for an emagram.
 * https://en.wikipedia.org/wiki/Emagram
 * Straight lines:
 * * pressure/isobars (horizontal)
 * * temperature/isotherms (vertical)
 * 
 * @constructor
 * @extends meteoJS/thermodynamicDiagram/coordinateSystem
 * @param {meteoJS/thermodynamicDiagram/coordinateSystem~options} options
 */
export default class Emagram extends CoordinateSystem {

constructor(options) {
  // vertical isotherms
  if (!('temperature' in options))
    options.temperature = {};
  options.temperature.inclinationAngle = 0;
  
  super(options);
}

}