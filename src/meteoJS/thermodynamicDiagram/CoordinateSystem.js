/**
 * @module meteoJS/thermodynamicDiagram/coordinateSystem
 */
import { tempCelsiusToKelvin,
  tempByPotentialTempAndPres,
  tempByEquiPotTempAndPres,
  potentialTempByTempAndPres,
  dewpointByHMRAndPres,
  saturationHMRByTempAndPres } from '../calc.js';
import addEventFunctions from '../Events.js';

/**
 * Options change event.
 * 
 * @event module:meteoJS/thermodynamicDiagram/coordinateSystem#change:options
 */

/**
 * Pressure options.
 * 
 * @typedef {Object} module:meteoJS/thermodynamicDiagram/coordinateSystem~pressureOptions
 * @property {number} [min=100] - Minimum pressure on the diagram.
 * @property {number} [max=1050] - Maximum pressure on the diagram.
 */

/**
 * Temperature options.
 * 
 * @typedef {Object} module:meteoJS/thermodynamicDiagram/coordinateSystem~temperatureOptions
 * @property {number} [min=-40°C]
 *   Temperature either on bottom-left on the diagram (if reference equals
 *   'base') or on the left of an isobar (if reference is a number).
 * @property {number} [max=45°C]
 *   Temperature either on bottom-right on the diagram (if reference equals
 *   'base') or on the right of an isobar (if reference is a number).
 * @property {'base'|integer} [reference='base']
 *   Reference for 'min' and 'max' values. Allowed values: 'base' or number.
 * @property {integer} [inclinationAngle=45]
 *   Angle of inclination to the right of the isotherms. Allowed values between
 *   0 and 90 (exclusive), in degrees.
 */

/**
 * Options for the constructor.
 * 
 * @typedef {Object} module:meteoJS/thermodynamicDiagram/coordinateSystem~options
 * @param {integer} [width=100] - Width of the diagram.
 * @param {integer} [height=100] - Height of the diagram.
 * @param {module:meteoJS/thermodynamicDiagram/coordinateSystem~pressureOptions}
 *   [pressure] - Pressure options.
 * @param {module:meteoJS/thermodynamicDiagram/coordinateSystem~temperatureOptions}
 *   [temperature] - Temperature options.
 */

/**
 * Abstract class to specify the coordinate system of the thermodynamicDiagram.
 * Child classes define the explicit coordinate system.
 * This class defines already: (can be overridden by child classes)
 * * log-P y-axes with horizontal isobars
 * * straight isotherms, inclinated to the right
 * 
 * @abstract
 * @fires module:meteoJS/thermodynamicDiagram/coordinateSystem#change:options
 */
export class CoordinateSystem {
  
  /**
   * @param {module:meteoJS/thermodynamicDiagram/coordinateSystem~options} options
   */
  constructor({
    width = 100,
    height = 100,
    pressure = {},
    temperature = {}
  } = {}) {
    /**
     * @type integer
     * @private
     */
    this._width = width;
    
    /**
     * @type integer
     * @private
     */
    this._height = height;
    
    /**
     * @type number
     * @private
     */
    this.temperatureBottomLeft;
    
    /**
     * @type number
     * @private
     */
    this.temperatureBottomRight;
    
    /**
     * @type number
     * @private
     */
    this.inclinationTan;
    
    /**
     * @type Object
     * @private
     */
    this.options = {
      pressure: {},
      temperature: {}
    };
    
    this._initPressureOptions(pressure);
    this._initTemperatureOptions(temperature);
  }
  
  /**
   * Visible width, in pixels.
   * 
   * @type integer
   * @public
   */
  get width() {
    return this._width;
  }
  set width(width) {
    const oldWidth = this._width;
    this._width = width;
    if (oldWidth != this._width)
      this.trigger('change:options');
  }
  
  /**
   * Visible height, in pixels.
   * 
   * @type integer
   * @public
   */
  get height() {
    return this._height;
  }
  set height(height) {
    const oldHeight = this._height;
    this._height = height;
    if (oldHeight != this._height)
      this.trigger('change:options');
  }
  
  /**
   * Returns if isobars are straight lines in the defined coordinate system.
   * 
   * @returns {boolean}
   */
  isIsobarsStraightLine() {
    return true;
  }

  /**
   * Returns if the dry adiabats are straight lines
   * in the defined coordinate system.
   * 
   * @returns {boolean}
   */
  isDryAdiabatStraightLine() {
    return false;
  }
  
  /**
   * @returns {boolean}
   */
  isIsothermsVertical() {
    return (this.options.temperature.inclinationAngle !== undefined) &&
         (this.options.temperature.inclinationAngle == 0);
  }

