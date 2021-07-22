/**
 * @module meteoJS/thermodynamicDiagram/windspeedProfile
 */
import {
  windspeedMSToKN,
  windspeedKNToMS
} from '../calc.js';
import {
  getNormalizedFontOptions,
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
 * Options for the constructor.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram/plotAltitudeDataArea~options}
 *   module:meteoJS/thermodynamicDiagram/windspeedProfile~options
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
    windspeedMax = windspeedKNToMS(150),
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
    
    svgNode
      .line(0, 0, 0, this.height)
      .stroke({color: 'black', width: 1});
    svgNode
      .line(this.width, 0, this.width, this.height)
      .stroke({color: 'black', width: 1});
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
}
export default WindspeedProfile;