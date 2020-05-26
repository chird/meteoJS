/**
 * @module meteoJS/base/unique
 */

/**
 * Options for constructor.
 * 
 * @typedef {Object} module:meteoJS/base/unique~options
 * @param {mixed} [id] - Id.
 */

/**
 * @classdesc Class that describe an object with an unique id.
 */
export class Unique {
  
  /**
   * @param {module:meteoJS/base/unique~options} [options] - Options.
   */
  constructor({ id } = {}) {
    this._id = id;
  }
  
  /**
   * Id.
   * @type {mixed}
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
  setId() {}
}
export default Unique;