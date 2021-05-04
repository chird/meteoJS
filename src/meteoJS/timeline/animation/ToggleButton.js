/**
 * @module meteoJS/timeline/animation/togglebutton
 */
import $ from 'jquery';
import { insertFrequencyInput,
  insertFrequencyRange,
  insertRestartPauseInput } from '../Animation.js';
import biPlayFill from 'bootstrap-icons/icons/play-fill.svg';
import biPauseFill from 'bootstrap-icons/icons/pause-fill.svg';

/**
 * Options for constructor.
 * 
 * @typedef {Object} module:meteoJS/timeline/animation/togglebutton~options
 * @param {module:meteoJS/timeline/animation.Animation} animation Animation object.
 * @param {external:HTMLElement} node
 *   Node to append the button and the dropdown menu (if menu set to true).
 *   If this is a 'button' element, this will be the animation button and
 *   no menu is added.
 * @param {string|external:HTMLElement|undefined} [startedContent]
 *   Content or text of button node if animation is running.
 *   Default ist the Bootstrap
 *   {@link https://icons.getbootstrap.com/icons/pause-fill/|pause-fill} Icon.
 * @param {string|undefined} [startedClass]
 *   Classed added to button node if animation is running.
 * @param {string|external:HTMLElement|undefined} [stoppedContent]
 *   Content of button node if animation is stopped.
 *   Default ist the Bootstrap
 *   {@link https://icons.getbootstrap.com/icons/play-fill/|play-fill} Icon.
 * @param {string|undefined} [stoppedClass]
 *   Classed added to button node if animation is running.
 * @param {string|undefined} [classButton]
 *   Classed added to button node.
 * @param {boolean} [menu=true]
 *   Add dropdown menu for animation setup to the button. Ignored, if node is a
 *   button element.
 * @param {boolean} [menuImageFrequency=true]
 *   Show frequency configuration in the dropdown menu.
 * @param {string} [imageFrequencyCaption='Frequency']
 *   Label text for the frequency configuration in the dropdown menu.
 * @param {undefined|integer[]} [menuFrequencies]
 *   Array of frequencies for the range slider. If undefined the slider will be
 *   hidden.
 * @param {boolean} [menuRestartPause=true]
 *   Show restart pause configuration in the dropdown menu.
 * @param {string} [restartPauseCaption='Restart pause']
 *   Label text for the restart pause configuration in the dropdown menu.
 */

/**
 * @classdesc
 * Object to style a button accordingly to the status of an animation object.
 * 
 * <pre><code>import ToggleButton from 'meteojs/timeline/animation/ToggleButton';</code></pre>
 */
export class ToggleButton {
  
  /**
   * @param {module:meteoJS/timeline/animation/togglebutton~options} options Options.
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
      startedContent = $(biPauseFill);
    if (!('stoppedContent' in options))
      stoppedContent = $(biPlayFill);
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
      this.options.node.addClass('btn-group');
      let btnDropdown = $('<button>')
        .attr('type', 'button')
        .addClass('btn dropdown-toggle dropdown-toggle-split')
        .addClass(this.options.classDropdownToggle)
        .attr('data-bs-toggle', 'dropdown')
        .attr('aria-expanded', false);
      btnDropdown.append($('<span>')
        .addClass('visually-hidden')
        .text('Toggle Dropdown'));
      this.options.node.append(btnDropdown);
      let menuDropdown = $('<div>')
        .addClass('dropdown-menu');
      this.options.node.append(menuDropdown);
      
      let form = $('<form>').addClass('px-4 py-3');
      if (this.options.menuImageFrequency || this.options.menuRestartPause)
        menuDropdown.append(form);

      if (this.options.menuImageFrequency) {
        const label = $('<label>')
          .addClass('form-label')
          .text(this.options.imageFrequencyCaption);
        const div = $('<div>').append(label);
        if (this.options.menuRestartPause)
          div.addClass('mb-3');
        form.append(div);
        insertFrequencyInput(div, {
          animation: this.options.animation
        });
        if (this.options.menuFrequencies !== undefined)
          insertFrequencyRange(div, {
            animation: this.options.animation,
            frequencies: this.options.menuFrequencies
          });
      }
      
      if (this.options.menuRestartPause) {
        const label = $('<label>')
          .addClass('form-label')
          .text(this.options.restartPauseCaption);
        const div = $('<div>').append(label);
        form.append(div);
        insertRestartPauseInput(div, {
          animation: this.options.animation
        });
      }
    }
  }
  
}
export default ToggleButton;