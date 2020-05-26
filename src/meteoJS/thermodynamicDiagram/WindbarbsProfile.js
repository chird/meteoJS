/**
 * @module meteoJS/thermodynamicDiagram/windbarbsProfile
 */
import { windspeedMSToKN } from '../calc.js';
import { drawTextInto } from './Functions.js';
import PlotAltitudeDataArea from './PlotAltitudeDataArea.js';

/**
 * Options for the constructor.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram/plotAltitudeDataArea~options}
 *   module:meteoJS/thermodynamicDiagram/windbarbsProfile~options
 * @param {number} [windbarbLength]
 *   Length of windbarbs. Default is 40% of the Plot-Area width.
 */

/**
 * Class to draw the profile with windbarbs.
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
      const xMiddle = plotArea.width/2;
      
      data.forEach(windbarbData => {
        const groupArrow = svgNode.group();
        let yAddons = windbarbData.y - plotArea.options.windbarbs.barbsLength;
        const widthAddons = plotArea.options.windbarbs.barbsLength/4;
        groupArrow.line(xMiddle, yAddons, xMiddle, windbarbData.y)
          .stroke(sounding.options.windprofile.windbarbs.style);
        let windspeed = windspeedMSToKN(windbarbData.levelData.wspd);
        while (windspeed >= 50) {
          groupArrow.polyline([[xMiddle, yAddons], [xMiddle+widthAddons*2, yAddons+widthAddons*0.8/2], [xMiddle, yAddons+widthAddons*0.8]]).fill('none').stroke(sounding.options.windprofile.windbarbs.style);
          yAddons += widthAddons;
          windspeed -= 50;
        }
        while (windspeed >= 10) {
          groupArrow.line(xMiddle, yAddons+widthAddons/2, xMiddle+widthAddons*2, yAddons).stroke(sounding.options.windprofile.windbarbs.style);
          yAddons += widthAddons/2;
          windspeed -= 10;
        }
        if (windspeed >= 5)
          groupArrow.line(xMiddle, yAddons+widthAddons/2, xMiddle+widthAddons, yAddons+widthAddons/4).stroke(sounding.options.windprofile.windbarbs.style);
        
        groupArrow.rotate(windbarbData.levelData.wdir, xMiddle, windbarbData.y);
      });
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
        sounding => sounding.visible && sounding.options.windprofile.windbarbs.visible,
      dataGroupIds,
      getCoordinatesByLevelData,
      insertDataGroupInto
    });
    
    /**
     * @type number
     * @private
     */
    this._windbarbLength = windbarbLength;
    if (this._windbarbLength === undefined)
      this._windbarbLength = this.width * 2/3;
    
    this.init();
  }
}
export default WindbarbsProfile;