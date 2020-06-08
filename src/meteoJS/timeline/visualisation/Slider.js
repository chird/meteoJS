/**
 * @module meteoJS/timeline/visualisation/slider
 */

import $ from 'jquery';
import Visualisation from '../Visualisation.js';

/**
 * Options for constructor.
 * 
 * @typedef {module:meteoJS/timeline/visualisation~options}
     module:meteoJS/timeline/visualisation/slider~options
 */

/**
 * Show timeline as a slider.
 * 
 * @extends module:meteoJS/timeline/visualisation.Visualisation
 */
export class Slider extends Visualisation {
  
  /**
   * @param {module:meteoJS/timeline/visualisation/slider~options} options
   *   Options.
   */
  constructor(options) {
    super(options);
    
    /**
     * @member {moment[]}
     * @private
     */
    this.times = [];
    /**
     * @member {Object}
     * @private
     */
    this.timesIndexes = {};
    
    this.setNode(this.options.node);
  }
  
  /**
   * @inheritdoc
   */
  onChangeTime() {
    var t = this.options.timeline.getSelectedTime();
    if (t.valueOf() in this.timesIndexes)
      this.options.node.val(this.timesIndexes[t.valueOf()]+1);
    else
      this.options.node.val(1);
  }
  
  /**
   * @inheritdoc
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
   * @inheritdoc
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
export default Slider;