/**
 * @module meteoJS/thermodynamicDiagram/axes/xAxis
 */

meteoJS.thermodynamicDiagram.axes = {};

/**
 * Definition of the options for the constructor.
 * @typedef {Object} meteoJS/thermodynamicDiagram/axes/xAxis~options
 * @param {boolean} visible Visibility of the xAxis.
 * @param {undefined|integer} x Horizontal position of the xAxis container.
 * @param {undefined|integer} y Vertical position of the xAxis container.
 * @param {undefined|integer} width Width of the xAxis container.
 * @param {undefined|integer} height Height of the xAxis container.
 * @param {meteoJS/thermodynamicDiagram/axes/axisLabels~options} labels
 *   Options for the xAxis Labels.
 * @param {meteoJS/thermodynamicDiagram/axes/axisTitle~options} title
 *   Options for the title of the x-Axis.
 * 
 * Noch integrieren:
 */

/**
 * @classdesc
 * Class to draw the xAxis labelling.
 * Called by meteoJS.thermodynamicDiagram.
 * 
 * Preconditions for options:
 * * x, y, width, height mustn't be undefined.
 * 
 * @constructor
 * @internal
 * @param {meteoJS.thermodynamicDiagram} main
 * @param {meteoJS/thermodynamicDiagram/xAxis~options} options
 *   xAxis options.
 */
meteoJS.thermodynamicDiagram.axes.xAxis = function (main, options) {
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
};

meteoJS.thermodynamicDiagram.axes.xAxis.prototype.getX = function () {
  return this.options.x;
};
meteoJS.thermodynamicDiagram.axes.xAxis.prototype.getY = function () {
  return this.options.y;
};
meteoJS.thermodynamicDiagram.axes.xAxis.prototype.getWidth = function () {
  return this.options.width;
};
meteoJS.thermodynamicDiagram.axes.xAxis.prototype.getHeight = function () {
  return this.options.height;
};

/**
 * @internal
 */
meteoJS.thermodynamicDiagram.axes.xAxis.prototype.plotAxes = function () {
  this.svgNode.clear();
  if (this.options.visible) {
    if (this.options.labels.enabled) {
      var svgLabelsGroup = this.svgNode.group();
      var isobarsAzimut = 50;
      var minLevel = Math.ceil(this.cos.getPByXY(0, this.options.height)/isobarsAzimut)*isobarsAzimut;
      var maxLevel = Math.floor(this.cos.getPByXY(0, 0)/isobarsAzimut)*isobarsAzimut;
      var fontSize = 11;
      for (var level=minLevel; level<=maxLevel; level+=isobarsAzimut) {
        var y = this.options.height - this.cos.getYByXP(0, level);
        var text = svgLabelsGroup.plain(level).attr({
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
      var svgTitleGroup = this.svgNode.group();
      var fontSize = 12;
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
};