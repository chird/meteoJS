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
 */

/**
 * Triggered, when displayVariables is changed.
 * 
 * @event module:meteoJS/modelviewer/container#change:displayVariables
 * @type {Object}
 * @property {Set<module:meteoJS/modelviewer/variable.Variable>}
 *   [addedVariables] - Added variables to displayVariables.
 * @property {Set<module:meteoJS/modelviewer/variable.Variable>}
 *   [removedVariables] - Removed variables to displayVariables.
 */

/**
 * Triggered, when selectedVariables is changed.
 * 
 * @event module:meteoJS/modelviewer/container#change:selectedVariables
 * @type {Object}
 * @property {Set<module:meteoJS/modelviewer/variable.Variable>}
 *   [addedVariables] - Added variables to selectedVariables.
 * @property {Set<module:meteoJS/modelviewer/variable.Variable>}
 *   [removedVariables] - Removed variables to selectedVariables.
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
 * @fires module:meteoJS/modelviewer/container#change:selectedVariables
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
    this._display = undefined;
    this.display = display;
    
    this._showSimiliarResource = showSimiliarResource;
    
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
     * @type Set<module:meteoJS/modelviewer/variable.Variable>
     * @private
     */
    this._displayVariables = new Set();
    
    /**
     * @type Set<module:meteoJS/modelviewer/variable.Variable>
     * @private
     */
    this._selectedVariables = new Set();
    
    /**
     * @type module:meteoJS/modelviewer/node.Node|undefined
     * @private
     */
    this._selectedNode = undefined;
    
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
      .on('change:resources', () => {
        this._setTimes();
        this._updateSelectedVariables();
      });
    this._setTimes();
  }
  
  /**
   * @private
   */
  _setTimes() {
    this.modelviewer.timeline.setTimesBySetID(this.id, this.enabledTimes); //this.modelviewer.resources.getAllTimesByVariables(...this.displayVariables));
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
   * Setter allows Set or Array. Getter returns always Set.
   * 
   * @type Set<module:meteoJS/modelviewer/variable.Variable>
   */
  get displayVariables() {
    return this._displayVariables;
  }
  set displayVariables(variables) {
    let addedVariables = new Set();
    variables = new Set(variables);
    for (let variable of variables)
      if (!this._displayVariables.has(variable))
        addedVariables.add(variable);
    let removedVariables = new Set();
    for (let displayVariable of this.displayVariables)
      if (!variables.has(displayVariable))
        removedVariables.add(displayVariable);
    if (
      addedVariables.size > 0 ||
      removedVariables.size > 0
    ) {
      this._displayVariables = variables;
      // Hack: should be independet of models/runs
      if ([...addedVariables].filter(v => /^(models|runs)$/.test(v.variableCollection.id)))
        this._setTimes();
      this._updateSelectedVariables();
      this.trigger(
        'change:displayVariables',
        { addedVariables, removedVariables }
      );
    }
  }
  
  /**
   * These variables define excactly, which resource will be displayed. These
   * variables are retrieved from the available resources and displayVariables.
   * Together with the selected time in the timeline, the resource to display
   * is uniquely defined.
   * If showSimiliarResource selectedVariables are equal to displayVariables.
   * 
   * @type Set<module:meteoJS/modelviewer/variable.Variable>
   * @readonly
   */
  get selectedVariables() {
    return this._selectedVariables;
  }
  
  /**
   * Returns an array of times (for the timeline). For all of these times, there
   * exists resources which match with the current displayVariables.
   * 
   * @type Date[]
   * @readonly
   */
  get enabledTimes() {
    if (this._selectedNode === undefined)
      return [];
    
    let result = [];
    let valueOfSet = new Set();
    let resources = this._selectedNode.getResourcesByVariables(...this.selectedVariables);
    resources.forEach(resource => {
      if (resource.datetime === undefined)
        return;
      if (!valueOfSet.has(resource.datetime.valueOf())) {
        result.push(resource.datetime);
        valueOfSet.add(resource.datetime.valueOf());
      }
    });
    return result;
  }
  
  /**
   * Changes variables in displayVariables. The variable with the same
   * Collection will be exchanged. If none is found, the variable will be added.
   * 
   * @param {Set<module:meteoJS/modelviewer/variable.Variable>} variables
   *   Add these variables to the set of displayVariables.
   * @returns {module:meteoJS/modelviewer/container.Container} - This.
   * @fires module:meteoJS/modelviewer/container#change:displayVariables
   */
  setDisplayVariableByVariableCollection(variables) {
    let displayVariables = new Set(this.displayVariables);
    for (let variable of variables)
      for (let displayVariable of this.displayVariables)
        if (displayVariable.variableCollection ===
            variable.variableCollection) {
          displayVariables.delete(displayVariable);
          displayVariables.add(variable);
        }
    for (let variable of variables)
      if (!displayVariables.has(variable))
        displayVariables.add(variable);
    this.displayVariables = displayVariables;
    return this;
  }
  
  /**
   * @private
   */
  _updateSelectedVariables() {
    if (!this._showSimiliarResource) {
      this._setSelectedVariables(
        this.displayVariables,
        this.modelviewer.resources
        .getTopMostNodeWithAllVariables(...this.displayVariables)
      );
      return;
    }
    
    let availableVariablesMap = this.modelviewer.resources.availableVariablesMap;
    let resourcesNode = undefined;
    let selectedVariables = new Set();
    let nodes = [this.modelviewer.resources.topNode];
    whileNodes: do {
      let availableVariables = [];
      let variable = undefined;
      nodes.forEach(node => {
        if (availableVariablesMap.get(node).size)
          for (let availableVariable of availableVariablesMap.get(node)) {
            if (this.displayVariables.has(availableVariable)) {
              variable = availableVariable;
              resourcesNode = node;
            }
            else
              availableVariables.push(availableVariable);
          }
      });
      if (variable === undefined) {
        variable = this._getBestVariableOfAHierarchyLevel(availableVariables, selectedVariables);
        if (variable === undefined) {
          resourcesNode = undefined;
          break whileNodes;
        }
        resourcesNode = variable.variableCollection.node;
      }
      selectedVariables.add(variable);
      if (this._continueSelectedVariableSearch(selectedVariables, variable)) {
        let newNodes = [];
        nodes.forEach(node => {
          node.children.forEach(child => {
            if (availableVariablesMap.has(child))
              newNodes.push(child);
          });
        });
        nodes = newNodes;
      }
      else
        break whileNodes;
    } while (nodes.length > 0);
    if (resourcesNode !== undefined) {
      let resources = resourcesNode.getResourcesByVariables(...selectedVariables);
      //if (resources.length > 0)
        this._setSelectedVariables(selectedVariables, resourcesNode);
    }
  }
  
  /**
   * @param {Set<module:meteoJS/modelviewer/variable.Variable>}
   *   selectedVariables - New selectedVariables.
   * @param {module:meteoJS/modelviewer/node.Node} selectedNode
   *   Selectes resources from this Node.
   * @private
   */
  _setSelectedVariables(selectedVariables, selectedNode) {
    let addedVariables = new Set();
    selectedVariables = new Set(selectedVariables);
    for (let variable of selectedVariables)
      if (!this.selectedVariables.has(variable))
        addedVariables.add(variable);
    let removedVariables = new Set();
    for (let selectedVariable of this.selectedVariables)
      if (!selectedVariables.has(selectedVariable))
        removedVariables.add(selectedVariable);
    if (
      addedVariables.size > 0 ||
      removedVariables.size > 0
    ) {
      this._selectedVariables = selectedVariables;
      this._selectedNode = selectedNode;
      this.trigger(
        'change:selectedVariables',
        { addedVariables, removedVariables }
      );
      this.modelviewer.timeline
      .setEnabledTimesBySetID(this.id, this.enabledTimes);
      this._setVisibleResource();
    }
  }
  
  /**
   * @param {Set<module:meteoJS/modelviewer/variable.Variable>}
   *   selectedVariables - Top-down selected variables so far.
   * @param {module:meteoJS/modelviewer/variable.Variable} newVariable
   *   Last added variable to selectedVariables.
   * @private
   */
  _continueSelectedVariableSearch(selectedVariables, newVariable) {
    // Konfigruation...
    let resources = newVariable.variableCollection.node.getResourcesByVariables(...selectedVariables);
    return resources.length == 0;
  }
  
  /**
   * @param {Set<module:meteoJS/modelviewer/variable.Variable>}
   *   availableVariables - Availabe Variables of this hierarchy level.
   * @param {Set<module:meteoJS/modelviewer/variable.Variable>}
   *   selectedVariables - Top-down selected variables so far.
   * @private
   */
  _getBestVariableOfAHierarchyLevel(availableVariables, selectedVariables) {
    // Konfigruation...
    return availableVariables.length ? availableVariables[0] : undefined;
  }
  
  /**
   * Sets visible resource.
   * 
   * @private
   */
  _setVisibleResource() {
    let oldVisibleResource = this.visibleResource;
    let resources = [];
    if (this._selectedNode !== undefined)
      resources = this._selectedNode.getResourcesByVariables(...this.selectedVariables);
    let visibleResource = undefined;
    resources.forEach(res => {
      if (visibleResource !== undefined) {
        if (this._showSimiliarResource) {
          
        }
        if (visibleResource.datetime !== undefined)
          return;
        if (res.datetime === undefined)
          return;
      }
      if (res.datetime === undefined ||
          res.datetime.valueOf() == this.modelviewer.timeline.getSelectedTime().valueOf())
        visibleResource = res;
    });
    this._visibleResource = visibleResource;
    if (this.visibleResource !== oldVisibleResource)
      this.trigger('change:visibleResource');
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
      let newDisplayVariables = new Set();
      for (let variable of container.displayVariables)
        variableCollections.forEach(collection => {
          if (variable.variableCollection === collection)
            newDisplayVariables.add(variable);
        });
      this.setDisplayVariableByVariableCollection(newDisplayVariables);
    };
    this._mirrorListener.listenerKey =
      container.on('change:displayVariables', onChangeDisplayVariables);
    onChangeDisplayVariables();
  }
}
addEventFunctions(Container.prototype);
export default Container;