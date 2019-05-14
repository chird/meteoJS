/**
 * @module meteoJS/timeline/visualisation/slider
 */

import $ from 'jquery';
import Visualisation from '../Visualisation.js';

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
export default class Slider extends Visualisation {

constructor(options) {
  super(options);
  
  /** @member {moment[]} */
  this.times = [];
  /** @member {Object} */
  this.timesIndexes = {};
  
  this.setNode(this.options.node);
}

/**
 * @augments meteoJS.timeline.visualisation.onChangeTime
 */
onChangeTime() {
  var t = this.options.timeline.getSelectedTime();
  if (t.valueOf() in this.timesIndexes)
    this.options.node.val(this.timesIndexes[t.valueOf()]+1);
  else
    this.options.node.val(1);
}

/**
 * @augments meteoJS.timeline.visualisation.onChangeTimes
 */
onChangeTimes() {
  this.times = this.getTimelineTimes();
  this.timesIndexes = {};
  this.times.forEach(function (time, i) {
    this.timesIndexes[time.valueOf()] = i;
  }, this);
  this.options.node.prop('max', this.times.length);
}

/**
 * @augments meteoJS.timeline.visualisation.onInitNode
 */
onInitNode(isListenersDefined) {
  this.options.node.prop('min', 1);
  this.options.node.prop('step', 1);
  if (!isListenersDefined) {
    var that = this;
    this.attachEventListener(this.options.node, 'change input', function () {
      var i = +$(this).val();
      if (0 < i &&
          i <= that.times.length)
        that.options.timeline.setSelectedTime(that.times[i-1]);
      that.trigger('input');
    });
  }
}

}