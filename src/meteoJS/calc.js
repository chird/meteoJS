/**
 * @module meteoJS/calc
 */

/**
 * Umrechnung eines Luftdrucks zur entsprechenden Höhe in der
 * Internationalen Standard-Atmosphäre (ISA).
 * 
 * Formel ist gültig bis 11 km Höhe
 * (https://de.wikipedia.org/wiki/Barometrische_H%C3%B6henformel#Internationale_H.C3.B6henformel)
 * 
 * @static
 * @public
 * @param {number|undefined} p Luftdruck [hPa]
 * @return {number|undefined} Höhe in der Standard-Atmosphäre [m ü.M.]
 */
export function altitudeISAByPres(p) {
  if (p === undefined ||
      isNaN(p))
    return undefined;
  return 44330.769*(1 - Math.pow(p/1013.25, 0.19029496));
}

/**
 * Umrechnung einer Höhe in einen Luftdruck in der
 * Internationalen Standard-Atmosphäre (ISA).
 * 
 * Formel ist gültig bis 11 km Höhe
 * (https://de.wikipedia.org/wiki/Barometrische_H%C3%B6henformel#Internationale_H.C3.B6henformel)
 * 
 * @static
 * @public
 * @param {number|undefined} a Höhe [m ü.M.]
 * @return {number|undefined} Luftdruck in der Standard-Atmosphäre [hPa]
 */
export function pressureISAByAltitude(a) {
  if (a === undefined ||
      isNaN(a))
    return undefined;
  return 1013.25*Math.pow(1-a/44330.769, 5.255);
}

/**
 * Berechnung der potentielle Temperatur θ aus der Temperatur und des Drucks
 * eines Luftpakets.
 * 
 * Berechnung zum Normaldruck von 1000 hPa
 * (https://de.wikipedia.org/wiki/Potentielle_Temperatur#Trockenpotentielle_Temperatur)
 * 
 * @param {number|undefined} temp Temperatur [K]
 * @param {number|undefined} pres Luftdruck [hPa]
 * @return {number|undefined} Potentielle Temperatur [K]
 */
export function potentialTempByTempAndPres(temp, pres) {
  if (temp === undefined || isNaN(temp) ||
      pres === undefined || isNaN(pres))
    return undefined;
  return temp * Math.pow(1000/pres, 0.286);
}

/**
 * Berechnung der Lufttemperatur bei einem Luftdruck für ein Luftpaket mit
 * entsprechender potentiellen Temperatur.
 * 
 * Berechnung zum Normaldurck von 1000 hPa
 * 
 * @param {number|undefined} potentialTemp Potentielle Temperatur [K]
 * @param {number|undefined} pres Luftdruck [hPa]
 * @return {number|undefined} Temperatur [K]
 */
export function tempByPotentialTempAndPres(potentialTemp, pres) {
  if (potentialTemp === undefined || isNaN(potentialTemp) ||
      pres === undefined || isNaN(pres))
    return undefined;
  return potentialTemp*Math.pow(pres/1000, 0.286);
}

/**
 * Temperatur eines Luftpaktes mit Druck 'pres' und der Äquivalent potentiellen Temperatur 'thetae'.
 * 
 * @param {number|undefined} thetae Äquivalent potentielle Temperatur [K]
 * @param {number|undefined} pres Luftdruck [hPa]
 * @return {number|undefined} Temperatur [K]
 */
export function tempByEquiPotTempAndPres(thetae, pres) {
  if (pres === undefined || isNaN(pres))
    return undefined;
  var s = undefined;
  var th = undefined;
  var pcon = Math.pow(1000/pres, .286);
  var t = 273.0;
  var delta = 20;
  var i = 0;
  while (Math.abs(delta) > 0.1 && i < 100) {
    i++;
    s = saturationHMRByTempAndPres(t, pres);
    th = t * pcon * Math.exp(2.5*s/t);
    if ((th-thetae)*delta > 0.0)
      delta = -.5 * delta;
    t = t + delta;
  }
  return t;
}

/**
 * Taupunkt eines Luftpaktes über Mischungsverhältnis und Druck.
 * 
 * @param {number|undefined} hmr Mischungsverhätlnis [g/kg]
 * @param {number|undefined} pres Luftdruck [hPa]
 * @return {number|undefined} Taupunkttemperatur [K]
 */
export function dewpointByHMRAndPres(hmr, pres) {
  if (hmr === undefined || isNaN(hmr) ||
      pres === undefined || isNaN(pres))
    return undefined;
  var x = 0.4343 * Math.log(hmr * pres /(622. + hmr));
  return Math.pow(10,.0498646455 * x + 2.4082965 ) -
         7.07475 +
         38.9114 * Math.pow((Math.pow(10, .0915 * x) - 1.2035),2);
}

