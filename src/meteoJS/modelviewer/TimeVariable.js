/**
 * @module meteoJS/modelviewer/timeVariable
 */
import Variable from './Variable.js';

/**
 * Options for TimeVariable constructor
 * 
 * @typedef {meteoJS/base/uniquenamed~options}
 *   meteoJS/modelviewer/timeVariable~options
 * @param {Date|undefined} [datetime] - Datetime.
 */

/**
 * @classdesc Class for something representing a time, e.g. runtime or offset.
 */
export class TimeVariable extends Variable {
  
  /**
   * @param {meteoJS/modelviewer/timeVariable~options} options Options.
   */
  constructor({ id, names, langSortation, datetime } = {}) {
    super({
      id,
      names,
      langSortation
    });
    
    /**
     * @type Date|undefined
     * @private
     */
    this._datetime = (this.id === undefined) ? undefined : new Date(this.id);
    
    if (datetime !== undefined)
      this.datetime = datetime;
  }
  
  /**
   * @override
   */
  setId(id) {
    this._datetime = (id === undefined) ? undefined : new Date(id);
  }
  
  /**
   * @type Date|undefined
   */
  get datetime() {
    return this._datetime;
  }
  set datetime(datetime) {
    this._datetime = datetime;
    this._id = (datetime !== undefined) ? datetime.valueOf() : undefined;
  }
}
export default TimeVariable;