/**
 * @module meteoJS/thermodynamicDiagram/axes/yAxis
 */

import $ from 'jquery';

/**
 * Definition of the options for the constructor.
 * @typedef {Object} meteoJS/thermodynamicDiagram/axes/yAxis~options
 * @param {boolean} visible Visibility of the yAxis.
 * @param {undefined|integer} x Horizontal position of the yAxis container.
 * @param {undefined|integer} y Vertical position of the yAxis container.
 * @param {undefined|integer} width Width of the yAxis container.
 * @param {undefined|integer} height Height of the yAxis container.
 * @param {meteoJS/thermodynamicDiagram/axes/axisLabels~options} labels
 *   Options for the yAxis Labels.
 * @param {meteoJS/thermodynamicDiagram/axes/axisTitle~options} title
 *   Options for the title of the y-Axis.
 * 
 * Noch integrieren:
 */

/**
 * @classdesc
 * Class to draw the yAxis labelling.
 * Called by meteoJS.thermodynamicDiagram.
 * 
 * Preconditions for options:
 * * x, y, width, height mustn't be undefined.
 * 
 * @constructor
 * @internal
 * @param {meteoJS.thermodynamicDiagram} main
 * @param {meteoJS/thermodynamicDiagram/yAxis~options} options
 *   yAxis options.
 */
export default class yAxis {

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
      var svgLabelsGroup = this.svgNode.group();
      var isothermsAzimut = 10;
      var minT = Math.ceil(meteoJS.calc.tempKelvinToCelsius(this.cos.getTByXY(0, 0))/isothermsAzimut)*isothermsAzimut;
      var maxT = Math.floor(meteoJS.calc.tempKelvinToCelsius(this.cos.getTByXY(this.options.width, 0))/isothermsAzimut)*isothermsAzimut;
      var fontSize = 10;
      for (var T=minT; T<=maxT; T+=isothermsAzimut) {
        var TKelvin = meteoJS.calc.tempCelsiusToKelvin(T);
        svgLabelsGroup.plain(Math.round(meteoJS.calc.tempKelvinToCelsius(TKelvin))).attr({
          x: this.cos.getXByYT(0, TKelvin),
          y: fontSize,
          fill: this.options.labels.style.color
        })
        .font({
          size: fontSize+'px',
          anchor: 'middle'
        });
      }
    }
    if (this.options.title.text !== undefined) {
      var svgTitleGroup = this.svgNode.group();
      var fontSize = 12;
      svgTitleGroup.plain(this.options.title.text)
      .attr({
        x: this.options.width/2,
        y: this.options.height - fontSize*0.3,
        fill: this.options.title.style.color
      })
      .font({
        size: fontSize,
        anchor: 'middle'
      });
    }
  }
}

}