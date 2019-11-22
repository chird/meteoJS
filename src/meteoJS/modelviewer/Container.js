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
 * If a suitable resource is searched, this method will be called several times.
 * Each time the method returns the best variable to find a suitable resource.
 * The variables are each collected of one hierarchy level, defined by the 
 * {@link module:meteoJS/modelviewer/resources.Resources|resources object}.
 * Method used if adaptSuitableResource is enabled. Default algorythm is
 * to return the first element of variables.
 * 
 * @typedef {Function} module:meteoJS/modelviewer/container~getBestVariable
 * @param {Set<module:meteoJS/modelviewer/variable.Variable>}
 *   variables - Variables to determine best of.
 * @param {Set<module:meteoJS/modelviewer/variable.Variable>}
 *   selectedVariables - Already selected variables so far, top-down in
 *   hierarchy.
 * @returns {undefined|module:meteoJS/modelviewer/variable.Variable}
 *   This returned variable bla. If undefined, then no resource will be selected.
 */

/**
 * With the passed selectedVariables, the method determines if already a
 * suitable resource should be selected. If method returns true, the property
 * selectedVariables will be set by the passed Set.
 * Method used if adaptSuitableResource is enabled. Default algorythm is to
 * return true if the Node of the lastAddedVariable contains resources.
 * 
 * @typedef {Function} module:meteoJS/modelviewer/container~isResourceSelected
 * @param {Set<module:meteoJS/modelviewer/variable.Variable>}
 *   selectedVariables - Selected variables so far.
 * @param {module:meteoJS/modelviewer/variable.Variable}
 *   lastAddedVariable - Last added variable to selectedVariables.
 * @returns {boolean} - True if a suitable resource should be selected with the
 *   current state of selectedVariables.
 */

/**
 * Options to adapt a suitable resource to display.
 * 
 * @typedef {Object}
 *   module:meteoJS/modelviewer/container~adaptSuitableResource
 * @param {boolean} enabled - Enabled adapt suitable resource.
 * @param {module:meteoJS/modelviewer/container~getBestVariable}
 *   getBestVariable - Determines best variable of a hierarchy level.
 * @param {module:meteoJS/modelviewer/container~isResourceSelected}
 *   isResourceSelected - Is selectedVariables complete.
 */

/**
 * Options for constructor.
 * 
 * @typedef {module:meteoJS/base/unique~options}
 *   module:meteoJS/modelviewer/container~options
 * @param {module:meteoJS/modelviewer/display.Display} [display]
 *   Display object to output the container content to DOM.
 * @param {module:meteoJS/modelviewer/container~adaptSuitableResource}
 *   [adaptSuitableResource] - Options for adapt suitable resource.
 */

