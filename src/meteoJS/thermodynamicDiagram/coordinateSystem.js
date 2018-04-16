/**
 * @module meteoJS/thermodynamicDiagram/coordinateSystem
 */

/**
 * Definition of the options for the constructor.
 * @typedef {Object} meteoJS/thermodynamicDiagram/coordinateSystem~options
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
 * @classdesc
 * Abstract class to specify the coordinate system of the thermodynamicDiagram.
 * Child classes define the explicit coordinate system.
 * This class defines already: (can be overridden by child classes)
 * * log-P y-axes with horizontal isobars
 * * straight isotherms, inclinated to the right
 * 
 * @constructor
 * @abstract
 * @param {meteoJS/thermodynamicDiagram/coordinateSystem~options} options
 */
meteoJS.thermodynamicDiagram.coordinateSystem = function (options) {
  this.temperatureBottomLeft = undefined;
  this.temperatureBottomRight = undefined;
  this.inclinationTan = undefined;
  this.options = $.extend(true, {
    width: 100,
    height: 100,
    pressure: {
      min: 100,
      max: 1000
    },
    temperature: {
      min: meteoJS.calc.tempCelsiusToKelvin(-40),
      max: meteoJS.calc.tempCelsiusToKelvin(45),
      reference: 'base',
      inclinationAngle: 45
    }
  }, options);
  this._normalizeTemperatureRange();
};

/**
 * Returns visible width, in pixels.
 * 
 * @returns {integer}
 */
meteoJS.thermodynamicDiagram.coordinateSystem.prototype
  .getWidth = function () {
  return this.options.width;
};

/**
 * Returns visible height, in pixels.
 * 
 * @returns {integer}
 */
meteoJS.thermodynamicDiagram.coordinateSystem.prototype
  .getHeight = function () {
  return this.options.height;
};

/**
 * Returns if isobars are straight lines in the defined coordinate system.
 * 
 * @returns {boolean}
 */
meteoJS.thermodynamicDiagram.coordinateSystem.prototype
  .isIsobarsStraightLine = function () {
  return true;
};

/**
 * Returns if the dry adiabats are straight lines
 * in the defined coordinate system.
 * 
 * @returns {boolean}
 */
meteoJS.thermodynamicDiagram.coordinateSystem.prototype
  .isDryAdiabatStraightLine = function () {
  return false;
};

/**
 * Pressure for a x-y coordinate.
 * Implementation valid for horizontal isobars, log-P y-axes.
 * 
 * @param {number} x Pixels from the left.
 * @param {number} y Pixels from bottom.
 * @returns {number} Pressure in hPa.
 */
meteoJS.thermodynamicDiagram.coordinateSystem.prototype
  .getPByXY = function (x, y) {
  return Math.pow(this.options.pressure.min, y / this.getHeight()) *
         Math.pow(this.options.pressure.max,
                  (this.getHeight() - y)/this.getHeight());
};

/**
 * Temperature for x-y coordinate.
 * Implementation valid for straight isotherms.
 * 
 * @param {number} x Pixels from the left.
 * @param {number} y Pixels from bottom.
 * @returns {number} Temperature in Kelvin.
 */
meteoJS.thermodynamicDiagram.coordinateSystem.prototype
  .getTByXY = function (x, y) {
  // bottom x coordinate of isotherm
  var x0 = x - y * this.inclinationTan;
  return this.temperatureBottomLeft +
    x0 *
    (this.temperatureBottomRight-this.temperatureBottomLeft) / this.getWidth();
};

/**
 * y coordinate for pressure and x coordinate.
 * Implementation valid for horizontal isobars, log-P y-axes.
 * 
 * @param {number} x Pixels from the left.
 * @param {number} p Pressure in hPa.
 * @returns {number} Pixels from bottom.
 */
meteoJS.thermodynamicDiagram.coordinateSystem.prototype
  .getYByXP = function (x, p) {
  return this.getHeight() *
    Math.log(this.options.pressure.max / p) /
    Math.log(this.options.pressure.max / this.options.pressure.min);
};

