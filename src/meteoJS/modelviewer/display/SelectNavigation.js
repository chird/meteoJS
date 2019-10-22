/**
 * @module meteoJS/modelviewer/display/selectNavigation
 */
import $ from 'jquery';
import Display from '../Display.js';

/**
 * @classdesc 
 */
export class SelectNavigation extends Display {
  
  constructor({ navigationClass = undefined,
                selectClass = undefined,
                optionClass = undefined,
                optionSelectClass = undefined,
                containerClass = undefined } = {}) {
    super();
    
    /**
     * @type undefined|jQuery
     * @private
     */
    this.navigationNode = undefined;
    
    /**
     * @type Object.<mixed, jQuery>
     * @private
     */
    this.selectNodes = {};
  }
  
  /**
   * @override
   */
  onInit() {
    if (this.parentNode === undefined)
      return;
    this.navigationNode = $('<div>');
    this.resourceNode = $('<div>');
    $(this.parentNode).append(this.navigationNode, this.resourceNode);
    this.modelviewer.resources.variableCollections.forEach(collection => this._appendSelectNode(collection));
    this._changeSelected();
  }
  
  onChangeVisibleResource({ variable } = {}) {
    super.onChangeVisibleResource({ variable });
    this._changeSelected();
  }
  
  onAppendVariable(variable) {
    if (variable.variableCollection.id in this.selectNodes)
      this._appendOptionNode(this.selectNodes[collection.id], variable);
    else
      this._appendSelectNode(variable.variableCollection);
    this._changeSelected();
  }
  
  _appendSelectNode(variableCollection) {
    this.selectNodes[collection.id] = $('<select>');
    variableCollection.variables.forEach(variable => {
      this._appendOptionNode(this.selectNodes[collection.id], variable);
    });
    this.navigationNode.append(this.selectNodes[collection.id]);
  }
  
  _appendOptionNode(selectNode, variable) {
    let option = $('<option>').data('id', variable.id).text(variable.name);
    selectNode.append(option);
  }
  
  _changeSelected() {
    Object.keys(this.selectNodes).forEach(id => {
      let variable = this.container.visibleResource.getVariableByVariableCollection(this.modelviewer.resources.getNodeByVariableCollectionById(id).variableCollection);
      this.selectNodes[id].children('option')
        .each(option => $(option).attr('selected', (variable.id == $(option).data('id')) ? true : false));
    });
  }
}
export default SelectNavigation;