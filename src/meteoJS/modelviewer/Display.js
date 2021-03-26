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
 * Change visible resource event.
 * 
 * @event module:meteoJS/modelviewer/display#change:visibleResource
 * @type {Object}
 */

/**
 * Options for constructor.
 * 
 * @typedef {Object}
 * @param
 *   {Iterable.<module:meteoJS/modelviewer/variableCollection.VariableCollection>}
 *   [alwaysAvailableCollections]
 *   Variables from these variableCollections are always available.
 */

/**
 * @classdesc
 * 
 * @fires module:meteoJS/modelviewer/display#init:display
 * @fires module:meteoJS/modelviewer/display#add:variableCollection
 * @fires module:meteoJS/modelviewer/display#add:variable
 * @fires module:meteoJS/modelviewer/display#change:visibleResource
 */
export class Display {
  
  /**
   * @param {module:meteoJS/modelviewer/display~options} [options] - Options.
   */
  constructor({
    alwaysAvailableCollections = []
  } = {}) {
    
    /**
     * @type Set<module:meteoJS/modelviewer/variableCollection.VariableCollection>
     * @private
     */
    this._alwaysAvailableCollections = new Set(alwaysAvailableCollections);
    
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
    
    /**
     * @type undefined|HTMLElement|jQuery
     * @private
     */
    this._resourceNode = undefined;
    
    this._resourceOutput = {
      image: undefined,
      thermodynamicDiagram: undefined
    };
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
        this.trigger('add:variable', { variable });
      });
    });
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
    
    this._container.on('change:visibleResource', () => {
      this._onChangeVisibleResource();
    });
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
   * @type undefined|HTMLElement|jQuery
   * @package
   */
  get resourceNode() {
    return this._resourceNode;
  }
  set resourceNode(resourceNode) {
    this._resourceNode = resourceNode;
    this._onChangeVisibleResource();
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
      return;
    
    $(this.parentNode).empty();
    this.trigger('init:display');
    if (this._modelviewer === undefined)
      return;
    
    this._modelviewer.resources.variableCollections
      .forEach(variableCollection => {
        this.trigger('add:variableCollection', { variableCollection });
        for (let variable of variableCollection)
          this.trigger('add:variable', { variable });
      });
  }

  /**
   * Returns a subset of variables of the passed VariableCollection object. For
   * all of the returned variables, there exists at least one resource. Theses
   * resources are defined by this variable and the selected variables of the
   * parent node.
   * This method isn't enough performant to be executed in loops or recursive
   * functions.
   * 
   * @param {Object} options - Options.
   * @param {module:meteoJS/modelviewer/variableCollection.VariableCollection}
   *   options.variableCollection - VariableCollection object.
   * @returns {Set<module:meteoJS/modelviewer/variable.Variable>}
   *   Available variables.
   * @public
   */
  getAvailableVariables({ variableCollection }) {
    const variables = this._getParentsVariables(variableCollection.node);
    return this._modelviewer.resources
      .getAvailableVariables(variableCollection, { variables });
  }
  
  /**
   * @private
   */
  _getParentsVariables(node, traversedNodes = new Set()) {
    let result = new Set();
    node.parents.forEach(parentNode => {
      if (traversedNodes.has(parentNode))
        return;
      traversedNodes.add(parentNode);
      Array.from(parentNode.variableCollection).forEach(variable => {
        if (this._container.selectedVariables.has(variable))
          result.add(variable);
      });
      const parentResult = this._getParentsVariables(parentNode, traversedNodes);
      if (parentResult.size > 0)
        result = new Set([...result, ...parentResult]);
    });
    return result;
  }
  
  /**
   * @private
   */
  _onChangeVisibleResource() {
    if (this._resourceNode === undefined) {
      this.trigger('change:visibleResource');
      return;
    }
    if (this._container === undefined)
      return;
    
    let visibleResource = this._container.visibleResource;
    if ('url' in visibleResource) {
      if (this.thermodynamicDiagram !== undefined) {
        this.thermodynamicDiagram = undefined;
        $(this._resourceNode).empty();
      }
      if (this._resourceOutput.image === undefined) {
        $(this._resourceNode).empty();
        this._resourceOutput.image = $('<img>').css({ 'max-width': '100%' });
        $(this._resourceNode).append(this._resourceOutput.image);
      }
      this._resourceOutput.image.attr('src', visibleResource.url);
    }
    else if ('sounding' in visibleResource) {
      if (this._resourceOutput.image !== undefined) {
        this._resourceOutput.image = undefined;
        $(this._resourceNode).empty();
      }
      /*if (this._resourceOutput.thermodynamicDiagram === undefined)
        this._resourceOutput.thermodynamicDiagram = new ThermodynamicDiagram({
          renderTo: $(this._resourceNode)
        });*/
      let isAppended = false;
      this._resourceOutput.thermodynamicDiagram.soundings.forEach(sounding => {
        if (sounding.getSounding() === visibleResource.sounding) {
          isAppended = true;
          sounding.visible(true);
        }
        else
          sounding.visible(false);
      });
      if (!isAppended)
        this._resourceOutput.thermodynamicDiagram
          .addSounding(visibleResource.sounding);
    }
    else {
      if (this._resourceOutput.image !== undefined) {
        this._resourceOutput.image = undefined;
        $(this._resourceNode).empty();
      }
      if (this._resourceOutput.thermodynamicDiagram !== undefined)
        this._resourceOutput.thermodynamicDiagram.soundings
          .forEach(sounding => sounding.visible(false));
    }
  }
}
addEventFunctions(Display.prototype);
export default Display;