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
 * @property {external:SVG} group - SVG node.
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
 * Options for the constructor.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram/plotArea~options}
 *   module:meteoJS/thermodynamicDiagram/plotDataArea~options
 * @param {module:meteoJS/thermodynamicDiagram/plotDataArea~getSoundingVisibility} [getSoundingVisibility]
 *   Takes a sounding object and returns the visibility for the area.
 * @param {string[]} [dataGroupIds=[]] - IDs of several grouped datas.
 * @param {module:meteoJS/thermodynamicDiagram/plotDataArea~getCoordinatesByLevelData}
 *   [getCoordinatesByLevelData] - Coordinate function.
 * @param {module:meteoJS/thermodynamicDiagram/plotDataArea~insertDataGroupInto}
 *   [insertDataGroupInto] - SVG drawing function.
 */

/**
 * Abstract class to define an area on the SVG with sounding data.
 * 
 * <pre><code>import PlotDataArea from 'meteoJS/thermodynamicDiagram/PlotDataArea';</code></pre>
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
    getSoundingVisibility = sounding => sounding.visible,
    dataGroupIds = [],
    getCoordinatesByLevelData = () => { return { x: undefined, y: undefined }; },
    insertDataGroupInto = () => {}
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
    
    this.trigger('preinsert:sounding', { sounding, group });
    
    const soundingGroup = group.group();
    
    let data = {};
    sounding.sounding.getLevels().forEach(pres => {
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
        if (x === undefined &&
            y === undefined)
          return;
        
        level.x = x;
        level.y = y;
        data[dataGroupId].push(level);
      });
    });
    
    Object.keys(data).forEach(dataGroupId => {
      if (data[dataGroupId].length > 0)
        this._insertDataGroupInto(soundingGroup, dataGroupId,
          sounding, data[dataGroupId], this);
    });
    
    this.trigger('postinsert:sounding', { sounding, group });
  }
}
export default PlotDataArea;