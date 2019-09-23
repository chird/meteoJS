/**
 * @module meteoJS/modelviewer/resource
 */

/**
 * Options for constructor.
 * 
 * @typedef {Object} meteoJS/modelviewer/resource~options
 * @param {module:meteoJS/modelviewer/variable.Variable[]} [variables] -
 *   Variables that defined this resource uniquely.
 */

/**
 * @classdesc Class to describe a data resource like a modelplot or
 *   sounding data.
 */
export class Resource {
  
  /**
   * @param {meteoJS/modelviewer/resource~options} [options] - Options.
   */
  constructor({ variables = [] } = {}) {
    /** @type module:meteoJS/modelviewer/variable.Variable[] */
    this._variables = variables;
  }
  
  /** @type module:meteoJS/modelviewer/variable.Variable[] */
  get variables() {
    return this._variables;
  }
  set variables(variables) {
    this._variables = variables;
  }
  
  get keys() {
  }
  
  getVariable(key) {
  }
  setVariable(key, variable) {
  }
  
  // XXX: Könnten so alle Soundings zu einem Ort aber zu allen Zeiten geladen werden?
  get url() {
  }
  // XXX: Ev. Lösung, dass mehreres geladen werden kann. Direkt Daten angeben. (besser Weg zum Laden der Daten)
  get data() {
  }
}
export default Resource;