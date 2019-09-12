/**
 * @module meteoJS/modelviewer/nwpResources
 */

/**
 * Kind-Klasse von Resources. Erstellt Resources direkt für NWP.
 */
export class NWPResources extends Resources {
  
  constructor(options) {
    let variableCollection = new VariableCollection({
      id: 'models'
    });
    options.runs.forEach(id => {
      variableCollection.append(new Variable({ id });
    });
    let nodeModels = new VariableCollectionNode({
      variableCollection
    });
    
    nodeModels.appendNode(nodeRuns);
    nodeRuns.appendNode(nodeFields);
    nodeFields.appendNode(nodeLevels).appendNode(nodeAccumulations);
    nodeOffset.parents(nodeLevels, nodeAccumulations);
  }
  
  get models() {
  }
  
  get runs() {
  }
  
  get fields() {
  }
  
  get levels() {
  }
  
  get accumulations() {
  }
  
  get hierarchy() {
  }
}
export default NWPResources;