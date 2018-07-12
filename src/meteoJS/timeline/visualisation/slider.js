/**
 * @module meteoJS/timeline/visualisation/slider
 */

/**
 * Options for meteoJS/timeline/visualisation/slider.
 * 
 * @typedef {Object} meteoJS/timeline/visualisation/slider~options
 * @param {jQuery} node Input[type=range] node.
 * @param {meteoJS.timeline} timeline Timeline object.
 * @param {boolean} enabledStepsOnly Use only enabled times.
 * @param {boolean} allEnabledStepsOnly
 *   Use only times that are enabled by all sets of time.
 */

/**
 * Show timeline as a slider.
 * 
 * @constructor
 * @param {meteoJS/timeline/visualisation/slider~options} options Options.
 * @extends meteoJS.timeline.visualisation
 */
meteoJS.timeline.visualisation.slider = function (options) {
  /**
   * Options.
   * @member {meteoJS/timeline/visualisation/slider~options}
   */
  this.options = $.extend(true, {
    node: undefined,
    timeline: undefined,
    enabledStepsOnly: true,
    allEnabledStepsOnly: false
  }, options);
  // Normalize options
  if (this.options.timeline === undefined)
    this.options.timeline = new meteoJS.timeline();
  
  /** @member {moment[]} */
  this.times = [];
  /** @member {Object} */
  this.timesIndexes = {};
  /** @member {Object} */
  this.timelineNames = {
    changeTimesEvent:
      (this.options.enabledStepsOnly || this.options.allEnabledStepsOnly) ?
        'change:enabledTimes' : 'change:times',
    timesMethod:
      this.options.allEnabledStepsOnly ?
        'getAllEnabledTimes' :
        this.options.enabledStepsOnly ? 'getEnabledTimes' : 'getTimes'
  };
  /** @member {Object} */
  this.listenerKeys = {
    time: undefined,
    times: undefined,
    input: undefined
  };
  
  this.setNode(this.options.node);
};

/**
 * Sets jQuery-Node for text output.
 * 
 * @param {jQuery} node Input[type=range] node.
 * @returns {meteoJS.timeline.visualisation.slider} This.
 */
meteoJS.timeline.visualisation.slider.prototype.setNode = function (node) {
  this.options.node = node;
  
  if (this.options.node === undefined) {
    if (this.listenerKeys.time !== undefined)
      this.options.timeline.un(this.listenerKeys.time);
    if (this.listenerKeys.times !== undefined)
      this.options.timeline.un(this.listenerKeys.times);
    if (this.listenerKeys.input !== undefined)
      this.options.timeline.un(this.listenerKeys.input);
  }
  else {
    this.options.node.prop('min', 1);
    this.options.node.prop('step', 1);
    var that = this;
    if (this.listenerKeys.input === undefined)
      this.listenerKeys.input = this.options.node.on('change input', function () {
        var i = +$(this).val();
        if (0 < i &&
            i <= that.times.length)
          that.options.timeline.setSelectedTime(that.times[i-1]);
        //that.trigger('interaction');
      });
    if (this.listenerKeys.time === undefined)
      this.listenerKeys.time = this.options.timeline.on('change:time', function () {
        this._onChangeTime();
      }, this);
    if (this.listenerKeys.times === undefined)
      this.listenerKeys.times = this.options.timeline.on(this.timelineNames.changeTimesEvent, function () {
        this._onChangeTimes();
      }, this);
    this._onChangeTimes();
    this._onChangeTime();
  }
  return this;
};

/**
 * @private
 */
meteoJS.timeline.visualisation.slider.prototype._onChangeTime = function () {
  var t = this.options.timeline.getSelectedTime();
  if (t.valueOf() in this.timesIndexes)
    this.options.node.val(this.timesIndexes[t.valueOf()]+1);
  else
    this.options.node.val(1);
};

/**
 * @private
 */
meteoJS.timeline.visualisation.slider.prototype._onChangeTimes = function () {
  this.times = this.options.timeline[this.timelineNames.timesMethod]();
  this.timesIndexes = {};
  this.times.forEach(function (time, i) {
    this.timesIndexes[time.valueOf()] = i;
  }, this);
  this.options.node.prop('max', this.times.length);
};