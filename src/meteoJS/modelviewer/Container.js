/**
 * @module meteoJS/modelviewer/container
 */
import Unique from '../base/Unique.js';
import addEventFunctions from '../Events.js';
import Resource from './Resource.js';
import Node from './Node.js';
import Display from './Display.js';
import Variable from './Variable.js';
import VariableCollection from './VariableCollection.js';

/**
 * Triggered, when visible Resource changes.
 * 
 * @event module:meteoJS/modelviewer/container#change:enabledResources
 * @type {Object}
 * @property {Object} options - Options.
 * @property {Map.<integer,module:meteoJS/modelviewer/resource.Resource>}
 *   [options.enabledResources] - Enabled resources, selected by selectedVariables.
 */

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
 * @property {Object} options - Options.
 * @property {Set.<module:meteoJS/modelviewer/variable.Variable>}
 *   [options.addedVariables] - Added variables to displayVariables.
 * @property {Set.<module:meteoJS/modelviewer/variable.Variable>}
 *   [options.removedVariables] - Removed variables to displayVariables.
 */

/**
 * Triggered, when selectedVariables is changed.
 * 
 * @event module:meteoJS/modelviewer/container#change:selectedVariables
 * @type {Object}
 * @property {Object} options - Options.
 * @property {Set.<module:meteoJS/modelviewer/variable.Variable>}
 *   [options.addedVariables] - Added variables to selectedVariables.
 * @property {Set.<module:meteoJS/modelviewer/variable.Variable>}
 *   [options.removedVariables] - Removed variables to selectedVariables.
 */

/**
 * If a suitable resource is searched, this method will be called several times.
 * The first argument ist a list of variables. These variables are collected of
 * one hierarchy level, defined by the
 * {@link module:meteoJS/modelviewer/resources.Resources|resources object}.
 * The method returns an ordered list of these passed variables (or a subset).
 * For these variables, further down in the hierarchy, a possible resource is
 * searched. If one is found, this variable will be used for selectedVariables.
 * Method is only used if adaptSuitableResource is enabled. Default algorythm is
 * to return the list in the order of the Iterator.
 * 
 * @typedef {Function} module:meteoJS/modelviewer/container~getPossibleVariables
 * @param {module:meteoJS/modelviewer/variable.Variable[]}
 *   possibleSelectedVariables - Variables to return an ordered list.
 * @param {Set<module:meteoJS/modelviewer/variable.Variable>}
 *   selectedVariables - Already selected variables so far, top-down in
 *   hierarchy.
 * @returns {module:meteoJS/modelviewer/variable.Variable[]} - Ordered list.
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
 * @param {undefined|module:meteoJS/modelviewer/variable.Variable}
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
 * @param {module:meteoJS/modelviewer/container~getPossibleVariables}
 *   getPossibleVariables - Determines order of variables of a hierarchy level.
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
 * This object represents a container, that displays one resource.
 * Via displayVariables the appropriate resource is chosen.
 * 
 * @extends module:meteoJS/base/unique.Unique
 * @fires module:meteoJS/modelviewer/container#change:visibleResource
 * @fires module:meteoJS/modelviewer/container#change:enabledResources
 * @fires module:meteoJS/modelviewer/container#change:displayVariables
 * @fires module:meteoJS/modelviewer/container#change:selectedVariables
 */
export class Container extends Unique {

