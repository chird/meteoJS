/**
 * @module meteoJS/base/unique
 */
import extend from 'jquery-extend';

/**
 * Options for constructor.
 * 
 * @typedef {Object} meteoJS/base/unique~options
 * @param {mixed} [id] - Id.
 */

/**
 * @classdesc Class that describe objects with an unique id.
 */
export class Unique {
  
  /**
   * @param {meteoJS/base/unique~options} [options] - Options.
   */
  constructor(options = {}) {
    options = extend(true, {
      id: undefined
    }, options);
    
    this._id = options.id;
  }
  
  /**
   * @type {mixed} Id.
   */
  get id() {
    return this._id;
  }
  set id(id) {
    this._id = id;
    this.setId(id);
  }
  
  /**
   * Fired, wenn id-setter is called.
   * @protected
   * @param {mixed} id - Id.
   */
  setId(id) {}
}
export default Unique;