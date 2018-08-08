/**
 * @module meteoJS/synview/tooltip
 */

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
meteoJS.synview.tooltip = function (options) {
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
    this.options.tooltipNode = this.options.map.getBla().insertBefore('<div>');
  
  /** @type {boolean) */
  this.isTooltipShow = false;
  /** @type {mixed|undefined */
  this.tooltipContent = undefined;
  
  // Initialize bootstrap's tooltip
  this.options.tooltipNode.tooltip(this.options.tooltipOptions);
  this.options.tooltipNode.on('show.bs.tooltip', function (e) {
    this.isTooltipShow = true;
  });
  this.options.tooltipNode.on('hide.bs.tooltip', function (e) {
    this.isTooltipShow = false;
  });
  this.options.tooltipNode.on('inserted.bs.tooltip', function (e) {
    if (this.options.closeOnMouseEnter)
      this.options.tooltipNode.find($('.top').mouseenter(function () {
        if (this.isTooltipShow)
          this.options.tooltipNode.tooltip.tooltip('hide');
      });
    if (this.tooltipContent !== undefined &&
        Object.prototype.toString.call(this.tooltipContent) !==
          "[object String]")
      this.options.tooltipNode.find($('.top').append(this.tooltipContent);
  });
  
  this.map.on('move:pointer', function (e) {
    if (e.dragging)
      return;
    e = this.map.getExtendedEventByTypeCollection(e, this.typeCollection);
    if (e.feature ||
        e.color) {
      this.tooltipContent = undefined;
      this.options.tooltipNode.tooltip('hide')
        .attr('data-original-title', undefined)
        .css({
          left: e.pixel[0] + 'px',
          top:  e.pixel[1] + 'px'
        });
      this.tooltipContent = e.type.getTooltip().call(e.type, e.layer);
      // Show tooltip only if there is content
      if (this.tooltipContent !== undefined) {
        if (Object.prototype.toString.call(this.tooltipContent) ===
              "[object String]")
          this.options.tooltipNode.attr('data-original-title',
                                        this.tooltipContent);
        this.options.tooltipNode.tooltip('show');
      }
    }
    else if (this.isTooltipVisible)
      this.options.tooltipNode.tooltip('hide');
  }, this);
};