  /**
   * Pressure for a x-y coordinate.
   * Implementation valid for horizontal isobars, log-P y-axes.
   * 
   * @param {number} x - Pixels from the left.
   * @param {number} y - Pixels from bottom.
   * @returns {number} Pressure in hPa.
   */
  getPByXY(x, y) {
    return Math.pow(this.options.pressure.min, y / this.height) *
         Math.pow(this.options.pressure.max,
           (this.height - y)/this.height);
  }

  /**
   * Temperature for x-y coordinate.
   * Implementation valid for straight isotherms.
   * 
   * @param {number} x - Pixels from the left.
   * @param {number} y - Pixels from bottom.
   * @returns {number} Temperature in Kelvin.
   */
  getTByXY(x, y) {
  // bottom x coordinate of isotherm
    let x0 = x - y * this.inclinationTan;
    return this.temperatureBottomLeft +
    x0 *
    (this.temperatureBottomRight-this.temperatureBottomLeft) / this.width;
  }

  /**
   * y coordinate for pressure and x coordinate.
   * Implementation valid for horizontal isobars, log-P y-axes.
   * 
   * @param {number} x - Pixels from the left.
   * @param {number} p - Pressure in hPa.
   * @returns {number} Pixels from bottom.
   */
  getYByXP(x, p) {
    return this.height *
    Math.log(this.options.pressure.max / p) /
    Math.log(this.options.pressure.max / this.options.pressure.min);
  }

  /**
   * Temperature for pressure and x coordinate.
   * Implementation valid for horizontal isobars, log-P y-axes and straight
   * isotherms.
   * 
   * @param {number} x - Pixels from the left.
   * @param {number} p - Pressure in hPa.
   * @returns {number} Temperature in Kelvin.
   */
  getTByXP(x, p) {
    return this.getTByXY(x, this.getYByXP(x, p));
  }

  /**
   * x coordinate for temperature and y coordinate.
   * Implementation valid for straight isotherms.
   * 
   * @param {number} y - Pixels from bottom.
   * @param {number} T - Temperature in Kelvin.
   * @returns {number} Pixels from the left.
   */
  getXByYT(y, T) {
  // bottom x coordinate 
    let x0 =
    (T-this.temperatureBottomLeft) *
    this.width / (this.temperatureBottomRight-this.temperatureBottomLeft);
    return x0 + y * this.inclinationTan;
  }

  /**
   * y coordinate for temperature and x coordinate.
   * Implementation valid for straight isotherms.
   * 
   * @param {number} x - Pixels from the left.
   * @param {number} T - Temperature in Kelvin.
   * @returns {number|undefined} Pixels from bottom.
   */
  getYByXT(x, T) {
    return (this.inclinationTan != 0) ?
      (x - this.getXByYT(0, T)) / this.inclinationTan :
      undefined;
  }

  /**
   * x coordinate for pressure and temperature.
   * Implementation valid for horizontal isobars, log-P y-axes and straight
   * isotherms.
   * 
   * @param {number} p - Pressure in hPa.
   * @param {number} T - Temperature in Kelvin.
   * @returns {number} Pixels from the left.
   */
  getXByPT(p, T) {
    return this.getXByYT(this.getYByXP(0, p), T);
  }

  /**
   * y coordinate for pressure and temperature.
   * Implementation valid for horizontal isobars, log-P y-axes and straight
   * isotherms.
   * 
   * @param {number} p - Pressure in hPa.
   * @param {number} T - Temperature in Kelvin.
   * @returns {number} Pixels from bottom.
   */
  getYByPT(p) {
    return this.getYByXP(0, p);
  }

  /**
   * x coordinate for potential temperature and y coordinate.
   * Implementation valid for horizontal isobars, log-P y-axes and straight
   * isotherms.
   * 
   * @param {number} y - Pixels from bottom.
   * @param {number} T - Potential temperature in Kelvin.
   * @returns {number} Pixels from the left.
   */
  getXByYPotentialTemperature(y, T) {
    T = tempByPotentialTempAndPres(T, this.getPByXY(0, y));
    return this.getXByYT(y, T);
  }