/**
 * @classdesc This object represents a container, that displays one resource.
 * Via displayVariables the appropriate resource is chosen.
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
                adaptSuitableResource = {} } = {}) {
    super({
      id
    });
    
    /**
     * @type undefined|module:meteoJS/modelviewer/display.Display
     * @private
     */
    this._display = undefined;
    this.display = display;
    
    /**
     * @type module:meteoJS/modelviewer/container~adaptSuitableResource
     * @private
     */
    this._adaptSuitableResource = {};
    this._initAdaptSuitableResource(adaptSuitableResource);
    
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
     * @type Map<integer,module:meteoJS/modelviewer/resource.Resource>
     * @private
     */
    this._enabledResources = new Map();
    
    /**
     * @type undefined|HTMLElement
     * @private
     */
    this._containerNode = undefined;
    
    /**
     * @type Object<string,Object<string,mixed>>
     * @private
     */
    this._listeners = {
      mirror: {
        container: undefined,
        listenerKey: undefined
      },
      timeline: {
        timeline: undefined,
        listenerKey: undefined
      },
      resources: {
        resources: undefined,
        listenerKey: undefined
      }
    };
  }
  
  /**
   * Display object to generate dom output.
   * 
   * @type undefined|module:meteoJS/modelviewer/display.Display
   */
  get display() {
    return this._display;
  }
  set display(display) {
    let node = (this.display !== undefined) ?
                 this._display.parentNode : this._containerNode;
    this._display = display;
    if (this._display !== undefined) {
      this._display.modelviewer = this.modelviewer;
      this._display.container = this;
      this._display.parentNode = node;
    }
  }
  
  /**
   * This container belongs to this modelviewer object.
   * 
   * @type undefined|module:meteoJS/modelviewer.Modelviewer
   * @package
   */
  get modelviewer() {
    return this._modelviewer;
  }
  set modelviewer(modelviewer) {
    this._modelviewer = modelviewer;
    if (this._modelviewer === undefined) {
      if (this._listeners.timeline.listenerKey !== undefined)
        this._listeners.timeline.timeline
        .un('change:time', this._listeners.timeline.listenerKey);
      if (this._listeners.resources.listenerKey !== undefined)
        this._listeners.resources.resources
        .un('change:resources', this._listeners.resources.listenerKey);
      return;
    }
    
    if (this._display !== undefined)
      this._display.modelviewer = modelviewer;
    this._listeners.timeline.timeline = this._modelviewer.timeline;
    this._listeners.timeline.listenerKey = this._modelviewer.timeline
      .on('change:time', time => this._setVisibleResource());
    this._listeners.resources.resources = this._modelviewer.resources;
    this._listeners.resources.listenerKey = this._modelviewer.resources
      .on('change:resources', () => {
        this._setTimes();
        this._setEnabledResources();
        this._updateSelectedVariables();
      });
    this._setTimes();
  }
  
  /**
   * DOM node to append container's output.
   * 
   * @type undefined|HTMLElement
   * @package
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
   * If adaptSuitableResource is not enabled, then the displayed resource is
   * exactly defined by these variables (and additionally the datetime selected
   * by the timeline object). If adaptSuitableResource is enabled, then a
   * resource is displayed, that matches the variables but can be defined by
   * additional variables.
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
   * If adaptSuitableResource is not enabled, selectedVariables is equal to
   * displayVariables.
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
    return [...this._enabledResources.keys()]
      .filter(datetime => !isNaN(datetime))
      .map(datetime => new Date(datetime));
  }
  
  /**
   * Exchanges variables in displayVariables. The variable with the same
   * Collection will be exchanged. If none is found, the variable will be added.
   * 
   * @param {Set<module:meteoJS/modelviewer/variable.Variable>} variables
   *   Add these variables to the set of displayVariables.
   * @returns {module:meteoJS/modelviewer/container.Container} - This.
   * @fires module:meteoJS/modelviewer/container#change:displayVariables
   */
  exchangeDisplayVariable(variables) {
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
    if (this._listeners.mirror.listenerKey !== undefined)
      this._listeners.mirror.container
      .un('change:displayVariables', this._listeners.mirror.listenerKey);
    if (container === undefined)
      return;
    if (variableCollections === undefined)
      variableCollections = this.modelviewer.resources.variableCollections;
    this._listeners.mirror.container = container;
    let onChangeDisplayVariables = () => {
      let newDisplayVariables = new Set();
      for (let variable of container.displayVariables)
        variableCollections.forEach(collection => {
          if (variable.variableCollection === collection)
            newDisplayVariables.add(variable);
        });
      this.exchangeDisplayVariable(newDisplayVariables);
    };
    this._listeners.mirror.listenerKey =
      container.on('change:displayVariables', onChangeDisplayVariables);
    onChangeDisplayVariables();
  }
  
  /**
   * Sets all available times in the timeline object for this container.
   * 
   * @private
   */
  _setTimes() {
    this.modelviewer.timeline
    .setTimesBySetID(
      this.id,
      this.modelviewer
      .resources.getTimesByVariables(...this.selectedVariables)
    );
  }
  
  /**
   * Updates the selected variables, according to displayVariables.
   * 
   * @private
   */
  _updateSelectedVariables() {
    if (!this._adaptSuitableResource.enabled) {
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
        if (availableVariablesMap.has(node) &&
            availableVariablesMap.get(node).size)
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
        variable =
          this._adaptSuitableResource
          .getBestVariable.call(this, availableVariables, selectedVariables);
        if (variable === undefined) {
          resourcesNode = undefined;
          break whileNodes;
        }
        resourcesNode = variable.variableCollection.node;
      }
      selectedVariables.add(variable);
      if (!this._adaptSuitableResource
           .isResourceSelected.call(this, selectedVariables, variable)) {
        let newNodes = [];
        nodes.forEach(node => {
          node.children.forEach(child => newNodes.push(child));
        });
        nodes = newNodes;
      }
      else
        break whileNodes;
    } while (nodes.length > 0);
    if (resourcesNode !== undefined) {
      //let resources = resourcesNode.getResourcesByVariables(...selectedVariables);
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
      this._setTimes();
      this._setEnabledResources();
      this.trigger(
        'change:selectedVariables',
        { addedVariables, removedVariables }
      );
    }
  }
  
  /**
   * Sets internally _enabledResources. These resources are selected by
   * selectedVariable. The visibleResource is determine from this resources.
   * 
   * @private
   */
  _setEnabledResources() {
    this._enabledResources.clear();
    if (this._selectedNode === undefined)
      return;
    this._selectedNode
    .getResourcesByVariables(true, ...this.selectedVariables)
    .forEach(r => this._enabledResources.set(r.datetime.valueOf(), r));
    this.modelviewer.timeline
    .setEnabledTimesBySetID(this.id, this.enabledTimes);
    this._setVisibleResource();
  }
  
  /**
   * Sets visible resource.
   * 
   * @private
   */
  _setVisibleResource() {
    let oldVisibleResource = this._visibleResource;
    let datetime = this.modelviewer.timeline.getSelectedTime().valueOf();
    if (this._enabledResources.has(datetime))
      this._visibleResource = this._enabledResources.get(datetime);
    else
      this._visibleResource = undefined;
    if (this._visibleResource !== oldVisibleResource)
      this.trigger('change:visibleResource');
  }
  
  /**
   * Inits private property _adaptSuitableResource.
   * 
   * @param {module:meteoJS/modelviewer/container~adaptSuitableResource}
   *   [adaptSuitableResource] - Adapt suitable resource.
   * @private
   */
  _initAdaptSuitableResource({ enabled = true,
                               getBestVariable = undefined,
                               isResourceSelected = undefined,
                         //excludeVariableCollectionFromSimiliarDisplay = []
                             } = {}) {
    this._adaptSuitableResource = {
      enabled,
      getBestVariable,
      isResourceSelected
    };
    
    if (this._adaptSuitableResource.getBestVariable === undefined)
      this._adaptSuitableResource.getBestVariable =
        v => v.length ? v[0] : undefined;
    if (this._adaptSuitableResource.isResourceSelected === undefined)
      this._adaptSuitableResource.isResourceSelected =
      (selectedVariables, lastAddedVariable) => {
        let resources = lastAddedVariable.variableCollection
                        .node.getResourcesByVariables(true, ...selectedVariables);
        return resources.length > 0;
      };
  }
}
addEventFunctions(Container.prototype);
export default Container;