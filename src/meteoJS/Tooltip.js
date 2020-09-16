/**
 * @module meteoJS/tooltip
 */
import addEventFunctions from './Events.js';

/**
 * Triggered, when tooltip starts to be shown.
 * 
 * @event module:meteoJS/tooltip#show:tooltip
 */

/**
 * Triggered, when tooltip starts to be hidden.
 * 
 * @event module:meteoJS/tooltip#hide:tooltip
 */

/**
 * @classdesc Abstract class to create a tooltip.
 * 
 * @abstract
 * @fires module:meteoJS/tooltip#show:tooltip
 * @fires module:meteoJS/tooltip#hide:tooltip
 */
export class Tooltip {
  
  constructor() {
    /**
     * @type Boolean
     * @private
     */
    this._isShown = false;
    
    /**
     * @type undefined|mixed
     * @private
     */
    this._content = undefined;
  }
  
  /**
   * Is tooltip shown.
   * 
   * @type Boolean
   * @readonly
   */
  get isShown() {
    return this._isShown;
  }
  
  /**
   * Content of tooltip. Could be a String or a HTMLElement or a jQuery object.
   * 
   * @type undefined|mixed
   */
  get content() {
    return this._content;
  }
  set content(content) {
    let oldContent = this._content;
    this._content = content;
    if (oldContent !== this._content)
      this.onContentChange();
  }
  
  /**
   * Show tooltip.
   * 
   * @abstract
   * @param {Object} [options] - Options.
   * @param {Number} options.posX - Position in x direction.
   * @param {Number} options.posY - Position in y direction.
   * @returns {module:meteoJS/tooltip.Tooltip} This.
   */
  show() {
    let fireShowEvent = !this.isShown;
    this._isShown = true;
    if (fireShowEvent)
      this.trigger('show:tooltip');
    return this;
  }
  
  /**
   * Hide tooltip.
   * 
   * @abstract
   * @returns {module:meteoJS/tooltip.Tooltip} This.
   */
  hide() {
    let fireHideEvent = this.isShown;
    this._isShown = false;
    if (fireHideEvent)
      this.trigger('hide:tooltip');
    return this;
  }
  
  /**
   * Update tooltip. E.g. due to content change, which moved the tooltip.
   * 
   * @abstract
   * @returns {module:meteoJS/tooltip.Tooltip} This.
   */
  update() {
    return this;
  }
  
  /**
   * Called when property 'content' changes.
   * 
   * @abstract
   * @protected
   */
  onContentChange() {}
  
}
addEventFunctions(Tooltip.prototype);
export default Tooltip;