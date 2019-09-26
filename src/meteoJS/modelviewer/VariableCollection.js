/**
 * @module meteoJS/modelviewer/variableCollection
 */
import Variable from './Variable.js';
import Unique from '../base/Unique.js';
import NamedCollection from '../base/NamedCollection.js';

/**
 * Triggered on adding a Variable to collection.
 * 
 * @event module:meteoJS/modelviewer/variableCollection#add:variable
 * @param {module:meteoJS/modelviewer/variable.Variable} variable -
 *   Added variable.
 */

/**
 * Triggered on removing a Variable from collection.
 * 
 * @event module:meteoJS/modelviewer/variableCollection#remove:variable
 * @param {module:meteoJS/modelviewer/variable.Variable} variable -
 *   Removed variable.
 */

/**
 * Triggered on append a child VariableCollection.
 * 
 * @event module:meteoJS/modelviewer/variableCollection#append:child
 * @param {module:meteoJS/modelviewer/variableCollection.VariableCollection}
 *   variableCollection - Appended child VariableCollection.
 */

/**
 * Options for constructor.
 * 
 * @typedef {module:meteoJS/base/namedCollection~options}
 *   module:meteoJS/modelviewer/variableCollection~options
 */

/**
 * @classdesc A collection of Variable-objects. It also defines a hierarchy
 *   of the collections. So a VariableCollection could have children and
 *   parents.
 * @augments module:meteoJS/base/unique.Unique
 * @fires module:meteoJS/modelviewer/variableCollection#add:variable
 * @fires module:meteoJS/modelviewer/variableCollection#remove:variable
 * @fires module:meteoJS/modelviewer/variableCollection#append:child
 */
export class VariableCollection extends NamedCollection {
  
  /**
   * @param {module:meteoJS/modelviewer/variableCollection~options} options
   *   - Options.
   */
  constructor({ id,
                fireReplace=true,
                fireAddRemoveOnReplace=false,
                appendOnReplace=true,
                sortFunction,
                names,
                langSortation } = {}) {
    super({
      emptyObjectMaker: () => { return new Variable() },
      fireReplace,
      fireAddRemoveOnReplace,
      appendOnReplace,
      sortFunction,
      names,
      langSortation
    });
    
    Object.defineProperty(this, 'id',
      Object.getOwnPropertyDescriptor(Unique.prototype, 'id'));
    // constructor code of Unique
    this._id = id;
    
    this.on('add:item', item => {
      item.variableCollection = this;
      this.trigger('add:variable', item)
    });
    this.on('remove:item', item => this.trigger('remove:variable', item));
    
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
   * @override
   */
  setId(id) {
    Unique.prototype.setId.call(this, id);
  }
  
  /**
   * @type module:meteoJS/modelviewer/variableCollection.VariableCollection[]
   */
  get parents() {
    return this._parents;
  }
  
  /**
   * @type module:meteoJS/modelviewer/variableCollection.VariableCollection[]
   */
  get children() {
    return this._children;
  }
  
  /**
   * Appends a VariableCollection as a child.
   * 
   * @param
   *   {...module:meteoJS/modelviewer/variableCollection.VariableCollection}
   *   variableCollections
   *   VariableCollections to append.
   * @returns {module:meteoJS/modelviewer/variableCollection.VariableCollection}
   *   This.
   * @fires module:meteoJS/modelviewer/variableCollection#append:child
   */
  appendChild(...variableCollections) {
    variableCollections.forEach(variableCollection => {
      this._children.push(variableCollection);
      variableCollection._addParent(this);
      this.trigger('append:child', variableCollection);
    });
    return this;
  }
  
  /**
   * Removes a child VariableCollection.
   * 
   * @param
   *   {...module:meteoJS/modelviewer/variableCollection.VariableCollection}
   *   variableCollections
   *   VariableCollections to remove.
   * @returns {module:meteoJS/modelviewer/variableCollection.VariableCollection}
   *   This.
   */
  removeChild(...variableCollections) {
    variableCollections.forEach(variableCollection => {
      let i = this._children.indexOf(variableCollection);
      if (i > -1) {
        this._children.splice(i, 1);
        variableCollection._removeParent(this);
      }
    });
    return this;
  }
  
  /**
   * Addes a parent VariableCollection.
   * 
   * @param {module:meteoJS/modelviewer/variableCollection.VariableCollection}
   *   variableCollection
   *   VariableCollection to add.
   * @internal
   */
  _addParent(variableCollection) {
    this._parents.push(variableCollection);
  }
  
  /**
   * Removes a parent VariableCollection.
   * 
   * @param {module:meteoJS/modelviewer/variableCollection.VariableCollection}
   *   variableCollection
   *   VariableCollection to remove.
   * @internal
   */
  _removeParent(variableCollection) {
    let i = this._parents.indexOf(variableCollection);
    if (i > -1)
      this._parents.splice(i, 1);
  }
}
export default VariableCollection;