/**
 * @module meteoJS/thermodynamicDiagram/windprofile
 */
import { windspeedMSToKN } from '../calc.js';
import { drawTextInto } from './PlotArea.js';
import PlotAltitudeDataArea from './PlotAltitudeDataArea.js';

/**
 * Object passed on events.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram/plotArea~event}
 *   module:meteoJS/thermodynamicDiagram/windprofile~event
 * @property {number} p - Pressure coordinate [hPa].
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/windprofile#click
 * @type {module:meteoJS/thermodynamicDiagram/windprofile~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/windprofile#dblclick
 * @type {module:meteoJS/thermodynamicDiagram/windprofile~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/windprofile#mousedown
 * @type {module:meteoJS/thermodynamicDiagram/windprofile~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/windprofile#mouseup
 * @type {module:meteoJS/thermodynamicDiagram/windprofile~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/windprofile#mouseover
 * @type {module:meteoJS/thermodynamicDiagram/windprofile~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/windprofile#mouseout
 * @type {module:meteoJS/thermodynamicDiagram/windprofile~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/windprofile#mousemove
 * @type {module:meteoJS/thermodynamicDiagram/windprofile~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/windprofile#touchstart
 * @type {module:meteoJS/thermodynamicDiagram/windprofile~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/windprofile#touchmove
 * @type {module:meteoJS/thermodynamicDiagram/windprofile~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/windprofile#touchleave
 * @type {module:meteoJS/thermodynamicDiagram/windprofile~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/windprofile#touchend
 * @type {module:meteoJS/thermodynamicDiagram/windprofile~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/windprofile#touchcancel
 * @type {module:meteoJS/thermodynamicDiagram/windprofile~event}
 */

/**
 * Options for labels on hovering the thermodynamic diagram.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram/plotAltitudeDataArea~hoverLabelsOptions}
 *   module:meteoJS/thermodynamicDiagram/windprofile~hoverLabelsOptions
 * @property {module:meteoJS/thermodynamicDiagram/tdDiagram~labelsOptions}
 *   [windspeed] - Options for temperature label.
 */

/**
 * Definition of the options for the constructor.
 * @typedef {Object} module:meteoJS/thermodynamicDiagram/windprofile~options
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
 * Class to draw the windprofiles (windbarbs and windspeed).
 * 
 * @extends module:meteoJS/thermodynamicDiagram/plotAltitudeDataArea.PlotAltitudeDataArea
 * 
 * @fires module:meteoJS/thermodynamicDiagram/windprofile#click
 * @fires module:meteoJS/thermodynamicDiagram/windprofile#dblclick
 * @fires module:meteoJS/thermodynamicDiagram/windprofile#mousedown
 * @fires module:meteoJS/thermodynamicDiagram/windprofile#mouseup
 * @fires module:meteoJS/thermodynamicDiagram/windprofile#mouseover
 * @fires module:meteoJS/thermodynamicDiagram/windprofile#mouseout
 * @fires module:meteoJS/thermodynamicDiagram/windprofile#mousemove
 * @fires module:meteoJS/thermodynamicDiagram/windprofile#touchstart
 * @fires module:meteoJS/thermodynamicDiagram/windprofile#touchmove
 * @fires module:meteoJS/thermodynamicDiagram/windprofile#touchleave
 * @fires module:meteoJS/thermodynamicDiagram/windprofile#touchend
 * @fires module:meteoJS/thermodynamicDiagram/windprofile#touchcancel
 */
export class Windprofile extends PlotAltitudeDataArea {
  
  /**
   * @param {module:meteoJS/thermodynamicDiagram/windprofile~options} options
   *   Options.
   */
  constructor({
    svgNode,
    coordinateSystem,
    x,
    y,
    width,
    height,
    style = {},
    visible = true,
    events = {},
    hoverLabels = {},
    windbarbs = {},
    windspeed = {}
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
      hoverLabels,
      getSoundingVisibility:
        sounding => sounding.visible && sounding.options.windprofile.visible
    });
    
    this.options = {
      windbarbs,
      windspeed
    };
    if (!('visible' in this.options.windbarbs))
      this.options.windbarbs.visible = true;
    if (!('width' in this.options.windbarbs))
      this.options.windbarbs.width = undefined;
    if (!('barbsLength' in this.options.windbarbs))
      this.options.windbarbs.barbsLength = undefined;
    if (!('visible' in this.options.windspeed))
      this.options.windspeed.visible = true;
    if (!('width' in this.options.windspeed))
      this.options.windspeed.width = undefined;
    
    // Optionen finalisieren
    if (!this.options.windbarbs.visible)
      this.options.windbarbs.width = 0;
    if (!this.options.windspeed.visible)
      this.options.windspeed.width = 0;
    if (this.options.windbarbs.width === undefined &&
      this.options.windspeed.width === undefined) {
      this.options.windbarbs.width = this.width/3;
      this.options.windspeed.width =
        this.width - this.options.windbarbs.width;
    }
    else if (this.options.windbarbs.width === undefined)
      this.options.windbarbs.width = 
      this.width - this.options.windspeed.width;
    else
      this.options.windspeed.width = 
      this.width - this.options.windbarbs.width;
    if (this.options.windbarbs.barbsLength === undefined)
      this.options.windbarbs.barbsLength = this.options.windbarbs.width * 2/5;
    