  /**
   * y coordinate for potential temperature and x coordinate.
   * Implementation valid for horizontal isobars, log-P y-axes and straight
   * isotherms.
   * 
   * @param {number} x - Pixels from the left.
   * @param {number} T - Potential temperature in Kelvin.
   * @returns {number|undefined} Pixels from bottom.
   */
  getYByXPotentialTemperature(x, T) {
    let a = this.getPByXY(x, 0);
    let b = this.getPByXY(x, this.height);
    if (potentialTempByTempAndPres(this.getTByXP(x, b), b) < T ||
      T < potentialTempByTempAndPres(this.getTByXP(x, a), a))
      return undefined;
    while (a-b > 10) {
      let p = b+(a-b)/2;
      let tBin = this.getTByXP(x, p);
      let potTemp = potentialTempByTempAndPres(tBin, p);
      if (potTemp === undefined)
        return undefined;
      if (potTemp < T)
        a = p;
      else
        b = p;
    }
    let y = this.getYByXP(x, b+(a-b)/2);
    return y;
  }

  /**
   * x coordinate for pressure and potential temperature.
   * Implementation valid for horizontal isobars, log-P y-axes and straight
   * isotherms.
   * 
   * @param {number} p - Pressure in hPa.
   * @param {number} T - Potential temperature in Kelvin.
   * @returns {number} Pixels from the left.
   */
  getXByPPotentialTemperatur(p, T) {
    T = tempByPotentialTempAndPres(T, p);
    return this.getXByPT(p, T);
  }

  /**
   * y coordinate for pressure and potential temperature.
   * Implementation valid for horizontal isobars, log-P y-axes and straight
   * isotherms.
   * 
   * @param {number} p - Pressure in hPa.
   * @param {number} T - Potential temperature in Kelvin.
   * @returns {number} Pixels from bottom.
   */
  getYByPPotentialTemperatur(p, T) {
    let x = this.getXByPPotentialTemperatur(p, T);
    return this.getYByXPotentialTemperature(x, T);
  }

  /**
   * x coordinate for humid mixing ratio and y coordinate.
   * Implementation valid for horizontal isobars, log-P y-axes and straight
   * isotherms.
   * 
   * @param {number} y - Pixels from bottom.
   * @param {number} hmr - Humid mixing ratio. []
   * @returns {number} Pixels from the left.
   */
  getXByYHMR(y, hmr) {
    let p = this.getPByXY(0, y); // horizontal isobars
    return this.getXByYT(y, dewpointByHMRAndPres(hmr, p));
  }

  /**
   * y coordinate for humid mixing ratio and x coordinate.
   * Implementation valid for horizontal isobars, log-P y-axes and straight
   * isotherms.
   * 
   * @param {number} x - Pixels from the left.
   * @param {number} hmr - Humid mixing ratio. []
   * @returns {number|undefined} Pixels from bottom.
   */
  getYByXHMR(x, hmr) {
    let a = this.getPByXY(x, 0);
    let b = this.getPByXY(x, this.height);
    while (a-b > 10) {
      let p = b+(a-b)/2;
      let hmrp = saturationHMRByTempAndPres(this.getTByXP(x, p), p);
      if (hmrp === undefined)
        return undefined;
      if (hmrp < hmr)
        b = p;
      else
        a = p;
    }
    let y = this.getYByXP(x, b+(a-b)/2);
    return y;
  }

  /**
   * x coordinate for pressure and humid mixing ratio.
   * Implementation valid for horizontal isobars, log-P y-axes and straight
   * isotherms.
   * 
   * @param {number} p - Pressure in hPa.
   * @param {number} hmr - Humid mixing ratio. []
   * @returns {number} Pixels from the left.
   */
  getXByPHMR(p, hmr) {
    let dewpoint = dewpointByHMRAndPres(hmr, p);
    return this.getXByPT(p, dewpoint);
  }

  /**
   * y coordinate for pressure and humid mixing ratio.
   * Implementation valid for horizontal isobars, log-P y-axes and straight
   * isotherms.
   * 
   * @param {number} p - Pressure in hPa.
   * @param {number} hmr - Humid mixing ratio. []
   * @returns {number|undefined} Pixels from bottom.
   */
  getYByPHMR(p, hmr) {
    let dewpoint = dewpointByHMRAndPres(hmr, p);
    return this.getYByPT(p, dewpoint);
  }

  /**
   * x coordinate for equipotential temperature and y coordainte.
   * Implementation valid for horizontal isobars, log-P y-axes and straight
   * isotherms.
   * 
   * @param {number} y - Pixels from bottom.
   * @param {number} thetae - Equipotential temperaturen in Kelvin.
   * @returns {number} Pixels from the left.
   */
  getXByYEquiPotTemp(y, thetae) {
    let T = tempByEquiPotTempAndPres(thetae, this.getPByXY(0, y));
    return this.getXByYT(y, T);
  }

