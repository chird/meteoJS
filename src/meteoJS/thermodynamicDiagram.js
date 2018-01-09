﻿/**
 * @module meteoJS/thermodynamicDiagram
 */

/**
 * Definition of the options for the constructor.
 * @typedef {Object} meteoJS/thermodynamicDiagram~options
 * @param {HTMLNode} renderTo Element to render diagram into.
 * @param {undefined|interger} width Width of the whole container.
 * @param {undefined|integer} height Height of the whole container.
 * @param {meteoJS/thermodynamicDiagram/tdDiagram~options} diagram
 *   Options for the real thermodynamic diagram.
 * @param {meteoJS/thermodynamicDiagram/windprofile~options} windprofile
 *   Options for the windprofile container.
 * 
 * @todo
 * Darstellung 'tephigram', 'emagram', ...
 * Ausschnitt (bsp. in P&T)
 */

/**
 * @classdesc
 * Class to draw a SVG thermodynamic diagram.
 * 
 * @constructor
 * @param {meteoJS/thermodynamicDiagram~options} options Diagram options.
 */
meteoJS.thermodynamicDiagram = function (options) {
  /**
   * @type meteoJS/thermodynamicDiagram~options
   */
  this.options = $.extend(true, {
    renderTo: undefined,
    width: undefined,
    height: undefined,
    diagram: { // Objekt-Teilausschnitt
      visible: true,
      x: undefined,
      y: undefined,
      width: undefined,
      height: undefined,
      type: undefined,
      events: {
        click: function (event, p, T) {},
        mouseOver: function (event, p, T) {}
      }
    },
    windprofile: { // Objekt-Teilausschnitt
      visible: true,
      x: undefined,
      y: undefined,
      width: undefined,
      height: undefined
    }
  }, options);
  this.finalizeOptions();
  
  this.soundings = [];
  
  /**
   * @type SVG
   */
  this.svg = SVG($(this.options.renderTo)[0]).size(this.options.width, this.options.height);
  
  this.tdDiagram = new meteoJS.thermodynamicDiagram.tdDiagram(this.svg, this.options.diagram);
  this.options.windprofile.cos = this.tdDiagram.getCoordinateSystem();
  this.windprofile = new meteoJS.thermodynamicDiagram.windprofile(this.svg, this.options.windprofile);
  var that = this;
  $(this.options.renderTo).mousemove(function (event) {
    var offset = $(this).offset();
    var renderToX = event.pageX - offset.left;
    var renderToY = event.pageY - offset.top;
    var x0 = that.tdDiagram.getX();
    var x1 = x0+that.tdDiagram.getWidth();
    var y0 = that.tdDiagram.getY();
    var y1 = y0+that.tdDiagram.getHeight();
    var tdDiagramX = renderToX - x0;
    var tdDiagramY = renderToY - y0;
    if (0 <= tdDiagramX && tdDiagramX <= that.tdDiagram.getWidth() &&
        0 <= tdDiagramY && tdDiagramY <= that.tdDiagram.getHeight()) {
      var cos = that.tdDiagram.getCoordinateSystem();
      that.options.diagram.events.mouseOver.call(that,
        event,
        cos.getPByXY(tdDiagramX, that.tdDiagram.getHeight()-tdDiagramY),
        cos.getTByXY(tdDiagramX, that.tdDiagram.getHeight()-tdDiagramY));
    }
  });
};

/**
 * Calculates values in this.options.
 * 
 * @internal
 */
meteoJS.thermodynamicDiagram.prototype.finalizeOptions = function () {
  this.options.width = (this.options.width === undefined) ?
    $(this.options.renderTo).width() : this.options.width;
  this.options.height = (this.options.height === undefined) ?
    $(this.options.renderTo).height() : this.options.height;
  if (!this.options.diagram.visible) {
    this.options.diagram.width = 0;
    this.options.diagram.height = 0;
  }
  if (!this.options.windprofile.visible) {
    this.options.windprofile.width = 0;
    this.options.windprofile.height = 0;
  }
  var defaultPadding = this.options.width * 0.05;
  if (this.options.diagram.width === undefined &&
      this.options.windprofile.width === undefined) {
    this.options.diagram.width =
      (this.options.width - 2 * defaultPadding) * 0.75;
    this.options.windprofile.width =
      (this.options.width - 2 * defaultPadding) * 0.25;
  }
  else if (this.options.diagram.width === undefined)
    this.options.diagram.width =
      this.options.width - 2 * defaultPadding - this.options.windprofile.width;
  else if (this.options.windprofile.width === undefined)
    this.options.windprofile.width =
      this.options.width - 2 * defaultPadding - this.options.diagram.width;
  var totalWidthChildContainers =
    this.options.diagram.width + this.options.windprofile.width;
  if (this.options.diagram.x === undefined &&
      this.options.windprofile.x === undefined) {
    this.options.diagram.x = defaultPadding;
    this.options.windprofile.x =
      this.options.diagram.x + this.options.diagram.width;
  }
  else if (this.options.diagram.x === undefined)
    this.options.diagram.x =
      this.options.windprofile.x - this.options.windprofile.width;
  else if (this.options.windprofile.x === undefined)
    this.options.windprofile.x =
      this.options.diagram.x + this.options.diagram.width;
  if (this.options.diagram.height === undefined)
    this.options.diagram.height = this.options.height - 2 * defaultPadding;
  if (this.options.windprofile.height === undefined)
    this.options.windprofile.height = this.options.diagram.height;
  if (this.options.diagram.y === undefined)
    this.options.diagram.y = defaultPadding;
  if (this.options.windprofile.y === undefined)
    this.options.windprofile.y = this.options.diagram.y;
};