/**
 * Temperature for pressure and x coordinate.
 * Implementation valid for horizontal isobars, log-P y-axes and straight
 * isotherms.
 * 
 * @param {number} x Pixels from the left.
 * @param {number} p Pressure in hPa.
 * @returns {number} Temperature in Kelvin.
 */
meteoJS.thermodynamicDiagram.coordinateSystem.prototype
  .getTByXP = function (x, p) {
  return this.getTByXY(x, this.getYByXP(x, p));
};

/**
 * x coordinate for temperature and y coordinate.
 * Implementation valid for straight isotherms.
 * 
 * @param {number} y Pixels from bottom.
 * @param {number} T Temperature in Kelvin.
 * @returns {number} Pixels from the left.
 */
meteoJS.thermodynamicDiagram.coordinateSystem.prototype
  .getXByYT = function (y, T) {
  // bottom x coordinate 
  var x0 =
    (T-this.temperatureBottomLeft) *
    this.getWidth() / (this.temperatureBottomRight-this.temperatureBottomLeft);
  return x0 + y * this.inclinationTan;
};

/**
 * y coordinate for temperature and x coordinate.
 * Implementation valid for straight isotherms.
 * 
 * @param {number} x Pixels from the left.
 * @param {number} T Temperature in Kelvin.
 * @returns {number} Pixels from bottom.
 */
meteoJS.thermodynamicDiagram.coordinateSystem.prototype
  .getYByXT = function (x, T) {
  return (x - this.getXByYT(0, T)) / this.inclinationTan;
};

/**
 * x coordinate for pressure and temperature.
 * Implementation valid for horizontal isobars, log-P y-axes and straight
 * isotherms.
 * 
 * @param {number} p Pressure in hPa.
 * @param {number} T Temperature in Kelvin.
 * @returns {number} Pixels from the left.
 */
meteoJS.thermodynamicDiagram.coordinateSystem.prototype
  .getXByPT = function (p, T) {
  return this.getXByYT(this.getYByXP(0, p), T);
};

/**
 * y coordinate for pressure and temperature.
 * Implementation valid for horizontal isobars, log-P y-axes and straight
 * isotherms.
 * 
 * @param {number} p Pressure in hPa.
 * @param {number} T Temperature in Kelvin.
 * @returns {number} Pixels from bottom.
 */
meteoJS.thermodynamicDiagram.coordinateSystem.prototype
  .getYByPT = function (p, T) {
  return this.getYByXP(0, p);
};

/**
 * x coordinate for potential temperature and y coordinate.
 * Implementation valid for horizontal isobars, log-P y-axes and straight
 * isotherms.
 * 
 * @param {number} y Pixels from bottom.
 * @param {number} T Potential temperature in Kelvin.
 * @returns {number} Pixels from the left.
 */
meteoJS.thermodynamicDiagram.coordinateSystem.prototype
  .getXByYPotentialTemperature = function (y, T) {
  var T = meteoJS.calc.tempByPotentialTempAndPres(T, this.getPByXY(0, y));
  return this.getXByYT(y, T);
};

/**
 * y coordinate for potential temperature and x coordinate.
 * Implementation valid for horizontal isobars, log-P y-axes and straight
 * isotherms.
 * 
 * @param {number} x Pixels from the left.
 * @param {number} T Potential temperature in Kelvin.
 * @returns {number|undefined} Pixels from bottom.
 */
meteoJS.thermodynamicDiagram.coordinateSystem.prototype
  .getYByXPotentialTemperature = function (x, T) {
  var a = this.getPByXY(x, 0);
  var b = this.getPByXY(x, this.getHeight());
  if (meteoJS.calc.potentialTempByTempAndPres(this.getTByXP(x, b), b) < T ||
      T < meteoJS.calc.potentialTempByTempAndPres(this.getTByXP(x, a), a))
    return undefined;
  while (a-b > 10) {
    var p = b+(a-b)/2;
    var tBin = this.getTByXP(x, p);
    var potTemp = meteoJS.calc.potentialTempByTempAndPres(tBin, p);
    if (potTemp === undefined)
      return undefined;
    if (potTemp < T)
      a = p;
    else
      b = p;
  }
  var y = this.getYByXP(x, b+(a-b)/2);
  return y;
};

