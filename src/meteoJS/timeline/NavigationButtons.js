/**
 * @module meteoJS/timeline/navigationButtons
 */
import addEventFunctions from '../Events.js';
import Timeline from '../Timeline.js';

/**
 * Determines how the time is chosen, when a button for time navigation is
 * clicked. On "exact" the time in the timeline is only changed if the time
 * exists. In all other cases the time will be changed and a suitable timestamp
 * is chosen.
 * 
 * @typedef {string="exact","nearest","before","later"}
 *   module:meteoJS/timeline/navigationButtons~findTimeBy
 */

/**
 * Options for NavigationButtons.
 * 
 * @typedef {Object} module:meteoJS/timeline/navigationButtons~options
 * @param {module:meteoJS/timeline~Timeline} timeline - Timeline object.
 * @param {module:meteoJS/timeline/navigationButtons~findTimeBy} findTimeBy
 *   Determines how the time is chosen, when a button is clicked.
 * @param {string|undefined} buttonClass - Default button class.
 */

/**
 * @typedef {Object} module:meteoJS/timeline/navigationButtons~buttonDefinition
 * @param {string|undefined} [buttonClass} - Class.
 * @param {string="first","last","prev","next","nextAllEnabled","prevAllEnabled","add","sub"}
 *   methodName - Method to execute on timeline, when button is clicked.
 * @param {integer} [timeAmount] - Required when methodName is "add" or "sub."
 * @param {string} [timeKey] - Required when methodName is "add" or "sub."
 * @param {string} [text] - Text for button.
 * @param {string} [title] - Title for button.
 */

/**
 * @event module:meteoJS/timeline/navigationButtons#click:button
 * @type {module:meteoJS/timeline/navigationButtons~buttonDefinition}
 * @property {boolean} isTimeChanged - Time changed.
 * @property {HTMLElement} button - Button.
 * @property {string="first","last","prev","next","nextAllEnabled","prevAllEnabled","add","sub"}
 *   methodName - Method executed on timeline.
 * @property {integer} [timeAmount] - Passed if methodName is "add" or "sub."
 * @property {string} [timeKey] - Passed if methodName is "add" or "sub."
 */

/**
 * @classdesc Class to create buttons and insert them into the DOM to navigate
 *   through the times of the passed timeline.
 * 
 * @fires module:meteoJS/timeline/navigationButtons#click:button
 */
export class NavigationButtons {
  
  /**
   * @param {module:meteoJS/timeline/navigationButtons~options} [options]
   *   Options.
   */
  constructor({ timeline,
                findTimeBy = "exact",
                buttonClass,
                } = {}) {
    /**
     * @type module:meteoJS/timeline~Timeline
     */
    this.timeline = timeline;
    
    /**
     * @type module:meteoJS/timeline/navigationButtons~findTimeBy
     */
    this.findTimeBy = findTimeBy;
    
    /**
     * @type string|undefined
     */
    this.buttonClass = buttonClass;
  }
    
  /**
   * Creates button HTMLElements and append them to the passed node.
   * 
   * @param {HTMLElement} node - Node to insert the buttons into it.
   * @param {...module:meteoJS/timeline/navigationButtons~buttonDefinition}
   *   buttons - Button defintions to insert.
   */
  insertButtonInto(node, ...buttons) {
    buttons.forEach(({ buttonClass,
                       methodName,
                       timeAmount,
                       timeKey,
                       text,
                       title } = {}) => {
      if (!/^(first|last|prev|next|nextAllEnabled|prevAllEnabled|add|sub)$/
           .test(methodName))
        return;
      if (text === undefined)
        switch (methodName) {
          case 'first':
            text = '|«';
            break;
          case 'last':
            text = '»|';
            break;
          case 'prev':
            text = '«';
            break;
          case 'next':
            text = '»';
            break;
          case 'nextAllEnabled':
            text = '»';
            break;
          case 'prevAllEnabled':
            text = '«';
            break;
          case 'add':
            text = `+${timeAmount}${timeKey}`;
            break;
          case 'sub':
            text = `-${timeAmount}${timeKey}`;
            break;
        }
      let button = document.createElement('button');
      button.appendChild(document.createTextNode(text));
      button.setAttribute('type', 'button');
      if (typeof buttonClass == 'string')
        buttonClass.split(' ').map(c => button.classList.add(c));
      else if (typeof this.buttonClass == 'string')
        this.buttonClass.split(' ').map(c => button.classList.add(c));
      if (title !== undefined)
        button.setAttribute('title', title);
      button.addEventListener('click', () => {
        let isTimeChanged = true;
        let oldSelectedTime = this.timeline.getSelectedTime();
        switch (methodName) {
          case 'add':
            this.timeline.add(timeAmount, timeKey);
            if (this.timeline.getSelectedTime().valueOf() ==
                oldSelectedTime.valueOf())
              isTimeChanged = false;
            break;
          case 'sub':
            this.timeline.sub(timeAmount, timeKey);
            if (this.timeline.getSelectedTime().valueOf() ==
                oldSelectedTime.valueOf())
              isTimeChanged = false;
            break;
          default:
            this.timeline[methodName]();
        }
        this.trigger('click:button', {
          isTimeChanged,
          button,
          methodName,
          timeAmount,
          timeKey
        });
      });
      node.appendChild(button);
    });
  }
  
}
addEventFunctions(NavigationButtons.prototype);
export default NavigationButtons;