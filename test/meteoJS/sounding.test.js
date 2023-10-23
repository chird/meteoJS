import assert from 'assert';
import Sounding from '../../src/meteoJS/Sounding.js';
import Parcel from '../../src/meteoJS/sounding/Parcel.js';

it('Empty object', () => {
  let sounding = new Sounding();
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
it('Simple sounding data', () => {
  let sounding = new Sounding();
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
it('Simple sounding data (with calc missing)', () => {
  let sounding = new Sounding();
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
  let checkData = {
    800: {
      pres: 800,
      hght: 1949.3,
      tmpk: 268,
      dwpk: 268,
      wdir: 345,
      wspd: 10,
      u: 2.6,
      v: -9.7,
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
      u: -0,
      v: -1,
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
      u: -2.1,
      v: -2.1,
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
    let data = sounding.getData(level);
    Object.keys(data).forEach(function (k) {
      if (data[k] !== undefined)
        data[k] = Math.round(data[k]*10)/10;
    });
    assert.deepEqual(data, checkData[level], "data@"+level+"Pa");
  });
});
it('Simple sounding data with addLevels', () => {
  let sounding = new Sounding();
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
it('Default calculate missing', () => {
  let sounding = new Sounding({ calcMissing: true });
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
describe('Sounding with parcels', () => {
  it('no parcels', () => {
    let sounding = new Sounding();
    assert.equal(sounding.parcelCollection.count, 0, 'count');
  });
  it('on construction', () => {
    let p1 = new Parcel({ id: 'p1' });
    let p2 = new Parcel({ id: 'p2' });
    let p3 = new Parcel({ id: 'p1' });
    let sounding1 = new Sounding({ parcels: [ p1, p2 ] });
    assert.equal(sounding1.parcelCollection.count, 2, 'count');
    assert.ok(sounding1.parcelCollection.contains(p1), 'contains');
    assert.ok(sounding1.parcelCollection.contains(p2), 'contains');
    assert.ok(!sounding1.parcelCollection.contains(p3), 'contains');
    let testParcels = [ p1, p2 ];
    for (let p of sounding1.parcelCollection)
      assert.equal(p, testParcels.shift(), 'equal');
    let sounding2 = new Sounding({ parcels: [ p1, p2, p3 ] });
    assert.equal(sounding2.parcelCollection.count, 2, 'count');
    assert.ok(!sounding2.parcelCollection.contains(p1), 'contains');
    assert.ok(sounding2.parcelCollection.contains(p2), 'contains');
    assert.ok(sounding2.parcelCollection.contains(p3), 'contains');
    testParcels = [ p2, p3 ];
    for (let p of sounding2.parcelCollection)
      assert.equal(p, testParcels.shift(), 'equal');
  });
  it('runtime manipulation', () => {
    let addCounter = 0;
    let removeCounter = 0;
    let replaceCounter = 0;
    let sounding = new Sounding();
    sounding.parcelCollection.on('add:item', () => addCounter++);
    sounding.parcelCollection.on('remove:item', () => removeCounter++);
    sounding.parcelCollection.on('replace:item', () => replaceCounter++);
    assert.equal(sounding.parcelCollection.count, 0, 'count');
    let p1 = new Parcel({ id: 'p1' });
    sounding.parcelCollection.append(p1);
    assert.equal(sounding.parcelCollection.count, 1, 'count');
    assert.ok(sounding.parcelCollection.contains(p1), 'contains');
    assert.ok(sounding.parcelCollection.containsId('p1'), 'containsId');
    let p2 = new Parcel({ id: 'p2' });
    sounding.parcelCollection.append(p2);
    assert.equal(sounding.parcelCollection.count, 2, 'count');
    assert.ok(sounding.parcelCollection.contains(p2), 'contains');
    assert.ok(sounding.parcelCollection.containsId('p2'), 'containsId');
    sounding.parcelCollection.append(p2);
    assert.equal(sounding.parcelCollection.count, 2, 'count');
    assert.ok(sounding.parcelCollection.contains(p2), 'contains');
    assert.ok(sounding.parcelCollection.containsId('p2'), 'containsId');
    let p3 = new Parcel({ id: 'p2' });
    sounding.parcelCollection.append(p3);
    assert.equal(sounding.parcelCollection.count, 2, 'count');
    assert.ok(sounding.parcelCollection.contains(p3), 'contains');
    assert.ok(sounding.parcelCollection.containsId('p2'), 'containsId');
    assert.equal(addCounter, 3, 'addCounter');
    assert.equal(removeCounter, 1, 'removeCounter');
    assert.equal(replaceCounter, 0, 'replaceCounter');
  });
});