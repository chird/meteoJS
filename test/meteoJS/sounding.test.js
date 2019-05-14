QUnit.test("Empty object", function (assert) {
  var sounding = new meteoJS.sounding();
  assert.equal(sounding.getLevels().length, 0, "Keine Daten");
  assert.deepEqual(sounding.getData(), {
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
  }, "Empty level data");
  assert.deepEqual(sounding.getData(1000), {
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
  }, "Empty level data");
  sounding.removeLevel();
  sounding.removeLevel(1000);
  assert.equal(sounding.getNearestLevel(950), undefined, "Kein nächstes Level");
});
QUnit.test("Simple sounding data", function (assert) {
  var sounding = new meteoJS.sounding();
  sounding.addLevel({
    pres: 900,
    tmpk: 273.15,
    dwpk: 263.15,
    wdir: 0,
    wspd: 1
  })
  .addLevel({
    pres: 1000,
    tmpk: 283.15,
    dwpk: 277,
    wdir: 45,
    wspd: 3
  })
  .addLevel({
    pres: 800,
    tmpk: 268,
    dwpk: 268,
    wdir: 355,
    wspd: 10
  });
  assert.equal(sounding.getLevels().length, 3, "3 Levels mit Daten");
  assert.deepEqual(sounding.getLevels(), [800, 900, 1000], "getLevels() Sortierung");
  assert.deepEqual(sounding.getData(), {
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
  }, "Empty level data");
  assert.deepEqual(sounding.getData(700), {
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
  }, "Empty level data @700hPa");
  assert.deepEqual(sounding.getData(800), {
    pres: 800,
    tmpk: 268,
    dwpk: 268,
    wdir: 355,
    wspd: 10
  }, "data@800hPa");
  assert.equal(sounding.getNearestLevel(975), 1000, "975hPa -> 1000hPa");
  sounding.removeLevel();
  assert.equal(sounding.getLevels().length, 3, "3 Levels mit Daten");
  sounding.removeLevel(1000);
  assert.equal(sounding.getLevels().length, 2, "3 Levels mit Daten");
  assert.equal(sounding.getNearestLevel(975), 900, "975hPa -> 900hPa");
});
QUnit.test("Simple sounding data (with calc missing)", function (assert) {
  var sounding = new meteoJS.sounding();
  sounding.addLevel({
    pres: 900,
    tmpk: 273.15,
    dwpk: 263.15,
    wdir: 0,
    wspd: 1
  }, { calcMissing: true })
  .addLevel({
    pres: 1000,
    tmpk: 283.15,
    dwpk: 277,
    wdir: 45,
    wspd: 3
  }, { calcMissing: true })
  .addLevel({
    pres: 800,
    tmpk: 268,
    dwpk: 268,
    wdir: 345,
    wspd: 10
  }, { calcMissing: true });
  var checkData = {
    800: {
      pres: 800,
      hght: 1949.3,
      tmpk: 268,
      dwpk: 268,
      wdir: 345,
      wspd: 10,
      u: -2.6,
      v: 9.7,
      relh: undefined,
      mixr: undefined,
      theta: 285.7,
      thetae: 294.4,
      wetbulb: undefined,
      vtmp: undefined
    },
    900: {
      pres: 900,
      hght: 988.7,
      tmpk: 273.2,
      dwpk: 263.2,
      wdir: 0,
      wspd: 1,
      u: 0,
      v: 1,
      relh: undefined,
      mixr: undefined,
      theta: 281.5,
      thetae: 286.9,
      wetbulb: undefined,
      vtmp: undefined
    },
    1000: {
      pres: 1000,
      hght: 110.9,
      tmpk: 283.2,
      dwpk: 277,
      wdir: 45,
      wspd: 3,
      u: 2.1,
      v: 2.1,
      relh: undefined,
      mixr: undefined,
      theta: 283.2,
      thetae: 296.3,
      wetbulb: undefined,
      vtmp: undefined
    }
  };
  assert.equal(sounding.getLevels().length, 3, "3 Levels mit Daten");
  sounding.getLevels().forEach(function (level) {
    var data = sounding.getData(level);
    Object.keys(data).forEach(function (k) {
      if (data[k] !== undefined)
        data[k] = Math.round(data[k]*10)/10;
    });
    assert.deepEqual(data, checkData[level], "data@"+level+"Pa");
  });
});
QUnit.test("Simple sounding data with addLevels", function (assert) {
  var sounding = new meteoJS.sounding();
  sounding.addLevels([{
    pres: 900,
    tmpk: 273.15,
    dwpk: 263.15,
    wdir: 0,
    wspd: 1
  }, {
    pres: 1000,
    tmpk: 283.15,
    dwpk: 277,
    wdir: 45,
    wspd: 3
  }, {
    pres: 800,
    tmpk: 268,
    dwpk: 268,
    wdir: 345,
    wspd: 10
  }]);
  assert.equal(sounding.getLevels().length, 3, "3 Levels mit Daten");
  sounding.getLevels().forEach(function (level) {
    assert.equal(Object.keys(sounding.getData(level)).length, 5, "Anzahl Keys in data@"+level+"Pa");
  });
});
QUnit.test("Default calculate missing", function (assert) {
  var sounding = new meteoJS.sounding({ calcMissing: true });
  sounding.addLevels([{
    pres: 900,
    tmpk: 273.15,
    dwpk: 263.15,
    wdir: 0,
    wspd: 1
  }, {
    pres: 1000,
    tmpk: 283.15,
    dwpk: 277,
    wdir: 45,
    wspd: 3
  }, {
    pres: 800,
    tmpk: 268,
    dwpk: 268,
    wdir: 345,
    wspd: 10
  }]);
  assert.equal(sounding.getLevels().length, 3, "3 Levels mit Daten");
  sounding.getLevels().forEach(function (level) {
    assert.equal(Object.keys(sounding.getData(level)).length, 14, "Anzahl Keys in data@"+level+"Pa");
  });
});