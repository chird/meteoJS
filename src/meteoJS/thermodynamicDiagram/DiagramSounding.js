/**
 * @module meteoJS/thermodynamicDiagram/diagramSounding
 */
import addEventFunctions from '../Events.js';
import Unique from '../base/Unique.js';
import Collection from '../base/Collection.js';
import {
  getNormalizedLineOptions,
  updateLineOptions
} from '../thermodynamicDiagram/Functions.js';
import DiagramParcel from './DiagramParcel.js';

/**
 * Change visibility event. Only triggered, if the visibility of the sounding
 * changes, not if only a part's visibility (like hodograph) changes.
 * 
 * @event module:meteoJS/thermodynamicDiagram/diagramSounding#change:visible
 */

/**
 * Change options event.
 * 
 * @event module:meteoJS/thermodynamicDiagram/diagramSounding#change:options
 */

/**
 * Definition of the options for the constructor.
 * 
 * @typedef {Object} module:meteoJS/thermodynamicDiagram/diagramSounding~options
 * @param {boolean} [visible=true] - Visibility of the sounding.
 * @param {module:meteoJS/thermodynamicDiagram/diagramSounding~diagramOptions}
 *   [diagram] - Options for the thermodynamic diagram part.
 * @param {module:meteoJS/thermodynamicDiagram/diagramSounding~windprofileOptions}
 *   [windprofile] - Options for the windprofile part.
 * @param {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   [hodograph] - Options for this sounding for the hodograph.
 * @param {module:meteoJS/thermodynamicDiagram/diagramSounding~parcelsOptions}
 *   [parcels] - Options for this sounding for the parcels.
 */

/**
 * Representation of a plotted sounding (data and display options)
 * 
 * <pre><code>import DiagramSounding from 'meteojs/thermodynamicDiagram/DiagramSounding';</code></pre>
 * 
 * @extends module:meteoJS/base/unique.Unique
 * @fires module:meteoJS/thermodynamicDiagram/diagramSounding#change:visible
 * @fires module:meteoJS/thermodynamicDiagram/diagramSounding#change:options
 */
export class DiagramSounding extends Unique {
  
