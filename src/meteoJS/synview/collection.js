/**
 * @module meteoJS/synview/collection
 */

/**
 * Triggered on adding item to collection.
 * 
 * @event meteoJS.synview.collection#add:item
 * @type {object} Added item.
 */

/**
 * Triggered on replacing item with already existing ID.
 * 
 * @event meteoJS.synview.collection#replace:item
 * @type {object} Added item.
 * @type {object} Replaced and removed item.
 */

/**
 * Triggered on removing item from collection.
 * 
 * @event meteoJS.synview.collection#remove:item
 * @type {object} Removed item.
 */

/**
 * Collection of items.
 * Items have at least a getId() method, which returns a unique ID.
 * 
 * @constructor
 */
meteoJS.synview.collection = function () {
  /**
   * List of IDs of the items.
   * @member {mixed}
   */
  this.itemIds = [];
  
  /**
   * List of items, ID as key of the object.
   * @member {Object}
   */
  this.items = {};
};
meteoJS.events.addEventFunctions(meteoJS.synview.collection.prototype);

/**
 * Returns count of items in this collection.
 * 
 * @return {integer} Count.
 */
meteoJS.synview.collection.prototype.getCount = function () {
  return this.itemIds.length;
};

/**
 * Returns items (in order as appended).
 * 
 * @return {Object[]} Items.
 */
meteoJS.synview.collection.prototype.getItems = function () {
  return this.itemIds.map(function (id) { return this.items[id]; }, this);
};

/**
 * Returns a list of IDs (in order as appended).
 * 
 * @return {mixed[]} List of IDs.
 */
meteoJS.synview.collection.prototype.getItemIds = function () {
  return this.itemIds;
};

/**
 * Returns item by ID, undefined if ID doesn't exist.
 * 
 * @param {mixed} id ID.
 * @return {Object|undefined} Item.
 */
meteoJS.synview.collection.prototype.getItemById = function (id) {
  return (id in this.items) ? this.items[id] : undefined;
};

/**
 * Returns if an ID exists in this collection.
 * 
 * @param {mixed} id ID.
 * @return {boolean} If exists.
 */
meteoJS.synview.collection.prototype.containsId = function (id) {
  return this.getIndexById(id) !== -1;
};

/**
 * Returns index of the item in this collecition, -1 if not existant.
 * 
 * @param {mixed} id ID.
 * @return {integer} Index.
 */
meteoJS.synview.collection.prototype.getIndexById = function (id) {
  var result = -1;
  this.itemIds.forEach(function (itemId, i) {
    if (itemId == id)
      result = i;
  });
  return result;
};

/**
 * Append an item to the collection.
 * 
 * @param {object} item New item.
 * @return {meteoJS.synview.collection} This.
 * @fires meteoJS.synview.collection#add:item
 * @fires meteoJS.synview.collection#replace:item
 */
meteoJS.synview.collection.prototype.append = function (item) {
  var id = item.getId();
  if (this.containsId(id)) {
    this.trigger('replace:item', item, this.getItemById(id));
    this.items[id] = item;
  }
  else {
    this.itemIds.push(id);
    this.items[id] = item;
    this.trigger('add:item', item);
  }
  return this;
};

/**
 * Removes an item from the collection.
 * 
 * @param {mixed} id ID of the item to delete.
 * @return {meteoJS.synview.collection} This.
 * @fires meteoJS.synview.collection#remove:item
 */
meteoJS.synview.collection.prototype.remove = function (id) {
  var item = this.getItemById(id);
  if (item !== undefined) {
    var index = this.getIndexById(id);
    delete this.items[id];
    this.itemIds.splice(index, 1);
    this.trigger('remove:item', item);
  }
  return this;
};