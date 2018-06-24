/**
 * @module meteoJS/timeline/visualisation/slider
 */

/**
 * Options for meteoJS/timeline/visualisation/slider.
 * 
 * @typedef {Object} meteoJS/timeline/visualisation/slider~options
 * @param {jQuery} node Input[type=range] node.
 * @param {boolean} enabledStepsOnly XXX.
 * @param {boolean} allEnabledStepsOnly XXX.
 */

/**
 * Show timeline as a slider.
 * 
 * @constructor
 * @param {meteoJS.timeline} timeline Timeline object.
 * @param {meteoJS/timeline/visualisation/slider~options} options Options.
 * @extends meteoJS.timeline.visualisation
 */
meteoJS.timeline.visualisation.slider = function (timeline, options) {
  /**
   * Timeline object.
   * @member {meteoJS.timeline}
   */
  this.timeline = timeline;
  
  /**
   * Options.
   * @member {meteoJS/timeline/visualisation/slider~options}
   */
  this.options = $.extend(true, {
    node: undefined,
    enabledStepsOnly: true,
    allEnabledStepsOnly: false
  }, options);
  
  /** @member {moment[]} */
  this.times = [];
  /** @member {Object} */
  this.timesIndexes = {};
  
  // Slider initialisieren
  this.options.node.prop('min', 1);
  this.options.node.prop('step', 1);
  var that = this;
  this.options.node.on('change input', function () {
    var i = +$(this).val();
    if (0 < i &&
        i <= that.times.length)
      that.timeline.setSelectedTime(that.times[i-1]);
    //that.trigger('interaction');
  });
  
  var timelineChangeTimeEvent =
    (this.options.enabledStepsOnly || this.options.allEnabledStepsOnly) ?
      'change:enabledTimes' : 'change:times';
  var timelineTimesMethod =
    this.options.allEnabledStepsOnly ? 'getAllEnabledTimes' :
      this.options.enabledStepsOnly ? 'getEnabledTimes' : 'getTimes';
  this.timeline.on('change:time', function () {
    var t = this.timeline.getSelectedTime();
    if (t.valueOf() in this.timesIndexes)
      this.options.node.val(this.timesIndexes[t.valueOf()]+1);
    else
      this.options.node.val(1);
  }, this);
  this.timeline.on(timelineChangeTimeEvent, function () {
    this.times = this.timeline[timelineTimesMethod]();
    this.timesIndexes = {};
    this.times.forEach(function (time, i) {
      this.timesIndexes[time.valueOf()] = i;
    }, this);
    this.options.node.prop('max', this.times.length);
  }, this);
  this.timeline.trigger(timelineChangeTimeEvent);
  this.timeline.trigger('change:time');
};