    this.init();
  }
  
  /**
   * Draw background into SVG group.
   * 
   * @override
   */
  drawBackground(svgNode) {
    super.drawBackground(svgNode);
    
    if (this.options.windspeed.visible) {
      svgNode
        .line(this.options.windbarbs.width, 0,
          this.options.windbarbs.width, this.height)
        .stroke({color: 'black', width: 1});
      svgNode
        .line(this.options.windbarbs.width + this.options.windspeed.width, 0,
          this.options.windbarbs.width + this.options.windspeed.width, this.height)
        .stroke({color: 'black', width: 1});
    }
  }
  
  /**
   * Draw the sounding into the SVG group.
   * 
   * @override
   */
  drawSounding(sounding, group) {
    super.drawSounding(sounding, group);
    
    let windbarbsGroup = group.group();
    let windspeedGroup = group.group();
    
    let windbarbsData = [];
    let windspeedPolylines = [];
    sounding.sounding.getLevels().forEach(level => {
      let data = sounding.sounding.getData(level);
      if (data.wspd === undefined ||
          data.wdir === undefined)
        return;
      
      let y = this.height - this.coordinateSystem.getYByXP(0, level);
      // Winddaten für Barbs
      windbarbsData.push([y, windspeedMSToKN(data.wspd), data.wdir]);
      // Windspeed
      if (windspeedPolylines.length == 0)
        windspeedPolylines.push([]);
      windspeedPolylines[windspeedPolylines.length-1].push([
        this.options.windbarbs.width + windspeedMSToKN(this.options.windspeed.width*data.wspd)/150,
        y
      ]);
    });
    
    // Windpfeile zeichnen
    windbarbsData.forEach(data => {
      // Windpfeil zeichnen
      let groupArrow = windbarbsGroup.group();
      let xMiddle = this.options.windbarbs.width/2;
      let yAddons = data[0] - this.options.windbarbs.barbsLength;
      let widthAddons = this.options.windbarbs.barbsLength/4;
      groupArrow.line(xMiddle, yAddons, xMiddle, data[0]).stroke(sounding.options.windprofile.windbarbs.style);
      let windspeed = data[1];
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
      groupArrow.rotate(data[2], xMiddle, data[0]);
    });
    
    // Windgeschwindigkeit zeichnen
    windspeedPolylines.forEach(polyline => {
      windspeedGroup.polyline(polyline).fill('none').stroke(sounding.options.windprofile.windspeed.style);
    });
  }
  
  /**
   * Initialize hover labels options.
   * 
   * @param {module:meteoJS/thermodynamicDiagram/windprofile~hoverLabelsOptions}
   *   options - Hover labels options.
   * @override
   */
  _initHoverLabels({
    visible = true,
    type = 'mousemove',
    snapToData = true,
    remote = true,
    insertLabelsFunc = undefined,
    windspeed = {}
  }) {
    if (!('visible' in windspeed))
      windspeed.visible = true;
    if (!('style' in windspeed))
      windspeed.style = {};
    if (!('font' in windspeed))
      windspeed.font = {};
    windspeed.radius = ('radius' in windspeed) ? windspeed.radius : undefined;
    windspeed.radiusPlus =
      ('radiusPlus' in windspeed) ? windspeed.radiusPlus : 2;
    if (windspeed.font.anchor === undefined)
      windspeed.font.anchor = 'end';
    
    if (insertLabelsFunc === undefined)
      insertLabelsFunc = this._makeInsertLabelsFunc(windspeed);
    
    super._initHoverLabels({
      visible,
      type,
      snapToData,
      remote,
      insertLabelsFunc
    });
  }
  
  /**
   * Makes a default insertLabelsFunc.
   * 
   * @param {Object} windspeed
   * @private
   */
  _makeInsertLabelsFunc(windspeed) {
    return (sounding, levelData, group) => {
      group.clear();
      
      if (levelData.pres === undefined)
        return;
      
      if (windspeed.visible &&
          levelData.wspd !== undefined) {
        const x = this.options.windbarbs.width +
          windspeedMSToKN(this.options.windspeed.width*levelData.wspd)/150;
        const y = this.coordinateSystem.getHeight() -
          this.coordinateSystem.getYByXP(0, levelData.pres);
        const radius = (windspeed.radius === undefined)
          ? this.hoverLabelsSounding.options.windprofile.windspeed.style.width / 2 +
            windspeed.radiusPlus
          : windspeed.radius;
        const fillOptions = windspeed.style;
        if (!('color' in fillOptions))
          fillOptions.color = sounding.options.windprofile.windspeed.style.color;
        group
          .circle(2 * radius)
          .attr({ cx: x, cy: y })
          .fill(fillOptions);
        drawTextInto({
          node: group,
          text: `${Math.round(windspeedMSToKN(levelData.wspd)*10)/10} kn`,
          x,
          y,
          font: windspeed.font
        });
      }
    };
  }
}
export default Windprofile;