/**
 * @module meteoJS/modelviewer/variable
 */
import UniqueNamed from '../base/UniqueNamed.js';

/**
 * Options for constructor.
 * 
 * @typedef {meteoJS/base/uniquenamed~options}
 *   meteoJS/modelviewer/variable~options
 * @param {module:meteoJS/modelviewer/variableCollection.VariableCollection}
 *   [variableCollection] - Belongs to this VariableCollection.
 */

/**
 * @classdesc Object for e.g. a model, a runtime or a field.
 */
export class Variable extends UniqueNamed {
  
  /**
   * @param {meteoJS/modelviewer/variable~options} [options] - Options.
   */
  constructor({ id, names, langSortation, variableCollection } = {}) {
    super({
      id,
      names,
      langSortation
    });
    
    /** @type undefined|module:meteoJS/modelviewer/variableCollection.VariableCollection */
    this._variableCollection = variableCollection;
  }
  
  /** @type undefined|module:meteoJS/modelviewer/variableCollection.VariableCollection */
  get variableCollection() {
    return this._variableCollection;
  }
  set variableCollection(variableCollection) {
    this._variableCollection = variableCollection;
  }
}
export default Variable;