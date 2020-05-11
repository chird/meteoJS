/**
 * @module meteoJS/thermodynamicDiagram
 */
import { SVG } from '@svgdotjs/svg.js';
import { tempCelsiusToKelvin } from './calc.js';
import Collection from './base/Collection.js';
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
      fireReplace: false,
      fireAddRemoveOnReplace: true,
      emptyObjectMaker: () => new DiagramSounding()
    });
    
    /**
     * @type external:SVG
     * @private
     */
    this.svg = SVG().addTo(renderTo);
    if (width !== undefined ||
        height !== undefined)
      this.svg.size(width, height);
    
    diagram = normalizePlotAreaOptions(diagram);
    windprofile = normalizePlotAreaOptions(windprofile);
    hodograph = normalizePlotAreaOptions(hodograph);
    xAxis = normalizePlotAreaOptions(xAxis);
    yAxis = normalizePlotAreaOptions(yAxis);
    
    let defaultPadding = this.svg.width() * 0.05;
    if (xAxis.width === undefined &&
      diagram.width === undefined &&
      windprofile.width === undefined) {
      xAxis.width =
        (this.svg.width() - 2 * defaultPadding) * 0.1;
      diagram.width =
        (this.svg.width() - 2 * defaultPadding) * 0.7;
      windprofile.width =
        (this.svg.width() - 2 * defaultPadding) * 0.2;
    }
    else if (diagram.width === undefined)
      diagram.width =
        this.svg.width() - 2 * defaultPadding - windprofile.width;
    else if (windprofile.width === undefined)
      windprofile.width =
        this.svg.width() - 2 * defaultPadding - diagram.width;
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
      yAxis.height = this.svg.height() * 0.06;
    if (diagram.height === undefined)
      diagram.height =
        height - yAxis.height - 2 * defaultPadding;
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
    
    /**
     * @type module:meteoJS/thermodynamicDiagram/coordinateSystem.CoordinateSystem
     * @private
     */
    this.coordinateSystem =
      (coordinateSystem.type == 'stueve') ?
        new StueveDiagram(coordinateSystem) :
        (coordinateSystem.type == 'emagram') ?
          new Emagram(coordinateSystem) :
          new SkewTlogPDiagram(coordinateSystem);
    
    
    /*this.options = $.extend(true, {
      diagram: { // Objekt-Teilausschnitt
        type: undefined,
        events: {
          click: function (event, p, T) {},
          mouseOver: function (event, p, T) {}
        }
      },
    }, options);*/
    
    diagram.svgNode = this.svg;
    diagram.coordinateSystem = this.coordinateSystem;
    this.diagram = new TDDiagram(diagram);
    
    xAxis.svgNode = this.svg;
    xAxis.coordinateSystem = this.coordinateSystem;
    this.yAxis = new yAxisClass(xAxis);
    
    yAxis.svgNode = this.svg;
    yAxis.coordinateSystem = this.coordinateSystem;
    this.xAxis = new xAxisClass(yAxis);
    
    windprofile.svgNode = this.svg;
    windprofile.coordinateSystem = this.coordinateSystem;
    this.windprofile = new Windprofile(windprofile);
    
    hodograph.svgNode = this.svg;
    hodograph.coordinateSystem = this.coordinateSystem;
    this.hodograph = new Hodograph(hodograph);
    
    this.on('add:item', sounding => {
      this.diagram.addSounding(sounding);
      this.windprofile.addSounding(sounding);
      this.hodograph.addSounding(sounding);
    });
    this.on('remove:item', sounding => {
      this.diagram.removeSounding(sounding);
      this.windprofile.removeSounding(sounding);
      this.hodograph.removeSounding(sounding);
    });
    
    /*$(this.options.renderTo).mousemove(event => {
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
    });*/
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
   * Add a sounding to the diagram.
   * 
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

function normalizePlotAreaOptions({
  svgNode = undefined,
  coordinateSystem = undefined,
  x = undefined,
  y = undefined,
  width = undefined,
  height = undefined,
  style = {},
  visible = true
}) {
  return {
    svgNode,
    coordinateSystem,
    x,
    y,
    width,
    height,
    style,
    visible
  };
}