/**
 * @module meteoJS/thermodynamicDiagram/windspeedProfile
 */
import {
  windspeedMSToKN,
  windspeedKNToMS
} from '../calc.js';
import {
  getNormalizedFontOptions,
  getNormalizedLineOptions,
  drawTextInto
} from './Functions.js';
import PlotAltitudeDataArea from './PlotAltitudeDataArea.js';

/**
 * Triggered, when the windspeedMax changes.
 * 
 * @event module:meteoJS/thermodynamicDiagram/windspeedProfile#change:windspeedMax
 */

/**
 * Options for labels on hovering the windspeed profile.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram/plotAltitudeDataArea~hoverLabelsOptions}
 *   module:meteoJS/thermodynamicDiagram/windspeedProfile~hoverLabelsOptions
 * @property {module:meteoJS/thermodynamicDiagram/tdDiagram~labelsOptions}
 *   [windspeed] - Options for windspeed label.
 * @property {number} [windspeedMax=77.17]
 *   The maximum visible windspeed. Unit: m/s.
 */

/**
 * Isobar grid lines.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   module:meteoJS/thermodynamicDiagram/windspeedProfile~isobarsOptions
 * @property {number} [max]
 *   Maximum isobar value for the grid lines. By default, this is the
 *   maximum pressure of the coordinate system for x=0.
 * @property {number} [min]
 *   Minimum isobar value for the grid lines. By default, this is the
 *   minimum pressure of the coordinate system for x=0.
 * @property {number} [interval=100]
 *   Interval between the grid lines.
 */

/**
 * Windspeed grid lines.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   module:meteoJS/thermodynamicDiagram/windspeedProfile~windspeedOptions
 * @property {number} [max=undefined]
 *   Maximum windspeed value for the grid lines. By default, this is the
 *   maximum visible windspeed.
 * @property {number} [min=0]
 *   Value for the first grid line.
 * @property {number} [interval=25.72]
 *   Interval between the grid lines.
 */

/**
 * Options for the constructor.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram/plotAltitudeDataArea~options}
 *   module:meteoJS/thermodynamicDiagram/windspeedProfile~options
 * @property {Object} [grid] - Options for grid.
 * @property {module:meteoJS/thermodynamicDiagram/windspeedProfile~windspeedOptions}
 *   [windspeed] - Options for windspeed grid. By default, the lines are grey and dashed.
 * @property {module:meteoJS/thermodynamicDiagram/windspeedProfile~isobarsOptions}
 *   [isobars] - Options for isobar grid. By default, the lines are grey and dashed.
 */

/**
 * Class to draw windspeed profiles.
 * 
 * <pre><code>import WindspeedProfile from 'meteojs/thermodynamicDiagram/WindspeedProfile';</code></pre>
 * 
 * @extends module:meteoJS/thermodynamicDiagram/plotAltitudeDataArea.PlotAltitudeDataArea
 * @fires module:meteoJS/thermodynamicDiagram/windspeedProfile#change:windspeedMax
 */
export class WindspeedProfile extends PlotAltitudeDataArea {
  
