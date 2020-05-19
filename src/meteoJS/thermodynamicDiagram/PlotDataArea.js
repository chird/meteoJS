/**
 * @module meteoJS/thermodynamicDiagram/plotDataArea
 */
import PlotArea from './PlotArea.js';

/**
 * Event with a sounding object.
 * 
 * @typedef {} module:meteoJS/thermodynamicDiagram/plotDataArea~soundingEvent
 * @param {module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding}
 *   sounding - Sounding.
 */

/**
 * Fired on adding a sounding.
 * 
 * @event module:meteoJS/thermodynamicDiagram/plotDataArea#add:sounding
 * @type {module:meteoJS/thermodynamicDiagram/plotDataArea~soundingEvent}
 */

/**
 * Fired on removing a sounding.
 * 
 * @event module:meteoJS/thermodynamicDiagram/plotDataArea#remove:sounding
 * @type {module:meteoJS/thermodynamicDiagram/plotDataArea~soundingEvent}
 */

/**
 * Visibility of the sounding in an area.
 * 
 * @typedef {Function}
 *   module:meteoJS/thermodynamicDiagram/plotDataArea~getSoundingVisibility
 * @param {module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding}
 *   sounding - Sounding to determine its visibility.
 * @returns {boolean} Visibility.
 */

/**
 * Options for the constructor.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram/plotArea~options}
 *   module:meteoJS/thermodynamicDiagram/plotDataArea~options
 * @param {module:meteoJS/thermodynamicDiagram/plotDataArea~getSoundingVisibility} [getSoundingVisibility]
 *   Takes a sounding object and returns the visibility for the area.
 */

/**
 * Abstract class to define an area on the SVG with sounding data.
 * 
 * @extends module:meteoJS/thermodynamicDiagram/plotArea.PlotArea
 * 
 * @fires module:meteoJS/thermodynamicDiagram/plotDataArea#add:sounding
 * @fires module:meteoJS/thermodynamicDiagram/plotDataArea#remove:sounding
 */
export class PlotDataArea extends PlotArea {
  
  /**
   * @param {module:meteoJS/thermodynamicDiagram/plotDataArea~options}
   *   options - Options.
   */
  constructor({
    svgNode = undefined,
    coordinateSystem = undefined,
    x = 0,
    y = 0,
    width = 100,
    height = 100,
    style = {},
    visible = true,
    events = {},
    getSoundingVisibility = sounding => sounding.visible
  } = {}) {
    super({
      svgNode,
      coordinateSystem,
      x,
      y,
      width,
      height,
      style,
      visible,
      events
    });
    
    /**
     * @type Function
     * @private
     */
    this._getSoundingVisibility = getSoundingVisibility;
    
    /**
     * @type external:SVG
     * @private
     */
    this._svgNodeData = this.svgNode.group();
    
    /**
     * Contains all soundings to draw as key. The value-object contains 3 items:
     * group (SVG), listenerKeyVisible, listenerKeyOptions.
     * 
     * @type Map.<module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding,Object>
     * @private
     */
    this._soundings = new Map();
  }
  
  /**
   * Adds a sounding to draw into the area.
   * 
   * @param {module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding}
   *   sounding - Sounding object.
   */
  addSounding(sounding) {
    let group = this._svgNodeData.group();
    const changeOptions = () => {
      if (this.coordinateSystem !== undefined)
        this.drawSounding(sounding, group);
      this.onChangeSoundingVisibility(sounding, group);
    };
    let listenerKeyVisible = sounding.on('change:visible',
      () => this.onChangeSoundingVisibility(sounding, group));
    let listenerKeyOptions = sounding.on('change:options', changeOptions);
    this._soundings.set(sounding, {
      group,
      listenerKeyVisible,
      listenerKeyOptions
    });
    this.trigger('add:sounding', sounding);
    changeOptions();
  }
  
  /**
   * Removes a sounding from the area.
   * 
   * @param {module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding}
   *   sounding - Sounding object.
   */
  removeSounding(sounding) {
    if (this._soundings.has(sounding)) {
      this._soundings.get(sounding).group.remove();
      sounding.un(this._soundings.get(sounding).listenerKeyVisible);
      sounding.un(this._soundings.get(sounding).listenerKeyOptions);
      this._soundings.delete(sounding);
    }
    this.trigger('remove:sounding', sounding);
  }
  
  /**
   * Called, when the coordinateSystem object changes.
   * 
   * @override
   */
  onCoordinateSystemChange() {
    super.onCoordinateSystemChange();
    
    if (this.coordinateSystem === undefined)
      return;
    
    for (let sounding of this._soundings.keys())
      this.drawSounding(sounding, this._soundings.get(sounding).group);
  }
  
  /**
   * Called, when a sounding changes its visibilty.
   * 
   * @param {module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding}
   *   sounding - Sounding object.
   * @param {external:SVG} group - SVG group, SVG.G.
   * @protected
   */
  onChangeSoundingVisibility(sounding, group) {
    group.css('display',
      this._getSoundingVisibility(sounding) ? 'inline' : 'none');
  }
  
  /**
   * Draw the sounding into the SVG group.
   * 
   * @param {module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding}
   *   sounding - Sounding object.
   * @param {external:SVG} group - SVG group, SVG.G.
   * @protected
   */
  drawSounding(sounding, group) {
    group.clear();
  }
}
export default PlotDataArea;