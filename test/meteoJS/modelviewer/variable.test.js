const assert = require("assert");
import Variable from '../../../src/meteoJS/modelviewer/Variable.js';
import { Variable as VariableClass } from '../../../src/meteoJS/modelviewer/Variable.js';

describe('Variable class, import via default', () => {
  it('class with set id', () => {
    let u = new Variable({
      id: 'a'
    });
    assert.equal(u.id, 'a','id is a');
  });
  it('VariableCollection', () => {
    class VariableCollection {};
    let vc = new VariableCollection();
    let v = new Variable({
      variableCollection: vc
    });
    assert.ok(v.variableCollection instanceof VariableCollection, 'instanceof');
    v.variableCollection = undefined;
    assert.equal(v.variableCollection, undefined, 'undefined');
    v.variableCollection = vc;
    assert.ok(v.variableCollection instanceof VariableCollection, 'instanceof');
  });
  it('named', () => {
    let v1 = new Variable({
      name: 'Test'
    });
    assert.equal(v1.name, 'Test', 'name');
    let v2 = new Variable({
      name: 'Test',
      names: {
        'de': 'Test-DE'
      }
    });
    assert.equal(v2.name, 'Test-DE', 'name');
  });
});
describe('Variable class, import via name', () => {
  it('simple', () => {
    let u = new Variable({ id: 'a' });
    assert.equal(u.id, 'a');
  });
});