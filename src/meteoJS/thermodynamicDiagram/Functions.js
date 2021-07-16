/**
 * @module meteoJS/thermodynamicDiagram/functions
 */
import { windspeedMSToKN } from '../calc.js';

/**
 * Definition of a line style. Some properties misses.
 * 
 * @typedef {Object} module:meteoJS/thermodynamicDiagram~lineStyleOptions
 * @property {string} [color='black'] - Color.
 * @property {number} [width=1] - Width.
 * @property {undefined|number} [opacity=undefined] - Opacity.
 * @property {'butt'|'round'|'square'} [linecap=undefined] - Linecap.
 * @property {'arcs'|'bevel'|'miter'|'miter-clip'|'round'} [linejoin=undefined]
 *   Linejoin.
 * @property {string} [dasharray=undefined] - Dasharray.
 * @property {number|string} [dashoffset=undefined] - Dashoffset.
 */

/**
 * Returns normalized lineStyle-Options.
 * 
 * @param {module:meteoJS/thermodynamicDiagram~lineStyleOptions}
 *   [options] - Options.
 * @param {module:meteoJS/thermodynamicDiagram~lineStyleOptions}
 *   [defaults] - Optional defaults.
 * @returns {module:meteoJS/thermodynamicDiagram~lineStyleOptions}
 *   Normalized options.
 * @private
 */
export function getNormalizedLineStyleOptions({
  color = undefined,
  width = undefined,
  ...result
} = {}, defaults = {}) {
  result.color = getFirstDefinedValue(color, defaults.color, 'black');
  result.width = getFirstDefinedValue(width, defaults.width, 1);
  Object.keys(defaults).forEach(key => {
    if (key != 'color' && key != 'width' && result[key] === undefined)
      result[key] = defaults[key];
  });
  return result;
}

/**
 * Definition of font options. Some properties misses.
 * 
 * @typedef {Object} module:meteoJS/thermodynamicDiagram~fontOptions
 * @param {mixed} [size=12] - Size.
 * @param {mixed} [color='black'] - Color.
 * @param {'start'|'middle'|'end'} [anchor=undefined] - Anchor.
 */

/**
 * Returns normalized font-Options.
 * 
 * @param {module:meteoJS/thermodynamicDiagram~fontOptions}
 *   [options] - Options.
 * @param {module:meteoJS/thermodynamicDiagram~fontOptions}
 *   [defaults] - Optional defaults.
 * @returns {module:meteoJS/thermodynamicDiagram~fontOptions}
 *   Normalized options.
 * @private
 */
export function getNormalizedFontOptions({
  size = undefined,
  color = undefined,
  anchor = undefined,
  ...result
} = {}, defaults = {}) {
  result.size = getFirstDefinedValue(size, defaults.size, 12);
  result.color = getFirstDefinedValue(color, defaults.color, 'black');
  anchor = getFirstDefinedValue(anchor, defaults.anchor);
  if (anchor !== undefined)
    result.anchor = anchor;
  Object.keys(defaults).forEach(key => {
    if (key != 'color' && key != 'size' && key != 'anchor'
      && result[key] === undefined)
      result[key] = defaults[key];
  });
  return result;
}

/**
 * A line with its visibility and style.
 * 
 * @typedef {Object} module:meteoJS/thermodynamicDiagram~lineOptions
 * @param {boolean} [visible=true] - Visibility of the line.
 * @param {module:meteoJS/thermodynamicDiagram~lineStyleOptions}
 *   [style] - Line style.
 */

/**
 * Returns normalized line options with visibility and line style.
 * 
 * @param {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   [options] - Options.
 * @param {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   [defaults] - Optional defaults.
 * @returns {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   Normalized options.
 * @internal
 */
export function getNormalizedLineOptions({
  visible = undefined,
  style = {},
  ...result
} = {}, defaults = {}) {
  result.visible = getFirstDefinedValue(visible, defaults.visible, true);
  result.style = getNormalizedLineStyleOptions(style, defaults.style);
  Object.keys(defaults).forEach(key => {
    if (key != 'visible' && key != 'style' && result[key] === undefined)
      result[key] = defaults[key];
  });
  return result;
}

/**
 * A text with its visibility, style and font style.
 * 
 * @typedef {Object} module:meteoJS/thermodynamicDiagram~textOptions
 * @param {boolean} [visible=true] - Visibility of the line.
 * @param {module:meteoJS/thermodynamicDiagram~fontOptions}
 *   [font] - Font defintions.
 */

