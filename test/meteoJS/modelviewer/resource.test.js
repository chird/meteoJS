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
  it('isDefinedBy', () => {
    let r = new Resource({
      variables: [v1, v2]
    });
    assert.equal(r.variables.length, 2, 'resources is defined by 2 variables');
    assert.ok(r.isDefinedBy(v1), 'defined by v1');
    assert.ok(r.isDefinedBy(v1, v2), 'defined by v1 and v2');
    assert.ok(!r.isDefinedBy(v3), 'not defined by v3');
    assert.ok(!r.isDefinedBy(v1, v3), 'not defined by v1 and v3');
  });
  it('isDefinedByVariableOf', () => {
    let models = new VariableCollection({ id: 'models' });
    models.append(v1, v2);
    let runs = new VariableCollection({ id: 'runs' });
    runs.append(v1, v2);
    let levels = new VariableCollection({ id: 'levels' });
    let r = new Resource({
      variables: [v1, v3]
    });
    assert.ok(r.isDefinedByVariableOf(models), 'resource defined by a model');
    assert.ok(r.isDefinedByVariableOf(runs), 'resource defined by a run');
    assert.ok(!r.isDefinedByVariableOf(levels), 'resource not defined by a level');
  });
});
describe('Resource class, import via name', () => {
  it('simple', () => {
    let r = new Resource();
    assert.equal(r.variables.length, 0, 'defined by no variable');
  });
});