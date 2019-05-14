/**
 * @module meteoJS/timeline/animation
 */

import $ from 'jquery';
import Timeline from '../Timeline.js';

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
export class Animation {

constructor(options) {
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
    this.options.timeline = new Timeline();
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
}

/**
 * Returns time period between two animation steps (in s).
 * 
 * @return {number} Time period.
 */
getImagePeriod() {
  return this.options.imagePeriod;
}

/**
 * Sets time period between to animation steps (in s)
 * 
 * @param {number} imagePeriod Time period.
 * @return {meteoJS.timeline.animation} This.
 */
setImagePeriod(imagePeriod) {
  this.options.imagePeriod = imagePeriod;
  if (this.isStarted())
    this._updateAnimation();
  this.trigger('change:imageFrequency');
  return this;
}

/**
 * Returns time frequency of animation steps (in 1/s).
 * 
 * @return {number} Time frequency.
 */
getImageFrequency() {
  return 1/this.options.imagePeriod;
}

/**
 * Sets time frequency of animation steps (in 1/s).
 * 
 * @param {number} imageFrequency Time frequency.
 * @return {meteoJS.timeline.animation} This.
 */
setImageFrequency(imageFrequency) {
  if (imageFrequency != 0)
    this.setImagePeriod(1/imageFrequency);
  return this;
}

/**
 * Returns time duration before a restart (jump from end to beginning, in s).
 * 
 * @returns {number} Time duration.
 */
getRestartPause() {
  return this.options.restartPause;
}

/**
 * Sets time duration before a restart (in s).
 * 
 * @param {number} restartPause Time duration.
 * @return {meteoJS.timeline.animation} This.
 */
setRestartPause(restartPause) {
  this.options.restartPause = Number(restartPause); // Convert string to number
  this.trigger('change:restartPause');
  return this;
}
/**
 * Is animation started.
 * 
 * @returns {boolean}
 */
isStarted() {
  return this.animationIntervalID !== undefined ||
         this.animationTimeoutID !== undefined;
}

/**
 * Starts the animation.
 * 
 * @return {meteoJS.timeline.animation} This.
 * @fires meteoJS.timeline.animation#start:animation
 */
start() {
  if (this.options.timeline.getSelectedTime().valueOf() in this.timesHash)
    this._setStep(this.timesHash[this.options.timeline.getSelectedTime().valueOf()]);
  if (!this.isStarted())
    this._updateAnimation();
  this.trigger('start:animation');
}

/**
 * Stops the animation.
 * 
 * @return {meteoJS.timeline.animation} This.
 * @fires meteoJS.timeline.animation#stop:animation
 */
stop() {
  this._clearAnimation();
  this.trigger('stop:animation');
}

/**
 * Toggles the animation.
 * 
 * @return {meteoJS.timeline.animation} This.
 */
toggle() {
  if (this.isStarted())
    this.stop();
  else
    this.start();
}

/**
 * Setzt Schritt der Animation
 * @private
 * @param {number} step
 */
_setStep(step) {
  if (0 <= step && step < this._getCount())
    this.animationStep = step;
}

/**
 * Gibt timeline-Event Name zum abhören von Änderungen der Zeitschritte zurück.
 * @private
 * @return {string}
 */
_getTimelineChangeTimesEvent() {
  return (this.options.enabledStepsOnly || this.options.allEnabledStepsOnly) ?
           'change:enabledTimes' : 'change:times';
}

/**
 * Gibt timeline-Methode aller Zeitschritte zurück.
 * @private
 * @return {string}
 */
_getTimelineTimesMethod() {
  return this.options.allEnabledStepsOnly ? 'getAllEnabledTimes' :
           this.options.enabledStepsOnly ? 'getEnabledTimes' : 'getTimes';
}

/**
 * Gibt Anzahl Animationsschritte zurück
 * @private
 * @returns {number}
 */
_getCount() {
  return this.options.timeline[this._getTimelineTimesMethod()]().length;
}

/**
 * Handelt die Animation
 * @private
 * @fires meteoJS.timeline.animation#end:animation
 * @fires meteoJS.timeline.animation#restart:animation
 */
_updateAnimation() {
  this._clearAnimation();
  if (this.animationStep < this._getCount()-1)
    this._initAnimation();
  else
    this._initRestartPause();
}

/**
 * Startet Animation
 * @private
 */
_initAnimation() {
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
}

/**
 * Startet den Timer für die Restart-Pause
 * Verwende als Zeitspanne imagePeriod+restartPause. Sonst wird bei restartPause
 * 0s der letzte Zeitschritt gar nie angezeigt.
 * @private
 */
_initRestartPause() {
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
}

/**
 * Löscht window.interval, falls vorhanden
 * @private
 */
_clearAnimation() {
  if (this.animationIntervalID !== undefined) {
    window.clearInterval(this.animationIntervalID);
    this.animationIntervalID = undefined;
  }
  if (this.animationTimeoutID !== undefined) {
    window.clearTimeout(this.animationTimeoutID);
    this.animationTimeoutID = undefined;
  }
}

}
meteoJS.events.addEventFunctions(Animation.prototype);

