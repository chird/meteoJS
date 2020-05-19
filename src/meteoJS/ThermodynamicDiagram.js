/**
 * @module meteoJS/thermodynamicDiagram
 */
import { SVG } from '@svgdotjs/svg.js';
import { tempCelsiusToKelvin } from './calc.js';
import ThermodynamicDiagramPluggable from './ThermodynamicDiagramPluggable.js';
import StueveDiagram from './thermodynamicDiagram/coordinateSystem/StueveDiagram.js';
import Emagram from './thermodynamicDiagram/coordinateSystem/Emagram.js';
import SkewTlogPDiagram from './thermodynamicDiagram/coordinateSystem/SkewTlogPDiagram.js';
import TDDiagram from './thermodynamicDiagram/TDDiagram.js';
import DiagramSounding from './thermodynamicDiagram/DiagramSounding.js';
import Windprofile from './thermodynamicDiagram/Windprofile.js';
import Hodograph from './thermodynamicDiagram/Hodograph.js';
import { xAxis as yAxisClass } from './thermodynamicDiagram/axes/xAxis.js';
import { yAxis as xAxisClass } from './thermodynamicDiagram/axes/yAxis.js';

/**
 * Options for the constructor.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagramPluggable~options}
 *   module:meteoJS/thermodynamicDiagram~options
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
 * @extends module:meteoJS/thermodynamicDiagramPluggable.ThermodynamicDiagramPluggable
 */
export class ThermodynamicDiagram extends ThermodynamicDiagramPluggable {
  
