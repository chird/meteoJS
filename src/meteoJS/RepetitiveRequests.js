/**
 * @module meteoJS/repetitiveRequests
 */
import addEventFunctions from './Events.js';

/**
 * Event fired before a request is executed.
 * 
 * @event module:meteoJS/repetitiveRequests#before:request
 */

/**
 * Event fired on a successful request.
 * 
 * @event module:meteoJS/repetitiveRequests#success:request
 * @property {external:XMLHttpRequest} request - XMLHttpRequest of the successful request.
 */

/**
 * Event fired if a request failed.
 * 
 * @event module:meteoJS/repetitiveRequests#error:request
 * @property {external:XMLHttpRequest} request - XMLHttpRequest of the failed request.
 */

/**
 * Options for constructor.
 * 
 * @typedef {Object} module:meteoJS/repetitiveRequests~options
 * @property {undefined|string} [url=undefined] - URL to make repetitive
 *   requests to. If undefined, no request will be done.
 * @property {string} [user=''] - User to send with request.
 * @property {string} [password=''] - Password to send with request.
 * @property {boolean} [start=true] - Start repetetive requests on construction.
 * @property {undefined|string} [defaultTimeout=undefined]
 *   Default timeout until next request, if response has no Cache-Control
 *   HTTP-Header. In milliseconds. If undefined, a further request will only be
 *   done, if the reponse returned a valid Cache-Control header.
 * @property {undefined|string} [timeoutOnError=undefined]
 *   Timeout until next request after a error response. In milliseconds. If
 *   undefined, no further request will be done after an error.
 * @property {boolean} [pauseOnHiddenDocument=false] - Pause making repetitive
 *   requests when document is hidden.
 * @property {''|'arraybuffer'|'blob'|'document'|'json'|'text'} [responseType='']
 *   Specifies the content type of the response.
 *   See {@link https://developer.mozilla.org/de/docs/Web/API/XMLHttpRequest/responseType}.
 */

/**
 * Makes requests again and again. Useful to stay up to date with
 *   the data available on the server. If the response returns a Cache-Control
 *   HTTP-Header, then the next request will be done per default after this
 *   time.
 * 
 * @fires module:meteoJS/repetitiveRequests#before:request
 * @fires module:meteoJS/repetitiveRequests#success:request
 * @fires module:meteoJS/repetitiveRequests#error:request
 */
export class RepetitiveRequests {
  
  /**
   * @param {module:meteoJS/repetitiveRequests~options} [options] - Options.
   */
  constructor({
    url = undefined,
    user = '',
    password = '',
    start = true,
    defaultTimeout = undefined,
    timeoutOnError = undefined,
    pauseOnHiddenDocument = false,
    responseType = ''
  } = {}) {
    
    /**
     * @type undefined|string
     * @private
     */
    this._url = url;
    
    /**
     * @type string
     * @private
     */
    this._user = user;
    
    /**
     * @type string
     * @private
     */
    this._password = password;
    
    /**
     * @type boolean
     * @private
     */
    this._isStarted = start;
    
    /**
     * @type undefined|integer
     * @private
     */
    this._defaultTimeout = defaultTimeout;
    
    /**
     * @type undefined|integer
     * @private
     */
    this._timeoutOnError = timeoutOnError;
    
    /**
     * @type boolean
     * @private
     */
    this._pauseOnHiddenDocument = pauseOnHiddenDocument;
    this._initPauseOnHiddenDocument();

    /**
     * @type boolean
     * @private
     */
    this._isSuppressedByHiddenDocument = false;
    
    /**
     * @type string
     * @private
     */
    this._responseType = responseType;
    
    /**
     * @type mixed
     * @private
     */
    this._timeoutID = undefined;
    
    /**
     * @type boolean
     * @private
     */
    this._loading = false;
    
    if (this._isStarted)
      this.start();
  }
  
  /**
   * Current URL to make requests to.
   * 
   * @type undefined|string
   */
  get url() {
    return this._url;
  }
  set url(url) {
    this._url = url;
  }
  
  /**
   * User to send with request.
   * 
   * @type string
   */
  get user() {
    return this._user;
  }
  set user(user) {
    this._user = user;
  }
  
