/**
 * @module meteoJS/timeline/visualisation/text
 */

/**
 * Options for meteoJS/timeline/visualisation/text.
 * 
 * @typedef {Object} meteoJS/timeline/visualisation/text~options
 * @param {jQuery} node Output node.
 * @param {meteoJS.timeline} timeline Timeline object.
 * @param {string|undefined} format Format string, used for {@link moment.format}.
 * @param {string} textInvalid Output string, if time of timeline is invalid.
 * @param {string|undefined} outputTimezone 'local' for browser local timezone.
 *   If not undefined, moment-timezone is required.
 */

/**
 * Show current selected time of a timeline as text.
 * 
 * @constructor
 * @param {meteoJS/timeline/visualisation/text~options} options Options.
 * @extends meteoJS.timeline.visualisation
 * @requires moment.js
 * @requires moment-timezone.js (if option outputTimezone is used)
 */
meteoJS.timeline.visualisation.text = function (options) {
  /**
   * Options.
   * @member {meteoJS/timeline/visualisation/text~options}
   */
  this.options = $.extend(true, {
    node: undefined,
    timeline: undefined,
    format: undefined,
    textInvalid: '-',
    outputTimezone: undefined
  }, options);
  // Normalize options
  if (this.options.timeline === undefined)
    this.options.timeline = new meteoJS.timeline();
  
  /**
   * @type {undefined|mixed}
   */
  this.listenerKey = undefined;
  
  this.setNode(this.options.node);
};

/**
 * Sets jQuery-Node for text output.
 * 
 * @param {jQuery} node Node.
 * @returns {meteoJS.timeline.visualisation.text} This.
 */
meteoJS.timeline.visualisation.text.prototype.setNode = function (node) {
  // Delete text if node is changed/deleted
  if (this.options.node !== undefined)
    this.options.node.text('');
  this.options.node = node;
  
  if (this.options.node === undefined) {
    if (this.listenerKey !== undefined)
      this.options.timeline.un(this.listenerKey);
  }
  else {
    if (this.listenerKey === undefined)
      this.listenerKey = this.options.timeline.on('change:time', function () {
        this._setText();
      }, this);
    this._setText();
  }
  return this;
};

/**
 * @private
 */
meteoJS.timeline.visualisation.text.prototype._setText = function () {
  var t = this.options.timeline.getSelectedTime();
  if (isNaN(t)) {
    this.options.node.text(this.options.textInvalid);
    return;
  }
  var m = moment.utc(t);
  if (this.options.outputTimezone !== undefined)
    (this.options.outputTimezone == 'local') ?
      m.local() : m.tz(this.options.outputTimezone);
  this.options.node.text(m.format(this.options.format));
};