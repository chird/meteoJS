/**
 * @module meteoJS/synview/resourceCollection
 */

import Collection from './Collection.js';
import Resource from './Resource.js';

/**
 * Collection of resource objects.
 * Extends meteoJS.synview.collection with storage of time objects.
 * This collection contains either a list of resources assigned with time or
 * one resource with no time (or both). With the methods from
 * meteoJS.synview.collection all resources (with or without time) will be
 * retrieved. Id of the resource without time is '' (empty string).
 * 
 * @constructor
 * @augments meteoJS.synview.collection
 */
export default class ResourceCollection extends Collection {

constructor() {
  super(this);
  
  /**
   * List of the datetime objects of the resources (sorted upwardly).
   * @member {Date[]}
   */
  this.times = [];
}

/**
 * Returns all resources assigned with time (ordered temporal upwardly).
 * 
 * @return {meteoJS.synview.resource[]} Resources.
 */
getResources() {
  return this.times.map(function (time) {
    return this.items[time.valueOf()];
  }, this);
}

/**
 * Returns times (ordered temporal upwardly).
 * 
 * @return {Date[]} Times (no invalid times).
 */
getTimes() {
  return this.times;
}

/**
 * @augments meteoJS.synview.collection.getItemById
 * @param {mixed} id ID.
 * @return {meteoJS.synview.resource} Resource.
 */
getItemById(id) {
  var res = meteoJS.synview.collection.prototype.getItemById.call(this, id);
  return (res === undefined) ? new Resource() : res;
}

/**
 * Returns resource valid at passed datetime (could be an invalid datetime).
 * If resource doesn't exist, an empty object is returned.
 * 
 * @param {Date} time Datetime.
 * @return {meteoJS.synview.resource} Resource.
 */
getResourceByTime(time) {
  return this.getItemById(isNaN(time) ? '' : time.valueOf());
}

/**
 * Returns if a resource with passed time exists. Time could be invalid.
 * 
 * @param {Date} Time.
 * @return {boolean} If exists.
 */
containsTime(time) {
  return this.getIndexById(isNaN(time) ? '' : time.valueOf()) > -1;
}

/**
 * Returns index of the time inside the times array. Time could be invalid.
 * -1 if not existant.
 * 
 * @param {Date} time Time.
 * @return {integer} Index.
 */
getIndexByTime(time) {
  var result = -1;
  if (!isNaN(time))
    this.times.forEach(function (t, i) {
      if (t.valueOf() == time.valueOf())
        result = i;
    });
  return result;
}

/**
 * Returns if a resource with ID exists in this collection.
 * 
 * @return {meteoJS.synview.resource}
 */
getNewestResource() {
  if (this.times.length < 1)
    return new Resource();
  return this.getResourceByTime(this.times[this.times.length-1]);
}

/**
 * Append a resource to the collection.
 * 
 * @augments meteoJS.synview.collection.append
 * @param {meteoJS.synview.resource} resource Resource.
 * @return {meteoJS.synview.resourceCollection} This.
 */
append(resource) {
  this._append(resource);
  this._sortTimes();
  return this;
}

/**
 * Removes a resource from the collection.
 * 
 * @augments meteoJS.synview.collection.remove
 * @param {Date} time Resource's time.
 * @return {meteoJS.synview.resourceCollection} This.
 */
remove(time) {
  this._remove(isNaN(time) ? '' : time.valueOf());
  this._sortTimes();
  return this;
}

/**
 * Exchanges the collection content with a list of resource.
 * 
 * @param {meteoJS.synview.resource[]} resources Resources.
 * @fires meteoJS.synview.collection#add:item
 * @fires meteoJS.synview.collection#replace:item
 * @fires meteoJS.synview.collection#remove:item
 * @return {meteoJS.synview.resourceCollection} This.
 */
setResources(resources) {
  resources.forEach(function (resource, i) {
    this._append(resource);
  }, this);
  this._filterTimesByResources(resources);
  this._sortTimes();
  return this;
}

/**
 * Append a resource to the collection without reordering times-array.
 * 
 * @private
 * @param {meteoJS.synview.resource} resource Resource.
 */
_append(resource) {
  var time = resource.getDatetime();
  var id = (time === undefined) ? '' : time.valueOf();
  if (this.containsId(id)) {
    this.trigger('replace:item', resource, this.getItemById(id));
    this.items[id] = resource;
  }
  else {
    this.itemIds.push(id);
    this.items[id] = resource;
    if (time !== undefined && !isNaN(time))
      this.times.push(time);
    this.trigger('add:item', resource);
  }
}

/**
 * Removes a resource fromt the collection without reordering times-array.
 * 
 * @private
 * @param {mixed} id Resource ID.
 */
_remove(id) {
  var index = this.getIndexById(id);
  if (index > -1) {
    var resource = this.items[id];
    delete this.items[id];
    this.itemIds.splice(index, 1);
    if (id !== undefined && id !== '' && !isNaN(id)) {
      var tIndex = this.times.findIndex(function (t) {
        return t.valueOf() == id;
      });
      if (tIndex > -1)
        this.times.splice(tIndex, 1);
    }
    this.trigger('remove:item', resource);
  }
}

/**
 * Removes all resources whose times doesn't exist in the collection.
 * 
 * @private
 * @param {meteoJS.synview.resource[]}
 */
_filterTimesByResources(resources) {
  var containsStaticResource = false;
  this.times = this.times.filter(function (t) {
    var filter = false;
    var i = resources.findIndex(function (resource, i) {
      var match = false;
      var time = resource.getDatetime();
      if (time !== undefined &&
          t.valueOf() == time.valueOf()) {
        match = true;
      }
      else if (time === undefined)
        containsStaticResource = true;
      return match;
    }, this);
    if (i < 0) {
      this.remove(t.valueOf());
      filter = true;
    }
    return !filter;
  }, this);
  if (containsStaticResource)
    this.remove('');
}

/**
 * Sortiert den Zeit-Array this.times der Reihe nach.
 * @private
 */
_sortTimes() {
  this.times.sort(function (a, b) {
    return a.valueOf()-b.valueOf();
  });
}

}