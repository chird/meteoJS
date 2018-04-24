/**
 * @module meteoJS/thermodynamicDiagram/hodograph
 */

/**
 * Definition of the options for the constructor.
 * @typedef {Object} meteoJS/thermodynamicDiagram/hodograph~options
 * @param {boolean} visible Visibility of the hodograph container.
 * @param {undefined|integer} x Horizontal position of the hodograph container.
 * @param {undefined|integer} y Vertical position of the hodograph container.
 * @param {undefined|integer} width Width of the hodograph container.
 * @param {undefined|integer} height Height of the hodograph container.
 * @param {Object} grid Options for the hodograph grid.
 * @param {Object} grid.axes Options for the hodograph x- and y-axes.
 * @param {meteoJS/thermodynamicDiagram~lineStyleOptions} grid.axes.style
 *   X- and y-axes style.
 * @param {boolean} grid.axes.visible Visibility of the hodograph x- and y-axes.
 * @param {Object} grid.circles Options for the hodograph circle grid.
 * @param {number} grid.circles.interval
 *   Interval between grid circles (and value for the first grid circle). [m/s]
 * @param {meteoJS/thermodynamicDiagram~lineStyleOptions} grid.circles.style
 *   Grid circles style.
 * @param {boolean} grid.circles.visible
 *   Visibility of the hodograph circle grid.
 * @param {Object} grid.labels Options for the hodograph grid labels.
 * @param {number} grid.labels.angle
 *   Angle of the labels startin from the origin
 *   (in degrees, 0 relates to North).
 * @param {meteoJS/thermodynamicDiagram~textStyleOptions} grid.labels.style
 *   Grid labels style.
 * @param {boolean} grid.labels.visible Visibility of the hodograph grid labels.
 * @param {number|undefined} grid.max
 *   Maximum value for the grid axes and circles. If undefined, determined from
 *   'minWindspeedRange'.
 * @param {number} windspeedMax
 *   The maximum windspeed [m/s], that should be visible on the plot. This
 *   refers to the x- or y-direction with the origin in the middle of the plot,
 *   because in these directions, a polar plot has the least extent concerning
 *   distance.
 * @param {number[]|undefined} origin
 *   Move origin of polar plot. If 'undefined' the origin is in the center. To
 *   move, use an array with 2 elements. The first element moves the origin in
 *   x direction, the second in y direction. The values are interpreted as
 *   relative Length (relating to the half width resp. height). Positive values
 *   to move in South-West direction. E.g. to move the origin the half way to
 *   South-West, use [0.5, 0.5].
 */

/**
 * @classdesc
 * Class to draw the hodograph.
 * Called by meteoJS.thermodynamicDiagram.
 * 
 * Preconditions for options:
 * * x, y, width, height mustn't be undefined.
 * 
 * @constructor
 * @internal
 * @param {meteoJS/thermodynamicDiagram} main Main diagram object.
 * @param {meteoJS/thermodynamicDiagram/hodograph~options} options
 *   Hodograph options.
 */
meteoJS.thermodynamicDiagram.hodograph = function (main, options) {
  this.options = $.extend(true, {
    visible: true,
    x: undefined,
    y: undefined,
    width: undefined,
    height: undefined,
    grid: {
      axes: {
        style: {
          width: 1
        },
        visible: true
      },
      circles: {
        interval: meteoJS.calc.windspeedKMHToMS(50),
        style: {
          color: 'black',
          width: 1
        },
        visible: true
      },
      labels: {
        angle: 225,
        style: {
          size: 10 // XXX: Nicht fix
        },
        visible: true
      },
      max: undefined
    },
    windspeedMax: meteoJS.calc.windspeedKNToMS(150),
    origin: undefined
  }, options);
  
  this.main = main;
  this.cos = main.getCoordinateSystem();
  
  // Nested svg-Nodes erstellen
  this.svgNode = main.getSVGNode().nested()
    .attr({
      x: this.options.x,
      y: this.options.y,
      width: this.options.width,
      height: this.options.height
    })
    .style({ overflow: 'hidden' });
  this.svgNodeGrid = this.svgNode.group();
  this.svgNodeData = this.svgNode.group();
  
  this.minLength = Math.min(this.options.width, this.options.height);
  this.center = [this.options.width/2, this.options.height/2];
  if (this.options.origin !== undefined) {
    this.center[0] -=
      this.options.origin[0] * this.minLength/2;
    this.center[1] +=
      this.options.origin[1] * this.minLength/2;
  }
  this.pixelPerSpeed = Math.min(
    Math.max(this.options.width - this.center[0], this.center[0]),
    Math.max(this.options.height - this.center[1], this.center[1])
  ) / this.options.windspeedMax;
  if (this.options.grid.max === undefined)
    this.options.grid.max = this.options.windspeedMax;
  
  this.plotGrid();
};

