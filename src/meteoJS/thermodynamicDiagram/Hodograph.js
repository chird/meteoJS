/**
 * @module meteoJS/thermodynamicDiagram/hodograph
 */
import {
  windspeedKMHToMS,
  windspeedKNToMS,
  windspeedMSToKMH,
  windspeedMSToKN } from '../calc.js';
import {
  getNormalizedLineOptions,
  getNormalizedTextOptions
} from './Functions.js';
import CoordinateSystem from './CoordinateSystem.js';
import PlotDataArea from './PlotDataArea.js';

/**
 * Options for the circle grid.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram~lineStyleOptions}
 *   module:meteoJS/thermodynamicDiagram/hodograph~gridCirclesOptions
 * @param {number} [interval=13.89]
 *   Interval between grid circles (and value for the first grid circle).
 *   In m/s.
 */

/**
 * Options for the grid labels.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram~textOptions}
 *   module:meteoJS/thermodynamicDiagram/hodograph~gridLabelsOptions
 * @property {number} [angle=45]
 *   Angle of the labels startin from the origin
 *   (in degrees, 0 relates to North).
 * @property {string} [unit='km/h']
 *   Unit of the label values. Allowed values: 'm/s', 'kn', 'km/h'
 * @property {string} [prefix=''] - Prefix of the label text.
 * @property {integer} [decimalPlaces=0] - Number of digits to appear after
 *   the decimal point of the label values.
 */

/**
 * Options for the constructor.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram/plotDataArea~options}
 *   module:meteoJS/thermodynamicDiagram/hodograph~options
 * @param {Object} [grid] - Options for the hodograph grid.
 * @param {module:meteoJS/thermodynamicDiagram~lineOptions} [grid.axes]
 *   Options for the hodograph's x- and y-axes.
 * @param {module:meteoJS/thermodynamicDiagram/hodograph~gridCirclesOptions}
 *   [grid.circles] - Options for the hodograph circle grid.
 * @param {module:meteoJS/thermodynamicDiagram/hodograph~gridLabelsOptions}
 *   [grid.labels] - Options for the hodograph grid labels.
 * @param {number|undefined} [grid.max=undefined]
 *   Maximum value for the grid axes and circles. If undefined, determined from
 *   'windspeedMax'.
 * @param {number} [windspeedMax=41.67]
 *   The maximum windspeed [m/s], that should be visible on the plot. This
 *   refers to the x- or y-direction with the origin in the middle of the plot,
 *   because in these directions, a polar plot has the least extent concerning
 *   distance.
 * @param {number[]|undefined} [origin=undefined]
 *   Move origin of polar plot. If 'undefined' the origin is in the center. To
 *   move, use an array with 2 elements. The first element moves the origin in
 *   x direction, the second in y direction. The values are interpreted as
 *   relative length (relating to the half width resp. height). Positive values
 *   to move in North-East direction. E.g. to move the origin the half way to
 *   the upper right corner, use [0.5, 0.5].
 */

/**
 * Class to draw the hodograph.
 * 
 * <pre><code>import Hodograph from 'meteojs/thermodynamicDiagram/Hodograph';</code></pre>
 * 
 * @extends module:meteoJS/thermodynamicDiagram/plotDataArea.PlotDataArea
 */
export class Hodograph extends PlotDataArea {
  
