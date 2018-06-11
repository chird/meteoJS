/**
 * @module meteoJS/timeline/visualisation/text
 */

/**
 * Options for meteoJS/timeline/visualisation/text.
 * 
 * @typedef {Object} meteoJS/timeline/visualisation/text~options
 * @param {jQuery} node Output node.
 * @param {text|undefined} format Format string, used for {@link moment.format}.
 */

/**
 * Show current selected time of a timeline as text.
 * 
 * @constructor
 * @param {meteoJS.timeline} timeline Timeline object.
 * @param {meteoJS/timeline/visualisation/text~options} options Options.
 * @extends meteoJS.timeline.visualisation
 * @requires moment.js
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
    format: undefined
  }, options);
  
  this.timeline.on('change:time', function () {
    this.options.node.text(
      moment(this.timeline.getSelectedTime())
        .format(this.options.format)
    );
  }, this);
  this.timeline.trigger('change:time');
};