/**
 * @module meteoJS/thermodynamicDiagram
 */

import $ from 'jquery';
import SVG from 'svgjs';
import { tempCelsiusToKelvin } from './calc.js';
import StueveDiagram from './thermodynamicDiagram/coordinateSystem/StueveDiagram.js';
import Emagram from './thermodynamicDiagram/coordinateSystem/Emagram.js';
import SkewTlogPDiagram from './thermodynamicDiagram/coordinateSystem/SkewTlogPDiagram.js';
import TDDiagram from './thermodynamicDiagram/TDDiagram.js';
import DiagramSounding from './thermodynamicDiagram/DiagramSounding.js';
import Windprofile from './thermodynamicDiagram/Windprofile.js';
import Hodograph from './thermodynamicDiagram/Hodograph.js';
import xAxis from './thermodynamicDiagram/axes/xAxis.js';
import yAxis from './thermodynamicDiagram/axes/yAxis.js';

/**
 * @todo für thermodynamicDiagram
 * Flächen zwischen 2 Soundings (für CAPE oder Unterschied der Temp./Feuchtigkeit.)
 * Zusätzliche Angaben zu Messwerten (bsp. bei PSEUDO-Soundings die Wetterstation)
 */

/**
 * Definition of the options for the constructor.
 * @typedef {Object} meteoJS/thermodynamicDiagram~options
 * @param {HTMLNode} renderTo Element to render diagram into.
 * @param {undefined|interger} width Width of the whole container.
 * @param {undefined|integer} height Height of the whole container.
 * @param {Object} coordinateSystem Definition for the coordinate system.
 * @param {undefined|string} coordinateSystem.type
 *   Possible values: skewTlogP, stueve, emagram.
 * @param {Object} coordinateSystem.pressure Definition of the pressure range.
 * @param {undefined|number} coordinateSystem.pressure.min
 *   Minimum pressure on the diagram.
 * @param {undefined|number} coordinateSystem.pressure.max
 *   Maximum pressure on the diagram.
 * @param {Object} coordinateSystem.temperature
 *   Definition of the temperature range.
 * @param {undefined|number} coordinateSystem.temperature.min
 *   Minimum temperature on the diagram.
 * @param {undefined|number} coordinateSystem.temperature.max
 *   Maximum temperature on the diagram.
 * @param {undefined|string} coordinateSystem.temperature.reference
 *   Possible values: base.
 * @param {meteoJS/thermodynamicDiagram/tdDiagram~options} diagram
 *   Options for the real thermodynamic diagram.
 * @param {meteoJS/thermodynamicDiagram/windprofile~options} windprofile
 *   Options for the windprofile container.
 * @param {meteoJS/thermodynamicDiagram/hodograph~options} windprofile
 *   Options for the hodograph container.
 * @param {meteoJS/thermodynamicDiagram/axes/xAxis~options} xAxis
 *   Options for the xAxis container.
 * @param {meteoJS/thermodynamicDiagram/axes/yAxis~options} yAxis
 *   Options for the yAxis container.
 */

/**
 * @classdesc
 * Class to draw a SVG thermodynamic diagram.
 * 
 * @constructor
 * @param {meteoJS/thermodynamicDiagram~options} options Diagram options.
 */
