/**
 * @module meteoJS/base/collection
 */
import addEventFunctions from '../Events.js';
import Unique from './Unique.js';

/**
 * Triggered on adding item to collection.
 * 
 * @event meteoJS/base/collection#add:item
 * @param {module:meteoJS/base/unique.Unique} item - Added item.
 */

/**
 * Triggered on replacing item with already existing ID.
 * 
 * @event meteoJS/base/collection#replace:item
 * @param {module:meteoJS/base/unique.Unique} item - Added item.
 * @param {module:meteoJS/base/unique.Unique} removedItem - Replaced and removed item.
 */

/**
 * Triggered on removing item from collection.
 * 
 * @event meteoJS/base/collection#remove:item
 * @param {module:meteoJS/base/unique.Unique} item - Removed item.
 */

/**
 * Options for constructor.
 * 
 * @typedef {Object} meteoJS/base/collection~options
 * @param {boolean} [fireReplace] - Fire replace:item.
 * @param {boolean} [fireAddRemoveOnReplace] -
 *   Fire add:item and remove:item on replacing an item.
 * @param {boolean} [appendOnReplace] -
 *   Append item to the end, if item is replaced.
 * @param {undefined|Function} [sortFunction] -
 *   Sort function to sort the collection list.
 * @param {undefined|Function} [emptyObjectMaker] -
 *   Function that returns an empty Unique-Object or an instance of a child
 *   class.
 */

/**
 * @classdesc Collection-class for Unique-Objects or objects of child classes.
 * 
 * @implements {@@iterator}
 * @fires meteoJS/base/collection#add:item
 * @fires meteoJS/base/collection#remove:item
 * @fires meteoJS/base/collection#replace:item
 */
export class Collection {
  
  /**
   * @param {meteoJS/base/collection~options} options - Options.
   */
  constructor({ fireReplace=true,
    fireAddRemoveOnReplace=false,
    appendOnReplace=true,
    sortFunction,
    emptyObjectMaker } = {}) {
    /** @type Object */
    this.options = {
      fireReplace,
      fireAddRemoveOnReplace,
      appendOnReplace,
      sortFunction,
      emptyObjectMaker
    };
    
    /**
     * List of the IDs of the items.
     * @type mixed[]
     * @private
     */
    this._itemIds = [];
    
    /**
     * Items, ID as key of the object.
     * @type Object.<mixed,module:meteoJS/base/unique.Unique>
     * @private
     */
    this._items = {};
  }
  
  /**
   * Count of the items in this collection.
   * @type integer
   */
  get count() {
    return this._itemIds.length;
  }
  
  [Symbol.iterator]() {
    let i = 0;
    return {
      next: () => {
        return (i < this._itemIds.length)
          ? { value: this._items[this._itemIds[i++]] }
          : { done: true };
      }
    };
  }
  
  /**
   * Items (ordered list).
   * @type module:meteoJS/base/unique.Unique[]
   */
  get items() {
    return this._itemIds.map(id => this._items[id]);
  }
  
  /**
   * List of IDs (ordered list).
   * @type mixed[]
   */
  get itemIds() {
    return this._itemIds;
  }
  
  /**
   * Sort function for the items.
   * @type undefined|Function
   */
  get sortFunction() {
    return this.options.sortFunction;
  }
  set sortFunction(sortFunction) {
    this.options.sortFunction = sortFunction;
    this._sort();
  }
  
  /**
   * Returns item by ID, Unique-Object with undefined id, if ID doesn't exist.
   * 
   * @param {mixed} id ID.
   * @returns {module:meteoJS/base/unique.Unique} Item.
   */
  getItemById(id) {
    return (id in this._items) ? this._items[id] :
      (this.options.emptyObjectMaker === undefined)
        ? new Unique()
        : this.options.emptyObjectMaker.call(this);
  }
  
  /**
   * Is item appended to the collection.
   * 
   * @param {module:meteoJS/base/unique.Unique} item - Item.
   * @returns {boolean} If appended.
   */
  contains(item) {
    let result = this.containsId(item.id);
    if (result)
      result = item === this.getItemById(item.id);
    return result;
  }
  
  /**
   * Exists an ID in this collection.
   * 
   * @param {mixed} id - ID.
   * @returns {boolean} If exists.
   */
  containsId(id) {
    return (id in this._items);
  }
  
  /**
   * Append an item to the collection.
   * 
   * @param {...module:meteoJS/base/unique.Unique} items - New items.
   * @returns {module:meteoJS/base/collection.Collection} This.
   * @fires meteoJS/base/collection#add:item
   * @fires meteoJS/base/collection#remove:item
   * @fires meteoJS/base/collection#replace:item
   */
  append(...items) {
    items.forEach(item => {
      let id = item.id;
      if (this.containsId(id)) {
        let itemInCollection = this.getItemById(id);
        if (itemInCollection !== item) {
          if (this.options.fireReplace)
            this.trigger('replace:item', item, itemInCollection);
          if (this.options.fireAddRemoveOnReplace) {
            this.trigger('remove:item', itemInCollection);
            this.trigger('add:item', item);
          }
          this._items[id] = item;
        }
        if (this.options.appendOnReplace) {
          this._itemIds.splice(this._itemIds.indexOf(id), 1);
          this._itemIds.push(id);
        }
      }
      else {
        this._itemIds.push(id);
        this._items[id] = item;
        this.trigger('add:item', item);
      }
    });
    this._sort();
    return this;
  }
  
  /**
   * Removes an item from the collection.
   * 
   * @param {...module:meteoJS/base/unique.Unique} items - Items to remove.
   * @returns {module:meteoJS/base/collection.Collection} This.
   * @fires meteoJS/base/collection#remove:item
   */
  remove(...items) {
    items.forEach(item => {
      let i = this._itemIds.indexOf(item.id);
      if (i > -1) {
        let realItem = this._items[item.id];
        delete this._items[item.id];
        this._itemIds.splice(i, 1);
        this.trigger('remove:item', realItem);
      }
    });
    return this;
  }
  
  /**
   * Removes an item by ID from the collection.
   * 
   * @param {mixed} id - ID of the item to delete.
   * @returns {module:meteoJS/base/collection.Collection} This.
   * @fires meteoJS/base/collection#remove:item
   */
  removeById(...ids) {
    ids.forEach(id => {
      let i = this._itemIds.indexOf(id);
      if (i > -1) {
        let item = this._items[id];
        delete this._items[id];
        this._itemIds.splice(i, 1);
        this.trigger('remove:item', item);
      }
    });
    return this;
  }
  
  /**
   * Sorts Collection-List.
   * 
   * @private
   */
  _sort(compareFunction) {
    if (this.options.sortFunction === undefined)
      return;
    this._itemIds.sort((a,b) => {
      return this.options.sortFunction(this._items[a], this._items[b]);
    });
  }
}
addEventFunctions(Collection.prototype);
export default Collection;