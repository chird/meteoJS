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
 * @param {boolean} menu
 *   Add dropdown menu for animation setup to the button. Ignored, if node is a
 *   button element.
 * @param {boolean} menuImageFrequency
 *   Show frequency configuration in the dropdown menu.
 * @param {string} imageFrequencyCaption
 *   Label text for the frequency configuration in the dropdown menu.
 * @param {undefined|integer[]} menuFrequencies
 *   Array of frequencies for the range slider. If undefined the slider will be
 *   hidden.
 * @param {boolean} menuRestartPause
 *   Show restart pause configuration in the dropdown menu.
 * @param {string} restartPauseCaption
 *   Label text for the restart pause configuration in the dropdown menu.
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
    classButton: undefined,
    classDropdownToggle: undefined,
    menu: true,
    menuImageFrequency: true,
    imageFrequencyCaption: 'Frequency',
    menuFrequencies: undefined,
    menuRestartPause: true,
    restartPauseCaption: 'Restart pause'
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
  
  if (!this.options.node.is('button') &&
      this.options.menu) {
    // Add dropdown menu
    var btnGroup = this.options.node.addClass('btn-group');
    var btnDropdown = $('<button>')
      .attr('type', 'button')
      .addClass('btn dropdown-toggle dropdown-toggle-split')
      .addClass(this.options.classDropdownToggle)
      .attr('data-toggle', 'dropdown')
      .attr('aria-haspopup', true)
      .attr('aria-expanded', false);
    btnDropdown.append($('<span>').addClass('sr-only').text('Toggle Dropdown'));
    this.options.node.append(btnDropdown);
    var menuDropdown = $('<div>').addClass('dropdown-menu pl-4 pr-4 pt-2 pb-2 text-muted');
    this.options.node.append(menuDropdown);
    
    if (this.options.menuImageFrequency) {
      var label = $('<label>').text(this.options.imageFrequencyCaption);
      var div = $('<div>').addClass('form-group').append(label);
      menuDropdown.append(div);
      meteoJS.timeline.animation.button.insertFrequencyInput(label, {
        animation: this.options.animation
      });
      if (this.options.menuFrequencies !== undefined)
        meteoJS.timeline.animation.button.insertFrequencyRange(div, {
          animation: this.options.animation,
          frequencies: this.options.menuFrequencies
        });
    }
    
    if (this.options.menuRestartPause) {
      var label = $('<label>').text(this.options.restartPauseCaption);
      var div = $('<div>').addClass('form-group').append(label);
      meteoJS.timeline.animation.button.insertRestartPauseInput(label, {
        animation: this.options.animation
      });
      menuDropdown.append(div);
    }
  }
};

/**
 * Insert an input-group to change frequency.
 * 
 * @param {jQuery} node Node to insert input-group.
 * @param {Object} options Options for input-group.
 * @param {meteoJS.timeline.animation} options.animation Animation object.
 * @param {string} options.suffix Suffix text for input-group.
 * @returns {jQuery} Input-group node.
 */
meteoJS.timeline.animation.button.insertFrequencyInput = function (node, options) {
  options = $.extend(true, {
    animation: undefined,
    suffix: 'fps'
  }, options);
  var number = $('<input>')
    .addClass('form-control')
    .attr('type', 'number')
    .attr('min', 1)
    .attr('step', 1);
  var inputGroupNumber = $('<div>')
    .addClass('input-group')
    .append(number)
    .append($('<div>')
      .addClass('input-group-append')
      .append($('<span>').addClass('input-group-text').text(options.suffix)));
  number.on('change', (function () {
    options.animation.setImageFrequency(number.val());
  }).bind(this));
  var onChangeImageFrequency = (function () {
    number.val(options.animation.getImageFrequency());
  }).bind(this);
  options.animation.on('change:imageFrequency', onChangeImageFrequency);
  onChangeImageFrequency();
  node.append(inputGroupNumber);
  return inputGroupNumber;
};

/**
 * Insert an input-range to change frequency.
 * 
 * @param {jQuery} node Node to insert input-range.
 * @param {Object} options Options for input-range.
 * @param {meteoJS.timeline.animation} options.animation Animation object.
 * @param {number[]} options.frequencies Frequencies to select.
 * @returns {jQuery} Input-range node.
 */
meteoJS.timeline.animation.button.insertFrequencyRange = function (node, options) {
  options = $.extend(true, {
    animation: undefined,
    frequencies: undefined
  }, options);
  var frequencies = options.frequencies ? options.frequencies : [1];
  var range = $('<input>')
    .addClass('custom-range')
    .attr('type', 'range')
    .attr('min', 0)
    .attr('max', frequencies.length-1);
  range.on('change input', function () {
    var i = range.val();
    if (i < frequencies.length)
      options.animation.setImageFrequency(frequencies[i]);
  });
  var onChangeImageFrequency = function () {
    var i = frequencies.indexOf(options.animation.getImageFrequency());
    if (i > -1)
      range.val(i);
  };
  options.animation.on('change:imageFrequency', onChangeImageFrequency);
  onChangeImageFrequency();
  node.append(range);
  return range;
};

