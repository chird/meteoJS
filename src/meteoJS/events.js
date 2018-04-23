/**
 * @module meteoJS/events
 */

/**
 * This Namespace contains simple "ready to use" event methods for objects.
 * 
 * @namespace
 */
meteoJS.events = meteoJS.events ? meteoJS.events : {};

/**
 * Listen for a certain type of event
 * 
 * @abstract
 * @param {string} listener Event type.
 * @param {callback} callback Listener function.
 * @param {mixed} [thisArg] Objekt für this beim Ausführen von callback.
 * @returns {number} Listener function key.
 */
meteoJS.events.on = function (listener, callback, thisArg) {
  if (!('listeners' in this) ||
      this.listeners === undefined)
    this.listeners = {};
  if (!(listener in this.listeners))
    this.listeners[listener] = {};
  var result_key = callback.valueOf();
  this.listeners[listener][result_key] = {
    callback: callback,
    thisArg:  thisArg
  };
  return result_key;
};

/**
 * Unlisten for a certain type of event
 * 
 * @abstract
 * @param {string} listener Event type.
 * @param {number} key Listener function key.
 */
meteoJS.events.un = function (listener, key) {
  if ('listeners' in this &&
      this.listeners !== undefined &&
      listener in this.listeners &&
      key in this.listeners[listener])
    delete this.listeners[listener][key];
};

/**
 * Listen once for a certain type of event
 * 
 * @abstract
 * @param {string} listener Event type.
 * @param {callback} callback Listener function.
 * @param {mixed} [thisArg] Objekt für this beim Ausführen von callback.
 */
meteoJS.events.once = function (listener, callback, thisArg) {
  if (!('once_listeners' in this) ||
      this.once_listeners === undefined)
    this.once_listeners = {};
  if (!(listener in this.once_listeners) ||
      !('push' in this.once_listeners[listener]))
    this.once_listeners[listener] = [];
  this.once_listeners[listener].push({
    callback: callback,
    thisArg:  thisArg
  });
};

/**
 * Gibt es Listener Funktionen für einen Event Type
 * 
 * @abstract
 * @param {string} listener Event type.
 * @returns {boolean}
 */
meteoJS.events.hasListener = function (listener) {
  return ('listeners' in this &&
          this.listeners !== undefined &&
          listener in this.listeners &&
          Object.keys(this.listeners[listener]).length) ||
         ('once_listeners' in this &&
          listener in this.once_listeners &&
          Object.keys(this.once_listeners[listener]).length);
};

/**
 * Execute all listener functions für einen Event Type
 * 
 * @abstract
 * @param {string} listener Event type.
 */
meteoJS.events.trigger = function (listener) {
  var that = this;
  var args = Array.prototype.slice.call(arguments);
  args.shift();
  if ('listeners' in this &&
      this.listeners !== undefined &&
      listener in this.listeners &&
      typeof this.listeners[listener] == 'object') {
    var that = this;
    Object.keys(this.listeners[listener]).forEach(function (key) {
      that.listeners[listener][key].callback.apply(
        that.listeners[listener][key].thisArg === undefined ?
          that :
          that.listeners[listener][key].thisArg,
        args);
    });
  }
  if ('once_listeners' in this &&
      this.once_listeners !== undefined &&
      listener in this.once_listeners &&
      'forEach' in this.once_listeners[listener]) {
    var once_listeners = this.once_listeners[listener];
    this.once_listeners[listener] = [];
    once_listeners.forEach(function (obj) {
      obj.callback.apply(obj.thisArg === undefined ? that : obj.thisArg, args);
    });
  }
};

/**
 * Fügt einem Objekt alle Event-Funktionen hinzu.
 * 
 * @param {object} obj
 */
meteoJS.events.addEventFunctions = function (obj) {
  obj.on = meteoJS.events.on;
  obj.un = meteoJS.events.un;
  obj.once = meteoJS.events.once;
  obj.hasListener = meteoJS.events.hasListener;
  obj.trigger = meteoJS.events.trigger;
};