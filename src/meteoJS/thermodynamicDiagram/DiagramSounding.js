/**
 * @module meteoJS/thermodynamicDiagram/sounding
 */
import $ from 'jquery';
import addEventFunctions from '../Events.js';

/**
 * @event module:meteoJS/thermodynamicDiagram/sounding#change:visible
 */

/**
 * Definition of the options for the constructor.
 * @typedef {Object} module:meteoJS/thermodynamicDiagram/sounding~options
 * @param {boolean} visible Visibility of sounding
 * @param {Object} diagram Options for thermodynamic diagram
 * @param {boolean} diagram.visible
 *   Visibility in thermodynamic diagram of this sounding
 * @param {Object} diagram.temp Options for temperature curve
 * @param {boolean} diagram.temp.visible
 *   Visibility of temperature curve in thermodynamic diagram
 * @param {meteoJS/thermodynamicDiagram~lineStyleOptions} diagram.temp.style
 *   Style for temperature curve
 * @param {Object} diagram.dewp Options for dewpoint temperature curve
 * @param {boolean} diagram.dewp.visible
 *   Visibility of dewpoint temperature curve in thermodynamic diagram
 * @param {meteoJS/thermodynamicDiagram~lineStyleOptions} diagram.dewp.style
 *   Style for dewpoint temperature curve
 * @param {meteoJS/thermodynamicDiagram/windprofile~soundingOptions}
 *   windprofile
 *   Windprofile options.
 * @param {Object} hodograph Options for hodograph
 * @param {boolean} hodograph.visible
 *   Visibility in hodograph of this sounding
 */

/**
 * Representation of a plottet sounding (data and display options)
 */
export class DiagramSounding {
  
  /**
   * @param {module:meteoJS/sounding.Sounding} sounding - Sounding data.
   * @param {module:meteoJS/thermodynamicDiagram/sounding~options} options - Options.
   */
  constructor(sounding, options) {
    /**
     * @type meteoJS/sounding
     * @private
     */
    this.sounding = sounding;
  
    /**
     * @type meteoJS/thermodynamicDiagram/sounding~options
     * @private
     */
    this.options = $.extend(true, {
      visible: true,
      diagram: {
        visible: true,
        temp: {
          visible: true,
          style: {
            color: undefined,
            width: 1,
            opacity: undefined,
            linecap: undefined,
            linejoin: undefined,
            dasharray: undefined
          }
        },
        dewp: {
          visible: true,
          style: {
            color: undefined,
            width: 1,
            opacity: undefined,
            linecap: undefined,
            linejoin: undefined,
            dasharray: undefined
          }
        }
      },
      windprofile: {
        visible: true,
        windbarbs: {
          visible: true,
          style: {
            color: undefined,
            width: 1,
            opacity: undefined,
            linecap: undefined,
            linejoin: undefined,
            dasharray: undefined
          }
        },
        windspeed: {
          visible: true,
          style: {
            color: undefined,
            width: 1,
            opacity: undefined,
            linecap: undefined,
            linejoin: undefined,
            dasharray: undefined
          }
        }
      },
      hodograph: {
        visible: true,
        style: {
          width: 1
        }
      }
    }, options);
  }

  /**
   * Returns sounding data.
   * 
   * @returns {module:meteoJS/sounding.Sounding} Sounding data.
   */
  getSounding() {
    return this.sounding;
  }

  /**
   * Visibility of sounding in the diagram.
   * 
   * @param {boolean} [visible] Visibility.
   * @returns {boolean|module:meteoJS/thermodynamicDiagram/sounding.DiagramSounding} Either visibility or this.
   * @fires {module:meteoJS/thermodynamicDiagram/sounding#change:visible}
   */
  visible(visible) {
    if (visible === undefined)
      return this.options.visible;
    else {
      let old = this.options.visible;
      this.options.visible = visible ? true : false;
      if (old != this.options.visible)
        this.trigger('change:visible', this);
      return this;
    }
  }

}
addEventFunctions(DiagramSounding.prototype);
export default DiagramSounding;