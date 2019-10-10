/**
 * @module meteoJS/timeline
 */
import addEventFunctions from './Events.js';

/**
 * Options for timeline constructor.
 * 
 * @typedef {Object} module:meteoJS/timeline~options
 * @param {number|undefined} [maxTimeGap]
 *   Maximum of time period (in seconds) between two timestamps. If this option
 *   is specified, than e.g. the method getTimes() could return more timestamps
 *   than defined by setTimesBySetID.
 */

/**
 * @event module:meteoJS/timeline#change:time
 * @type {Date} Time before change.
 */

/**
 * @event module:meteoJS/timeline#change:times
 */

/**
 * @event module:meteoJS/timeline#change:enabledTimes
 */

/**
 * @classdesc
 * Class represents a timeline.
 * On this timeline, you could define different set of times. This is useful for
 * the usecase 1: You have different data types for different times (like radar
 * and satellite pictures). Then, the timeline provides a list of all available
 * times. Each time in each set of times could be enabled or disabled. This
 * yields to the usecase 2: In a viewer of model charts, you probably want to
 * show all the times with charts. (Global models normally have a time interval
 * of 3 hours between charts) But for different parameters, you only provide
 * charts at a greater interval. E.g. you calculate 24h-precipiation sums only
 * for 00 UTC. So you can set the times of the 3-hour-interval and only set
 * the 00 UTC timestamps as enabled.
 * 
 * @see {@link module:meteoJS/timeline/visualisation.Visualisation} to visualise the timeline.
 * @see {@link module:meteoJS/timeline/animation.Animation} to animate.
 */
export class Timeline {
  
  /**
   * @param {module:meteoJS/timeline~options} [options] - Options.
   */
  constructor({ maxTimeGap = undefined,
                keyboardNavigation = {
                  enabled = true,
                  first = 36,
                  last = 35,
                  prev = 37,
                  next = 39,
                  prevAllEnabled = [37, 'ctrl'],
                  nextAllEnabled = [38, 'ctrl']
                } } = {}) {
    /**
     * @type undefined|number
     * @private
     */
    this.maxTimeGap = maxTimeGap;
  
    /**
     * Date object with current selected time. Maybe invalid.
     * @member {Date}
     * @private
     */
    this.selectedTime = new Date('invalid');
  
    /**
     * Times of this timeline. Sorted upwardly.
     * @member {Date[]}
     * @private
     */
    this.times = [];
  
    /**
     * Times of this timeline, that are enabled at least in one set of times.
     * Sorted upwardly.
     * @member {Date[]}
     * @private
     */
    this.enabledTimes = [];
  
    /**
     * Times of this timeline, that are enabled through all set of times.
     * Sorted upwardly.
     * @member {Date[]}
     * @private
     */
    this.allEnabledTimes = [];
  
    /**
     * Objekt mit keys und moment-Arrays (zeitlich sortiert)
     * @member {{}{}}
     * @private
     */
    this.timesByKey = {};
    
    /**
     * @type {module:meteoJS/timeline~keyboardNavigationOptions}
     * @private
     */
    this._keyboardNavigation = keyboardNavigation;
    if (document && this._keyboardNavigation.enabled)
      document.addEventListener('keydown', event => {
        Object.keys(this._keyboardNavigation).forEach(method => {
          if (method == 'enabled')
            return;
          if (method in this &&
              _isKeyDown(event, this._keyboardNavigation[method]))
            this[method]();
        });
      });
  }
  
  /**
   * Current selected time.
   * 
   * @returns {Date} Selected time, could be invalid.
   */
  getSelectedTime() {
    return this.selectedTime;
  }
  
  /**
   * Sets current selected time. You can select a time returned by getTimes only.
   * If this is not the case, an invalid timestamp will be set.
   * 
   * @param {Date} time Time to select.
   * @returns {module:meteoJS/timeline.Timeline} Returns this.
   * @fires module:meteoJS/timeline#change:time
   */
  setSelectedTime(time) {
    this._setSelectedTime(
      (_indexOfTimeInTimesArray(time, this.times) > -1) ?
        time : new Date('invalid'));
    return this;
  }
  
