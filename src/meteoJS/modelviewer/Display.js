/**
 * @module meteoJS/modelviewer/display
 */
import Collection from '../base/Collection.js';

/**
 * @classdesc
 * @abstract
 */
export class Display extends Collection {
  
  constructor({ container,
                parentNode,
                resources,
                resourceRenderer,
                layoutRenderer,
                minHeight } = {}) {
    super();
    
    /**
     * @type module:meteoJS/modelviewer/container.Container
     * @private
     */
    this._container = container;
    
    /**
     * @type jQuery
     */
    this._parentNode = parentNode;
    
    this._container = container;
    //this._container.on('change:visibleResource', resource => this.onChangeResource());
    
    this._resources = resources;
    
    /*this._resources.variableCollections.forEach(collection => {
      collection.on('append:variable', variable => this.onAppendVariable(variable, collection));
    });
    this.on('append:item', container => {
      this._containers.push({
        container: container,
        parentNode: bla
      });
      container.display = this;
      container.on('change:visibleResource', resource => this.onChangeResource(container, resource));
    });*/
  }
  
  /**
   * @type module:meteoJS/modelviewer/container.Container
   */
  get container() {
    return this._container;
  }
  set container(container) {
    this._container = container;
  }
  
  /**
   * @type jQuery
   */
  get parentNode() {
    return this._parentNode;
  }
  set parentNode(parentNode) {
    this._parentNode = parentNode;
  }
  
  /**
   * @abstract
   */
  onChangeResource() {
  }
  /**
   * @abstract
   */
  onAppendVariable(variable, variableCollection) {
  }
}
export default Display;