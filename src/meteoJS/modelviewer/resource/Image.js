/**
 * @module meteoJS/modelviewer/resource/image
 */
import Image from '../Resource.js';

/**
 * Options for constructor.
 * 
 * @typedef {meteoJS/modelviewer/resource~options}
 *   meteoJS/modelviewer/image~options
 * @param {string} [url] - URL to the Image.
 */

/**
 * @classdesc Class to describe an image resource.
 */
export class Image extends Resource {
  
  /**
   * @param {meteoJS/modelviewer/image~options} [options] - Options.
   */
  constructor({ variables = [], url, mimetype, ... } = {}) {
    super({
      variables
    });
    
    /** @type string */
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