  /**
   * Returns a list of all timestamps represented by this timeline.
   * This includes on the one hand all timestamps defined by setTimesBySetID, on
   * the other hand there could exists additional timestamps (e.g. through the
   * maxTimeGap option).
   * 
   * @returns {Date[]} All defined times, sorted upwardly.
   */
  getTimes() {
    return this.times;
  }
  
  /**
   * Returns a list of all enabled timestamps of this timeline.
   * 
   * @returns {Date[]} All enabled times, sorted upwardly.
   */
  getEnabledTimes() {
    return this.enabledTimes;
  }
  
  /**
   * Returns a list of times. These times are enabled throug every set of times.
   * 
   * @returns {Date[]} Enabled times, sorted upwardly.
   */
  getAllEnabledTimes() {
    return this.allEnabledTimes;
  }
  
  /**
   * Defines a set of times. Set is identified by an ID.
   * If the set was already defined, the set of times will be overwritten.
   * 
   * @param {mixed} id ID of the set of times.
   * @param {Date[]} times Times (must be sorted upwardly).
   * @returns {module:meteoJS/timeline.Timeline} Returns this.
   * @fires module:meteoJS/timeline#change:times
   * @fires module:meteoJS/timeline#change:enabledTimes
   */
  setTimesBySetID(id, times) {
    this.timesByKey[id] = {
      times: times,
      enabled: times
    };
    this._updateTimes();
    this._updateEnabledTimes();
    return this;
  }
  
  /**
   * Defines the enbaled times of a set of times. The passed times must be
   * contained in the times of the set (defined earlier by setTimesBySetID).
   * 
   * @param {mixed} id ID of the set of times.
   * @param {Date[]} times Times to set enabled (must be sorted upwardly).
   * @returns {module:meteoJS/timeline.Timeline} Returns this.
   * @fires module:meteoJS/timeline#change:enabledTimes
   */
  setEnabledTimesBySetID(id, times) {
    if (id in this.timesByKey) {
      this.timesByKey[id].enabled = times;
      this._updateEnabledTimes();
    }
    return this;
  }
  
  /**
   * Returns IDs of all defined sets.
   * 
   * @return {mixed[]} IDs.
   */
  getSetIDs() {
    return Object.keys(this.timesByKey);
  }
  
  /**
   * Deletes a set of times.
   * 
   * @param {mixed} id ID of the set of times.
   * @returns {module:meteoJS/timeline.Timeline} Returns this.
   * @fires module:meteoJS/timeline#change:times
   * @fires module:meteoJS/timeline#change:enabledTimes
   */
  deleteSetID(id) {
    if (id in this.timesByKey) {
      delete this.timesByKey[id];
      this._updateTimes();
      this._updateEnabledTimes();
    }
    return this;
  }
  
  /**
   * Set selected time to the first time, which is enabled.
   * 
   * @returns {module:meteoJS/timeline.Timeline} Returns this.
   */
  first() {
    this._setSelectedTime(this.getFirstEnabledTime());
    return this;
  }
  
  /**
   * Set selected time to the last time, which is enabled.
   * 
   * @returns {module:meteoJS/timeline.Timeline} Returns this.
   */
  last() {
    this._setSelectedTime(this.getLastEnabledTime());
    return this;
  }
  
  /**
   * Changes selected time to the next enabled time.
   * 
   * @returns {module:meteoJS/timeline.Timeline} Returns this.
   */
  next() {
    this._setSelectedTime(this.getNextEnabledTime());
    return this;
  }
  
  /**
   * Changes selected time to the previous enabled time.
   * 
   * @returns {module:meteoJS/timeline.Timeline} Returns this.
   */
  prev() {
    this._setSelectedTime(this.getPrevEnabledTime());
    return this;
  }
  
  /**
   * Changes selected time to the next time, which is enabled by all sets.
   * 
   * @returns {module:meteoJS/timeline.Timeline} Returns this.
   */
  nextAllEnabledTime() {
    this._setSelectedTime(this.getNextAllEnabledTime());
    return this;
  }
  
