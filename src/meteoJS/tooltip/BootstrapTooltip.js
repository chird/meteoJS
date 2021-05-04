/**
 * @module meteoJS/tooltip/bootstrapTooltip
 */
import $ from 'jquery';
import { Tooltip as bsTooltip } from 'bootstrap';
import Tooltip from '../Tooltip.js';

/**
 * Options for constructor.
 * 
 * @typedef {Object} module:meteoJS/tooltip/bootstrapTooltip~options
 * @property {undefined|external:jQuery|external:HTMLElement} [tooltipNode=undefined]
 *   Create Bootstrap's tooltip on this element.
 * @property {Object} [bootstrapOptions] - Options passed to the '.tooltip' method.
 * @property {boolean} [closeOnMouseMove=true]
 *   Close tooltip, when mouse is moved over the tooltip.
 * @property {boolean} [closeOnMouseEnter=false]
 *   Close tooltip, when mouse is entered in the tooltip.
 */

/**
 * Tooltip which uses the Bootstrap's tooltip.
 * 
 * @extends module:meteoJS/tooltip.Tooltip
 * @inheritdoc
 */
export class BootstrapTooltip extends Tooltip {
  
  /**
   * @param {module:meteoJS/tooltip/bootstrapTooltip~options} [options] - Options.
   */
  constructor({
    tooltipNode = undefined,
    bootstrapOptions = undefined,
    closeOnMouseMove = true,
    closeOnMouseEnter = false
  } = {}) {
    super();
    
    /**
     * @type undefined|Object
     * @private
     */
    this.bootstrapOptions = bootstrapOptions ? bootstrapOptions : {};
    this._initBootstrapOptions(bootstrapOptions);
    
    /**
     * @type boolean
     * @private
     */
    this.closeOnMouseMove = closeOnMouseMove;
    
    /**
     * @type Bboolean
     * @private
     */
    this.closeOnMouseEnter = closeOnMouseEnter;
    
    /**
     * @type external:jQuery
     * @private
     */
    this._tooltipNode = undefined;
    this.tooltipNode = tooltipNode;

    /**
     * @type external:bootrap|undefined
     * @private
     */
    this._bsTooltip = undefined;
  }
  
  /**
   * Bootstap's tooltip is assigned to this node.
   * 
   * @type undefined|external:jQuery
   */
  get tooltipNode() {
    return this._tooltipNode;
  }
  set tooltipNode(tooltipNode) {
    if (tooltipNode === undefined) {
      this._tooltipNode = tooltipNode;
      this._bsTooltip = undefined;
      return;
    }
    
    this._tooltipNode = $(tooltipNode);
    this._initTooltipNode();
  }
  
  /**
   * @inheritdoc
   */
  show({
    posX,
    posY
  }) {
    if (this._tooltipNode === undefined ||  this._bsTooltip === undefined)
      return;

    this.tooltipNode
      .css({
        left: `${posX}px`,
        top: `${posY}px`
      });
    if (this.isShown)
      this._bsTooltip.update();
    else
      this._bsTooltip.show();
    return super.show();
  }
  
  /**
   * @inheritdoc
   */
  hide() {
    if (this._tooltipNode === undefined ||  this._bsTooltip === undefined)
      return;

    if (this.isShown) {
      this.tooltipNode
        .attr('data-original-title', undefined);
      this._bsTooltip.hide();
    }
    return super.hide();
  }
  
  /**
   * @inheritdoc
   */
  update() {
    if (this._bsTooltip === undefined)
      return;
    this._bsTooltip.update();
    return super.update();
  }
  
  /**
   * @inheritdoc
   */
  onContentChange() {
    /* If no content is passed, the tooltip will not open with a
     * content-callback until the tooltip is initialized otherwise. */
    this.tooltipNode.attr('data-bs-original-title',
      isStringContent(this.content) ? this.content : '-');
    
    this._updateNonStringContent();
    this.update();
  }
  
  /**
   * Default options to Bootstrap's tooltip.
   * 
   * @private
   */
  _initBootstrapOptions({
    trigger = 'manual'
  } = {}) {
    this.bootstrapOptions.trigger = trigger;
  }
  
  /**
   * Initialize Bootstrap's tooltip.
   * 
   * @private
   */
  _initTooltipNode() {
    if (this._bsTooltip !== undefined)
      this._bsTooltip.dispose();
    this._bsTooltip =
      new bsTooltip(this._tooltipNode[0], this.bootstrapOptions);
    this.tooltipNode[0].addEventListener('inserted.bs.tooltip', () => {
      let tooltipNode = this._updateNonStringContent();
      if (!tooltipNode.length)
        return;
      if (this.closeOnMouseMove)
        tooltipNode.children('.tooltip-inner').mousemove(() => this.hide());
      if (this.closeOnMouseEnter)
        tooltipNode.children('.tooltip-inner').mouseenter(() => this.hide());
    });
  }
  
  /**
   * Updates tooltips content, if not simply a string.
   * 
   * @private
   * @returns {external:jQuery} - Tooltip node.
   */
  _updateNonStringContent() {
    let tooltipNode =
      $(document.getElementById(this.tooltipNode.attr('aria-describedby')));
    if (!tooltipNode.length)
      return;
    if (this.content !== undefined &&
        !isStringContent(this.content))
      tooltipNode
        .children('.tooltip-inner')
        .empty()
        .append(this.content);
    return tooltipNode;
  }
  
}
export default BootstrapTooltip;

const isStringContent = function(content) {
  return Object.prototype.toString.call(content) == '[object String]';
};