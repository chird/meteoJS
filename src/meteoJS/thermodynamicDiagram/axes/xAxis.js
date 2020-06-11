/**
 * @module meteoJS/thermodynamicDiagram/axes/xAxis
 */
import { tempKelvinToCelsius, tempCelsiusToKelvin } from '../../calc.js';
import yAxis from './yAxis.js';

/**
 * Class to draw the xAxis labelling.
 * 
 * @extends module:meteoJS/thermodynamicDiagram/axes/yAxis.yAxis
 */
export class xAxis extends yAxis {
  
  /**
   * Draw background into SVG group.
   * 
   * @override
   */
  drawBackground(svgNode) {
    svgNode.clear();
    //super.drawBackground(svgNode);
    
    if (this._labelsOptions.enabled) {
      let svgLabelsGroup = svgNode.group();
      let isothermsAzimut = 10;
      let minT = Math.ceil(tempKelvinToCelsius(this.coordinateSystem.getTByXY(0, 0))/isothermsAzimut)*isothermsAzimut;
      let maxT = Math.floor(tempKelvinToCelsius(this.coordinateSystem.getTByXY(this.width, 0))/isothermsAzimut)*isothermsAzimut;
      let fontSize = 10;
      for (let T=minT; T<=maxT; T+=isothermsAzimut) {
        let TKelvin = tempCelsiusToKelvin(T);
        svgLabelsGroup
          .plain(Math.round(tempKelvinToCelsius(TKelvin)))
          .attr({
            x: this.coordinateSystem.getXByYT(0, TKelvin),
            y: fontSize,
            fill: this._labelsOptions.style.color
          })
          .font({
            size: fontSize+'px',
            anchor: 'middle'
          });
      }
    }
    
    if (this._titleOptions.text !== undefined) {
      let svgTitleGroup = svgNode.group();
      let fontSize = 12;
      svgTitleGroup.plain(this._titleOptions.text)
        .attr({
          x: this.width/2,
          y: this.height - fontSize*0.3,
          fill: this._titleOptions.style.color
        })
        .font({
          size: fontSize,
          anchor: 'middle'
        });
    }
  }
  
}
export default xAxis;