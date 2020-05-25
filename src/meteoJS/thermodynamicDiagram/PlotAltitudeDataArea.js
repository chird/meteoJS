/**
 * @module meteoJS/thermodynamicDiagram/plotAltitudeDataArea
 */
import PlotDataArea from './PlotDataArea.js';

/**
 * Function to insert labels.
 * 
 * @typedef {Function}
 *   module:meteoJS/thermodynamicDiagram/plotAltitudeDataArea~insertLabelsFunc
 * @param {module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding}
 *   sounding - Diagram sounding to label.
 * @param {Object} levelData - Data to label.
 * @param {external:SVG} group - SVG group to insert labels.
 */

/**
 * Options for labels on hovering the diagram.
 * 
 * @typedef {Object}
 *   module:meteoJS/thermodynamicDiagram/plotAltitudeDataArea~hoverLabelsOptions
 * @property {boolean} [visible=true] - Visibility.
 * @property {string} [type='mousemove'] - Event type.
 * @property {boolean} [snapToData=true]
 *   Snap labels to data points.
 * @property {boolean} [remote=true]
 *   Show labels relative to the mouse position on the diagram, even when the
 *   pointer isn't directly on the plot area.
 * @property {module:meteoJS/thermodynamicDiagram/plotAltitudeDataArea~insertLabelsFunc}
 *   [insertLabelsFunc] - Called to insert labels into a SVG group.
 */

/**
 * Options for the constructor.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram/plotDataArea~options}
 *   module:meteoJS/thermodynamicDiagram/plotAltitudeDataArea~options
 * @param {module:meteoJS/thermodynamicDiagram/plotAltitudeDataArea~hoverLabelsOptions}
 *   [hoverLabels] - Hover labels options.
 */

/**
 * Abstract class to define an area on the SVG with sounding data, plotted with
 * pressure on the y-axis.
 * 
 * @extends module:meteoJS/thermodynamicDiagram/plotDataArea.PlotDataArea
 */
export class PlotAltitudeDataArea extends PlotDataArea {
  
  /**
   * @param {module:meteoJS/thermodynamicDiagram/plotAltitudeDataArea~options}
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
    hoverLabels = {},
    getSoundingVisibility = sounding => sounding.visible,
    dataGroupIds = undefined,
    getCoordinatesByLevelData = undefined,
    insertDataGroupInto = undefined
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
      events,
      getSoundingVisibility,
      dataGroupIds,
      getCoordinatesByLevelData,
      insertDataGroupInto
    });
    
    /**
     * @type external:SVG
     * @private
     */
    this._hoverLabelsGroup = this.svgNode.group();
    
    /**
     * @type boolean
     * @private
     */
    this._isHoverLabelsRemote = true;
    
    this._initHoverLabels(hoverLabels);
  }
  
  /**
   * Called, when a sounding changes its visibilty.
   * 
   * @override
   */
  onChangeSoundingVisibility(sounding, group) {
    super.onChangeSoundingVisibility(sounding, group);
    this._hoverLabelsGroup.clear();
  }
  
  /**
   * Draw the sounding into the SVG group.
   * 
   * @override
   */
  drawSounding(sounding, group) {
    super.drawSounding(sounding, group);
    this._hoverLabelsGroup.clear();
  }
  
  /**
   * Extend an event with pressure.
   * 
   * @override
   */
  getExtendedEvent(e, p) {
    e = super.getExtendedEvent(e, p);
    
    e.diagramPres = undefined;
    if (this.coordinateSystem !== undefined)
      e.diagramPres =
        this.coordinateSystem.getPByXY(0,
          this.coordinateSystem.height - e.elementY);
    
    return e;
  }
  
  /**
   * Show also hover labels when mouse isn't over the area.
   * 
   * @type boolean
   * @readonly
   */
  get isHoverLabelsRemote() {
    return this._isHoverLabelsRemote;
  }
  
  get hoverLabelsSounding() {
    // Wie "manuell" setzen?
    for (let sounding of this._soundings.keys()) {
      if (this._getSoundingVisibility(sounding))
        return sounding;
    }
    return undefined;
  }
  
  /**
   * Initialize hover labels options.
   * 
   * @param {module:meteoJS/thermodynamicDiagram/plotAltitudeDataArea~hoverLabelsOptions}
   *   options - Hover labels options.
   */
  _initHoverLabels({
    visible = true,
    type = 'mousemove',
    //snapToData = true,
    remote = true,
    insertLabelsFunc = undefined
  }) {
    this._isHoverLabelsRemote = remote;
    
    if (!visible ||
        insertLabelsFunc === undefined)
      return;
    
    this.on('change:extent', () => this._hoverLabelsGroup.clear());
    this.on(type, e => {
      if (!e.diagramPres)
        return;
      const hoverLabelsSounding = this.hoverLabelsSounding;
      if (hoverLabelsSounding === undefined)
        return;
      
      const sounding = hoverLabelsSounding.sounding;
      insertLabelsFunc(hoverLabelsSounding,
        sounding.getData(sounding.getNearestLevel(e.diagramPres)),
        this._hoverLabelsGroup);
    });
  }
}
export default PlotAltitudeDataArea;