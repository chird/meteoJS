/**
 * @module meteoJS/thermodynamicDiagram/coordinateSystem/emagram
 */

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
meteoJS.thermodynamicDiagram.coordinateSystem.emagram = function (options) {
  // vertical isotherms
  if (!('temperature' in options))
    options.temperature = {};
  options.temperature.inclinationAngle = 0;
  
  meteoJS.thermodynamicDiagram.coordinateSystem.call(this, options);
};
meteoJS.thermodynamicDiagram.coordinateSystem.emagram.prototype =
  Object.create(meteoJS.thermodynamicDiagram.coordinateSystem.prototype);
meteoJS.thermodynamicDiagram.coordinateSystem.emagram.prototype.constructor =
  meteoJS.thermodynamicDiagram.coordinateSystem.emagram;