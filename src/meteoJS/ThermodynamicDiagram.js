/**
 * @module meteoJS/thermodynamicDiagram
 */
import $ from 'jquery';
import SVG from 'svgjs';
import { tempCelsiusToKelvin } from './calc.js';
import Collection from '../base/Collection.js';
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
 * Definition of the style options for the lines in the thermodynamic diagram.
 * @typedef {Object} module:meteoJS/thermodynamicDiagram~lineStyleOptions
 * @param {undefined|string} [color=undefined] - Color
 * @param {number} [width=1] - Width
 * @param {undefined|number} [opacity=undefined] - Opacity
 * @param {} [linecap=undefined] - Linecap
 * @param {} [linejoin=undefined] - Linejoin
 * @param {} [dasharray=undefined] - Dasharray
 */

/**
 * A line with its visibility and style.
 * 
 * @typedef {Object} module:meteoJS/thermodynamicDiagram~lineOptions
 * @param {boolean} [visible=true] - Visibility of the line.
 * @param {module:meteoJS/thermodynamicDiagram~lineStyleOptions}
 *   [style] - Line style.
 */

/**
 * Options for the constructor.
 * 
 * @typedef {Object} module:meteoJS/thermodynamicDiagram~options
 * @param {external:HTMLElement} renderTo - Element to render diagram into.
 * @param {undefined|integer} width - Width of the whole container.
 * @param {undefined|integer} height - Height of the whole container.
 * @param {Object} coordinateSystem - Definition for the coordinate system.
 * @param {undefined|string} coordinateSystem.type
 *   Possible values: skewTlogP, stueve, emagram.
 * @param {Object} coordinateSystem.pressure - Definition of the pressure range.
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
 * @param {module:meteoJS/thermodynamicDiagram/tdDiagram~options} diagram
 *   Options for the real thermodynamic diagram.
 * @param {module:meteoJS/thermodynamicDiagram/windprofile~options} windprofile
 *   Options for the windprofile container.
 * @param {module:meteoJS/thermodynamicDiagram/hodograph~options} windprofile
 *   Options for the hodograph container.
 * @param {module:meteoJS/thermodynamicDiagram/axes/xAxis~options} xAxis
 *   Options for the xAxis container.
 * @param {module:meteoJS/thermodynamicDiagram/axes/yAxis~options} yAxis
 *   Options for the yAxis container.
 */

/**
 * Class to draw a SVG thermodynamic diagram.
 * 
 * @extends module:meteoJS/base/collection.Collection
 */
export class ThermodynamicDiagram extends Collection {
  
  /**
   * @param {module:meteoJS/thermodynamicDiagram~options} options - Options.
   */
  constructor(options) {
    super({
      fireReplace: false,
      fireAddRemoveOnReplace: true,
      emptyObjectMaker: () => new DiagramSounding()
    });
    
    /**
     * @type module:meteoJS/thermodynamicDiagram~options
     * @private
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
    let CSOptions = $.extend({}, this.options.coordinateSystem);
    CSOptions.width = this.options.diagram.width;
    CSOptions.height = this.options.diagram.height;
    /**
     * @type module:meteoJS/thermodynamicDiagram/coordinateSystem.CoordinateSystem
     * @private
     */
    this.coordinateSystem =
    (CSOptions.type == 'stueve') ?
      new StueveDiagram(CSOptions) :
      (CSOptions.type == 'emagram') ?
        new Emagram(CSOptions) :
        new SkewTlogPDiagram(CSOptions);
  
    // Objekte zum Zeichnen erstellen
    /**
     * @type external:SVG
     * @private
     */
    this.svg = SVG($(this.options.renderTo)[0]).size(this.options.width, this.options.height);
    this.diagram = new TDDiagram(this, this.options.diagram);
    this.xAxis = new xAxis(this, this.options.xAxis);
    this.yAxis = new yAxis(this, this.options.yAxis);
    this.windprofile = new Windprofile(this, this.options.windprofile);
    this.hodograph = new Hodograph(this, this.options.hodograph);
    
    this.on('add:item', sounding => {
      this.diagram.addSounding(sounding);
      this.windprofile.addSounding(sounding);
      this.hodograph.addSounding(sounding);
    });
    
    $(this.options.renderTo).mousemove(event => {
      let offset = $(this.options.renderTo).offset();
      let renderToX = event.pageX - offset.left;
      let renderToY = event.pageY - offset.top;
      let x0 = this.diagram.getX();
      let y0 = this.diagram.getY();
      let tdDiagramX = renderToX - x0;
      let tdDiagramY = renderToY - y0;
      if (0 <= tdDiagramX && tdDiagramX <= this.diagram.getWidth() &&
        0 <= tdDiagramY && tdDiagramY <= this.diagram.getHeight()) {
        let cos = this.getCoordinateSystem();
        this.options.diagram.events.mouseOver.call(this,
          event,
          cos.getPByXY(tdDiagramX, this.diagram.getHeight()-tdDiagramY),
          cos.getTByXY(tdDiagramX, this.diagram.getHeight()-tdDiagramY));
      }
    });
  }

  /**
   * Returns the SVG node of the complete diagram.
   * 
   * @returns {external:SVG} SVG node.
   */
  getSVGNode() {
    return this.svg;
  }

  /**
   * Returns the object of the thermodynamic diagram plot area.
   * 
   * @returns {module:meteoJS/thermodynamicDiagram/tdDiagram.TDDiagram} Diagram object.
   */
  getDiagramPlotArea() {
    return this.diagram;
  }

  /**
   * Returns the object of the coordinate system.
   * 
   * @internal
   * @returns {module:meteoJS/thermodynamicDiagram/coordinateSystem.CoordinateSystem} Coordinate system.
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
    let defaultPadding = this.options.width * 0.05;
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
   * Add a sounding to the diagram.
   * @param {module:meteoJS/sounding.Sounding} sounding - Sounding object.
   * @param {module:meteoJS/thermodynamicDiagram/sounding~options}
   *   [options] - Display options.
   * @returns {module:meteoJS/thermodynamicDiagram/sounding.DiagramSounding}
   *   Sounding object for the diagram with display options.
   */
  addSounding(sounding, options = {}) {
    let diagramSounding = new DiagramSounding(sounding, options);
    let i = 1;
    let id = `sounding-${i}`;
    while (this.containsId(id)) {
      i++;
      id = `sounding-${i}`;
    }
    diagramSounding.id = id;
    this.append(diagramSounding);
    return diagramSounding;
  }

}
export default ThermodynamicDiagram;