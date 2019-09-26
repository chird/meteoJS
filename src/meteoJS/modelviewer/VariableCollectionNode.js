/**
 * @module meteoJS/modelviewer/variableCollectionNode
 */
import addEventFunctions from '../Events.js';

/**
 * Triggered on append of a child VariableCollection.
 * 
 * @event module:meteoJS/modelviewer/variableCollectionNode#append:child
 * @param {module:meteoJS/modelviewer/variableCollection.VariableCollection}
 *   variableCollection - Appended child VariableCollection.
 */

/**
 * Setzt Hierarchie der VariableCollections. Muss mehrere Parents haben. Bspw.
 * Offset hat mehrere Levels/Accumul. als Parent(). Auch Field hat mehrere Parents,
 * nämlich Region, Punkt, Querschnitt, etc.
 * 
 * @fires module:meteoJS/modelviewer/variableCollectionNode#append:child
 */
export class VariableCollectionNode {
  
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
     * @type module:meteoJS/modelviewer/variableCollection.VariableCollection[]
     * @private
     */
    this._parents = [];
    
    /**
     * @type module:meteoJS/modelviewer/variableCollection.VariableCollection[]
     * @private
     */
    this._children = [];
  }
  
  /**
   * @type module:meteoJS/modelviewer/variableCollection.VariableCollection
   */
  get variableCollection() {
    return this._variableCollection;
  }
  
  /**
   * Parent nodes.
   * @type module:meteoJS/modelviewer/variableCollection.VariableCollection[]
   */
  get parents() {
    return this._parents;
  }
  
  /**
   * Child nodes.
   * @type module:meteoJS/modelviewer/variableCollection.VariableCollection[]
   */
  get children() {
    return this._children;
  }
  
  /**
   * Appends a node as a child.
   * 
   * @param
   *   {...module:meteoJS/modelviewer/variableCollectionNode.VariableCollectionNode}
   *   nodes
   *   VariableCollectionNodes to append.
   * @returns
   *   {module:meteoJS/modelviewer/variableCollectionNode.VariableCollectionNode}
   *   This.
   * @fires module:meteoJS/modelviewer/variableCollectionNode#append:child
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
   * Removes a child node.
   * 
   * @param
   *   {...module:meteoJS/modelviewer/variableCollectionNode.VariableCollectionNode}
   *   nodes
   *   VariableCollectionNodes to remove.
   * @returns {module:meteoJS/modelviewer/variableCollectionNode.VariableCollectionNode}
   *   This.
   */
  removeChild(...nodes) {
    nodes.forEach(node => {
      let i = this._children.indexOf(node);
      if (i > -1) {
        this._children.splice(i, 1);
        node._removeParent(this);
      }
    });
    return this;
  }
  
  /**
   * Addes a parent node.
   * 
   * @param
   *  {module:meteoJS/modelviewer/variableCollectionNode.VariableCollectionNode}
   *   node
   *   Node to add.
   * @internal
   */
  _addParent(node) {
    this._parents.push(node);
  }
  
  /**
   * Removes a parent node.
   * 
   * @param
   *   {module:meteoJS/modelviewer/variableCollectionNode.VariableCollectionNode}
   *   node
   *   Node to remove.
   * @internal
   */
  _removeParent(node) {
    let i = this._parents.indexOf(node);
    if (i > -1)
      this._parents.splice(i, 1);
  }
}
addEventFunctions(VariableCollectionNode.prototype);
export default VariableCollectionNode;