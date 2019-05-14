/**
 * @module meteoJS/synview/tooltip
 */

import $ from 'jquery';

/**
 * Function called that should return content for the tooltip. Undefined for
 * no tooltip.
 * 
 * @typedef {Object} meteoJS/synview/tooltip~contentFunction
 * @param
 * @return {string|jQuery|undefined} Tooltip content.

  sollte auch irgendwie die Resource-Objekt übernehmen...
 */

/**
 * Options for meteoJS/synview/tooltip.
 * 
 * @typedef {Object} meteoJS/synview/tooltip~options
 * @param {meteoJS/synview/map} map Map object.
 * @param {meteoJS/synview/typeCollection} typeCollection
 *   Collection with all types.
 */

/**
 * Object to show a tooltip. Is instantiated by the main synview object.
 * 
 * @constructor
 * @param {meteoJS/synview/tooltip~options} options Options.
 * @requires openlayers
 */
export default class Tooltip {

constructor(options) {
  /**
   * Options.
   * @member {meteoJS/synview/tooltip~options}
   */
  this.options = $.extend(true, {
    map: undefined,
    typeCollection: undefined,
    tooltipNode: undefined,
    tooltipOptions: undefined,
    closeOnMouseEnter: true
  }, options);
  // Normalize options
  if (this.options.tooltipNode === undefined)
    this.options.tooltipNode =
      $('<div>')
        .css('position', 'absolute')
        .prependTo(this.options.map.getMap().getTargetElement());
  if (this.options.tooltipOptions === undefined)
    this.options.tooltipOptions = {};
  if (!('animation' in this.options.tooltipOptions) ||
      this.options.tooltipOptions.animation === undefined)
    this.options.tooltipOptions.animation = false;
  if (!('html' in this.options.tooltipOptions) ||
      this.options.tooltipOptions.html === undefined)
    this.options.tooltipOptions.html = true;
  this.options.tooltipOptions.trigger = 'manual';
  
  /** @type {boolean) */
  this.isTooltipShow = false;
  /** @type {mixed|undefined */
  this.tooltipContent = undefined;
  
  // Initialize bootstrap's tooltip
  this.options.tooltipNode.tooltip(this.options.tooltipOptions);
  this.options.tooltipNode.on('show.bs.tooltip', (function (e) {
    this.isTooltipShow = true;
  }).bind(this));
  this.options.tooltipNode.on('hide.bs.tooltip', (function (e) {
    this.isTooltipShow = false;
  }).bind(this));
  this.options.tooltipNode.on('inserted.bs.tooltip', (function (e) {
    var tooltipNode =
      $(document.getElementById($(e.target).attr('aria-describedby')));
    if (!tooltipNode.length)
      return;
    if (this.options.closeOnMouseEnter)
      tooltipNode.children('.tooltip-inner').mouseenter((function () {
        if (this.isTooltipShow)
          this.options.tooltipNode.tooltip('hide');
      }).bind(this));
    if (this.tooltipContent !== undefined &&
        Object.prototype.toString.call(this.tooltipContent) !==
          "[object String]")
      tooltipNode.children('.tooltip-inner').empty().append(this.tooltipContent);
  }).bind(this));
  
  this.options.map.on('move:pointer', function (e) {
    if (e.dragging)
      return;
    e = this.options.map.getExtendedEventByTypeCollection(e, this.options.typeCollection);
    if (e.feature ||
        e.color) {
      this.tooltipContent = undefined;
      this.options.tooltipNode.tooltip('hide')
        .attr('data-original-title', undefined)
        .css({
          left: e.pixel[0] + 'px',
          top:  e.pixel[1] + 'px'
        });
      this.tooltipContent = e.type.getTooltip().call(undefined, e);
      // Show tooltip only if there is content
      if (this.tooltipContent !== undefined) {
        /* If no content is passed, the tooltip will not open with a
         * content-callback until the tooltip is initialized otherwise. */
        this.options.tooltipNode.attr('data-original-title',
          (Object.prototype.toString.call(this.tooltipContent) ===
            "[object String]") ? this.tooltipContent : '-');
        this.options.tooltipNode.tooltip('show');
      }
    }
    else if (this.isTooltipShow)
      this.options.tooltipNode.tooltip('hide');
  }, this);
}

}