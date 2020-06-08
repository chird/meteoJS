/**
 * @module meteoJS/timeline/visualisation/text
 */
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
  constructor({
    format = undefined,
    ...rest
  } = {}) {
    super(rest);
    
    this.options.format = format;
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