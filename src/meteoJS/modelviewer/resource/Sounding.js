/**
 * @module meteoJS/modelviewer/resource/sounding
 */
import Resource from '../Resource.js';
import SoundingData from '../../Sounding.js';

/**
 * Options for constructor.
 * 
 * @typedef {module:meteoJS/modelviewer/resource~options}
 *   module:meteoJS/modelviewer/resource/sounding~options
 * @param {module:meteoJS/sounding.Sounding} [sounding] - Sounding data.
 */

/**
 * @classdesc Class to describe an sounding resource.
 */
export class Sounding extends Resource {
  
  /**
   * @param {module:meteoJS/modelviewer/resource/sounding~options} [options]
   *   Options.
   */
  constructor({ variables = [],
                datetime = undefined,
                run = undefined,
                offset = undefined,
                sounding = undefined } = {}) {
    super({
      variables,
      datetime,
      run,
      offset
    });
    
    /**
     * @type undefined|module:meteoJS/sounding.Sounding
     * @private
     */
    this._sounding = sounding;
  }
  
  /**
   * Sounding data.
   * 
   * @type module:meteoJS/sounding.Sounding
   */
  get sounding() {
    return (this._sounding === undefined) ? new SoundingData() : this._sounding;
  }
  set sounding(sounding) {
    this._sounding = sounding;
  }
}
export default Sounding;