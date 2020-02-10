/**
 * @module meteoJS/events
 */

/**
 * Listen for a certain type of event
 * 
 * @abstract
 * @param {string} listener Event type.
 * @param {callback} callback Listener function.
 * @param {mixed} [thisArg] Objekt für this beim Ausführen von callback.
 * @returns {number} Listener function key.
 */
function on(listener, callback, thisArg) {
  if (!('listeners' in this) ||
      this.listeners === undefined)
    this.listeners = {};
  if (!(listener in this.listeners))
    this.listeners[listener] = {};
  // Adapted from https://gist.github.com/gordonbrander/2230317
  var result_key = Math.random().toString(36).substr(2, 9);
  this.listeners[listener][result_key] = {
    callback: callback,
    thisArg:  thisArg
  };
  return result_key;
}

/**
 * Unlisten for a certain type of event
 * 
 * @abstract
 * @param {string} listener Event type.
 * @param {number} key Listener function key.
 */
function un(listener, key) {
  if ('listeners' in this &&
      this.listeners !== undefined &&
      listener in this.listeners &&
      key in this.listeners[listener])
    delete this.listeners[listener][key];
}

/**
 * Listen once for a certain type of event
 * 
 * @abstract
 * @param {string} listener Event type.
 * @param {callback} callback Listener function.
 * @param {mixed} [thisArg] Objekt für this beim Ausführen von callback.
 */
function once(listener, callback, thisArg) {
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
}

/**
 * Gibt es Listener Funktionen für einen Event Type
 * 
 * @abstract
 * @param {string} listener Event type.
 * @returns {boolean}
 */
function hasListener(listener) {
  return ('listeners' in this &&
          this.listeners !== undefined &&
          listener in this.listeners &&
          Object.keys(this.listeners[listener]).length) ||
         ('once_listeners' in this &&
          listener in this.once_listeners &&
          Object.keys(this.once_listeners[listener]).length);
}

/**
 * Execute all listener functions für einen Event Type
 * 
 * @abstract
 * @param {string} listener Event type.
 */
function trigger(listener) {
  let args = Array.prototype.slice.call(arguments);
  args.shift();
  if ('listeners' in this &&
      this.listeners !== undefined &&
      listener in this.listeners &&
      typeof this.listeners[listener] == 'object') {
    Object.keys(this.listeners[listener]).forEach(key => {
      this.listeners[listener][key].callback.apply(
        this.listeners[listener][key].thisArg === undefined ?
          this :
          this.listeners[listener][key].thisArg,
        args);
    });
  }
  if ('once_listeners' in this &&
      this.once_listeners !== undefined &&
      listener in this.once_listeners &&
      'forEach' in this.once_listeners[listener]) {
    let once_listeners = this.once_listeners[listener];
    this.once_listeners[listener] = [];
    once_listeners.forEach(obj => {
      obj.callback.apply(obj.thisArg === undefined ? this : obj.thisArg, args);
    });
  }
}

/**
 * Fügt einem Objekt alle Event-Funktionen hinzu.
 * 
 * @param {object} obj
 */
export default function addEventFunctions(obj) {
  obj.on = on;
  obj.un = un;
  obj.once = once;
  obj.hasListener = hasListener;
  obj.trigger = trigger;
}