  /**
   * @param {module:meteoJS/thermodynamicDiagram/windspeedProfile~options} options
   *   Options.
   */
  constructor({
    svgNode = undefined,
    coordinateSystem = undefined,
    x = undefined,
    y = undefined,
    width = undefined,
    height = undefined,
    style = {},
    visible = true,
    events = {},
    hoverLabels = {},
    dataGroupIds = ['windspeed'],
    getCoordinatesByLevelData = (dataGroupId, sounding, levelData, plotArea) => {
      if (levelData.pres === undefined ||
          levelData.wspd === undefined)
        return {};
      
      return {
        x: plotArea.width * levelData.wspd / plotArea.windspeedMax,
        y: plotArea.coordinateSystem.height -
          plotArea.coordinateSystem.getYByXP(0, levelData.pres)
      };
    },
    insertDataGroupInto = (svgNode, dataGroupId, sounding, data) => {
      svgNode
        .polyline(data.map(level => [ level.x, level.y ]))
        .fill('none')
        .stroke(sounding.options.windprofile.windspeed.style);
    },
    windspeedMax = windspeedKNToMS(150),
    grid = {},
    filterDataPoint = undefined,
    minDataPointsDistance = 0
  }) {
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
      getSoundingVisibility:
        sounding => sounding.visible && sounding.options.windprofile.windspeed.visible,
      dataGroupIds,
      getCoordinatesByLevelData,
      insertDataGroupInto,
      filterDataPoint,
      minDataPointsDistance
    });

    /**
     * @type number
     * @private
     */
    this._windspeedMax = windspeedMax;

    this._gridOptions = this.getNormalizedGridOptions(grid);
    
    this.init();
  }

  /**
   * The maximum visible windspeed. Unit: m/s.
   * 
   * @type number
   */
  get windspeedMax() {
    return this._windspeedMax;
  }
  set windspeedMax(windspeedMax) {
    const oldWindspeedMax = this._windspeedMax;
    this._windspeedMax = windspeedMax;
    if (this._windspeedMax != oldWindspeedMax)
      this.trigger('change:windspeedMax');
  }
  
  /**
   * Draw background into SVG group.
   * 
   * @override
   */
  _drawBackground(svgNode) {
    super._drawBackground(svgNode);

    // isobars
    if (this._gridOptions.isobars.visible) {
      const isobarsNode = svgNode.group();
      for (let i=this._gridOptions.isobars.min; i<=this._gridOptions.isobars.max; i+=this._gridOptions.isobars.interval) {
        const y = this.coordinateSystem.height - this.coordinateSystem.getYByXP(0, i);
        isobarsNode
          .line(0, y, this.width, y)
          .stroke(this._gridOptions.isobars.style);
      }
    }

    // windspeed grid
    if (this._gridOptions.windspeed.visible) {
      const windspeedNode = svgNode.group();
      for (let i=this._gridOptions.windspeed.min; i<=this._gridOptions.windspeed.max; i+=this._gridOptions.windspeed.interval) {
        const x = this.width * i / this.windspeedMax;
        windspeedNode
          .line(x, 0, x, this.height)
          .stroke(this._gridOptions.windspeed.style);
      }
    }
  }
  
  /**
   * Initialize hover labels options.
   * 
   * @param {module:meteoJS/thermodynamicDiagram/windspeedProfile~hoverLabelsOptions}
   *   options - Hover labels options.
   * @override
   */
  _initHoverLabels({
    visible = true,
    type = 'mousemove',
    maxDistance = undefined,
    remote = true,
    insertLabelsFunc = undefined,
    windspeed = {}
  }) {
    if (!('visible' in windspeed))
      windspeed.visible = true;
    if (!('style' in windspeed))
      windspeed.style = {};
    windspeed.font = getNormalizedFontOptions(windspeed.font, {
      anchor: 'end',
      'alignment-baseline': 'bottom'
    });
    if (!('fill' in windspeed))
      windspeed.fill = {};
    if (windspeed.fill.opacity === undefined)
      windspeed.fill.opacity = 0.7;
    windspeed.radius = ('radius' in windspeed) ? windspeed.radius : undefined;
    windspeed.radiusPlus =
      ('radiusPlus' in windspeed) ? windspeed.radiusPlus : 2;
    if (windspeed.horizontalMargin === undefined)
      windspeed.horizontalMargin = 10;
    
    if (insertLabelsFunc === undefined)
      insertLabelsFunc = this._makeInsertLabelsFunc(windspeed);
    
    super._initHoverLabels({
      visible,
      type,
      maxDistance,
      remote,
      insertLabelsFunc
    });
  }
  
  /**
   * Makes a default insertLabelsFunc.
   * 
   * @param {Object} windspeed
   * @private
   */
  _makeInsertLabelsFunc(windspeed) {
    return (sounding, levelData, group) => {
      group.clear();
      
      if (levelData.pres === undefined)
        return;
      
      if (!windspeed.visible ||
          levelData.wspd === undefined)
        return;
      
      const { x, y } =
        this._getCoordinatesByLevelData('windspeed',
          sounding, levelData, this);
      if (x === undefined ||
          y === undefined)
        return;
      
      const radius = (windspeed.radius === undefined)
        ? this.hoverLabelsSounding.options.windprofile.windspeed.style.width / 2 +
          windspeed.radiusPlus
        : windspeed.radius;
      const fillOptions = windspeed.style;
      if (!('color' in fillOptions))
        fillOptions.color = sounding.options.windprofile.windspeed.style.color;
      const font = {...windspeed.font};
      if (font.anchor == 'start' &&
          this.width - x < 45)
        font.anchor = 'end';
      if (font.anchor == 'end' &&
          x < 45)
        font.anchor = 'start';
      if (font['alignment-baseline'] == 'bottom' &&
          y < font.size * 5/4)
        font['alignment-baseline'] = 'top';
      if (font['alignment-baseline'] == 'top' &&
          this.height - y < font.size * 5/4)
        font['alignment-baseline'] = 'bottom';
      group
        .circle(2 * radius)
        .attr({ cx: x, cy: y })
        .fill(fillOptions);
      drawTextInto({
        node: group,
        text: `${Math.round(windspeedMSToKN(levelData.wspd)*10)/10} kn`,
        x,
        y,
        horizontalMargin: windspeed.horizontalMargin,
        verticalMargin: windspeed.verticalMargin,
        font: font,
        fill: windspeed.fill
      });
    };
  }
  
  /**
   * Normalizes options for grid.
   * 
   * @private
   */
  getNormalizedGridOptions({
    windspeed = {},
    isobars = {}
  }) {
    windspeed = getNormalizedIsolineOptions(windspeed, {
      min: 0,
      max: this._windspeedMax,
      interval: windspeedKNToMS(50),
      style: {
        color: 'grey',
        dasharray: '2 2'
      }
    });
    let isobarsInterval = 100;
    isobars = getNormalizedIsolineOptions(isobars, {
      min: Math.ceil(this.coordinateSystem.getPByXY(0, this.height)/isobarsInterval)*isobarsInterval,
      max: Math.floor(this.coordinateSystem.getPByXY(0, 0)/isobarsInterval)*isobarsInterval,
      interval: isobarsInterval,
      style: {
        color: 'grey',
        dasharray: '1 3'
      }
    });
    
    return {
      windspeed,
      isobars
    };
  }
}
export default WindspeedProfile;

/**
 * Normalize grid options.
 * 
 * @param {module:meteoJS/thermodynamicDiagram/windspeedProfile~isobarsOptions|module:meteoJS/thermodynamicDiagram/windspeedProfile~windspeedOptions}
 *   options - Options.
 * @returns {module:meteoJS/thermodynamicDiagram/windspeedProfile~isobarsOptions|module:meteoJS/thermodynamicDiagram/windspeedProfile~windspeedOptions}
 *   Normalized options.
 */
function getNormalizedIsolineOptions({
  min = undefined,
  max = undefined,
  interval = undefined,
  ...rest
}, defaults = {}) {
  const options = getNormalizedLineOptions({ ...rest }, defaults);
  options.min = (min === undefined) ? defaults.min : min;
  options.max = (max === undefined) ? defaults.max : max;
  options.interval = (interval === undefined) ? defaults.interval : interval;
  return options;
}