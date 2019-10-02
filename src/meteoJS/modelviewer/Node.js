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
     * @type Object.<mixed,module:meteoJS/modelviewer/resource.Resource[]>
     * @private
     */
    this._resources = {};
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
    let result = [];
    this.variableCollection.variables.forEach(variable => {
      if (variable.id in this._resources)
        this._resources[variable.id].forEach(resource => result.push(resource));
    });
    return result;
  }
  
  /**
   * Append resources.
   * 
   * @param {...module:meteoJS/modelviewer/resource.Resource} resources
   *   Resources.
   * @package
   */
  append(...resources) {
    resources.forEach(resource => {
      let variable = resource.getVariableByVariableCollection(this.variableCollection);
      /* Only append resources, that have variables which belongs to node's
       * collection.
       */
      if (variable.id !== undefined) {
        resource.variables.forEach(variable => {
          if (!(variable.id in this._resources))
            this._resources[variable.id] = [];
          this._resources[variable.id].push(resource);
        });
      }
    });
  }
  
  /**
   * Removes resources.
   * 
   * @param {...module:meteoJS/modelviewer/resource.Resource} resources
   *   Resources.
   * @package
   */
  remove(...resources) {
    resources.forEach(resource => {
      resource.variables.forEach(variable => {
        if (variable.id in this_resources) {
          let i = this._resources[variable.id].indexOf(resource);
          if (i > -1)
            this._resources[variable.id].splice(i, 1);
        }
      });
    });
  }
  
  /**
   * Returns all or a part of the resources contained in this node. The returned
   * resources are defined by all of the passed variables.
   * 
   * @param {...module:meteoJS/modelviewer/variable.Variable} variables
   *   Variables.
   * @returns {module:meteoJS/modelviewer/resource.Resource[]} Resources.
   */
  getResourcesByVariables(...variables) {
    if (variables.length == 0)
      return [];
    let initVariable = undefined;
    let initLength = undefined;
    variables.forEach(variable => {
      if (variable.id in this._resources) {
        if (initLength === undefined ||
            initLength > this._resources[variable.id].length) {
          initVariable = variable;
          initLength = this._resources[variable.id].length;
        }
      }
    });
    if (initVariable === undefined)
      return [];
    let result = [];
    this._resources[initVariable.id].forEach(resource => {
      if (resource.isDefinedBy(...variables))
        result.push(resource);
    });
    return result;
  }
}
addEventFunctions(Node.prototype);
export default Node;