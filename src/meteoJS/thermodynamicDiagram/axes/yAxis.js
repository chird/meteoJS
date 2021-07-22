/**
 * @module meteoJS/thermodynamicDiagram/axes/yAxis
 */
import Axis from '../Axis.js';

/**
 * Definitions for the labels of the windspeed profile axis.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram/axis~labelsOptions}
 *   module:meteoJS/thermodynamicDiagram/axes/yAxis~labelOptions
 * @property {number} [interval=50] - Interval between the labels.
 * @property {string} [unit='hPa']
 */

/**
 * Options for the constructor.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram/axis~options}
 *   module:meteoJS/thermodynamicDiagram/axes/yAxis~options
 * @property {module:meteoJS/thermodynamicDiagram/axes/yAxis~labelOptions}
 *   [labels] - Options for the labels.
 */

/**
 * Class to draw the yAxis labelling.
 * 
 * @extends module:meteoJS/thermodynamicDiagram/axis.Axis
 */
export class yAxis extends Axis {

  /**
   * @param {module:meteoJS/thermodynamicDiagram/axes/yAxis~options} options
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
    labels = {},
    title = {}
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
      labels,
      title,
      isHorizontal: false
    });
  }

  /**
   * Normalize the options for the labels.
   * 
   * @param {module:meteoJS/thermodynamicDiagram/axes/yAxis~labelOptions}
   *   options - Options.
   * @returns {module:meteoJS/thermodynamicDiagram/axes/yAxis~labelOptions}
   *   Normalized options.
   * @override
   */
  getNormalizedLabelsOptions({
    interval = 50,
    unit = 'hPa',
    ...rest
  }) {
    return super.getNormalizedLabelsOptions({
      interval,
      unit,
      ...rest
    });
  }

  /**
   * Draws the labels of the axis.
   * 
   * @param {external:SVG} svgNode - Node to draw into.
   * @param {number} [min] - Minimum windspeed value to label.
   * @param {number} [max]
   *   Maximum windspeed value to label.
   * @param {Function} [getTextByInterval]
   *   Returns the text representation of the label value (its argument).
   * @param {Function} [getPositionByInterval]
   *   Returns the position in pixels of the label value (its argument).
   * @override
   */
  drawLabels({
    svgNode,
    min = Math.ceil(this.coordinateSystem.getPByXY(0, this.height)/this._labelsOptions.interval)*this._labelsOptions.interval,
    max = Math.floor(this.coordinateSystem.getPByXY(0, 0)/this._labelsOptions.interval)*this._labelsOptions.interval,
    getTextByInterval = level => Number.parseFloat(level).toFixed(this._labelsOptions.decimalPlaces),
    getPositionByInterval = level => this.height - this.coordinateSystem.getYByXP(0, level)
  }) {
    super.drawLabels({
      svgNode,
      min,
      max,
      getTextByInterval,
      getPositionByInterval
    });
  }

}
export default yAxis;