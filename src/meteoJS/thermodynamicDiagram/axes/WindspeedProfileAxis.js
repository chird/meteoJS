/**
 * @module meteoJS/thermodynamicDiagram/axes/windspeedProfileAxis
 */
import {
  windspeedKNToMS,
  windspeedMSToKN,
  windspeedMSToKMH
} from '../../calc.js';
import {
  drawTextInto
} from '../Functions.js';
import Axis from '../Axis.js';

/**
 * Definitions for the labels of the windspeed profile axis.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram/axis~labelsOptions}
 *   module:meteoJS/thermodynamicDiagram/axes/windspeedProfileAxis~labelOptions
 * @property {number} [interval=25.72] - Interval between the labels.
 * @property {string} [unit='kn']
 *   Unit of the label values. Allowed values: 'm/s', 'kn', 'km/h'.
 * @property {string} [prefix=' kn'] - Prefix of the label text.
 */

/**
 * Options for the constructor.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram/axis~options}
 *   module:meteoJS/thermodynamicDiagram/axes/windspeedProfileAxis~options
 * @property {module:meteoJS/thermodynamicDiagram/axes/windspeedProfileAxis~labelOptions}
 *   [labels] - Options for the labels.
 * @property {number} [windspeedMax=77.17]
 *   The maximum windspeed value. Unit: m/s.
 */

/**
 * Class to draw the labelling of the windspeed profile.
 * 
 * @extends module:meteoJS/thermodynamicDiagram/axis.Axis
 */
export class WindspeedProfileAxis extends Axis {

  /**
   * @param {module:meteoJS/thermodynamicDiagram/windspeedProfileAxis~options}
   *   options - Options.
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
    title = {},
    windspeedMax = windspeedKNToMS(150)
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
      title
    });

    /**
     * @type number
     * @private
     */
    this._windspeedMax = windspeedMax;

    this.init();
  }

  /**
   * Maximum axis value. Unit: m/s.
   * 
   * @type number
   */
  get windspeedMax() {
    return this._windspeedMax;
  }
  set windspeedMax(windspeedMax) {
    const oldWindspeedMax = this._windspeedMax;
    this._windspeedMax = windspeedMax;
    if (this._windspeedMax != oldWindspeedMax)
      this.onCoordinateSystemChange();
  }

  /**
   * Normalize the options for the labels.
   * 
   * @param {module:meteoJS/thermodynamicDiagram/axes/windspeedProfileAxis~labelOptions}
   *   options - Options.
   * @returns {module:meteoJS/thermodynamicDiagram/axes/windspeedProfileAxis~labelOptions}
   *   Normalized options.
   * @override
   */
  getNormalizedLabelsOptions({
    interval = windspeedKNToMS(50),
    unit = 'kn',
    prefix = ' kn',
    ...rest
  }) {
    return super. getNormalizedLabelsOptions({
      interval,
      unit,
      prefix,
      ...rest
    });
  }

  /**
   * Draws the labels of the axis.
   * 
   * @param {external:SVG} svgNode - Node to draw into.
   * @param {number} [min=0] - Minimum windspeed value to label.
   * @param {number} [max=this._windspeedMax]
   *   Maximum windspeed value to label.
   * @param {Function} [getTextByInterval]
   *   Returns the text representation of the label value (its argument).
   * @param {Function} [getPositionByInterval]
   *   Returns the position in pixels of the label value (its argument).
   * @override
   */
  drawLabels({
    svgNode,
    min = 0,
    max = this._windspeedMax,
    getTextByInterval = windspeed => {
      switch (this._labelsOptions.unit) {
      case 'm/s':
        return Number.parseFloat(windspeed)
          .toFixed(this._labelsOptions.decimalPlaces);
        break;
      case 'kn':
        return windspeedMSToKN(windspeed)
          .toFixed(this._labelsOptions.decimalPlaces);
        break;
      default:
        return windspeedMSToKMH(windspeed)
          .toFixed(this._labelsOptions.decimalPlaces);
        break;
      }
    },
    getPositionByInterval =
      windspeed => this.width * windspeed / this._windspeedMax
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
export default WindspeedProfileAxis;