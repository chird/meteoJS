/**
 * @module meteoJS/thermodynamicDiagram
 */

/**
 * Definition of the options for the constructor.
 * @typedef {Object} meteoJS/thermodynamicDiagram~options
 * @param {Object} diagram
 * @param {meteoJS/thermodynamicDiagram/coordinateSystem|string} diagram.type
 * @param {} diagram.height
 * @param {} diagram.width
 * @param {Object} hodograph ?name? Radiales Diagramm mit der Windstärke bzw. -richtung.
 * @param {boolean} hodograph.visible
 * @param {Object} windprofile ?name?
 * @param {boolean} windprofile.visible
 * @param {Object} windprofile.arrows ?name? Windbarbs on the right side of the diagram.
 * @param {boolean} windprofile.arrows.visible
 * @param {Object} windprofile.speed ?name? Windspeed with height on the right side of the diagram.
 * @param {Object} windprofile.speed.visible
 * @param {Object} xAxis
 * @param {} xAxis.min [?] Einheit
 * @param {} xAxis.max [?] Einheit
 * @param {} xAxis.isotherms ?gehört eigentlich eher in die diagram dings rein
 * @param {} xAxis.isotherms.color
 * @param {} xAxis.dryadiabats ?name?
 * @param {} xAxis.dryadiabats.color
 * @param {} xAxis.pseudoadiabats ?name?
 * @param {} xAxis.pseudoadiabats.color
 * @param {} xAxis.mixingratio ?name?
 * @param {} xAxis.mixingratio.color ?in ein style-Objekt integrieren?
 * @param {Object} xAxis.title
 * @param {string|undefined} xAxis.title.text
 * @param {Object} yAxis
 * @param {} yAxis.min [hPa]
 * @param {} yAxis.max [hPa]
 * @param {Object} yAxis.isobars
 * @param {} yAxis.isobars.color
 * @param {Object} yAxis.title
 * @param {string|undefined} yAxis.title.text
 * 
 * @todo
 * Darstellung 'skewT-logP', 'tephigram', 'emagram', 'stuve', ...
 * Ausschnitt (bsp. in P&T)
 */

/**
 * @classdesc
 * Class to draw a thermodynamic diagarm into an element.
 * 
 * @constructor
 * @param {} renderTo Element to render diagram into.
 * @param {meteoJS/thermodynamicDiagram~options} options Diagram options.
 * 
 * @todo
 * onmousemove -> Abfrage der Höhe/Temp/Taupunkt/etc. bei der Maus
 */
meteoJS.thermodynamicDiagram = function (renderTo, options) {
  this.options = $.extend({
    tdDiagram: {
      events: {
        click: function (event, p, T) {},
        mouseOver: function (event, p, T) {}
      }
    }
  }, options);
  
  this.diagramWidth = $(renderTo).width();
  this.diagramHeight = $(renderTo).height();
  this.svg = SVG($(renderTo)[0]).size(this.diagramWidth, this.diagramHeight);
  
  this.tdDiagram = new meteoJS.thermodynamicDiagram.tdDiagram(this.svg, {
    x: 50,
    y: 50,
    width: this.diagramWidth-100,
    height: this.diagramHeight-100
  });
  var that = this;
  $(renderTo).mousemove(function (event) {
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
      that.options.tdDiagram.events.mouseOver.call(that,
        event,
        cos.getPByXY(tdDiagramX, that.tdDiagram.getHeight()-tdDiagramY),
        cos.getTByXY(tdDiagramX, that.tdDiagram.getHeight()-tdDiagramY));
    }
  });
};

/**
 * Add a sounding to the diagram.
 * @param {meteoJS.sounding} sounding
 * @param {Object} options
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
  .addSounding = function (sounding, options) {};