export default class ThermodynamicDiagram {

constructor(options) {
  /**
   * @type meteoJS/thermodynamicDiagram~options
   */
  this.options = $.extend(true, {
    renderTo: undefined,
    width: undefined,
    height: undefined,
    coordinateSystem: {
      type: undefined,
      pressure: {
        min: undefined,
        max: undefined
      },
      temperature: {
        min: undefined,
        max: undefined,
        reference: undefined
      }
    },
    diagram: { // Objekt-Teilausschnitt
      visible: true,
      x: undefined,
      y: undefined,
      width: undefined,
      height: undefined,
      type: undefined,
      events: {
        click: function (event, p, T) {},
        mouseOver: function (event, p, T) {}
      }
    },
    windprofile: { // Objekt-Teilausschnitt
      visible: true,
      x: undefined,
      y: undefined,
      width: undefined,
      height: undefined
    },
    hodograph: { // Objekt-Teilausschnitt
      visible: true,
      x: undefined,
      y: undefined,
      width: undefined,
      height: undefined
    },
    xAxis: { // Objekt-Teilausschnitt
      visible: true,
      x: undefined,
      y: undefined,
      width: undefined,
      height: undefined
    },
    yAxis: { // Objekt-Teilausschnitt
      visible: true,
      x: undefined,
      y: undefined,
      width: undefined,
      height: undefined
    }
  }, options);
  this.finalizeOptions();
  
  // Koordinatensystem erstellen
  var CSOptions = $.extend({}, this.options.coordinateSystem);
  CSOptions.width = this.options.diagram.width;
  CSOptions.height = this.options.diagram.height;
  /**
   * @type meteoJS.thermodynamicDiagram.coordinateSystem
   */
  this.coordinateSystem =
    (CSOptions.type == 'stueve') ?
      new StueveDiagram(CSOptions) :
    (CSOptions.type == 'emagram') ?
      new Emagram(CSOptions) :
      new SkewTlogPDiagram(CSOptions);
  
  // Objekte zum Zeichnen erstellen
  /**
   * @type SVG
   */
  this.svg = SVG($(this.options.renderTo)[0]).size(this.options.width, this.options.height);
  this.diagram = new TDDiagram(this, this.options.diagram);
  this.xAxis = new xAxis(this, this.options.xAxis);
  this.yAxis = new yAxis(this, this.options.yAxis);
  this.windprofile = new Windprofile(this, this.options.windprofile);
  this.hodograph = new Hodograph(this, this.options.hodograph);
  
  var that = this;
  $(this.options.renderTo).mousemove(function (event) {
    var offset = $(this).offset();
    var renderToX = event.pageX - offset.left;
    var renderToY = event.pageY - offset.top;
    var x0 = that.diagram.getX();
    var x1 = x0+that.diagram.getWidth();
    var y0 = that.diagram.getY();
    var y1 = y0+that.diagram.getHeight();
    var tdDiagramX = renderToX - x0;
    var tdDiagramY = renderToY - y0;
    if (0 <= tdDiagramX && tdDiagramX <= that.diagram.getWidth() &&
        0 <= tdDiagramY && tdDiagramY <= that.diagram.getHeight()) {
      var cos = that.getCoordinateSystem();
      that.options.diagram.events.mouseOver.call(that,
        event,
        cos.getPByXY(tdDiagramX, that.diagram.getHeight()-tdDiagramY),
        cos.getTByXY(tdDiagramX, that.diagram.getHeight()-tdDiagramY));
    }
  });
  
  this.soundings = [];
}

/**
 * Returns the SVG node of the complete diagram.
 * 
 * @returns {SVG} SVG node.
 */
getSVGNode() {
  return this.svg;
}

/**
 * Returns the object of the thermodynamic diagram plot area.
 * 
 * @returns {meteoJS/thermodynamicDiagram/tdDiagram} Diagram object.
 */
getDiagramPlotArea() {
  return this.diagram;
}

/**
 * Returns the object of the coordinate system.
 * 
 * @internal
 * @returns {meteoJS.thermodynamicDiagram.coordinateSystem} Coordinate system.
 */
getCoordinateSystem() {
  return this.coordinateSystem;
}

/**
 * Calculates values in this.options.
 * 
 * @internal
 */
finalizeOptions() {
  // Grösse des gesamten Diagrams.
  this.options.width = (this.options.width === undefined) ?
    $(this.options.renderTo).width() : this.options.width;
  this.options.height = (this.options.height === undefined) ?
    $(this.options.renderTo).height() : this.options.height;
  
  // Grösse der einzelnen Containern.
  if (!this.options.diagram.visible) {
    this.options.diagram.width = 0;
    this.options.diagram.height = 0;
  }
  if (!this.options.windprofile.visible) {
    this.options.windprofile.width = 0;
    this.options.windprofile.height = 0;
  }
  if (!this.options.xAxis.visible) {
    this.options.xAxis.width = 0;
    this.options.xAxis.height = 0;
  }
  if (!this.options.yAxis.visible) {
    this.options.yAxis.width = 0;
    this.options.yAxis.height = 0;
  }
  var defaultPadding = this.options.width * 0.05;
  if (this.options.xAxis.width === undefined &&
      this.options.diagram.width === undefined &&
      this.options.windprofile.width === undefined) {
    this.options.xAxis.width =
      (this.options.width - 2 * defaultPadding) * 0.1;
    this.options.diagram.width =
      (this.options.width - 2 * defaultPadding) * 0.7;
    this.options.windprofile.width =
      (this.options.width - 2 * defaultPadding) * 0.2;
  }
  else if (this.options.diagram.width === undefined)
    this.options.diagram.width =
      this.options.width - 2 * defaultPadding - this.options.windprofile.width;
  else if (this.options.windprofile.width === undefined)
    this.options.windprofile.width =
      this.options.width - 2 * defaultPadding - this.options.diagram.width;
  var totalWidthChildContainers =
    this.options.xAxis.width +
    this.options.diagram.width +
    this.options.windprofile.width;
  if (this.options.xAxis.x === undefined &&
      this.options.diagram.x === undefined &&
      this.options.windprofile.x === undefined) {
    this.options.xAxis.x = defaultPadding;
    this.options.diagram.x =
      this.options.xAxis.x + this.options.xAxis.width;
    this.options.windprofile.x =
      this.options.diagram.x + this.options.diagram.width;
  }
  else if (this.options.diagram.x === undefined)
    this.options.diagram.x =
      this.options.windprofile.x - this.options.windprofile.width;
  else if (this.options.windprofile.x === undefined)
    this.options.windprofile.x =
      this.options.diagram.x + this.options.diagram.width;
  if (this.options.yAxis.height === undefined)
    this.options.yAxis.height = this.options.height * 0.06;
  if (this.options.diagram.height === undefined)
    this.options.diagram.height =
      this.options.height - this.options.yAxis.height - 2 * defaultPadding;
  if (this.options.xAxis.height === undefined)
    this.options.xAxis.height = this.options.diagram.height;
  if (this.options.windprofile.height === undefined)
    this.options.windprofile.height = this.options.diagram.height;
  if (this.options.diagram.y === undefined)
    this.options.diagram.y = defaultPadding;
  if (this.options.xAxis.y === undefined)
    this.options.xAxis.y = this.options.diagram.y;
  if (this.options.windprofile.y === undefined)
    this.options.windprofile.y = this.options.diagram.y;
  if (this.options.yAxis.width === undefined)
    this.options.yAxis.width = this.options.diagram.width;
  if (this.options.yAxis.x === undefined)
    this.options.yAxis.x = this.options.diagram.x;
  if (this.options.yAxis.y === undefined)
    this.options.yAxis.y = this.options.diagram.y + this.options.diagram.height;
  if (this.options.yAxis.height === undefined)
    this.options.yAxis.height = defaultPadding;
  
  // Definitionen zum Koordinatensystem
  if (this.options.coordinateSystem.type === undefined)
    this.options.coordinateSystem.type = 'skewTlogP';
  if (this.options.coordinateSystem.pressure.min === undefined)
    this.options.coordinateSystem.pressure.min = 100;
  if (this.options.coordinateSystem.pressure.max === undefined)
    this.options.coordinateSystem.pressure.max = 1050;
  if (this.options.coordinateSystem.temperature.min === undefined)
    this.options.coordinateSystem.temperature.min =
      tempCelsiusToKelvin(-40);
  if (this.options.coordinateSystem.temperature.max === undefined)
    this.options.coordinateSystem.temperature.max =
      tempCelsiusToKelvin(45);
  if (this.options.coordinateSystem.temperature.reference === undefined)
    this.options.coordinateSystem.temperature.reference = 'base';
  
  // Defintionen zum Hodograph
  if (this.options.hodograph.x === undefined)
    this.options.hodograph.x = this.options.diagram.x;
  if (this.options.hodograph.y === undefined)
    this.options.hodograph.y = this.options.diagram.y;
  if (this.options.hodograph.width === undefined)
    this.options.hodograph.width = Math.min(this.options.diagram.width, this.options.diagram.height) * 0.4;
  if (this.options.hodograph.height === undefined)
    this.options.hodograph.height = this.options.hodograph.width;
}

/**
 * Definition of the style options for the lines in the thermodynamic diagram.
 * @typedef {Object} meteoJS/thermodynamicDiagram~lineStyleOptions
 * @param {} color Color
 * @param {} width Width
 * @param {} opacity Opacity
 * @param {} linecap Linecap
 * @param {} linejoin Linejoin
 * @param {} dasharray Dasharray
 */

/**
 * Add a sounding to the diagram.
 * @param {meteoJS.sounding} sounding
 * @param {Object} options Display options for the sounding
 * @param {boolean} options.visible Visibility of sounding
 * @param {Object} options.diagram Options for thermodynamic diagram
 * @param {boolean} options.diagram.visible
 *   Visibility in thermodynamic diagram of this sounding
 * @param {Object} options.diagram.temp Options for temperature curve
 * @param {boolean} options.diagram.temp.visible
 *   Visibility of temperature curve in thermodynamic diagram
 * @param {meteoJS/thermodynamicDiagram~lineStyleOptions} options.diagram.temp.style
 *   Style for temperature curve
 * @param {Object} options.diagram.dewp Options for dewpoint temperature curve
 * @param {boolean} options.diagram.dewp.visible
 *   Visibility of dewpoint temperature curve in thermodynamic diagram
 * @param {meteoJS/thermodynamicDiagram~lineStyleOptions} options.diagram.dewp.style
 *   Style for dewpoint temperature curve
 * @param {meteoJS/thermodynamicDiagram/windprofile~soundingOptions}
 *   options.windprofile
 *   Windprofile options.
 * @param {Object} options.hodograph Options for hodograph
 * @param {boolean} options.hodograph.visible
 *   Visibility in hodograph of this sounding
 * @param {} options.color
 * @param {Object} options.ttt
 * @param {boolean} options.ttt.visible
 * @param {Object} options.ttd
 * @param {boolean} options.ttd.visible
 * @param {Object} options.mixr ?name?
 * @param {boolean} options.mixr.visible
 * @returns {meteoJS.thermodynamicDiagram} this.
 * 
 * @todo
 * Gehört das in dieses Objekt: Farbe der Linien, Darstellung als Linien oder Punkte, Darstellung als Geraden oder als spline
 */
addSounding(sounding, options) {
  var obj = new DiagramSounding(sounding, options);
  this.soundings.push(obj);
  this.diagram.addSounding(obj);
  this.windprofile.addSounding(obj);
  this.hodograph.addSounding(obj);
  return obj;
}

}