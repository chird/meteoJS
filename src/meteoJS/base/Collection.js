/**
 * @module meteoJS/base/collection
 */
import addEventFunctions from '../Events.js';

/**
 * Triggered on adding item to collection.
 * 
 * @event meteoJS/base/collection#add:item
 * @param {object} Added item.
 */

/**
 * Triggered on replacing item with already existing ID.
 * 
 * @event meteoJS/base/collection#replace:item
 * @param {object} Added item.
 * @param {object} Replaced and removed item.
 */

/**
 * Triggered on removing item from collection.
 * 
 * @event meteoJS/base/collection#remove:item
 * @param {object} Removed item.
 */

/**
 * Constructor options.
 * 
 * @type Object
 * @param {boolean} [fireOnReplace]
 * @param {boolean} [fireAddRemoveOnReplace]
 * @param {undefined|Function} [sortFunction]
 */

/**
 * @classdesc Class for the collection of items. The items have at least a
 *   id property, which returns an unique ID.
 */
export class Collection {
  
  /**
   * @param {meteoJS/base/collection~options} options - Options.
   */
  constructor(options) {
    this.options = extend(true, {
      fireOnReplace: true,
      fireAddRemoveOnReplace: false,
      sortFunction: undefined
    }, options);
    
    /**
     * List of IDs of the items.
     * @type mixed
     * @private
     */
    this.itemIds = [];
    
    /**
     * List of items, ID as key of the object.
     * @type Object
     * @private
     */
    this.items = {};
  }
  
  /**
   * Count of items in this collection.
   * @type integer
   */
  get count() {
    return this.itemIds.length;
  }
  
  /**
   * Items (in order as appended).
   * @type Object[]
   */
  get items() {
    return this.itemIds.map(id => return this.items[id]);
  }
  
  /**
   * List of IDs (in order as appended).
   * @type mixed[]
   */
  get itemIds() {
    return this.itemIds;
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
   * Returns item by ID, undefined if ID doesn't exist.
   * 
   * @param {mixed} id ID.
   * @returns {Object|undefined} Item.
   */ xxx -> Item-Object
  getItemById(id) {
    return (id in this.items) ? this.items[id] : undefined;
  }
  
  /**
   * Returns if an ID exists in this collection.
   * 
   * @param {mixed} id - ID.
   * @returns {boolean} If exists.
   */
  containsId(id) {
    return this.getIndexById(id) !== -1;
  }
  
  /**
   * Returns index of the item in this collecition, -1 if not existant.
   * 
   * @param {mixed} id - ID.
   * @returns {integer} Index.
   */
  getIndexById(id) {
    var result = -1;
    this.itemIds.forEach((itemId, i) => {
      if (itemId == id)
        result = i;
    });
    return result;
  }
  
  /**
   * Append an item to the collection.
   * 
   * @param {object} item - New item.
   * @returns {module:meteoJS/base/collection.Collection} This.
   * @fires meteoJS/base/collection#add:item
   * @fires meteoJS/base/collection#replace:item
   */
  append(item) {
    let id = item.id;
    if (this.containsId(id)) {
      if (this.options.fireOnReplace)
        this.trigger('replace:item', item, this.getItemById(id));
      if (this.options.fireAddRemoveOnReplace) {
        this.trigger('remove:item', this.getItemById(id));
        this.trigger('add:item', item);
      }
      this.items[id] = item;
    }
    else {
      this.itemIds.push(id);
      this.items[id] = item;
      this.trigger('add:item', item);
    }
    this._sort();
    return this;
  }
  
  /**
   * Removes an item from the collection.
   * 
   * @param {mixed} id - ID of the item to delete.
   * @returns {module:meteoJS/base/collection.Collection} This.
   * @fires meteoJS/base/collection#remove:item
   */
  remove(id) {
    var item = this.getItemById(id);
    if (item !== undefined) {
      var index = this.getIndexById(id);
      delete this.items[id];
      this.itemIds.splice(index, 1);
      this.trigger('remove:item', item);
    }
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
    this.itemIds.sort((a,b) => {
      return this.options.sortFunction(this.items[a], this.items[b]);
    });
  }
}
addEventFunctions(Collection.prototype);
export default Collection;