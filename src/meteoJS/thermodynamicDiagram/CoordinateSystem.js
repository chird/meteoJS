/**
 * @module meteoJS/thermodynamicDiagram/coordinateSystem
 */
import { tempCelsiusToKelvin,
  tempByPotentialTempAndPres,
  tempByEquiPotTempAndPres,
  potentialTempByTempAndPres,
  dewpointByHMRAndPres,
  saturationHMRByTempAndPres } from '../calc.js';

/**
 * Definition of the options for the constructor.
 * @typedef {Object} module:meteoJS/thermodynamicDiagram/coordinateSystem~options
 * @param {integer} width Width of the diagram.
 * @param {integer} height Height of the diagram.
 * @param {Object} pressure Definition of the pressure range.
 * @param {number} pressure.min Minimum pressure on the diagram.
 * @param {number} pressure.max Maximum pressure on the diagram.
 * @param {Object} temperature Definition of the temperature range.
 * @param {number} temperature.min
 *   Temperature either on bottom-left on the diagram (if reference equals
 *   'base') or on the left of an isobar (if reference is a number).
 * @param {number} temperature.max
 *   Temperature either on bottom-right on the diagram (if reference equals
 *   'base') or on the right of an isobar (if reference is a number).
 * @param {string|integer} temperature.reference
 *   Reference for 'min' and 'max' values. Allowed values: 'base' or number.
 * @param {integer} temperature.inclinationAngle
 *   Angle of inclination to the right of the isotherms. Allowed values between
 *   0 and 90 (exclusive), in degrees.
 */

/**
 * Abstract class to specify the coordinate system of the thermodynamicDiagram.
 * Child classes define the explicit coordinate system.
 * This class defines already: (can be overridden by child classes)
 * * log-P y-axes with horizontal isobars
 * * straight isotherms, inclinated to the right
 * 
 * @abstract
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
    this.temperatureBottomLeft = undefined;
    this.temperatureBottomRight = undefined;
    this.inclinationTan = undefined;
    
    if ((!('min' in pressure)) ||
        pressure.min === undefined)
      pressure.min = 100;
    if ((!('max' in pressure)) ||
        pressure.max === undefined)
      pressure.max = 1000;
    if ((!('min' in temperature)) ||
        temperature.min === undefined)
      temperature.min = tempCelsiusToKelvin(-40);
    if ((!('max' in temperature)) ||
        temperature.max === undefined)
      temperature.max = tempCelsiusToKelvin(45);
    if ((!('reference' in temperature)) ||
        temperature.reference === undefined)
      temperature.reference = 'base';
    if ((!('inclinationAngle' in temperature)) ||
        temperature.inclinationAngle === undefined)
      temperature.inclinationAngle = 45;
    
    this.options = {
      width,
      height,
      pressure,
      temperature
    };
    
    this._normalizeTemperatureRange();
  }

  /**
   * Returns visible width, in pixels.
   * 
   * @returns {integer}
   */
  getWidth() {
    return this.options.width;
  }

  /**
   * Returns visible height, in pixels.
   * 
   * @returns {integer}
   */
  getHeight() {
    return this.options.height;
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
    return Math.pow(this.options.pressure.min, y / this.getHeight()) *
         Math.pow(this.options.pressure.max,
           (this.getHeight() - y)/this.getHeight());
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
    (this.temperatureBottomRight-this.temperatureBottomLeft) / this.getWidth();
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
    return this.getHeight() *
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
    this.getWidth() / (this.temperatureBottomRight-this.temperatureBottomLeft);
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
    let b = this.getPByXY(x, this.getHeight());
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
    let b = this.getPByXY(x, this.getHeight());
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
    let b = this.getHeight();
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
      this.getWidth();
      this.temperatureBottomLeft += deltaT * xTmin;
      this.temperatureBottomRight += deltaT * xTmin;
    }
  }

}
export default CoordinateSystem;