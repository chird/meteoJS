/**
 * @module meteoJS/timeline/animation
 */

/**
 * Options for animation constructor.
 * 
 * @typedef {Object} meteoJS/timeline/animation~options
 * @param {number|undefined} [options.maxTimeGap]
 *   Maximum of time period (in seconds) between two timestamps. If this option
 *   is specified, than e.g. the method getTimes() could return more timestamps
 *   than defined by setTimesBySetID.
 */

/**
 * XXX Event für den Start der Animation
 * @event meteoJS.timeline.animation#start:animation
 */

/**
 * XXX Event für das Stoppen der Animation
 * @event meteoJS.timeline.animation#stop:animation
 */

/**
 * XXX Event für den Schluss eines Animation-Durchlaufs
 * @event meteoJS.timeline.animation#end:animation
 */

/**
 * XXX Event für den Restart nach einem Animation-Durchlauf
 * @event meteoJS.timeline.animation#restart:animation
 */

/**
 * Object to animate {@link meteoJS/timeline}.
 * 
 * @class
 * @param {meteoJS.timeline} timeline Timeline object to animate.
 * @param {meteoJS/timeline/animation~options} options Options.
 */
meteoJS.timeline.animation = function (timeline, options) {
  /**
   * Options.
   * @member {meteoJS/timeline/animation~options}
   * @private
   */
  this.options = $.extend(true, {
    restartPause: 2, // XXX
    interval: 200, // XXX
    enabledStepsOnly: true,
    allEnabledStepsOnly: false
  }, options);
  
  /**
   * Timeline.
   * @member {meteoJS/timeline}
   */
  this.timeline = timeline;
  
  /**
   * ID to window.setInterval() of the animation.
   * If undefined, there is no started animation.
   * @member {undefined|number}
   * @private
   */
  this.animationIntervalID = undefined;
  
  /**
   * ID to window.setTimeout() ot the animation (used for restart-pause).
   * If undefined, there is no started setTimeout (i.e. no restart-pause).
   * @member {undefined|number}
   * @private
   */
  this.animationTimeoutID = undefined;
  
  /**
   * Current position in this.times in the animation.
   * @member {integer}
   * @private
   */
  this.animationStep = 0;
  
  /**
   * Hash with timestamps-valueOf's as keys and index in this.times as values.
   * @member {object}
   * @private
   */
  this.timesHash = {};
  
  /**
   * List of timestamps. Current list of times of the timeline to animate over.
   * @member {Date[]}
   * @private
   */
  this.times = [];
  
  // Timeline initialisieren
  this.timeline.on(this._getTimelineChangeTimesEvent(), function () {
    this.times = this.timeline[_getTimelineTimesMethod()]();
    this.timesHash = {};
    this.times.forEach(function (time, i) {
      this.timesHash[time.valueOf()] = i;
    }, this);
  }, this);
};
meteoJS.events.addEventFunctions(meteoJS.timeline.prototype);

/**
 * Returns time period between to animation steps (in ms).
 * 
 * @return {number} Time period.
 */
meteoJS.timeline.animation.prototype.getInterval = function () {
  return this.options.interval;
};

/**
 * Sets time period between to animation steps (in ms)
 * 
 * @param {number} Time period.
 * @return {meteoJS.timeline.animation} This.
 */
meteoJS.timeline.animation.prototype.setInterval = function (interval) {
  this.options.interval = interval;
  if (this.isStarted())
    this._updateAnimation();
  return this;
};

/**
 * Returns time duration of a restart (jump from end to beginning, in s).
 * 
 * @returns {number} Time duration.
 */
meteoJS.timeline.animation.prototype.getRestartTime = function () {
  return this.options.restartTime;
};

/**
 * Sets time duration of a restart (in s).
 * 
 * @param {number} restartTime Time duration.
 * @return {meteoJS.timeline.animation} This.
 */
meteoJS.timeline.animation.prototype.setRestartTime = function (restartTime) {
  this.options.restartTime = restartTime;
  return this;
};
/**
 * Is animation started.
 * 
 * @returns {boolean}
 */
meteoJS.timeline.animation.prototype.isStarted = function () {
  return this.animationIntervalID !== undefined ||
         this.animationTimeoutID !== undefined;
};

