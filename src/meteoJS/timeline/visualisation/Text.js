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
 * @classdesc
 * Show current selected time of a timeline as text.
 * 
 * @augments module:meteoJS/timeline/visualisation~Visualisation
 * @requires moment.js
 * @requires moment-timezone.js (if option outputTimezone is used)
 */
export default class Text extends Visualisation {
  
  /**
   * @param {meteoJS/timeline/visualisation/text~options} options Options.
   */
	constructor(options) {
		options = $.extend(true, {
			format: undefined,
		}, options);
	
		super(options);
		this.setNode(this.options.node);
	}
  
	/**
	 * @augments module:meteoJS/timeline/visualisation~Visualisation.onChangeTime
	 */
	onChangeTime() {
		this.options.node.text(
			this.timeToText(this.options.timeline.getSelectedTime(),
											this.options.format));
	}
  
	/**
	 * @augments module:meteoJS/timeline/visualisation~Visualisation.emptyNode
	 */
	emptyNode() {
		this.options.node.text('');
	}
  
}