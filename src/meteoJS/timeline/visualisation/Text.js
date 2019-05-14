/**
 * @module meteoJS/timeline/visualisation/text
 */

import $ from 'jquery';
import Visualisation from '../Visualisation.js';

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
export class Text extends Visualisation {

constructor(options) {
  options = $.extend(true, {
    format: undefined,
  }, options);
  
  super(options);
  this.setNode(this.options.node);
}

/**
 * @augments meteoJS.timeline.visualisation.onChangeTime
 */
onChangeTime() {
  this.options.node.text(
    this.timeToText(this.options.timeline.getSelectedTime(),
                    this.options.format));
}

/**
 * @augments meteoJS.timeline.visualisation.emptyNode
 */
emptyNode() {
  this.options.node.text('');
}

}