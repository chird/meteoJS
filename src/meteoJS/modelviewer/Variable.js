/**
 * @module meteoJS/modelviewer/variable
 */
import extend from 'jquery-extend';
import Named from '../Named.js';

/**
 * Options for Variable constructor
 * 
 * @typedef {Object} meteoJS/modelviewer/variable~options
 * @param {mixed} id - Id.
 */

/**
 * @classdesc Object for e.g. a model, a runtime or a field.
 */
export class Variable extends Named {
  
  /**
   * @param {meteoJS/modelviewer/variable~options} options - Options.
   */
  constructor(options) {
    options = extend(true, {
      id: undefined
    }, options);
    
    this._id = options.id;
  }
  
  /**
   * Id of the object.
   * @type mixed
   */
  get id() {
    return this._id;
  }
  set id(id) {
    this._id = id;
  }
}
export default Variable;