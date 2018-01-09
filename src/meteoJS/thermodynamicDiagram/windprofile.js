/**
 * @module meteoJS/thermodynamicDiagram/windprofile
 */

/**
 * Definition of the options for the constructor.
 * @typedef {Object} meteoJS/thermodynamicDiagram/windprofile~options
 * @param {boolean} visible Is windprofile container visible?
 * @param {integer} x Horizontal position of the windprofile container.
 * @param {integer} y Vertical position of the windprofile container.
 * @param {integer} width Width of the windprofile container.
 * @param {integer} height Height of the windprofile container.
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
 * @constructor
 * @internal
 * @param {SVG} svgNode SVG-Node to render profiles into.
 * @param {meteoJS/thermodynamicDiagram/windprofile~options} options
 *   Windprofile options.
 */
meteoJS.thermodynamicDiagram.windprofile = function (svgNode, options) {
  this.options = $.extend(true, {
    visible: true,
    cos: undefined,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
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
  this.svgNode = svgNode.nested()
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
};

/**
 * Definition of the options for the addSounding method.
 * @typedef {Object} meteoJS/thermodynamicDiagram/windprofile~soundingOptions
 * @param {boolean} visible Visiblity of the sounding in the windprofile.
 * @param {Object} windbarbs
 * @param {boolean} windbarbs.visible Visiblity of the windbarbs.
 * @param {meteoJS/thermodynamicDiagram~lineStyleOptions} windbarbs.style
 * @param {Object} windspeed
 * @param {boolean} windspeed.visible Visiblity of the windspeed profile.
 * @param {meteoJS/thermodynamicDiagram~lineStyleOptions} windspeed.style
 */

/**
 * Adds Sounding to windprofile.
 * 
 * @internal
 * @param {meteoJS.sounding} sounding Sounding to add.
 * @param {meteoJS/thermodynamicDiagram/windprofile~soundingOptions} options
 *   Options for this specific sounding (as e.g. display options).
 */
meteoJS.thermodynamicDiagram.windprofile.prototype.addSounding = function (sounding, options) {
  var windbarbsData = [];
  var windspeedPolylines = [];
  sounding.getLevels().forEach(function (level) {
    var data = sounding.getData(level);
    if (data.windspeed === undefined ||
        data.winddir === undefined)
      return;
    var y = this.options.height - this.options.cos.getYByXP(0, level);
    // Winddaten für Barbs
    windbarbsData.push([y, data.windspeed, data.winddir]);
    // Windspeed
    if (windspeedPolylines.length == 0)
      windspeedPolylines.push([]);
    windspeedPolylines[windspeedPolylines.length-1].push([
      this.options.windspeed.width*data.windspeed/150,
      y
    ]);
  }, this);
  
  // Windpfeile zeichnen
  var groupBarbs = this.nodeWindbarbs.group();
  windbarbsData.forEach(function (data) {
    // Windpfeil zeichnen
    var groupArrow = groupBarbs.group();
    var xMiddle = this.options.windbarbs.width/2;
    var yAddons = data[0] - this.options.windbarbs.barbsLength;
    var widthAddons = this.options.windbarbs.barbsLength/4;
    groupArrow.line(xMiddle, yAddons, xMiddle, data[0]).stroke(options.windbarbs.style);
    var windspeed = data[1];
    while (windspeed >= 50) {
      groupArrow.polyline([[xMiddle, yAddons], [xMiddle+widthAddons*2, yAddons+widthAddons*0.8/2], [xMiddle, yAddons+widthAddons*0.8]]).fill('none').stroke(options.windbarbs.style);
      yAddons += widthAddons;
      windspeed -= 50;
    }
    while (windspeed >= 10) {
      groupArrow.line(xMiddle, yAddons+widthAddons/2, xMiddle+widthAddons*2, yAddons).stroke(options.windbarbs.style);
      yAddons += widthAddons/2;
      windspeed -= 10;
    }
    if (windspeed >= 5)
      groupArrow.line(xMiddle, yAddons+widthAddons/2, xMiddle+widthAddons, yAddons+widthAddons/4).stroke(options.windbarbs.style);
    // Drehen
    groupArrow.transform({rotation: data[2], cx: xMiddle, cy: data[0]});
  }, this);
  
  // Windgeschwindigkeit zeichnen
  var groupSpeed = this.nodeWindspeed.group();
  windspeedPolylines.forEach(function (polyline) {
    groupSpeed.polyline(polyline).fill('none').stroke(options.windspeed.style);
  }, this);
};