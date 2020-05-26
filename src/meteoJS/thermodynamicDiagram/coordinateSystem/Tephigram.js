/**
 * @module meteoJS/thermodynamicDiagram/coordinateSystem/tephigram
 */
import CoordinateSystem from '../CoordinateSystem.js';

/**
 * Coordinate system for a tehpigram.
 * 
 * This diagram has straight lines:
 * * temperature/isotherms (45 degree inclination to the right)
 * * dryadiabats (45 degree inclination to the left)
 * 
 * @extends module:meteoJS/thermodynamicDiagram/coordinateSystem.CoordinateSystem
 */
export class Tephigram extends CoordinateSystem {

  /**
   * Returns if the dry adiabats are straight lines
   * in the defined coordinate system.
   * 
   * @override
   */
  isDryAdiabatStraightLine() {
    return true;
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
   * x coordinate for pressure and temperature.
   * 
   * @param {number} p - Pressure in hPa.
   * @param {number} T - Temperature in Kelvin.
   * @returns {number} Pixels from the left.
   */
  getXByPT(p, T) {
    const theta = thetaByPresAndTemp(p, T);
    const xT = (T - this.temperatureBottomLeft) *
      this.width / (this.temperatureBottomRight - this.temperatureBottomLeft);
    const xTheta = (theta - this.temperatureBottomLeft) *
      this.width / (this.temperatureBottomRight - this.temperatureBottomLeft);
    
  // bottom x coordinate 
    let x0 =
    (T-this.temperatureBottomLeft) *
    this.width / (this.temperatureBottomRight-this.temperatureBottomLeft);
    return x0 + y * this.inclinationTan;
    
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
}
export default Tephigram;