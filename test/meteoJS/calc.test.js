import assert from 'assert';
import { altitudeISAByPres,
         pressureISAByAltitude,
         potentialTempByTempAndPres,
         tempByPotentialTempAndPres,
         tempByEquiPotTempAndPres,
         dewpointByHMRAndPres,
         wetbulbTempByTempAndDewpointAndPres,
         equiPotentialTempByTempAndDewpointAndPres,
         saturationPressureByTemp,
         saturationHMRByTempAndPres,
         lclByPotentialTempAndHMR,
         lclTemperatureByTempAndDewpoint,
         tempCelsiusToKelvin,
         tempKelvinToCelsius,
         windspeedMSToKMH,
         windspeedKMHToMS,
         windspeedMSToKN,
         windspeedKNToMS,
         windspeedMSToBF,
         windspeedBFToMS,
         snowlineByTemp850hPaAndAltidude,
         pressureByBarometricFormula,
         potentialTempByLCLAndHMR,
         densityHumidAirByPressureAndTempAndRelHumidity } from '../../src/meteoJS/calc.js';

it('altitudeISAByPres', () => {
  assert.equal(altitudeISAByPres(undefined), undefined,
    "undefined => undefined");
  assert.equal(altitudeISAByPres(NaN), undefined,
    "NaN => undefined");
  assert.equal(altitudeISAByPres("abc"), undefined,
    "abc => undefined");
  assert.equal(altitudeISAByPres(0), 44330.769,
    "0 hPa");
  assert.equal(altitudeISAByPres(1000), 110.90297084654266,
    "1000 hPa");
  assert.equal(altitudeISAByPres(100), 15799.409730301008,
    "100 hPa");
  assert.equal(altitudeISAByPres(850), 1457.5393962417284,
    "850 hPa");
});
it('pressureISAByAltitude', () => {
  assert.equal(pressureISAByAltitude(undefined), undefined,
    "undefined => undefined");
  assert.equal(pressureISAByAltitude(NaN), undefined,
    "NaN => undefined");
  assert.equal(pressureISAByAltitude("abc"), undefined,
    "abc => undefined");
  assert.equal(pressureISAByAltitude(100), 1001.296366796469,
    "100 m");
  assert.equal(pressureISAByAltitude(16000), 96.36029976983998,
    "16 km");
  assert.equal(pressureISAByAltitude(1500), 845.5855482103158,
    "1500 m");
});
it('potentialTempByTempAndPres', () => {
  assert.equal(potentialTempByTempAndPres(undefined, undefined), undefined,
    "undefined => undefined");
  assert.equal(potentialTempByTempAndPres(NaN, NaN), undefined,
    "NaN => undefined");
  assert.equal(potentialTempByTempAndPres(0, 1000), 0,
    "0,1000");
  assert.equal(potentialTempByTempAndPres(10, 1000), 10,
    "10,1000");
  assert.equal(potentialTempByTempAndPres(-.5, 1000), -.5,
    "-0.5,1000");
  assert.equal(potentialTempByTempAndPres(-20, 500), -24.38510188152606,
    "-20,500");
  assert.equal(potentialTempByTempAndPres(2, 500), 2.4385101881526063,
    "2,500");
});
it('tempByPotentialTempAndPres', () => {
  assert.equal(tempByPotentialTempAndPres(undefined, undefined), undefined,
    "undefined => undefined");
  assert.equal(tempByPotentialTempAndPres(NaN, NaN), undefined,
    "NaN => undefined");
});
it('tempByEquiPotTempAndPres', () => {
  assert.equal(tempByEquiPotTempAndPres(undefined, undefined), undefined,
    "undefined => undefined");
  assert.equal(tempByEquiPotTempAndPres(NaN, NaN), undefined,
    "NaN => undefined");
});
it('dewpointByHMRAndPres', () => {
  assert.equal(dewpointByHMRAndPres(undefined, undefined), undefined,
    "undefined => undefined");
  assert.equal(dewpointByHMRAndPres(NaN, NaN), undefined,
    "NaN => undefined");
});
it('wetbulbTempByTempAndDewpointAndPres', () => {
  assert.equal(wetbulbTempByTempAndDewpointAndPres(undefined, undefined, undefined), undefined,
    "undefined => undefined");
  assert.equal(wetbulbTempByTempAndDewpointAndPres(NaN, NaN, NaN), undefined,
    "NaN => undefined");
  assert.equal(wetbulbTempByTempAndDewpointAndPres(1.3+273.15, 0.5+273.15, 976.6), 1.0+273.15,
    "(1.3°C, 0.5°C, 976.6hPa) => 1.0°C");
});
it('equiPotentialTempByTempAndDewpointAndPres', () => {
  assert.equal(equiPotentialTempByTempAndDewpointAndPres(undefined, undefined, undefined), undefined,
    "undefined => undefined");
  assert.equal(equiPotentialTempByTempAndDewpointAndPres(NaN, NaN, NaN), undefined,
    "NaN => undefined");
});
it('saturationPressureByTemp', () => {
  assert.equal(saturationPressureByTemp(undefined), undefined,
    "undefined => undefined");
  assert.equal(saturationPressureByTemp(NaN), undefined,
    "NaN => undefined");
});
it('saturationHMRByTempAndPres', () => {
  assert.equal(saturationHMRByTempAndPres(undefined, undefined), undefined,
    "undefined => undefined");
  assert.equal(saturationHMRByTempAndPres(NaN, NaN), undefined,
    "NaN => undefined");
});
it('lclByPotentialTempAndHMR', () => {
  assert.equal(lclByPotentialTempAndHMR(undefined, undefined), undefined,
    "undefined => undefined");
  assert.equal(lclByPotentialTempAndHMR(NaN, NaN), undefined,
    "NaN => undefined");
  assert.equal(lclByPotentialTempAndHMR(0, 0), 103.56640625,
    "NaN => undefined");
  assert.equal(lclByPotentialTempAndHMR(10, 20), 1009.43359375,
    "NaN => undefined");
});
it('lclTemperatureByTempAndDewpoint', () => {
  assert.equal(lclTemperatureByTempAndDewpoint(undefined, undefined), undefined,
    "undefined => undefined");
  assert.equal(lclTemperatureByTempAndDewpoint(NaN, NaN), undefined,
    "NaN => undefined");
});
it('tempCelsiusToKelvin', () => {
  assert.equal(tempCelsiusToKelvin(undefined), undefined,
    "undefined => undefined");
  assert.equal(tempCelsiusToKelvin(NaN), undefined,
    "NaN => undefined");
});
it('tempKelvinToCelsius', () => {
  assert.equal(tempKelvinToCelsius(undefined), undefined,
    "undefined => undefined");
  assert.equal(tempKelvinToCelsius(NaN), undefined,
    "NaN => undefined");
});
it('windspeedMSToKMH', () => {
  assert.equal(windspeedMSToKMH(undefined), undefined,
    "undefined => undefined");
  assert.equal(windspeedMSToKMH(NaN), undefined,
    "NaN => undefined");
});
it('windspeedKMHToMS', () => {
  assert.equal(windspeedKMHToMS(undefined), undefined,
    "undefined => undefined");
  assert.equal(windspeedKMHToMS(NaN), undefined,
    "NaN => undefined");
  assert.equal(windspeedKMHToMS(windspeedMSToKMH(5)), 5,
    "5 m/s => km/h => 5 m/s");
});
it('windspeedMSToKN', () => {
  assert.equal(windspeedMSToKN(undefined), undefined,
    "undefined => undefined");
  assert.equal(windspeedMSToKN(NaN), undefined,
    "NaN => undefined");
});
it('windspeedKNToMS', () => {
  assert.equal(windspeedKNToMS(undefined), undefined,
    "undefined => undefined");
  assert.equal(windspeedKNToMS(NaN), undefined,
    "NaN => undefined");
  assert.equal(windspeedKNToMS(windspeedMSToKN(5)), 5,
    "5 m/s => kn => 5 m/s");
});
it('windspeedMSToBF', () => {
  assert.equal(windspeedMSToBF(undefined), undefined,
    "undefined => undefined");
  assert.equal(windspeedMSToBF(NaN), undefined,
    "NaN => undefined");
  assert.equal(
    Math.round(windspeedMSToBF(10)*10)/10,
    5.2,
    "10 m/s => 5.2 Bf");
  assert.equal(
    Math.round(windspeedMSToBF(40)*10)/10,
    12,
    "40 m/s => 12 Bf");
});
it('windspeedBFToMS', () => {
  assert.equal(windspeedBFToMS(undefined), undefined,
    "undefined => undefined");
  assert.equal(windspeedBFToMS(NaN), undefined,
    "NaN => undefined");
  assert.equal(
    Math.round(windspeedBFToMS(12)*10)/10,
    34.8,
    "12 Bf => 34.8 m/s");
  assert.equal(windspeedBFToMS(windspeedMSToBF(5)), 5,
    "5 m/s => Bf => 5 m/s");
});
it('snowlineByTemp850hPaAndAltidude', () => {
  assert.equal(snowlineByTemp850hPaAndAltidude(undefined, undefined), undefined,
    "undef,undef => undefined");
  assert.equal(snowlineByTemp850hPaAndAltidude(NaN, NaN), undefined,
    "NaN,NaN => undefined");
  assert.equal(snowlineByTemp850hPaAndAltidude("abc", "def"), undefined,
    "abc,def => undefined");
  assert.equal(
    Math.round(snowlineByTemp850hPaAndAltidude(tempCelsiusToKelvin(3), 1500)*100)/100,
    1652.49,
    "3°C, 1500m");
  assert.equal(
    Math.round(snowlineByTemp850hPaAndAltidude(tempCelsiusToKelvin(-4), 1500)*100)/100,
    581.49,
    "-4°C, 1500m");
  assert.equal(
    Math.round(snowlineByTemp850hPaAndAltidude(tempCelsiusToKelvin(-4), 1600)*100)/100,
    681.34,
    "-4°C, 1600m");
  assert.equal(
    Math.round(snowlineByTemp850hPaAndAltidude(tempCelsiusToKelvin(-4), 1300)*100)/100,
    381.79,
    "-4°C, 1300m");
});
it('pressureByBarometricFormula', () => {
  assert.equal(pressureByBarometricFormula(undefined, undefined, undefined), undefined,
    "undef's => undefined");
  assert.equal(pressureByBarometricFormula(NaN, NaN, NaN), undefined,
    "NaN's => undefined");
  assert.equal(pressureByBarometricFormula("abc", "def", "ghi"), undefined,
    "strings's => undefined");
  assert.equal(pressureByBarometricFormula(1024, 0, 273.15), 1024,
    "Höhe 0m");
  assert.equal(pressureByBarometricFormula(950, 1000, 273.15), 838.3205294660723,
    "Isotherm 1000 m");
  assert.equal(Math.round(pressureByBarometricFormula(1013.25, 100, 288.15, 287.5)*1000)/1000,
    1001.295,
    "Standardatmosphäre 100 m");
  assert.equal(Math.round(pressureByBarometricFormula(1013.25, 16000, 288.15, 184.15)*1000)/1000,
    96.340,
    "Standardatmosphäre 16 km");
  assert.equal(Math.round(pressureByBarometricFormula(1013.25, 1500, 288.15, 278.4)*1000)/1000,
    845.572,
    "Standardatmosphäre 1500 m");
  assert.equal(pressureByBarometricFormula(954.3, -500, 263.15, 266.4), 1017.8903862567589,
    "500 m -> Reduktion auf Meereshöhe, -10°C");
  assert.equal(pressureByBarometricFormula(954.3, -500, 273.15, 276.4), 1015.5034127770334,
    "500 m -> Reduktion auf Meereshöhe, 0°C");
  assert.equal(pressureByBarometricFormula(954.3, -500, 283.15, 286.4), 1013.2891061035103,
    "500 m -> Reduktion auf Meereshöhe, 10°C");
  assert.equal(pressureByBarometricFormula(954.3, -500, 293.15, 296.4), 1011.22938945771,
    "500 m -> Reduktion auf Meereshöhe, 20°C");
  assert.equal(pressureByBarometricFormula(954.3, -500, 303.15, 306.4), 1009.3086237305216,
    "500 m -> Reduktion auf Meereshöhe, 30°C");
});
it('potentialTempByLCLAndHMR', () => {
  assert.equal(potentialTempByLCLAndHMR(undefined, undefined), undefined,
    "undef's => undefined");
  assert.equal(potentialTempByLCLAndHMR(NaN, NaN), undefined,
    "NaN's => undefined");
  assert.equal(potentialTempByLCLAndHMR("abc", "def"), undefined,
    "strings's => undefined");
  assert.equal(Math.round(potentialTempByLCLAndHMR(700, 3)*100)/100, 293.75,
    "700 hP, 3 g/kg => ~294K");
  assert.equal(Math.round(potentialTempByLCLAndHMR(900, 1)*100)/100,  262.70,
    "900 hP, 1 g/kg => ~263K");
  assert.equal(Math.round(potentialTempByLCLAndHMR(500, 0.3)*100)/100, 287.21,
    "500 hP, 0.3 g/kg => ~287K");
});
it('densityHumidAirByPressureAndTempAndRelHumidity', () => {
  assert.equal(densityHumidAirByPressureAndTempAndRelHumidity(undefined, undefined, undefined), undefined,
    "undef's => undefined");
  assert.equal(densityHumidAirByPressureAndTempAndRelHumidity(NaN, NaN, NaN), undefined,
    "NaN's => undefined");
  assert.equal(densityHumidAirByPressureAndTempAndRelHumidity("ab", "cd", "ef"), undefined,
    "string's => undefined");
  assert.equal(Math.round(densityHumidAirByPressureAndTempAndRelHumidity(1013.25, tempCelsiusToKelvin(35), 0)*1000)/1000, 1.145,
    "Trocken, Meeresoberfläche, 35°C => 1.145");
  assert.equal(Math.round(densityHumidAirByPressureAndTempAndRelHumidity(1013.25, tempCelsiusToKelvin(5), 0)*1000)/1000, 1.2690,
    "Trocken, Meeresoberfläche, 5°C => 1.2690");
  assert.equal(Math.round(densityHumidAirByPressureAndTempAndRelHumidity(1013.25, tempCelsiusToKelvin(-20), 0)*1000)/1000, 1.394,
    "Trocken, Meeresoberfläche, -20°C => 1.3943");
  assert.equal(Math.round(densityHumidAirByPressureAndTempAndRelHumidity(1000, tempCelsiusToKelvin(0), 0)*1000)/1000, 1.275,
    "Trocken, 1000 hPa, 0°C => 1.2754");
  assert.equal(Math.round(densityHumidAirByPressureAndTempAndRelHumidity(900, tempCelsiusToKelvin(0), 1)*1000)/1000, 1.145,
    "100%, 900 hPa, 0°C => 1.145");
  assert.equal(Math.round(densityHumidAirByPressureAndTempAndRelHumidity(900, tempCelsiusToKelvin(0), 0.5)*1000)/1000, 1.146,
    "50%, 900 hPa, 0°C => 1.146");
});