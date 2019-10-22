/**
 * @module meteoJS/modelviewer/container
 */
import Unique from '../base/Unique.js';
import addEventFunctions from '../Events.js';
import Resource from './Resource.js';

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
 * @event module:meteoJS/modelviewer/container#change:visibleResource
 * @type Object
 * @property {...module:meteoJS/modelviewer/variable.Variable} [variables] - Variables.
 */

/**
 * @event module:meteoJS/modelviewer/container#change:displayVariables
 */

/**
 * @classdesc
 
 * Kann  gesagt werden, was er zeigen soll (entscheidet dann je nach verfügbarkeit, was effektiv gezeigt wird)
 * Abfrage, was effektiv angezeigt ist
 * Muss von Timeline change:time empfangen
 * Muss von Resources change:resources empfangen
 * Wie löst man ListDisplay?
 * Wie löst man das Starten eines AjAX-Callers, wenn der Run wechselt.
 * Einstellung ob bei der Anzeige der Resource auch etwas "ähnliches" angezeigt werden darf, oder ob es exakt stimmen muss.
 * Gibt das eine Klasse ohne Kind-Klassen sondern reiner Konfiguration?
 * Diese Klasse ev. ohne jQuery-Inhalt!!!
 
 * @fires module:meteoJS/modelviewer/container#change:visibleResource
 * @fires module:meteoJS/modelviewer/container#change:displayVariables
 */
export class Container extends Unique {

  /**
   * @param {module:meteoJS/modelviewer/container~options} [options] - Options.
   */
  constructor({ id,
                display = undefined,
                showSimiliarResource = true,
                excludeVariableCollectionFromSimiliarDisplay = [],
                timesVariableCollection } = {}) {
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
    this._display.modelviewer = this.modelviewer;
    this._display.container = this;
    this._display.parentNode = node;
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
   * Variables, which define, which resource to display. The resource is defined by these
   * variables.
   * 
   * @type ...module:meteoJS/modelviewer/variable.Variable[]
   */
  get displayVariables() {
    return this._displayVariables;
  }
  set displayVariables(variables) {
    this._displayVariables = variables;
    this._setVisibleResource();
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
    let isChanged = false;
    let displayVariables = this.displayVariables
    .map(displayVariable => {
      variables.forEach(variable => {
        if (displayVariable.variableCollection ===
            variable.variableCollection) {
          if (displayVariable !== variable)
            isChanged = true;
          return variable;
        }
        else
          return displayVariable;
      });
    });
    variables.forEach(variable => {
      if (displayVariables.indexOf(variable) < 0) {
        displayVariables.push(variable);
        isChanged = true;
      }
    });
    if (isChanged) {
      this.displayVariables = displayVariables;
      this._setVisibleResource(...variables);
      this.trigger('change:displayVariables');
    }
    return this;
  }
  
  /**
   * ToDo: implement showSimiliarResource
   * 
   * @param {module:meteoJS/modelviewer/variable.Variable} variable - Variable.
   * @private
   */
  _setVisibleResource(variable) {
    let oldVisibleResource = this.visibleResource;
    let node = this.modelviewer.resources._getTopMostChildWithAllVariables(this.displayVariables, this.modelviewer.resources.topNode);
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
      resource = res;
    });
    this.visibleResource = resource;
    if (this.visibleResource.id != oldVisibleResource.id) {
      this.modelviewer.timeline.setEnabledTimesBySetID(this.id, this.getEnabledTimes());
      this.trigger('change:visibleResource', { variable });
    }
  }
  
  /**
   * Returns an array of times (for the timeline). For all of these times, there
   * exists resources which match with the current displayVariables.
   * 
   * @returns {Date[]} - Times.
   */
  getEnabledTimes() {
    if (this.visibleResource.id === undefined)
      return [];
    return this.modelviewer.resources
           .getTimes(...this.visibleResource.variables);
  }
  
  /**
   * Mirrors (parts of) the displayVariables form another container. With this
   * feature, e.g. in different containers can be viewed plots of different
   * models. If you change e.g. the field in the first container, all other
   * containers, that mirrors form this container, will also change the viewed
   * content.
   * 
   * @param {module:meteoJS/modelviewer/container.Container} container
   *   Mirrors from this container.
   * @param {module:meteoJS/modelviewer/variableCollection.VariableCollection[]}
   *   variableCollections - The displayVariables of these VariableCollections
   *   are mirrored.
   */
  mirrorsFrom(container, variableCollections) {
    container.on('change:displayVariables', () => {
      let newDisplayVariables = [];
      container.displayVariables.forEach(variable => {
        variableCollections.items.forEach(collection => {
          if (variable.collection === collection)
            newDisplayVariables.push(variable);
        });
      });
      this.setDisplayVariableByVariableCollection(...newDisplayVariables);
    });
  }
}
addEventFunctions(Container.prototype);
export default Container;