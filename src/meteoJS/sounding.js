/**
 * @module meteoJS/sounding
 */

/**
 * Data for a sounding level. (possibly should be a class)
 * @typedef {Object} meteoJS/sounding~levelData
 * @param {float} level Pressure level [hPa].
 * @param {float|undefined} [altitude] Altitude above sealevel [m].
 * @param {boolean} [isAltitudeEstimated] Is altitude estimated or exact.
 * @param {float|undefined} [ttt] Temperature [K].
 * @param {float|undefined} [ttd] Dewpoint-temperature [K].
 * @param {float|undefined} [rh] Relative humidity []. ?name?
 * @param {float|undefined} [mixr] Mixing ration [g/kg]. ?name?
 * @param {float|undefined} [th] Isentropic temperature [K]. ?name?
 * @param {float|undefined} [the] Equivalent isentropic temperature [K]. ?name?
 * @param {float|undefined} [thw] Wetbulb isentropic temperature [K]. ?name?
 * @param {float|undefined} [u] Windspeed in east-west direction [m/s]. ?name?
 * @param {float|undefined} [v] Windspeed in nord-south direction [m/s]. ?name?
 * @param {float|undefined} [dir] Wind direction [°]. ?name?
 * @param {float|undefined} [v] Absolute windspeed [m/s]. ?name?
 */

/**
 * @classdesc
 * Class represents a atmospheric (radio-)sounding.
 * 
 * @constructor
 * @param {mixed} id Id for the sounding.
 * @param {meteoJS/sounding~levelData[]} levelData
 *   Array with data at different levels.
 * 
 * @todo
 * getterMethoden für verschiedene Parameter (CAPE, CIN, etc.) Wie genau?
 */
meteoJS.sounding = function (id, levelData) {
  this.levels = {};
  if (levelData)
    levelData.forEach(function (levelData) {
      this.addLevel(levelData);
    }, this);
};

/**
 * Returns Id of the sounding.
 * @returns {mixed}
 */
meteoJS.sounding.prototype.getId = function () {};

/**
 * Sets Id of the sounding.
 * @param {mixed} id New id.
 * @returns {meteoJS.sounding} this.
 */
meteoJS.sounding.prototype.setId = function (id) {};

/**
 * Adds/replaces Data for a certain level.
 * @param {meteoJS/sounding~levelData} levelData
 * @returns {meteoJS.sounding} this.
 */
meteoJS.sounding.prototype.addLevel = function (levelData) {
  if ('level' in levelData &&
      levelData.level !== undefined)
    this.levels[levelData.level] = levelData;
};

/**
 * Removes the Data for a certain level (if existing).
 * @param {float} level Remove the data at this Level [hPa].
 * @returns {meteoJS.sounding} this.
 */
meteoJS.sounding.prototype.removeLevel = function (level) {};

/**
 * Get the data for a specific level. Returns the levelData as passed to the
 * constructor or addLevel.
 * @param {float} level Level [hPa].
 * @returns {meteoJS/sounding~levelData|undefined}
 *   Data at a level, undefined if no data available.
 */
meteoJS.sounding.prototype.getData = function (level) {
  if (level in this.levels)
    return this.levels[level];
  else
    return {
      level: undefined,
      altitude: undefined,
      ttt: undefined,
      ttd: undefined
    };
};
/**
 * Get the data for a level. Will calculate additional data within levelData,
 * e.g. calculates relative humidity from dewpoint temperature.
 * @param {float} level Level [hPa].
 * @returns {meteoJS/sounding~levelData}
 *   Data at a level, potentially interpolated. Parts of the data can be
 *   undefined (if interpolation was not possible).
 * @todo
 * Need of specification of the mode of interpolation?
 */
meteoJS.sounding.prototype.getInterpolatedData = function (level) {};

/**
 * Get data for all defined levels.
 * @returns {meteoJS/sounding~levelData[]} Array of all the data.
 */
meteoJS.sounding.prototype.getLevels = function () {
  return Object.keys(this.levels).map(function (level) { return +level; }).sort(function (a,b) { return a-b; });
};

meteoJS.sounding.prototype.getNearestLevel = function (p) {
  return Object.keys(this.levels).sort(function (levelA, levelB) {
    return Math.abs(levelA-p) - Math.abs(levelB-p);
  })[0];
};

meteoJS.sounding.prototype.getCAPE = function (level, ttt, ttd) {};

meteoJS.sounding.prototype.getCIN = function (level, ttt, ttd) {};