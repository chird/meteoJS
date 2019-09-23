/**
 * @module meteoJS/modelviewer/resources
 */

/**
 * Options for constructor.
 * 
 * @typedef {Object} meteoJS/modelviewer/resources~options
 * @param {module:meteoJS/modelviewer/variableCollection.VariableCollection[]}
 *   [topVariableCollection] - Top VariableCollection.
 */

/**
 * @classdesc Linchpin of the modelviewer. In this class every available
 *   resource is registered. Additionally request about data per Variable can
 *   be performed, like all available run times of a model or all available
 *   fields of model, etc.
 */
export class Resources {
  
  constructor({ topVariableCollection } = {}) {
    this._topVariableCollection = topVariableCollection;
  }
  
  /**
   * @type module:meteoJS/modelviewer/variableCollection.VariableCollection
   */
  get topVariableCollection() {
    return this._topVariableCollection;
  }
  set topVariableCollection(topVariableCollection) {
    this._topVariableCollection = topVariableCollection;
  }
  
  /**
   * Returns the VariableCollection with the passed Id.
   * 
   * @param {mixed} id - Id.
   * @returns {module:meteoJS/modelviewer/variableCollection.VariableCollection} -
   *   VariableCollection.
   */
  getVariableCollectionById(id) {
  }
  
  /**
   * Append an available resource.
   * 
   * @param {...module:meteoJS/modelviewer/resource.resource} resources - Resources.
   */
  append(...resources) {
  }
  
  remove(resource) {
  }
  
  exists(bla) {
  }
  
  appendVariableCollection(variableCollection) {
  }
  
  getChildrenVariables(variable) {
  }
  
  getParentVariables(variable) {
  }
}
export default Resources;