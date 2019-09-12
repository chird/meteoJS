/**
 * @module meteoJS/modelviewer/variableCollection
 */
import Collection from '../Collection.js';

/**
 * Beinhaltet alle verfügbaren Variable's
 * 
 * @fires add:variable
 * @fires remove:variable
 */
export class VariableCollection extends Collection {
  
  constructor() {
    super({
      makeEmptyObject: () => new Variable()
    });
    
    this.on('add:item', item => this.trigger('add:variable', item));
    this.on('remove:item', item => this.trigger('remove:variable', item));
  }
  
  get name() {
  }
  
  get default() {
  }
}
export default VariableCollection;