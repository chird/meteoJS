/**
 * @module meteoJS/base/uniquenamed
 */
import Unique from './Unique.js';
import Named from './Named.js';

/**
 * Options for constructor.
 * 
 * @typedef {module:meteoJS/base/named~options}
 *   module:meteoJS/base/uniquenamed~options
 * @param {mixed} [id] - Id.
 */

/**
 * @classdesc Class that describe objects with an unique id and with names.
 * @augments module:meteoJS/base/unique.Unique
 */
export class UniqueNamed extends Named {
  
  /**
   * @param {module:meteoJS/base/uniquenamed~options} [options] - Options.
   */
  constructor({ id, names, langSortation } = {}) {
    super({
      names,
      langSortation
    });
    
    Object.defineProperty(this, 'id',
      Object.getOwnPropertyDescriptor(Unique.prototype, 'id'));
    // constructor code of Unique
    this._id = id;
  }
  
  /**
   * @override
   */
  setId(id) {
    Unique.prototype.setId.call(this, id);
  }
}
export default UniqueNamed;