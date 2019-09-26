/**
 * @module meteoJS/modelviewer/resource
 */

/**
 * Options for constructor.
 * 
 * @typedef {Object} module:meteoJS/modelviewer/resource~options
 * @param {module:meteoJS/modelviewer/variable.Variable[]} [variables] -
 *   Variables, which define this resource uniquely.
 */

/**
 * @classdesc Class to describe a data resource like a modelplot or a
 *   sounding data.
 * @abstract
 */
export class Resource {
  
  /**
   * @param {module:meteoJS/modelviewer/resource~options} [options] - Options.
   */
  constructor({ variables = [] } = {}) {
    /**
     * @type module:meteoJS/modelviewer/variable.Variable[]
     * @private
     */
    this._variables = variables;
  }
  
  /**
   * Variable objects, which define this resource. Like model, run, offset,…
   * 
   * @type module:meteoJS/modelviewer/variable.Variable[]
   * @readonly
   */
  get variables() {
    return this._variables;
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
      let contained = false;
      this.variables.forEach(v => {
        if (variable == v)
          contained = true;
      });
      if (!contained)
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