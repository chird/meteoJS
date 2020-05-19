/**
 * @module meteoJS/thermodynamicDiagram/functions
 */

/**
 * Definition of a line style.
 * 
 * @typedef {Object} module:meteoJS/thermodynamicDiagram~lineStyleOptions
 * @param {string} [color='black'] - Color.
 * @param {number} [width=1] - Width.
 * @param {undefined|number} [opacity=undefined] - Opacity.
 * @param {} [linecap=undefined] - Linecap.
 * @param {} [linejoin=undefined] - Linejoin.
 * @param {} [dasharray=undefined] - Dasharray.
 */

/**
 * Returns normalized lineStyle-Options.
 * 
 * @param {module:meteoJS/thermodynamicDiagram~lineStyleOptions}
 *   [options] - Options.
 * @returns {module:meteoJS/thermodynamicDiagram~lineStyleOptions}
 *   Normalized options.
 * @private
 */
export function getNormalizedLineStyleOptions({
  color = 'black',
  width = 1,
  opacity = undefined,
  linecap = undefined,
  linejoin = undefined,
  dasharray = undefined
} = {}) {
  return {
    color,
    width,
    opacity,
    linecap,
    linejoin,
    dasharray
  };
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
 * @returns {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   Normalized options.
 * @internal
 */
export function getNormalizedLineOptions({
  visible = true,
  style = {}
} = {}) {
  return {
    visible,
    style: getNormalizedLineStyleOptions(style)
  };
}

/**
 * Definition of font options.
 * 
 * @typedef {Object} module:meteoJS/thermodynamicDiagram~fontOptions
 * @param {} [fill=undefined] - Font color.
 * @param {} [size=undefined] - Size.
 * @param {} [family=undefined] - Family.
 * @param {} [anchor=undefined] - Anchor.
 * @param {} [leading=undefined] - Leading.
 * @param {} [stretch=undefined] - Stretch.
 * @param {} [style=undefined] - Style.
 * @param {} [variant=undefined] - Variant.
 * @param {} [weight=undefined] - Weight.
 */

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
 * @returns {module:meteoJS/thermodynamicDiagram~textOptions}
 *   Normalized options.
 * @internal
 */
export function getNormalizedTextOptions({
  visible = true,
  font = {}
} = {}) {
  return {
    visible,
    font
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
 * @returns {module:meteoJS/thermodynamicDiagram~lineTextOptions}
 *   Normalized options.
 * @internal
 */
export function getNormalizedLineTextOptions({
  visible = true,
  style = {},
  font = {}
} = {}) {
  return {
    visible,
    style: getNormalizedLineStyleOptions(style),
    font
  };
}

/**
 * Draws text in a SVG node.
 * 
 * @param {Object} options - Options.
 * @param {external:SVG} node - SVG node.
 * @param {string} text - Text.
 * @param {number} x - X coordinate.
 * @param {number} y - Base Y coordinate.
 * @param {number} [horizontalPadding=3] - Padding in x direction.
 * @param {module:meteoJS/thermodynamicDiagram~fontOptions} [font] - Font style.
 * @prarm {string|undefined} [fillColor='white'] - Background fill color.
 */
export function drawTextInto({
  node,
  text,
  x,
  y,
  horizontalPadding = 3,
  font = {},
  fillColor = 'white'
}) {
  const background = node.rect().fill(fillColor);
  const textNode = node
    .text(text)
    .attr({ x, y })
    .font(font);
  textNode.dy(-textNode.bbox().height);
  textNode
    .dx(horizontalPadding * ((textNode.attr('text-anchor') == 'end') ? -1 : 1));
  background.attr({
    x: textNode.bbox().x,
    y: textNode.bbox().y,
    width: textNode.bbox().width,
    height: textNode.bbox().height
  });
}