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
 * Options for constructor.
 * 
 * @typedef {Object} module:meteoJS/synview/tooltip~options
 * @param {module:meteoJS/synview/map~SynviewMap} map - Map object.
 * @param {module:meteoJS/synview/typeCollection~TypeCollection} typeCollection
 *   Collection with all types.
 * @param {module:meteoJS/tooltip~Tooltip} tooltip - Tooltip object.
 */

/**
 * @classdesc Object to show a tooltip. Is instantiated by the main synview
 *   object.
 */
export class Tooltip {
  
  /**
   * @param {module:meteoJS/synview/tooltip~options} [options] - Options.
   */
  constructor({
    map,
    typeCollection,
    tooltip
  }) {
    
    /**
     * @type Object|undefined
     * @private
     */
    this.tooltipFeature = undefined;
    
    /**
     * @type mixed[]|undefined
     * @private
     */
    this.tooltipPixelColor = undefined;
    
    /**
     * @type module:meteoJS/synview/map~SynviewMap
     * @private
     */
    this.map = map;
    
    /**
     * @type module:meteoJS/synview/typeCollection~TypeCollection
     * @private
     */
    this.typeCollection = typeCollection;
    
    /**
     * @type module:meteoJS/tooltip~Tooltip
     * @private
     */
    this.tooltip = tooltip;
    
    // Initialize tooltipNode
    if (Object.getOwnPropertyDescriptor(
          Object.getPrototypeOf(this.tooltip),
          'tooltipNode'
        ) &&
        this.tooltip.tooltipNode === undefined)
      this.tooltip.tooltipNode =
        $('<div>')
          .css('position', 'absolute')
          .prependTo(this.map.getMap().getTargetElement());
    
    // On hide tooltip
    this.tooltip.on('hide:tooltip', () => {
      this.tooltipFeature = undefined;
      this.tooltipPixelColor = undefined;
    });
    
    // Mouse moves on map
    this.map.on('move:pointer', e => {
      if (e.dragging)
        return;
      e = this.map.getExtendedEventByTypeCollection(e, this.typeCollection);
      if (e.feature ||
          e.color) {
        if (e.feature === this.tooltipFeature &&
            (e.color === undefined &&
             this.tooltipPixelColor === undefined ||
             e.color !== undefined &&
             this.tooltipPixelColor !== undefined &&
             e.color.join(',') === this.tooltipPixelColor.join(','))) {
          this.tooltip.show({
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
          this.tooltip.content = tooltipContent;
          this.tooltip
          .hide()
          .show({
            posX: e.pixel[0],
            posY: e.pixel[1]
          });
        }
        else
          this.tooltip.hide();
      }
      else
        this.tooltip.hide();
    });
  }
  
}
export default Tooltip;