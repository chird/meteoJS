/**
 * @module meteoJS/timeline/visualisation
 */
import addEventFunctions from '../Events.js';
import Timeline from '../Timeline.js';

/**
 * Returns a textual representation of a time according to a passed format.
 * 
 * This function could be used to convert Date-objects to a readable time with
 * external libraries. One such implementation is given by
 * {@link module:meteoJS/timeline/visualisation.makeTimeTextCallbackFunction}.
 * 
 * @typedef {Function}
 *   module:meteoJS/timeline/visualisation~timeTextCallbackFunction
 * @param {Date} time - A valid datetime.
 * @param {string} format - Format string.
 * @returns {string} Textual representation.
 */

/**
 * Options for Visualisation.
 * 
 * @typedef {Object} module:meteoJS/timeline/visualisation~options
 * @param {module:meteoJS/timeline.Timeline} [timeline]
 *   Timeline object.
 * @param {external:jQuery} [node] - Node.
 * @param {module:meteoJS/timeline/animation.Animation} [animation]
 *   Animation object. If specified, the animation will be stopped on user
 *   interaction with the visualisation object.
 * @param {boolean} [enabledStepsOnly=true] - Use only enabled times.
 * @param {boolean} [allEnabledStepsOnly=false]
 *   Use only times that are enabled by all sets of time.
 * @param {string} [textInvalid='-']
 *   Output string, if time of timeline is invalid.
 * @param {module:meteoJS/timeline/visualisation~timeTextCallbackFunction}
 *   [getTimeText]
 *   Returns a textual representation of a time according to a passed format.
 * @param {string} [outputTimezone]
 *   'local' for browser local timezone.
 */

/**
 * Object to visualise {@link module:meteoJS/timeline.Timeline}.
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
 * @abstract
 * @listens module:meteoJS/timeline#change:time
 * @listens module:meteoJS/timeline#change:times
 * @listens module:meteoJS/timeline#change:enabledTimes
 */
export class Visualisation {
  
  /**
   * @param {module:meteoJS/timeline/visualisation~options} options - Options.
   */
  constructor({
    timeline = undefined,
    node = undefined,
    animation = undefined,
    enabledStepsOnly = true,
    allEnabledStepsOnly = false,
    textInvalid = '-',
    getTimeText = undefined,
    outputTimezone = undefined
  } = {}) {
    /**
     * @type Object
     * @private
     */
    this.options = {
      timeline,
      node,
      animation,
      enabledStepsOnly,
      allEnabledStepsOnly,
      textInvalid,
      getTimeText,
      outputTimezone
    };
    
    // Normalize options
    if (this.options.timeline === undefined)
      this.options.timeline = new Timeline();
    
    /**
     * @member {Array[]}
     * @private
     */
    this.listeners = [];
    
    /**
     * @member {undefined|mixed}
     * @private
     */
    this.inputListener = undefined;
  }
  
  /**
   * Sets jQuery-Node for output.
   * 
   * @public
   * @param {external:jQuery|undefined} node Node, undefined to mute the output.
   * @returns {module:meteoJS/timeline/visualisation.Visualisation} This.
   */
  setNode(node) {
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
        this.attachEventListener(this.options.timeline, 'change:times', function () {
          this.onChangeTimes();
        }, this);
        this.attachEventListener(this.options.timeline, 'change:enabledTimes', function () {
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
  }
  
  /**
   * Gets current value of output timezone.
   * 
   * @public
   * @returns {string|undefined} Output timezone.
   */
  getOutputTimezone() {
    return this.options.outputTimezone;
  }
  
  /**
   * Sets output timezone, undefined for UTC.
   * 
   * @public
   * @param {string|undefined} outputTimezone Timezone for datetime output.
   * @returns {module:meteoJS/timeline/visualisation.Visualisation} This.
   */
  setOutputTimezone(outputTimezone) {
    var updateOutput = (this.options.outputTimezone != outputTimezone);
    this.options.outputTimezone = outputTimezone;
    if (updateOutput &&
        this.options.node !== undefined) {
      this.onChangeTimes();
      this.onChangeTime();
    }
    return this;
  }
  
  /**
   * Called if the timeline triggers the
   * {@link module:meteoJS/timeline#change:time} event.
   * Prerequisite: this.options.node must be defined.
   * 
   * @abstract
   * @protected
   */
  onChangeTime() {}
  
  /**
   * Called if the timeline triggers the {@link module:meteoJS/timeline#change:times}
   * or {@link module:meteoJS/timeline#change:enabledTimes} event.
   * Prerequisite: this.options.node must be defined.
   * 
   * @abstract
   * @protected
   */
  onChangeTimes() {}
  
  /**
   * Called to empty the output node. Mainly if the output is muted.
   * Prerequisite: this.options.node must be defined.
   * 
   * @abstract
   * @protected
   */
  emptyNode() {}
  
  /**
   * Called once an output node is set.
   * Prerequisite: this.options.node must be defined.
   * 
   * @abstract
   * @protected
   * @param {boolean} isListenersDefined
   *   True if the event listeners are already set.
   */
  onInitNode() {}
  
  /**
   * Returns the times to display. This could be either all times in the timeline
   * or only the enabled times or the all enabled times. The user of the
   * visualisation object select this by the options.
   * 
   * @protected
   * @returns {Date[]} Times.
   */
  getTimelineTimes() {
    var methodName = this.options.allEnabledStepsOnly ?
      'getAllEnabledTimes' :
      this.options.enabledStepsOnly ? 'getEnabledTimes' : 'getTimes';
    return this.options.timeline[methodName]();
  }
  
  /**
   * Converts a Date-object to a string.
   * 
   * @protected
   * @param {Date} time - Time.
   * @param {string} format - Format string, passed to the .
   * @returns {string} String.
   */
  timeToText(time, format) {
    if (isNaN(time))
      return this.options.textInvalid;
    if (this.options.getTimeText !== undefined)
      return this.options.getTimeText.call(this, time, format);
    return time.toISOString();
  }
  
  /**
   * Attach an event listener on an object. Object could be a jQuery-object or
   * an object using {@link module:meteoJS/events}.
   * 
   * @protected
   * @param {object} obj - Object to put the event listener on.
   * @param {mixed} listener - Event listener key.
   * @param {function} func - Function to be executed when event is triggered.
   * @param {object} [thisArg] - This in the function func when event triggered.
   */
  attachEventListener(obj, listener, func, thisArg) {
    this.listeners.push([obj, listener]);
    obj.on(listener, func, thisArg);
  }
  
  /**
   * Detaches all event listeners.
   * 
   * @private
   */
  detachEventListeners() {
    this.listeners.forEach(function (listenerArr) {
      if ('un' in listenerArr[0])
        listenerArr[0].un(listenerArr[1]);
      else if ('off' in listenerArr[0])
        listenerArr[0].off(listenerArr[1]);
    });
    this.listeners = [];
  }
  
}
addEventFunctions(Visualisation.prototype);
export default Visualisation;

/**
 * Format a Date-object via the {@link https://momentjs.com|Moment.js} library.
 * 
 * @param {Object} moment - Moment.js object.
 * @returns {module:meteoJS/timeline/visualisation~timeTextCallbackFunction}
 *   Callback.
 */
export function makeTimeTextCallbackFunction(moment) {
  return function (time, format) {
    const m = moment.utc(time);
    if (this.options.outputTimezone !== undefined)
      (this.options.outputTimezone == 'local')
        ? m.local()
        : m.tz(this.options.outputTimezone);
    return m.format(format);
  };
}