/**
 * Returns normalized text options with visibility and line style.
 * 
 * @param {module:meteoJS/thermodynamicDiagram~textOptions}
 *   [options] - Options.
 * @param {module:meteoJS/thermodynamicDiagram~textOptions}
 *   [defaults] - Optional defaults.
 * @returns {module:meteoJS/thermodynamicDiagram~textOptions}
 *   Normalized options.
 * @internal
 */
export function getNormalizedTextOptions({
  visible = true,
  font = {},
  ...result
} = {}, defaults = {}) {
  result.visible = getFirstDefinedValue(visible, defaults.visible, true);
  result.font = getNormalizedFontOptions(font, defaults.font);
  Object.keys(defaults).forEach(key => {
    if (key != 'visible' && key != 'font'
      && result[key] === undefined)
      result[key] = defaults[key];
  });
  return result;
}

/**
 * An object with its visibility, style and font style.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   module:meteoJS/thermodynamicDiagram~lineTextOptions
 * @property {module:meteoJS/thermodynamicDiagram~fontOptions}
 *   [font] - Font defintions.
 */

/**
 * Returns normalized text options with visibility, line and font style.
 * 
 * @param {module:meteoJS/thermodynamicDiagram~lineTextOptions}
 *   [options] - Options.
 * @param {module:meteoJS/thermodynamicDiagram~lineTextOptions}
 *   [defaults] - Optional defaults.
 * @returns {module:meteoJS/thermodynamicDiagram~lineTextOptions}
 *   Normalized options.
 * @internal
 */
export function getNormalizedLineTextOptions({
  visible = true,
  style = {},
  font = {}
} = {}, defaults = {}) {
  return {
    visible: getFirstDefinedValue(visible, defaults.visible, true),
    style: getNormalizedLineStyleOptions(style, defaults.style),
    font: getNormalizedFontOptions(font, defaults.font)
  };
}

/**
 * Updates current options with some new options.
 * 
 * @param {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   [options] - Current options.
 * @param {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   [updateOptions] - Some new options.
 * @returns {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   New options object.
 * @private
 */
export function updateLineOptions(options = {}, updateOptions = {}) {
  if ('visible' in updateOptions)
    options.visible = updateOptions.visible;
  if ('style' in updateOptions) {
    ['color', 'width', 'opacity',  'linecap',  'linejoin',  'dasharray']
      .forEach(styleKey => {
        if (styleKey in updateOptions.style)
          options.style[styleKey] = updateOptions.style[styleKey];
      });
  }
  return options;
}

/**
 * Returns the first defined argument.
 * 
 * @param {mixed|undefined} [...params] - Some values.
 * @returns {mixed|undefined} - First defined value, if available.
 */
export function getFirstDefinedValue(...params) {
  return params
    .reduce((acc, cur) => { return (acc !== undefined) ? acc : cur; });
}

/**
 * Draws text in a SVG node.
 * 
 * @param {Object} options - Options.
 * @param {external:SVG} options.node - SVG node.
 * @param {string} options.text - Text.
 * @param {number} options.x - X coordinate.
 * @param {number} options.y - Base Y coordinate.
 * @param {number} [options.horizontalMargin=0] - Padding in x direction.
 * @param {number} [options.verticalMargin=0] - Padding in y direction.
 * @param {module:meteoJS/thermodynamicDiagram~fontOptions} [options.font] - Font style.
 * @prarm {string|Object|undefined} [options.fill]
 *   Fill for background. If undefined, no background is drawn.
 * @returns {external:SVG} - SVG group containing the inserted elements.
 */
export function drawTextInto({
  node,
  text,
  x,
  y,
  horizontalMargin = 0,
  verticalMargin = 0,
  font = {},
  fill = undefined
}) {
  const group = node.group();
  let background = undefined;
  if (fill !== undefined) {
    if (!('color' in fill))
      fill.color = 'white';
    background = group.rect().fill(fill);
  }
  const f = {...font};
  let fontColor = undefined;
  if ('color' in f) {
    fontColor = f.color;
    delete f.color;
  }
  const textNode = group
    .text(text)
    .attr({ x, y })
    .font(font);
  if (fontColor !== undefined)
    textNode.fill(fontColor);
  if (font['alignment-baseline'] == 'bottom')
    textNode.dy(-textNode.bbox().height - 5);
  textNode
    .dx(horizontalMargin * ((textNode.attr('text-anchor') == 'end') ? -1 : 1))
    .dy(verticalMargin * ((font['alignment-baseline'] == 'bottom') ? -1 : 1));
  if (background !== undefined)
    background.attr({
      x: textNode.bbox().x,
      y: textNode.bbox().y,
      width: textNode.bbox().width,
      height: textNode.bbox().height
    });
  return group;
}

