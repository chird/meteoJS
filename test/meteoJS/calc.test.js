QUnit.test("namespace", function (assert) {
  assert.ok(meteoJS.calc, "namespace 'meteoJS.calc' exists"); 
});
QUnit.test("altitudeISAByPres", function (assert) {
  assert.equal(meteoJS.calc.altitudeISAByPres(undefined), undefined,
    "undefined => undefined");
  assert.equal(meteoJS.calc.altitudeISAByPres(NaN), undefined,
    "NaN => undefined");
  assert.equal(meteoJS.calc.altitudeISAByPres("abc"), undefined,
    "abc => undefined");
  assert.equal(meteoJS.calc.altitudeISAByPres(0), 44330.769,
    "0 hPa");
  assert.equal(meteoJS.calc.altitudeISAByPres(1000), 110.90297084654266,
    "1000 hPa");
  assert.equal(meteoJS.calc.altitudeISAByPres(100), 15799.409730301008,
    "100 hPa");
  assert.equal(meteoJS.calc.altitudeISAByPres(850), 1457.5393962417284,
    "850 hPa");
});
QUnit.test("pressureISAByAltitude", function (assert) {
  assert.equal(meteoJS.calc.pressureISAByAltitude(undefined), undefined,
    "undefined => undefined");
  assert.equal(meteoJS.calc.pressureISAByAltitude(NaN), undefined,
    "NaN => undefined");
  assert.equal(meteoJS.calc.pressureISAByAltitude("abc"), undefined,
    "abc => undefined");
  assert.equal(meteoJS.calc.pressureISAByAltitude(100), 1001.296366796469,
    "100 m");
  assert.equal(meteoJS.calc.pressureISAByAltitude(16000), 96.36029976983998,
    "16 km");
  assert.equal(meteoJS.calc.pressureISAByAltitude(1500), 845.5855482103158,
    "1500 m");
});
QUnit.test("potentialTempByTempAndPres", function (assert) {
  assert.equal(meteoJS.calc.potentialTempByTempAndPres(undefined, undefined), undefined,
    "undefined => undefined");
  assert.equal(meteoJS.calc.potentialTempByTempAndPres(NaN, NaN), undefined,
    "NaN => undefined");
  assert.equal(meteoJS.calc.potentialTempByTempAndPres(0, 1000), 0,
    "0,1000");
  assert.equal(meteoJS.calc.potentialTempByTempAndPres(10, 1000), 10,
    "10,1000");
  assert.equal(meteoJS.calc.potentialTempByTempAndPres(-.5, 1000), -.5,
    "-0.5,1000");
  assert.equal(meteoJS.calc.potentialTempByTempAndPres(-20, 500), -24.38510188152606,
    "-20,500");
  assert.equal(meteoJS.calc.potentialTempByTempAndPres(2, 500), 2.4385101881526063,
    "2,500");
});
QUnit.test("tempByPotentialTempAndPres", function (assert) {
  assert.equal(meteoJS.calc.tempByPotentialTempAndPres(undefined, undefined), undefined,
    "undefined => undefined");
  assert.equal(meteoJS.calc.tempByPotentialTempAndPres(NaN, NaN), undefined,
    "NaN => undefined");
});
QUnit.test("tempByEquiPotTempAndPres", function (assert) {
  assert.equal(meteoJS.calc.tempByEquiPotTempAndPres(undefined, undefined), undefined,
    "undefined => undefined");
  assert.equal(meteoJS.calc.tempByEquiPotTempAndPres(NaN, NaN), undefined,
    "NaN => undefined");
});
QUnit.test("dewpointByHMRAndPres", function (assert) {
  assert.equal(meteoJS.calc.dewpointByHMRAndPres(undefined, undefined), undefined,
    "undefined => undefined");
  assert.equal(meteoJS.calc.dewpointByHMRAndPres(NaN, NaN), undefined,
    "NaN => undefined");
});
QUnit.test("wetbulbTempByTempAndDewpointAndPres", function (assert) {
  assert.equal(meteoJS.calc.wetbulbTempByTempAndDewpointAndPres(undefined, undefined, undefined), undefined,
    "undefined => undefined");
  assert.equal(meteoJS.calc.wetbulbTempByTempAndDewpointAndPres(NaN, NaN, NaN), undefined,
    "NaN => undefined");
  assert.equal(meteoJS.calc.wetbulbTempByTempAndDewpointAndPres(1.3+273.15, 0.5+273.15, 976.6), 1.0+273.15,
    "(1.3°C, 0.5°C, 976.6hPa) => 1.0°C");
});
QUnit.test("equiPotentialTempByTempAndDewpointAndPres", function (assert) {
  assert.equal(meteoJS.calc.equiPotentialTempByTempAndDewpointAndPres(undefined, undefined, undefined), undefined,
    "undefined => undefined");
  assert.equal(meteoJS.calc.equiPotentialTempByTempAndDewpointAndPres(NaN, NaN, NaN), undefined,
    "NaN => undefined");
});
QUnit.test("saturationPressureByTemp", function (assert) {
  assert.equal(meteoJS.calc.saturationPressureByTemp(undefined), undefined,
    "undefined => undefined");
  assert.equal(meteoJS.calc.saturationPressureByTemp(NaN), undefined,
    "NaN => undefined");
});
QUnit.test("saturationHMRByTempAndPres", function (assert) {
  assert.equal(meteoJS.calc.saturationHMRByTempAndPres(undefined, undefined), undefined,
    "undefined => undefined");
  assert.equal(meteoJS.calc.saturationHMRByTempAndPres(NaN, NaN), undefined,
    "NaN => undefined");
});
QUnit.test("lclByPotentialTempAndHMR", function (assert) {
  assert.equal(meteoJS.calc.lclByPotentialTempAndHMR(undefined, undefined), undefined,
    "undefined => undefined");
  assert.equal(meteoJS.calc.lclByPotentialTempAndHMR(NaN, NaN), undefined,
    "NaN => undefined");
  assert.equal(meteoJS.calc.lclByPotentialTempAndHMR(0, 0), 103.56640625,
    "NaN => undefined");
  assert.equal(meteoJS.calc.lclByPotentialTempAndHMR(10, 20), 1009.43359375,
    "NaN => undefined");
});
QUnit.test("lclTemperatureByTempAndDewpoint", function (assert) {
  assert.equal(meteoJS.calc.lclTemperatureByTempAndDewpoint(undefined, undefined), undefined,
    "undefined => undefined");
  assert.equal(meteoJS.calc.lclTemperatureByTempAndDewpoint(NaN, NaN), undefined,
    "NaN => undefined");
});
QUnit.test("tempCelsiusToKelvin", function (assert) {
  assert.equal(meteoJS.calc.tempCelsiusToKelvin(undefined), undefined,
    "undefined => undefined");
  assert.equal(meteoJS.calc.tempCelsiusToKelvin(NaN), undefined,
    "NaN => undefined");
});
QUnit.test("tempKelvinToCelsius", function (assert) {
  assert.equal(meteoJS.calc.tempKelvinToCelsius(undefined), undefined,
    "undefined => undefined");
  assert.equal(meteoJS.calc.tempKelvinToCelsius(NaN), undefined,
    "NaN => undefined");
});
QUnit.test("windspeedMSToKMH", function (assert) {
  assert.equal(meteoJS.calc.windspeedMSToKMH(undefined), undefined,
    "undefined => undefined");
  assert.equal(meteoJS.calc.windspeedMSToKMH(NaN), undefined,
    "NaN => undefined");
});
QUnit.test("windspeedKMHToMS", function (assert) {
  assert.equal(meteoJS.calc.windspeedKMHToMS(undefined), undefined,
    "undefined => undefined");
  assert.equal(meteoJS.calc.windspeedKMHToMS(NaN), undefined,
    "NaN => undefined");
  assert.equal(meteoJS.calc.windspeedKMHToMS(meteoJS.calc.windspeedMSToKMH(5)), 5,
    "5 m/s => km/h => 5 m/s");
});
QUnit.test("windspeedMSToKN", function (assert) {
  assert.equal(meteoJS.calc.windspeedMSToKN(undefined), undefined,
    "undefined => undefined");
  assert.equal(meteoJS.calc.windspeedMSToKN(NaN), undefined,
    "NaN => undefined");
});
QUnit.test("windspeedKNToMS", function (assert) {
  assert.equal(meteoJS.calc.windspeedKNToMS(undefined), undefined,
    "undefined => undefined");
  assert.equal(meteoJS.calc.windspeedKNToMS(NaN), undefined,
    "NaN => undefined");
  assert.equal(meteoJS.calc.windspeedKNToMS(meteoJS.calc.windspeedMSToKN(5)), 5,
    "5 m/s => kn => 5 m/s");
});
QUnit.test("windspeedMSToBF", function (assert) {
  assert.equal(meteoJS.calc.windspeedMSToBF(undefined), undefined,
    "undefined => undefined");
  assert.equal(meteoJS.calc.windspeedMSToBF(NaN), undefined,
    "NaN => undefined");
  assert.equal(
    Math.round(meteoJS.calc.windspeedMSToBF(10)*10)/10,
    5.2,
    "10 m/s => 5.2 Bf");
  assert.equal(
    Math.round(meteoJS.calc.windspeedMSToBF(40)*10)/10,
    12,
    "40 m/s => 12 Bf");
});
QUnit.test("windspeedBFToMS", function (assert) {
  assert.equal(meteoJS.calc.windspeedBFToMS(undefined), undefined,
    "undefined => undefined");
  assert.equal(meteoJS.calc.windspeedBFToMS(NaN), undefined,
    "NaN => undefined");
  assert.equal(
    Math.round(meteoJS.calc.windspeedBFToMS(12)*10)/10,
    34.8,
    "12 Bf => 34.8 m/s");
  assert.equal(meteoJS.calc.windspeedBFToMS(meteoJS.calc.windspeedMSToBF(5)), 5,
    "5 m/s => Bf => 5 m/s");
});
QUnit.test("snowlineByTemp850hPaAndAltidude", function (assert) {
  assert.equal(meteoJS.calc.snowlineByTemp850hPaAndAltidude(undefined, undefined), undefined,
    "undef,undef => undefined");
  assert.equal(meteoJS.calc.snowlineByTemp850hPaAndAltidude(NaN, NaN), undefined,
    "NaN,NaN => undefined");
  assert.equal(meteoJS.calc.snowlineByTemp850hPaAndAltidude("abc", "def"), undefined,
    "abc,def => undefined");
  assert.equal(
    Math.round(meteoJS.calc.snowlineByTemp850hPaAndAltidude(meteoJS.calc.tempCelsiusToKelvin(3), 1500)*100)/100,
    1652.49,
    "3°C, 1500m");
  assert.equal(
    Math.round(meteoJS.calc.snowlineByTemp850hPaAndAltidude(meteoJS.calc.tempCelsiusToKelvin(-4), 1500)*100)/100,
    581.49,
    "-4°C, 1500m");
  assert.equal(
    Math.round(meteoJS.calc.snowlineByTemp850hPaAndAltidude(meteoJS.calc.tempCelsiusToKelvin(-4), 1600)*100)/100,
    681.34,
    "-4°C, 1600m");
  assert.equal(
    Math.round(meteoJS.calc.snowlineByTemp850hPaAndAltidude(meteoJS.calc.tempCelsiusToKelvin(-4), 1300)*100)/100,
    381.79,
    "-4°C, 1300m");
});
QUnit.test("pressureByBarometricFormula", function (assert) {
  assert.equal(meteoJS.calc.pressureByBarometricFormula(undefined, undefined, undefined), undefined,
    "undef's => undefined");
  assert.equal(meteoJS.calc.pressureByBarometricFormula(NaN, NaN, NaN), undefined,
    "NaN's => undefined");
  assert.equal(meteoJS.calc.pressureByBarometricFormula("abc", "def", "ghi"), undefined,
    "strings's => undefined");
  assert.equal(meteoJS.calc.pressureByBarometricFormula(1024, 0, 273.15), 1024,
    "Höhe 0m");
  assert.equal(meteoJS.calc.pressureByBarometricFormula(950, 1000, 273.15), 838.3205294660723,
    "Isotherm 1000 m");
  assert.equal(Math.round(meteoJS.calc.pressureByBarometricFormula(1013.25, 100, 288.15, 287.5)*1000)/1000,
    1001.295,
    "Standardatmosphäre 100 m");
  assert.equal(Math.round(meteoJS.calc.pressureByBarometricFormula(1013.25, 16000, 288.15, 184.15)*1000)/1000,
    96.340,
    "Standardatmosphäre 16 km");
  assert.equal(Math.round(meteoJS.calc.pressureByBarometricFormula(1013.25, 1500, 288.15, 278.4)*1000)/1000,
    845.572,
    "Standardatmosphäre 1500 m");
  assert.equal(meteoJS.calc.pressureByBarometricFormula(954.3, -500, 263.15, 266.4), 1017.8903862567589,
    "500 m -> Reduktion auf Meereshöhe, -10°C");
  assert.equal(meteoJS.calc.pressureByBarometricFormula(954.3, -500, 273.15, 276.4), 1015.5034127770334,
    "500 m -> Reduktion auf Meereshöhe, 0°C");
  assert.equal(meteoJS.calc.pressureByBarometricFormula(954.3, -500, 283.15, 286.4), 1013.2891061035103,
    "500 m -> Reduktion auf Meereshöhe, 10°C");
  assert.equal(meteoJS.calc.pressureByBarometricFormula(954.3, -500, 293.15, 296.4), 1011.22938945771,
    "500 m -> Reduktion auf Meereshöhe, 20°C");
  assert.equal(meteoJS.calc.pressureByBarometricFormula(954.3, -500, 303.15, 306.4), 1009.3086237305216,
    "500 m -> Reduktion auf Meereshöhe, 30°C");
});
QUnit.test("potentialTempByLCLAndHMR", function (assert) {
  assert.equal(meteoJS.calc.potentialTempByLCLAndHMR(undefined, undefined), undefined,
    "undef's => undefined");
  assert.equal(meteoJS.calc.potentialTempByLCLAndHMR(NaN, NaN), undefined,
    "NaN's => undefined");
  assert.equal(meteoJS.calc.potentialTempByLCLAndHMR("abc", "def"), undefined,
    "strings's => undefined");
  assert.equal(Math.round(meteoJS.calc.potentialTempByLCLAndHMR(700, 3)*100)/100, 293.75,
    "700 hP, 3 g/kg => ~294K");
  assert.equal(Math.round(meteoJS.calc.potentialTempByLCLAndHMR(900, 1)*100)/100,  262.70,
    "900 hP, 1 g/kg => ~263K");
  assert.equal(Math.round(meteoJS.calc.potentialTempByLCLAndHMR(500, 0.3)*100)/100, 287.21,
    "500 hP, 0.3 g/kg => ~287K");
});
QUnit.test("densityHumidAirByPressureAndTempAndRelHumidity", function (assert) {
  assert.equal(meteoJS.calc.densityHumidAirByPressureAndTempAndRelHumidity(undefined, undefined, undefined), undefined,
    "undef's => undefined");
  assert.equal(meteoJS.calc.densityHumidAirByPressureAndTempAndRelHumidity(NaN, NaN, NaN), undefined,
    "NaN's => undefined");
  assert.equal(meteoJS.calc.densityHumidAirByPressureAndTempAndRelHumidity("ab", "cd", "ef"), undefined,
    "string's => undefined");
  assert.equal(Math.round(meteoJS.calc.densityHumidAirByPressureAndTempAndRelHumidity(1013.25, meteoJS.calc.tempCelsiusToKelvin(35), 0)*1000)/1000, 1.145,
    "Trocken, Meeresoberfläche, 35°C => 1.145");
  assert.equal(Math.round(meteoJS.calc.densityHumidAirByPressureAndTempAndRelHumidity(1013.25, meteoJS.calc.tempCelsiusToKelvin(5), 0)*1000)/1000, 1.2690,
    "Trocken, Meeresoberfläche, 5°C => 1.2690");
  assert.equal(Math.round(meteoJS.calc.densityHumidAirByPressureAndTempAndRelHumidity(1013.25, meteoJS.calc.tempCelsiusToKelvin(-20), 0)*1000)/1000, 1.394,
    "Trocken, Meeresoberfläche, -20°C => 1.3943");
  assert.equal(Math.round(meteoJS.calc.densityHumidAirByPressureAndTempAndRelHumidity(1000, meteoJS.calc.tempCelsiusToKelvin(0), 0)*1000)/1000, 1.275,
    "Trocken, 1000 hPa, 0°C => 1.2754");
  assert.equal(Math.round(meteoJS.calc.densityHumidAirByPressureAndTempAndRelHumidity(900, meteoJS.calc.tempCelsiusToKelvin(0), 1)*1000)/1000, 1.145,
    "100%, 900 hPa, 0°C => 1.145");
  assert.equal(Math.round(meteoJS.calc.densityHumidAirByPressureAndTempAndRelHumidity(900, meteoJS.calc.tempCelsiusToKelvin(0), 0.5)*1000)/1000, 1.146,
    "50%, 900 hPa, 0°C => 1.146");
});