  /**
   * Changes selected time to the previous time, which is enabled by all sets.
   * 
   * @returns {module:meteoJS/timeline.Timeline} Returns this.
   */
  prevAllEnabledTime() {
    this._setSelectedTime(this.getPrevAllEnabledTime());
    return this;
  }
  
  /**
   * Change the selected time throug the add() method of moment.js. If the "new"
   * timestamp is not available, the selected time is not changed.
   * 
   * @param {number} amount Analog zu moment.add()
   * @param {string} timeKey Analog zu moment.add()
   * @returns {module:meteoJS/timeline.Timeline} Returns this.
   * @requires moment.js
   */
  add(amount, timeKey) {
    // Check if moment.js available
    if (typeof moment !== 'function')
      throw new Error('add() needs moment.js');
    var t = moment(this.getSelectedTime()).add(amount, timeKey);
    if (_indexOfTimeInTimesArray(t.toDate(), this.times) > -1)
      this._setSelectedTime(t.toDate());
    return this;
  }
  
  /**
   * Change the selected time throug the sub() method of moment.js. If the "new"
   * timestamp is not available, the selected time is not changed.
   * 
   * @param {number} amount Analog zu moment.add()
   * @param {string} timeKey Analog zu moment.add()
   * @returns {module:meteoJS/timeline.Timeline} Returns this.
   */
  sub(amount, timeKey) {
    // Check if moment.js available
    if (typeof moment !== 'function')
      throw new Error('sub() needs moment.js');
    var t = moment(this.getSelectedTime()).subtract(amount, timeKey);
    if (_indexOfTimeInTimesArray(t.toDate(), this.times) > -1)
      this._setSelectedTime(t.toDate());
    return this;
  }
  
  /**
   * Returns first time in this timeline, which is enabled by at least one set.
   * 
   * @returns {Date} First enabled time, could be invalid.
   */
  getFirstEnabledTime() {
    return (this.enabledTimes.length > 0) ?
      this.enabledTimes[0] : new Date('invalid');
  }
  
  /**
   * Returns last time in this timeline, which is enabled by at least one set.
   * 
   * @returns {Date} Last enabled time, could be invalid.
   */
  getLastEnabledTime() {
    return (this.enabledTimes.length > 0) ?
      this.enabledTimes[this.enabledTimes.length-1] : new Date('invalid');
  }
  
  /**
   * Returns next time after the selected time, which is enabled by at least
   * one set. If selected time is invalid, the first enabled time is returned.
   * 
   * @returns {Date} Next enabled time.
   */
  getNextEnabledTime() {
    if (this.enabledTimes.length < 1)
      return new Date('invalid');
    var index = _indexOfTimeInTimesArray(this.getSelectedTime(), this.enabledTimes);
    if (index > -1) {
      index++;
      return (index < this.enabledTimes.length) ?
        this.enabledTimes[index] :
        this.enabledTimes[this.enabledTimes.length-1];
    }
    else if (isNaN(this.getSelectedTime()))
      return this.enabledTimes[0];
    else {
      // Es war kein Zeitpunkt aus enabledTimes
      var result = new Date('invalid');
      for (var i=0; i<this.enabledTimes.length; i++)
        if (this.getSelectedTime().valueOf() < this.enabledTimes[i].valueOf()) {
          result = this.enabledTimes[i];
          break;
        }
      return result;
    }
  }
  
  /**
   * Returns previous time before the selected time, which is enabled by at least
   * one set. If selected time is invalid, the last enabled time is returned.
   * 
   * @returns {Date} Previous enabled time.
   */
  getPrevEnabledTime() {
    if (this.enabledTimes.length < 1)
      return new Date('invalid');
    var index = _indexOfTimeInTimesArray(this.getSelectedTime(), this.enabledTimes);
    if (index > -1) {
      index--;
      return (-1 < index) ? this.enabledTimes[index] : this.enabledTimes[0];
    }
    else if (isNaN(this.getSelectedTime()))
      return this.enabledTimes[0];
    else {
      // Es war kein Zeitpunkt aus enabledTimes
      var result = new Date('invalid');
      for (var i=this.enabledTimes.length-1; i>=0; i--)
        if (this.getSelectedTime().valueOf() > this.enabledTimes[i].valueOf()) {
          result = this.enabledTimes[i];
          break;
        }
      return result;
    }
  }
  
