/**
 * @module meteoJS/thermodynamicDiagram/sounding
 */
import addEventFunctions from '../Events.js';

/**
 * Change visibility event. Only triggered, if the visibility of the sounding
 * changes, not if only a part's visibility (like hodograph) changes.
 * 
 * @event module:meteoJS/thermodynamicDiagram/sounding#change:visible
 */

/**
 * Change options event.
 * 
 * @event module:meteoJS/thermodynamicDiagram/sounding#change:options
 */

/**
 * A line with its visibility and style.
 * 
 * @typedef {Object} module:meteoJS/thermodynamicDiagram~lineOptions
 * @param {boolean} [visible=true] - Visibility of the line.
 * @param {module:meteoJS/thermodynamicDiagram~lineStyleOptions}
 *   [style] - Line style.
 */

/**
 * Definition of the options for the constructor.
 * 
 * @typedef {Object} module:meteoJS/thermodynamicDiagram/sounding~options
 * @param {boolean} [visible=true] - Visibility of the sounding.
 * @param {Object} [diagram] - Options for the thermodynamic diagram part.
 * @param {boolean} [diagram.visible=true]
 *   Visibility of this sounding in the thermodynamic diagram.
 * @param {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   [diagram.temp] - Options for the temperature curve of this sounding.
 * @param {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   [diagram.dewp] - Options for the dewpoint curve of this sounding.
 * @param {Object} [windprofile] - Options for the windprofile part.
 * @param {boolean} [windprofile.visible=true]
 *   Visibility of this sounding in the windprofile part.
 * @param {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   [windprofile.windbarbs] - Options for the windbarbs.
 * @param {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   [windprofile.windspeed] - Options for the windspeed line.
 * @param {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   [hodograph] - Options for this sounding for the hodograph.
 */

/**
 * Representation of a plotted sounding (data and display options)
 * 
 * @fires module:meteoJS/thermodynamicDiagram/sounding#change:visible
 * @fires module:meteoJS/thermodynamicDiagram/sounding#change:options
 */
export class DiagramSounding {
  
  /**
   * @param {module:meteoJS/sounding.Sounding} sounding - Sounding data.
   * @param {module:meteoJS/thermodynamicDiagram/sounding~options} [options] - Options.
   */
  constructor(sounding, {
    visible = true,
    diagram = {},
    windprofile = {},
    hodograph = {}
  } = {}) {
    /**
     * @type module:meteoJS/sounding.Sounding
     * @private
     */
    this._sounding = sounding;
    
    /**
     * @type boolean
     * @private
     */
    this._visible = visible;
    
    /**
     * @type Object
     * @private
     */
    this._options = {
      diagram: normalizeDiagramOptions(diagram),
      windprofile:  normalizeWindprofileOptions(windprofile),
      hodograph: normalizeVisibilityAndStyleOptions(hodograph)
    };
  }

  /**
   * Sounding data.
   * 
   * @type module:meteoJS/sounding.Sounding
   * @readonly
   */
  get sounding() {
    return this._sounding;
  }
  
  /**
   * Visibility of the sounding.
   * 
   * @type {boolean}
   * @fires module:meteoJS/thermodynamicDiagram/sounding#change:visible
   */
  get visible() {
    return this._visible;
  }
  set visible(visible) {
    let oldVisible = this._visible;
    this._visible = visible ? true : false;
    if (oldVisible != this._visible)
      this.trigger('change:visible');
  }
  
  get options() {
    return this._options;
  }
  
  /**
   * Updated the style options for this sounding.
   * 
   * @param {module:meteoJS/thermodynamicDiagram/sounding~options}
   *   [options] - Options.
   * @fires module:meteoJS/thermodynamicDiagram/sounding#change:visible
   * @fires module:meteoJS/thermodynamicDiagram/sounding#change:options
   */
  update({
    visible = undefined,
    diagram = undefined,
    windprofile = undefined,
    hodograph = undefined
  } = {}) {
    let willTrigger = false;
    if (diagram === undefined)
      diagram = {};
    else
      willTrigger = true;
    if (windprofile === undefined)
      windprofile = {};
    else
      willTrigger = true;
    if (hodograph === undefined)
      hodograph = {};
    else
      willTrigger = true;
    
    if ('visible' in diagram)
      this._options.diagram.visible = diagram.visible;
    ['temp', 'dewp'].forEach(key => {
      if (key in diagram)
        this._options.diagram[key] =
          updateLineOptions(this._options.diagram[key], diagram[key]);
    });
    if ('visible' in windprofile)
      this._options.windprofile.visible = windprofile.visible;
    ['windbarbs', 'windspeed'].forEach(key => {
      if (key in windprofile)
        this._options.windprofile[key] =
          updateLineOptions(this._options.windprofile[key], windprofile[key]);
    });
    this._options.hodograph =
      updateLineOptions(this._options.hodograph, hodograph);
    if (willTrigger)
      this.trigger('change:options');
    
    if (visible !== undefined)
      this.visible = visible;
  }
}
addEventFunctions(DiagramSounding.prototype);
export default DiagramSounding;

/**
 * Normalizes DiagramSounding-Options for the diagram part.
 * 
 * @param {Object} [options] - Options.
 * @param {boolean} [options.visible=true]
 *   Visibility of this sounding in the thermodynamic diagram.
 * @param {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   [options.temp] - Options for the temperature curve of this sounding.
 * @param {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   [options.dewp] - Options for the dewpoint curve of this sounding.
 * @returns {Object} - Normalized options.
 * @private
 */
function normalizeDiagramOptions({
  visible = true,
  temp = {},
  dewp = {}
} = {}) {
  return {
    visible,
    temp: normalizeVisibilityAndStyleOptions(temp),
    dewp: normalizeVisibilityAndStyleOptions(dewp)
  };
}

/**
 * Normalizes DiagramSounding-Options for the windprofile part.
 * 
 * @param {Object} [options] - Options.
 * @param {boolean} [options.visible=true]
 *   Visibility of this sounding in the windprofile part.
 * @param {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   [options.windbarbs] - Options for the windbarbs.
 * @param {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   [options.windspeed] - Options for the windspeed line.
 * @returns {Object} - Normalized options.
 * @private
 */
function normalizeWindprofileOptions({
  visible = true,
  windbarbs = {},
  windspeed = {}
} = {}) {
  return {
    visible,
    windbarbs: normalizeVisibilityAndStyleOptions(windbarbs),
    windspeed: normalizeVisibilityAndStyleOptions(windspeed)
  };
}

/**
 * Normalizes DiagramSounding-Options with visibility and style.
 * 
 * @param {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   [options] - Options.
 * @returns {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   Normalized options.
 * @private
 */
function normalizeVisibilityAndStyleOptions({
  visible = true,
  style = {}
} = {}) {
  return {
    visible,
    style: normalizeLineStyleOptions(style)
  };
}

/**
 * Normalizes lineStyle-Options.
 * 
 * @param {module:meteoJS/thermodynamicDiagram~lineStyleOptions}
 *   [options] - Options.
 * @returns {module:meteoJS/thermodynamicDiagram~lineStyleOptions}
 *   Normalized options.
 * @private
 */
function normalizeLineStyleOptions({
  color = undefined,
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
 * Updates DiagramSounding-Options with visibility and style.
 * 
 * @param {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   options - Current options.
 * @param {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   updateOptions - Some new options.
 * @returns {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   New options object.
 * @private
 */
function updateLineOptions(options, updateOptions) {
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