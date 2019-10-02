/**
 * @module meteoJS/modelviewer/resource
 */
import Variable from './Variable.js';

/**
 * Options for constructor.
 * 
 * @typedef {Object} module:meteoJS/modelviewer/resource~options
 * @param {module:meteoJS/modelviewer/variable.Variable[]} [variables] -
 *   Variables, which define this resource uniquely.
 */

/**
 * @classdesc Class to describe a data resource like a modelplot or a
 *   sounding data. The resource must be defined uniquely by several variables
 *   (like model, runtime, offset, …). You should not define the resource by
 *   several variables of the same collection.
 * @abstract
 */
export class Resource {
  
  /**
   * @param {module:meteoJS/modelviewer/resource~options} [options] - Options.
   */
  constructor({ variables = [] } = {}) {
    /**
     * @type Object.<mixed,module:meteoJS/modelviewer/variable.Variable>
     * @private
     */
    this._variables = {};
    variables.forEach(variable => {
      this._variables[variable.id] = variable;
    });
  }
  
  /**
   * Variable objects, which define this resource. Like model, run, offset,…
   * 
   * @type module:meteoJS/modelviewer/variable.Variable[]
   * @readonly
   */
  get variables() {
    return Object.keys(this._variables).map(id => this._variables[id]);
  }
  
  /**
   * Returns the variable-object that is part of the definition of this resource
   * and contains to the passed collection. If you define the resource by
   * several variables of the same variable collection, it is not defined
   * which variable is returned.
   * 
   * @param {module:meteoJS/modelviewer/variableCollection.VariableCollection}
   *   variableCollection - VariableCollection.
   * @returns {module:meteoJS/modelviewer/variable.Variable}
   */
  getVariableByVariableCollection(variableCollection) {
    let result = undefined;
    this.variables.forEach(variable => {
      if (variable.variableCollection === variableCollection)
        result = variable;
    });
    return (result === undefined) ? new Variable() : result;
  }
  
  /**
   * Returns if the passed Variable-objects all define this resource.
   * 
   * @param {...module:meteoJS/modelviewer/variable.Variable} variables
   *   Variables.
   * @returns {boolean} All passed variables defines the resource.
   */
  isDefinedBy(...variables) {
    let result = true;
    variables.forEach(variable => {
      if (!(variable.id in this._variables) ||
          this._variables[variable.id] !== variable)
        result = false;
    });
    return result;
  }
  
  /**
   * Returns if a Variable-object of the passed collection defines this
   * resource.
   * 
   * @param {module:meteoJS/modelviewer/variableCollection.VariableCollection}
   *   variableCollection - VariableCollection.
   * @returns {boolean} A variable of the collection defines the resource.
   */
  isDefinedByVariableOf(variableCollection) {
    let result = false;
    variableCollection.variables.forEach(variable => {
      if (this.isDefinedBy(variable))
        result = true;
    });
    return result;
  }
}
export default Resource;