/**
 * x coordinate for pressure and potential temperature.
 * Implementation valid for horizontal isobars, log-P y-axes and straight
 * isotherms.
 * 
 * @param {number} p Pressure in hPa.
 * @param {number} T Potential temperature in Kelvin.
 * @returns {number} Pixels from the left.
 */
meteoJS.thermodynamicDiagram.coordinateSystem.prototype
  .getXByPPotentialTemperatur = function (p, T) {
  var T = meteoJS.calc.tempByPotentialTempAndPres(T, p);
  return this.getXByPT(p, T);
};

/**
 * y coordinate for pressure and potential temperature.
 * Implementation valid for horizontal isobars, log-P y-axes and straight
 * isotherms.
 * 
 * @param {number} p Pressure in hPa.
 * @param {number} T Potential temperature in Kelvin.
 * @returns {number} Pixels from bottom.
 */
meteoJS.thermodynamicDiagram.coordinateSystem.prototype
  .getYByPPotentialTemperatur = function (p, T) {
  var x = this.getXByPPotentialTemperatur(p, T);
  return this.getYByXPotentialTemperature(y, T);
};

/**
 * x coordinate for humid mixing ratio and y coordinate.
 * Implementation valid for horizontal isobars, log-P y-axes and straight
 * isotherms.
 * 
 * @param {number} y Pixels from bottom.
 * @param {number} hmr Humid mixing ratio. []
 * @returns {number} Pixels from the left.
 */
meteoJS.thermodynamicDiagram.coordinateSystem.prototype
  .getXByYHMR = function (y, hmr) {
  var p = this.getPByXY(0, y); // horizontal isobars
  return this.getXByYT(y, meteoJS.calc.dewpointByHMRAndPres(hmr, p));
};

/**
 * y coordinate for humid mixing ratio and x coordinate.
 * Implementation valid for horizontal isobars, log-P y-axes and straight
 * isotherms.
 * 
 * @param {number} x Pixels from the left.
 * @param {number} hmr Humid mixing ratio. []
 * @returns {number|undefined} Pixels from bottom.
 */
meteoJS.thermodynamicDiagram.coordinateSystem.prototype
  .getYByXHMR = function (x, hmr) {
  var a = this.getPByXY(x, 0);
  var b = this.getPByXY(x, this.getHeight());
  while (a-b > 10) {
    var p = b+(a-b)/2;
    var hmrp = meteoJS.calc.saturationHMRByTempAndPres(this.getTByXP(x, p), p);
    if (hmrp === undefined)
      return undefined;
    if (hmrp < hmr)
      b = p;
    else
      a = p;
  }
  var y = this.getYByXP(x, b+(a-b)/2);
  return y;
};

/**
 * x coordinate for pressure and humid mixing ratio.
 * Implementation valid for horizontal isobars, log-P y-axes and straight
 * isotherms.
 * 
 * @param {number} p Pressure in hPa.
 * @param {number} hmr Humid mixing ratio. []
 * @returns {number} Pixels from the left.
 */
meteoJS.thermodynamicDiagram.coordinateSystem.prototype
  .getXByPHMR = function (p, hmr) {
  var dewpoint = meteoJS.calc.dewpointByHMRAndPres(hmr, p);
  return this.getXByPT(p, dewpoint);
};

/**
 * y coordinate for pressure and humid mixing ratio.
 * Implementation valid for horizontal isobars, log-P y-axes and straight
 * isotherms.
 * 
 * @param {number} p Pressure in hPa.
 * @param {number} hmr Humid mixing ratio. []
 * @returns {number|undefined} Pixels from bottom.
 */
