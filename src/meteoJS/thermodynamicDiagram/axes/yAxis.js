/**
 * @module meteoJS/thermodynamicDiagram/axes/yAxis
 */
import { getNormalizedLineStyleOptions } from '../Functions.js';
import PlotArea from '../PlotArea.js';

/**
 * Options for the constructor.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram/plotArea~options}
 *   module:meteoJS/thermodynamicDiagram/axes/yAxis~options
 * @property {module:meteoJS/thermodynamicDiagram/axes/axisLabels~options} labels
 *   Options for the yAxis Labels.
 * @property {module:meteoJS/thermodynamicDiagram/axes/axisTitle~options} title
 *   Options for the title of the x-Axis.
 */

/**
 * Class to draw the yAxis labelling.
 * 
 * @extends module:meteoJS/thermodynamicDiagram/plotArea.PlotArea
 */
export class yAxis extends PlotArea {

  /**
   * @param {module:meteoJS/thermodynamicDiagram/yAxis~options} options
   *   Options.
   */
  constructor({
    svgNode = undefined,
    coordinateSystem,
    x,
    y,
    width,
    height,
    style = {},
    visible = true,
    events = {},
    labels = {},
    title = {}
  }) {
    if (style.overflow === undefined)
      style.overflow = 'visible';
    
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
     * @type Object
     * @private
     */
    this._labelsOptions = getNormalizedLabelsOptions(labels);
    
    /**
     * @type Object
     * @private
     */
    this._titleOptions = getNormalizedTitleOptions(title);
    
    this.init();
  }
  
  /**
   * Draw background into SVG group.
   * 
   * @override
   */
  _drawBackground(svgNode) {
    super._drawBackground(svgNode);
    
    if (this._labelsOptions.enabled) {
      let svgLabelsGroup = svgNode.group();
      let isobarsAzimut = 50;
      let minLevel = Math.ceil(this.coordinateSystem.getPByXY(0, this.height)/isobarsAzimut)*isobarsAzimut;
      let maxLevel = Math.floor(this.coordinateSystem.getPByXY(0, 0)/isobarsAzimut)*isobarsAzimut;
      let fontSize = 11;
      for (let level=minLevel; level<=maxLevel; level+=isobarsAzimut) {
        let y = this.height - this.coordinateSystem.getYByXP(0, level);
        let text = svgLabelsGroup.plain(level).attr({
          y: y+fontSize*0.3,
          x: this.width
        });
        text
          .font({
            size: fontSize+'px',
            anchor: 'end'
          })
          .attr({
            fill: this._labelsOptions.style.color
          });
      }
    }
    
    if (this._titleOptions.text !== undefined) {
      let svgTitleGroup = svgNode.group();
      let fontSize = 12;
      svgTitleGroup.plain(this._titleOptions.text)
        .attr({
          x: fontSize*0.4,
          y: this.height/2,
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

function getNormalizedLabelsOptions({
  enabled = true,
  style = {}
}) {
  let options = {
    enabled,
    style
  };
  options.style = getNormalizedLineStyleOptions(options.style);
  return options;
}

function getNormalizedTitleOptions({
  align = 'middle',
  style = {},
  text = undefined
}) {
  let options = {
    align,
    style,
    text
  };
  options.style = getNormalizedLineStyleOptions(options.style);
  return options;
}