/**
 * Wetbulb-Temperature, Psychro-Temperature aus Temperatur, Taupunkt und Luftdruck
 * 
 * @param {number|undefined} temp Temperatur [K]
 * @param {number|undefined} dewpoint Taupunkttemperatur [K]
 * @param {number|undefined} pres Luftdruck [hPa]
 * @return {number|undefined} Wetbulb-Temperatur [K]
 */
export function wetbulbTempByTempAndDewpointAndPres(temp, dewpoint, pres) {
  if (temp === undefined || isNaN(temp) ||
      dewpoint === undefined || isNaN(dewpoint) ||
      pres === undefined || isNaN(pres))
    return undefined;
  var result = dewpoint-273.15;
  var Ediff = 1;
  var incr = 10;
  var previoussign = 1;
  var E = 6.112 * Math.exp((17.67 * result) / (result + 243.5));
  while (Math.abs(Ediff) > 0.05) {
    var Eguess = 6.112 * Math.exp((17.67 * result) / (result + 243.5)) -
                 pres * (temp-273.15 - result) * 0.00066 * (1 + (0.00115 * result));
    Ediff = E - Eguess;
    if (Ediff == 0)
      break;
    else {
      if (Ediff < 0) {
        if (-1 != previoussign) {
          previoussign = -1;
          incr = incr/10;
        }
      }
      else {
        if (1 != previoussign) {
          previoussign = 1;
          incr = incr/10;
        }
      }
    }
    if (Math.abs(Ediff) <= 0.05)
      break;
    else
      result = result + incr*previoussign;
  }
  return result+273.15;
}

/**
 * Äquivalent Potentielle Temperatur eines Luftpaktes.
 * 
 * Gemäss Formel von Holten (https://en.wikipedia.org/wiki/Equivalent_potential_temperature#Formula)
 * 
 * @param {number|undefined} temp Temperatur [K]
 * @param {number|undefined} dewpoint Taupunkts-Temperatur [K]
 * @param {number|undefined} pres Luftdruck [hPa]
 * @return {number|undefined} Äquivalent potentielle Temperatur [K]
 */
export function equiPotentialTempByTempAndDewpointAndPres(temp, dewpoint, pres) {
  var potTemp = potentialTempByTempAndPres(temp, pres);
  if (potTemp === undefined ||
      dewpoint === undefined || isNaN(dewpoint) ||
      temp === undefined || isNaN(temp) ||
      pres === undefined || isNaN(pres))
    return undefined;
  return potTemp *
    Math.exp(2481.9e-3 *
             saturationHMRByTempAndPres(dewpoint, pres) /
             lclTemperatureByTempAndDewpoint(temp, dewpoint));
}

/**
 * Berechnung des Sättigung-Dampfdrucks zu einer Temperatur
 * 
 * @param {number|undefined} temp Temperatur [K]
 * @return {number|undefined} Sättigungs-Dampfdruck [hPa]
 */
export function saturationPressureByTemp(temp) {
  if (temp === undefined || isNaN(temp))
    return undefined;
  var coef= new Array(6.1104546, 0.4442351, 1.4302099e-2, 2.6454708e-4, 3.0357098e-6, 2.0972268e-8, 6.0487594e-11,-1.469687e-13);
  var inx=0;
  // sat vap pressures every 5C from -50 to -200
  var escold= new Array(
    0.648554685769663908E-01, 0.378319512256073479E-01,
    0.222444934288790197E-01, 0.131828928424683120E-01,
    0.787402077141244848E-02, 0.473973049488473318E-02,
    0.287512035504357928E-02, 0.175743037675810294E-02,
    0.108241739518850975E-02, 0.671708939185605941E-03,
    0.419964702632039404E-03, 0.264524363863469876E-03,
    0.167847963736813220E-03, 0.107285397631620379E-03,
    0.690742634496135612E-04, 0.447940489768084267E-04,
    0.292570419563937303E-04, 0.192452912634994161E-04,
    0.127491372410747951E-04, 0.850507010275505138E-05,
    0.571340025334971129E-05, 0.386465029673876238E-05,
    0.263210971965005286E-05, 0.180491072930570428E-05,
    0.124607850555816049E-05, 0.866070571346870824E-06,
    0.605982217668895538E-06, 0.426821197943242768E-06,
    0.302616508514379476E-06, 0.215963854234913987E-06,
    0.155128954578336869E-06);

  temp = temp - 273.15;
  var retval = 0;
  //try {
  if (temp > -50.) {
    retval = ( coef[0] + temp*(coef[1] + temp*(coef[2] + temp*(coef[3] +
    temp*(coef[4] + temp*(coef[5] + temp*(coef[6] + temp*coef[7])))))));

  } else {
     var tt = (-temp - 50.)/5.;
     //var = (int) tt;
     if (inx < escold.length-1) {
       retval = escold[inx] + (tt % 1.)*(escold[inx+1]-escold[inx]);
     } else {
       retval = 1e-7;
     }
  }
 // } catch (Exception e) {
 //   GWT.log("caught exception: "+e);
  //  retval = 1e-7;
  //}
  return retval;
}

