/**
 * @module meteoJS/sounding
 */
import { altitudeISAByPres,
  potentialTempByTempAndPres,
  equiPotentialTempByTempAndDewpointAndPres,
  dewpointByHMRAndPres } from './calc.js';
import Collection from './base/Collection.js';
import Parcel from './sounding/Parcel.js';

/**
 * Data for a sounding level.
 * Nomenclature is analogue to the SHARPpy project (sharppy/sharptab/profile.py)
 * Exception for some units:
 * * Windspeed always in m/s
 * * Temperature in Kelvin
 * * Relative humidity unitless
 * 
 * @typedef {Object} module:meteoJS/sounding~levelData
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
 * Options for the constructor.
 * 
 * @typedef {Object} module:meteoJS/sounding~options
 * @param {boolean} [calcMissing] - Calculate missing data in each level.
 */

/**
 * Class represents an atmospheric (radio-)sounding.
 */
export class Sounding {
  
  /**
   * @param {module:meteoJS/sounding~options} [options] - Options.
   */
  constructor({
    calcMissing = false,
    parcels = []
  } = {}) {
    this.options = {
      calcMissing
    };
    this.levels = {};
    
    /**
     * @type module:meteoJS/base/collection.Collection
     * @private
     */
    this._parcelCollection = new Collection({
      fireAddRemoveOnReplace: true,
      fireReplace: false,
      emptyObjectMaker: () => new Parcel()
    });
    this._parcelCollection.append(...parcels);
  }
  
  /**
   * @type module:meteoJS/base/collection.Collection
   * @public
   * @readonly
   */
  get parcelCollection() {
    return this._parcelCollection;
  }
  
  /**
   * Adds/replaces sounding data.
   * 
   * @param {module:meteoJS/sounding~levelData[]} levelsData
   *   Array with data at different levels.
   * @param {module:meteoJS/sounding~options} [options] - Options.
   * @returns {module:meteoJS/sounding.Sounding} This.
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
   * @param {module:meteoJS/sounding~levelData} levelData - Data to add.
   * @param {module:meteoJS/sounding~options} [options] - Options.
   * @returns {module:meteoJS/sounding.Sounding} This.
   */
  addLevel(levelData, { calcMissing } = {}) {
    calcMissing = calcMissing ? calcMissing : this.options.calcMissing;
    if ('pres' in levelData &&
      levelData.pres !== undefined) {
      if (calcMissing)
        levelData = this.calculateMissingData(levelData);
      this.levels[levelData.pres] = levelData;
    }
    return this;
  }

  /**
   * Calculates different parameters, if missing.
   * 
   * @param {module:meteoJS/sounding~levelData} d - Data.
   * @returns {module:meteoJS/sounding~levelData} Adjusted data.
   */
  calculateMissingData({ pres, hght,
    u, v, wdir, wspd,
    tmpk, dwpk,
    relh, mixr, theta, thetae, wetbulb, vtmp }) {
    let d = { pres, hght,
      u, v, wdir, wspd,
      tmpk, dwpk,
      relh, mixr, theta, thetae, wetbulb, vtmp };
  
    // Height
    if (d.hght === undefined)
      d.hght = altitudeISAByPres(d.pres);
  
    // Wind
    if (d.u === undefined &&
      d.v === undefined &&
      d.wdir !== undefined &&
      d.wspd !== undefined) {
      d.u = -d.wspd * Math.sin(d.wdir / 180 * Math.PI);
      d.v = -d.wspd * Math.cos(d.wdir / 180 * Math.PI);
    }
    else if (d.u !== undefined &&
           d.v !== undefined &&
           d.wdir === undefined &&
           d.wspd === undefined) {
      d.wspd = Math.sqrt(Math.pow(d.u, 2) + Math.pow(d.v, 2));
      d.wdir = 270 - (Math.atan2(d.v, d.u) / Math.PI * 180);
    }
  
    // Humidity
    if (d.tmpk !== undefined &&
      d.dwpk !== undefined) {
    //if (d.relh === undefined)
    //  meteoJS.calc.;
    //if (d.mixr === undefined)
    //  d.mixr = meteoJS.calc;
      if (d.theta === undefined)
        d.theta = potentialTempByTempAndPres(d.tmpk, d.pres);
      if (d.thetae === undefined)
        d.thetae =
        equiPotentialTempByTempAndDewpointAndPres(d.tmpk, d.dwpk, d.pres);
    }
    else if (d.mixr !== undefined) {
      if (d.dwpk === undefined)
        d.dwpk = dewpointByHMRAndPres(d.mixr, d.pres);
    }
  
    return d;
  }

  /**
   * Removes the Data for a certain level (if existing).
   * 
   * @param {float} pres - Remove the data at this Level [hPa].
   * @returns {module:meteoJS/sounding.Sounding} this.
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
   * @param {float} pres - Level [hPa].
   * @returns {module:meteoJS/sounding~levelData|undefined}
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
   * @returns {module:meteoJS/sounding~levelData[]} Array of all the data.
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
export default Sounding;