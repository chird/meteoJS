/**
 * @module meteoJS/timeline/animation/button
 */

/**
 * Options for constructor.
 * 
 * @typedef {Object} meteoJS/timeline/animation/button~options
 * @param {meteoJS.timeline.animation} animation Animation object.
 * @param {jQuery} node Button node.
 * @param {string|jQuery|undefined} startedContent
 *   Content or text of button node if animation is running.
 * @param {string|undefined} startedClass
 *   Classed added to button node if animation is running.
 * @param {string|jQuery|undefined} stoppedContent
 *   Content of button node if animation is stopped.
 * @param {string|undefined} stoppedClass
 *   Classed added to button node if animation is running.
 */

/**
 * Object to style a button accordingly to the status of an animation object.
 * 
 * @class
 * @param {meteoJS/timeline/animation/button~options} options Options.
 */
meteoJS.timeline.animation.button = function (options) {
  if (!('startedContent' in options))
    options.startedContent = '⏸';
  if (!('stoppedContent' in options))
    options.stoppedContent = '▶';
  /**
   * Options.
   * @member {meteoJS/timeline/animation/button~options}
   * @private
   */
  this.options = $.extend(true, {
    animation: undefined,
    node: undefined,
    startedContent: undefined,
    startedClass: undefined,
    stoppedContent: undefined,
    stoppedClass: undefined
  }, options);
  
  var onStart = function () {
    this.options.node.removeClass(this.options.stoppedClass);
    this.options.node.addClass(this.options.startedClass);
    this.options.node.empty();
    if (typeof this.options.startedContent === 'string' ||
        this.options.startedContent instanceof String)
      this.options.node.text(this.options.startedContent);
    else
      this.options.node.append(this.options.startedContent);
  };
  var onStop = function () {
    this.options.node.removeClass(this.options.startedClass);
    this.options.node.addClass(this.options.stoppedClass);
    this.options.node.empty();
    if (typeof this.options.stoppedContent === 'string' ||
        this.options.stoppedContent instanceof String)
      this.options.node.text(this.options.stoppedContent);
    else
      this.options.node.append(this.options.stoppedContent);
  };
  this.options.animation.on('start:animation', onStart, this);
  this.options.animation.on('stop:animation', onStop, this);
  var that = this;
  this.options.node.click(function () {
    that.options.animation.toggle();
  });
  this.options.animation.isStarted() ? onStart.call(this) : onStop.call(this);
};