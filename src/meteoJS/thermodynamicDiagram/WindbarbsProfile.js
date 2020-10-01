/**
 * @module meteoJS/thermodynamicDiagram/windbarbsProfile
 */
import { drawWindbarbInto } from './Functions.js';
import PlotAltitudeDataArea from './PlotAltitudeDataArea.js';

/**
 * Options for the constructor.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram/plotAltitudeDataArea~options}
 *   module:meteoJS/thermodynamicDiagram/windbarbsProfile~options
 * @param {number} [windbarbLength]
 *   Length of windbarbs. Default is 40% of the Plot-Area width.
 * @param {number} [minDataPointsDistance]
 *   Minimum distance between data points in pixels. If filterDataPoint is set,
 *   minDataPointsDistance is ignored. If undefined, then minDataPointsDistance
 *   is set to the half of windbarbLength.
 */

/**
 * Class to draw the profile with windbarbs.
 * 
 * <pre><code>import WindbarbsProfile from 'meteojs/thermodynamicDiagram/WindbarbsProfile';</code></pre>
 * 
 * @extends module:meteoJS/thermodynamicDiagram/plotAltitudeDataArea.PlotAltitudeDataArea
 */
export class WindbarbsProfile extends PlotAltitudeDataArea {
  
  /**
   * @param {module:meteoJS/thermodynamicDiagram/windbarbsProfile~options}
   *   options - Options.
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
    windbarbLength = undefined,
    dataGroupIds = ['windbarbs'],
    getCoordinatesByLevelData = (dataGroupId, sounding, levelData, plotArea) => {
      if (levelData.pres === undefined ||
          levelData.wspd === undefined ||
          levelData.wdir === undefined)
        return {};
      
      return {
        x: plotArea.width / 2,
        y: plotArea.coordinateSystem.height -
          plotArea.coordinateSystem.getYByXP(0, levelData.pres)
      };
    },
    insertDataGroupInto = (svgNode, dataGroupId, sounding, data, plotArea) => {
      data.forEach(windbarbData => {
        drawWindbarbInto({
          node: svgNode,
          x: plotArea.width/2,
          y: windbarbData.y,
          wspd: windbarbData.levelData.wspd,
          wdir: windbarbData.levelData.wdir,
          length: plotArea._windbarbLength,
          strokeStyle: sounding.options.windprofile.windbarbs.style
        });
      });
    },
    filterDataPoint = undefined,
    minDataPointsDistance = undefined
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
        sounding => sounding.visible && sounding.options.windprofile.windbarbs.visible,
      dataGroupIds,
      getCoordinatesByLevelData,
      insertDataGroupInto,
      filterDataPoint,
      minDataPointsDistance:
        (minDataPointsDistance === undefined) ? 0 : minDataPointsDistance
    });
    
    /**
     * @type number
     * @private
     */
    this._windbarbLength = windbarbLength;
    if (this._windbarbLength === undefined)
      this._windbarbLength = this.width * 2/5;
    
    if (minDataPointsDistance === undefined)
      this.minDataPointsDistance = this._windbarbLength / 2;
    
    this.init();
  }
}
export default WindbarbsProfile;