/**
 * @module meteoJS/thermodynamicDiagram/axes/xAxis
 */
import {
  tempKelvinToCelsius,
  tempCelsiusToKelvin
} from '../../calc.js';
import Axis from '../Axis.js';

/**
 * Definitions for the labels of the x-axis of the thermodynamic diagram.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram/axis~labelsOptions}
 *   module:meteoJS/thermodynamicDiagram/axes/xAxis~labelOptions
 * @property {number} [interval=10] - Interval between the labels.
 * @property {string} [unit='°C']
 *   Unit of the label values. Allowed values: '°C', 'K'.
 */

/**
 * Class to draw the xAxis labelling.
 * 
 * @extends module:meteoJS/thermodynamicDiagram/axis.Axis
 */
export class xAxis extends Axis {

  /**
   * Normalize the options for the labels.
   * 
   * @param {module:meteoJS/thermodynamicDiagram/axes/xAxis~labelOptions}
   *   options - Options.
   * @returns {module:meteoJS/thermodynamicDiagram/axes/xAxis~labelOptions}
   *   Normalized options.
   * @override
   */
  getNormalizedLabelsOptions({
    interval = 10,
    unit = '°C',
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
   * @param {number} [min] - Minimum temperature value to label.
   * @param {number} [max] - Maximum temperature value to label.
   * @param {Function} [getTextByInterval]
   *   Returns the text representation of the label value (its argument).
   * @param {Function} [getPositionByInterval]
   *   Returns the position in pixels of the label value (its argument).
   * @override
   */
  drawLabels({
    svgNode,
    getTextByInterval = T => Number.parseFloat(T).toFixed(this._labelsOptions.decimalPlaces),
    getPositionByInterval = T => {
      if (this._labelsOptions.unit == '°C')
        T = tempCelsiusToKelvin(T);
      return this.coordinateSystem.getXByYT(0, T)
    }
  }) {
    const min = (this._labelsOptions.unit == '°C')
      ? Math.ceil(tempKelvinToCelsius(this.coordinateSystem.getTByXY(0, 0))/this._labelsOptions.interval)*this._labelsOptions.interval
      : Math.ceil((this.coordinateSystem.getTByXY(0, 0))/this._labelsOptions.interval)*this._labelsOptions.interval;
    const max = (this._labelsOptions.unit == '°C')
      ? Math.floor(tempKelvinToCelsius(this.coordinateSystem.getTByXY(this.width, 0))/this._labelsOptions.interval)*this._labelsOptions.interval
      : Math.floor((this.coordinateSystem.getTByXY(this.width, 0))/this._labelsOptions.interval)*this._labelsOptions.interval
    super.drawLabels({
      svgNode,
      min,
      max,
      getTextByInterval,
      getPositionByInterval
    });
  }
  
}
export default xAxis;