const assert = require("assert");
import Variable from '../../../src/meteoJS/modelviewer/Variable.js';
import { Variable as VariableClass } from '../../../src/meteoJS/modelviewer/Variable.js';

describe('Variable class, import via default', () => {
  describe('class with set id', () => {
    let u = new Variable({
      id: 'a'
    });
    it('id is a', () => {
      assert.equal(u.id, 'a');
    });
  });
  describe('VariableCollection', () => {
    class VariableCollection {};
    let vc = new VariableCollection();
    let v = new Variable({
      variableCollection: vc
    });
    it('instance tests', () => {
      assert.ok(v.variableCollection instanceof VariableCollection);
      v.variableCollection = undefined;
      assert.equal(v.variableCollection, undefined);
      v.variableCollection = vc;
      assert.ok(v.variableCollection instanceof VariableCollection);
    });
  });
});
describe('Variable class, import via name', () => {
  describe('simple', () => {
    it('id is a', () => {
      let u = new Variable({ id: 'a' });
      assert.equal(u.id, 'a');
    });
  });
});