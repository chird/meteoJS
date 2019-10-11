/**
 * @module meteoJS/timeline/animation/togglebutton
 */
import $ from 'jquery';
import { insertFrequencyInput,
         insertFrequencyRange,
         insertRestartPauseInput } from '../Animation.js';

/**
 * Options for constructor.
 * 
 * @typedef {Object} meteoJS/timeline/animation/togglebutton~options
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
 * @classdesc
 * Object to style a button accordingly to the status of an animation object.
 */
export default class ToggleButton {
  
  /**
   * @param {meteoJS/timeline/animation/togglebutton~options} options Options.
   */
  constructor(options = {}) {
    let { animation = undefined,
          node = undefined,
          startedContent = undefined,
          startedClass = undefined,
          stoppedContent = undefined,
          stoppedClass = undefined,
          classButton = undefined,
          classDropdownToggle = undefined,
          menu = true,
          menuImageFrequency = true,
          imageFrequencyCaption = 'Frequency',
          menuFrequencies = undefined,
          menuRestartPause = true,
          restartPauseCaption = 'Restart pause' } = options;
    if (!('startedContent' in options))
      startedContent = '⏸';
    if (!('stoppedContent' in options))
      stoppedContent = '▶';
    /**
     * @type meteoJS/timeline/animation/togglebutton~options
     * @private
     */
    this.options = {
      animation,
      node,
      startedContent,
      startedClass,
      stoppedContent,
      stoppedClass,
      classButton,
      classDropdownToggle,
      menu,
      menuImageFrequency,
      imageFrequencyCaption,
      menuFrequencies,
      menuRestartPause,
      restartPauseCaption
    };
    
    this.options.node = $(this.options.node);
    let animationButton = this.options.node;
    if (!this.options.node.is('button')) {
      animationButton = $('<button>').addClass('btn');
      this.options.node.append(animationButton);
    }
    animationButton.addClass(this.options.classButton);
    
    let onStart = () => {
      animationButton.removeClass(this.options.stoppedClass);
      animationButton.addClass(this.options.startedClass);
      animationButton.empty();
      if (typeof this.options.startedContent === 'string' ||
          this.options.startedContent instanceof String)
        animationButton.text(this.options.startedContent);
      else
        animationButton.append(this.options.startedContent);
    };
    let onStop = () => {
      animationButton.removeClass(this.options.startedClass);
      animationButton.addClass(this.options.stoppedClass);
      animationButton.empty();
      if (typeof this.options.stoppedContent === 'string' ||
          this.options.stoppedContent instanceof String)
        animationButton.text(this.options.stoppedContent);
      else
        animationButton.append(this.options.stoppedContent);
    };
    this.options.animation.on('start:animation', onStart);
    this.options.animation.on('stop:animation', onStop);
    animationButton.click(() => this.options.animation.toggle());
    this.options.animation.isStarted() ? onStart() : onStop();
    
    if (!this.options.node.is('button') &&
        this.options.menu) {
      // Add dropdown menu
      let btnGroup = this.options.node.addClass('btn-group');
      let btnDropdown = $('<button>')
        .attr('type', 'button')
        .addClass('btn dropdown-toggle dropdown-toggle-split')
        .addClass(this.options.classDropdownToggle)
        .attr('data-toggle', 'dropdown')
        .attr('aria-haspopup', true)
        .attr('aria-expanded', false);
      btnDropdown.append($('<span>').addClass('sr-only').text('Toggle Dropdown'));
      this.options.node.append(btnDropdown);
      let menuDropdown = $('<div>').addClass('dropdown-menu pl-4 pr-4 pt-2 pb-2 text-muted');
      this.options.node.append(menuDropdown);
      
      if (this.options.menuImageFrequency) {
        let label = $('<label>').text(this.options.imageFrequencyCaption);
        let div = $('<div>').addClass('form-group').append(label);
        menuDropdown.append(div);
        insertFrequencyInput(label, {
          animation: this.options.animation
        });
        if (this.options.menuFrequencies !== undefined)
          insertFrequencyRange(div, {
            animation: this.options.animation,
            frequencies: this.options.menuFrequencies
          });
      }
      
      if (this.options.menuRestartPause) {
        let label = $('<label>').text(this.options.restartPauseCaption);
        let div = $('<div>').addClass('form-group').append(label);
        insertRestartPauseInput(label, {
          animation: this.options.animation
        });
        menuDropdown.append(div);
      }
    }
  }
  
}