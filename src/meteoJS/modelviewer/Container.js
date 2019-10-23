/**
 * @module meteoJS/modelviewer/container
 */
import Unique from '../base/Unique.js';
import addEventFunctions from '../Events.js';
import Resource from './Resource.js';

/**
 * Triggered, when visible Resource changes.
 * 
 * @event module:meteoJS/modelviewer/container#change:visibleResource
 * @type {Object}
 * @property {...module:meteoJS/modelviewer/variable.Variable} [variables] - Variables.
 */

/**
 * Triggered, when the displayVariables are changed.
 * 
 * @event module:meteoJS/modelviewer/container#change:displayVariables
 */

/**
 * Options for constructor.
 * 
 * @typedef {module:meteoJS/base/unique~options}
 *   module:meteoJS/modelviewer/container~options
 * @param {module:meteoJS/modelviewer/display.Display} [display]
 *   Display object to output the container content to DOM.
 * @param {boolean} [showSimiliarResource] - .
 */

/**
 * @classdesc
 * 
 * @fires module:meteoJS/modelviewer/container#change:visibleResource
 * @fires module:meteoJS/modelviewer/container#change:displayVariables
 */
export class Container extends Unique {

  /**
   * @param {module:meteoJS/modelviewer/container~options} [options] - Options.
   */
  constructor({ id,
                display = undefined,
                showSimiliarResource = false,
                excludeVariableCollectionFromSimiliarDisplay = [] } = {}) {
    super({
      id
    });
    
    /**
     * @type undefined|module:meteoJS/modelviewer/display.Display
     * @private
     */
    this._display;
    this.display = display;
    
    /**
     * @type undefined|module:meteoJS/modelviewer.Modelviewer
     * @private
     */
    this._modelviewer = undefined;
    
    /**
     * @type undefined|module:meteoJS/modelviewer/resource.Resource
     * @private
     */
    this._visibleResource;
    
    /**
     * @type module:meteoJS/modelviewer/variable.Variable[]
     * @private
     */
    this._displayVariables = [];
    
    /**
     * @type undefined|HTMLElement
     * @private
     */
    this._containerNode = undefined;
    
    /**
     * @type undefined|number
     * @private
     */
    this._mirrorListener = {
      container: undefined,
      listenerKey: undefined
    };
  }
  
  /**
   * @type undefined|module:meteoJS/modelviewer/display.Display
   */
  get display() {
    return this._display;
  }
  set display(display) {
    let node = (this.display !== undefined) ?
                 this._display.parentNode : undefined;
    this._display = display;
    if (this._display !== undefined) {
      this._display.modelviewer = this.modelviewer;
      this._display.container = this;
      this._display.parentNode = node;
    }
  }
  
  /**
   * @type undefined|module:meteoJS/modelviewer.Modelviewer
   */
  get modelviewer() {
    return this._modelviewer;
  }
  set modelviewer(modelviewer) {
    this._modelviewer = modelviewer;
    if (this._modelviewer === undefined)
      return;
    this._modelviewer.timeline
      .on('change:time', time => this._setVisibleResource());
    this._modelviewer.resources
      .on('change:resources', () => this._setVisibleResource());
  }
  
  /**
   * @type undefined|HTMLElement
   */
  get containerNode() {
    return this._containerNode;
  }
  set containerNode(containerNode) {
    this._containerNode = containerNode;
    if (this._containerNode === undefined)
      return;
    if (this._display !== undefined)
      this._display.parentNode = this._containerNode;
  }
  
  /**
   * Currently visible resource. Could be an empty resource.
   * 
   * @type module:meteoJS/modelviewer/resource.Resource
   * @readonly
   */
  get visibleResource() {
    return (this._visibleResource === undefined) ?
      new Resource() : this._visibleResource;
  }
  
  /**
   * These variables define, which resource is displayed.
   * If showSimiliarResource is false, then the displayed resource is exactly
   * defined by these variables (and additionally the datetime selected by the
   * timeline object). If showSimiliarResource is true, then a resource is
   * displayed, that matches the variables but can be defined by additional
   * variables.
   * 
   * @type ...module:meteoJS/modelviewer/variable.Variable[]
   */
  get displayVariables() {
    return this._displayVariables;
  }
  set displayVariables(variables) {
    let newVariables =
      variables.filter(v => this._displayVariables.indexOf(v) < 0);
    if (newVariables.length > 0) {
      this._displayVariables = variables;
      this._setVisibleResource();
      this.trigger('change:displayVariables');
    }
  }
  
