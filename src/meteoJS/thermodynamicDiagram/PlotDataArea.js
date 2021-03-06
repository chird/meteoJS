/**
 * @module meteoJS/thermodynamicDiagram/plotDataArea
 */
import PlotArea from './PlotArea.js';

/**
 * Event with a sounding object.
 * 
 * @typedef {Object} module:meteoJS/thermodynamicDiagram/plotDataArea~soundingEvent
 * @property {module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding}
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
 * Event with a sounding object and its SVG node.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram/plotDataArea~soundingEvent}
 *   module:meteoJS/thermodynamicDiagram/plotDataArea~insertSoundingEvent
 * @property {external:SVG} node - SVG node, SVG.G.
 */

/**
 * Fired before inserting the sounding data into the svg.
 * 
 * @event module:meteoJS/thermodynamicDiagram/plotDataArea#preinsert:sounding
 * @type {module:meteoJS/thermodynamicDiagram/plotDataArea~insertSoundingEvent}
 */

/**
 * Fired after inserting the sounding data into the svg.
 * 
 * @event module:meteoJS/thermodynamicDiagram/plotDataArea#postinsert:sounding
 * @type {module:meteoJS/thermodynamicDiagram/plotDataArea~insertSoundingEvent}
 */

/**
 * Function to insert labels.
 * 
 * @typedef {Function}
 *   module:meteoJS/thermodynamicDiagram/plotDataArea~insertLabelsFunc
 * @param {module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding}
 *   sounding - Diagram sounding to label.
 * @param {module:meteoJS/sounding~levelData} levelData - Data to label.
 * @param {external:SVG} group - SVG group to insert labels.
 */

/**
 * Getter for the levelData of a certain DiagramSounding according to an event.
 * 
 * @typedef {Function}
 *   module:meteoJS/thermodynamicDiagram/plotDataArea~getLevelData
 * @param {Object} options - Options.
 * @param {module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding}
 *   options.hoverLabelsSounding
 *   For this sounding, the hover labels are shown.
 * @param {module:meteoJS/thermodynamicDiagram/plotArea~event} options.e
 *   This event raised the display of hover labels.
 * @param {undefined|number} options.maxDistance
 *   Maximum distance to a data point to show a hover label in pixels.
 *   If undefined, always a hover label to the nearest point is shown.
 * @returns {module:meteoJS/sounding~levelData}
 *   The data to show in the label. This data is passed to
 *   {@link module:meteoJS/thermodynamicDiagram/plotDataArea~insertLabelsFunc}.
 */

/**
 * For the returned sounding, the hover labels are shown. As input all
 * currently visible soundings are passed.
 * 
 * @typedef {Function}
 *   module:meteoJS/thermodynamicDiagram/plotDataArea~getHoverSounding
 * @param {module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding[]}
 *   soundings - Currently visible soundings. Array length is always at least 1.
 * @returns {undefined|module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding}
 *   For this returned sounding, the hover labels are shown. No hover labes are
 *   shown, if undefined is returned.
 */

/**
 * Options for labels on hovering the plot area.
 * 
 * @typedef {Object}
 *   module:meteoJS/thermodynamicDiagram/plotDataArea~hoverLabelsOptions
 * @property {boolean} [visible=true] - Visibility.
 * @property {string} [type='mousemove'] - Event type.
 * @property {number} [maxDistance=undefined]
 *   Maximum distance to a data point to show a hover label in pixels.
 *   If undefined, always a hover label to the nearest point is shown.
 * @property {boolean} [remote=true]
 *   Show labels relative to the mouse position on the diagram, even when the
 *   pointer isn't directly on the plot area.
 * @property {module:meteoJS/thermodynamicDiagram/plotDataArea~insertLabelsFunc}
 *   [insertLabelsFunc] - Called to insert labels into a SVG group.
 * @property {module:meteoJS/thermodynamicDiagram/plotDataArea~getLevelData}
 *   [getLevelData] - .
 * @property {module:meteoJS/thermodynamicDiagram/plotDataArea~getHoverSounding}
 *   [getHoverSounding] - Default: Return the first sounding of the
 *   passed input array.
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
 * Returns x and y coordinates in the Plot-Area for the passed levelData.
 * 
 * @typedef {Function}
 *   module:meteoJS/thermodynamicDiagram/plotDataArea~getCoordinatesByLevelData
 * @param {string} dataGroupId - Data group id.
 * @param {module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding}
 *   sounding - Corresponding sounding.
 * @param {module:meteoJS/sounding~levelData}
 *   levelData - Level data of the sounding.
 * @param {module:meteoJS/thermodynamicDiagram/plotDataArea.PlotDataArea}
 *   plotArea - Plot-Area.
 * @returns {Object} - Containing x and y.
 */

