/**
 * @module meteoJS/thermodynamicDiagram/hodograph
 */
import { windspeedKMHToMS,
  windspeedKNToMS,
  windspeedMSToKMH } from '../calc.js';
import {
  getNormalizedLineOptions,
  getNormalizedTextOptions
} from './Functions.js';
import PlotDataArea from './PlotDataArea.js';

/**
 * Options for the circle grid.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram~lineStyleOptions}
 *   module:meteoJS/thermodynamicDiagram/hodograph~gridCirclesOptions
 * @param {number} [interval=13.89]
 *   Interval between grid circles (and value for the first grid circle).
 *   In m/s.
 */

/**
 * Options for the grid labels.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram~textOptions}
 *   module:meteoJS/thermodynamicDiagram/hodograph~gridLabelsOptions
 * @param {number} [angle=45]
 *   Angle of the labels startin from the origin
 *   (in degrees, 0 relates to North).
 */

/**
 * Options for the constructor.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram/plotDataArea~options}
 *   module:meteoJS/thermodynamicDiagram/hodograph~options
 * @param {Object} [grid] - Options for the hodograph grid.
 * @param {module:meteoJS/thermodynamicDiagram~lineOptions} [grid.axes]
 *   Options for the hodograph's x- and y-axes.
 * @param {module:meteoJS/thermodynamicDiagram/hodograph~gridCirclesOptions}
 *   [grid.circles] - Options for the hodograph circle grid.
 * @param {module:meteoJS/thermodynamicDiagram/hodograph~gridLabelsOptions}
 *   [grid.labels] - Options for the hodograph grid labels.
 * @param {number|undefined} [grid.max=undefined]
 *   Maximum value for the grid axes and circles. If undefined, determined from
 *   'minWindspeedRange'.
 * @param {number} [windspeedMax=41.67]
 *   The maximum windspeed [m/s], that should be visible on the plot. This
 *   refers to the x- or y-direction with the origin in the middle of the plot,
 *   because in these directions, a polar plot has the least extent concerning
 *   distance.
 * @param {number[]|undefined} [origin=undefined]
 *   Move origin of polar plot. If 'undefined' the origin is in the center. To
 *   move, use an array with 2 elements. The first element moves the origin in
 *   x direction, the second in y direction. The values are interpreted as
 *   relative length (relating to the half width resp. height). Positive values
 *   to move in South-West direction. E.g. to move the origin the half way to
 *   South-West, use [0.5, 0.5].
 */

/**
 * Class to draw the hodograph.
 * 
 * <pre><code>import Hodograph from 'meteoJS/thermodynamicDiagram/Hodograph';</code></pre>
 * 
 * @extends module:meteoJS/thermodynamicDiagram/plotDataArea.PlotDataArea
 */
export class Hodograph extends PlotDataArea {
  
  /**
   * @param {module:meteoJS/thermodynamicDiagram/hodograph~options} options
   *   Options.
   */
  constructor({
    svgNode = undefined,
    coordinateSystem,
    x,
    y,
    width,
    height,
    style = {},
    visible = true,
    events = {},
    grid = {},
    windspeedMax = windspeedKNToMS(150),
    origin = undefined
  }) {
    super({
      svgNode,
      coordinateSystem,
      x,
      y,
      width,
      height,
      style,
      visible,
      events,
      getSoundingVisibility:
        sounding => sounding.visible && sounding.options.hodograph.visible
    });
    
    this._gridOptions = this.getNormalizedGridOptions(grid);
    
    this.center = [this.width/2, this.height/2];
    if (origin !== undefined) {
      this.center[0] -= origin[0] * this.minLength/2;
      this.center[1] += origin[1] * this.minLength/2;
    }
    this.pixelPerSpeed = Math.min(
      Math.max(this.width - this.center[0], this.center[0]),
      Math.max(this.height - this.center[1], this.center[1])
    ) / windspeedMax;
    if (this._gridOptions.max === undefined)
      this._gridOptions.max = windspeedMax;
    
    this.init();
  }
  
