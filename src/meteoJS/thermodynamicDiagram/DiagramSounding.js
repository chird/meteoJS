/**
 * @module meteoJS/thermodynamicDiagram/sounding
 */
import addEventFunctions from '../Events.js';
import Unique from '../base/Unique.js';
import { getNormalizedLineOptions } from '../ThermodynamicDiagram.js';

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
 * @param {module:meteoJS/thermodynamicDiagram/sounding~parcelsOptions}
 *   [parcels] - Options for this sounding for the parcels.
 */

/**
 * Representation of a plotted sounding (data and display options)
 * 
 * @extends module:meteoJS/base/unique.Unique
 * @fires module:meteoJS/thermodynamicDiagram/sounding#change:visible
 * @fires module:meteoJS/thermodynamicDiagram/sounding#change:options
 */
export class DiagramSounding extends Unique {
  
  /**
   * @param {module:meteoJS/sounding.Sounding} sounding - Sounding data.
   * @param {module:meteoJS/thermodynamicDiagram/sounding~options} [options] - Options.
   */
  constructor(sounding, {
    visible = true,
    diagram = {},
    windprofile = {},
    hodograph = {},
    parcels = {}
  } = {}) {
    super();
    
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
      hodograph: getNormalizedLineOptions(hodograph),
      parcels: getNormalizedParcelsOptions(parcels)
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
    hodograph = undefined,
    parcels = undefined
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
    if (parcels === undefined)
      parcels = {};
    else
      willTrigger = true;
    
    updateDiagramOptions(this._options.diagram, diagram);
    if ('visible' in windprofile)
      this._options.windprofile.visible = windprofile.visible;
    ['windbarbs', 'windspeed'].forEach(key => {
      if (key in windprofile)
        this._options.windprofile[key] =
          updateLineOptions(this._options.windprofile[key], windprofile[key]);
    });
    this._options.hodograph =
      updateLineOptions(this._options.hodograph, hodograph);
    this._options.parcels =
      updateParcelsOptions(this._options.parcels, parcels);
    if (willTrigger)
      this.trigger('change:options');
    
    if (visible !== undefined)
      this.visible = visible;
  }
}
addEventFunctions(DiagramSounding.prototype);
export default DiagramSounding;

/**
 * Style/visibility options for a sounding in the Thermodynamic diagram.
 * 
 * @typedef {Object} module:meteoJS/thermodynamicDiagram/sounding~diagramOptions
 * @param {boolean} [options.visible=true]
 *   Visibility in the thermodynamic diagram.
 * @param {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   [options.temp] - Options for the temperature curve.
 * @param {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   [options.dewp] - Options for the dewpoint curve.
 */

/**
 * Normalizes DiagramSounding-Options for the diagram part.
 * 
 * @param {module:meteoJS/thermodynamicDiagram/sounding~diagramOptions}
 *   [options] - Options.
 * @returns {module:meteoJS/thermodynamicDiagram/sounding~diagramOptions}
 *   Normalized options.
 * @private
 */
function normalizeDiagramOptions({
  visible = true,
  temp = {},
  dewp = {}
} = {}) {
  return {
    visible,
    temp: getNormalizedLineOptions(temp),
    dewp: getNormalizedLineOptions(dewp)
  };
}

/**
 * Updates diagram options.
 * 
 * @param {module:meteoJS/thermodynamicDiagram/sounding~diagramOptions}
 *   options - Current options.
 * @param {module:meteoJS/thermodynamicDiagram/sounding~diagramOptions}
 *   updateOptions - Some new options.
 * @returns {module:meteoJS/thermodynamicDiagram/sounding~diagramOptions}
 *   New options object.
 * @private
 */
function updateDiagramOptions(options, updateOptions) {
  if ('visible' in updateOptions)
    options.visible = updateOptions.visible;
  ['temp', 'dewp'].forEach(key => {
    if (key in updateOptions)
      options[key] = updateLineOptions(options[key], updateOptions[key]);
  });
  return options;
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
    windbarbs: getNormalizedLineOptions(windbarbs),
    windspeed: getNormalizedLineOptions(windspeed)
  };
}

/**
 * Visibility/style of the parcels. This object can contain further keys with
 * values as {@link module:meteoJS/thermodynamicDiagram/sounding~diagramOptions}
 * which applies to the parcel with the equivalent id.
 * 
 * @typedef {Object} module:meteoJS/thermodynamicDiagram/sounding~parcelsOptions
 * @param {boolean} [visible=true] - Visibility of the parcels.
 * @param {module:meteoJS/thermodynamicDiagram/sounding~diagramOptions}
 *   [default] - Default options for a parcel.
 */

/**
 * Returns normalized parcels options.
 * 
 * @param {module:meteoJS/thermodynamicDiagram/sounding~parcelsOptions}
 *   [options] - Options.
 * @returns {module:meteoJS/thermodynamicDiagram/sounding~parcelsOptions}
 *   Normalized options.
 * @private
 */
function getNormalizedParcelsOptions(options = {}) {
  if (!('visible' in options))
    options.visible = true;
  if (!('default' in options))
    options.default = {}
  options.default = normalizeDiagramOptions(options.default);
  Object.keys(options)
    .filter(key => key != 'visible' && key != 'default')
    .forEach(key => options[key] = normalizeDiagramOptions(options[key]));
  return options;
}

/**
 * Updates Parcels options.
 * 
 * @param {module:meteoJS/thermodynamicDiagram/sounding~parcelsOptions}
 *   options - Current options.
 * @param {module:meteoJS/thermodynamicDiagram/sounding~parcelsOptions}
 *   updateOptions - Some new options.
 * @returns {module:meteoJS/thermodynamicDiagram/sounding~parcelsOptions}
 *   New options object.
 * @private
 */
function updateParcelsOptions(options, updateOptions) {
  if ('visible' in updateOptions)
    options.visible = updateOptions.visible;
  if ('default' in updateOptions)
    options.default =
      updateDiagramOptions(options.default, updateOptions.default);
  Object.keys(updateOptions)
    .filter(key => key != 'visible' && key != 'default')
    .forEach(key =>
      options[key] = updateDiagramOptions((key in options) ? options[key] : normalizeDiagramOptions({}), updateOptions[key]));
  return options;
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