/**
 * Draws data into a SVG node.
 * 
 * @typedef {Function}
 *   module:meteoJS/thermodynamicDiagram/plotDataArea~insertDataGroupInto
 * @param {external:SVG} svgNode - Insert sounding data into this SVG node.
 * @param {string} dataGroupId - Data group id.
 * @param {module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding}
 *   sounding - Corresponding sounding.
 * @param {Object[]}
 *   data - Data of the sounding, containing x and y coordinates and levelData.
 * @param {module:meteoJS/thermodynamicDiagram/plotDataArea.PlotDataArea}
 *   plotArea - Plot-Area.
 */

/**
 * Filter data point before drawing.
 * 
 * @typedef {Function}
 *   module:meteoJS/thermodynamicDiagram/plotDataArea~filterDataPoint
 * @param {Object} pointData - Point data.
 * @param {module:meteoJS/sounding~levelData} pointData.levelData - Level data.
 * @param {number} pointData.x - x coordinate of the data point.
 * @param {nmber} pointData.y - y coordinate of the data point.
 * @param {Object} lastPointData - Data of the last point.
 * @param {module:meteoJS/sounding~levelData} [lastPointData.levelData]
 *   Level data of the last point.
 * @param {number} [lastPointData.x] - x coordinate of the last data point.
 * @param {nmber} [lastPointData.y] - y coordinate of the last data point.
 */

/**
 * Options for the constructor.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram/plotArea~options}
 *   module:meteoJS/thermodynamicDiagram/plotDataArea~options
 * @property {module:meteoJS/thermodynamicDiagram/plotDataArea~hoverLabelsOptions}
 *   [hoverLabels] - Hover labels options.
 * @param {module:meteoJS/thermodynamicDiagram/plotDataArea~getSoundingVisibility} [getSoundingVisibility]
 *   Takes a sounding object and returns the visibility for the area.
 * @param {string[]} [dataGroupIds=[]] - IDs of several grouped datas.
 * @param {module:meteoJS/thermodynamicDiagram/plotDataArea~getCoordinatesByLevelData}
 *   [getCoordinatesByLevelData] - Coordinate function.
 * @param {module:meteoJS/thermodynamicDiagram/plotDataArea~insertDataGroupInto}
 *   [insertDataGroupInto] - SVG drawing function.
 * @param {undefined|module:meteoJS/thermodynamicDiagram/plotDataArea~filterDataPoint}
 *   [filterDataPoint] - Function to filter data points, that shouldn't be
 *   plotted. If undefined, no data point is filtered
 *   (expect minDataPointsDistance is set).
 * @param {number} [minDataPointsDistance=0]
 *   Minimum distance between data points in pixels. If filterDataPoint is set,
 *   minDataPointsDistance is ignored.
 */