  /**
   * @param {module:meteoJS/sounding.Sounding} sounding - Sounding data.
   * @param {module:meteoJS/thermodynamicDiagram/diagramSounding~options} [options] - Options.
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
     * @type module:meteoJS/base/collection.Collection
     * @private
     */
    this._diagramParcelCollection = new Collection({
      fireReplace: false,
      fireAddRemoveOnReplace: true,
      emptyObjectMaker: () => new DiagramParcel()
    });
    
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
      diagram: getNormalizedDiagramOptions(diagram),
      windprofile:  getNormalizedWindprofileOptions(windprofile),
      hodograph: getNormalizedHodographOptions(hodograph),
      parcels: getNormalizedParcelsOptions(parcels)
    };
    
    // Initialize soundig-object with its parcels.
    if (this._sounding !== undefined) {
      this._sounding.parcelCollection.on('add:item',
        parcel => this.addParcel(parcel));
      this._sounding.parcelCollection.on('remove:item', parcel => {
        for (let diagramParcel of this._diagramParcelCollection)
          if (diagramParcel.parcel === parcel)
            this._diagramParcelCollection.remove(diagramParcel);
      });
      for (let parcel of this._sounding.parcelCollection)
        this.addParcel(parcel);
    }
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
   * @fires module:meteoJS/thermodynamicDiagram/diagramSounding#change:visible
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
   * Collection of the DiagramParcel objects.
   * 
   * @type module:meteoJS/base/collection.Collection
   * @readonly
   */
  get diagramParcelCollection() {
    return this._diagramParcelCollection;
  }
  
  /**
   * Add a parcel with styles to the sounding.
   * (analogue to {@link module:meteoJS/thermodynamicDiagramPluggable.ThermodynamicDiagramPluggable#addSounding})
   * 
   * @param {module:meteoJS/sounding/parcel.Parcel} parcel - Parcel object.
   * @param {module:meteoJS/thermodynamicDiagram/diagramParcel~parcelOptions}
   *   [options] - Style options.
   * @returns {module:meteoJS/thermodynamicDiagram/diagramParcel.diagramParcel}
   *   Parcel object for the diagram with style options.
   */
  addParcel(parcel, options = undefined) {
    options = (options === undefined) ? this.getParcelOptions(parcel) : options;
    options.parcel = parcel;
    const dp = new DiagramParcel(options);
    this._diagramParcelCollection.append(dp);
    return dp;
  }
  
  /**
   * Updated the style options for this sounding.
   * 
   * @param {module:meteoJS/thermodynamicDiagram/diagramSounding~options}
   *   [options] - Options.
   * @fires module:meteoJS/thermodynamicDiagram/diagramSounding#change:visible
   * @fires module:meteoJS/thermodynamicDiagram/diagramSounding#change:options
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
    
    this._options.diagram =
      updateDiagramOptions(this._options.diagram, diagram);
    this._options.windprofile =
      updateWindprofileOptions(this._options.windprofile, windprofile);
    this._options.hodograph =
      updateHodographOptions(this._options.hodograph, hodograph);
    if (willTrigger)
      this.trigger('change:options');
    
    if (parcels === undefined)
      parcels = {};
    this._options.parcels =
      updateParcelsOptions(this._options.parcels, parcels);
    for (let diagramParcel of this.diagramParcelCollection) {
      if (diagramParcel.id in parcels)
        diagramParcel.update(parcels[diagramParcel.id]);
    }
    
    if (visible !== undefined)
      this.visible = visible;
  }
  
  /**
   * Returns normalized visibility and style options for a parcel. This is a
   * combination of the specific options for the passed parcel and the defaults.
   * 
   * @param {module:meteoJS/sounding/parcel.Parcel} [parcel] - Parcel.
   * @returns {module:meteoJS/thermodynamicDiagram/diagramSounding~parcelsOptions}
   *   Parcel options.
   * @public
   */
  getParcelOptions(parcel = undefined) {
    let result = {
      visible: this.options.parcels.default.visible,
      temp: {
        visible: this.options.parcels.default.temp.visible,
        style: {}
      },
      dewp: {
        visible: this.options.parcels.default.dewp.visible,
        style: {}
      }
    };
    ['temp', 'dewp'].forEach(key => {
      Object.keys(this.options.parcels.default[key].style).forEach(styleKey => {
        result[key].style[styleKey] =
          this.options.parcels.default[key].style[styleKey];
      });
    });
    if (parcel !== undefined &&
        parcel.id in this.options.parcels)
      result = updateOptionsPart(result, this.options.parcels[parcel.id],
        ['temp', 'dewp']);
    return result;
  }
}
addEventFunctions(DiagramSounding.prototype);
export default DiagramSounding;

/**
 * Style/visibility options for a sounding in the thermodynamic diagram.
 * 
 * @typedef {Object} module:meteoJS/thermodynamicDiagram/diagramSounding~diagramOptions
 * @param {boolean} [visible=true]
 *   Visibility in the thermodynamic diagram.
 * @param {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   [temp] - Options for the temperature curve.
 * @param {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   [dewp] - Options for the dewpoint curve.
 * @param {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   [wetbulb] - Options for the wetbulb temperature curve.
 */

/**
 * Returns normalized diagram options.
 * 
 * @param {module:meteoJS/thermodynamicDiagram/diagramSounding~diagramOptions}
 *   [options] - Options.
 * @returns {module:meteoJS/thermodynamicDiagram/diagramSounding~diagramOptions}
 *   Normalized options.
 * @private
 */
function getNormalizedDiagramOptions({
  visible = true,
  temp = {},
  dewp = {},
  wetbulb = {}
} = {}) {
  return {
    visible,
    temp: getNormalizedLineOptions(temp, {
      style: {
        color: 'red',
        width: 3,
        linecap: 'round'
      }
    }),
    dewp: getNormalizedLineOptions(dewp, {
      style: {
        color: 'blue',
        width: 3,
        linecap: 'round'
      }
    }),
    wetbulb: getNormalizedLineOptions(wetbulb, {
      style: {
        color: 'green',
        width: 2,
        linecap: 'round'
      }
    })
  };
}

