/**
 * @module meteoJS/thermodynamicDiagram/windprofile
 */

/**
 * Definition of the options for the constructor.
 * @typedef {Object} meteoJS/thermodynamicDiagram/windprofile~options
 * @param {boolean} visible Visibility of the windprofile container.
 * @param {undefined|integer} x Horizontal position of the windprofile container.
 * @param {undefined|integer} y Vertical position of the windprofile container.
 * @param {undefined|integer} width Width of the windprofile container.
 * @param {undefined|integer} height Height of the windprofile container.
 * @param {Object} windbarbs Windbarbs on the right side of the diagram.
 * @param {boolean} windbarbs.visible
 * @param {undefined|integer} windbarbs.width
 *   Width of container for windbarbs
 *   (if undefined, 1/3 of total width of the windprofile container)
 * @param {undefined|integer} windbarbs.barbsLength
 *   Length of the individual windbarbs.
 *   (if undefined, 40% of width of the windbarbs container)
 * @param {Object} windspeed Windspeed with height on the right side of the diagram.
 * @param {boolean} windspeed.visible
 * @param {undefined|integer} windspeed.width
 *   Width of container for windspeed profile
 *   (if undefined, 2/3 of total width of the windprofile container)
 */

/**
 * @classdesc
 * Class to draw the windprofiles (windbarbs and windspeed).
 * Called by meteoJS.thermodynamicDiagram.
 * 
 * Preconditions for options:
 * * x, y, width, height mustn't be undefined.
 * 
 * @constructor
 * @internal
 * @param {SVG} svgNode SVG-Node to render profiles into.
 * @param {meteoJS/thermodynamicDiagram/windprofile~options} options
 *   Windprofile options.
 */
meteoJS.thermodynamicDiagram.windprofile = function (main, options) {
  this.options = $.extend(true, {
    visible: true,
    x: undefined,
    y: undefined,
    width: undefined,
    height: undefined,
    windbarbs: {
      visible: true,
      width: undefined,
      barbsLength: undefined
    },
    windspeed: {
      visible: true,
      width: undefined
    }
  }, options);
  
  this.main = main;
  this.cos = main.getCoordinateSystem();
  
  // Optionen finalisieren
  if (!this.options.windbarbs.visible)
    this.options.windbarbs.width = 0;
  if (!this.options.windspeed.visible)
    this.options.windspeed.width = 0;
  if (this.options.windbarbs.width === undefined &&
      this.options.windspeed.width === undefined) {
    this.options.windbarbs.width = this.options.width/3;
    this.options.windspeed.width =
      this.options.width-this.options.windbarbs.width;
  }
  else if (this.options.windbarbs.width === undefined)
    this.options.windbarbs.width = 
      this.options.width-this.options.windspeed.width;
  else
    this.options.windspeed.width = 
      this.options.width-this.options.windbarbs.width;
  if (this.options.windbarbs.barbsLength === undefined)
    this.options.windbarbs.barbsLength = this.options.windbarbs.width * 2/5;
  
  // Nested svg-Nodes erstellen
  this.svgNode = main.getSVGNode().nested()
    .attr({
      x: this.options.x,
      y: this.options.y,
      width: this.options.width,
      height: this.options.height
    })
    .style({ overflow: 'hidden' });
  this.nodeWindbarbs = this.svgNode.nested()
    .attr({
      x: 0,
      y: 0,
      width: this.options.windbarbs.width,
      height: this.options.height
    });
  this.soundingsWindbarbsGroup = this.nodeWindbarbs.group();
  if (!this.options.windbarbs.visible)
    this.nodeWindbarbs.hide();
  this.nodeWindspeed = this.svgNode.nested()
    .attr({
      x: this.options.windbarbs.width,
      y: 0,
      width: this.options.windspeed.width,
      height: this.options.height
    });
  if (!this.options.windspeed.visible)
    this.nodeWindspeed.hide();
  
  this.plotWindspeeds();
};

/**
 * Plots windspeed profile 
 * 
 * @internal
 */
meteoJS.thermodynamicDiagram.windprofile.prototype.plotWindspeeds = function () {
  this.nodeWindspeed.clear();
  if (this.options.windspeed.visible) {
    this.nodeWindspeed
      .line(0, 0,
            0, this.options.height)
      .stroke({width: 1});
    this.nodeWindspeed
      .line(this.options.windspeed.width, 0,
            this.options.windspeed.width, this.options.height)
      .stroke({width: 1});
  }
  this.soundingsWindspeedGroup = this.nodeWindspeed.group();
};

/**
 * Adds Sounding to windprofile.
 * 
 * @internal
 * @param {meteoJS/thermodynamicDiagram/sounding} sounding Sounding object.
 */
meteoJS.thermodynamicDiagram.windprofile.prototype.addSounding = function (sounding) {
  sounding.on('change:visible', function (s) {
    this.drawSoundings();
  }, this);
  this.drawSoundings();
};

meteoJS.thermodynamicDiagram.windprofile.prototype.drawSoundings = function () {
  this.soundingsWindbarbsGroup.clear();
  this.soundingsWindspeedGroup.clear();
  this.main.soundings.forEach(function (sounding) {
    if (!sounding.visible() ||
        !sounding.options.windprofile.visible)
      return;
  var windbarbsData = [];
  var windspeedPolylines = [];
  sounding.getSounding().getLevels().forEach(function (level) {
    var data = sounding.getSounding().getData(level);
    if (data.wspd === undefined ||
        data.wdir === undefined)
      return;
    var y = this.options.height - this.cos.getYByXP(0, level);
    // Winddaten für Barbs
    windbarbsData.push([y, meteoJS.calc.windspeedMSToKN(data.wspd), data.wdir]);
    // Windspeed
    if (windspeedPolylines.length == 0)
      windspeedPolylines.push([]);
    windspeedPolylines[windspeedPolylines.length-1].push([
      meteoJS.calc.windspeedMSToKN(this.options.windspeed.width*data.wspd)/150,
      y
    ]);
  }, this);
  
  // Windpfeile zeichnen
  windbarbsData.forEach(function (data) {
    // Windpfeil zeichnen
    var groupArrow = this.soundingsWindbarbsGroup.group();
    var xMiddle = this.options.windbarbs.width/2;
    var yAddons = data[0] - this.options.windbarbs.barbsLength;
    var widthAddons = this.options.windbarbs.barbsLength/4;
    groupArrow.line(xMiddle, yAddons, xMiddle, data[0]).stroke(sounding.options.windprofile.windbarbs.style);
    var windspeed = data[1];
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
    // Drehen
    groupArrow.transform({rotation: data[2], cx: xMiddle, cy: data[0]});
  }, this);
  
  // Windgeschwindigkeit zeichnen
  windspeedPolylines.forEach(function (polyline) {
    this.soundingsWindspeedGroup.polyline(polyline).fill('none').stroke(sounding.options.windprofile.windspeed.style);
  }, this);
  }, this);
};