  /**
   * Returns an array of times (for the timeline). For all of these times, there
   * exists resources which match with the current displayVariables.
   * 
   * @type Date[]
   * @readonly
   */
  get enabledTimes() {
    return this.modelviewer.resources
           .getTimesByVariables(...this.displayVariables);
  }
  
  /**
   * Changes one variable in displayVariables. The variable with the same
   * Collection will be exchanged. If none is found, the variable will be added.
   * 
   * @param {...module:meteoJS/modelviewer/variable.Variable} variables
   *   Add these variables to the set of displayVariables.
   * @returns {module:meteoJS/modelviewer/container.Container} - This.
   * @fires module:meteoJS/modelviewer/container#change:displayVariables
   */
  setDisplayVariableByVariableCollection(...variables) {
    let displayVariables = this.displayVariables
    .map(displayVariable => {
      let result = displayVariable;
      variables.forEach(variable => {
        if (displayVariable.variableCollection ===
            variable.variableCollection)
          result = variable;
      });
      return result;
    });
    variables.forEach(variable => {
      if (displayVariables.indexOf(variable) < 0)
        displayVariables.push(variable);
    });
    this.displayVariables = displayVariables;
    return this;
  }
  
  /**
   * ToDo: implement showSimiliarResource
   * 
   * @param {module:meteoJS/modelviewer/variable.Variable} variable - Variable.
   * @private
   */
  _setVisibleResource(...variables) {
    let oldVisibleResource = this.visibleResource;
    let node = this.modelviewer.resources
      .getTopMostNodeWithAllVariables(...this.displayVariables);
    while (node.resources.length == 0) {
      if (node.children.length == 0)
        break;
      node = node.children[0];
    }
    if (node.resources.length == 0)
      return;
    let resources =
      node.getResourcesByVariables(...this.displayVariables);
    let resource = undefined;
    resources.forEach(res => {
      if (resource !== undefined) {
        if (resource.datetime !== undefined)
          return;
        if (res.datetime === undefined)
          return;
      }
      if (res.datetime === undefined ||
          res.datetime.valueOf() == this.modelviewer.timeline.getSelectedTime().valueOf())
        resource = res;
    });
    this._visibleResource = resource;
    if (this.visibleResource.id != oldVisibleResource.id)
      this.trigger('change:visibleResource', { variable });
    if (variables.length == 0 ||
        this.visibleResource.id != oldVisibleResource.id)
      this.modelviewer.timeline
      .setEnabledTimesBySetID(this.id, this.enabledTimes);
  }
  
  /**
   * Mirrors (parts of) the displayVariables form another container. With this
   * feature, e.g. in different containers can be viewed plots of different
   * models. If you change e.g. the field in the first container, all other
   * containers, that mirrors form this container, will also change the viewed
   * content.
   * 
   * @param {module:meteoJS/modelviewer/container.Container} [container]
   *   Mirrors from this container.
   * @param {module:meteoJS/modelviewer/variableCollection.VariableCollection[]}
   *   [variableCollections] - The displayVariables of these VariableCollections
   *   are mirrored.
   */
  mirrorsFrom(container = undefined, variableCollections = undefined) {
    if (this._mirrorListener.listenerKey !== undefined)
      this._mirrorListener.container.un(this._mirrorListener.listenerKey);
    if (container === undefined)
      return;
    if (variableCollections === undefined)
      variableCollections = this.modelviewer.resources.variableCollections;
    this._mirrorListener.container = container;
    let onChangeDisplayVariables = () => {
      let newDisplayVariables = [];
      container.displayVariables.forEach(variable => {
        variableCollections.forEach(collection => {
          if (variable.variableCollection === collection)
            newDisplayVariables.push(variable);
        });
      });
      this.setDisplayVariableByVariableCollection(...newDisplayVariables);
    };
    this._mirrorListener.listenerKey =
      container.on('change:displayVariables', onChangeDisplayVariables);
    onChangeDisplayVariables();
  }
}
addEventFunctions(Container.prototype);
export default Container;