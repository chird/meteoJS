const assert = require("assert");
import TimeVariable from '../../../src/meteoJS/modelviewer/TimeVariable.js';
import { TimeVariable as TimeVariableClass }
  from '../../../src/meteoJS/modelviewer/TimeVariable.js';

describe('TimeVariable class, import via default', () => {
  let d1 = new Date('2019-09-12T00:00:00');
  let d2 = new Date('2018-01-10T00:00:00');
  describe('empty constructor', () => {
    it('empty id/datetime', () => {
      let tv = new TimeVariable();
      assert.equal(tv.id, undefined, 'id');
      assert.equal(tv.datetime, undefined, 'datetime');
    });
    it('set datetime', () => {
      let tv = new TimeVariable();
      tv.datetime = d1;
      assert.equal(tv.id, d1.valueOf(), 'id');
      assert.equal(tv.datetime, d1, 'datetime');
    });
    it('set id with valueOf(), empty again', () => {
      let tv = new TimeVariable();
      tv.id = d2.valueOf();
      assert.equal(tv.id, d2.valueOf(), 'id');
      assert.equal(tv.datetime.valueOf(), d2.valueOf(), 'datetime');
      tv.datetime = undefined;
      assert.equal(tv.id, undefined, 'id');
      assert.equal(tv.datetime, undefined, 'datetime');
    });
  });
  describe('constructor with datetime', () => {
    it('construction', () => {
      let tv2 = new TimeVariable({
        datetime: d1
      });
      assert.equal(tv2.id, d1.valueOf(), 'id');
      assert.equal(tv2.datetime.valueOf(), d1.valueOf(), 'datetime');
    });
  });
  describe('constructor with datetime and id', () => {
    it('construction', () => {
      let tv3 = new TimeVariable({
        id: d1.valueOf(),
        datetime: d2
      });
      assert.equal(tv3.id, d2.valueOf(), 'id');
      assert.equal(tv3.datetime.valueOf(), d2.valueOf(), 'datetime');
    });
  });
  describe('constructor with id', () => {
    it('construction', () => {
      let tv4 = new TimeVariable({
        id: d1.valueOf()
      });
      assert.equal(tv4.id, d1.valueOf(), 'id');
      assert.equal(tv4.datetime.valueOf(), d1.valueOf(), 'datetime');
    });
  });
  it('named', () => {
    let v1 = new TimeVariable({
      name: 'Test'
    });
    assert.equal(v1.name, 'Test', 'name');
    let v2 = new TimeVariable({
      name: 'Test',
      names: {
        'de': 'Test-DE'
      }
    });
    assert.equal(v2.name, 'Test-DE', 'name');
  });
});
describe('TimeVariable class, import via name', () => {
  it('simple', () => {
    let d = new Date('2019-10-02T10:00:00')
    let tv = new TimeVariableClass({
      datetime: d
    });
    assert.equal(tv.datetime, d, 'datetime');
  });
});