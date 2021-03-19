const assert = require("assert");
import Variable from '../../../src/meteoJS/modelviewer/Variable.js';
import VariableCollection from '../../../src/meteoJS/modelviewer/VariableCollection.js';
import Resource from '../../../src/meteoJS/modelviewer/Resource.js';
import { Resource as ResourceClass } from '../../../src/meteoJS/modelviewer/Resource.js';

describe('Resource class, import via default', () => {
  let v1 = new Variable({ id: 'modelA' });
  let v2 = new Variable({ id: 'modelB' });
  let v3 = new Variable({ id: 'runA' });
  let v4 = new Variable({ id: 'runB' });
  let models = new VariableCollection({ id: 'models' });
  models.append(v1, v2);
  let runs = new VariableCollection({ id: 'runs' });
  runs.append(v3, v4);
  let levels = new VariableCollection({ id: 'levels' });
  it('check other objects', () => {
    assert.equal(models.getVariableById('modelA').id, 'modelA', 'models');
    assert.equal(models.getVariableById('modelB').id, 'modelB', 'models');
    assert.equal(models.getVariableById('runA').id, undefined, 'models');
    assert.equal(models.getVariableById('runB').id, undefined, 'models');
    assert.equal(runs.getVariableById('modelA').id, undefined, 'runs');
    assert.equal(runs.getVariableById('modelB').id, undefined, 'runs');
    assert.equal(runs.getVariableById('runA').id, 'runA', 'runs');
    assert.equal(runs.getVariableById('runB').id, 'runB', 'runs');
  });
  it('variables', () => {
    let r = new Resource({
      variables: [v1, v2, v3, v4]
    });
    assert.equal(r.variables.length, 2, 'length');
    assert.ok(r.variables[0] instanceof Variable, 'instanceof 0');
    assert.ok(r.variables[1] instanceof Variable, 'instanceof 1');
  });
  it('getVariableByVariableCollection', () => {
    let r1 = new Resource({
      variables: [v1, v3]
    });
    assert.ok(r1.getVariableByVariableCollection(models) instanceof Variable, 'instanceof');
    assert.equal(r1.getVariableByVariableCollection(models).id, 'modelA', 'models');
    assert.ok(r1.getVariableByVariableCollection(runs) instanceof Variable, 'instanceof');
    assert.equal(r1.getVariableByVariableCollection(runs).id, 'runA', 'runs');
    assert.ok(r1.getVariableByVariableCollection(levels) instanceof Variable, 'instanceof');
    assert.equal(r1.getVariableByVariableCollection(levels).id, undefined, 'levels');
  });
  it('isDefinedBy', () => {
    let r = new Resource({
      variables: [v1, v3]
    });
    assert.equal(r.variables.length, 2, 'resources is defined by 2 variables');
    assert.ok(r.isDefinedBy(v1), 'defined by v1');
    assert.ok(r.isDefinedBy(false, v1), 'defined by v1');
    assert.ok(!r.isDefinedBy(true, v1), 'not exactly defined by v1');
    assert.ok(!r.isDefinedBy(v1, v2), 'not defined by v1 and v2');
    assert.ok(r.isDefinedBy(v1, v3), 'defined by v1 and v3');
    assert.ok(!r.isDefinedBy(false, v1, v2), 'not defined by v1 and v2');
    assert.ok(r.isDefinedBy(false, v1, v3), 'defined by v1 and v3');
    assert.ok(!r.isDefinedBy(true, v1, v2), 'not exactly defined by v1 and v2');
    assert.ok(r.isDefinedBy(true, v1, v3), 'exactly defined by v1 and v3');
    assert.ok(!r.isDefinedBy(v2), 'not defined by v2');
    assert.ok(!r.isDefinedBy(false, v2), 'not defined by v2');
    assert.ok(!r.isDefinedBy(true, v2), 'not exactly defined by v2');
  });
  it('isDefinedByVariableOf', () => {
    let r = new Resource({
      variables: [v1, v3]
    });
    assert.ok(r.isDefinedByVariableOf(models), 'resource defined by a model');
    assert.ok(r.isDefinedByVariableOf(runs), 'resource defined by a run');
    assert.ok(!r.isDefinedByVariableOf(levels), 'resource not defined by a level');
  });
  describe('run/offset', () => {
    let d1 = new Date('2019-10-02T00:00:00');
    let d2 = new Date('2018-01-01T00:00:00');
    let d3 = new Date('2019-10-03T00:00:00');
    it('empty constructor', () => {
      let r = new Resource();
      assert.equal(r.datetime, undefined, 'datetime');
      assert.equal(r.run, undefined, 'run');
      assert.equal(r.offset, undefined, 'offset');
      r.datetime = d1;
      assert.equal(r.datetime, d1, 'datetime');
      assert.equal(r.run, undefined, 'run');
      assert.equal(r.offset, undefined, 'offset');
    });
    it('construct with datetime', () => {
      let r = new Resource({
        datetime: d1
      });
      assert.equal(r.datetime, d1, 'datetime');
      assert.equal(r.run, undefined, 'run');
      assert.equal(r.offset, undefined, 'offset');
    });
    it('construct with run/offset', () => {
      let r = new Resource({
        run: d1,
        offset: 24*3600
      });
      assert.equal(r.datetime.valueOf(), d3.valueOf(), 'datetime');
      assert.equal(r.run, d1, 'run');
      assert.equal(r.offset, 86400, 'offset');
    });
    it('construct with run', () => {
      let r = new Resource({
        run: d1
      });
      assert.equal(r.datetime, undefined, 'datetime');
      assert.equal(r.run, d1, 'run');
      assert.equal(r.offset, undefined, 'offset');
      r.offset = 24*3600;
      assert.equal(r.datetime.valueOf(), d3.valueOf(), 'datetime');
      assert.equal(r.run, d1, 'run');
      assert.equal(r.offset, 86400, 'offset');
    });
    it('construct with offset', () => {
      let r = new Resource({
        offset: 24*3600
      });
      assert.equal(r.datetime, undefined, 'datetime');
      assert.equal(r.run, undefined, 'run');
      assert.equal(r.offset, 86400, 'offset');
      r.run = d1;
      assert.equal(r.datetime.valueOf(), d3.valueOf(), 'datetime');
      assert.equal(r.run, d1, 'run');
      assert.equal(r.offset, 86400, 'offset');
    });
  });
});
describe('Resource class, import via name', () => {
  it('simple', () => {
    let r = new Resource();
    assert.equal(r.variables.length, 0, 'defined by no variable');
  });
});