  /**
   * Draw the sounding into the SVG group.
   * 
   * @override
   */
  drawSounding(sounding, group) {
    super.drawSounding(sounding, group);
    
    let polyline = [];
    sounding.sounding.getLevels().forEach(level => {
      if (level === undefined)
        return;
      let levelData = sounding.sounding.getData(level);
      if (levelData.wdir === undefined ||
        levelData.wspd === undefined)
        return;
      let x = levelData.wspd * -Math.sin(levelData.wdir / 180 * Math.PI);
      let y = levelData.wspd * Math.cos(levelData.wdir / 180 * Math.PI);
      polyline.push([
        this.center[0] + x * this.pixelPerSpeed,
        this.center[1] + y * this.pixelPerSpeed
      ]);
    });
    group
      .polyline(polyline)
      .fill('none')
      .stroke(sounding.options.hodograph.style);
  }
  
  /**
   * Plots hodograph background.
   * 
   * @override
   */
  _drawBackground(svgNode) {
    super._drawBackground(svgNode);
    
    // border, background
    svgNode
      .rect(this.width-2, this.height-2)
      .move(1,1)
      .fill({color: 'white'})
      .stroke({color: 'black', width: 1});
    //.attr({rx: 10, ry: 10});
    
    // x-/y-axes
    if (this._gridOptions.axes.visible) {
      let axesLength =
        this._gridOptions.max + this._gridOptions.circles.interval / 2;
      svgNode
        .line(
          Math.max(0, this.center[0] - axesLength * this.pixelPerSpeed),
          this.center[1],
          Math.min(this.width,
            this.center[0] + axesLength * this.pixelPerSpeed),
          this.center[1]
        )
        .stroke(this._gridOptions.axes.style);
      svgNode
        .line(
          this.center[0],
          Math.max(0, this.center[1] - axesLength * this.pixelPerSpeed),
          this.center[0],
          Math.min(this.height,
            this.center[1] + axesLength * this.pixelPerSpeed)
        )
        .stroke(this._gridOptions.axes.style);
    }
    
    // circles and labels
    for (let v = this._gridOptions.circles.interval;
      v <= this._gridOptions.max;
      v += this._gridOptions.circles.interval) {
      let radius = v * this.pixelPerSpeed;
      svgNode
        .circle(2*radius)
        .attr({
          cx: this.center[0],
          cy: this.center[1]
        })
        .fill('none')
        .stroke(this._gridOptions.circles.style);
      if (this._gridOptions.labels.visible) {
        let xText =
          radius *
          Math.cos((this._gridOptions.labels.angle - 90) / 180 * Math.PI);
        let yText =
          radius *
          Math.sin((this._gridOptions.labels.angle - 90) / 180 * Math.PI);
        let textAnchor = 'middle';
        let dx = 0;
        let dy = -this._gridOptions.labels.font.size;
        if (this._gridOptions.labels.angle == 0 ||
          this._gridOptions.labels.angle == 180) {
          dx = -3;
          textAnchor = 'end';
        }
        else if (this._gridOptions.labels.angle == 90 ||
               this._gridOptions.labels.angle == 270)
          dy = -3;
        let text = svgNode
          .plain('' + Math.round(windspeedMSToKMH(v)))
          .move(this.center[0] + xText, this.center[1] + yText)
          .attr({
            'text-anchor': textAnchor,
            //'alignment-baseline': 'middle'
            dx: dx,
            dy: dy // XXX: Hack für Firefox
          })
          .font(this._gridOptions.labels.font);
        let bbox = text.bbox();
        text.before(
          svgNode
            .rect(bbox.width, bbox.height)
            .move(bbox.x, bbox.y)
            .fill('white')
        );
      }
    }
  }
  
  /**
   * Normalizes options for grid.
   * 
   * @private
   */
  getNormalizedGridOptions({
    axes = {},
    circles = {},
    labels = {},
    max = undefined
  }) {
    axes = getNormalizedLineOptions(axes);
    circles = getNormalizedLineOptions(circles);
    if (!('interval' in circles) ||
        circles.interval === undefined)
      circles.interval = windspeedKMHToMS(50);
    labels = getNormalizedTextOptions(labels);
    if (!('angle' in labels) ||
        labels.angle === undefined)
      labels.angle = 225;
    if (labels.font.size === undefined)
      labels.font.size = 10;
    
    return {
      axes,
      circles,
      labels,
      max
    };
  }
}
export default Hodograph;