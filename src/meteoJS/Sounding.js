/**
 * @module meteoJS/sounding
 */

/**
 * Data for a sounding level.
 * Nomenclature is analogue to the SHARPpy project (sharppy/sharptab/profile.py)
 * Exception for some units:
 * * Windspeed always in m/s
 * * Temperature in Kelvin
 * * Relative humidity unitless
 * 
 * @typedef {Object} meteoJS/sounding~levelData
 * @param {float} pres Pressure level [hPa].
 * @param {float|undefined} [hght] Altitude above sealevel [m].
 * @param {float|undefined} [tmpk] Temperature [K].
 * @param {float|undefined} [dwpk] Dewpoint-temperature [K].
 * @param {float|undefined} [wdir] Wind direction [°].
 * @param {float|undefined} [wspd] Absolute windspeed [m/s].
 * @param {float|undefined} [u] Windspeed in U-direction [m/s].
 * @param {float|undefined} [v] Windspeed in V-direction [m/s].
 * @param {float|undefined} [relh] Relative humidity [].
 * @param {float|undefined} [mixr] Mixing ration [g/kg].
 * @param {float|undefined} [theta] Isentropic temperature [K].
 * @param {float|undefined} [thetae] Equivalent isentropic temperature [K].
 * @param {float|undefined} [wetbulb] Wetbulb isentropic temperature [K].
 * @param {float|undefined} [vtmp] Virtual temperature [K].
 */

/**
 * @classdesc
 * Class represents an atmospheric (radio-)sounding.
 * 
 * @constructor
 * @param {meteoJS/sounding~options} [options] Default options.
 */
export class Sounding {

constructor(options) {
  this.options = $.extend(true, {
    calcMissing: false
  }, options);
  this.levels = {};
}

/**
 * Definition of the options while adding data to the sounding object.
 * @typedef {Object} meteoJS/sounding~options
 * @param {boolean} [calcMissing] Calculate missing data in each level.
 */

/**
 * Adds/replaces sounding data.
 * 
 * @param {meteoJS/sounding~levelData[]} levelsData
 *   Array with data at different levels.
 * @param {meteoJS/sounding~options} [options] Options.
 * @returns {meteoJS.sounding} this.
 */
addLevels(levelsData, options) {
  levelsData.forEach(function (levelData) {
    this.addLevel(levelData, options);
  }, this);
  return this;
}

/**
 * Adds/replaces Data for a certain level.
 * 
 * @param {meteoJS/sounding~levelData} levelData Data to add.
 * @param {meteoJS/sounding~options} [options] Options.
 * @returns {meteoJS.sounding} this.
 */
addLevel(levelData, options) {
  var o = $.extend(true, this.options ? this.options : {}, options ? options : {});
  if ('pres' in levelData &&
      levelData.pres !== undefined) {
    if (o !== undefined &&
        'calcMissing' in o &&
        o.calcMissing)
      levelData = this.calculateMissingData(levelData);
    this.levels[levelData.pres] = levelData;
  }
  return this;
}

/**
 * Calculates different parameters, if missing.
 * 
 * @param {meteoJS/sounding~levelData} d Data.
 * @returns {meteoJS/sounding~levelData} Adjusted data.
 */
calculateMissingData(d) {
  d = $.extend(true, this.getData(), d);
  
  // Height
  if (d.hght === undefined)
    d.hght = meteoJS.calc.altitudeISAByPres(d.pres);
  
  // Wind
  if (d.u === undefined &&
      d.v === undefined &&
      d.wdir !== undefined &&
      d.wspd !== undefined) {
    d.u = d.wspd * Math.sin(d.wdir / 180 * Math.PI);
    d.v = d.wspd * Math.cos(d.wdir / 180 * Math.PI);
  }
  else if (d.u !== undefined &&
           d.v !== undefined &&
           d.wdir === undefined &&
           d.wspd === undefined) {
    d.wspd = Math.sqrt(Math.pow(d.u, 2) + Math.pow(d.v, 2));
    d.wdir = Math.arctan(d.u/d.v) / Math.PI * 180;
  }
  
  // Humidity
  if (d.tmpk !== undefined &&
      d.dwpk !== undefined) {
    //if (d.relh === undefined)
    //  meteoJS.calc.;
    //if (d.mixr === undefined)
    //  d.mixr = meteoJS.calc;
    if (d.theta === undefined)
      d.theta = meteoJS.calc.potentialTempByTempAndPres(d.tmpk, d.pres);
    if (d.thetae === undefined)
      d.thetae = meteoJS.calc
        .equiPotentialTempByTempAndDewpointAndPres(d.tmpk, d.dwpk, d.pres);
  }
  else if (d.mixr !== undefined) {
    if (d.dwpk === undefined)
      d.dwpk = meteoJS.calc.dewpointByHMRAndPres(d.mixr, d.pres);
  }
  
  return d;
}

/**
 * Removes the Data for a certain level (if existing).
 * 
 * @param {float} pres Remove the data at this Level [hPa].
 * @returns {meteoJS.sounding} this.
 */
removeLevel(pres) {
  if (pres in this.levels)
    delete this.levels[pres];
  return this;
}

/**
 * Get the data for a specific level. Returns the levelData as passed to the
 * constructor or addLevel.
 * 
 * @param {float} pres Level [hPa].
 * @returns {meteoJS/sounding~levelData|undefined}
 *   Data at a level, undefined if no data available.
 */
getData(pres) {
  return (pres in this.levels) ? 
    this.levels[pres] :
    {
      pres: undefined,
      hght: undefined,
      tmpk: undefined,
      dwpk: undefined,
      wdir: undefined,
      wspd: undefined,
      u: undefined,
      v: undefined,
      relh: undefined,
      mixr: undefined,
      theta: undefined,
      thetae: undefined,
      wetbulb: undefined,
      vtmp: undefined
    };
}

/**
 * Get data for all defined levels. Upward sorted.
 * 
 * @returns {meteoJS/sounding~levelData[]} Array of all the data.
 */
getLevels() {
  return Object
    .keys(this.levels)
    .map(function (pres) { return +pres; })
    .sort(function (a,b) { return a-b; });
}

/**
 * Get nearest level [hPa] with data.
 * 
 * @param {float} pres Pressure [hPa].
 * @returns {float|undefined} Level with data or undefined. [hPa]
 */
getNearestLevel(pres) {
  if (Object.keys(this.levels).length < 1)
    return undefined;
  return Object
    .keys(this.levels)
    .sort(function (levelA, levelB) {
      return Math.abs(levelA-pres) - Math.abs(levelB-pres);
    }).shift();
}

}