/**
 * @module meteoJS/modelviewer/resource/image
 */
import Resource from '../Resource.js';

/**
 * Options for constructor.
 * 
 * @typedef {module:meteoJS/modelviewer/resource~options}
 *   module:meteoJS/modelviewer/resource/image~options
 * @param {string} [url] - URL to the Image.
 */

/**
 * @classdesc Class to describe an image resource.
 */
export class Image extends Resource {
  
  /**
   * @param {module:meteoJS/modelviewer/resource/image~options} [options]
   *   Options.
   */
  constructor({ variables = [], url = undefined /*, mimetype, ...*/ } = {}) {
    super({
      variables
    });
    
    /**
     * @type string
     * @private
     */
    this._url = url;
  }
  
  /**
   * URL to the Image.
   * 
   * @type string
   */
  get url() {
    return this._url;
  }
}
export default Resource;