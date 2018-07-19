/**
 * @module meteoJS/timeline/visualisation
 */

/**
 * Options for meteoJS/timeline/visualisation.
 * 
 * @typedef {Object} meteoJS/timeline/visualisation~options
 * @param {meteoJS.timeline} timeline Timeline object.
 * @param {jQuery|undefined} node Node.
 * @param {meteoJS.timeline.animation} [animation]
 *   Animation object. If specified, the animation will be stopped on user
 *   interaction with the visualisation object.
 * @param {boolean} enabledStepsOnly Use only enabled times.
 * @param {boolean} allEnabledStepsOnly
 *   Use only times that are enabled by all sets of time.
 * @param {string} textInvalid Output string, if time of timeline is invalid.
 * @param {string|undefined} outputTimezone 'local' for browser local timezone.
 *   If not undefined, moment-timezone is required.
 */

/**
 * Object to visualise {@link meteoJS/timeline}.
 * 
 * How to create your own visualisation object:
 * * Inherit this object
 * * Inherit method onChangeTime()
 * * Inherit method onChangeTimes()
 * * Inherit method emptyNode()
 * * Inherit method onInitNode()
 * * To get all times to display use getTimelineTimes()
 * * Use method timeToText() to convert a Date to String.
 * * Use method attachEventListener() to attach event listeners on a object.
 *   The event listener will be deleted automatically if the output is muted.
 * * At the end of the constructor call "this.setNode(this.options.node);".
 * 
 * @class
 * @abstract
 * @param {meteoJS/timeline/visualisation~options} options Options.
 * @listens meteoJS.timeline#change:time
 * @listens meteoJS.timeline#change:times
 * @listens meteoJS.timeline#change:enabledTimes
 */
meteoJS.timeline.visualisation = function (options) {
  /**
   * Options.
   * @member {meteoJS/timeline/visualisation~options}
   */
  this.options = $.extend(true, {
    timeline: undefined,
    node: undefined,
    animation: undefined,
    enabledStepsOnly: true,
    allEnabledStepsOnly: false,
    textInvalid: '-',
    outputTimezone: undefined
  }, options);
  // Normalize options
  if (this.options.timeline === undefined)
    this.options.timeline = new meteoJS.timeline();
  
  /**
   * @member {Array[]}
   */
  this.listeners = [];
  
  /**
   * @member {undefined|mixed}
   */
  this.inputListener = undefined;
};
meteoJS.events.addEventFunctions(meteoJS.timeline.visualisation.prototype);

/**
 * Sets jQuery-Node for output.
 * 
 * @public
 * @param {jQuery|undefined} node Node, undefined to mute the output.
 * @returns {meteoJS.timeline.visualisation} This.
 */
meteoJS.timeline.visualisation.prototype.setNode = function (node) {
  if (this.options.node !== undefined)
    this.emptyNode();
  
  if (node === undefined) {
    this.detachEventListeners();
    this.options.node = node;
  }
  else {
    this.options.node = node;
    var isListenersDefined = this.listeners.length > 0;
    if (!isListenersDefined) {
      this.attachEventListener(this.options.timeline, 'change:time', function () {
        this.onChangeTime();
      }, this);
      var timesListener =
        (this.options.enabledStepsOnly || this.options.allEnabledStepsOnly) ?
          'change:enabledTimes' : 'change:times';
      this.attachEventListener(this.options.timeline, timesListener, function () {
        this.onChangeTimes();
      }, this);
    }
    this.onInitNode(isListenersDefined);
    this.onChangeTimes();
    this.onChangeTime();
  }
  
  if (this.inputListener === undefined)
    this.inputListener = this.on('input', function () {
      if (this.options.animation !== undefined)
        this.options.animation.stop();
    }, this);
  
  return this;
};

/**
 * Called if the timeline triggers the meteoJS.timeline#change:time event.
 * Prerequisite: this.options.node must be defined.
 * 
 * @abstract
 * @protected
 */
meteoJS.timeline.visualisation.prototype.onChangeTime = function () {};

/**
 * Called if the timeline triggers the meteoJS.timeline#change:times or
 * meteoJS.timeline#change:enabledTimes event.
 * Prerequisite: this.options.node must be defined.
 * 
 * @abstract
 * @protected
 */
meteoJS.timeline.visualisation.prototype.onChangeTimes = function () {};

/**
 * Called to empty the output node. Mainly if the output is muted.
 * Prerequisite: this.options.node must be defined.
 * 
 * @abstract
 * @protected
 */
meteoJS.timeline.visualisation.prototype.emptyNode = function () {};

/**
 * Called once an output node is set.
 * Prerequisite: this.options.node must be defined.
 * 
 * @abstract
 * @protected
 * @param {boolean} isListenersDefined
 *   True if the event listeners are already set.
 */
meteoJS.timeline.visualisation.prototype.onInitNode =
  function (isListenersDefined) {};

/**
 * Returns the times to display. This could be either all times in the timeline
 * or only the enabled times or the all enabled times. The user of the
 * visualisation object select this by the options.
 * 
 * @protected
 * @returns {Date[]} Times.
 */
meteoJS.timeline.visualisation.prototype.getTimelineTimes = function () {
  var methodName = this.options.allEnabledStepsOnly ?
    'getAllEnabledTimes' :
    this.options.enabledStepsOnly ? 'getEnabledTimes' : 'getTimes';
  return this.options.timeline[methodName]();
};

/**
 * Converts a Date-object to a string. Uses options to deside the timezone
 * to represent the Date.
 * 
 * @protected
 * @requires moment.js
 * @requires moment-timezone.js
 * @param {Date} time Time.
 * @param {string} format
 *   Format string, used for {@link moment.format} if Date is valid.
 * @returns {string} String.
 */
meteoJS.timeline.visualisation.prototype.timeToText = function (time, format) {
  if (isNaN(time))
    return this.options.textInvalid;
  var m = moment.utc(time);
  if (this.options.outputTimezone !== undefined)
    (this.options.outputTimezone == 'local') ?
      m.local() : m.tz(this.options.outputTimezone);
  return m.format(format);
};

/**
 * Attach an event listener on an object. Object could be a jQuery-object or
 * an object using meteoJS/events.
 * 
 * @protected
 * @param {object} obj Object to put the event listener on.
 * @param {mixed} listener Event listener key.
 * @param {function} func Function to be executed when event is triggered.
 * @param {object} [thisArg] This in the function func when event triggered.
 */
meteoJS.timeline.visualisation.prototype.attachEventListener =
    function (obj, listener, func, thisArg) {
  this.listeners.push([obj, listener]);
  obj.on(listener, func, thisArg);
};

/**
 * Detaches all event listeners.
 * 
 * @private
 */
meteoJS.timeline.visualisation.prototype.detachEventListeners = function () {
  this.listeners.forEach(function (listenerArr) {
    if ('un' in listenerArr[0])
      listenerArr[0].un(listenerArr[1]);
    else if ('off' in listenerArr[0])
      listenerArr[0].off(listenerArr[1]);
  });
  this.listeners = [];
};