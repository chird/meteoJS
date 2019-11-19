/**
 * @module meteoJS/modelviewer/display/selectNavigation
 */
import $ from 'jquery';
import Simple from './Simple.js';

/**
 * @classdesc 
 */
export class SelectNavigation extends Simple {
  
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
     * @type Map<module:meteoJS/modelviewer/variableCollection.variableCollection,jQuery>
     * @private
     */
    this.selectNodes = new Map();
  }
  
  /**
   * @override
   */
  onInit() {
    if (this.parentNode === undefined)
      return;
    this.navigationNode = $('<div>');
    this.resourceNode = $('<div>');
    $(this.parentNode).empty().append(this.navigationNode, this.resourceNode);
    if (this.modelviewer !== undefined)
      this.modelviewer.resources.variableCollections.forEach(collection => this._appendSelectNode(collection));
    this._changeSelected();
  }
  
  onChangeVisibleResource({ variable } = {}) {
    super.onChangeVisibleResource({ variable });
    this._changeSelected();
  }
  
  onAppendVariable(variable) {
    if (this.selectNodes.has(variable.variableCollection))
      this._appendOptionNode(this.selectNodes.get(variable.variableCollection), variable);
    else
      this._appendSelectNode(variable.variableCollection);
    this._changeSelected();
  }
  
  _appendSelectNode(variableCollection) {
    let selectNode = $('<select>');
    selectNode.on('change', () => {
      let variable = variableCollection.getItemById(selectNode.val());
      this.container.exchangeDisplayVariable = [ variable ];
    });
    variableCollection.variables.forEach(variable => {
      this._appendOptionNode(selectNode, variable);
    });
    this.navigationNode.append(selectNode);
    this.selectNodes.set(variableCollection, selectNode);
  }
  
  _appendOptionNode(selectNode, variable) {
    let option = $('<option>').attr('value', variable.id).text(variable.name);
    selectNode.append(option);
  }
  
  _changeSelected() {
    for (let variableCollection of this.selectNodes.keys()) {
      if (!this.selectNodes.has(variableCollection))
        continue;
      let variable = this.container.visibleResource.getVariableByVariableCollection(variableCollection);
      this.selectNodes.get(variableCollection).val(variable.id);
      /*children('option')
        .each(option => $(option).prop('selected', (variable.id == $(option).attr('value')) ? 'selected' : undefined));*/
    };
  }
}
export default SelectNavigation;