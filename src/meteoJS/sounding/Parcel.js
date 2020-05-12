/**
 * @module meteoJS/sounding/parcel
 */

/**
 * Options for the constructor.
 * 
 * @typedef {Object} module:meteoJS/sounding/parcel~options
 * @param {undefined|number} [pres=undefined]
 *   Parcel beginning pressure (mb).
 * @param {undefined|number} [tmpc=undefined]
 *   Parcel beginning temperature (C).
 * @param {undefined|number} [dwpc=undefined]
 *   Parcel beginning dewpoint (C).
 * @param {undefined|number} [ptrace=undefined]
 *   Parcel trace pressure (mb).
 * @param {undefined|number} [ttrace=undefined]
 *   Parcel trace temperature (C).
 * @param {undefined|number} [blayer=undefined]
 *   Pressure of the bottom of the layer the parcel is lifted (mb).
 * @param {undefined|number} [tlayer=undefined]
 *   Pressure of the top of the layer the parcel is lifted (mb).
 * @param {undefined|number} [lclpres=undefined]
 *   Parcel LCL (lifted condensation level) pressure (mb).
 * @param {undefined|number} [lclhght=undefined]
 *   Parcel LCL height (m AGL).
 * @param {undefined|number} [lfcpres=undefined]
 *   Parcel LFC (level of free convection) pressure (mb).
 * @param {undefined|number} [lfchght=undefined]
 *   Parcel LFC height (m AGL).
 * @param {undefined|number} [elpres=undefined]
 *   Parcel EL (equilibrium level) pressure (mb).
 * @param {undefined|number} [elhght=undefined]
 *   Parcel EL height (m AGL).
 * @param {undefined|number} [mplpres=undefined]
 *   Maximum Parcel Level (mb).
 * @param {undefined|number} [mplhght=undefined]
 *   Maximum Parcel Level (m AGL).
 * @param {undefined|number} [bplus=undefined]
 *   Parcel CAPE (J/kg).
 * @param {undefined|number} [bminus=undefined]
 *   Parcel CIN (J/kg).
 * @param {undefined|number} [bfzl=undefined]
 *   Parcel CAPE up to freezing level (J/kg).
 * @param {undefined|number} [b3km=undefined]
 *   Parcel CAPE up to 3 km (J/kg).
 * @param {undefined|number} [b6km=undefined]
 *   Parcel CAPE up to 6 km (J/kg).
 * @param {undefined|number} [p0c=undefined]
 *   Pressure value at 0 C  (mb).
 * @param {undefined|number} [pm10c=undefined]
 *   Pressure value at -10 C (mb).
 * @param {undefined|number} [pm20c=undefined]
 *   Pressure value at -20 C (mb).
 * @param {undefined|number} [pm30c=undefined]
 *   Pressure value at -30 C (mb).
 * @param {undefined|number} [hght0c=undefined]
 *   Height value at 0 C (m AGL).
 * @param {undefined|number} [hghtm10c=undefined]
 *   Height value at -10 C (m AGL).
 * @param {undefined|number} [hghtm20c=undefined]
 *   Height value at -20 C (m AGL).
 * @param {undefined|number} [hghtm30c=undefined]
 *   Height value at -30 C (m AGL).
 * @param {undefined|number} [wm10c=undefined]
 *   Wet bulb velocity at -10 C.
 * @param {undefined|number} [wm20c=undefined]
 *   Wet bulb velocity at -20 C.
 * @param {undefined|number} [wm30c=undefined]
 *   Wet bulb at -30 C.
 * @param {undefined|number} [li5=undefined]
 *   Lifted Index at 500 mb (C).
 * @param {undefined|number} [li3=undefined]
 *   Lifted Index at 300 mb (C).
 * @param {undefined|number} [brnshear=undefined]
 *   Bulk Richardson Number Shear.
 * @param {undefined|number} [brnu=undefined]
 *   Bulk Richardson Number U (kts).
 * @param {undefined|number} [brnv=undefined]
 *   Bulk Richardson Number V (kts).
 * @param {undefined|number} [brn=undefined]
 *   Bulk Richardson Number (unitless).
 * @param {undefined|number} [limax=undefined]
 *   Maximum Lifted Index (C).
 * @param {undefined|number} [limaxpres=undefined]
 *   Pressure at Maximum Lifted Index (mb).
 * @param {undefined|number} [cap=undefined]
 *   Cap Strength (C).
 * @param {undefined|number} [cappres=undefined]
 *   Cap strength pressure (mb).
 * @param {undefined|number} [bmin=undefined]
 *   Buoyancy minimum in profile (C).
 * @param {undefined|number} [bminpres=undefined]
 *   Buoyancy minimum pressure (mb).
 */

/**
 * Class representing a parcel lifting.
 */
export class Parcel {
  