meteoJS.thermodynamicDiagram.coordinateSystem.prototype
  .getYByPHMR = function (p, hmr) {
  var dewpoint = meteoJS.calc.dewpointByHMRAndPres(hmr, p);
  return this.getYByPT(p, dewpoint);
};

/**
 * x coordinate for equipotential temperature and y coordainte.
 * Implementation valid for horizontal isobars, log-P y-axes and straight
 * isotherms.
 * 
 * @param {number} y Pixels from bottom.
 * @param {number} thetae Equipotential temperaturen in Kelvin.
 * @returns {number} Pixels from the left.
 */
meteoJS.thermodynamicDiagram.coordinateSystem.prototype
  .getXByYEquiPotTemp = function (y, thetae) {
  var a = 0;
  var b = this.options.width;
  while (b-a > 10) {
    var x = a+(b-a)/2;
    var thetaEX = meteoJS.calc.tempByEquiPotTempAndPres(thetae, this.getPByXY(x, y));
    if (thetaEX === undefined)
      return undefined;
    if (thetaEX < thetae)
      b = x;
    else
      a = x;
  }
  return x;
};

/**
 * y coordinate for equipotential temperature and x coordinate.
 * Implementation valid for horizontal isobars, log-P y-axes and straight
 * isotherms.
 * 
 * @param {number} x Pixels from the left.
 * @param {number} thetae Equipotential temperaturen in Kelvin.
 * @returns {number|undefined} Pixels from bottom.
 */
meteoJS.thermodynamicDiagram.coordinateSystem.prototype
  .getYByXEquiPotTemp = function (x, thetae) {
  var a = 0;
  var b = this.options.height;
  while (b-a > 10) {
    var y = a+(b-a)/2;
    var thetaEY = meteoJS.calc.tempByEquiPotTempAndPres(thetae, this.getPByXY(x, y));
    if (thetaEY === undefined)
      return undefined;
    if (thetaEY < thetae)
      b = y;
    else
      a = y;
  }
  return x;
};

/**
 * x coordinate for pressure and equipotential temperature .
 * Implementation valid for horizontal isobars, log-P y-axes and straight
 * isotherms.
 * 
 * @param {number} p Pressure in hPa.
 * @param {number} thetae Equipotential temperaturen in Kelvin.
 * @returns {number} Pixels from the left.
 */
meteoJS.thermodynamicDiagram.coordinateSystem.prototype
  .getXByPEquiPotTemp = function (p, thetae) {
  var T = meteoJS.calc.tempByEquiPotTempAndPres(thetae, p);
  return this.getXByPT(p, T);
};

/**
 * y coordinate for pressure and equipotential temperature .
 * Implementation valid for horizontal isobars, log-P y-axes and straight
 * isotherms.
 * 
 * @param {number} p Pressure in hPa.
 * @param {number} thetae Equipotential temperaturen in Kelvin.
 * @returns {number|undefined} Pixels from bottom.
 */
meteoJS.thermodynamicDiagram.coordinateSystem.prototype
  .getYByPEquiPotTemp = function (p, thetae) {
  var T = meteoJS.calc.tempByEquiPotTempAndPres(thetae, p);
  return this.getYByPT(p, T);
};

/**
 * @internal
 */
meteoJS.thermodynamicDiagram.coordinateSystem.prototype
  ._normalizeTemperatureRange = function () {
  this.temperatureBottomLeft = this.options.temperature.min;
  this.temperatureBottomRight = this.options.temperature.max;
  this.inclinationTan =
    Math.tan(this.options.temperature.inclinationAngle * Math.PI/180);
  
  // specific pressure level for temperature range
  if (/^[0-9]+$/.test(this.options.temperature.reference)) {
    var yReference = this.getYByXP(0, this.options.temperature.reference);
    var xTmin = this.inclinationTan * yReference;
    var deltaT =
      (this.temperatureBottomRight - this.temperatureBottomLeft) /
      this.getWidth();
    this.temperatureBottomLeft += deltaT * xTmin;
    this.temperatureBottomRight += deltaT * xTmin;
  }
}