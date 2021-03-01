/**
 * @module meteoJS/modelviewer/node
 */
import addEventFunctions from '../Events.js';

/**
 * Triggered on append of a child node.
 * 
 * @event module:meteoJS/modelviewer/node#append:child
 * @param {module:meteoJS/modelviewer/node.Node} node - Appended child node.
 */

/**
 * A node has always a correspondent VariableCollection. With the node objects
 * a hierarchy of the collections is build up. This hierarchy is mainly used
 * to achieve a good user experience. This way, the menus in the
 * {@link module:meteoJS/modelviewer/container.Container|modelviewer-container}
 * could be setup to present the user only available fields or levels or only
 * activate buttons which are available for a certain model and run.
 * Additionally a node contains a list of resources, this is used internally
 * in {@link module:meteoJS/modelviewer/resources.Resources}.
 * 
 * @fires module:meteoJS/modelviewer/node#append:child
 */
export class Node {
  
  /**
   * @param {module:meteoJS/modelviewer/variableCollection.VariableCollection}
   *   variableCollection
   *   This node belongs to this collection.
   */
  constructor(variableCollection) {
    
    /**
     * @type module:meteoJS/modelviewer/variableCollection.VariableCollection
     * @private
     */
    this._variableCollection = variableCollection;
    variableCollection.node = this;
    
    /**
     * @type module:meteoJS/modelviewer/node.Node[]
     * @private
     */
    this._parents = [];
    
    /**
     * @type module:meteoJS/modelviewer/node.Node[]
     * @private
     */
    this._children = [];
    
    /**
     * @type Map<module:meteoJS/modelviewer/variableCollection.VariableCollection,
     *           Set<module:meteoJS/modelviewer/resource.Resource>>
     * @private
     */
    this._resources = new Map();
    
    /**
     * @type Set<undefined|module:meteoJS/modelviewer/resource.Resource[]>
     * @private
     */
    this._resourcesCache = undefined;
  }
  
  /**
   * VariableCollection correspondent to this node.
   * 
   * @type module:meteoJS/modelviewer/variableCollection.VariableCollection
   */
  get variableCollection() {
    return this._variableCollection;
  }
  
  /**
   * Parent nodes.
   * 
   * @type module:meteoJS/modelviewer/node.Node[]
   */
  get parents() {
    return this._parents;
  }
  
  /**
   * Child nodes.
   * 
   * @type module:meteoJS/modelviewer/node.Node[]
   */
  get children() {
    return this._children;
  }
  
  /**
   * Appends a node as a child.
   * 
   * @param {...module:meteoJS/modelviewer/node.Node} nodes - Node to append.
   * @returns {module:meteoJS/modelviewer/node.Node} This.
   * @fires module:meteoJS/modelviewer/node#append:child
   */
  appendChild(...nodes) {
    nodes.forEach(node => {
      this._children.push(node);
      node._addParent(this);
      this.trigger('append:child', node);
    });
    return this;
  }
  
  /**
   * Adds a parent node.
   * 
   * @param {module:meteoJS/modelviewer/node.Node} node - Node to add.
   * @package
   */
  _addParent(node) {
    this._parents.push(node);
  }
  
  /**
   * All contained resources.
   * 
   * @type module:meteoJS/modelviewer/resource.Resource[]
   * @package
   */
  get resources() {
    if (this._resourcesCache !== undefined)
      return this._resourcesCache;

    let result = new Set();
    for (let resources of this._resources.values()) {
      for (let r of resources.values())
        result.add(r);
    }
    this._resourcesCache = [...result];
    return this._resourcesCache;
  }
  
  /**
   * Append resources.
   * 
   * @param {...module:meteoJS/modelviewer/resource.Resource} resources
   *   Resources.
   * @returns {integer} Count of really added resources.
   * @package
   */
  append(...resources) {
    let addedCount = 0;
    resources.forEach(resource => {
      let variable =
        resource.getVariableByVariableCollection(this.variableCollection);
      /* Only append resources, that have variables which belongs to node's
       * collection.
       */
      if (variable.id === undefined)
        return;
      resource.variables.forEach(variable => {
        if (!this._resources.has(variable.variableCollection))
          this._resources.set(variable.variableCollection, new Set());
        if (!this._resources.get(variable.variableCollection).has(resource))
          addedCount++;
        this._resources.get(variable.variableCollection).add(resource);
      });
    });
    if (addedCount)
      this._resourcesCache = undefined;
    return addedCount;
  }
  
  /**
   * Removes resources.
   * 
   * @param {...module:meteoJS/modelviewer/resource.Resource} resources
   *   Resources.
   * @returns {integer} Count of really removed resources.
   * @package
   */
  remove(...resources) {
    let removedCount = 0;
    resources.forEach(resource => {
      resource.variables.forEach(variable => {
        if (this._resources.has(variable.variableCollection))
          if (this._resources.get(variable.variableCollection).delete(resource))
            removedCount++;
      });
    });
    if (removedCount)
      this._resourcesCache = undefined;
    return removedCount;
  }
  
  /**
   * Returns all or a part of the resources contained in this node. The returned
   * resources are defined by all of the passed variables.
   * 
   * @param {boolean} [exactlyMatch=false] - Only return resources, which are
   *   defined exactly by the passed variables.
   * @param {...module:meteoJS/modelviewer/variable.Variable} variables
   *   Variables.
   * @returns {module:meteoJS/modelviewer/resource.Resource[]} Resources.
   */
  getResourcesByVariables(...variables) {
    let exactlyMatch = false;
    if (variables.length &&
        typeof variables[0] === 'boolean')
      exactlyMatch = variables.shift();
    
    if (exactlyMatch && variables.length == 0)
      return [];
    
    return this.resources.filter(resource => {
      return resource.isDefinedBy(exactlyMatch, ...variables);
    });
  }
}
addEventFunctions(Node.prototype);
export default Node;