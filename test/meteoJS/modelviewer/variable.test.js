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
});
describe('Variable class, import via name', () => {
  describe('simple', () => {
    it('id is a', () => {
      let u = new Variable({ id: 'a' });
      assert.equal(u.id, 'a');
    });
  });
});