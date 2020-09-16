/**
 * @module meteoJS/modelviewer/offsetVariable
 */
import TimeVariable from './TimeVariable.js';

/**
 * Options for OffsetVariable constructor
 * 
 * @typedef {module:meteoJS/base/timeVariable~options}
 *   module:meteoJS/modelviewer/offsetVariable~options
 * @param {undefined|Date} [run] - Runtime.
 * @param {undefined|integer} [offset] - Offset in seconds.
 */

/**
 * @classdesc Class for something representing a time. The constructor supports
 *   passing a runtime and an offset from this runtime.
 */
export class OffsetVariable extends TimeVariable {
  
  /**
   * @param {module:meteoJS/modelviewer/offsetVariable~options} options - Options.
   */
  constructor({ id,
    name = undefined,
    names = {},
    langSortation = [],
    datetime = undefined,
    run = undefined,
    offset = undefined } = {}) {
    super({
      id,
      name,
      names,
      langSortation,
      datetime
    });
    
    /**
     * @type undefined|Date
     */
    this._run = run;
    /**
     * @type undefined|integer
     */
    this._offset = offset;
    
    this._updateDatetime();
  }
  
  /**
   * Runtime.
   * 
   * @type Date|undefined
   */
  get run() {
    return this._run;
  }
  set run(run) {
    this._run = run;
    this._updateDatetime();
  }
  
  /**
   * Offset.
   * 
   * @type integer|undefined
   */
  get offset() {
    return this._offset;
  }
  set offset(offset) {
    this._offset = offset;
    this._updateDatetime();
  }
  
  /**
   * Sets datetime according to run and offset.
   * @private
   */
  _updateDatetime() {
    if (this._run !== undefined &&
        this._offset !== undefined)
      this.datetime = new Date(this._run.valueOf() + this._offset * 1000);
  }
}
export default OffsetVariable;