/**
 * @module meteoJS/timeline/visualisation
 */
import $ from 'jquery';
import moment from 'moment-timezone';
import addEventFunctions from '../Events.js';
import Timeline from '../Timeline.js';

/**
 * Options for Visualisation.
 * 
 * @typedef {Object} Options
 * @param {module:meteoJS/timeline~Timeline} timeline Timeline object.
 * @param {jQuery|undefined} node Node.
 * @param {module:meteoJS/timeline/animation~Animation} [animation]
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
 * @classdesc
 * Object to visualise {@link module:meteoJS/timeline~Timeline}.
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
export default class Visualisation {
  
  /**
   * @param {Options} options Options.
   */
	constructor(options) {
		/**
		 * Options.
		 * @member {Options}
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
			this.options.timeline = new Timeline();
	
		/**
		 * @member {Array[]}
		 */
		this.listeners = [];
	
		/**
		 * @member {undefined|mixed}
		 */
		this.inputListener = undefined;
	}
  
	/**
	 * Sets jQuery-Node for output.
	 * 
	 * @public
	 * @param {jQuery|undefined} node Node, undefined to mute the output.
	 * @returns {Visualisation} This.
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
	 * @returns {Visualisation} This.
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
	 * Called if the timeline triggers the meteoJS.timeline#change:time event.
	 * Prerequisite: this.options.node must be defined.
	 * 
	 * @abstract
	 * @protected
	 */
	onChangeTime() {};
  
	/**
	 * Called if the timeline triggers the {@link meteoJS.timeline#change:times}
	 * or {@link module:meteoJS.timeline#change:enabledTimes} event.
	 * Prerequisite: this.options.node must be defined.
	 * 
	 * @abstract
	 * @protected
	 */
	onChangeTimes() {};
  
	/**
	 * Called to empty the output node. Mainly if the output is muted.
	 * Prerequisite: this.options.node must be defined.
	 * 
	 * @abstract
	 * @protected
	 */
	emptyNode() {};
  
	/**
	 * Called once an output node is set.
	 * Prerequisite: this.options.node must be defined.
	 * 
	 * @abstract
	 * @protected
	 * @param {boolean} isListenersDefined
	 *   True if the event listeners are already set.
	 */
	onInitNode(isListenersDefined) {}
  
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
	 * Converts a Date-object to a string. Uses options to deside the timezone
	 * to represent the Date.
	 * 
	 * @protected
	 * @param {Date} time Time.
	 * @param {string} format
	 *   Format string, used for {@link moment.format} if Date is valid.
	 * @returns {string} String.
	 */
	timeToText(time, format) {
		if (isNaN(time))
			return this.options.textInvalid;
		var m = moment.utc(time);
		if (this.options.outputTimezone !== undefined)
			(this.options.outputTimezone == 'local') ?
				m.local() : m.tz(this.options.outputTimezone);
		return m.format(format);
	}
  
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