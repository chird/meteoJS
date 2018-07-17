/**
 * @module meteoJS/timeline/visualisation/slider
 */

/**
 * Options for meteoJS/timeline/visualisation/slider.
 * 
 * @typedef {Object} meteoJS/timeline/visualisation/slider~options
 * @augments meteoJS/timeline/visualisation~options
 */

/**
 * Show timeline as a slider.
 * 
 * @constructor
 * @augments meteoJS/timeline/visualisation
 * @param {meteoJS/timeline/visualisation/slider~options} options Options.
 */
meteoJS.timeline.visualisation.slider = function (options) {
  /** @member {moment[]} */
  this.times = [];
  /** @member {Object} */
  this.timesIndexes = {};
  
  meteoJS.timeline.visualisation.call(this, options);
  this.setNode(this.options.node);
};
meteoJS.timeline.visualisation.slider.prototype =
  Object.create(meteoJS.timeline.visualisation.prototype);
meteoJS.timeline.visualisation.slider.prototype.constructor =
  meteoJS.timeline.visualisation.slider;

/**
 * @augments meteoJS.timeline.visualisation.onChangeTime
 */
meteoJS.timeline.visualisation.slider.prototype.onChangeTime = function () {
  var t = this.options.timeline.getSelectedTime();
  if (t.valueOf() in this.timesIndexes)
    this.options.node.val(this.timesIndexes[t.valueOf()]+1);
  else
    this.options.node.val(1);
};

/**
 * @augments meteoJS.timeline.visualisation.onChangeTimes
 */
meteoJS.timeline.visualisation.slider.prototype.onChangeTimes = function () {
  this.times = this.getTimelineTimes();
  this.timesIndexes = {};
  this.times.forEach(function (time, i) {
    this.timesIndexes[time.valueOf()] = i;
  }, this);
  this.options.node.prop('max', this.times.length);
};

/**
 * @augments meteoJS.timeline.visualisation.onInitNode
 */
meteoJS.timeline.visualisation.slider.prototype.onInitNode = function (isListenersDefined) {
  this.options.node.prop('min', 1);
  this.options.node.prop('step', 1);
  if (!isListenersDefined) {
    var that = this;
    this.attachEventListener(this.options.node, 'change input', function () {
      var i = +$(this).val();
      if (0 < i &&
          i <= that.times.length)
        that.options.timeline.setSelectedTime(that.times[i-1]);
      //that.trigger('interaction');
    });
  }
};