/**
 * Updates diagram options.
 * 
 * @param {module:meteoJS/thermodynamicDiagram/diagramSounding~diagramOptions}
 *   options - Current options.
 * @param {module:meteoJS/thermodynamicDiagram/diagramSounding~diagramOptions}
 *   updateOptions - Some new options.
 * @returns {module:meteoJS/thermodynamicDiagram/diagramSounding~diagramOptions}
 *   New options object.
 * @private
 */
function updateDiagramOptions(options, updateOptions) {
  return updateOptionsPart(options, updateOptions, ['temp', 'dewp', 'wetbulb']);
}

/**
 * Style/visibility options for a sounding in the windprofile.
 * 
 * @typedef {Object} module:meteoJS/thermodynamicDiagram/diagramSounding~windprofileOptions
 * @param {boolean} [visible=true] - Visibility in the windprofile part.
 * @param {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   [windbarbs] - Options for the windbarbs.
 * @param {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   [windspeed] - Options for the windspeed line.
 */

/**
 * Returns normalized windprofile options.
 * 
 * @param {module:meteoJS/thermodynamicDiagram/diagramSounding~windprofileOptions}
 *   [options] - Options.
 * @returns {module:meteoJS/thermodynamicDiagram/diagramSounding~windprofileOptions}
 *   Normalized options.
 * @private
 */