/**
 * Plots hodograph background.
 * 
 * @internal
 */
meteoJS.thermodynamicDiagram.hodograph.prototype.plotGrid = function () {
  this.svgNodeGrid.clear();
  
  // border, background
  this.svgNodeGrid
    .rect(this.options.width-2, this.options.height-2)
    .move(1,1)
    .fill({color: 'white'})
    .stroke({color: 'black', width: 1});
    //.attr({rx: 10, ry: 10});
  
  // x-/y-axes
  if (this.options.grid.axes.visible) {
    var axesLength =
        this.options.grid.max + this.options.grid.circles.interval / 2;
    this.svgNodeGrid
      .line(
        Math.max(0, this.center[0] - axesLength * this.pixelPerSpeed),
        this.center[1],
        Math.min(this.options.width,
                 this.center[0] + axesLength * this.pixelPerSpeed),
        this.center[1]
      )
      .stroke(this.options.grid.axes.style);
    this.svgNodeGrid
      .line(
        this.center[0],
        Math.max(0, this.center[1] - axesLength * this.pixelPerSpeed),
        this.center[0],
        Math.min(this.options.height,
                 this.center[1] + axesLength * this.pixelPerSpeed)
      )
      .stroke(this.options.grid.axes.style);
  }
  
  // circles and labels
  for (var v = this.options.grid.circles.interval;
       v <= this.options.grid.max;
       v += this.options.grid.circles.interval) {
    var radius = v * this.pixelPerSpeed;
    this.svgNodeGrid
      .circle(2*radius)
      .attr({
         cx: this.center[0],
         cy: this.center[1]
      })
      .fill('none')
      .stroke(this.options.grid.circles.style);
    if (this.options.grid.labels.visible) {
      var xText =
          radius *
          Math.cos((this.options.grid.labels.angle - 90) / 180 * Math.PI);
      var yText =
          radius *
          Math.sin((this.options.grid.labels.angle - 90) / 180 * Math.PI);
      var textAnchor = 'middle';
      var dx = 0;
      var dy = -this.options.grid.labels.style.size;
      if (this.options.grid.labels.angle == 0 ||
          this.options.grid.labels.angle == 180) {
        dx = -3;
        textAnchor = 'end';
      }
      else if (this.options.grid.labels.angle == 90 ||
               this.options.grid.labels.angle == 270)
        dy = -3;
      var text = this.svgNodeGrid
        .plain(Math.round(meteoJS.calc.windspeedMSToKMH(v)))
        .move(this.center[0] + xText, this.center[1] + yText)
        .attr({
          'text-anchor': textAnchor,
          //'alignment-baseline': 'middle'
          dx: dx,
          dy: dy // XXX: Hack für Firefox
        })
        .font(this.options.grid.labels.style);
      var bbox = text.bbox();
      text.before(
        this.svgNodeGrid
          .rect(bbox.width, bbox.height)
          .move(bbox.x, bbox.y)
          .fill('white')
      );
    }
  }
};

/**
 * Adds Sounding to hodograph.
 * 
 * @internal
 * @param {meteoJS/thermodynamicDiagram/sounding} sounding Sounding object.
 */
meteoJS.thermodynamicDiagram.hodograph.prototype.addSounding =
    function (sounding) {
  var group = this.svgNodeData.group();
  var changeVisible = function () {
    group.style('display', this.visible() ? 'inline' : 'none');
  };
  sounding.on('change:visible', changeVisible);
  changeVisible.call(sounding);
  
  var polyline = [];
  sounding.getSounding().getLevels().forEach(function (level) {
    if (level === undefined)
      return;
    var levelData = sounding.getSounding().getData(level);
    if (levelData.dir === undefined ||
        levelData.v === undefined)
      return;
    var x = levelData.v * -Math.sin(levelData.dir / 180 * Math.PI);
    var y = levelData.v * Math.cos(levelData.dir / 180 * Math.PI);
    polyline.push([
      this.center[0] + x * this.pixelPerSpeed,
      this.center[1] + y * this.pixelPerSpeed
    ]);
  }, this);
  group
    .polyline(polyline)
    .fill('none')
    .stroke(sounding.options.hodograph.style);
};