  /**
   * @param {module:meteoJS/thermodynamicDiagram~options} options - Options.
   */
  constructor({
    renderTo = undefined,
    width = undefined,
    height = undefined,
    coordinateSystem = {},
    diagram = {},
    windprofile = {},
    hodograph = {},
    xAxis = {},
    yAxis = {}
  }) {
    super({
      renderTo,
      width,
      height
    });
    
    diagram = normalizePlotAreaOptions(diagram);
    windprofile = normalizePlotAreaOptions(windprofile);
    hodograph = normalizePlotAreaOptions(hodograph);
    xAxis = normalizePlotAreaOptions(xAxis);
    yAxis = normalizePlotAreaOptions(yAxis);
    
    let defaultPadding = this.svgNode.width() * 0.05;
    if (xAxis.width === undefined &&
      diagram.width === undefined &&
      windprofile.width === undefined) {
      xAxis.width =
        (this.svgNode.width() - 2 * defaultPadding) * 0.1;
      diagram.width =
        (this.svgNode.width() - 2 * defaultPadding) * 0.7;
      windprofile.width =
        (this.svgNode.width() - 2 * defaultPadding) * 0.2;
    }
    else if (diagram.width === undefined)
      diagram.width =
        this.svgNode.width() - 2 * defaultPadding - windprofile.width;
    else if (windprofile.width === undefined)
      windprofile.width =
        this.svgNode.width() - 2 * defaultPadding - diagram.width;
    if (xAxis.x === undefined &&
      diagram.x === undefined &&
      windprofile.x === undefined) {
      xAxis.x = defaultPadding;
      diagram.x =
        xAxis.x + xAxis.width;
      windprofile.x =
        diagram.x + diagram.width;
    }
    else if (diagram.x === undefined)
      diagram.x =
        windprofile.x - windprofile.width;
    else if (windprofile.x === undefined)
      windprofile.x =
        diagram.x + diagram.width;
    if (yAxis.height === undefined)
      yAxis.height = this.svgNode.height() * 0.06;
    if (diagram.height === undefined)
      diagram.height =
        this.svgNode.height() - yAxis.height - 2 * defaultPadding;
    if (xAxis.height === undefined)
      xAxis.height = diagram.height;
    if (windprofile.height === undefined)
      windprofile.height = diagram.height;
    if (diagram.y === undefined)
      diagram.y = defaultPadding;
    if (xAxis.y === undefined)
      xAxis.y = diagram.y;
    if (windprofile.y === undefined)
      windprofile.y = diagram.y;
    if (yAxis.width === undefined)
      yAxis.width = diagram.width;
    if (yAxis.x === undefined)
      yAxis.x = diagram.x;
    if (yAxis.y === undefined)
      yAxis.y = diagram.y + diagram.height;
    if (yAxis.height === undefined)
      yAxis.height = defaultPadding;
    
    // Definitionen zum Koordinatensystem
    if (coordinateSystem.type === undefined)
      coordinateSystem.type = 'skewTlogP';
    if (!('pressure' in coordinateSystem))
      coordinateSystem.pressure = {};
    if (coordinateSystem.pressure.min === undefined)
      coordinateSystem.pressure.min = 100;
    if (coordinateSystem.pressure.max === undefined)
      coordinateSystem.pressure.max = 1050;
    if (!('temperature' in coordinateSystem))
      coordinateSystem.temperature = {};
    if (coordinateSystem.temperature.min === undefined)
      coordinateSystem.temperature.min =
        tempCelsiusToKelvin(-40);
    if (coordinateSystem.temperature.max === undefined)
      coordinateSystem.temperature.max =
        tempCelsiusToKelvin(45);
    if (coordinateSystem.temperature.reference === undefined)
      coordinateSystem.temperature.reference = 'base';
    
    // Defintionen zum Hodograph
    if (hodograph.x === undefined)
      hodograph.x = diagram.x;
    if (hodograph.y === undefined)
      hodograph.y = diagram.y;
    if (hodograph.width === undefined)
      hodograph.width = Math.min(diagram.width, diagram.height) * 0.4;
    if (hodograph.height === undefined)
      hodograph.height = hodograph.width;
    
    // Koordinatensystem erstellen
    coordinateSystem.width = diagram.width;
    coordinateSystem.height = diagram.height;
    
    this.diagram = new TDDiagram(diagram);
    this.appendPlotArea(this.diagram);
    
    this.yAxis = new yAxisClass(xAxis);
    this.appendPlotArea(this.yAxis);
    
    this.xAxis = new xAxisClass(yAxis);
    this.appendPlotArea(this.xAxis);
    
    this.windprofile = new Windprofile(windprofile);
    this.appendPlotArea(this.windprofile);
    
    this.hodograph = new Hodograph(hodograph);
    this.appendPlotArea(this.hodograph);
    
    /**
     * @type module:meteoJS/thermodynamicDiagram/coordinateSystem.CoordinateSystem
     * @private
     */
    this._coordinateSystem;
    this.coordinateSystem =
      (coordinateSystem.type == 'stueve') ?
        new StueveDiagram(coordinateSystem) :
        (coordinateSystem.type == 'emagram') ?
          new Emagram(coordinateSystem) :
          new SkewTlogPDiagram(coordinateSystem);
  }
  
  /**
   * Coordinate system for the different plot areas.
   * 
   * @type module:meteoJS/thermodynamicDiagram/coordinateSystem.CoordinateSystem
   * @public
   */
  get coordinateSystem() {
    return this._coordinateSystem;
  }
  set coordinateSystem(coordinateSystem) {
    this._coordinateSystem = coordinateSystem;
    this.exchangeCoordinateSystem(this._coordinateSystem);
  }
  
  /**
   * Returns the object of the thermodynamic diagram plot area.
   * 
   * @returns {module:meteoJS/thermodynamicDiagram/tdDiagram.TDDiagram} Diagram object.
   */
  getDiagramPlotArea() {
    return this.diagram;
  }
}
export default ThermodynamicDiagram;

/**
 * Returns normalized PlotArea options.
 * 
 * @private
 */
function normalizePlotAreaOptions({
  svgNode = undefined,
  coordinateSystem = undefined,
  x = undefined,
  y = undefined,
  width = undefined,
  height = undefined,
  style = {},
  visible = true,
  events = {},
  hoverLabels = {}
}) {
  return {
    svgNode,
    coordinateSystem,
    x,
    y,
    width,
    height,
    style,
    visible,
    events,
    hoverLabels
  };
}