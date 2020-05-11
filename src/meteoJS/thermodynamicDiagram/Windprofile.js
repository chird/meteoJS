/**
 * @module meteoJS/thermodynamicDiagram/windprofile
 */
import { windspeedMSToKN } from '../calc.js';
import PlotDataArea from './PlotDataArea.js';

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
 * Called by meteoJS.thermodynamicDiagram.
 * 
 * Preconditions for options:
 * * x, y, width, height mustn't be undefined.
 * 
 * @extends {module:meteoJS/thermodynamicDiagram/plotDataArea.PlotDataArea}
 */
export class Windprofile extends PlotDataArea {
  
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
    sounding.getSounding().getLevels().forEach(level => {
      let data = sounding.getSounding().getData(level);
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
        windspeedMSToKN(this.options.windspeed.width*data.wspd)/150,
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
      groupArrow.transform({rotation: data[2], cx: xMiddle, cy: data[0]});
    });
    
    // Windgeschwindigkeit zeichnen
    windspeedPolylines.forEach(polyline => {
      windspeedGroup.polyline(polyline).fill('none').stroke(sounding.options.windprofile.windspeed.style);
    });
  }
  
}
export default Windprofile;