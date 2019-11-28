/**
 * @module meteoJS/repetitiveRequests
 */
import addEventFunctions from './Events.js';

/**
 * @event module:meteoJS/repetitiveRequests#success:request
 */

/**
 * @event module:meteoJS/repetitiveRequests#error:request
 */

/**
 * Options for constructor.
 * 
 * @typedef {Object} module:meteoJS/repetitiveRequests~options
 * @param {undefined|string} url - URL to make repetitive requests to. If
 *   undefined, no request will be done.
 * @param {string} [user] - User to send with request.
 * @param {string} [password] - Password to send with request.
 * @param {boolean=true} start - Start repetetive requests on construction.
 * @param {undefined|string=undefined} [defaultTimeout]
 *   Default timeout until next request, if response has no Cache-Control
 *   HTTP-Header. In milliseconds. If undefined, a further request will only be
 *   done, if the reponse returned a valid Cache-Control header.
 * @param {undefined|string=undefined} [timeoutOnError]
 *   Timeout until next request after a error response. In milliseconds. If
 *   undefined, no further request will be done after an error.
 * @param {boolean=false} pauseOnHiddenDocument - Pause making repetitive
 *   requests when document is hidden.
 */

/**
 * @classdesc Makes requests again and again. Useful to stay up to date with
 *   the data available on the server. If the response returns a Cache-Control
 *   HTTP-Header, then the next request will be done per default after this
 *   time.
 * 
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
    pauseOnHiddenDocument = false
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
     * @type mixed
     * @private
     */
    this._timeoutID = undefined;
    
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
  };
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
   * Start repetitive requests. Makes immediatly the first request.
   */
  start() {
    this.isStarted = true;
    this._startRequest();
  }
  
  /**
   * Stops repetitive requests. Events aren't triggered anymore. Even if a
   * former request creates a response.
   */
  stop() {
    this.isStarted = false;
    if (this.timeoutID !== undefined)
      clearTimeout(this.timeoutID);
  }
  
  /**
   * Executes next request after the passed delay.
   * 
   * @private
   * @param {integer} delay - Delay in milliseconds.
   */
  _planRequest({
    delay
  }) {
    this._timeoutID = setTimeout(() => {
      this._startRequest();
    }, delay);
  }
  
  /**
   * @private
   */
  _startRequest() {
    if (this._timeoutID !== undefined)
      clearTimeout(this._timeoutID);
    
    this._makeRequest()
    .then(request => {
      if (!this.isStarted)
        return;
      
      let delay = this._defaultTimeout;
      
      // Read ResponseHeader
      let cacheControl = request.getResponseHeader('Cache-Control');
      if (cacheControl !== null) {
        let maxAges = /(^|,)max-age=([0-9]+)($|,)/.exec(cacheControl);
        if (maxAges !== null &&
            maxAges[2] > 0)
          delay = Math.round(maxAges[2]*1000);
      }
      
      this.trigger('success:request', { request });
      
      if (delay !== undefined)
        this._planRequest({ delay });
    }, request => {
      if (!this.isStarted)
        return;
      
      this.trigger('error:request', { request });
      
      if (this._timeoutOnError !== undefined)
        this._planRequest({ delay: this._timeoutOnError });
    });
  }
  
  /**
   * Makes a new request immediatly.
   * 
   * @private
   */
  async _makeRequest() {
    return new Promise((resolve, reject) => {
      let url = this.url();
      if (url === undefined)
        reject();
      
      let request = new XMLHttpRequest();
      request.addEventListener('load', () => {
        if (request.status == 200)
          resolve(request);
        else
          reject(request);
      });
      request.addEventListener('error', () => {
        reject(request);
      });
      
      request.open('GET', url, true, this._user, this._password);
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
      if ('hidden' in document)
        if (document.hidden)
          this.stop();
        else
          this.start();
    });
  }
}
addEventFunctions(RepetitiveRequests.prototype);

/*makeRepetitiveCaller = function (UrlGetter, onSuccess, onError) {
  var result = function (UrlGetter, onSuccess, onError) {
    this.default_timeout = 30*60*1000; // 30 Minuten
    this.UrlGetter = UrlGetter;
    this.onSuccess = onSuccess;
    this.onError = onError;
    this.timeoutID = undefined;
    this.start();
  };
  result.prototype._fireRaw = function (UrlGetter, onSuccess, onError, no_cache) {
    var url = UrlGetter();
    if (url !== undefined) {
      $.ajax({
        url: url,
        cache: no_cache ? false : true
      }).success(function (data, textStatus, request) {
        onSuccess.call(this, data, textStatus, request);
      }).error(function (jqXHR, textStatus) {
        onError.call(this, jqXHR, textStatus)
      });
      return true;
    }
    return false;
  };
  result.prototype._fire = function () {
    if (this.timeoutID !== undefined)
      return;
    var that = this;
    this._fireRaw(this.UrlGetter, function (data, textStatus, request) {
      if (!that.is_stopped) {
        var timeout = that.default_timeout;
        var max_ages = /(^|,)max-age=([0-9]+)($|,)/
                       .exec(request.getResponseHeader('Cache-Control'));
        if (max_ages !== null &&
            max_ages[2] > 0)
          timeout = Math.round(max_ages[2]*1000);
        that.timeoutID = setTimeout(function () {
          that.timeoutID = undefined;
          that._fire();
        }, timeout);
      }
      that.onSuccess.call(this, data, textStatus, request);
    },
    function (jqXHR, textStatus) {
      if (!that.is_stopped)
        that.timeoutID = setTimeout(function () {
          that.timeoutID = undefined;
          that._fire();
        }, that.default_timeout);
      that.onError.call(this, jqXHR, textStatus);
    });
  };
  result.prototype.start = function () {
    this.is_stopped = false;
    this._fire();
  };
  result.prototype.stop = function () {
    this.is_stopped = true;
  };
  result.prototype.fire = function () {
    this._fireRaw(this.UrlGetter, this.onSuccess, this.onError, true);
  };
  return new result(UrlGetter, onSuccess, onError);
};*/