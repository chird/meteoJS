/**
 * @module meteoJS/thermodynamicDiagram/plotAltitudeDataArea
 */
import PlotDataArea from './PlotDataArea.js';

/**
 * Options for labels on hovering the diagram. Extended by the "remote" option.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram/plotDataArea~hoverLabelsOptions}
 *   module:meteoJS/thermodynamicDiagram/plotAltitudeDataArea~hoverLabelsOptions
 * @property {boolean} [remote=true]
 *   Show labels relative to the mouse position on the diagram, even when the
 *   pointer isn't directly on the plot area.
 */

/**
 * Options for the constructor.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram/plotDataArea~options}
 *   module:meteoJS/thermodynamicDiagram/plotAltitudeDataArea~options
 * @property {module:meteoJS/thermodynamicDiagram/plotAltitudeDataArea~hoverLabelsOptions}
 *   [hoverLabels] - Hover labels options.
 */

/**
 * Abstract class to define an area on the SVG with sounding data, plotted with
 * pressure on the y-axis.
 * 
 * <pre><code>import PlotAltitudeDataArea from 'meteojs/thermodynamicDiagram/PlotAltitudeDataArea';</code></pre>
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
    insertDataGroupInto = undefined,
    filterDataPoint = undefined,
    minDataPointsDistance = 0
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
      hoverLabels,
      getSoundingVisibility,
      dataGroupIds,
      getCoordinatesByLevelData,
      insertDataGroupInto,
      filterDataPoint,
      minDataPointsDistance
    });
    
    /**
     * @type boolean
     * @private
     */
    this._isHoverLabelsRemote;
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
  
  /**
   * Initialize hover labels options.
   * 
   * @param {module:meteoJS/thermodynamicDiagram/plotAltitudeDataArea~hoverLabelsOptions}
   *   options - Hover labels options.
   * @override
   */
  _initHoverLabels({
    visible = true,
    type = 'mousemove',
    maxDistance = undefined,
    remote = true,
    insertLabelsFunc = undefined,
    getLevelData = ({ hoverLabelsSounding, e }) => {
      if (!e.diagramPres)
        return {};
      const sounding = hoverLabelsSounding.sounding;
      return sounding.getData(sounding.getNearestLevel(e.diagramPres));
    },
    getHoverSounding = undefined
  }) {
    this._isHoverLabelsRemote = remote;

    super._initHoverLabels({
      visible,
      type,
      maxDistance,
      insertLabelsFunc,
      getLevelData,
      getHoverSounding
    });
  }
}
export default PlotAltitudeDataArea;