  /**
   * Password to send with request.
   * 
   * @type string
   */
  get password() {
    return this._password;
  }
  set password(password) {
    this._password = password;
  }
  
  /**
   * Content type of the response.
   * 
   * @type string
   */
  get responseType() {
    return this._responseType;
  }
  set responseType(responseType) {
    this._responseType = responseType;
  }
  
  /**
   * Start repetitive requests. Makes immediatly the first request.
   */
  start() {
    this._isStarted = true;
    this._startRequest();
  }
  
  /**
   * Stops repetitive requests. Events aren't triggered anymore. Even if a
   * former request creates a response.
   */
  stop() {
    this._isStarted = false;
    if (this._timeoutID !== undefined) {
      clearTimeout(this._timeoutID);
      this._timeoutID = undefined;
    }
  }
  
  /**
   * Executes next request after the passed delay. If already another request
   * is planned, nothing is done.
   * 
   * @private
   * @param {integer} delay - Delay in milliseconds.
   */
  _planRequest({
    delay
  }) {
    if (this._timeoutID !== undefined)
      return;
    
    this._timeoutID = setTimeout(() => {
      if (this._pauseOnHiddenDocument
        && ('hidden' in document)
        && document.hidden) {
        this._isSuppressedByHiddenDocument = true;
        return;
      }

      this._startRequest();
    }, delay);
  }
  
  /**
   * Makes a new request and triggeres events.
   * 
   * @private
   */
  _startRequest() {
    if (this._timeoutID !== undefined) {
      clearTimeout(this._timeoutID);
      this._timeoutID = undefined;
    }
    
    this._makeRequest()
      .then(({ request }) => {
        if (!this._isStarted)
          return;
      
        let delay = this._defaultTimeout;
      
        // Read ResponseHeader
        let cacheControl = request.getResponseHeader('Cache-Control');
        if (cacheControl !== null) {
          let maxAges = /(^|,\s*)max-age=([0-9]+)($|\s*,)/.exec(cacheControl);
          if (maxAges !== null &&
            maxAges[2] > 0)
            delay = Math.round(maxAges[2]*1000);
        }
      
        this.trigger('success:request', { request });
      
        if (delay !== undefined)
          this._planRequest({ delay });
      }, ({ request } = {}) => {
        if (!this._isStarted)
          return;
      
        if (request === undefined)
          return;
      
        this.trigger('error:request', { request });
      
        if (this._timeoutOnError !== undefined)
          this._planRequest({ delay: this._timeoutOnError });
      }, ({ request = undefined }) => {
        /* Promise() returned by _makeRequest() also rejects, when URL isn't
         * defined or is actually loading. In these cases don't throw an
         * error event. */
        if (request !== undefined)
          this.trigger('error:request', { request });
      });
  }
  
  /**
   * Makes a new request immediatly, except another request is already loading.
   * 
   * @private
   * @returns {Promise}
   */
  async _makeRequest() {
    this.trigger('before:request');
    return new Promise((resolve, reject) => {
      if (this._url === undefined) {
        reject();
        return;
      }
      
      if (this._loading) {
        reject();
        return;
      }
      this._loading = true;
      
      let request = new XMLHttpRequest();
      if (this.responseType !== undefined)
        request.responseType = this.responseType;
      request.addEventListener('load', () => {
        this._loading = false;
        
        if (request.status == 200)
          resolve({ request });
        else
          reject({ request });
      });
      request.addEventListener('error', () => {
        this._loading = false;
        reject({ request });
      });
      
      request.open('GET', this._url, true, this._user, this._password);
      request.send();
    });
  }
  
  /**
   * @private
   */
  _initPauseOnHiddenDocument() {
    if (!this._pauseOnHiddenDocument)
      return;
    
    document.addEventListener('visibilitychange', () => {
      if (('hidden' in document)
        && !document.hidden
        && this._isSuppressedByHiddenDocument
        && this._isStarted) {
        this._isSuppressedByHiddenDocument = false;
        this.start();
      }
    });
  }
}
addEventFunctions(RepetitiveRequests.prototype);
export default RepetitiveRequests;