/**
 * Berechnung des Sättigungs-Mischungsverhältnisses aus Temperatur und Druck
 * 
 * HMR = humidity mixing ratio
 * 
 * @param {number|undefined} temp Temperatur [K]
 * @param {number|undefined} pres Luftdruck [hPa]
 * @return {number|undefined} Sättigungs-Mischungsverhältnis [g/kg]
 */
export function saturationHMRByTempAndPres(temp, pres) {
  var e = saturationPressureByTemp(temp);
  if (e === undefined ||
      pres === undefined || isNaN(pres))
    return undefined;
  return 621.97*e/(pres - e);
}

/**
 * Lifting Condensation Level (LCL) eines Luftpakets mit entsprechender
 * potentieller Temperatur und Mischungsverhältnis.
 * 
 * @param {number|undefined} potentialTemp Potentielle Temperatur [K]
 * @param {number|undefined} hmr Mischungsverhältnis [g/kg]
 * @return {undefined|number} LCL [hPa]
 */
export function lclByPotentialTempAndHMR(potentialTemp, hmr) {
  if (hmr === undefined || isNaN(hmr))
    return undefined;
  // Binäre Suche
  var a = 1013;
  var b = 100;
  while (a-b > 10) {
    var p = b+(a-b)/2;
    var hmrp = saturationHMRByTempAndPres(
                 tempByPotentialTempAndPres(potentialTemp, p),
                 p);
    if (hmrp === undefined)
      return undefined;
    if (hmrp < hmr)
      b = p;
    else
      a = p;
  }
  return b+(a-b)/2;
}

/**
 * Potentielle Temperatur zu einem Lifting Condensation Level (LCL) bei
 * gegebenem Mischungsverhältnis.
 * 
 * @param {number|undefined} lcl LCL [hPa]
 * @param {number|undefined} hmr Mischungsverhältnis [g/kg]
 * @return {number|undefined} Potentielle Temperatur [K]
 */
export function potentialTempByLCLAndHMR(lcl, hmr) {
  if (lcl === undefined || isNaN(lcl))
    return undefined;
  // Binäre Suche
  var a = 323;
  var b = 223;
  while (a-b > 0.1) {
    var Th = b+(a-b)/2;
    var lclTh = lclByPotentialTempAndHMR(Th, hmr);
    if (lclTh === undefined)
      return undefined;
    if (lclTh > lcl)
      b = Th;
    else
      a = Th;
  }
  return b+(a-b)/2;
}

/**
 * Temperatur eines Luftpaktes, welches zum LCL angehoben wird.
 * 
 * @param {number|undefined} temp Lufttemperatur [K]
 * @param {number|undefined} dewpoint Taupunktstemperatur [K]
 * @return {undefined|number} Temperatur [K]
 */
export function lclTemperatureByTempAndDewpoint(temp, dewpoint) {
  if (temp === undefined || isNaN(temp) ||
      dewpoint === undefined || isNaN(dewpoint))
    return undefined;
  return (dewpoint - (.001296*dewpoint - .15772)*(temp-dewpoint) );
}

/**
 * Umwandlung Temperatur von Celsius in Kelvin
 * 
 * @param {number|undefined} temp [°C]
 * @return {undefined|number} [K]
 */
export function tempCelsiusToKelvin(temp) {
  return (temp === undefined || isNaN(temp)) ? undefined : temp+273.15;
}

/**
 * Umwandlung Temperatur von Kelvin zu Celsius
 * 
 * @param {number|undefined} temp [K]
 * @return {undefined|number} [°C]
 */
export function tempKelvinToCelsius(temp) {
  return (temp === undefined || isNaN(temp)) ? undefined : temp-273.15;
}

/**
 * Umwandlung Windgeschwindigkeit von m/s in km/h
 * 
 * @param {number|undefined} wind [m/s]
 * @return {undefined|number} [km/h]
 */
export function windspeedMSToKMH(wind) {
  return (wind === undefined || isNaN(wind)) ? undefined : wind*3.6;
}

/**
 * Umwandlung Windgeschwindigkeit von km/h in m/s
 * 
 * @param {number|undefined} wind [km/h]
 * @return {undefined|number} [m/s]
 */
