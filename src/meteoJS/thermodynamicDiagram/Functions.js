/**
 * @module meteoJS/thermodynamicDiagram/functions
 */

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
  style = {}
} = {}, defaults = {}) {
  return {
    visible: getFirstDefinedValue(visible, defaults.visible, true),
    style: getNormalizedLineStyleOptions(style, defaults.style)
  };
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
  font = {}
} = {}, defaults = {}) {
  return {
    visible: getFirstDefinedValue(visible, defaults.visible, true),
    font: getNormalizedFontOptions(font, defaults.font)
  };
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
 * @prarm {string|Object} [options.fill] - Fill for background.
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
  fill = {}
}) {
  const group = node.group();
  if (!('color' in fill))
    fill.color = 'white';
  const background = node.rect().fill(fill);
  const textNode = node
    .text(text)
    .attr({ x, y })
    .font(font);
  if (font['alignment-baseline'] == 'bottom')
    textNode.dy(-textNode.bbox().height - 5);
  textNode
    .dx(horizontalMargin * ((textNode.attr('text-anchor') == 'end') ? -1 : 1))
    .dy(verticalMargin * ((font['alignment-baseline'] == 'bottom') ? -1 : 1));
  background.attr({
    x: textNode.bbox().x,
    y: textNode.bbox().y,
    width: textNode.bbox().width,
    height: textNode.bbox().height
  });
  return group;
}