  /**
   * @param {module:meteoJS/thermodynamicDiagram/hodograph~options} options
   *   Options.
   */
  constructor({
    svgNode = undefined,
    coordinateSystem = new CoordinateSystem(),
    x,
    y,
    width,
    height,
    style = {},
    visible = true,
    events = {},
    dataGroupIds = ['windbarbs'],
    getCoordinatesByLevelData = (dataGroupId, sounding, levelData, plotArea) => {
      if (levelData.wspd === undefined ||
          levelData.wdir === undefined)
        return {};
      
      const x = levelData.wspd * -Math.sin(levelData.wdir / 180 * Math.PI);
      const y = levelData.wspd * Math.cos(levelData.wdir / 180 * Math.PI);
      return {
        x: plotArea.center[0] + x * plotArea.pixelPerSpeed,
        y: plotArea.center[1] + y * plotArea.pixelPerSpeed
      };
    },
    insertDataGroupInto = (svgNode, dataGroupId, sounding, data) => {
      const basePolylines = [data
        .filter(level => {
          if (sounding.options.hodograph.minPressure !== undefined
            && level.levelData.pres !== undefined
            && level.levelData.pres < sounding.options.hodograph.minPressure)
            return false;
          if (sounding.options.hodograph.maxPressure !== undefined
            && level.levelData.pres !== undefined
            && level.levelData.pres > sounding.options.hodograph.maxPressure)
            return false;
          return true;
        })];
      basePolylines[0].sort((a,b) => b.levelData.pres-a.levelData.pres);
      const segmentPolylines = [];
      for (const segment of sounding.options.hodograph.segments) {
        const def = {
          levels: [],
          visible: segment.visible,
          style: segment.style
        };
        basePolylines.map((basePolyline, i) => {
          let lowSplit = undefined;
          let highSplit = undefined;
          basePolyline.map(l => {
            if ((segment.minPressure !== undefined && segment.minPressure <= l.levelData.pres
              && segment.maxPressure !== undefined && segment.maxPressure >= l.levelData.pres)
              || (segment.minPressure === undefined
              && segment.maxPressure !== undefined && segment.maxPressure >= l.levelData.pres)
              || (segment.minPressure !== undefined && segment.minPressure <= l.levelData.pres
              && segment.maxPressure === undefined)) {
              def.levels.push(l);
              if (highSplit === undefined)
                highSplit = l;
              lowSplit = l;
            }
          });
          if (highSplit !== undefined && lowSplit !== undefined && highSplit !== lowSplit) {
            const indexLow = basePolyline
              .findIndex(l => l.levelData.pres === lowSplit.levelData.pres);
            const indexHigh = basePolyline
              .findIndex(l => l.levelData.pres === highSplit.levelData.pres);
            const newBaseLine = basePolyline.slice(indexLow);
            basePolylines[i] = basePolyline.slice(0, indexHigh+1);
            basePolylines.push(newBaseLine);
          }
        });
        if (def.levels.length > 0)
          segmentPolylines.push(def);
      }
      basePolylines.map(basePolyline => {
        if (basePolyline.length < 2)
          return;
        svgNode
          .polyline(basePolyline.map(level => [ level.x, level.y ]))
          .fill('none').stroke(sounding.options.hodograph.style);
      });
      segmentPolylines.map(segmentPolyline => {
        svgNode
          .polyline(segmentPolyline.levels.map(level => [ level.x, level.y ]))
          .fill('none').stroke(segmentPolyline.style);
      });
    },
    grid = {},
    windspeedMax = windspeedKNToMS(150),
    origin = undefined,
    filterDataPoint = undefined,
    minDataPointsDistance = 0
  }) {
    super({
      svgNode,
      coordinateSystem,
      x,
      y,
      width,
      height,
      style,
      visible,
      events,
      dataGroupIds,
      getCoordinatesByLevelData,
      insertDataGroupInto,
      getSoundingVisibility:
        sounding => sounding.visible && sounding.options.hodograph.visible,
      filterDataPoint,
      minDataPointsDistance
    });

    /**
     * @type number[]|undefined
     * @private
     */
    this._origin = origin;

    /**
     * @type number
     * @private
     */
    this._windspeedMax = windspeedMax;
    
    this._gridOptions = this.getNormalizedGridOptions(grid);

    if (this._gridOptions.max === undefined)
      this._gridOptions.max = windspeedMax;
    
    this.init();
  }

  /**
   * Origin of the hodograph relative to the plot area. If not undefined, it
   * has to be a 2-element array. The first element moves the origin in
   * x direction, the second in y direction. The values are interpreted as
   * relative length (relating to the half width resp. height). Positive values
   * to move in North-East direction. E.g. to move the origin the half way to
   * the upper right corner, use [0.5, 0.5].
   * 
   * @type number[]|undefined
   * @public
   */
  get origin() {
    return this._origin;
  }
  set origin(origin) {
    const oldOrigin = this._origin;
    this._origin = origin;
    if (oldOrigin === undefined && this._origin !== undefined
      || oldOrigin !== undefined && this._origin === undefined
      || (oldOrigin !== undefined && this._origin !== undefined
      && (oldOrigin[0] != this._origin[0]
      || oldOrigin[1] != this._origin[1])))
      this.onCoordinateSystemChange();
  }

  /**
   * The origin of the hodograph in pixel coordinates.
   * 
   * @type number[]
   * @public
   * @readonly
   */
  get center() {
    const center = [this.width/2, this.height/2];
    if (this._origin !== undefined) {
      center[0] += this._origin[0] * this.minExtentLength/2;
      center[1] -= this._origin[1] * this.minExtentLength/2;
    }
    return center;
  }

