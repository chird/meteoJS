/**
 * @module meteoJS/thermodynamicDiagram
 */
import ThermodynamicDiagramPluggable from './ThermodynamicDiagramPluggable.js';
import StueveDiagram from './thermodynamicDiagram/coordinateSystem/StueveDiagram.js';
import Emagram from './thermodynamicDiagram/coordinateSystem/Emagram.js';
import SkewTlogPDiagram from './thermodynamicDiagram/coordinateSystem/SkewTlogPDiagram.js';
import TDDiagram from './thermodynamicDiagram/TDDiagram.js';
import WindbarbsProfile from './thermodynamicDiagram/WindbarbsProfile.js';
import WindspeedProfile from './thermodynamicDiagram/WindspeedProfile.js';
import Hodograph from './thermodynamicDiagram/Hodograph.js';
import { xAxis as xAxisClass } from './thermodynamicDiagram/axes/xAxis.js';
import { yAxis as yAxisClass } from './thermodynamicDiagram/axes/yAxis.js';

/**
 * Options for the coordinate system.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagramPluggable~options}
 *   module:meteoJS/thermodynamicDiagram~coordinateSystemOptions
 * @property {'skewTlogP'|'stueve'|'emagram'} [type='skewTlogP']
 *   Thermodynamic diagarm type.
 * @property {module:meteoJS/thermodynamicDiagram/coordinateSystem~pressureOptions}
 *   [pressure] - Pressure options.
 * @property {module:meteoJS/thermodynamicDiagram/coordinateSystem~temperatureOptions}
 *   [temperature] - Temperature options.
 */

/**
 * Options for the constructor.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagramPluggable~options}
 *   module:meteoJS/thermodynamicDiagram~options
 * @param {module:meteoJS/thermodynamicDiagram~coordinateSystemOptions}
 *   [coordinateSystem] - Coordinate system options.
 * @param {module:meteoJS/thermodynamicDiagram/tdDiagram~options} [diagram]
 *   Options for the real thermodynamic diagram.
 * @param {module:meteoJS/thermodynamicDiagram/windbarbsProfile~options}
 *   [windbarbs] - Options for the windbarbs profile.
 * @param {module:meteoJS/thermodynamicDiagram/windspeedProfile~options}
 *   [windprofile] - Options for the windspeed profile.
 * @param {module:meteoJS/thermodynamicDiagram/hodograph~options} [hodograph]
 *   Options for the hodograph container.
 * @param {module:meteoJS/thermodynamicDiagram/axes/xAxis~options} [xAxis]
 *   Options for the xAxis container.
 * @param {module:meteoJS/thermodynamicDiagram/axes/yAxis~options} [yAxis]
 *   Options for the yAxis container.
 */

