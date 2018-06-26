/**
 * @module meteoJS/timeline/visualisation/text
 */

/**
 * Options for meteoJS/timeline/visualisation/text.
 * 
 * @typedef {Object} meteoJS/timeline/visualisation/text~options
 * @param {jQuery} node Output node.
 * @param {string|undefined} format Format string, used for {@link moment.format}.
 * @param {string} textInvalid Output string, if time of timeline is invalid.
 * @param {boolean} outputLocal 
 * @param {string|undefined} outputTimezone Needs moment-timezone.
 */

/**
 * Show current selected time of a timeline as text.
 * 
 * @constructor
 * @param {meteoJS.timeline} timeline Timeline object.
 * @param {meteoJS/timeline/visualisation/text~options} options Options.
 * @extends meteoJS.timeline.visualisation
 * @requires moment.js
 * @requires moment-timezone.js (if option outputTimezone is used)
 */
meteoJS.timeline.visualisation.text = function (timeline, options) {
  /**
   * Timeline object.
   * @member {meteoJS.timeline}
   */
  this.timeline = timeline;
  
  /**
   * Options.
   * @member {meteoJS/timeline/visualisation/text~options}
   */
  this.options = $.extend(true, {
    node: undefined,
    format: undefined,
    textInvalid: '-',
    outputLocal: false,
    outputTimezone: undefined
  }, options);
  
  var setText = function () {
    var t = this.timeline.getSelectedTime();
    var m = moment.utc(t);
    if (this.options.outputLocal)
      m.local();
    else if (this.options.outputTimezone !== undefined)
      m.tz(this.options.outputTimezone);
    this.options.node.text(isNaN(t) ?
      this.options.textInvalid :
      m.format(this.options.format)
    );
  };
  this.timeline.on('change:time', function () {
    setText.call(this);
  }, this);
  setText.call(this);
};