/**
 * @module meteoJS/base/namedCollection
 */
import Collection from './Collection.js';
import Named from './Named.js';

/**
 * Options for constructor.
 * 
 * @typedef {module:meteoJS/base/collection~options}
 *   module:meteoJS/base/namedCollection~options
 * @param {string} [name] - Default name.
 * @param {Object.<string,string>} [names] - Names.
 * @param {string[]} [langSortation] - Priority of language codes.
 */

/**
 * @classdesc Collection-class with i18n names.
 */
export class NamedCollection extends Collection {
  
  /**
   * @param {module:meteoJS/base/namedCollection~options} options - Options.
   */
  constructor({ fireReplace=true,
                fireAddRemoveOnReplace=false,
                appendOnReplace=true,
                sortFunction,
                emptyObjectMaker,
                name = undefined,
                names = {},
                langSortation = [] } = {}) {
    super({
      fireReplace,
      fireAddRemoveOnReplace,
      appendOnReplace,
      sortFunction,
      emptyObjectMaker
    });
    
    Object.defineProperty(this, 'name',
      Object.getOwnPropertyDescriptor(Named.prototype, 'name'));
    Object.getPrototypeOf(this).getNameByLang = Named.prototype.getNameByLang;
    Object.getPrototypeOf(this).getNameByLangNoFallback =
      Named.prototype.getNameByLangNoFallback;
    // Named constructor code
    /**
     * @type undefined|string
     * @private
     */
    this.defaultName = name;
    /**
     * @type Object
     * @private
     */
    this.names = names;
    /**
     * @type Array
     * @private
     */
    this.langSortation = langSortation;
  }
}
export default NamedCollection;