  /**
   * y coordinate for equipotential temperature and x coordinate.
   * Implementation valid for horizontal isobars, log-P y-axes and straight
   * isotherms.
   * 
   * @param {number} x - Pixels from the left.
   * @param {number} thetae - Equipotential temperaturen in Kelvin.
   * @returns {number|undefined} Pixels from bottom.
   */
  getYByXEquiPotTemp(x, thetae) {
    let a = 0;
    let b = this.height;
    let y = undefined;
    while (b-a > 10) {
      y = a+(b-a)/2;
      let thetaEY =
      this.getYByXT(x,
        tempByEquiPotTempAndPres(thetae, this.getPByXY(x, y)));
      if (thetaEY === undefined)
        return undefined;
      if (thetaEY < thetae)
        b = y;
      else
        a = y;
    }
    return y;
  }

  /**
   * x coordinate for pressure and equipotential temperature .
   * Implementation valid for horizontal isobars, log-P y-axes and straight
   * isotherms.
   * 
   * @param {number} p - Pressure in hPa.
   * @param {number} thetae - Equipotential temperaturen in Kelvin.
   * @returns {number} Pixels from the left.
   */
  getXByPEquiPotTemp(p, thetae) {
    let T = tempByEquiPotTempAndPres(thetae, p);
    return this.getXByPT(p, T);
  }

  /**
   * y coordinate for pressure and equipotential temperature .
   * Implementation valid for horizontal isobars, log-P y-axes and straight
   * isotherms.
   * 
   * @param {number} p - Pressure in hPa.
   * @param {number} thetae - Equipotential temperaturen in Kelvin.
   * @returns {number|undefined} Pixels from bottom.
   */
  getYByPEquiPotTemp(p, thetae) {
    let T = tempByEquiPotTempAndPres(thetae, p);
    return this.getYByPT(p, T);
  }
  
  /**
   * Updates options. To restore a default value, pass undefined.
   * 
   * @param {module:meteoJS/thermodynamicDiagram/coordinateSystem~pressureOptions}
   *   [pressure] - Pressure options.
   * @param {module:meteoJS/thermodynamicDiagram/coordinateSystem~temperatureOptions}
   *   [temperature] - Temperature options.
   */
  update({
    pressure = {},
    temperature = {}
  } = {}) {
    if ('min' in pressure)
      this.options.pressure.min =
        (pressure.min === undefined) ? 100 : pressure.min;
    if ('max' in pressure)
      this.options.pressure.max =
        (pressure.max === undefined) ? 1000 : pressure.max;
    
    if ('min' in temperature)
      this.options.temperature.min =
        (temperature.min === undefined)
          ? tempCelsiusToKelvin(-40) : temperature.min;
    if ('max' in temperature)
      this.options.temperature.max =
        (temperature.max === undefined)
          ? tempCelsiusToKelvin(-45) : temperature.max;
    if ('reference' in temperature)
      this.options.temperature.reference =
        (temperature.reference === undefined) ? 'base' : temperature.reference;
    if ('inclinationAngle' in temperature)
      this.options.temperature.inclinationAngle =
        (temperature.inclinationAngle === undefined)
          ? 45 : temperature.inclinationAngle;
    
    this._normalizeTemperatureRange();
    
    this.trigger('change:options');
  }
  
  /**
   * @private
   */
  _initPressureOptions({
    min = 100,
    max = 1050
  }) {
    this.options.pressure = {
      min,
      max
    };
  }
  
  /**
   * @private
   */
  _initTemperatureOptions({
    min = tempCelsiusToKelvin(-40),
    max = tempCelsiusToKelvin(45),
    reference = 'base',
    inclinationAngle = 45
  }) {
    this.options.temperature = {
      min,
      max,
      reference,
      inclinationAngle
    };
    
    this._normalizeTemperatureRange();
  }
  
  /**
   * @internal
   */
  _normalizeTemperatureRange() {
    this.temperatureBottomLeft = this.options.temperature.min;
    this.temperatureBottomRight = this.options.temperature.max;
    this.inclinationTan =
    (this.options.temperature.inclinationAngle == 45) ?
      1 :
      (this.options.temperature.inclinationAngle == 0) ?
        0 :
        Math.tan(this.options.temperature.inclinationAngle * Math.PI/180);
    
    // specific pressure level for temperature range
    if (/^[0-9]+$/.test(this.options.temperature.reference)) {
      let yReference = this.getYByXP(0, this.options.temperature.reference);
      let xTmin = this.inclinationTan * yReference;
      let deltaT =
      (this.temperatureBottomRight - this.temperatureBottomLeft) /
      this.width;
      this.temperatureBottomLeft += deltaT * xTmin;
      this.temperatureBottomRight += deltaT * xTmin;
    }
  }
}
addEventFunctions(CoordinateSystem.prototype);
export default CoordinateSystem;