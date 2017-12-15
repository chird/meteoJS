/**
 * @module meteoJS/thermodynamicDiagram
 */

/**
 * Definition of the options for the constructor.
 * @typedef {Object} meteoJS/thermodynamicDiagram~options
 * @param {Object} diagram
 * @param {} diagram.type
 * @param {} diagram.height
 * @param {} diagram.width
 * @param {Object} xAxis
 * @param {} xAxis.min [?]
 * @param {} xAxis.max [?]
 * @param {} xAxis.isotherms
 * @param {} xAxis.isotherms.color
 * @param {} xAxis.dryadiabats ?name?
 * @param {} xAxis.dryadiabats.color
 * @param {} xAxis.wetisentrops ?name?
 * @param {} xAxis.wetisentrops.color
 * @param {} xAxis.mixedratio ?name?
 * @param {} xAxis.mixedratio.color
 * @param {Object} xAxis.title
 * @param {string|undefined} xAxis.title.text
 * @param {Object} yAxis
 * @param {} yAxis.min [hPa]
 * @param {} yAxis.max [hPa]
 * @param {Object} yAxis.isobars
 * @param {} yAxis.isobars.color
 * @param {Object} yAxis.title
 * @param {string|undefined} yAxis.title.text
 * 
 * @todo
 * Darstellung 'skewT-logP', 'tephigram', 'emagram', 'stuve', ...
 * Ausschnitt (bsp. in P&T)
 */

/**
 * @classdesc
 * Class to draw a thermodynamic diagarm into an element.
 * 
 * @constructor
 * @param {} renderTo Element to render diagram into.
 * @param {meteoJS/thermodynamicDiagram~options} options Diagram options.
 * 
 * @todo
 * onmousemove -> Abfrage der Höhe/Temp/Taupunkt/etc. bei der Maus
 */
meteoJS.thermodynamicDiagram = function (renderTo, options) {};

/**
 * Add a sounding to the diagram.
 * @param {meteoJS.sounding} sounding
 * @param {Object} options
 * @param {} options.color
 * @returns {meteoJS.thermodynamicDiagram} this.
 * 
 * @todo
 * Gehört das in dieses Objekt: Farbe der Linien, Darstellung als Linien oder Punkte, Darstellung als Geraden oder als spline
 */
meteoJS.thermodynamicDiagram.prototype
  .addSounding = function (sounding, options) {};