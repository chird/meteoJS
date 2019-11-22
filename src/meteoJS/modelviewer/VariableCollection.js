/**
 * @module meteoJS/modelviewer/variableCollection
 */
import Variable from './Variable.js';
import Unique from '../base/Unique.js';
import UniqueNamed from '../base/UniqueNamed.js';
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
 * Options for constructor.
 * 
 * @typedef {module:meteoJS/base/namedCollection~options}
 *   module:meteoJS/modelviewer/variableCollection~options
 */

/**
 * @classdesc A collection of Variable-objects. It also defines a hierarchy
 *   of the collections. So a VariableCollection could have children and
 *   parents. A variable object can only belong to one collection.
 * @augments module:meteoJS/base/unique.Unique
 * @fires module:meteoJS/modelviewer/variableCollection#add:variable
 * @fires module:meteoJS/modelviewer/variableCollection#remove:variable
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
    
    // ID as name
    Object.defineProperty(this, 'getDefaultName',
      Object.getOwnPropertyDescriptor(UniqueNamed.prototype, 'getDefaultName'));
    
    /**
     * @type undefined|module:meteoJS/modelviewer/node.Node
     * @private
     */
    this._node = undefined;
    
    this.on('add:item', item => {
      if (item.variableCollection !== undefined)
        item.variableCollection.remove(item);
      item.variableCollection = this;
      this.trigger('add:variable', item)
    });
    this.on('remove:item', item => this.trigger('remove:variable', item));
  }
  
  /**
   * @override
   */
  setId(id) {
    Unique.prototype.setId.call(this, id);
  }
  
  /**
   * Variables contained by this collection.
   * 
   * @type module:meteoJS/modelviewer/variable.Variable[]
   */
  get variables() {
    return this.items;
  }
  
  /**
   * Alias of getItemById.
   * 
   * @param {mixed} id ID.
   * @returns {module:meteoJS/modelviewer/variable.Variable} Variable.
   */
  getVariableById(id) {
    return this.getItemById(id);
  }
  
  /**
   * If defined, this VariableCollection belongs to this node.
   * 
   * @type undefined|module:meteoJS/modelviewer/node.Node
   */
  get node() {
    return this._node;
  }
  set node(node) {
    this._node = node;
  }
}
export default VariableCollection;