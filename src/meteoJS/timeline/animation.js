/**
 * @module meteoJS/timeline/animation
 */

/**
 * Options for animation constructor.
 * 
 * @typedef {Object} meteoJS/timeline/animation~options
 * @param {meteoJS.timeline} timeline Timeline to animate.
 * @param {number} [restartPause]
 *   Time in seconds to pause before the animation restart.
 * @param {number} [imagePeriod]
 *   Time in seconds between animation of two images.
 *   Ignored, if imageFrequency is specified.
 * @param {number|undefined} [imageFrequency]
 *   Time of images during one second.
 * @param {boolean} enabledStepsOnly Use only enabled times.
 * @param {boolean} allEnabledStepsOnly
 *   Use only times that are enabled by all sets of time.
 */

/**
 * Event on animation start.
 * 
 * @event meteoJS.timeline.animation#start:animation
 */

/**
 * Event on animation stop.
 * 
 * @event meteoJS.timeline.animation#stop:animation
 */

/**
 * Event on reaching last timestamp.
 * 
 * @event meteoJS.timeline.animation#end:animation
 */

/**
 * Event triggered immediatly before restart of animation.
 * 
 * @event meteoJS.timeline.animation#restart:animation
 */

/**
 * Event triggered when imageFrequency/imagePeriod is changed.
 * 
 * @event meteoJS.timeline.animation#change:imageFrequency
 */

/**
 * Event triggered when restartPause is changed.
 * 
 * @event meteoJS.timeline.animation#change:restartPause
 */

/**
 * Object to animate {@link meteoJS/timeline}.
 * 
 * @class
 * @param {meteoJS/timeline/animation~options} options Options.
 */
meteoJS.timeline.animation = function (options) {
  /**
   * Options.
   * @member {meteoJS/timeline/animation~options}
   * @private
   */
  this.options = $.extend(true, {
    timeline: undefined,
    restartPause: 1.8,
    imagePeriod: 0.2,
    imageFrequency: undefined,
    enabledStepsOnly: true,
    allEnabledStepsOnly: false
  }, options);
  // Normalize options
  if (this.options.timeline === undefined)
    this.options.timeline = new meteoJS.timeline();
  if (this.options.imageFrequency !== undefined &&
      this.options.imageFrequency != 0)
    this.options.imagePeriod = 1/this.options.imageFrequency;
  
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
  var onChangeTimes = function () {
    this.times = this.options.timeline[this._getTimelineTimesMethod()]();
    this.timesHash = {};
    this.times.forEach(function (time, i) {
      this.timesHash[time.valueOf()] = i;
    }, this);
  };
  this.options.timeline.on(this._getTimelineChangeTimesEvent(),
    onChangeTimes, this);
  onChangeTimes.call(this);
};
meteoJS.events.addEventFunctions(meteoJS.timeline.animation.prototype);

/**
 * Returns time period between two animation steps (in s).
 * 
 * @return {number} Time period.
 */
meteoJS.timeline.animation.prototype.getImagePeriod = function () {
  return this.options.imagePeriod;
};

/**
 * Sets time period between to animation steps (in s)
 * 
 * @param {number} imagePeriod Time period.
 * @return {meteoJS.timeline.animation} This.
 */
meteoJS.timeline.animation.prototype.setImagePeriod = function (imagePeriod) {
  this.options.imagePeriod = imagePeriod;
  if (this.isStarted())
    this._updateAnimation();
  this.trigger('change:imageFrequency');
  return this;
};

/**
 * Returns time frequency of animation steps (in 1/s).
 * 
 * @return {number} Time frequency.
 */
meteoJS.timeline.animation.prototype.getImageFrequency = function () {
  return 1/this.options.imagePeriod;
};

/**
 * Sets time frequency of animation steps (in 1/s).
 * 
 * @param {number} imageFrequency Time frequency.
 * @return {meteoJS.timeline.animation} This.
 */
meteoJS.timeline.animation.prototype.setImageFrequency = function (imageFrequency) {
  if (imageFrequency != 0)
    this.setImagePeriod(1/imageFrequency);
  return this;
};

/**
 * Returns time duration before a restart (jump from end to beginning, in s).
 * 
 * @returns {number} Time duration.
 */
meteoJS.timeline.animation.prototype.getRestartPause = function () {
  return this.options.restartPause;
};

/**
 * Sets time duration before a restart (in s).
 * 
 * @param {number} restartPause Time duration.
 * @return {meteoJS.timeline.animation} This.
 */
meteoJS.timeline.animation.prototype.setRestartPause = function (restartPause) {
  this.options.restartPause = Number(restartPause); // Convert string to number
  this.trigger('change:restartPause');
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
  if (this.options.timeline.getSelectedTime().valueOf() in this.timesHash)
    this._setStep(this.timesHash[this.options.timeline.getSelectedTime().valueOf()]);
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
  return this.options.timeline[this._getTimelineTimesMethod()]().length;
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
      if (that.animationStep < that.times.length)
        that.options.timeline.setSelectedTime(that.times[that.animationStep]);
      if (that.animationStep >= that._getCount()-1) {
        that.trigger('end:animation');
        that._clearAnimation();
        that._initRestartPause();
      }
    }, this.options.imagePeriod * 1000);
};

/**
 * Startet den Timer für die Restart-Pause
 * Verwende als Zeitspanne imagePeriod+restartPause. Sonst wird bei restartPause
 * 0s der letzte Zeitschritt gar nie angezeigt.
 * @private
 */
meteoJS.timeline.animation.prototype._initRestartPause = function () {
  var that = this;
  if (this.animationTimeoutID === undefined)
    this.animationTimeoutID = window.setTimeout(function () {
      that.animationStep = 0;
      that.trigger('restart:animation');
      if (that.animationStep < that.times.length)
        that.options.timeline.setSelectedTime(that.times[that.animationStep]);
      that._clearAnimation();
      that._initAnimation();
    }, (this.options.imagePeriod + this.options.restartPause) * 1000);
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