/**
 * Abstract class to define an area on the SVG with sounding data.
 * 
 * <pre><code>import PlotDataArea from 'meteojs/thermodynamicDiagram/PlotDataArea';</code></pre>
 * 
 * @extends module:meteoJS/thermodynamicDiagram/plotArea.PlotArea
 * 
 * @fires module:meteoJS/thermodynamicDiagram/plotDataArea#add:sounding
 * @fires module:meteoJS/thermodynamicDiagram/plotDataArea#remove:sounding
 * @fires module:meteoJS/thermodynamicDiagram/plotDataArea#prebuild:sounding
 * @fires module:meteoJS/thermodynamicDiagram/plotDataArea#postbuild:sounding
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
    hoverLabels = {},
    getSoundingVisibility = sounding => sounding.visible,
    dataGroupIds = [],
    getCoordinatesByLevelData = () => { return { x: undefined, y: undefined }; },
    insertDataGroupInto = () => {},
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
      events
    });
    
    /**
     * @type Function
     * @private
     */
    this._getSoundingVisibility = getSoundingVisibility;
    
    /**
     * @type string[]
     * @private
     */
    this._dataGroupIds = dataGroupIds;
    
    /**
     * @type module:meteoJS/thermodynamicDiagram/plotDataArea~getCoordinatesByLevelData
     * @private
     */
    this._getCoordinatesByLevelData = getCoordinatesByLevelData;
    
    /**
     * @type module:meteoJS/thermodynamicDiagram/plotDataArea~insertDataGroupInto
     * @private
     */
    this._insertDataGroupInto = insertDataGroupInto;
    
    /**
     * @type undefined|module:meteoJS/thermodynamicDiagram/plotDataArea~filterDataPoint
     * @private
     */
    this._filterDataPoint = filterDataPoint;
    
    /**
     * @type number
     * @private
     */
    this._minDataPointsDistance = minDataPointsDistance;
    
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
    
    /**
     * @type external:SVG
     * @private
     */
    this._hoverLabelsGroup = this.svgNode.group();

    /**
     * @type module:meteoJS/thermodynamicDiagram/plotDataArea~getHoverSounding
     * @private
     */
    this._getHoverSounding; // Will be set inside _initHoverLabels()
    
    this._initHoverLabels(hoverLabels);
  }
  
  /**
   * Groups of different data to plot onto the plot area.
   * 
   * @type string[]
   * @readonly
   */
  get dataGroupIds() {
    return this._dataGroupIds;
  }
  
  /**
   * Returns x and y coordinated of some sounding data.
   * 
   * @type module:meteoJS/thermodynamicDiagram/plotDataArea~getCoordinatesByLevelData
   * @readonly
   */
  get getCoordinatesByLevelData() {
    return this._getCoordinatesByLevelData;
  }
  
  /**
   * Minimum distance between data points in pixels.
   * 
   * @type number
   */
  get minDataPointsDistance() {
    return this._minDataPointsDistance;
  }
  set minDataPointsDistance(minDataPointsDistance) {
    const oldValue = this._minDataPointsDistance;
    this._minDataPointsDistance = minDataPointsDistance;
    
    if (oldValue != this._minDataPointsDistance)
      this.drawSoundings();
  }
  
  /**
   * The current sounding, for which hover labels should be shown.
   * 
   * @type undefined|module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding
   * @readonly
   * @private
   */
  get hoverLabelsSounding() {
    const soundings = [];
    for (let sounding of this._soundings.keys()) {
      if (this._getSoundingVisibility(sounding))
        soundings.push(sounding);
    }
    if (soundings.length > 0)
      return this._getHoverSounding(soundings);
    return undefined;
  }
  
  /**
   * Adds a sounding to draw into the area.
   * 
   * @param {module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding}
   *   sounding - Sounding object.
   */
  addSounding(sounding) {
    let group = this._svgNodeData.group();
    let listenerKeyVisible = sounding.on('change:visible',
      () => this.onChangeSoundingVisibility(sounding, group));
    let listenerKeyOptions = sounding.on('change:options', () => {
      if (this.coordinateSystem !== undefined)
        this.drawSounding(sounding, group);
      this.onChangeSoundingVisibility(sounding, group);
    });
    this._soundings.set(sounding, {
      group,
      listenerKeyVisible,
      listenerKeyOptions
    });
    this.trigger('add:sounding', sounding);
    
    if (this.coordinateSystem !== undefined)
      this.drawSounding(sounding, group);
    /* Don't call onChangeSoundingVisibility here.
     * This is due to PlotAltitudeDataArea. In this class, hoverLabels will get
     * invisible, when onChangeSoundingVisibility is called. This is not itended
     * when the added sounding is invisible. But intended if the sounding is
     * visible. */
    this.setDisplayOfSounding(sounding, group);
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
    
    this.drawSoundings();
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
    this.setDisplayOfSounding(sounding, group);
    this._hoverLabelsGroup.clear();
  }
  
  /**
   * Sets 'display' property of a SVG group of a sounding, depending of the
   * sounding's visibility.
   * 
   * @param {module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding}
   *   sounding - Sounding object.
   * @param {external:SVG} group - SVG group, SVG.G.
   * @protected
   */
  setDisplayOfSounding(sounding, group) {
    group.css('display',
      this._getSoundingVisibility(sounding) ? 'inline' : 'none');
  }
  
  /**
   * Draws all soundings.
   * 
   * @protected
   */
  drawSoundings() {
    if (this.coordinateSystem === undefined)
      return;
    
    for (let sounding of this._soundings.keys())
      this.drawSounding(sounding, this._soundings.get(sounding).group);
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
    
    this.trigger('preinsert:sounding', { sounding, node: group });
    
    const soundingGroup = group.group();
    
    let data = {};
    const filterDataPointFunction = this._getFilterDataPointFunction();
    let lastLevel = {};
    sounding.sounding.getLevels().reverse().forEach(pres => {
      const levelData = sounding.sounding.getData(pres);
      
      this._dataGroupIds.forEach(dataGroupId => {
        if (!(dataGroupId in data))
          data[dataGroupId] = [];
        
        const level = {
          levelData,
          x: undefined,
          y: undefined
        };
        const {x, y} =
          this._getCoordinatesByLevelData(dataGroupId,
            sounding, level.levelData, this);
        level.x = x;
        level.y = y;
        
        if (x === undefined ||
            y === undefined ||
            filterDataPointFunction !== undefined &&
            filterDataPointFunction(level, {...lastLevel}))
          return;
        
        lastLevel = level;
        data[dataGroupId].push(level);
      });
    });
    
    Object.keys(data).forEach(dataGroupId => {
      if (data[dataGroupId].length > 0)
        this._insertDataGroupInto(soundingGroup, dataGroupId,
          sounding, data[dataGroupId], this);
    });
    
    this.trigger('postinsert:sounding', { sounding, node: group });

    /* Only hide hoverLabels, when Sounding is visible. */
    if (this._getSoundingVisibility(sounding))
      this._hoverLabelsGroup.clear();
  }
  
  /**
   * @private
   */
  _getFilterDataPointFunction() {
    return (this._filterDataPoint === undefined) ?
      makeFilterDataPointFunction(this._minDataPointsDistance) :
      this._filterDataPoint;
  }
  
  /**
   * Initialize hover labels options.
   * 
   * @param {module:meteoJS/thermodynamicDiagram/plotDataArea~hoverLabelsOptions}
   *   options - Hover labels options.
   */
  _initHoverLabels({
    visible = true,
    type = 'mousemove',
    maxDistance = undefined,
    insertLabelsFunc = undefined,
    getLevelData = () => {},
    getHoverSounding = soundings => soundings.shift()
  }) {
    this._getHoverSounding = getHoverSounding;

    if (!visible ||
        insertLabelsFunc === undefined)
      return;
    
    this.on('change:extent', () => this._hoverLabelsGroup.clear());
    this.on(type, e => {
      const hoverLabelsSounding = this.hoverLabelsSounding;
      if (hoverLabelsSounding === undefined)
        return;

      insertLabelsFunc(hoverLabelsSounding,
        getLevelData({ hoverLabelsSounding, e , maxDistance }),
        this._hoverLabelsGroup);
    });
  }
}
export default PlotDataArea;

/**
 * Creates a filterDataPoint function. It filters data points, which doesn't
 * have a minimal distance.
 * 
 * @param {number} minDataPointsDistance - Minimal distance.
 * @returns {undefined|module:meteoJS/thermodynamicDiagram/plotDataArea~filterDataPoint}
 *   filterDataPoint function.
 * @private
 */
function makeFilterDataPointFunction(minDataPointsDistance) {
  if (minDataPointsDistance === 0)
    return undefined;
  
  return ({ x, y }, lastPoint) => {
    if (lastPoint.x === undefined ||
        lastPoint.y === undefined) {
      lastPoint.x = x;
      lastPoint.y = y;
      return false;
    }
    const distance =
      Math.sqrt(Math.pow(x - lastPoint.x, 2) + Math.pow(y - lastPoint.y, 2));
    const result = (distance < minDataPointsDistance);
    if (!result) {
      lastPoint.x = x;
      lastPoint.y = y;
    }
    return result;
  };
}