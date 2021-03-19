/**
 * @module meteoJS/modelviewer/resourcesTreeNode
 */

/**
 * Options for constructor.
 * 
 * @typedef {Object} module:meteoJS/modelviewer/resourcesTreeNode~options
 * @param {module:meteoJS/modelviewer/node.Node} node
 *   The object is linked to this node.
 */

/**
 * Internal class to manage the available resources inside the
 * {@link module:meteoJS/modelviewer/node.Node|Node class}. Each
 * ResourcesTreeNode object is linked to a Node object. It is a many to one
 * relation. The hierarchy of the ResourcesTree is analogue to the Node
 * hierarchy. But the tree is build via the
 * {@link module:meteoJS/modelviewer/variable.Variable|Variable objects}.
 * So, this class is not only linked to a Node object, but subsequently for a
 * {@link module:meteoJS/modelviewer/variableCollection.VariableCollection|VariableCollection object}.
 * If a {@link module:meteoJS/modelviewer/resource.Resource|Resource} for a
 * certain Variable object from this VariableCollection is added, then a
 * child ResourcesTreeNode object is inserted in the tree (if it doesn't exists)
 * for the Variable object.
 * 
 * @internal
 */
export class ResourcesTreeNode {
  
  /**
   * @param {module:meteoJS/modelviewer/resourcesNode~options} [options]
   *   Options.
   */
  constructor({ node }) {
    
    /**
     * @type module:meteoJS/modelviewer/node.Node
     * @private
     */
    this._node = node;

    /**
     * @type Map.<module:meteoJS/modelviewer/variable.Variable,module:meteoJS/modelviewer/resourcesTreeNode.ResourcesTreeNode>
     * @private
     */
    this._children = new Map();

    /**
     * @type module:meteoJS/modelviewer/resourcesTreeNode.ResourcesTreeNode
     * @private
     */
    this._parent = undefined;
  }

  /**
   * Linked Node object.
   * 
   * @type module:meteoJS/modelviewer/node.Node
   * @readonly
   */
  get node() {
    return this._node;
  }

  /**
   * Linked VariableCollection object.
   * 
   * @type module:meteoJS/modelviewer/variableCollection.VariableCollection
   * @readonly
   */
  get variableCollection() {
    return this._node.variableCollection;
  }

  get children() {
    return [...this._children.values()];
  }

  /**
   * The parent object of this ResourcesTree-Node.
   * 
   * @type undefined|module:meteoJS/modelviewer/resourcesTreeNode.ResourcesTreeNode
   */
  get parent() {
    return this._parent;
  }
  set parent(parent) {
    this._parent = parent;
  }

  /**
   * Returns the child corresponding to the passed variable.
   * 
   * @param {module:meteoJS/modelviewer/variable.Variable} variable - Variable.
   * @returns {module:meteoJS/modelviewer/resourcesTreeNode.ResourcesTreeNode}
   *   Child ResourcesTreeNode object for the passed variable.
   */
  getChildByVariable(variable) {
    return this._children.get(variable);
  }

  /**
   * Build tree 
   * 
   * @param {Object} options - Options.
   * @param {module:meteoJS/modelviewer/resource.Resource} options.resource
   *   The added Resource object.
   * @param {module:meteoJS/modelviewer/node.Node} options.aimedNode
   *   The Resource object will be inserted into this Node object.
   * @returns {undefined|module:meteoJS/modelviewer/resourcesTreeNode.ResourcesTreeNode}
   */
  buildChildrenTreeForResource({
    resource,
    aimedNode
  }) {
    if (this.node === aimedNode)
      return this;

    const variable =
      resource.getVariableByVariableCollection(this.variableCollection);
    /* Shouldn't get an unknown Variable. The resource is inserted in the
     * Node-tree with a Variable in each Node. */
    if (variable.id === undefined)
      return undefined;

    let child = this._children.get(variable);
    if (child !== undefined)
      return child.buildChildrenTreeForResource({ resource, aimedNode });
    // Child doesn't already exist
    this.node.children.forEach(node => {
      // The resource will belong only to one node.
      const childVariable =
        resource.getVariableByVariableCollection(node.variableCollection);
      if (childVariable.id !== undefined)
        child = new ResourcesTreeNode({ node });
    });
    if (child !== undefined) {
      this._children.set(variable, child);
      child.parent = this;
      return child.buildChildrenTreeForResource({ resource, aimedNode });
    }
    return undefined;
  }

  /**
   * Removes a child in the Resources-Tree. If this was the only child of this
   * Resources-Tree-Node, then remove this Tree-Node from the parent.
   */
  removeChild({
    child
  }) {
    for (const [variable, c] of this._children.entries())
      if (c === child)
        this._children.delete(variable);
    if (this._children.size < 1
      && this.parent !== undefined)
      this.parent.removeChild({ child: this });
  }

  /**
   * Returns the bottom most ResourcesTreeNode object. On the way from the top
   * ResourcesTreeNode to this object, for every passed Variable object a
   * suitable ResourcesTreeNode is passed.
   * 
   * @param {...module:meteoJS/modelviewer/variable.Variable} - variables
   *   A set of Variable objects.
   * @returns {undefined|module:meteoJS/modelviewer/resourcesTreeNode.ResourcesTreeNode}
   *   Bottom most object.
   */
  findNodeByVariables(...variables) {
    let v = undefined;
    variables.forEach(variable => {
      if (variable.variableCollection === this.variableCollection)
        v = variable;
    });
    if (v === undefined)
      return undefined;
    const child = this._children.get(v);
    if (child !== undefined) {
      const result = child.findNodeByVariables(...variables);
      return (result === undefined) ? this : result;
    }
    return this;
  }
}
export default ResourcesTreeNode;