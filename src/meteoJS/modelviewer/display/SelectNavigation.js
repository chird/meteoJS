/**
 * @module meteoJS/modelviewer/display/selectNavigation
 */
import $ from 'jquery';
import Simple from './Simple.js';

/**
 * @classdesc 
 */
export class SelectNavigation extends Simple {
  
  constructor({ ignoreVariableCollections = [],
                selectCaption = false,
                navigationClass = undefined,
                selectDivClass = undefined,
                selectClass = undefined } = {}) {
    super();
    
    this.options = {
      ignoreVariableCollections: new Set(ignoreVariableCollections),
      selectCaption,
      navigationClass,
      selectDivClass,
      selectClass
    };
    
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
    this.navigationNode = $('<div>').addClass(this.options.navigationClass);
    this.resourceNode = $('<div>');
    $(this.parentNode).empty().append(this.navigationNode, this.resourceNode);
    if (this.modelviewer !== undefined)
      this.modelviewer.resources.variableCollections
      .filter(collection => !this.options.ignoreVariableCollections.has(collection) && collection.count > 0)
      .forEach(collection => this._appendSelectNode(collection));
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
    let selectNode = $('<select>').addClass(this.options.selectClass);
    selectNode.on('change', () => {
      let variable = variableCollection.getItemById(selectNode.val());
      this.container.exchangeDisplayVariable = [ variable ];
    });
    if (this.options.selectCaption) {
      let captionOption = $('<option>').text(variableCollection.name).attr('disabled', 'disabled').prop('selected', 'selected');
      selectNode.append(captionOption);
    }
    variableCollection.variables.forEach(variable => {
      this._appendOptionNode(selectNode, variable);
    });
    this.navigationNode.append($('<div>').addClass(this.options.selectDivClass).append(selectNode));
    this.selectNodes.set(variableCollection, selectNode);
  }
  
  _appendOptionNode(selectNode, variable) {
    let option =
      $('<option>')
      .attr('value', variable.id)
      .text(variable.name)
      .addClass(this.options.optionsClass);
    selectNode.append(option);
  }
  
  _changeSelected() {
    for (let variableCollection of this.selectNodes.keys()) {
      if (!this.selectNodes.has(variableCollection))
        continue;
      let variable = this.container.visibleResource.getVariableByVariableCollection(variableCollection);
      this.selectNodes.get(variableCollection).val(variable.id);
    };
  }
}
export default SelectNavigation;