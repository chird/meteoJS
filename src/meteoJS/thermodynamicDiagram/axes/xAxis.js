/**
 * @module meteoJS/thermodynamicDiagram/axes/xAxis
 */

import $ from 'jquery';

/**
 * Definition of the options for the constructor.
 * @typedef {Object} module:meteoJS/thermodynamicDiagram/axes/xAxis~options
 * @param {boolean} visible Visibility of the xAxis.
 * @param {undefined|integer} x Horizontal position of the xAxis container.
 * @param {undefined|integer} y Vertical position of the xAxis container.
 * @param {undefined|integer} width Width of the xAxis container.
 * @param {undefined|integer} height Height of the xAxis container.
 * @param {module:meteoJS/thermodynamicDiagram/axes/axisLabels~options} labels
 *   Options for the xAxis Labels.
 * @param {module:meteoJS/thermodynamicDiagram/axes/axisTitle~options} title
 *   Options for the title of the x-Axis.
 * 
 * Noch integrieren:
 */

/**
 * Class to draw the xAxis labelling.
 * Constructed by {@link module:meteoJS/thermodynamicDiagram.ThermodynamicDiagram}.
 * 
 * Preconditions for options:
 * * x, y, width, height mustn't be undefined.
 */
export class xAxis {

  /**
   * @param {module:meteoJS.thermodynamicDiagram.ThermodynamicDiagram} main
   * @param {module:meteoJS/thermodynamicDiagram/xAxis~options} options
   *   xAxis options.
   */
  constructor(main, options) {
    this.options = $.extend(true, {
      visible: true,
      x: undefined,
      y: undefined,
      width: undefined,
      height: undefined,
      labels: {
        enabled: true,
        style: {
          color: undefined
        }
      },
      title: {
        align: 'middle',
        style: {
          color: undefined
        },
        text: undefined
      }
    }, options);
  
    this.cos = main.getCoordinateSystem();
  
    this.svgNode = main.getSVGNode().nested()
      .attr({
        x: this.options.x,
        y: this.options.y,
        width: this.options.width,
        height: this.options.height
      })
      .style({ overflow: 'hidden' });
    this.plotAxes();
  }

  getX() {
    return this.options.x;
  }
  getY() {
    return this.options.y;
  }
  getWidth() {
    return this.options.width;
  }
  getHeight() {
    return this.options.height;
  }

  /**
 * @internal
 */
  plotAxes() {
    this.svgNode.clear();
    if (this.options.visible) {
      if (this.options.labels.enabled) {
        let svgLabelsGroup = this.svgNode.group();
        let isobarsAzimut = 50;
        let minLevel = Math.ceil(this.cos.getPByXY(0, this.options.height)/isobarsAzimut)*isobarsAzimut;
        let maxLevel = Math.floor(this.cos.getPByXY(0, 0)/isobarsAzimut)*isobarsAzimut;
        let fontSize = 11;
        for (let level=minLevel; level<=maxLevel; level+=isobarsAzimut) {
          let y = this.options.height - this.cos.getYByXP(0, level);
          let text = svgLabelsGroup.plain(level).attr({
            y: y+fontSize*0.3,
            x: this.options.width
          });
          text
            .font({
              size: fontSize+'px',
              anchor: 'end'
            })
            .attr({
              fill: this.options.labels.style.color
            });
        }
      }
      if (this.options.title.text !== undefined) {
        let svgTitleGroup = this.svgNode.group();
        fontSize = 12;
        svgTitleGroup.plain(this.options.title.text)
          .attr({
            x: fontSize*0.4,
            y: this.options.height/2,
            fill: this.options.title.style.color
          })
          .font({
            size: fontSize,
            anchor: 'middle'
          })
          .rotate(-90);
      }
    }
  }

}
export default xAxis;