export function windspeedKMHToMS(wind) {
  return (wind === undefined || isNaN(wind)) ? undefined : wind/3.6;
}

/**
 * Umwandlung Windgeschwindigkeit von m/s in Knoten
 * 
 * @param {number|undefined} wind [m/s]
 * @return {undefined|number} [kn]
 */
export function windspeedMSToKN(wind) {
  return (wind === undefined || isNaN(wind)) ? undefined : wind*900/463;
}

/**
 * Umwandlung Windgeschwindigkeit von Knoten in m/s
 * 
 * @param {number|undefined} wind [kn]
 * @return {undefined|number} [m/s]
 */
export function windspeedKNToMS(wind) {
  return (wind === undefined || isNaN(wind)) ? undefined : wind*463/900;
}

/**
 * Umwandlung Windgeschwindigkeit von m/s in Beaufort
 * 
 * @param {number|undefined} wind [m/s]
 * @return {undefined|number} [bf]
 */
export function windspeedMSToBF(wind) {
  return (wind === undefined || isNaN(wind)) ?
    undefined :
    Math.min(12, Math.pow(wind/0.8360, 2/3));
}

/**
 * Umwandlung Windgeschwindigkeit von Beaufort in m/s
 * 
 * @param {number|undefined} wind [bf]
 * @return {undefined|number} [m/s
 */
export function windspeedBFToMS(wind) {
  return (wind === undefined || isNaN(wind)) ?
    undefined :
    0.8360 * Math.pow(wind, 3/2);
}

/**
 * Abschätzung der Schneefallgrenze aus Temperatur und Höhe des 850hPa-Levels
 * 
 * Formel aus Weathercalc herauskopiert.
 * 
 * @static
 * @public
 * @param {number|undefined} temp Temperatur auf 850 hPa [K]
 * @param {number|undefined} a Höhe des 850 hPa Levels [m ü.M.]
 * @return {number|undefined} Abgeschätzte Schneefallgrenze [m ü.M.]
 */
export function snowlineByTemp850hPaAndAltidude(temp, a) {
  if (temp === undefined || isNaN(temp) ||
      a === undefined || isNaN(a))
    return undefined;
  return 153.0 * tempKelvinToCelsius(temp) + 0.9985 * a - 304.26;
}

/**
 * Barometrische Höhenformel. Berechnung von Luftdruck in anderer Höhe.
 * 
 * Formel aus Wiki-Artikel https://de.wikipedia.org/wiki/Barometrische_H%C3%B6henformel
 * 
 * @static
 * @public
 * @param {number|undefined} p0 Druck auf dem Startlevel [hPa]
 * @param {number|undefined} h Höhe bis zum Ziellevel (positiv für höher über Meereslevel) [m]
 * @param {number|undefined} T0 Temperatur auf dem Startlevel [K]
 * @param {number|undefined} T1 Temperatur auf dem Ziellevel, wenn undefined
 *                              wird Isothermie angenommen [K]
 * @return {number|undefined} Luftdruck auf dem Ziellevel [hPa]
 */
export function pressureByBarometricFormula(p0, h, T0, T1) {
  if (p0 === undefined || isNaN(p0) ||
      h === undefined || isNaN(h) ||
      T0 === undefined || isNaN(T0))
    return undefined;
  if (h == 0)
    return p0;
  var M = 0.02896;
  var g = 9.807;
  var R = 8.314;
  if (T1 === undefined)
    T1 = T0;
  // Isotherme Atmosphäre
  if (T0 == T1)
    return p0 * Math.exp(-M*g/R/T0*h);
  var a = (T0 - T1)/h;
  return p0 * Math.exp(M*g/R/a*Math.log(1-a*h/T0));
}

/**
 * Dichte von feuchter Luft.
 * 
 * Formel aus Wiki-Artikel https://en.wikipedia.org/wiki/Density_of_air
 * 
 * @param {number|undefined} p Luftdruck [hPa]
 * @param {number|undefined} T Lufttemperatur [K]
 * @param {number|undefined} rh Luftfeuchtigkeit []
 * @return {number|undefined} Dichte [kg/m^3]
 */
export function densityHumidAirByPressureAndTempAndRelHumidity(p, T, rh) {
  if (p === undefined || isNaN(p) ||
      T === undefined || isNaN(T) ||
      rh === undefined || isNaN(rh))
    return undefined;
  var Rd = 287.058; // J/(kg·K)
  var Rv = 461.495; // J/(kg·K)
  var pv = saturationPressureByTemp(T)*rh;
  return (p - pv)*100/Rd/T + pv*100/Rv/T;
}