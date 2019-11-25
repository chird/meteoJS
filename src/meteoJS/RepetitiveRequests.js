/**
 * @module meteoJS/repetitiveRequests
 */
import addEventFunctions from 'meteojs/Events';

/**
 * @event module:meteoJS/repetitiveRequests#success
 */

/**
 * @event module:meteoJS/repetitiveRequests#error
 */

/**
 * @typedef {Function} module:meteoJS/repetitiveRequests
 * 
 */

/**
 * Options for constructor.
 * 
 * @typedef {Object} module:meteoJS/repetitiveRequests~options
 * @param {undefined|string|} url - URL (or getter of url) to make repetitive
 *   requests.
 * @param {boolean=true} start - Start repetetive requests on construction.
 * @param {boolean=false} pauseOnHiddenDocument - Pause making repetitive
 *   requests when document is hidden.
 */

/**
 * @classdesc Makes requests again and again. Useful to stay up to date with
 *   the data available on the server. If the response returns a Cache-Control
 *   HTTP-Header, then the next request will be done per default after this
 *   time.
 * 
 * @fires module:meteoJS/repetitiveRequests#success
 * @fires module:meteoJS/repetitiveRequests#error
 */
export class RepetitiveRequests {
  
  /**
   * @param {module:meteoJS/repetitiveRequests~options} [options] - Options.
   */
  constructor({
    url = undefined,
    start = true,
    pauseOnHiddenDocument = false,
    timeoutOnError = undefined
  } = {}) {
    
    /**
     * @type undefined|string
     * @private
     */
    this._url = url;
    
    /**
     * @type mixed
     * @private
     */
    this._timeoutID = undefined;
    
    /**
     * @type boolean
     */
    this._isStarted = start;
    
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
    return (this._url !== undefined)
      ? this._url
      : (this._urlGetter !== undefined)
        ? this._urlGetter()
        : undefined;
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
   * @private
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
    .then(response => {
      if (!this.isStarted)
        return;
      
      this.trigger('success');
      
      if (this._requestAfterCacheTime)
        this._planRequest(cacheTime);
    }, error => {
      if (!this.isStarted)
        return;
      
      this.trigger('error');
      
      if (this._timeoutOnError !== undefined)
        this._planRequest(this._timeoutOnError);
    });
  }
  
  /**
   * @private
   */
  async _makeRequest() {
    return new Promise((resolve, reject) => {
      let url = this.url();
      if (url === undefined)
        reject();
      
      let request = new XMLHttpRequest();
      request.open('GET', url);
      
      request.onload = () => {
        if (request.status == 200)
          resolve(request);
        else
          reject(request);
      };
      
      request.onerror = () => {
        reject(Error("Network Error"));
      };
      
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