/**
 * Insert an button-group to change frequency.
 * 
 * @param {jQuery} node Node to insert the button-group.
 * @param {Object} options Options for the button-group.
 * @param {meteoJS.timeline.animation} options.animation Animation object.
 * @param {number[]} options.frequencies Frequencies to select.
 * @param {string|undefined} btnGroupClass Class added to the button-group node.
 * @param {string|undefined} btnClass Class added to each button.
 * @param {string} options.suffix Suffix text for each button after frequency.
 * @returns {jQuery} Button-group node.
 */
meteoJS.timeline.animation.button.insertFrequencyButtonGroup = function (node, options) {
  options = $.extend(true, {
    animation: undefined,
    frequencies: undefined,
    btnGroupClass: 'btn-group',
    btnClass: 'btn btn-primary',
    suffix: 'fps'
  }, options);
  var btnGroup = $('<div>').addClass(options.btnGroupClass);
  var frequencies = options.frequencies ? options.frequencies : [];
  frequencies.forEach(function (freq) {
    btnGroup.append($('<button>')
      .addClass(options.btnClass)
      .data('frequency', freq)
      .text(freq + ' ' + options.suffix)
      .click(function () {
        options.animation.setImageFrequency(freq);
      }));
  });
  var onChange = function () {
    btnGroup.children('button').removeClass('active').each(function () {
      if ($(this).data('frequency') == options.animation.getImageFrequency())
        $(this).addClass('active');
    });
  };
  options.animation.on('change:imageFrequency', onChange);
  onChange();
  node.append(btnGroup);
  return btnGroup;
};

/**
 * Insert an input-group to change restart pause.
 * 
 * @param {jQuery} node Node to insert input-group.
 * @param {Object} options Options for input-group.
 * @param {meteoJS.timeline.animation} options.animation Animation object.
 * @param {string} options.suffix Suffix text for input-group.
 * @returns {jQuery} Input-group node.
 */
meteoJS.timeline.animation.button.insertRestartPauseInput = function (node, options) {
  options = $.extend(true, {
    animation: undefined,
    suffix: 's'
  }, options);
  var input = $('<input>')
    .addClass('form-control')
    .attr('type', 'number')
    .attr('min', 0)
    .attr('step', 0.1);
  var inputGroupNumber = $('<div>')
    .addClass('input-group')
    .append(input)
    .append($('<div>')
      .addClass('input-group-append')
      .append($('<span>').addClass('input-group-text').text(options.suffix)));
  input.on('change', function () {
    options.animation.setRestartPause(input.val());
  });
  var onChange = function () {
    input.val(options.animation.getRestartPause());
  };
  options.animation.on('change:restartPause', onChange);
  onChange();
  node.append(inputGroupNumber);
  return inputGroupNumber;
};

/**
 * Insert an button-group to change restart pause.
 * 
 * @param {jQuery} node Node to insert the button-group.
 * @param {Object} options Options for the button-group.
 * @param {meteoJS.timeline.animation} options.animation Animation object.
 * @param {number[]} options.pauses Restart pauses to select.
 * @param {string|undefined} btnGroupClass Class added to the button-group node.
 * @param {string|undefined} btnClass Class added to each button.
 * @param {string} options.suffix Suffix in each button after duration text.
 * @returns {jQuery} Button-group node.
 */
meteoJS.timeline.animation.button.insertRestartPauseButtonGroup = function (node, options) {
  options = $.extend(true, {
    animation: undefined,
    pauses: undefined,
    btnGroupClass: 'btn-group',
    btnClass: 'btn btn-primary',
    suffix: 's'
  }, options);
  var btnGroup = $('<div>').addClass(options.btnGroupClass);
  var pauses = options.pauses ? options.pauses : [];
  pauses.forEach(function (pause) {
    btnGroup.append($('<button>')
      .addClass(options.btnClass)
      .data('pause', pause)
      .text(pause + ' ' + options.suffix)
      .click(function () {
        options.animation.setRestartPause(pause);
      }));
  });
  var onChange = function () {
    btnGroup.children('button').removeClass('active').each(function () {
      if ($(this).data('pause') == options.animation.getRestartPause())
        $(this).addClass('active');
    });
  };
  options.animation.on('change:restartPause', onChange);
  onChange();
  node.append(btnGroup);
  return btnGroup;
};