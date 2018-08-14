/**
 * @module meteoJS/timeline/animation/button
 */

/**
 * Options for constructor.
 * 
 * @typedef {Object} meteoJS/timeline/animation/button~options
 * @param {meteoJS.timeline.animation} animation Animation object.
 * @param {jQuery} node
 *   Node to append the button and the dropdown menu (if menu set to true).
 *   If this is a 'button' element, this will be the animation button and
 *   no menu is added.
 * @param {string|jQuery|undefined} startedContent
 *   Content or text of button node if animation is running.
 * @param {string|undefined} startedClass
 *   Classed added to button node if animation is running.
 * @param {string|jQuery|undefined} stoppedContent
 *   Content of button node if animation is stopped.
 * @param {string|undefined} stoppedClass
 *   Classed added to button node if animation is running.
 * @param {string|undefined} classButton
 *   Classed added to button node.
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
    stoppedClass: undefined,
    classButton: undefined
  }, options);
  
  var animationButton = this.options.node;
  if (!this.options.node.is('button')) {
    animationButton = $('<button>').addClass('btn');
    this.options.node.append(animationButton);
  }
  animationButton.addClass(this.options.classButton);
  
  var onStart = function () {
    animationButton.removeClass(this.options.stoppedClass);
    animationButton.addClass(this.options.startedClass);
    animationButton.empty();
    if (typeof this.options.startedContent === 'string' ||
        this.options.startedContent instanceof String)
      animationButton.text(this.options.startedContent);
    else
      animationButton.append(this.options.startedContent);
  };
  var onStop = function () {
    animationButton.removeClass(this.options.startedClass);
    animationButton.addClass(this.options.stoppedClass);
    animationButton.empty();
    if (typeof this.options.stoppedContent === 'string' ||
        this.options.stoppedContent instanceof String)
      animationButton.text(this.options.stoppedContent);
    else
      animationButton.append(this.options.stoppedContent);
  };
  this.options.animation.on('start:animation', onStart, this);
  this.options.animation.on('stop:animation', onStop, this);
  var that = this;
  animationButton.click(function () {
    that.options.animation.toggle();
  });
  this.options.animation.isStarted() ? onStart.call(this) : onStop.call(this);
};