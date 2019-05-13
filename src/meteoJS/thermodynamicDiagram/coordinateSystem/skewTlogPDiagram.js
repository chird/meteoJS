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
export class skewTlogPDiagram extends CoordinateSystem {

constructor(options) {
  super(options);
}

}