function getNormalizedWindprofileOptions({
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
 * Updates windprofile options.
 * 
 * @param {module:meteoJS/thermodynamicDiagram/diagramSounding~windprofileOptions}
 *   options - Current options.
 * @param {module:meteoJS/thermodynamicDiagram/diagramSounding~windprofileOptions}
 *   updateOptions - Some new options.
 * @returns {module:meteoJS/thermodynamicDiagram/diagramSounding~windprofileOptions}
 *   New options object.
 * @private
 */
function updateWindprofileOptions(options, updateOptions) {
  return updateOptionsPart(options, updateOptions, ['windbarbs', 'windspeed']);
}

/**
 * Style/visibility options for a sounding in the hodograph.
 * 
 * @typedef {module:meteoJS/thermodynamicDiagram~lineOptions}
 *   module:meteoJS/thermodynamicDiagram/diagramSounding~hodographOptions
 * @property {number|undefined}
 *   [minPressure] - Minimum pressure level to plot in the hodograph. Unit: hPa.
 * @property {number|undefined}
 *   [maxPressure] - Maximum pressure level to plot in the hodograph. Unit: hPa.
 */

/**
 * Returns normalized hodograph options.
 * 
 * @param {module:meteoJS/thermodynamicDiagram/diagramSounding~hodographOptions}
 *   [options] - Options.
 * @returns {module:meteoJS/thermodynamicDiagram/diagramSounding~hodographOptions}
 *   Normalized options.
 * @private
 */
function getNormalizedHodographOptions({
  minPressure = undefined,
  maxPressure = undefined,
  ...result
} = {}) {
  result = getNormalizedLineOptions(result);
  result.minPressure = minPressure;
  result.maxPressure = maxPressure;
  return result;
}

/**
 * Updates hodograph options.
 * 
 * @param {module:meteoJS/thermodynamicDiagram/diagramSounding~hodographOptions}
 *   options - Current options.
 * @param {module:meteoJS/thermodynamicDiagram/diagramSounding~hodographOptions}
 *   updateOptions - Some new options.
 * @returns {module:meteoJS/thermodynamicDiagram/diagramSounding~hodographOptions}
 *   New options object.
 * @private
 */
function updateHodographOptions(options, updateOptions) {
  options = updateLineOptions(options, updateOptions);
  ['minPressure', 'maxPressure'].forEach(styleKey => {
    if (styleKey in updateOptions)
      options[styleKey] = updateOptions[styleKey];
  });
  return options;
}

/**
 * Visibility/style of the parcels. This object can contain further keys with
 * values as {@link module:meteoJS/thermodynamicDiagram/diagramSounding~diagramOptions}
 * which applies to the parcel with the equivalent id.
 * 
 * @typedef {Object} module:meteoJS/thermodynamicDiagram/diagramSounding~parcelsOptions
 * @param {boolean} [visible=true] - Visibility of the parcels.
 * @param {module:meteoJS/thermodynamicDiagram/diagramSounding~diagramOptions}
 *   [default] - Default options for a parcel.
 */

/**
 * Returns normalized parcels options.
 * 
 * @param {module:meteoJS/thermodynamicDiagram/diagramSounding~parcelsOptions}
 *   [options] - Options.
 * @returns {module:meteoJS/thermodynamicDiagram/diagramSounding~parcelsOptions}
 *   Normalized options.
 * @private
 */
function getNormalizedParcelsOptions(options = {}) {
  if (options.visible === undefined)
    options.visible = true;
  if (options.default === undefined)
    options.default = {};
  if (options.default.visible === undefined)
    options.default.visible = false;
  if (options.default.temp === undefined)
    options.default.temp = {};
  if (options.default.temp.visible === undefined)
    options.default.temp.visible = true;
  if (options.default.temp.style === undefined)
    options.default.temp.style = {};
  if (options.default.temp.style.color === undefined)
    options.default.temp.style.color = 'rgb(255, 153, 0)';
  if (options.default.temp.style.width === undefined)
    options.default.temp.style.width = 3;
  if (options.default.temp.style.linecap === undefined)
    options.default.temp.style.linecap = 'round';
  if (options.default.dewp === undefined)
    options.default.dewp = {};
  if (options.default.dewp.visible === undefined)
    options.default.dewp.visible = true;
  if (options.default.dewp.style === undefined)
    options.default.dewp.style = {};
  if (options.default.dewp.style.color === undefined)
    options.default.dewp.style.color = 'rgb(255, 194, 102)';
  if (options.default.dewp.style.width === undefined)
    options.default.dewp.style.width = 3;
  if (options.default.dewp.style.linecap === undefined)
    options.default.dewp.style.linecap = 'round';
  return options;
}

/**
 * Updates Parcels options.
 * 
 * @param {module:meteoJS/thermodynamicDiagram/diagramSounding~parcelsOptions}
 *   options - Current options.
 * @param {module:meteoJS/thermodynamicDiagram/diagramSounding~parcelsOptions}
 *   updateOptions - Some new options.
 * @returns {module:meteoJS/thermodynamicDiagram/diagramSounding~parcelsOptions}
 *   New options object.
 * @private
 */
function updateParcelsOptions(options, updateOptions) {
  if ('visible' in updateOptions)
    options.visible = updateOptions.visible;
  if ('default' in updateOptions)
    options.default =
      updateOptionsPart(options.default, updateOptions.default,
        ['temp', 'dewp']);
  Object.keys(updateOptions)
    .filter(key => key != 'visible' && key != 'default')
    .forEach(key =>
      options[key] =
        updateDiagramOptions(
          (key in options) ? options[key] : {},
          updateOptions[key]));
  return options;
}

/**
 * Updates diagram/windprofile options.
 * 
 * @param {module:meteoJS/thermodynamicDiagram/diagramSounding~diagramOptions|module:meteoJS/thermodynamicDiagram/diagramSounding~windprofileOptions}
 *   options - Current options.
 * @param {module:meteoJS/thermodynamicDiagram/diagramSounding~diagramOptions|module:meteoJS/thermodynamicDiagram/diagramSounding~windprofileOptions}
 *   updateOptions - Some new options.
 * @param {Array.<string>} [lineKeys] - Keys to update.
 * @returns {module:meteoJS/thermodynamicDiagram/diagramSounding~diagramOptions|module:meteoJS/thermodynamicDiagram/diagramSounding~windprofileOptions}
 *   New options object.
 * @private
 */
function updateOptionsPart(options, updateOptions, lineKeys = []) {
  if ('visible' in updateOptions)
    options.visible = updateOptions.visible;
  lineKeys.forEach(key => {
    if (key in updateOptions)
      options[key] = updateLineOptions(options[key] ? options[key] : { style: {} }, updateOptions[key]);
  });
  return options;
}