  /**
   * Returns first time in this timeline, which is enabled by at all sets.
   * 
   * @returns {Date} First time, which is enabled by all sets.
   */
  getFirstAllEnabledTime() {
    return (this.allEnabledTimes.length > 0) ?
      this.allEnabledTimes[0] : new Date('invalid');
  }
  
  /**
   * Returns last time in this timeline, which is enabled by at all sets.
   * 
   * @returns {Date} Last time, which is enabled by all sets.
   */
  getLastAllEnabledTime() {
    return (this.allEnabledTimes.length > 0) ?
      this.allEnabledTimes[this.allEnabledTimes.length-1] : new Date('invalid');
  }
  
  /**
   * Returns next time after the selected time, which is enabled by
   * all sets. If selected time is invalid, the last all enabled time is returned.
   * 
   * @returns {Date} Next time, which is enabled by all sets.
   */
  getNextAllEnabledTime() {
    if (this.allEnabledTimes.length < 1)
      return new Date('invalid');
    var index = _indexOfTimeInTimesArray(this.getSelectedTime(), this.allEnabledTimes);
    if (index > -1) {
      index++;
      return (index < this.allEnabledTimes.length) ?
        this.allEnabledTimes[index] :
        this.allEnabledTimes[this.allEnabledTimes.length-1];
    }
    else if (isNaN(this.getSelectedTime()))
      return this.allEnabledTimes[0];
    else {
      // Es war kein Zeitpunkt aus allEnabledTimes
      var result = new Date('invalid');
      for (var i=0; i<this.allEnabledTimes.length; i++)
        if (this.getSelectedTime().valueOf() < this.allEnabledTimes[i].valueOf()) {
          result = this.allEnabledTimes[i];
          break;
        }
      return result;
    }
  }
  
  /**
   * Returns previous time before the selected time, which is enabled by
   * all sets. If selected time is invalid, the first all enabled time is returned.
   * 
   * @returns {Date} Previous time, which is enabled by all sets.
   */
  getPrevAllEnabledTime() {
    if (this.allEnabledTimes.length < 1)
      return new Date('invalid');
    var index = _indexOfTimeInTimesArray(this.getSelectedTime(), this.allEnabledTimes);
    if (index > -1) {
      index--;
      return (-1 < index) ? this.allEnabledTimes[index] : this.allEnabledTimes[0];
    }
    else if (isNaN(this.getSelectedTime()))
      return this.allEnabledTimes[0];
    else {
      // Es war kein Zeitpunkt aus allEnabledTimes
      var result = new Date('invalid');
      for (var i=this.allEnabledTimes.length-1; i>=0; i--)
        if (this.getSelectedTime().valueOf() > this.allEnabledTimes[i].valueOf()) {
          result = this.allEnabledTimes[i];
          break;
        }
      return result;
    }
  }
  
  /**
   * Returns if the passed time is an enabled time.
   * 
   * @returns {boolean}
   */
  isTimeEnabled(time) {
    return this.enabledTimes.reduce(function (acc, t) {
      return (t.valueOf() == time.valueOf()) ? true : acc;
    }, false);
  }
  
  /**
   * Returns if the passed time is an enabled time.
   * 
   * @returns {boolean}
   */
  isTimeAllEnabled(time) {
    return this.allEnabledTimes.reduce(function (acc, t) {
      return (t.valueOf() == time.valueOf()) ? true : acc;
    }, false);
  }
  
  /**
   * Is the selected time the first enabled time.
   * 
   * @returns {boolean}
   */
  isFirstEnabledTime() {
    return this.getFirstEnabledTime().valueOf() == this.getSelectedTime().valueOf();
  }
  
  /**
   * Is the selected time the last enabled time.
   * 
   * @returns {boolean}
   */
  isLastEnabledTime() {
    return this.getLastEnabledTime().valueOf() == this.getSelectedTime().valueOf();
  }
  
