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
 */

/**
 * @classdesc
 
 * Kann  gesagt werden, was er zeigen soll (entscheidet dann je nach verfügbarkeit, was effektiv gezeigt wird)
 * Abfrage, was effektiv angezeigt ist
 * Muss von Timeline change:time empfangen
 * Wie löst man ListDisplay?
 * Wie löst man das Starten eines AjAX-Callers, wenn der Run wechselt.
 * Einstellung ob bei der Anzeige der Resource auch etwas "ähnliches" angezeigt werden darf, oder ob es exakt stimmen muss.
 * Gibt das eine Klasse ohne Kind-Klassen sondern reiner Konfiguration?
 * Diese Klasse ev. ohne jQuery-Inhalt!!!
 
 * @fires module:meteoJS/modelviewer/container#change:visibleResource
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
    this._display = display;
    
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
    this._display = display;
    this._display.container = this;
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
    this._modelviewer.timeline.on('change:time', time => {
      
    });
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
   * @param {module:meteoJS/modelviewer/variable.Variable} variable - Variable.
   */
  setDisplayVariableByVariableCollection(variable) {
    let exchanged = false;
    let displayVariables = this.displayVariables
    .map(v => {
      if (v.variableCollection === variable.variableCollection) {
        exchanged = true;
        return variable;
      }
      else
        return v;
    });
    if (!exchanged)
      displayVariables.push(variable);
    this.displayVariables = displayVariables;
  }
  
  _setVisibleResource() {
    /*let node = resources.getMostDownNodeByVariables(...this.displayVariables);
    while (node.resources.length == 0)
      BestChild -> wieder schauen
    let resources =
      this.modelviewer.resources.getResourcesByVariables(...this.displayVariables);
    has resource with time -> resource
    -> resource without time -> resource
    if changes
    this.modelviewer.timeline.setEnabledTimesBySetID(this.id, this.getTimes());*/
  }
  
  getTimes() {
    if (this.visibleResource === undefined)
      return [];
    let variables = [...this.visibleResource.variables]
    .filter(variable => {
      return (variable.variablesCollection.id == 'model' ||
              variable instanceof TimeVariable);
    });
    this.modelviewer.resources.getTimes(...variables);
  }
  
  /**
   * Returns times (for the timeline) of available resources for the current
   * setup display.
   */
  getEnabledTimes() {
    if (this.visibleResource === undefined)
      return [];
    this.modelviewer.resources.getTimes(...this.visibleResource.variables);
  }
}
addEventFunctions(Container.prototype);
export default Container;