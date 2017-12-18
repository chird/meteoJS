/**
 * @module meteoJS/thermodynamicDiagram/coordinateSystem
 */

/**
 * @classdesc
 * Abstract class to specify the coordinate system of the thermodynamicDiagram.
 * Child classes define the explicit system.
 * 
 * @constructor
 * @abstract
 * 
 * @todo
 * Irgendwie muss die Klasse der SVG-Zeichner-Funktion sagen können, ob bsp.
 * die Isothermen Geraden sind.
 * Irgendwie muss die Klasse der SVG-Zeichner-Funktion für bsp. eine Isobare,
 * aber bsp. auch für eine Trockenadiabate, sagen können, für welchen
 * Wertebereich die Linie gezeichnet werden muss.
 * Wie interagieren die Achsen mit dieser Klasse?
 */
meteoJS.thermodynamicDiagram.coordinateSystem = function () {};