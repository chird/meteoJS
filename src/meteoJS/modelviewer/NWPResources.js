/**
 * @module meteoJS/modelviewer/nwpResources
 */

/**
 * @classdesc Setup a Resources-Object to be used for NWP.
 */
export class NWPResources extends Resources {
  
  constructor() {
    let models = new VariableCollection({
      id: 'models'
    });
    super({
      topVariableCollection: models
    });
    
    let runs = new VariableCollection({
      id: 'runs'
    });
    let regions = new VariableCollection({
      id: 'regions'
    });
    let fields = new VariableCollection({
      id: 'fields'
    });
    let levels = new VariableCollection({
      id: 'levels'
    });
    let accumulations = new VariableCollection({
      id: 'accumulations'
    });
    let offsets = new VariableCollection({
      id: 'offsets'
    });
    models.appendChild(runs);
    runs.appendChild(regions);
    regions.appendChild(fields);
    fields.appendChild(levels, accumulations);
    levels.appendChild(offsets);
    accumulations.appendChild(offsets);
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
  
  /**
   * Collection of all defined offsets.
   * 
   * @type module:meteoJS/modelviewer/variableCollection.VariableCollection
   */
  get offsetCollection() {
    return this.getVariableCollectionById('offsets');
  }
}
export default NWPResources;