/**
 * @module meteoJS/thermodynamicDiagram/axes/yAxis
 */
import { tempKelvinToCelsius, tempCelsiusToKelvin } from '../../calc.js';
import xAxis from './xAxis.js';

/**
 * Definition of the options for the constructor.
 * @typedef {Object} module:meteoJS/thermodynamicDiagram/axes/yAxis~options
 * @param {boolean} visible Visibility of the yAxis.
 * @param {undefined|integer} x Horizontal position of the yAxis container.
 * @param {undefined|integer} y Vertical position of the yAxis container.
 * @param {undefined|integer} width Width of the yAxis container.
 * @param {undefined|integer} height Height of the yAxis container.
 * @param {module:meteoJS/thermodynamicDiagram/axes/axisLabels~options} labels
 *   Options for the yAxis Labels.
 * @param {module:meteoJS/thermodynamicDiagram/axes/axisTitle~options} title
 *   Options for the title of the y-Axis.
 */

/**
 * Class to draw the yAxis labelling.
 * Constructed by {@link module:meteoJS/thermodynamicDiagram.ThermodynamicDiagram}.
 * 
 * Preconditions for options:
 * * x, y, width, height mustn't be undefined.
 * 
 * @extends {module:meteoJS/thermodynamicDiagram/axes/xAxis.xAxis}
 */
export class yAxis extends xAxis {
  
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
        svgLabelsGroup.plain(Math.round(tempKelvinToCelsius(TKelvin))).attr({
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
      fontSize = 12;
      svgTitleGroup.plain(this._titleOptions.text)
        .attr({
          x: this.width/2,
          y: this.height - fontSize*0.3,
          fill: this._titleOptions.style.color
        })
        .font({
          size: fontSize,
          anchor: 'middle'
        })
        .rotate(-90);
    }
  }
  
}
export default yAxis;