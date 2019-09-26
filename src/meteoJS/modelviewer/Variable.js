/**
 * @module meteoJS/modelviewer/variable
 */
import UniqueNamed from '../base/UniqueNamed.js';

/**
 * Options for constructor.
 * 
 * @typedef {module:meteoJS/base/uniquenamed~options}
 *   module:meteoJS/modelviewer/variable~options
 * @param {module:meteoJS/modelviewer/variableCollection.VariableCollection}
 *   [variableCollection] - Belongs to this VariableCollection.
 */

/**
 * @classdesc Object for e.g. a model, a runtime or a field.
 */
export class Variable extends UniqueNamed {
  
  /**
   * @param {module:meteoJS/modelviewer/variable~options} [options] - Options.
   */
  constructor({ id, names, langSortation, variableCollection } = {}) {
    super({
      id,
      names,
      langSortation
    });
    
    /**
     * @type undefined|module:meteoJS/modelviewer/variableCollection.VariableCollection
     * @private
     */
    this._variableCollection = variableCollection;
  }
  
  /**
   * This Variable belongs to this VariableCollection.
   * @type undefined|module:meteoJS/modelviewer/variableCollection.VariableCollection
   */
  get variableCollection() {
    return this._variableCollection;
  }
  set variableCollection(variableCollection) {
    this._variableCollection = variableCollection;
  }
}
export default Variable;