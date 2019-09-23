const assert = require("assert");
import TimeVariable from '../../../src/meteoJS/modelviewer/TimeVariable.js';

describe('TimeVariable class, import via default', () => {
  let d1 = new Date('2019-09-12T00:00:00');
  let d2 = new Date('2018-01-10T00:00:00');
  describe('empty constructor', () => {
    describe('empty id/datetime', () => {
      let tv = new TimeVariable();
      it('id', () =>  {
        assert.equal(tv.id, undefined);
      });
      it('datetime', () =>  {
        assert.equal(tv.datetime, undefined);
      });
    });
    describe('set datetime', () => {
      let tv = new TimeVariable();
      tv.datetime = d1;
      it('id', () => {
        assert.equal(tv.id, d1.valueOf())
      });
      it('datetime', () => {
        assert.equal(tv.datetime, d1);
      });
    });
    it('set id with valueOf(), empty again', () => {
      let tv = new TimeVariable();
      tv.id = d2.valueOf();
      assert.equal(tv.id, d2.valueOf());
      assert.equal(tv.datetime.valueOf(), d2.valueOf());
      tv.datetime = undefined;
      assert.equal(tv.id, undefined);
      assert.equal(tv.datetime, undefined);
    });
  });
  describe('constructor with datetime', () => {
    let tv2 = new TimeVariable({
      datetime: d1
    });
    it('id=d1', () => {
      assert.equal(tv2.id, d1.valueOf());
    });
    it('datetime=d1', () => {
      assert.equal(tv2.datetime.valueOf(), d1.valueOf());
    });
  });
  describe('constructor with datetime and id', () => {
    let tv3 = new TimeVariable({
      id: d1.valueOf(),
      datetime: d2
    });
    it('id=d2', () => {
      assert.equal(tv3.id, d2.valueOf());
    });
    it('datetime=d2', () => {
      assert.equal(tv3.datetime.valueOf(), d2.valueOf());
    });
  });
  describe('constructor with id', () => {
    let tv4 = new TimeVariable({
      id: d1.valueOf()
    });
    it('id=d1', () => {
      assert.equal(tv4.id, d1.valueOf());
    });
    it('datetime=d1', () => {
      assert.equal(tv4.datetime.valueOf(), d1.valueOf());
    });
  });
});