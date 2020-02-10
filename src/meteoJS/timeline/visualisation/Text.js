/**
 * @module meteoJS/timeline/visualisation/text
 */

import $ from 'jquery';
import Visualisation from '../Visualisation.js';

/**
 * Options for constructor.
 * 
 * @typedef {module:meteoJS/timeline/visualisation/slider~options}
 *  module:meteoJS/timeline/visualisation/text~options
 * @param {string|undefined} format
 *   Format string, used for {@link external:moment#format}.
 */

/**
 * Show current selected time of a timeline as text.
 * 
 * @extends module:meteoJS/timeline/visualisation.Visualisation
 */
export class Text extends Visualisation {
  
  /**
   * @param {module:meteoJS/timeline/visualisation/text~options} options - Options.
   */
  constructor(options) {
    options = $.extend(true, {
      format: undefined,
    }, options);
	
    super(options);
    this.setNode(this.options.node);
  }
  
  /**
   * @inheritdoc
   */
  onChangeTime() {
    this.options.node.text(
      this.timeToText(this.options.timeline.getSelectedTime(),
        this.options.format));
  }
  
  /**
   * @inheritdoc
   */
  emptyNode() {
    this.options.node.text('');
  }
  
}
export default Text;