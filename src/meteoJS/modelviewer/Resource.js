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
 *   The variables must be from different VariableCollections.
 * @param {Date} [datetime] - Datetime, ignored if run and offset are defined.
 * @param {Date} [run] - Runtime.
 * @param {integer} [offset] - Offset in seconds.
 */

/**
 * @classdesc Class to describe a data resource like a modelplot or a
 *   sounding data. The resource must be defined uniquely by several variables
 *   (like model, runtime, …). You should not define the resource by
 *   several variables of the same collection.
 * @abstract
 */
export class Resource {
  
  /**
   * @param {module:meteoJS/modelviewer/resource~options} [options] - Options.
   */
  constructor({ variables = [],
    datetime = undefined,
    run = undefined,
    offset = undefined } = {}) {
    /**
     * @type Set<module:meteoJS/modelviewer/variable.Variable>
     * @private
     */
    this._variables = new Map();
    variables.forEach(variable =>
      this._variables.set(variable.variableCollection, variable));
    
    /**
     * @type Date|undefined
     * @private
     */
    this._datetime = datetime;
    
    /**
     * @type undefined|Date
     */
    this._run = run;
    
    /**
     * @type undefined|integer
     */
    this._offset = offset;
    
    this._updateDatetime();
  }
  
  /**
   * Variable objects, which define this resource. Like model, run, offset,…
   * 
   * @type module:meteoJS/modelviewer/variable.Variable[]
   * @readonly
   */
  get variables() {
    return [...this._variables.values()];
  }
  
  /**
   * Resource is valid for this datetime. If undefined, than the resource is
   * not only valid at one datetime.
   * 
   * @type Date|undefined
   */
  get datetime() {
    return this._datetime;
  }
  set datetime(datetime) {
    this._datetime = datetime;
  }
  
  /**
   * Runtime.
   * 
   * @type Date|undefined
   */
  get run() {
    return this._run;
  }
  set run(run) {
    this._run = run;
    this._updateDatetime();
  }
  
  /**
   * Offset.
   * 
   * @type integer|undefined
   */
  get offset() {
    return this._offset;
  }
  set offset(offset) {
    this._offset = offset;
    this._updateDatetime();
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
    const result = this._variables.get(variableCollection);
    return (result === undefined) ? new Variable() : result;
  }
  
  /**
   * Returns if the passed Variable-objects all define this resource.
   * 
   * @param {boolean} [exactlyMatch] - Only return true, if the passed
   *   variables exactly define the resource.
   * @param {...module:meteoJS/modelviewer/variable.Variable} variables
   *   Variables.
   * @returns {boolean} All passed variables defines the resource.
   */
  isDefinedBy(...variables) {
    let exactlyMatch = false;
    if (variables.length &&
        typeof variables[0] === 'boolean')
      exactlyMatch = variables.shift();
    const vars = new Set([...this._variables.values()]);
    if (!exactlyMatch)
      return variables.filter(v => !vars.has(v)).length == 0;
    
    if (variables.filter(v => !vars.has(v)).length != 0)
      return false;
    const variablesSet = new Set(variables);
    return [...vars].filter(v => !variablesSet.has(v)).length == 0;
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
    return this._variables.get(variableCollection) !== undefined;
  }
  
  /**
   * Sets datetime according to run and offset.
   * 
   * @private
   */
  _updateDatetime() {
    if (this._run !== undefined &&
        this._offset !== undefined)
      this.datetime = new Date(this._run.valueOf() + this._offset * 1000);
  }
}
export default Resource;