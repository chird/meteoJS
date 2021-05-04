/**
 * @module meteoJS/timeline/animation
 */
import $ from 'jquery';
import addEventFunctions from '../Events.js';
import Timeline from '../Timeline.js';

/**
 * Options for animation constructor.
 * 
 * @typedef {Object} module:meteoJS/timeline/animation~options
 * @param {module:meteoJS/timeline.Timeline} timeline - Timeline to animate.
 * @param {number} [restartPause]
 *   Time in seconds to pause before the animation restart.
 * @param {number} [imagePeriod]
 *   Time in seconds between animation of two images.
 *   Ignored, if imageFrequency is specified.
 * @param {number|undefined} [imageFrequency]
 *   Time of images during one second.
 * @param {boolean} [enabledStepsOnly] - Use only enabled times.
 * @param {boolean} [allEnabledStepsOnly]
 *   Use only times that are enabled by all sets of time.
 */

/**
 * Event on animation start.
 * 
 * @event module:meteoJS/timeline/animation#start:animation
 */

/**
 * Event on animation stop.
 * 
 * @event module:meteoJS/timeline/animation#stop:animation
 */

/**
 * Event on reaching last timestamp.
 * 
 * @event module:meteoJS/timeline/animation#end:animation
 */

/**
 * Event triggered immediatly before restart of animation.
 * 
 * @event module:meteoJS/timeline/animation#restart:animation
 */

/**
 * Event triggered when imageFrequency/imagePeriod is changed.
 * 
 * @event module:meteoJS/timeline/animation#change:imageFrequency
 */

/**
 * Event triggered when restartPause is changed.
 * 
 * @event module:meteoJS/timeline/animation#change:restartPause
 */

/**
 * Object to animate {@link module:meteoJS/timeline.Timeline}.
 */
export class Animation {
  
  /**
   * @param {module:meteoJS/timeline/animation~options} options - Options.
   */
  constructor({ timeline,
    restartPause = 1.8,
    imagePeriod = 0.2,
    imageFrequency,
    enabledStepsOnly = true,
    allEnabledStepsOnly = false } = {}) {
    /**
     * @type module:meteoJS/timeline/animation~options
     * @private
     */
    this.options = {
      timeline,
      restartPause,
      imagePeriod,
      imageFrequency,
      enabledStepsOnly,
      allEnabledStepsOnly
    };
    // Normalize options
    if (this.options.timeline === undefined)
      this.options.timeline = new Timeline();
    if (this.options.imageFrequency !== undefined &&
        this.options.imageFrequency != 0)
      this.options.imagePeriod = 1/this.options.imageFrequency;
    /**
     * ID to window.setInterval() of the animation.
     * If undefined, there is no started animation.
     * @type undefined|number
     * @private
     */
    this.animationIntervalID = undefined;
    
    /**
     * ID to window.setTimeout() ot the animation (used for restart-pause).
     * If undefined, there is no started setTimeout (i.e. no restart-pause).
     * @type undefined|number
     * @private
     */
    this.animationTimeoutID = undefined;
    
    /**
     * Current position in this.times in the animation.
     * @type integer
     * @private
     */
    this.animationStep = 0;
    
    /**
     * Hash with timestamps-valueOf's as keys and index in this.times as values.
     * @type Object
     * @private
     */
    this.timesHash = {};
    
    /**
     * List of timestamps. Current list of times of the timeline to animate over.
     * @type Date[]
     * @private
     */
    this.times = [];
    
    // Timeline initialisieren
    let onChangeTimes = () => {
      this.times = this.options.timeline[this._getTimelineTimesMethod()]();
      this.timesHash = {};
      this.times.forEach((time, i) => this.timesHash[time.valueOf()] = i);
    };
    this.options.timeline.on(this._getTimelineChangeTimesEvent(), onChangeTimes);
    onChangeTimes();
  }
  
  /**
   * Returns time period between two animation steps (in s).
   * 
   * @returns {number} Time period.
   */
  getImagePeriod() {
    return this.options.imagePeriod;
  }
  
  /**
   * Sets time period between to animation steps (in s)
   * 
   * @param {number} imagePeriod - Time period.
   * @returns {module:meteoJS/timeline/animation.Animation} This.
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
   * @returns {number} Time frequency.
   */
  getImageFrequency() {
    return 1/this.options.imagePeriod;
  }
  
