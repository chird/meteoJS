/**
 * @module meteoJS/modelviewer/variableCollection
 */
import NamedCollection from '../NamedCollection.js';

/**
 * Options for VariableCollection constructor.
 * 
 * @typedef {meteoJS/namedCollection~options}
 *   meteoJS/modelviewer/variableCollection~options
 */

/**
 * @classdesc A collection of variable objects.
 * @fires add:variable
 * @fires remove:variable
 */
export class VariableCollection extends NamedCollection {
  
  /**
   * @param {meteoJS/modelviewer/variableCollection~options} options - Options.
   */
  constructor(options) {
    super({
      makeEmptyObject: () => new Variable()
    });
    
    this.on('add:item', item => this.trigger('add:variable', item));
    this.on('remove:item', item => this.trigger('remove:variable', item));
  }
  
  sortation()...
}
export default VariableCollection;