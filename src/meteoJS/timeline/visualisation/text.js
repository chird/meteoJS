/**
 * @module meteoJS/timeline/visualisation/text
 */

/**
 * Options for meteoJS/timeline/visualisation/text.
 * 
 * @typedef {Object} meteoJS/timeline/visualisation/text~options
 * @augments meteoJS/timeline/visualisation~options
 * @param {string|undefined} format Format string, used for {@link moment.format}.
 */

/**
 * Show current selected time of a timeline as text.
 * 
 * @constructor
 * @augments meteoJS/timeline/visualisation
 * @param {meteoJS/timeline/visualisation/text~options} options Options.
 * @requires moment.js
 * @requires moment-timezone.js (if option outputTimezone is used)
 */
meteoJS.timeline.visualisation.text = function (options) {
  options = $.extend(true, {
    format: undefined,
  }, options);
  
  meteoJS.timeline.visualisation.call(this, options);
  this.setNode(this.options.node);
};
meteoJS.timeline.visualisation.text.prototype =
  Object.create(meteoJS.timeline.visualisation.prototype);
meteoJS.timeline.visualisation.text.prototype.constructor =
  meteoJS.timeline.visualisation.text;

/**
 * @augments meteoJS.timeline.visualisation.onChangeTime
 */
meteoJS.timeline.visualisation.text.prototype.onChangeTime = function () {
  this.options.node.text(
    this.timeToText(this.options.timeline.getSelectedTime(),
                    this.options.format));
};

/**
 * @augments meteoJS.timeline.visualisation.emptyNode
 */
meteoJS.timeline.visualisation.prototype.emptyNode = function () {
  this.options.node.text('');
};