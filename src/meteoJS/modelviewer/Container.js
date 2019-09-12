/**
 * @module meteoJS/modelviewer/container
 */
import { addEventFunctions } from '../Events.js';

/**
 * @fires change:resource
 */
export class Container {
  
  get resource() {
  }
  
  /**
   * Was ist konfiguriert -> daraus wird entschieden, welche Resource gezeigt wird.
   */
  get resourceConfiguration() {
  }
  
  get prevContainer() {
  }
  
  get nextContainer() {
  }
}
addEventFunctions(Container.prototype);
export default Container;