/**
 * Definition of the style options for the lines in the thermodynamic diagram.
 * @typedef {Object} meteoJS/thermodynamicDiagram~lineStyleOptions
 * @param {} color Color
 * @param {} width Width
 * @param {} opacity Opacity
 * @param {} linecap Linecap
 * @param {} linejoin Linejoin
 * @param {} dasharray Dasharray
 */

/**
 * Add a sounding to the diagram.
 * @param {meteoJS.sounding} sounding
 * @param {Object} options Display options for the sounding
 * @param {boolean} options.visible Visibility of sounding
 * @param {Object} options.diagram Options for thermodynamic diagram
 * @param {boolean} options.diagram.visible
 *   Visibility in thermodynamic diagram of this sounding
 * @param {Object} options.diagram.temp Options for temperature curve
 * @param {boolean} options.diagram.temp.visible
 *   Visibility of temperature curve in thermodynamic diagram
 * @param {meteoJS/thermodynamicDiagram~lineStyleOptions} options.diagram.temp.style
 *   Style for temperature curve
 * @param {Object} options.diagram.dewp Options for dewpoint temperature curve
 * @param {boolean} options.diagram.dewp.visible
 *   Visibility of dewpoint temperature curve in thermodynamic diagram
 * @param {meteoJS/thermodynamicDiagram~lineStyleOptions} options.diagram.dewp.style
 *   Style for dewpoint temperature curve
 * @param {meteoJS/thermodynamicDiagram/windprofile~soundingOptions}
 *   options.windprofile
 *   Windprofile options.
 * @param {Object} options.hodograph Options for hodograph
 * @param {boolean} options.hodograph.visible
 *   Visibility in hodograph of this sounding
 * @param {} options.color
 * @param {Object} options.ttt
 * @param {boolean} options.ttt.visible
 * @param {Object} options.ttd
 * @param {boolean} options.ttd.visible
 * @param {Object} options.mixr ?name?
 * @param {boolean} options.mixr.visible
 * @returns {meteoJS.thermodynamicDiagram} this.
 * 
 * @todo
 * Gehört das in dieses Objekt: Farbe der Linien, Darstellung als Linien oder Punkte, Darstellung als Geraden oder als spline
 */
meteoJS.thermodynamicDiagram.prototype
  .addSounding = function (sounding, options) {
  options = $.extend(true, {
    visible: true,
    diagram: {
      visible: true,
      temp: {
        visible: true,
        style: {
          color: undefined,
          width: 1,
          opacity: undefined,
          linecap: undefined,
          linejoin: undefined,
          dasharray: undefined
        }
      },
      dewp: {
        visible: true,
        style: {
          color: undefined,
          width: 1,
          opacity: undefined,
          linecap: undefined,
          linejoin: undefined,
          dasharray: undefined
        }
      }
    },
    windprofile: {
      visible: true,
      windbarbs: {
        visible: true,
        style: {
          color: undefined,
          width: 1,
          opacity: undefined,
          linecap: undefined,
          linejoin: undefined,
          dasharray: undefined
        }
      },
      windspeed: {
        visible: true,
        style: {
          color: undefined,
          width: 1,
          opacity: undefined,
          linecap: undefined,
          linejoin: undefined,
          dasharray: undefined
        }
      }
    },
    hodograph: {
      visible: true
    }
  }, options);
  this.soundings.push(sounding);
  this.tdDiagram.addSounding(sounding, options.diagram);
  this.windprofile.addSounding(sounding, options.windprofile);
};