/**
 * Starts the animation.
 * 
 * @return {meteoJS.timeline.animation} This.
 * @fires meteoJS.timeline.animation#start:animation
 */
meteoJS.timeline.animation.prototype.start = function () {
  if (this.timeline.getTime().valueOf() in this.timesHash)
    this._setStep(this.timesHash[this.timeline.getTime().valueOf()]);
  if (!this.isStarted())
    this._updateAnimation();
  this.trigger('start:animation');
};

/**
 * Stops the animation.
 * 
 * @return {meteoJS.timeline.animation} This.
 * @fires meteoJS.timeline.animation#stop:animation
 */
meteoJS.timeline.animation.prototype.stop = function () {
  this._clearAnimation();
  this.trigger('stop:animation');
};

/**
 * Toggles the animation.
 * 
 * @return {meteoJS.timeline.animation} This.
 */
meteoJS.timeline.animation.prototype.toggle = function () {
  if (this.isStarted())
    this.stop();
  else
    this.start();
};

/**
 * Setzt Schritt der Animation
 * @private
 * @param {number} step
 */
meteoJS.timeline.animation.prototype._setStep = function (step) {
  if (0 <= step && step < this._getCount())
    this.animationStep = step;
};

/**
 * Gibt timeline-Event Name zum abhören von Änderungen der Zeitschritte zurück.
 * @private
 * @return {string}
 */
meteoJS.timeline.animation.prototype._getTimelineChangeTimesEvent = function () {
  return (this.options.enabledStepsOnly || this.options.allEnabledStepsOnly) ?
           'change:enabledTimes' : 'change:times';
};

/**
 * Gibt timeline-Methode aller Zeitschritte zurück.
 * @private
 * @return {string}
 */
meteoJS.timeline.animation.prototype._getTimelineTimesMethod = function () {
  return this.options.allEnabledStepsOnly ? 'getAllEnabledTimes' :
           this.options.enabledStepsOnly ? 'getEnabledTimes' : 'getTimes';
};

/**
 * Gibt Anzahl Animationsschritte zurück
 * @private
 * @returns {number}
 */
meteoJS.timeline.animation.prototype._getCount = function () {
  return this.timeline[this._getTimelineTimesMethod()]().length;
};

/**
 * Handelt die Animation
 * @private
 * @fires meteoJS.timeline.animation#end:animation
 * @fires meteoJS.timeline.animation#restart:animation
 */
meteoJS.timeline.animation.prototype._updateAnimation = function () {
  this._clearAnimation();
  if (this.animationStep < this._getCount()-1)
    this._initAnimation();
  else
    this._initRestartPause();
};

/**
 * Startet Animation
 * @private
 */
meteoJS.timeline.animation.prototype._initAnimation = function () {
  var that = this;
  if (this.animationIntervalID === undefined)
    this.animationIntervalID = window.setInterval(function () {
      that.animationStep++;
      if (i < that.times.length)
        that.timeline.setTime(that.times[i]);
      if (that.animationStep >= that._getCount()-1) {
        that.trigger('end:animation');
        that._clearAnimation();
        that._initRestartPause();
      }
    }, this.options.interval);
};

/**
 * Startet den Timer für die Restart-Pause
 * @private
 */
meteoJS.timeline.animation.prototype._initRestartPause = function () {
  var that = this;
  if (this.animationTimeoutID === undefined)
    this.animationTimeoutID = window.setTimeout(function () {
      that.animationStep = 0;
      that.trigger('restart:animation');
      if (i < that.times.length)
        that.timeline.setTime(that.times[i]);
      that._clearAnimation();
      that._initAnimation();
    }, this.options.restartTime*1000);
};

/**
 * Löscht window.interval, falls vorhanden
 * @private
 */
meteoJS.timeline.animation.prototype._clearAnimation = function () {
  if (this.animationIntervalID !== undefined) {
    window.clearInterval(this.animationIntervalID);
    this.animationIntervalID = undefined;
  }
  if (this.animationTimeoutID !== undefined) {
    window.clearTimeout(this.animationTimeoutID);
    this.animationTimeoutID = undefined;
  }
};