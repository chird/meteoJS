/**
 * @module meteoJS/modelviewer/display
 */
import $ from 'jquery';

/**
 * @classdesc
 * @abstract
 */
export class Display {
  
  constructor() {
    super();
    
    /**
     * @type undefined|module:meteoJS/modelviewer/resources.Resources
     * @private
     */
    this._resources = undefined;
    
    /**
     * @type undefined|module:meteoJS/modelviewer/container.Container
     * @private
     */
    this._container = undefined;
    
    /**
     * @type undefined|HTMLElement
     * @private
     */
    this._parentNode = undefined;
  }
  
  /**
   * @type undefined|module:meteoJS/modelviewer/resources.Resources
   * @package
   */
  get resources() {
    return this._resources;
  }
  set resources(resources) {
    this._resources = resources;
    if (this._resources !== undefined)
      this._resources.variableCollections.forEach(collection => {
        collection.on('add:variable', v => this.onAppendVariable(v));
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
    if (this._container !== undefined)
      this._container.on('change:visibleResource', e => this.onChangeResource(e));
  }
  
  /**
   * @type HTMLElement
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
   * @abstract
   * @protected
   */
  onInit() {
    $(this.parentNode).empty();
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
   * @abstract
   * @protected
   */
  onAppendVariable(variable) {}
}
export default Display;