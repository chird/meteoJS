/**
 * @module meteoJS/base/uniquenamed
 */
import extend from 'jquery-extend';
import Unique from './Unique.js';
import Named from './Named.js';

/**
 * Options for constructor.
 * 
 * @typedef {meteoJS/named~options} meteoJS/uniquenamed~options
 * @param {mixed} [id] - Id.
 */

/**
 * @classdesc Class that describe objects with an unique id and with names.
 * @augments Unique
 */
export class UniqueNamed extends Named {
  
  /**
   * @param {meteoJS/uniquenamed~options} options - Options.
   */
  constructor(options) {
    options = extend(true, {
      id: undefined
    }, options);
    super(options);
    
    Object.defineProperty(this, 'id', Object.getOwnPropertyDescriptor(Unique.prototype, 'id'));
    // constructor code of Unique
    this._id = options.id;
  }
}
export default UniqueNamed;