/**
 * Insert an input-group to change frequency.
 * 
 * @param {jQuery} node Node to insert input-group.
 * @param {Object} options Options for input-group.
 * @param {meteoJS.timeline.animation} options.animation Animation object.
 * @param {string} options.suffix Suffix text for input-group.
 * @returns {jQuery} Input-group node.
 */
export function insertFrequencyInput(node, options) {
  options = $.extend(true, {
    animation: undefined,
    suffix: 'fps'
  }, options);
  var number = $('<input>')
    .addClass('form-control')
    .attr('type', 'number')
    .attr('min', 1)
    .attr('step', 1);
  var inputGroupNumber = $('<div>')
    .addClass('input-group')
    .append(number)
    .append($('<div>')
      .addClass('input-group-append')
      .append($('<span>').addClass('input-group-text').text(options.suffix)));
  number.on('change', (function () {
    options.animation.setImageFrequency(number.val());
  }).bind(this));
  var onChangeImageFrequency = (function () {
    number.val(options.animation.getImageFrequency());
  }).bind(this);
  options.animation.on('change:imageFrequency', onChangeImageFrequency);
  onChangeImageFrequency();
  node.append(inputGroupNumber);
  return inputGroupNumber;
};

/**
 * Insert an input-range to change frequency.
 * 
 * @param {jQuery} node Node to insert input-range.
 * @param {Object} options Options for input-range.
 * @param {meteoJS.timeline.animation} options.animation Animation object.
 * @param {number[]} options.frequencies Frequencies to select.
 * @returns {jQuery} Input-range node.
 */
export function insertFrequencyRange(node, options) {
  options = $.extend(true, {
    animation: undefined,
    frequencies: undefined
  }, options);
  var frequencies = options.frequencies ? options.frequencies : [1];
  var range = $('<input>')
    .addClass('custom-range')
    .attr('type', 'range')
    .attr('min', 0)
    .attr('max', frequencies.length-1);
  range.on('change input', function () {
    var i = range.val();
    if (i < frequencies.length)
      options.animation.setImageFrequency(frequencies[i]);
  });
  var onChangeImageFrequency = function () {
    var i = frequencies.indexOf(options.animation.getImageFrequency());
    if (i > -1)
      range.val(i);
  };
  options.animation.on('change:imageFrequency', onChangeImageFrequency);
  onChangeImageFrequency();
  node.append(range);
  return range;
};

/**
 * Insert an button-group to change frequency.
 * 
 * @param {jQuery} node Node to insert the button-group.
 * @param {Object} options Options for the button-group.
 * @param {meteoJS.timeline.animation} options.animation Animation object.
 * @param {number[]} options.frequencies Frequencies to select.
 * @param {string|undefined} btnGroupClass Class added to the button-group node.
 * @param {string|undefined} btnClass Class added to each button.
 * @param {string} options.suffix Suffix text for each button after frequency.
 * @returns {jQuery} Button-group node.
 */
export function insertFrequencyButtonGroup(node, options) {
  options = $.extend(true, {
    animation: undefined,
    frequencies: undefined,
    btnGroupClass: 'btn-group',
    btnClass: 'btn btn-primary',
    suffix: 'fps'
  }, options);
  var btnGroup = $('<div>').addClass(options.btnGroupClass);
  var frequencies = options.frequencies ? options.frequencies : [];
  frequencies.forEach(function (freq) {
    btnGroup.append($('<button>')
      .addClass(options.btnClass)
      .data('frequency', freq)
      .text(freq + ' ' + options.suffix)
      .click(function () {
        options.animation.setImageFrequency(freq);
      }));
  });
  var onChange = function () {
    btnGroup.children('button').removeClass('active').each(function () {
      if ($(this).data('frequency') == options.animation.getImageFrequency())
        $(this).addClass('active');
    });
  };
  options.animation.on('change:imageFrequency', onChange);
  onChange();
  node.append(btnGroup);
  return btnGroup;
};

