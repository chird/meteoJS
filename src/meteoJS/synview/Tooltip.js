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
 * @param {module:meteoJS/tooltip~Tooltip} tooltip - Tooltip object.
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
      tooltip: undefined
    }, options);
    
    if (Object.getOwnPropertyDescriptor(this.options.tooltip, 'tooltipNode') &&
        this.options.tooltip.tooltipNode === undefined)
      this.options.tooltip.tooltipNode =
        $('<div>')
          .css('position', 'absolute')
          .prependTo(this.options.map.getMap().getTargetElement());
    
    /** @type Object|undefined */
    this.tooltipFeature = undefined;
    /** @type mixed[]|undefined */
    this.tooltipPixelColor = undefined;
    
    this.options.tooltip.on('hide:tooltip', () => {
      this.tooltipFeature = undefined;
      this.tooltipPixelColor = undefined;
    });
    
    this.options.map.on('move:pointer', function (e) {
      if (e.dragging)
        return;
      e = this.options.map.getExtendedEventByTypeCollection(e, this.options.typeCollection);
      if (e.feature ||
          e.color) {
        if (e.feature === this.tooltipFeature &&
            (e.color === undefined &&
             this.tooltipPixelColor === undefined ||
             e.color !== undefined &&
             this.tooltipPixelColor !== undefined &&
             e.color.join(',') === this.tooltipPixelColor.join(','))) {
          this.options.tooltip.show({
            posX: e.pixel[0],
            posY: e.pixel[1]
          });
          return;
        }
        
        this.tooltipFeature = undefined;
        this.tooltipPixelColor = undefined;
        let tooltipContent = e.synviewType.getTooltip().call(undefined, e);
        // Show tooltip only if there is content
        if (tooltipContent !== undefined) {
          this.tooltipFeature = e.feature;
          this.tooltipPixelColor = e.color;
          this.optoins.tooltip.content = tooltipContent;
          this.options.tooltip.show({
            posX: e.pixel[0],
            posY: e.pixel[1]
          });
        }
      }
      else if (this.isTooltipShow)
        this.options.tooltip.hide();
    }, this);
  }
  
}