  /**
   * @param {module:meteoJS/sounding/parcel~options} [options] - Options.
   */
  constructor({
    pres = undefined,
    tempc = undefined,
    dwpc = undefined,
    ptrace = undefined,
    ttrace = undefined,
    blayer = undefined,
    tlayer = undefined,
    lclpres = undefined,
    lclhght = undefined,
    lfcpres = undefined,
    lfchght = undefined,
    elpres = undefined,
    elhght = undefined,
    mplpres = undefined,
    mplhght = undefined,
    bplus = undefined,
    bminus = undefined,
    bfzl = undefined,
    b3km = undefined,
    b6km = undefined,
    p0c = undefined,
    pm10c = undefined,
    pm20c = undefined,
    pm30c = undefined,
    hght0c = undefined,
    hghtm10c = undefined,
    hghtm20c = undefined,
    hghtm30c = undefined,
    wm10c = undefined,
    wm20c = undefined,
    wm30c = undefined,
    li5 = undefined,
    li3 = undefined,
    brnshear = undefined,
    brnu = undefined,
    brnv = undefined,
    limax = undefined,
    limaxpres = undefined,
    cap = undefined,
    cappres = undefined,
    bmin = undefined,
    bminpres = undefined
  } = {}) {
    
    /**
     * @type undefined|number
     * @public
     */
    this.pres = pres;
    
    /**
     * @type undefined|number
     * @public
     */
    this.tempc = tempc;
    
    /**
     * @type undefined|number
     * @public
     */
    this.dwpc = dwpc;
    
    /**
     * @type undefined|number
     * @public
     */
    this.ptrace = ptrace;
    
    /**
     * @type undefined|number
     * @public
     */
    this.ttrace = ttrace;
    
    /**
     * @type undefined|number
     * @public
     */
    this.blayer = blayer;
    
    /**
     * @type undefined|number
     * @public
     */
    this.tlayer = tlayer;
    
    /**
     * @type undefined|number
     * @public
     */
    this.lclpres = lclpres;
    
    /**
     * @type undefined|number
     * @public
     */
    this.lclhght = lclhght;
    
    /**
     * @type undefined|number
     * @public
     */
    this.lfcpres = lfcpres;
    
    /**
     * @type undefined|number
     * @public
     */
    this.lfchght = lfchght;
    
    /**
     * @type undefined|number
     * @public
     */
    this.elpres = elpres;
    
    /**
     * @type undefined|number
     * @public
     */
    this.elhght = elhght;
    
    /**
     * @type undefined|number
     * @public
     */
    this.mplpres = mplpres;
    
    /**
     * @type undefined|number
     * @public
     */
    this.mplhght = mplhght;
    
    /**
     * @type undefined|number
     * @public
     */
    this.bplus = bplus;
    
    /**
     * @type undefined|number
     * @public
     */
    this.bminus = bminus;
    
    /**
     * @type undefined|number
     * @public
     */
    this.bfzl = bfzl;
    
    /**
     * @type undefined|number
     * @public
     */
    this.b3km = b3km;
    
    /**
     * @type undefined|number
     * @public
     */
    this.b6km = b6km;
    
    /**
     * @type undefined|number
     * @public
     */
    this.p0c = p0c;
    
    /**
     * @type undefined|number
     * @public
     */
    this.pm10c = pm10c;
    
    /**
     * @type undefined|number
     * @public
     */
    this.pm20c = pm20c;
    
    /**
     * @type undefined|number
     * @public
     */
    this.pm30c = pm30c;
    
    /**
     * @type undefined|number
     * @public
     */
    this.hght0c = hght0c;
    
    /**
     * @type undefined|number
     * @public
     */
    this.hghtm10c = hghtm10c;
    
    /**
     * @type undefined|number
     * @public
     */
    this.hghtm20c = hghtm20c;
    
    /**
     * @type undefined|number
     * @public
     */
    this.hghtm30c = hghtm30c;
    
    /**
     * @type undefined|number
     * @public
     */
    this.wm10c = wm10c;
    
    /**
     * @type undefined|number
     * @public
     */
    this.wm20c = wm20c;
    
    /**
     * @type undefined|number
     * @public
     */
    this.wm30c = wm30c;
    
    /**
     * @type undefined|number
     * @public
     */
    this.li5 = li5;
    
    /**
     * @type undefined|number
     * @public
     */
    this.li3 = li3;
    
    /**
     * @type undefined|number
     * @public
     */
    this.brnshear = brnshear;
    
    /**
     * @type undefined|number
     * @public
     */
    this.brnu = brnu;
    
    /**
     * @type undefined|number
     * @public
     */
    this.brnv = brnv;
    
    /**
     * @type undefined|number
     * @public
     */
    this.limax = limax;
    
    /**
     * @type undefined|number
     * @public
     */
    this.limaxpres = limaxpres;
    
    /**
     * @type undefined|number
     * @public
     */
    this.cap = cap;
    
    /**
     * @type undefined|number
     * @public
     */
    this.cappres = cappres;
    
    /**
     * @type undefined|number
     * @public
     */
    this.bmin = bmin;
    
    /**
     * @type undefined|number
     * @public
     */
    this.bminpres = bminpres;
  }
}
export default Parcel;