/**
 * @module meteoJS/timeline/visualisation/slider
 */

/**
 * Options for meteoJS/timeline/visualisation/slider.
 * 
 * @typedef {Object} meteoJS/timeline/visualisation/slider~options
 * @param {jQuery} node Input[type=range] node.
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
    node: undefined
  }, options);
  
  /** @member {moment[]} */
  this.enabledTimes = [];
  /** @member {Object} */
  this.enabledTimesIndexes = {};
  
  // Slider initialisieren
  this.options.node.prop('min', 1);
  this.options.node.prop('step', 1);
  var that = this;
  this.options.node.on('change input', function () {
    var i = +$(this).val();
    if (0 < i &&
        i <= that.enabledTimes.length)
      that.timeline.setSelectedTime(that.enabledTimes[i-1]);
    //that.trigger('interaction');
  });
  
  this.timeline.on('change:time', function () {
    var t = this.timeline.getSelectedTime();
    if (t.valueOf() in this.enabledTimesIndexes)
      this.options.node.val(this.enabledTimesIndexes[t.valueOf()]+1);
    else
      this.options.node.val(1);
  }, this);
  this.timeline.on('change:enabledTimes', function () {
    this.enabledTimes = this.timeline.getEnabledTimes();
    this.enabledTimesIndexes = {};
    this.enabledTimes.forEach(function (time, i) {
      this.enabledTimesIndexes[time.valueOf()] = i;
    }, this);
    this.options.node.prop('max', this.enabledTimes.length);
  }, this);
  this.timeline.trigger('change:enabledTimes');
  this.timeline.trigger('change:time');
};