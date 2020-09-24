/**
 * @module meteoJS/thermodynamicDiagram/diagramParcel
 */
import addEventFunctions from '../Events.js';
import Unique from '../base/Unique.js';
import {
  getNormalizedLineOptions,
  updateLineOptions
} from '../thermodynamicDiagram/Functions.js';

/**
 * Change visibility event. Only triggered, if the visibility of the parcel
 * changes.
 * 
 * @event module:meteoJS/thermodynamicDiagram/diagramParcel#change:visible
 */

/**
 * Change options event.
 * 
 * @event module:meteoJS/thermodynamicDiagram/diagramParcel#change:options
 */

/**
 * Style/visibility options for a parcel in the thermodynamic diagram.
 * 
 * @typedef {Object}
 *   module:meteoJS/thermodynamicDiagram/diagramParcel~parcelOptions
 * @property {boolean} [visible=true]
 *   Visibility in the thermodynamic diagram.
 * @property {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   [temp] - Options for the temperature curve.
 * @property {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   [dewp] - Options for the dewpoint curve.
 */

/**
 * Definition of the options for the constructor.
 * 
 * @typedef {module:meteoJS/base/unique~options}
 *   module:meteoJS/thermodynamicDiagram/diagramParcel~options
 * @property {module:meteoJS/sounding/parcel.Parcel} [parcel] - Parcel object.
 * @property {boolean} [visible=true] - Visibility of the parcel.
 * @property {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   [temp] - Options for the temperature curve.
 * @property {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   [dewp] - Options for the dewpoint curve.
 */

/**
 * Representation of a plotted parcel (data and display options)
 * 
 * <pre><code>import DiagramParcel from 'meteojs/thermodynamicDiagram/DiagramParcel';</code></pre>
 * 
 * @extends module:meteoJS/base/unique.Unique
 * @fires module:meteoJS/thermodynamicDiagram/diagramParcel#change:visible
 * @fires module:meteoJS/thermodynamicDiagram/diagramParcel#change:options
 */
export class DiagramParcel extends Unique {
  
  /**
   * @param {module:meteoJS/thermodynamicDiagram/diagramParcel~options} [options] - Options.
   */
  constructor({
    parcel = undefined,
    visible = true,
    temp = {},
    dewp = {},
    ...rest
  } = {}) {
    super(rest);
    
    /**
     * @type module:meteoJS/sounding/parcel.Parcel
     * @private
     */
    this._parcel = parcel;
    
    /**
     * @type {module:meteoJS/thermodynamicDiagram/diagramParcel~parcelOptions}
     * @private
     */
    this._options = {
      visible,
      temp: getNormalizedLineOptions(temp, {
        style: {
          color: 'rgb(255, 153, 0)',
          width: 3,
          linecap: 'round'
        }
      }),
      dewp: getNormalizedLineOptions(dewp, {
        style: {
          color: 'rgb(255, 153, 0)',
          width: 3,
          linecap: 'round'
        }
      })
    };
  }

  /**
   * Parcel object.
   * 
   * @type module:meteoJS/sounding/parcel.Parcel
   * @readonly
   */
  get parcel() {
    return this._parcel;
  }
  
  /**
   * Visibility of the parcel.
   * 
   * @type {boolean}
   * @fires module:meteoJS/thermodynamicDiagram/diagramParcel#change:visible
   */
  get visible() {
    return this._options.visible;
  }
  set visible(visible) {
    let oldVisible = this._options.visible;
    this._options.visible = visible ? true : false;
    if (oldVisible != this._options.visible)
      this.trigger('change:visible');
  }
  
  /**
   * Style options for the parcel.
   * 
   * @type {module:meteoJS/thermodynamicDiagram/diagramParcel~parcelOptions}
   * @readonly
   */
  get options() {
    return this._options;
  }
  
  /**
   * Updated the style options for the parcel.
   * 
   * @param {module:meteoJS/thermodynamicDiagram/diagramParcel~parcelOptions}
   *   [options] - Options.
   * @fires module:meteoJS/thermodynamicDiagram/diagramParcel#change:visible
   * @fires module:meteoJS/thermodynamicDiagram/diagramParcel#change:options
   */
  update({
    visible = undefined,
    temp = undefined,
    dewp = undefined
  } = {}) {
    let willTrigger = false;
    if (temp === undefined)
      temp = {};
    else
      willTrigger = true;
    if (dewp === undefined)
      dewp = {};
    else
      willTrigger = true;
    
    
    this._options.temp = updateLineOptions(this._options.temp, temp);
    this._options.dewp = updateLineOptions(this._options.dewp, dewp);
    
    if (willTrigger)
      this.trigger('change:options');
    
    if (visible !== undefined)
      this.visible = visible;
  }
}
addEventFunctions(DiagramParcel.prototype);
export default DiagramParcel;