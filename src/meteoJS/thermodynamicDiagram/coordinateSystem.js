/**
 * @module meteoJS/thermodynamicDiagram/coordinateSystem
 */

/**
 * Definition of the options for the constructor.
 * @typedef {Object} meteoJS/thermodynamicDiagram/coordinateSystem~options
 * @param {integer} width Width of the diagram.
 * @param {integer} height Height of the diagram.
 * @param {Object} pressure Definition of the pressure range.
 * @param {number} pressure.min Minimum pressure on the diagram.
 * @param {number} pressure.max Maximum pressure on the diagram.
 * @param {Object} temperature Definition of the temperature range.
 * @param {number} temperature.min Minimum temperature on the diagram.
 * @param {number} temperature.max Maximum temperature on the diagram.
 * @param {string} temperature.reference Possible values: base.
 */

/**
 * @classdesc
 * Abstract class to specify the coordinate system of the thermodynamicDiagram.
 * Child classes define the explicit coordinate system.
 * 
 * @constructor
 * @abstract
 * @param {meteoJS/thermodynamicDiagram/coordinateSystem~options} options
 * 
 * @todo
 * Irgendwie muss die Klasse der SVG-Zeichner-Funktion sagen können, ob bsp.
 * die Isothermen Geraden sind.
 * Irgendwie muss die Klasse der SVG-Zeichner-Funktion für bsp. eine Isobare,
 * aber bsp. auch für eine Trockenadiabate, sagen können, für welchen
 * Wertebereich die Linie gezeichnet werden muss.
 * Wie interagieren die Achsen mit dieser Klasse?
 */
meteoJS.thermodynamicDiagram.coordinateSystem = function (options) {};