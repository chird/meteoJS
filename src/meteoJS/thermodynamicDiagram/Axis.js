/**
 * @module meteoJS/thermodynamicDiagram/axis
 */
import {
  getNormalizedTextOptions
} from './Functions.js';
import PlotArea from './PlotArea.js';

/**
 * Definitions for the labels of an axis.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram~textOptions}
 *   module:meteoJS/thermodynamicDiagram/axis~labelsOptions
 * @property {number} [interval] - Interval between the labels.
 * @property {string} [unit] - Unit of the label values.
 * @property {string} [prefix=''] - Prefix of the label text.
 * @property {integer} [decimalPlaces=0]
 *   Number of digits to appear after the decimal point of the label values.
 */

/**
 * Title definition for an axis.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram~textOptions}
 *   module:meteoJS/thermodynamicDiagram/axis~titleOptions
 * @property {string} [text=''] - Title text.
 */

/**
 * Options for the constructor.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram/plotArea~options}
 *   module:meteoJS/thermodynamicDiagram/axis~options
 * @property {module:meteoJS/thermodynamicDiagram/axis~labelsOptions} labels
 *   Options for the yAxis Labels.
 * @property {module:meteoJS/thermodynamicDiagram/axis~titleOptions} title
 *   Options for the title of the Axis.
 * @property {boolean} [isHorizontal=true]
 *   Internal. Is the axis horizontal or vertical.
 */

/**
 * Abstract class to draw an axis with labelling.
 * 
 * @extends module:meteoJS/thermodynamicDiagram/plotArea.PlotArea
 * @abstract
 */
export class Axis extends PlotArea {

  /**
   * @param {module:meteoJS/thermodynamicDiagram/axis~options} options
   *   Options.
   */
  constructor({
    svgNode = undefined,
    coordinateSystem,
    x,
    y,
    width,
    height,
    style = {},
    visible = true,
    events = {},
    labels = {},
    title = {},
    isHorizontal = true
  }) {
    if (style.overflow === undefined)
      style.overflow = 'visible';
    
    super({
      svgNode,
      coordinateSystem,
      x,
      y,
      width,
      height,
      style,
      visible,
      events
    });
    
    /**
     * @type Object
     * @private
     */
    this._labelsOptions = this.getNormalizedLabelsOptions(labels);
    
    /**
     * @type Object
     * @private
     */
    this._titleOptions = getNormalizedTitleOptions(title);

    /**
     * @type boolean
     * @private
     */
    this._isHorizontal = isHorizontal;
    
    this.init();
  }

  /**
   * Normalize the options for the labels.
   * 
   * @param {module:meteoJS/thermodynamicDiagram/axis~labelsOptions}
   *   options - Options.
   * @returns {module:meteoJS/thermodynamicDiagram/axis~labelsOptions}
   *   Normalized options.
   */
  getNormalizedLabelsOptions({
    interval = undefined,
    unit = '',
    prefix = '',
    decimalPlaces = 0,
    ...rest
  }) {
    const options = getNormalizedTextOptions({ ...rest }, {
      font: {
        size: 11,
        anchor: 'middle'
      }
    });
    options.interval = interval;
    options.unit = unit;
    options.prefix = prefix;
    options.decimalPlaces = decimalPlaces;
    return options;
  }

  /**
   * Draws the labels of the axis.
   * 
   * @param {external:SVG} svgNode - Node to draw into.
   * @param {number} min - Minimum value for the labels.
   * @param {number} max - Maximum value for the labels.
   * @param {Function} getTextByInterval
   *   Returns the text representation of the label value (its argument).
   * @param {Function} getPositionByInterval
   *   Returns the position in pixels of the label value (its argument).
   * @internal
   */
  drawLabels({
    svgNode,
    min,
    max,
    getTextByInterval =
    i => Number.parseFloat(i).toFixed(this._labelsOptions.decimalPlaces),
    getPositionByInterval
  }) {
    for (let i=min; i<=max; i+=this._labelsOptions.interval) {
      let text = getTextByInterval(i);
      text += this._labelsOptions.prefix;
      let fontColor = undefined;
      const font = {...this._labelsOptions.font};
      if ('color' in font) {
        fontColor = font.color;
        delete font.color;
      }
      if (!this._isHorizontal)
        font['anchor'] = 'end';
      const textNode = svgNode
        .plain(text)
        .font(font);
      if (this._isHorizontal) {
        textNode.center(
          getPositionByInterval(i),
          font.size
        );
        if (font['anchor'] == 'end')
          textNode.dx(-textNode.bbox().width/2);
        else if (font['anchor'] == 'start')
          textNode.dx(+textNode.bbox().width/2);
      }
      else
        textNode
          .x(this.width)
          .cy(getPositionByInterval(i))
          .dx(-textNode.bbox().width);
      if (fontColor !== undefined)
        textNode.fill(fontColor);
    }
  }

  /**
   * Draws a title for the axis.
   * 
   * @param {Object} options - Options.
   * @param {external:SVG} svgNode - Node to insert into.
   * @param {external:SVG} svgLabelsNode - Node of the axis labels.
   * @private
   */
  _drawTitle({
    svgNode,
    svgLabelsNode
  }) {
    let rotation = 0;
    if (!this._isHorizontal)
      rotation = -90;
    let margin = 0;
    if (svgLabelsNode !== undefined)
      margin = (rotation == -90)
        ? svgLabelsNode.bbox().width
        : svgLabelsNode.bbox().height;
    
    let fontColor = undefined;
    const font = {...this._titleOptions.font};
    if ('color' in font) {
      fontColor = font.color;
      delete font.color;
    }
    let cxText = this.width/2;
    let cyText = font.size + margin;
    if (rotation == -90) {
      cxText = this.width - font.size - margin;
      cyText = this.height/2;
    }
    const textNode = svgNode
      .plain(this._titleOptions.text)
      .font(font)
      .center(cxText, cyText)
      .rotate(rotation);
    if (fontColor !== undefined)
      textNode.fill(fontColor);
    if (rotation == -90) {
      if (font['anchor'] == 'end')
        textNode.dy(-textNode.bbox().height/2);
      else if (font['anchor'] == 'start')
        textNode.dy(+textNode.bbox().height/2);
    }
    else {
      if (font['anchor'] == 'end')
        textNode.dx(-textNode.bbox().width/2);
      else if (font['anchor'] == 'start')
        textNode.dx(+textNode.bbox().width/2);
    }
  }
  
  /**
   * Draw background into SVG group.
   * 
   * @override
   */
  _drawBackground(svgNode) {
    super._drawBackground(svgNode);
    
    let svgLabelsGroup = undefined;
    if (this._labelsOptions.visible) {
      svgLabelsGroup = svgNode.group();
      this.drawLabels({
        svgNode: svgLabelsGroup
      });
    }
    
    if (this._titleOptions.visible)
      this._drawTitle({
        svgNode: svgNode.group(),
        svgLabelsNode: svgLabelsGroup
      });
  }
  
}
export default Axis;

/**
 * Normalize the options for the title.
 * 
 * @param {module:meteoJS/thermodynamicDiagram/axis~titleOptions}
 *   options - Options.
 * @returns {module:meteoJS/thermodynamicDiagram/axis~titleOptions}
 *   Normalized options.
 */
function getNormalizedTitleOptions({
  text = '',
  ...rest
}) {
  const options = getNormalizedTextOptions({...rest}, {
    font: {
      anchor: 'middle'
    }
  });
  options.text = text;
  return options;
}