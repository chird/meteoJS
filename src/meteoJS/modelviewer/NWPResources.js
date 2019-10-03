/**
 * @module meteoJS/modelviewer/nwpResources
 */
import Resources from './Resources.js';
import VariableCollection from './VariableCollection.js';
import Node from './Node.js';

/**
 * @classdesc For usage of NWP (numerical weather prediction). This class is
 *   designed to use the modelviewer for NWP.
 */
export class NWPResources extends Resources {
  
  constructor() {
    let collections = {};
    ['models', 'runs', 'regions', 'levels', 'accumulations']
    .forEach(id => collections[id] = new VariableCollection({ id }));
    let nodes = {};
    Object.keys(collections)
    .forEach(id => nodes[id] = new Node(collections[id]));
    // build hierarchy
    nodes.models.appendChild(nodes.runs);
    nodes.runs.appendChild(nodes.regions);
    nodes.regions.appendChild(nodes.fields);
    nodes.fields.appendChild(nodes.levels, nodes.accumulations);
    
    super({
      topNode: nodes.models
    });
  }
  
  /**
   * Creates a Variable-Object and adds it to a VariableCollection.
   * 
   * @param {mixed} variableCollectionId - ID of the VariableCollection.
   * @param {Object} [options] - Options.
   * ...
   * @returns {NWPResources} This.
   */
  addVariable(variableCollectionId, { id, names = {} } = {}) {
    this.getVariableCollectionById(variableCollectionId).append(new Variable({
      id,
      names
    }));
    return this;
  }
  
  /**
   * Collection of all defined models.
   * 
   * @type module:meteoJS/modelviewer/variableCollection.VariableCollection
   */
  get modelCollection() {
    return this.topVariableCollection;
  }
  
  /**
   * Collection of all defined runs.
   * 
   * @type module:meteoJS/modelviewer/variableCollection.VariableCollection
   */
  get runCollection() {
    return this.getVariableCollectionById('runs');
  }
  
  /**
   * Collection of all defined regions.
   * 
   * @type module:meteoJS/modelviewer/variableCollection.VariableCollection
   */
  get regionCollection() {
    return this.getVariableCollectionById('regions');
  }
  
  /**
   * Collection of all defined fields.
   * 
   * @type module:meteoJS/modelviewer/variableCollection.VariableCollection
   */
  get fieldCollection() {
    return this.getVariableCollectionById('fields');
  }
  
  /**
   * Collection of all defined levels.
   * 
   * @type module:meteoJS/modelviewer/variableCollection.VariableCollection
   */
  get levelCollection() {
    return this.getVariableCollectionById('levels');
  }
  
  /**
   * Collection of all defined accumulations.
   * 
   * @type module:meteoJS/modelviewer/variableCollection.VariableCollection
   */
  get accumulationCollection() {
    return this.getVariableCollectionById('accumulations');
  }
}
export default NWPResources;