  /**
   * @param {module:meteoJS/modelviewer/container~options} [options] - Options.
   */
  constructor({
    id,
    display = undefined,
    adaptSuitableResource = {}
  } = {}) {
    super({
      id
    });
    
    /**
     * @type undefined|module:meteoJS/modelviewer/display.Display
     * @private
     */
    this._display = (display === undefined) ? new Display() : display;
    this._display.modelviewer = this.modelviewer;
    this._display.container = this;
    this._display.parentNode = this._containerNode;
    
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
     * @type Map.<module:meteoJS/modelviewer/variableCollection.VariableCollection,module:meteoJS/modelviewer/variable.Variable>
     * @private
     */
    this._selectedVariables = new Map();
    
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
     * @type undefined|external:HTMLElement
     * @private
     */
    this._containerNode = undefined;

    /**
     * Function to call change:selectedVariables debouncec.
     * 
     * @type Function
     * @private
     */
    this._debouncedChangeSelectedVariables = (() => {
      let timeoutId;
      let totalAddedVariables = new Set();
      let totalRemovedVariables = new Set();
      return ({ addedVariables, removedVariables }) => {
        for (const v of addedVariables)
          if (totalRemovedVariables.has(v))
            totalRemovedVariables.delete(v);
        for (const v of removedVariables)
          if (totalAddedVariables.has(v))
            totalAddedVariables.delete(v);
        totalAddedVariables = new Set([...totalAddedVariables, ...addedVariables]);
        totalRemovedVariables = new Set([...totalRemovedVariables, ...removedVariables]);
        /*console.log([
          [...addedVariables].map(v => v.id),
          [...removedVariables].map(v => v.id),
          [...totalAddedVariables].map(v => v.id),
          [...totalRemovedVariables].map(v => v.id),
        ]);*/
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          this.trigger('change:selectedVariables', {
            addedVariables: totalAddedVariables,
            removedVariables: totalRemovedVariables
          });
          totalAddedVariables.clear();
          totalRemovedVariables.clear();
        }, 300);
      };
    })();
    
    /**
     * @type Object<string,Object<string,mixed>>
     * @private
     */
    this._listeners = {
      mirror: [],
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
   * @readonly
   */
  get display() {
    return this._display;
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
    this._display.modelviewer = modelviewer;
    
    this._listeners.timeline.timeline = this._modelviewer.timeline;
    this._listeners.timeline.listenerKey = this._modelviewer.timeline
      .on('change:time', () => this._setVisibleResource());
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
   * @type undefined|external:HTMLElement
   * @package
   */
  get containerNode() {
    return this._containerNode;
  }
  set containerNode(containerNode) {
    this._containerNode = containerNode;
    if (this._containerNode === undefined)
      return;
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
      this._updateSelectedVariables({
        addedVariables,
        removedVariables
      });
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
    return new Set([...this._selectedVariables.values()]);
  }

  /**
   * Returns the selected Variable of a VariableCollection. If no selected
   * variable exists, an empty Variable-Object will be returned.
   * 
   * @param {module:meteoJS/modelviewer/variableCollection.VariableCollection}
   *   variableCollection - VariableCollection.
   * @returns {module:meteoJS/modelviewer/variable.Variable}
   *   The selected Variable of the colleciton.
   */
  getSelectedVariable(variableCollection) {
    const result = this._selectedVariables.get(variableCollection);
    return (result === undefined) ? new Variable({ id: undefined }) : result;
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
   * content. It is possible to mirror different VariableCollections from
   * different containers.
   * 
   * @param {module:meteoJS/modelviewer/container.Container} [container]
   *   Mirrors from this container.
   * @param {module:meteoJS/modelviewer/variableCollection.VariableCollection[]}
   *   [variableCollections] - The displayVariables of these VariableCollections
   *   are mirrored. If omitted, all VariableCollections are mirrored.
   */
  mirrorsFrom(container = undefined, variableCollections = undefined) {
    this._listeners.mirror =
      this._listeners.mirror.filter(mirrorConfig => {
        if (mirrorConfig.container === container
          || container === undefined) {
          mirrorConfig.container
            .un('change:displayVariables', mirrorConfig.listenerKey);
          return false;
        }
        return true;
      });
    if (container === undefined)
      return;
    if (variableCollections !== undefined
      && variableCollections.length < 1)
      return;
    if (variableCollections === undefined)
      variableCollections = this.modelviewer.resources.variableCollections;
    const onChangeDisplayVariables = () => {
      const newDisplayVariables = new Set();
      for (const variable of container.displayVariables)
        variableCollections.forEach(collection => {
          if (variable.variableCollection === collection)
            newDisplayVariables.add(variable);
        });
      this.exchangeDisplayVariable(newDisplayVariables);
    };
    const listenerKey = container
      .on('change:displayVariables', onChangeDisplayVariables);
    const mirrorConfig = {
      container,
      listenerKey,
      variableCollections
    };
    this._listeners.mirror.forEach(mC => {
      const newVariableCollection = [];
      mC.variableCollections.forEach(collection => {
        let isContained = false;
        variableCollections.forEach(variableCollection => {
          if (variableCollection === collection)
            isContained = true;
        });
        if (!isContained)
          newVariableCollection.push(collection);
      });
      if (newVariableCollection.length < mC.variableCollections.length)
        this.mirrorsFrom(mC.container, newVariableCollection);
    });
    this._listeners.mirror.push(mirrorConfig);
    onChangeDisplayVariables();
  }

  /**
   * Get all containers, from which this container mirrors some variables from.
   * As values of the returned Map-Object an array with the mirrored
   * VariableColletions is returned.
   * 
   * @returns {Map.<module:meteoJS/modelviewer/container.Container,module:meteoJS/modelviewer/variableCollection.VariableCollection[]>}
   */
  getMirrorsFrom() {
    const result = new Map();
    this._listeners.mirror.forEach(mirrorConfig => {
      result.set(mirrorConfig.container, mirrorConfig.variableCollections);
    });
    return result;
  }
  
  /**
   * Sets all available times in the timeline object for this container.
   * 
   * @private
   */
  _setTimes() {
    let [selectedVariables] =
      this._getSelectedVariablesWithResources(
        [this.modelviewer.resources.topNode],
        new Set(),
        undefined,
        selectedVariables => {
          let result = true;
          this.modelviewer.resources._timesVariableCollections.forEach(collection => {
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
    
    const availableTimes = (selectedVariables.size == 0)
      ? []
      : this.modelviewer.resources
        .getTimesByVariables({ variables: selectedVariables });
    this.modelviewer.timeline.setTimesBySetID(this.id, availableTimes);
  }
  
  /**
   * Updates the selected variables, according to displayVariables.
   * 
   * @private
   */
  _updateSelectedVariables({
    addedVariables = undefined,
    removedVariables = undefined
  } = {}) {
    if (!this._adaptSuitableResource.enabled) {
      let selectedNode = undefined;
      const findFirstNodeWithVariable = node => {
        if (node.hasResourcesByVariables(true, ...this.displayVariables))
          selectedNode = node;
        else
          for (const childNode of node.children)
            findFirstNodeWithVariable(childNode);
      };
      findFirstNodeWithVariable(this.modelviewer.resources.topNode);
      this._setSelectedVariables(this.displayVariables, selectedNode);
      return;
    }

    let nodes = [];
    const sV = new Set();
    let lSV = undefined;
    if (addedVariables === undefined || removedVariables === undefined)
      nodes.push(this.modelviewer.resources.topNode);
    else {
      const findFirstNodeWithVariable = node => {
        let isFound = false;
        for (const variable of [...addedVariables, ...removedVariables]) {
          if (variable.variableCollection.node === node) {
            nodes.push(node);
            isFound = true;
            break;
          }
        }
        if (!isFound) {
          const tempSV = this.getSelectedVariable(node.variableCollection);
          if (tempSV.id !== undefined) {
            lSV = tempSV;
            sV.add(lSV);
            for (const childNode of node.children)
              findFirstNodeWithVariable(childNode);
          }
        }
      };
      findFirstNodeWithVariable(this.modelviewer.resources.topNode);
      nodes = nodes.filter((n,i,a) => i===a.indexOf(n));
      if (nodes.length < 1)
        nodes.push(this.modelviewer.resources.topNode);
    }
    let [selectedVariables, lastSelectedVariable] =
      this._getSelectedVariablesWithResources(
        nodes,
        sV,
        lSV
      );
    
    let node;
    if (selectedVariables === undefined) {
      selectedVariables = sV;
      node = (lSV !== undefined)
        ? lSV.variableCollection.node
        : new Node({ variableCollection: new VariableCollection() });
    }
    else
      node = lastSelectedVariable.variableCollection.node;
    this._setSelectedVariables(selectedVariables, node);
  }
  
  /**
   * @typedef result_getSelectedVariablesWithResources
   * @type {Array}
   * @property {undefined|Set<module:meteoJS/modelviewer/variable.Variable>} 0
   * @property {undefined|module:meteoJS/modelviewer/variable.Variable} 1
   */
  
  /**
   * 
   * 
   * @param {Set<module:meteoJS/modelviewer/node.Node>} nodes - Nodes to check.
   * @param {Set<module:meteoJS/modelviewer/variable.Variable>}
   *   selectedVariables - Selected Variables from top until this node.
   * @returns {result_getSelectedVariablesWithResources}
   *   Array with first element the SelectedVariables, second element the last
   *   selectedVariable (node most down in the tree).
   * @private
   */
  _getSelectedVariablesWithResources(
    nodes,
    selectedVariables,
    lastSelectedVariable,
    isResourceSelected = this._adaptSuitableResource.isResourceSelected
  ) {
    if (isResourceSelected.call(this, selectedVariables, lastSelectedVariable))
      return [selectedVariables, lastSelectedVariable];
    
    let result = [undefined, undefined];
    const checkPossibleVariable = possibleSelectedVariable => {
      let tempSelectedVariables = new Set(selectedVariables);
      tempSelectedVariables.add(possibleSelectedVariable);
      let [resultSelectedVariables, resultLastSelectedVariable] =
        this
          ._getSelectedVariablesWithResources(
            possibleSelectedVariable.variableCollection.node.children,
            tempSelectedVariables,
            possibleSelectedVariable,
            isResourceSelected
          );
      if (resultSelectedVariables !== undefined) {
        result[0] = resultSelectedVariables;
        result[1] = resultLastSelectedVariable;
        return;
      }
      
      let isOnlyTimesVariables = true;
      for (let selectedVariable of tempSelectedVariables) {
        let contained = false;
        this.modelviewer.resources._timesVariableCollections.forEach(collection => {
          if (collection.contains(selectedVariable))
            contained = true;
        });
        if (!contained)
          isOnlyTimesVariables = false;
      }
      if (isOnlyTimesVariables &&
          tempSelectedVariables.size == this.modelviewer.resources._timesVariableCollections.size) {
        result[0] = tempSelectedVariables;
        result[1] = possibleSelectedVariable;
      }
    };

    let availableSelectedVariables = [];
    for (let childNode of nodes) {
      if (this.modelviewer.resources.availableVariablesMap.has(childNode) &&
          this.modelviewer.resources.availableVariablesMap.get(childNode).size)
        for (const variable of childNode.variableCollection) {
          if (!this.modelviewer.resources
            .availableVariablesMap.get(childNode).has(variable))
            continue;
          if (this.displayVariables.has(variable))
            checkPossibleVariable(variable);
          else if (this._adaptSuitableResource.enabled)
            availableSelectedVariables.push(variable);
          if (result[0] !== undefined)
            break;
        }
      if (result[0] !== undefined)
        break;
    }
    if (result[0] !== undefined)
      return result;
    
    const possibleSelectedVariables = this._adaptSuitableResource
      .getPossibleVariables
      .call(this, availableSelectedVariables, selectedVariables);
    for (const variable of possibleSelectedVariables) {
      checkPossibleVariable(variable);
      if (result[0] !== undefined)
        break;
    }
    
    return result;
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
      this._selectedVariables.clear();
      for (const variable of selectedVariables)
        this._selectedVariables.set(variable.variableCollection, variable);
      this._selectedNode = selectedNode;
      this._setTimes();
      this._setEnabledResources();
      this._debouncedChangeSelectedVariables({
        addedVariables,
        removedVariables
      });
    }
  }
  
  /**
   * Sets internally _enabledResources. These resources are selected by
   * selectedVariable. The visibleResource is determined from this resources.
   * 
   * @private
   */
  _setEnabledResources() {
    this._enabledResources.clear();
    if (this._selectedNode === undefined)
      return;
    if (this.selectedVariables.size != 0)
      this._selectedNode
        .getResourcesByVariables(true, ...this.selectedVariables)
        .filter(r => r.datetime && !isNaN(r.datetime.valueOf()))
        .forEach(r => this._enabledResources.set(r.datetime.valueOf(), r));
    this.modelviewer.timeline
      .setEnabledTimesBySetID(this.id, this.enabledTimes);
    this.trigger('change:enabledResources', this._enabledResources);
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
    getPossibleVariables = undefined,
    isResourceSelected = undefined,
    //excludeVariableCollectionFromSimiliarDisplay = []
  } = {}) {
    this._adaptSuitableResource = {
      enabled,
      getPossibleVariables,
      isResourceSelected
    };
    
    if (this._adaptSuitableResource.getPossibleVariables === undefined)
      this._adaptSuitableResource.getPossibleVariables =
        availableSV => availableSV;
    if (this._adaptSuitableResource.isResourceSelected === undefined)
      this._adaptSuitableResource.isResourceSelected =
      (selectedVariables, lastAddedVariable) => {
        if (lastAddedVariable === undefined)
          return false;
        let resources = lastAddedVariable.variableCollection
          .node.getResourcesByVariables(true, ...selectedVariables);
        return resources.length > 0;
      };
  }
}
addEventFunctions(Container.prototype);
export default Container;