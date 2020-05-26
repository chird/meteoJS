/**
 * @module meteoJS/thermodynamicDiagram/windspeedProfile
 */
import { windspeedMSToKN } from '../calc.js';
import {
  getNormalizedFontOptions,
  drawTextInto
} from './Functions.js';
import PlotAltitudeDataArea from './PlotAltitudeDataArea.js';

/**
 * Options for labels on hovering the windspeed profile.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram/plotAltitudeDataArea~hoverLabelsOptions}
 *   module:meteoJS/thermodynamicDiagram/windspeedProfile~hoverLabelsOptions
 * @property {module:meteoJS/thermodynamicDiagram/tdDiagram~labelsOptions}
 *   [windspeed] - Options for windspeed label.
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
 * @extends module:meteoJS/thermodynamicDiagram/plotAltitudeDataArea.PlotAltitudeDataArea
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
        x: windspeedMSToKN(plotArea.width * levelData.wspd) / 150,
        y: plotArea.coordinateSystem.height -
          plotArea.coordinateSystem.getYByXP(0, levelData.pres)
      };
    },
    insertDataGroupInto = (svgNode, dataGroupId, sounding, data) => {
      svgNode
        .polyline(data.map(level => [ level.x, level.y ]))
        .fill('none')
        .stroke(sounding.options.windprofile.windspeed.style);
    }
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
      insertDataGroupInto
    });
    
    this.init();
  }
  
  /**
   * Draw background into SVG group.
   * 
   * @override
   */
  drawBackground(svgNode) {
    super.drawBackground(svgNode);
    
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
    snapToData = true,
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
      snapToData,
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
        font: windspeed.font,
        fill: windspeed.fill
      });
    };
  }
}
export default WindspeedProfile;