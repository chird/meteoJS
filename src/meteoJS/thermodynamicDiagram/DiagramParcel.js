/**
 * @module meteoJS/thermodynamicDiagram/diagramParcel
 */
import addEventFunctions from '../Events.js';
import Unique from '../base/Unique.js';

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
 * Definition of the options for the constructor.
 * 
 * @typedef {Object} module:meteoJS/thermodynamicDiagram/diagramParcel~options
 * @property {module:meteoJS/sounding/parcel.Parcel} [parcel] - Parcel object.
 * @property {boolean} [visible=true] - Visibility of the parcel.
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
    ...rest
  } = {}) {
    super(rest);
    
    /**
     * @type module:meteoJS/sounding/parcel.Parcel
     * @private
     */
    this._parcel = parcel;
    
    /**
     * @type boolean
     * @private
     */
    this._visible = visible;
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
    return this._visible;
  }
  set visible(visible) {
    let oldVisible = this._visible;
    this._visible = visible ? true : false;
    if (oldVisible != this._visible)
      this.trigger('change:visible');
  }
}
addEventFunctions(DiagramParcel.prototype);
export default DiagramParcel;