  /**
   * Sets time frequency of animation steps (in 1/s).
   * 
   * @param {number} imageFrequency - Time frequency.
   * @returns {module:meteoJS/timeline/animation.Animation} This.
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
   * @param {number} restartPause - Time duration.
   * @returns {module:meteoJS/timeline/animation.Animation} This.
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
   * @returns {module:meteoJS/timeline/animation.Animation} This.
   * @fires module:meteoJS/timeline/animation#start:animation
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
   * @returns {module:meteoJS/timeline/animation.Animation} This.
   * @fires module:meteoJS/timeline/animation#stop:animation
   */
  stop() {
    this._clearAnimation();
    this.trigger('stop:animation');
  }
  
  /**
   * Toggles the animation.
   * 
   * @returns {module:meteoJS/timeline/animation.Animation} This.
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
   * @returns {string}
   */
  _getTimelineChangeTimesEvent() {
    return (this.options.enabledStepsOnly || this.options.allEnabledStepsOnly)
      ? 'change:enabledTimes' : 'change:times';
  }
  
  /**
   * Gibt timeline-Methode aller Zeitschritte zurück.
   * @private
   * @returns {string}
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
   * @fires module:meteoJS/timeline/animation#end:animation
   * @fires module:meteoJS/timeline/animation#restart:animation
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
    if (this.animationIntervalID === undefined)
      this.animationIntervalID = window.setInterval(() => {
        this.animationStep++;
        if (this.animationStep < this.times.length)
          this.options.timeline.setSelectedTime(this.times[this.animationStep]);
        if (this.animationStep >= this._getCount()-1) {
          this.trigger('end:animation');
          this._clearAnimation();
          this._initRestartPause();
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
    if (this.animationTimeoutID === undefined)
      this.animationTimeoutID = window.setTimeout(() => {
        this.animationStep = 0;
        this.trigger('restart:animation');
        if (this.animationStep < this.times.length)
          this.options.timeline.setSelectedTime(this.times[this.animationStep]);
        this._clearAnimation();
        this._initAnimation();
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
addEventFunctions(Animation.prototype);
export default Animation;

/**
 * Insert an input-group to change frequency.
 * 
 * @param {external:jQuery} node - Node to insert input-group.
 * @param {Object} options - Options for input-group.
 * @param {module:meteoJS/timeline/animation.Animation} options.animation
 *   Animation object.
 * @param {string} options.suffix - Suffix text for input-group.
 * @returns {external:jQuery} Input-group node.
 */
export function insertFrequencyInput(node, { animation, suffix = 'fps' }) {
  const number = $('<input>')
    .addClass('form-control')
    .attr('type', 'number')
    .attr('min', 1)
    .attr('step', 1);
  const inputGroupNumber = $('<div>')
    .addClass('input-group')
    .append(number)
    .append($('<span>').addClass('input-group-text').text(suffix));
  number.on('change', () => animation.setImageFrequency(number.val()));
  const onChangeImageFrequency = () => number.val(animation.getImageFrequency());
  animation.on('change:imageFrequency', onChangeImageFrequency);
  onChangeImageFrequency();
  node.append(inputGroupNumber);
  return inputGroupNumber;
}

/**
 * Insert an input-range to change frequency.
 * 
 * @param {external:jQuery} node - Node to insert input-range.
 * @param {Object} options - Options for input-range.
 * @param {module:meteoJS/timeline/animation.Animation} options.animation
 *   Animation object.
 * @param {number[]} options.frequencies - Frequencies to select.
 * @returns {external:jQuery} Input-range node.
 */
export function insertFrequencyRange(node, { animation, frequencies }) {
  frequencies = frequencies ? frequencies : [1];
  let range = $('<input>')
    .addClass('form-range')
    .attr('type', 'range')
    .attr('min', 0)
    .attr('max', frequencies.length-1);
  range.on('change input', () => {
    let i = range.val();
    if (i < frequencies.length)
      animation.setImageFrequency(frequencies[i]);
  });
  let onChangeImageFrequency = () => {
    let i = frequencies.indexOf(animation.getImageFrequency());
    if (i > -1)
      range.val(i);
  };
  animation.on('change:imageFrequency', onChangeImageFrequency);
  onChangeImageFrequency();
  node.append(range);
  return range;
}

/**
 * Insert an button-group to change frequency.
 * 
 * @param {external:jQuery} node - Node to insert the button-group.
 * @param {Object} options - Options for the button-group.
 * @param {module:meteoJS/timeline/animation.Animation} options.animation
 *   Animation object.
 * @param {number[]} options.frequencies - Frequencies to select.
 * @param {string|undefined} btnGroupClass - Class added to the button-group node.
 * @param {string|undefined} btnClass - Class added to each button.
 * @param {string} options.suffix - Suffix text for each button after frequency.
 * @returns {external:jQuery} Button-group node.
 */
export function insertFrequencyButtonGroup(node, { animation,
  frequencies,
  btnGroupClass = 'btn-group',
  btnClass = 'btn btn-primary',
  suffix = 'fps' }) {
  let btnGroup = $('<div>').addClass(btnGroupClass);
  frequencies = frequencies ? frequencies : [];
  frequencies.forEach(freq => {
    btnGroup.append($('<button>')
      .addClass(btnClass)
      .data('frequency', freq)
      .text(freq + ' ' + suffix)
      .click(() => animation.setImageFrequency(freq)));
  });
  let onChange = () => {
    btnGroup.children('button').removeClass('active').each(function () {
      if ($(this).data('frequency') == animation.getImageFrequency())
        $(this).addClass('active');
    });
  };
  animation.on('change:imageFrequency', onChange);
  onChange();
  node.append(btnGroup);
  return btnGroup;
}

/**
 * Insert an input-group to change restart pause.
 * 
 * @param {external:jQuery} node - Node to insert input-group.
 * @param {Object} options - Options for input-group.
 * @param {module:meteoJS/timeline/animation.Animation} options.animation
 *   Animation object.
 * @param {string} options.suffix - Suffix text for input-group.
 * @returns {external:jQuery} Input-group node.
 */
export function insertRestartPauseInput(node, { animation, suffix = 's' }) {
  const input = $('<input>')
    .addClass('form-control')
    .attr('type', 'number')
    .attr('min', 0)
    .attr('step', 0.1);
  const inputGroupNumber = $('<div>')
    .addClass('input-group')
    .append(input)
    .append($('<span>').addClass('input-group-text').text(suffix));
  input.on('change', () => animation.setRestartPause(input.val()));
  const onChange = () => input.val(animation.getRestartPause());
  animation.on('change:restartPause', onChange);
  onChange();
  node.append(inputGroupNumber);
  return inputGroupNumber;
}

/**
 * Insert an input-range to change restart pause.
 * 
 * @param {external:jQuery} node - Node to insert input-range.
 * @param {Object} options - Options for input-range.
 * @param {module:meteoJS/timeline/animation.Animation} options.animation
 *   Animation object.
 * @param {number[]} options.pauses - Restart pauses to select.
 * @returns {external:jQuery} Input-range node.
 */
export function insertRestartPauseRange(node, { animation, pauses }) {
  pauses = pauses ? pauses : [1];
  pauses = pauses.map(p => Math.round(p * 1000));
  let range = $('<input>')
    .addClass('form-range')
    .attr('type', 'range')
    .attr('min', 0)
    .attr('max', pauses.length-1);
  range.on('change input', () => {
    let i = range.val();
    if (i < pauses.length)
      animation.setRestartPause(pauses[i] / 1000);
  });
  let onChangeImageFrequency = () => {
    let i =
      pauses.indexOf(Math.round(animation.getRestartPause() * 1000));
    if (i > -1)
      range.val(i);
  };
  animation.on('change:imageFrequency', onChangeImageFrequency);
  onChangeImageFrequency();
  node.append(range);
  return range;
}

/**
 * Insert an button-group to change restart pause.
 * 
 * @param {external:jQuery} node - Node to insert the button-group.
 * @param {Object} options - Options for the button-group.
 * @param {module:meteoJS/timeline/animation.Animation} options.animation
 *   Animation object.
 * @param {number[]} options.pauses - Restart pauses to select.
 * @param {string|undefined} btnGroupClass - Class added to the button-group node.
 * @param {string|undefined} btnClass - Class added to each button.
 * @param {string} options.suffix - Suffix in each button after duration text.
 * @returns {external:jQuery} Button-group node.
 */
export function insertRestartPauseButtonGroup(node, { animation,
  pauses,
  btnGroupClass = 'btn-group',
  btnClass = 'btn btn-primary',
  suffix = 's' }) {
  let btnGroup = $('<div>').addClass(btnGroupClass);
  pauses = pauses ? pauses : [];
  pauses.forEach(pause => {
    btnGroup.append($('<button>')
      .addClass(btnClass)
      .data('pause', pause)
      .text(pause + ' ' + suffix)
      .click(() => animation.setRestartPause(pause)));
  });
  let onChange = () => {
    btnGroup.children('button').removeClass('active').each(function () {
      if ($(this).data('pause') == animation.getRestartPause())
        $(this).addClass('active');
    });
  };
  animation.on('change:restartPause', onChange);
  onChange();
  node.append(btnGroup);
  return btnGroup;
}