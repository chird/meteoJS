/**
 * @module meteoJS/modelviewer/display/simple
 */
import $ from 'jquery';
import ThermodynamicDiagram from '../../ThermodynamicDiagram.js';
import Display from '../Display.js';

/**
 * @classdesc Displays a modelviewer container with a navigation on top of the
 *   resource. The navigation contains of several select-Nodes (each for a
 *   VariableCollection).
 */
export class Simple extends Display {
  
  constructor() {
    super();
    
    /**
     * @type undefined|jQuery
     * @private
     */
    this.imgNode = undefined;
    
    /**
     * @type undefined|meteoJS/thermodynamicDiagram.ThermodynamicDiagram
     * @private
     */
    this.thermodynamicDiagram = undefined;
    
    /**
     * @type undefined|jQuery
     * @protected
     */
    this.resourceNode = undefined;
  }
  
  /**
   * @override
   */
  onInit() {
    if (this.parentNode !== undefined) {
      this.resourceNode = $(this.parentNode);
      this.resourceNode.empty();
    }
  }
  
  /**
   * @override
   */
  onChangeVisibleResource() {
    if (this.resourceNode === undefined)
      return;
    let visibleResource = this.container.visibleResource;
    if ('url' in visibleResource) {
      if (this.thermodynamicDiagram !== undefined) {
        this.thermodynamicDiagram = undefined;
        this.resourceNode.empty();
      }
      if (this.imgNode === undefined) {
        this.resourceNode.empty();
        this.imgNode = $('<img>');
        this.resourceNode.append(this.imgNode);
      }
      this.imgNode.attr('src', visibleResource.url);
      this.imgNode.css({ 'max-width': '100%' });
    }
    else if ('sounding' in visibleResource) {
      if (this.imgNode !== undefined) {
        this.imgNode = undefined;
        this.resourceNode.empty();
      }
      if (this.thermodynamicDiagram === undefined)
        this.thermodynamicDiagram = new ThermodynamicDiagram({
          renderTo: this.resourceNode
        });
      let isAppended = false;
      this.thermodynamicDiagram.soundings.forEach(sounding => {
        if (sounding.getSounding() === visibleResource.sounding) {
          isAppended = true;
          sounding.visible(true);
        }
        else
          sounding.visible(false);
      });
      if (!isAppended)
        this.thermodynamicDiagram.addSounding(visibleResource.sounding);
    }
    else {
      this.imgNode = undefined;
      this.resourceNode.empty();
    }
  }
}
export default Simple;