/**
 * Insert an input-group to change restart pause.
 * 
 * @param {jQuery} node Node to insert input-group.
 * @param {Object} options Options for input-group.
 * @param {meteoJS.timeline.animation} options.animation Animation object.
 * @param {string} options.suffix Suffix text for input-group.
 * @returns {jQuery} Input-group node.
 */
export function insertRestartPauseInput(node, options) {
  options = $.extend(true, {
    animation: undefined,
    suffix: 's'
  }, options);
  var input = $('<input>')
    .addClass('form-control')
    .attr('type', 'number')
    .attr('min', 0)
    .attr('step', 0.1);
  var inputGroupNumber = $('<div>')
    .addClass('input-group')
    .append(input)
    .append($('<div>')
      .addClass('input-group-append')
      .append($('<span>').addClass('input-group-text').text(options.suffix)));
  input.on('change', function () {
    options.animation.setRestartPause(input.val());
  });
  var onChange = function () {
    input.val(options.animation.getRestartPause());
  };
  options.animation.on('change:restartPause', onChange);
  onChange();
  node.append(inputGroupNumber);
  return inputGroupNumber;
};

/**
 * Insert an input-range to change restart pause.
 * 
 * @param {jQuery} node Node to insert input-range.
 * @param {Object} options Options for input-range.
 * @param {meteoJS.timeline.animation} options.animation Animation object.
 * @param {number[]} options.pauses Restart pauses to select.
 * @returns {jQuery} Input-range node.
 */
export function insertRestartPauseRange(node, options) {
  options = $.extend(true, {
    animation: undefined,
    pauses: undefined
  }, options);
  var pauses = options.pauses ? options.pauses : [1];
  pauses = pauses.map(function (p) {
    return Math.round(p * 1000)
  });
  var range = $('<input>')
    .addClass('custom-range')
    .attr('type', 'range')
    .attr('min', 0)
    .attr('max', pauses.length-1);
  range.on('change input', function () {
    var i = range.val();
    if (i < pauses.length)
      options.animation.setRestartPause(pauses[i] / 1000);
  });
  var onChangeImageFrequency = function () {
    var i =
      pauses.indexOf(Math.round(options.animation.getRestartPause() * 1000));
    if (i > -1)
      range.val(i);
  };
  options.animation.on('change:imageFrequency', onChangeImageFrequency);
  onChangeImageFrequency();
  node.append(range);
  return range;
};

/**
 * Insert an button-group to change restart pause.
 * 
 * @param {jQuery} node Node to insert the button-group.
 * @param {Object} options Options for the button-group.
 * @param {meteoJS.timeline.animation} options.animation Animation object.
 * @param {number[]} options.pauses Restart pauses to select.
 * @param {string|undefined} btnGroupClass Class added to the button-group node.
 * @param {string|undefined} btnClass Class added to each button.
 * @param {string} options.suffix Suffix in each button after duration text.
 * @returns {jQuery} Button-group node.
 */
export function insertRestartPauseButtonGroup(node, options) {
  options = $.extend(true, {
    animation: undefined,
    pauses: undefined,
    btnGroupClass: 'btn-group',
    btnClass: 'btn btn-primary',
    suffix: 's'
  }, options);
  var btnGroup = $('<div>').addClass(options.btnGroupClass);
  var pauses = options.pauses ? options.pauses : [];
  pauses.forEach(function (pause) {
    btnGroup.append($('<button>')
      .addClass(options.btnClass)
      .data('pause', pause)
      .text(pause + ' ' + options.suffix)
      .click(function () {
        options.animation.setRestartPause(pause);
      }));
  });
  var onChange = function () {
    btnGroup.children('button').removeClass('active').each(function () {
      if ($(this).data('pause') == options.animation.getRestartPause())
        $(this).addClass('active');
    });
  };
  options.animation.on('change:restartPause', onChange);
  onChange();
  node.append(btnGroup);
  return btnGroup;
};