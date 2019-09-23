/**
 * @module meteoJS/modelviewer/variableCollection
 */
import Variable from './Variable.js';
import NamedCollection from '../base/NamedCollection.js';

/**
 * Triggered on adding a Variable to collection.
 * 
 * @event meteoJS/modelviewer/variableCollection#add:variable
 * @param {module:meteoJS/modelviewer/variable.Variable} variable -
 *   Added variable.
 */

/**
 * Triggered on removing a Variable from collection.
 * 
 * @event meteoJS/modelviewer/variableCollection#remove:variable
 * @param {module:meteoJS/modelviewer/variable.Variable} variable -
 *   Removed variable.
 */

/**
 * Options for constructor.
 * 
 * @typedef {module:meteoJS/base/namedCollection~options}
 *   meteoJS/modelviewer/variableCollection~options
 */

/**
 * @classdesc A collection of Variable-objects.
 * @fires meteoJS/modelviewer/variableCollection#add:variable
 * @fires meteoJS/modelviewer/variableCollection#remove:variable
 */
export class VariableCollection extends NamedCollection {
  
  /**
   * @param {meteoJS/modelviewer/variableCollection~options} options - Options.
   */
  constructor({ fireReplace=true,
                fireAddRemoveOnReplace=false,
                appendOnReplace=true,
                sortFunction,
                names,
                langSortation } = {}) {
    super({
      emptyObjectMaker: () => { return new Variable() },
      fireReplace,
      fireAddRemoveOnReplace,
      appendOnReplace,
      sortFunction,
      names,
      langSortation
    });
    
    this.on('add:item', item => this.trigger('add:variable', item));
    this.on('remove:item', item => this.trigger('remove:variable', item));
  }
  
  //sortation()...
}
export default VariableCollection;