  /**
   * Returns the pixel per speed unit. Mainly for internal usage.
   * 
   * @type number
   * @public
   * @readonly
   */
  get pixelPerSpeed() {
    const center = this.center;
    return Math.min(
      Math.max(this.width - center[0], center[0]),
      Math.max(this.height - center[1], center[1])
    ) / this._windspeedMax;
  }
  
  /**
   * Plots hodograph background.
   * 
   * @override
   */
  _drawBackground(svgNode) {
    super._drawBackground(svgNode);
     
    // border, background
    svgNode
      .rect(this.width-2, this.height-2)
      .move(1,1)
      .fill({color: 'white'})
      .stroke({color: 'black', width: 1});
    //.attr({rx: 10, ry: 10});
    
    const center = this.center;
    const pixelPerSpeed = this.pixelPerSpeed;
    // x-/y-axes
    if (this._gridOptions.axes.visible) {
      svgNode
        .line(0, center[1], this.width, center[1])
        .stroke(this._gridOptions.axes.style);
      svgNode
        .line(center[0], 0, center[0], this.height)
        .stroke(this._gridOptions.axes.style);
    }
    
    // circles and labels
    for (let v = this._gridOptions.circles.interval;
      v <= this._gridOptions.max;
      v += this._gridOptions.circles.interval) {
      let radius = v * pixelPerSpeed;
      svgNode
        .circle(2*radius)
        .attr({
          cx: center[0],
          cy: center[1]
        })
        .fill('none')
        .stroke(this._gridOptions.circles.style);
      if (this._gridOptions.labels.visible) {
        let xText =
          radius *
          Math.cos((this._gridOptions.labels.angle - 90) / 180 * Math.PI);
        let yText =
          radius *
          Math.sin((this._gridOptions.labels.angle - 90) / 180 * Math.PI);
        let textAnchor = 'middle';
        let dx = 0;
        let dy = -this._gridOptions.labels.font.size;
        if (this._gridOptions.labels.angle == 0 ||
          this._gridOptions.labels.angle == 180) {
          dx = -3;
          textAnchor = 'end';
        }
        else if (this._gridOptions.labels.angle == 90 ||
               this._gridOptions.labels.angle == 270)
          dy = -3;
        let text = '';
        switch (this._gridOptions.labels.unit) {
          case 'm/s':
            text = Number.parseFloat(v)
              .toFixed(this._gridOptions.labels.decimalPlaces);
            break;
          case 'kn':
            text = windspeedMSToKN(v)
              .toFixed(this._gridOptions.labels.decimalPlaces);
            break;
          default:
            text = windspeedMSToKMH(v)
              .toFixed(this._gridOptions.labels.decimalPlaces);
            break;
        }
        text += this._gridOptions.labels.prefix;
        const textNode = svgNode
          .plain(text)
          .move(center[0] + xText, center[1] + yText)
          .attr({
            'text-anchor': textAnchor,
            //'alignment-baseline': 'middle'
            dx: dx,
            dy: dy // XXX: Hack für Firefox
          })
          .font(this._gridOptions.labels.font);
        const bbox = textNode.bbox();
        textNode.before(
          svgNode
            .rect(bbox.width, bbox.height)
            .move(bbox.x, bbox.y)
            .fill('white')
        );
      }
    }
  }
  
  /**
   * Normalizes options for grid.
   * 
   * @private
   */
  getNormalizedGridOptions({
    axes = {},
    circles = {},
    labels = {},
    max = undefined
  }) {
    axes = getNormalizedLineOptions(axes);
    circles = getNormalizedLineOptions(circles);
    if (!('interval' in circles) ||
        circles.interval === undefined)
      circles.interval = windspeedKMHToMS(50);
    labels = getNormalizedTextOptions(labels);
    if (!('angle' in labels) ||
        labels.angle === undefined)
      labels.angle = 225;
    if (!('unit' in labels) ||
        labels.unit === undefined)
      labels.unit = 'km/h';
    if (!('prefix' in labels) ||
        labels.prefix === undefined)
      labels.prefix = '';
    if (!('decimalPlaces' in labels) ||
        labels.decimalPlaces === undefined)
      labels.decimalPlaces = 0;
    if (labels.font.size === undefined)
      labels.font.size = 10;
    
    return {
      axes,
      circles,
      labels,
      max
    };
  }
}
export default Hodograph;