/**
 * Class to draw a SVG thermodynamic diagram.
 * 
 * <pre><code>import ThermodynamicDiagram from 'meteoJS/ThermodynamicDiagram';</code></pre>
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
    windbarbsProfile = {},
    windspeedProfile = {},
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
    windbarbsProfile = normalizePlotAreaOptions(windbarbsProfile);
    windspeedProfile = normalizePlotAreaOptions(windspeedProfile);
    hodograph = normalizePlotAreaOptions(hodograph);
    xAxis = normalizePlotAreaOptions(xAxis);
    yAxis = normalizePlotAreaOptions(yAxis);
    
    let defaultPadding = this.svgNode.width() * 0.05;
    if (xAxis.width === undefined &&
      diagram.width === undefined &&
      windbarbsProfile.width === undefined &&
      windspeedProfile.width === undefined) {
      yAxis.width =
        (this.svgNode.width() - 2 * defaultPadding) * 0.1;
      diagram.width =
        (this.svgNode.width() - 2 * defaultPadding) * 0.7;
      windbarbsProfile.width =
        (this.svgNode.width() - 2 * defaultPadding) * 0.2 * 1/3;
      windspeedProfile.width =
        (this.svgNode.width() - 2 * defaultPadding) * 0.2 * 2/3;
    }
    else if (diagram.width === undefined)
      diagram.width =
        this.svgNode.width() - 2 * defaultPadding
        - windbarbsProfile.width- windspeedProfile.width;
    else if (windbarbsProfile.width === undefined &&
             windspeedProfile.width === undefined) {
      windbarbsProfile.width =
        (this.svgNode.width() - 2 * defaultPadding - diagram.width) * 1/3;
      windspeedProfile.width =
        (this.svgNode.width() - 2 * defaultPadding - diagram.width) * 2/3;
    }
    if (yAxis.x === undefined &&
      diagram.x === undefined &&
      windbarbsProfile.x === undefined &&
      windspeedProfile.x === undefined) {
      yAxis.x = defaultPadding;
      diagram.x =
        yAxis.x + yAxis.width;
      windbarbsProfile.x =
        diagram.x + diagram.width;
      windspeedProfile.x =
        windbarbsProfile.x + windbarbsProfile.width;
    }
    else if (diagram.x === undefined)
      diagram.x =
        windbarbsProfile.x - windbarbsProfile.width;
    else if (windbarbsProfile.x === undefined &&
             windspeedProfile.x === undefined) {
      windbarbsProfile.x =
        diagram.x + diagram.width;
      windspeedProfile.x =
        windbarbsProfile.x + windbarbsProfile.width;
    }
    if (xAxis.height === undefined)
      xAxis.height = this.svgNode.height() * 0.06;
    if (diagram.height === undefined)
      diagram.height =
        this.svgNode.height() - xAxis.height - 2 * defaultPadding;
    if (yAxis.height === undefined)
      yAxis.height = diagram.height;
    if (windbarbsProfile.height === undefined)
      windbarbsProfile.height = diagram.height;
    if (windspeedProfile.height === undefined)
      windspeedProfile.height = diagram.height;
    if (diagram.y === undefined)
      diagram.y = defaultPadding;
    if (yAxis.y === undefined)
      yAxis.y = diagram.y;
    if (windbarbsProfile.y === undefined)
      windbarbsProfile.y = diagram.y;
    if (windspeedProfile.y === undefined)
      windspeedProfile.y = diagram.y;
    if (xAxis.width === undefined)
      xAxis.width = diagram.width;
    if (xAxis.x === undefined)
      xAxis.x = diagram.x;
    if (xAxis.y === undefined)
      xAxis.y = diagram.y + diagram.height;
    if (xAxis.height === undefined)
      xAxis.height = defaultPadding;
    
    // Defintionen zum Hodograph
    if (hodograph.x === undefined)
      hodograph.x = diagram.x;
    if (hodograph.y === undefined)
      hodograph.y = diagram.y;
    if (hodograph.width === undefined)
      hodograph.width = Math.min(diagram.width, diagram.height) * 0.4;
    if (hodograph.height === undefined)
      hodograph.height = hodograph.width;
    
    this.diagram = new TDDiagram(diagram);
    this.appendPlotArea(this.diagram);
    
    this.yAxis = new yAxisClass(yAxis);
    this.appendPlotArea(this.yAxis);
    
    this.xAxis = new xAxisClass(xAxis);
    this.appendPlotArea(this.xAxis);
    
    this.windbarbsProfile = new WindbarbsProfile(windbarbsProfile);
    this.appendPlotArea(this.windbarbsProfile);
    
    this.windspeedProfile = new WindspeedProfile(windspeedProfile);
    this.appendPlotArea(this.windspeedProfile);
    
    this.hodograph = new Hodograph(hodograph);
    this.hodograph.on('prebuild:background', ({ node }) => {
      node
        .rect(this.hodograph.width-2, this.hodograph.height-2)
        .move(1,1)
        .fill({ color: 'white' })
        .stroke({ color: 'black', width: 1 });
    });
    this.appendPlotArea(this.hodograph);
    
    if (coordinateSystem.type === undefined)
      coordinateSystem.type = 'skewTlogP';
    coordinateSystem.width = diagram.width;
    coordinateSystem.height = diagram.height;
    
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
   * @deprecated
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
  hoverLabels = {},
  ...result
}) {
  result.svgNode = svgNode;
  result.coordinateSystem = coordinateSystem;
  result.x = x;
  result.y = y;
  result.width = width;
  result.height = height;
  result.style = style;
  result.visible = visible;
  result.events = events;
  result.hoverLabels = hoverLabels;
  return result;
}