/**
 * @module meteoJS/modelviewer/display/simple
 */
import Display from '../Display.js';

/**
 * @classdesc Displays a modelviewer container with a navigation on top of the
 *   resource. The navigation contains of several select-Nodes (each for a
 *   VariableCollection).
 */
export class Simple extends Display {
  
  constructor({ resources } = {}) {
    super({
      resources
    });
  }
  
  onInit() {
  }
  
  onChangeResource() {
  }
  
  onAppendVariable(variable, variableCollection) {
  }
}
export default Simple;