  /**
   * Internal setter of the selected time. Caller must guarantee, that either
   * the passed timestamp exists in this.times or is invalid.
   * @param {Date} selectedTime Selected time.
   * @fires module:meteoJS/timeline#change:time
   * @private
   */
  _setSelectedTime(selectedTime) {
    var oldTime = this.selectedTime;
    this.selectedTime = selectedTime;
    this.trigger('change:time', oldTime);
    return this.selectedTime;
  }
  
  /**
   * Bringt den Inhalt des Arrays this.times in
   * Übereinstimmung mit dem Inhalt von this.timesByKey
   * @private
   * @fires module:meteoJS/timeline#change:times
   */
  _updateTimes() {
    this.times = [];
    var timesArr = [];
    var times = {};
    for (var key in this.timesByKey)
      this.timesByKey[key].times.forEach(function (t) {
        if (!(t.valueOf() in times)) {
          timesArr.push(t);
          times[t.valueOf()] = t;
        }
      });
    _sortTimesArray(timesArr);
    timesArr.forEach(function (time, i) {
      if (this.times.length < 1) {
        this.times.push(time);
        return;
      }
      var lastTime = this.times[this.times.length-1];
      if (this.maxTimeGap !== undefined &&
          (time.valueOf()-lastTime.valueOf()) > 1000*this.maxTimeGap) {
        var t = lastTime;
        do {
          t = new Date(t.getTime() + this.maxTimeGap*1000);
          this.times.push(t);
        } while ((time.valueOf()-t.valueOf()) > 1000*this.maxTimeGap);
      }
      this.times.push(time);
    }, this);
    _sortTimesArray(this.times);
    this.trigger('change:times');
  }
  
  /**
   * Bringt den Inhalt der Arrays this.enabledTimes und this.allEnabledTimes in
   * Übereinstimmung mit dem Inhalt von this.timesByKey
   * @private
   * @fires module:meteoJS/timeline#change:enabledTimes
   */
  _updateEnabledTimes() {
    this.enabledTimes = [];
    this.allEnabledTimes = [];
    var enabledTimes = {};
    var allEnabledTimes = {};
    for (var key in this.timesByKey) {
      this.timesByKey[key].enabled.forEach(function (t) {
        if (!(t.valueOf() in enabledTimes)) {
          this.enabledTimes.push(t);
          enabledTimes[t.valueOf()] = t;
        }
        if (!(t.valueOf() in allEnabledTimes))
          allEnabledTimes[t.valueOf()] = 1;
        else
          allEnabledTimes[t.valueOf()]++;
      }, this);
    }
    _sortTimesArray(this.enabledTimes);
    for (var value in allEnabledTimes)
      if (allEnabledTimes[value] == Object.keys(this.timesByKey).length)
        this.allEnabledTimes.push(enabledTimes[value]);
    _sortTimesArray(this.allEnabledTimes);
    this.trigger('change:enabledTimes');
  }
  
}
addEventFunctions(Timeline.prototype);
export default Timeline;

/**
 * Gibt den Index eines Zeitpunktes in einem Array aus Zeitpunkten zurück.
 * @param {moment} time Zeitpunkt
 * @param {moment[]} times Array aus Zeitpunkten
 * @returns {number} -1 für "nicht gefunden
 * @static
 * @private
 */
export let _indexOfTimeInTimesArray = (time, times) => {
  return times.findIndex(function (t) {
    return t.valueOf() == time.valueOf();
  });
}

/**
 * Sortiert einen Array aus Zeitpunkten zeitlich aufwärts
 * @param {moment[]} times Array aus Zeitpunkten
 * @static
 * @private
 */
function _sortTimesArray(times) {
  times.sort(function (a,b) { return a.valueOf()-b.valueOf(); });
}

export let _isKeyDown = (event, option) => {
  if (!('forEach') in option)
    option = [option];
  let result = true;
  option.forEach(o => {
    switch (o) {
      case 'ctrl':  if (!event.ctrlKey)  result = false; break;
      case 'alt':   if (!event.altKey)   result = false; break;
      case 'shift': if (!event.shiftKey) result = false; break;
      case 'meta':  if (!event.metaKey)  result = false; break;
      default:      if (o != event.keyCode) result = false;
    }
  });
  return result;
}