/**
 * Draws a windbarb into an SVG node.
 * 
 * @param {Object} options - Options.
 * @param {external:SVG} options.node - SVG node.
 * @param {number} [options.x=0] - X coordinate for windbarb tip.
 * @param {number} [options.y=0] - Y coordinate for windbarb tip.
 * @param {number} [options.wspd=0] - Wind speed [m/s].
 * @param {number} [options.wdir=0] - Wind direction [°].
 * @param {number} [options.length=50] - Windbarb length.
 * @param {module:meteoJS/thermodynamicDiagram~lineStyleOptions}
 *   [options.strokeStyle] - Line style.
 * @param {boolean} [options.fillTriangle=true] - Fill the 50 knots triangles.
 * @param {boolean} [options.triangleRatio=0.2]
 *   Width of the 50 knots triangles according to length.
 * @param {boolean} [options.barbDistanceRatio=0.1]
 *   Distance between triangles and/or 10 knot lines according to length.
 * @param {boolean} [options.barbHeightRatio=0.375]
 *   Height of the triangles and lines according to length.
 */
export function drawWindbarbInto({
  node,
  x = 0,
  y = 0,
  wspd = 0,
  wdir = 270,
  length = 50,
  strokeStyle = undefined,
  fillTriangle = true,
  triangleRatio = 1 / 5,
  barbDistanceRatio = 1 / 10,
  barbHeightRatio = 3 / 8,
  circleOnLowWindspeed = true,
  circleRadiusRatio = 1 / 10
} = {}) {
  strokeStyle = getNormalizedLineStyleOptions(strokeStyle);
  
  const windspeed = windspeedMSToKN(wspd);
  const windbarbGroup = node.group();
  const barbGroup = (windspeed >= 5) ? windbarbGroup.group() : undefined;
  const triangleWidth = length * triangleRatio;
  const barbDistance = length * barbDistanceRatio;
  const windbarbHeight = length * barbHeightRatio;
  let yPosition = y - length;
  let windspeedResidual = windspeed;
  
  if (windspeed < 5 && circleOnLowWindspeed) {
    windbarbGroup
      .circle(length * circleRadiusRatio)
      .cx(x)
      .cy(y)
      .stroke(strokeStyle)
      .fill('none');
    return;
  }
  
  // base line
  windbarbGroup
    .line(x, yPosition, x, y)
    .stroke(strokeStyle);
  
  // 50 knots triangles
  while (windspeedResidual >= 50) {
    barbGroup
      .polyline([
        [x, yPosition],
        [x + windbarbHeight, yPosition + triangleWidth/2],
        [x, yPosition + triangleWidth]
      ])
      .fill(fillTriangle ? strokeStyle : 'none')
      .stroke(strokeStyle);
    windspeedResidual -= 50;
    yPosition += triangleWidth + ((windspeedResidual >= 50) ? barbDistance/2 : barbDistance);
  }
  
  // 10 knots lines
  while (windspeedResidual >= 10) {
    barbGroup
      .line(
        x, yPosition,
        x + windbarbHeight, yPosition - triangleWidth/2
      )
      .stroke(strokeStyle);
    yPosition += barbDistance;
    windspeedResidual -= 10;
  }
  
  if (windspeed < 10)
    yPosition += barbDistance;
  
  // 5 knot line
  if (windspeedResidual >= 5)
    barbGroup
      .line(
        x, yPosition,
        x + windbarbHeight/2, yPosition - triangleWidth/4
      )
      .stroke(strokeStyle);
  
  // compress barbs on high windspeed
  const barbsWidth = yPosition - (y - length);
  if (barbsWidth > length * 0.9)
    barbGroup.scale(1, (length * 0.9) / barbsWidth, x, y - length);
  
  if (wdir != 0)
    windbarbGroup.rotate(wdir, x, y);
}