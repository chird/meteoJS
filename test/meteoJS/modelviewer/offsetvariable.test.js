const assert = require("assert");
import OffsetVariable from '../../../src/meteoJS/modelviewer/OffsetVariable.js';
import { OffsetVariable as OffsetVariableClass }
  from '../../../src/meteoJS/modelviewer/OffsetVariable.js';

describe('OffsetVariable class, import via default', () => {
  let d1 = new Date('2019-10-02T00:00:00');
  let d2 = new Date('2018-01-01T00:00:00');
  let d3 = new Date('2019-10-03T00:00:00');
  describe('empty constructor', () => {
    it('empty id/datetime', () => {
      let offset = new OffsetVariable();
      assert.equal(offset.id, undefined, 'id');
      assert.equal(offset.datetime, undefined, 'datetime');
      assert.equal(offset.run, undefined, 'run');
      assert.equal(offset.offset, undefined, 'offset');
    });
    it('set datetime', () => {
      let offset = new OffsetVariable();
      offset.datetime = d1;
      assert.equal(offset.id, d1.valueOf(), 'id');
      assert.equal(offset.datetime, d1, 'datetime');
      assert.equal(offset.run, undefined, 'run');
      assert.equal(offset.offset, undefined, 'offset');
    });
    it('set id with valueOf(), empty again', () => {
      let offset = new OffsetVariable();
      offset.id = d2.valueOf();
      assert.equal(offset.id, d2.valueOf(), 'id');
      assert.equal(offset.datetime.valueOf(), d2.valueOf(), 'datetime');
      assert.equal(offset.run, undefined, 'run');
      assert.equal(offset.offset, undefined, 'offset');
      offset.datetime = undefined;
      assert.equal(offset.id, undefined, 'id');
      assert.equal(offset.datetime, undefined, 'datetime');
      assert.equal(offset.run, undefined, 'run');
      assert.equal(offset.offset, undefined, 'offset');
    });
  });
  describe('constructor with datetime', () => {
    it('construction', () => {
      let offset = new OffsetVariable({
        datetime: d1
      });
      assert.equal(offset.id, d1.valueOf(), 'id');
      assert.equal(offset.datetime, d1, 'datetime');
      assert.equal(offset.run, undefined, 'run');
      assert.equal(offset.offset, undefined, 'offset');
    });
  });
  describe('constructor with datetime and id', () => {
    it('construction', () => {
      let offset = new OffsetVariable({
        id: d1.valueOf(),
        datetime: d2
      });
      assert.equal(offset.id, d2.valueOf(), 'id');
      assert.equal(offset.datetime, d2, 'datetime');
      assert.equal(offset.run, undefined, 'run');
      assert.equal(offset.offset, undefined, 'offset');
    });
  });
  describe('constructor with id', () => {
    it('construction', () => {
      let offset = new OffsetVariable({
        id: d1.valueOf()
      });
      assert.equal(offset.id, d1.valueOf(), 'id');
      assert.equal(offset.datetime.valueOf(), d1.valueOf(), 'datetime');
      assert.equal(offset.run, undefined, 'run');
      assert.equal(offset.offset, undefined, 'offset');
    });
  });
  describe('constructor with run/offset', () => {
    it('run/offset', () => {
      let offset = new OffsetVariable({
        run: d1,
        offset: 24*3600
      });
      assert.equal(offset.id, d3.valueOf(), 'id');
      assert.equal(offset.datetime.valueOf(), d3.valueOf(), 'datetime');
      assert.equal(offset.run, d1, 'run');
      assert.equal(offset.offset, 86400, 'offset');
    });
    it('run', () => {
      let offset = new OffsetVariable({
        run: d1
      });
      assert.equal(offset.id, undefined, 'id');
      assert.equal(offset.datetime, undefined, 'datetime');
      assert.equal(offset.run, d1, 'run');
      assert.equal(offset.offset, undefined, 'offset');
      offset.offset = 24*3600;
      assert.equal(offset.id, d3.valueOf(), 'id');
      assert.equal(offset.datetime.valueOf(), d3.valueOf(), 'datetime');
      assert.equal(offset.run, d1, 'run');
      assert.equal(offset.offset, 86400, 'offset');
    });
    it('offset', () => {
      let offset = new OffsetVariable({
        offset: 24*3600
      });
      assert.equal(offset.id, undefined, 'id');
      assert.equal(offset.datetime, undefined, 'datetime');
      assert.equal(offset.run, undefined, 'run');
      assert.equal(offset.offset, 86400, 'offset');
      offset.run = d1;
      assert.equal(offset.id, d3.valueOf(), 'id');
      assert.equal(offset.datetime.valueOf(), d3.valueOf(), 'datetime');
      assert.equal(offset.run, d1, 'run');
      assert.equal(offset.offset, 86400, 'offset');
    });
  });
  it('named', () => {
    let v1 = new OffsetVariable({
      name: 'Test'
    });
    assert.equal(v1.name, 'Test', 'name');
    let v2 = new OffsetVariable({
      name: 'Test',
      names: {
        'de': 'Test-DE'
      }
    });
    assert.equal(v2.name, 'Test', 'name');
    assert.equal(v2.getNameByLang(), 'Test-DE', 'getNameByLang()');
  });
});
describe('OffsetVariable class, import via name', () => {
  it('simple', () => {
    let offset = new OffsetVariableClass({
      run: new Date('2019-10-02T10:00:00'),
      offset: 24*3600
    });
    assert.equal(offset.datetime.valueOf(), (new Date('2019-10-03T10:00:00')).valueOf(), 'datetime');
  });
});