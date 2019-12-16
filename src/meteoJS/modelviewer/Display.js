/**
 * @module meteoJS/modelviewer/display
 */
import $ from 'jquery';
import addEventFunctions from '../Events.js';

/**
 * Display initalisation event.
 * 
 * @event module:meteoJS/modelviewer/display#init:display
 */

/**
 * VariableCollection add event. Also fired, once the object is assigned to
 * a Container object.
 * 
 * @event module:meteoJS/modelviewer/display#add:variableCollection
 * @type {Object}
 * @property {module:meteoJS/modelviewer/variableCollection.VariableCollection}
 *   variableCollection - The added variableCollection.
 */

/**
 * Adding a variable to a variableCollection event. Also fired for each variable
 * in the available variableCollections, once the object is assigned to a
 * Container object.
 * 
 * @event module:meteoJS/modelviewer/display#add:variable
 * @type {Object}
 * @property {module:meteoJS/modelviewer/variable.Variable} variable
 *   The added variable.
 */

/**
 * Change available variables event.
 * 
 * @event module:meteoJS/modelviewer/display#change:availableVariables
 * @type {Object}
 * @property {Set<module:meteoJS/modelviewer/variable.Variable>}
 *   availableVariables - Set of the available variables of a collection.
 * @property {module:meteoJS/modelviewer/variableCollection.VariableCollection}
 *   variableCollection - The collection all the variables belong to.
 */

/**
 * Change selected variable event.
 * 
 * @event module:meteoJS/modelviewer/display#change:selectedVariable
 * @type {Object}
 * @property {module:meteoJS/modelviewer/variable.Variable} variable
 *   The currently selected variable of the variableCollection. Could also be a
 *   empty variable with no id.
 * @property {module:meteoJS/modelviewer/variableCollection.VariableCollection}
 *   variableCollection - VariableCollection.
 */

/**
 * @classdesc
 * 
 * @fires module:meteoJS/modelviewer/display#init:display
 * @fires module:meteoJS/modelviewer/display#add:variableCollection
 * @fires module:meteoJS/modelviewer/display#add:variable
 * @fires module:meteoJS/modelviewer/display#change:availableVariables
 * @fires module:meteoJS/modelviewer/display#change:selectedVariable
 */
export class Display {
  
  constructor() {
    
    /**
     * @type undefined|module:meteoJS/modelviewer.Modelviewer
     * @private
     */
    this._modelviewer = undefined;
    
    /**
     * @type undefined|module:meteoJS/modelviewer/container.Container
     * @private
     */
    this._container = undefined;
    
    /**
     * @type undefined|HTMLElement|jQuery
     * @private
     */
    this._parentNode = undefined;
  }
  
  /**
   * @type undefined|module:meteoJS/modelviewer.Modelviewer
   * @package
   */
  get modelviewer() {
    return this._modelviewer;
  }
  set modelviewer(modelviewer) {
    this._modelviewer = modelviewer;
    if (this._modelviewer === undefined)
      return;
    
    this._modelviewer.resources.variableCollections.forEach(collection => {
      collection.on('add:variable', variable => {
        this.trigger('add:variable', { variable })
      });
    });
    this._modelviewer.resources
    .on('change:resources', () => this._changeResources());
  }
  
  /**
   * @type undefined|module:meteoJS/modelviewer/container.Container
   * @package
   */
  get container() {
    return this._container;
  }
  set container(container) {
    this._container = container;
    if (this._container === undefined)
      return;
    
    this._container.on('change:selectedVariables',
    ({ addedVariables, removedVariables }) => {
      this._onChangeSelectedVariables(addedVariables);
    });
    this._onChangeSelectedVariables();
    this._container.on('change:visibleResource', e => this.onChangeVisibleResource(e));
  }
  
  /**
   * @type HTMLElement|jQuery
   * @package
   */
  get parentNode() {
    return this._parentNode;
  }
  set parentNode(parentNode) {
    this._parentNode = parentNode;
    this.onInit();
  }
  
  /**
   * Re-Render this display.
   */
  render() {
    this.onInit();
    this.onChangeVisibleResource();
  }
  
  /**
   * @private
   */
  onInit() {
    if (this.parentNode === undefined)
      return
    
    $(this.parentNode).empty()
    this.trigger('init:display');
    if (this._modelviewer === undefined)
      return;
    
    this._modelviewer.resources.variableCollections
    .forEach(collection => {
      this.trigger('add:variableCollection', collection);
      for (let variable of collection)
        this.trigger('add:variable', variable);
    });
    this._onChangeSelectedVariables();
  }
  
  /**
   * Called when visibleResource changes.
   * 
   * @param {undefined|module:meteoJS/modelviewer/variable.Variable} [variable] - Variable.
   * @abstract
   * @protected
   */
  onChangeVisibleResource({ variable } = {}) {}
  
  /**
   * @private
   */
  _onChangeSelectedVariables(addedVariables = undefined) {
    this._changeResources();
    
    let selectedVariables = (addedVariables === undefined)
    ? this._container.selectedVariables
    : addedVariables;
    this._modelviewer.resources.variableCollections
    .forEach(variableCollection => {
      [...selectedVariables].forEach(variable => {
        if (variableCollection.contains(variable))
          this.trigger('change:selectedVariable',
                       { variable, variableCollection });
      });
    });
  }
  
  /**
   * @private
   */
  _changeResources() {
    if (this._modelviewer === undefined ||
        this._container === undefined)
      return;
    
    for (let variableCollection of this._modelviewer.resources.variableCollections) {
      let availableVariables = undefined;
      if (variableCollection === this._modelviewer.resources.topNode.variableCollection ||
          this._ignoreAvailableVariablesOfCollection.has(variableCollection))
        availableVariables = new Set(variableCollection.variables);
      else {
        let selectedVariables = this._container.selectedVariables;
   /*     if (selectedVariables.size == 0) {
          let lastSelectedVariable;
          [selectedVariables, lastSelectedVariable] =
      this._container._getSelectedVariablesWithResources(
        [this._modelviewer.resources.topNode],
        new Set(),
        undefined,
        (selectedVariables, lastSelectedVariable) => {
          let result = true;
          this._modelviewer.resources._timesVariableCollections.forEach(collection => {
            let contained = false;
            for (let selectedVariable of selectedVariables) {
              if (collection.contains(selectedVariable))
                contained = true;
            }
            if (!contained)
              result = false;
          });
          return result;
        }
      );
          
          if (selectedVariables === undefined)
            selectedVariables = new Set();
        }*/
        
        availableVariables =
          this._modelviewer.resources
          .getAvailableVariables(
            variableCollection,
            { variables: [...selectedVariables] }
          );
      }
      
      this.trigger('change:availableVariables', { availableVariables, variableCollection });
    }
  }
}
addEventFunctions(Display.prototype);
export default Display;