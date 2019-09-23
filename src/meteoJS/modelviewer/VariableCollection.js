/**
 * @module meteoJS/modelviewer/variableCollection
 */
import Variable from './Variable.js';
import NamedCollection from '../base/NamedCollection.js';

/**
 * Triggered on adding a Variable to collection.
 * 
 * @event meteoJS/modelviewer/variableCollection#add:variable
 * @param {module:meteoJS/modelviewer/variable.Variable} variable -
 *   Added variable.
 */

/**
 * Triggered on removing a Variable from collection.
 * 
 * @event meteoJS/modelviewer/variableCollection#remove:variable
 * @param {module:meteoJS/modelviewer/variable.Variable} variable -
 *   Removed variable.
 */

/**
 * Triggered on append a child VariableCollection.
 * 
 * @event meteoJS/modelviewer/variableCollection#append:child
 * @param {module:meteoJS/modelviewer/variable.VariableCollection}
 *   variableCollection - Appended child VariableCollection.
 */

/**
 * Options for constructor.
 * 
 * @typedef {module:meteoJS/base/namedCollection~options}
 *   meteoJS/modelviewer/variableCollection~options
 */

/**
 * @classdesc A collection of Variable-objects. It also defines a hierarchy
 *   of the collections. So a VariableCollection could have children and
 *   parents.
 * @fires meteoJS/modelviewer/variableCollection#add:variable
 * @fires meteoJS/modelviewer/variableCollection#remove:variable
 * @fires meteoJS/modelviewer/variableCollection#append:child
 */
export class VariableCollection extends NamedCollection {
  
  /**
   * @param {meteoJS/modelviewer/variableCollection~options} options - Options.
   */
  constructor({ fireReplace=true,
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
    
    this.on('add:item', item => {
      item.variableCollection = this;
      this.trigger('add:variable', item)
    });
    this.on('remove:item', item => this.trigger('remove:variable', item));
    
    /** @type VariableCollection[] */
    this._parents = [];
    /** @type VariableCollection[] */
    this._children = [];
  }
  
  /**
   * @type VariableCollection[]
   */
  get parents() {
    return this._parents;
  }
  
  /**
   * @type VariableCollection[]
   */
  get children() {
    return this._children;
  }
  
  /**
   * Appends a VariableCollection as a child.
   * 
   * @param {...VariableCollections} variableCollections -
   *   VariableCollections to append.
   * @returns {VariableCollection} This.
   * @fires meteoJS/modelviewer/variableCollection#append:child
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
   * @param {...VariableCollections} variableCollections -
   *   VariableCollections to remove.
   * @returns {VariableCollection} This.
   */
  removeChild(variableCollection) {
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
   * @param {VariableCollection} variableCollection -
   *   VariableCollection to add.
   * @internal
   */
  _addParent(variableCollection) {
    this._parents.push(variableCollection);
  }
  
  /**
   * Removes a parent VariableCollection.
   * 
   * @param {VariableCollection} variableCollection -
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