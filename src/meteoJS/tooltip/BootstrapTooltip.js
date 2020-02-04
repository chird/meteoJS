/**
 * @module meteoJS/tooltip/bootstrapTooltip
 */
import $ from 'jquery';
import 'bootstrap/js/dist/tooltip';
import Tooltip from '../Tooltip.js';

/**
 * Options for constructor.
 * 
 * @typedef {Object} module:meteoJS/tooltip/bootstrapTooltip~options
 * @param {undefined|jQuery|HTMLElement=undefined} [tooltipNode]
 *   Create Bootstrap's tooltip on this element.
 * @param {Object} [bootstrapOptions] - Options passed to the '.tooltip' method.
 * @param {Boolean=true} [closeOnMouseEnter]
 *   Close tooltip, when mouse is moved over the tooltip.
 */

/**
 * @classdesc Tooltip which uses the Bootstrap's tooltip.
 * 
 * @extends module:meteoJS/tooltip~Tooltip
 * @inheritdoc
 */
export class BootstrapTooltip extends Tooltip {
  
  /**
   * @param {module:meteoJS/tooltip/bootstrapTooltip~options} [options] - Options.
   */
  constructor({
    tooltipNode = undefined,
    bootstrapOptions = undefined,
    closeOnMouseEnter = true
  } = {}) {
    super();
    
    /**
     * @type undefined|Object
     * @private
     */
    this.bootstrapOptions = bootstrapOptions ? bootstrapOptions : {};
    this._initBootstrapOptions(bootstrapOptions);
    
    /**
     * @type Boolean
     * @private
     */
    this.closeOnMouseEnter = closeOnMouseEnter;
    
    /**
     * @type jQuery
     */
    this._tooltipNode = undefined;
    this.tooltipNode = tooltipNode;
  }
  
  /**
   * Bootstap's tooltip is assigned to this node.
   * 
   * @type undefined|jQuery
   */
  get tooltipNode() {
    return this._tooltipNode;
  }
  set tooltipNode(tooltipNode) {
    if (tooltipNode === undefined) {
      this._tooltipNode = tooltipNode;
      return;
    }
    
    this._tooltipNode = $(tooltipNode);
    this._initTooltipNode();
  }
  
  /**
   * @override
   * @inheritdoc
   */
  show({
    posX,
    posY
  }) {
    this.tooltipNode
    .css({
      left: `${posX}px`,
      top: `${posY}px`
    })
    .tooltip(this.isShown ? 'update' : 'show');
    return super.show();
  }
  
  /**
   * @override
   * @inheritdoc
   */
  hide() {
    if (this.isShown)
      this.tooltipNode
      .tooltip('hide')
      .attr('data-original-title', undefined);
    return super.hide();
  }
  
  /**
   * @override
   * @inheritdoc
   */
  update() {
    this.tooltipNode.tooltip('update');
    return super.update();
  }
  
  /**
   * @inheritdoc
   */
  onContentChange() {
    /* If no content is passed, the tooltip will not open with a
     * content-callback until the tooltip is initialized otherwise. */
    this.tooltipNode.attr('data-original-title',
      isStringContent(this.content) ? this.content : '-');
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
    this.tooltipNode
    .tooltip(this.bootstrapOptions)
    .on('inserted.bs.tooltip', e => {
      let tooltipNode =
        $(document.getElementById($(e.target).attr('aria-describedby')));
      if (!tooltipNode.length)
        return;
      if (this.closeOnMouseEnter)
        tooltipNode.children('.tooltip-inner').mouseenter(() => this.hide());
      if (this.content !== undefined &&
          !isStringContent(this.content))
        tooltipNode
        .children('.tooltip-inner')
        .empty()
        .append(this.content);
    });
  }
  
}
export default BootstrapTooltip;

const isStringContent = function(content) {
  return Object.prototype.toString.call(content) == "[object String]";
}