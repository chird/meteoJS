/**
 * @module meteoJS/thermodynamicDiagram/coordinateSystem/skewTlogPDiagram
 */

/**
 * @classdesc
 * Coordinate system for a skew-T-log-P diagram.
 * Straight lines:
 * * pressure/isobars (horizontal)
 * * temperature/isotherms (normally 45 degree inclination to the right)
 * 
 * @constructor
 * @extends meteoJS/thermodynamicDiagram/coordinateSystem
 * @param {meteoJS/thermodynamicDiagram/coordinateSystem~options} options
 */
meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram = function (options) {
  meteoJS.thermodynamicDiagram.coordinateSystem.call(this, options);
};
meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram.prototype =
  Object.create(meteoJS.thermodynamicDiagram.coordinateSystem.prototype);
meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram.prototype.constructor =
  meteoJS.thermodynamicDiagram.coordinateSystem.skewTlogPDiagram;