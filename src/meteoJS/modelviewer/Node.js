/**
 * @module meteoJS/modelviewer/node
 */
import addEventFunctions from '../Events.js';
import ResourcesTreeNode from './ResourcesTreeNode.js';

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
     * @type undefined|module:meteoJS/modelviewer/resourcesTreeNode.ResourcesTreeNode
     * @private
     */
    this._resourcesTopNode = undefined;

    /**
     * @type Map<module:meteoJS/modelviewer/resourcesTreeNode.ResourcesTreeNode,
     *           Map<module:meteoJS/modelviewer/variable.Variable,
     *               Set<module:meteoJS/modelviewer/resource.Resource>>>
     * @private
     */
    this._resources = new Map();
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
    const result = [];
    for (const m of this._resources.values()) {
      [...m.values()]
        .forEach(resources => result.push(...resources));
    }
    return result;
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
    if (this._resourcesTopNode === undefined)
      this._makeResourcesTopNode();

    let addedCount = 0;
    resources.forEach(resource => {
      if (resource.variables
        .filter(v => v.variableCollection === this.variableCollection)
        .length < 1)
        return;
      const resourcesTreeNode =
        this._resourcesTopNode.buildChildrenTreeForResource({
          resource,
          aimedNode: this
        });
      if (resourcesTreeNode !== undefined) {
        const variable = resource
          .getVariableByVariableCollection(resourcesTreeNode.variableCollection);
        if (variable !== undefined) {
          let mapByVariables = this._resources.get(resourcesTreeNode);
          if (mapByVariables === undefined) {
            mapByVariables = new Map();
            this._resources.set(resourcesTreeNode, mapByVariables);
          }
          let resources = mapByVariables.get(variable);
          if (resources === undefined) {
            resources = new Set();
            mapByVariables.set(variable, resources);
          }
          if (!resources.has(resource)) {
            resources.add(resource);
            addedCount++;
          }
        }
      }
    });
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
      const resourcesTreeNode = this._resourcesTopNode
        .findNodeByVariables(...resource.variables);
      if (resourcesTreeNode !== undefined) {
        const variable = resource
          .getVariableByVariableCollection(resourcesTreeNode.variableCollection);
        const mapByVariables = this._resources.get(resourcesTreeNode);
        if (mapByVariables !== undefined) {
          const resourcesSet = mapByVariables.get(variable);
          if (resourcesSet !== undefined) {
            resourcesSet.delete(resource);
            removedCount++;
            if (resourcesSet.size < 1) {
              mapByVariables.delete(variable);
              if (mapByVariables.size < 1) {
                this._resources.delete(resourcesTreeNode);
                const parent = resourcesTreeNode.parent;
                if (parent !== undefined)
                  parent.removeChild({ child: resourcesTreeNode });
              }
            }
          }
        }
      }
    });
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
    if (this._resourcesTopNode === undefined)
      return [];

    let exactlyMatch = false;
    if (variables.length &&
        typeof variables[0] === 'boolean')
      exactlyMatch = variables.shift();
    
    if (exactlyMatch && variables.length == 0)
      return [];

    if (exactlyMatch) {
      const variablesSet = new Set(variables);
      const node = this._resourcesTopNode.findNodeByVariables(...variables);
      const mapByVariables = this._resources.get(node);
      if (mapByVariables !== undefined) {
        for (const [variable, resources] of mapByVariables) {
          if (!variablesSet.has(variable))
            continue;
          if (resources === undefined || resources.size < 1)
            return [];
          const resource = [...resources][0];
          let isAdded = true;
          variables.forEach(variable => {
            const v = resource.getVariableByVariableCollection(variable.variableCollection);
            if (v !== variable)
              isAdded = false;
          });
          return isAdded ? [...resources] : [];
        }
      }
      return [];
    }

    // !exactlyMatch
    const collectResourcesTreeChildren = resourcesTreeNode => {
      let result = new Set();
      if (resourcesTreeNode.children.length < 1) {
        result.add(resourcesTreeNode);
        return result;
      }
      let v = undefined;
      variables.forEach(variable => {
        if (variable.variableCollection === resourcesTreeNode.variableCollection)
          v = variable;
      });
      /* If no variable is found, then collect the nodes of all children. */
      if (v === undefined) {
        resourcesTreeNode.children.forEach(child => {
          result = new Set([...result, ...collectResourcesTreeChildren(child)]);
        });
      }
      else {
        const child = resourcesTreeNode.getChildByVariable(v);
        if (child !== undefined)
          result = new Set([...result, ...collectResourcesTreeChildren(child)]);
      }
      return result;
    };
    const resourcesTreeNodes = collectResourcesTreeChildren(this._resourcesTopNode);
    const result = [];
    [...resourcesTreeNodes].forEach(resourcesTreeNode => {
      const mapByVariables = this._resources.get(resourcesTreeNode);
      if (mapByVariables === undefined)
        return;
      for (const [variable, resources] of mapByVariables) {
        if (variable.variableCollection !== resourcesTreeNode.variableCollection)
          continue;
        if (resources === undefined || resources.size < 1)
          return;
        const resource = [...resources][0];
        let isAdded = true;
        variables.forEach(variable => {
          const v = resource.getVariableByVariableCollection(variable.variableCollection);
          if (v !== variable) {
            isAdded = false;
          }
        });
        if (isAdded)
          result.push(...resources);
      }
    });
    return result;
  }

  /**
   * Returns if there exists resources which are defined by all of the passed
   * variables.
   * 
   * @param {boolean} [exactlyMatch=false] - Only returns true, if there exists
   *  at least one resource, which is defined exactly by the passed variables.
   * @param {...module:meteoJS/modelviewer/variable.Variable} variables
   *   Variables.
   * @returns {boolean} Exists at least one resource.
   */
  hasResourcesByVariables(...variables) {
    return (this.getResourcesByVariables(...variables).length > 0);
  }

  /**
   * Creates to top node for the resources-tree.
   * 
   * @private
   */
  _makeResourcesTopNode() {
    const traversedNodes = new Set();
    const getTopNode = node => {
      const parents = node.parents;
      if (parents.length < 1)
        return node;
      let result = undefined;
      parents.forEach(parentNode => {
        if (!traversedNodes.has(parentNode)) {
          traversedNodes.add(parentNode);
          const r = getTopNode(parentNode);
          if (r !== undefined)
            result = r;
        }
      });
      return result;
    };
    this._resourcesTopNode =
      new ResourcesTreeNode({ node: getTopNode(this) });
  }
}
addEventFunctions(Node.prototype);
export default Node;