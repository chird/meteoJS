/**
 * @module meteoJS/modelviewer/nwpResources
 */
import Resources from './Resources.js';
import VariableCollection from './VariableCollection.js';
import Node from './Node.js';
import Variable from './Variable.js';
import TimeVariable from './TimeVariable.js';

/**
 * @classdesc For usage of NWP (numerical weather prediction). This class is
 *   designed to use the modelviewer for NWP.
 */
export class NWPResources extends Resources {
  
  constructor() {
    let collections = {};
    ['models', 'runs', 'regions', 'fields', 'levels', 'accumulations', 'thresholds']
    .forEach(id => collections[id] = new VariableCollection({ id }));
    let nodes = {};
    Object.keys(collections)
    .forEach(id => nodes[id] = new Node(collections[id]));
    // build hierarchy
    nodes.models.appendChild(nodes.runs);
    nodes.runs.appendChild(nodes.regions);
    nodes.regions.appendChild(nodes.fields);
    nodes.fields.appendChild(nodes.levels, nodes.accumulations);
    nodes.accumulations.appendChild(nodes.thresholds);
    
    super({
      topNode: nodes.models
    });
  }
  
  /**
   * Creates a Variable-Object and adds it to the VariableCollection.
   * 
   * @param {module:meteoJS/modelviewer/variableCollection.VariableCollection}
   *   variableCollection - VariableCollection.
   * @param {Object} [options] - Variable options.
   * @param {mixed} [options.id] - Variable id.
   * @param {string} [options.name] - Default name.
   * @param {Object.<string,string>} [options.names] - Names.
   * @param {string[]} [options.langSortation] - Priority of language codes.
   * @param {Date|undefined} [option.sdatetime] - Datetime.
   * @returns {module:meteoJS/modelviewer/nwpResources.NWPResources} This.
   */
  addVariable(variableCollection,
              { id,
                name = undefined,
                names = {},
                langSortation = [],
                datetime = undefined } = {}) {
    let variable =
      (datetime === undefined)
      ? new Variable({
          id,
          name,
          names,
          langSortation
        })
    : new TimeVariable({
        id,
        name,
        names,
        langSortation,
        datetime
      });
    variableCollection.append(variable);
    return this;
  }
  
  /**
   * Collection of all defined models.
   * 
   * @type module:meteoJS/modelviewer/variableCollection.VariableCollection
   * @readonly
   */
  get models() {
    return this.getNodeByVariableCollectionId('models').variableCollection;
  }
  
  /**
   * Collection of all defined runs.
   * 
   * @type module:meteoJS/modelviewer/variableCollection.VariableCollection
   * @readonly
   */
  get runs() {
    return this.getNodeByVariableCollectionId('runs').variableCollection;
  }
  
  /**
   * Collection of all defined regions.
   * 
   * @type module:meteoJS/modelviewer/variableCollection.VariableCollection
   * @readonly
   */
  get regions() {
    return this.getNodeByVariableCollectionId('regions').variableCollection;
  }
  
  /**
   * Collection of all defined fields.
   * 
   * @type module:meteoJS/modelviewer/variableCollection.VariableCollection
   * @readonly
   */
  get fields() {
    return this.getNodeByVariableCollectionId('fields').variableCollection;
  }
  
  /**
   * Collection of all defined levels.
   * 
   * @type module:meteoJS/modelviewer/variableCollection.VariableCollection
   * @readonly
   */
  get levels() {
    return this.getNodeByVariableCollectionId('levels').variableCollection;
  }
  
  /**
   * Collection of all defined accumulations.
   * 
   * @type module:meteoJS/modelviewer/variableCollection.VariableCollection
   * @readonly
   */
  get accumulations() {
    return this.getNodeByVariableCollectionId('accumulations').variableCollection;
  }
  
  /**
   * Collection of all defined thresholds.
   * 
   * @type module:meteoJS/modelviewer/variableCollection.VariableCollection
   * @readonly
   */
  get thresholds() {
    return this.getNodeByVariableCollectionId('thresholds').variableCollection;
  }
}
export default NWPResources;