const assert = require("assert");
import Variable from '../../../src/meteoJS/modelviewer/Variable.js';
import VariableCollection
  from '../../../src/meteoJS/modelviewer/VariableCollection.js';
import { VariableCollection as VariableCollectionClass }
  from '../../../src/meteoJS/modelviewer/VariableCollection.js';

describe('Default VariableCollection, import via default', () => {
  describe('Triggered events', () => {
    let addCounter = 0;
    let removeCounter = 0;
    let a = new Variable({ id: 'a' });
    let b = new Variable({ id: 'b' });
    let vars = new VariableCollection();
    vars.on('add:variable', v => addCounter++);
    vars.on('remove:variable', v => removeCounter++);
    vars.append(a).append(b).remove(a);
    it('event counters', () => {
      assert.equal(addCounter, 2);
      assert.equal(removeCounter, 1);
    });
  });
  describe('empty object', () => {
    let vars = new VariableCollection();
    let v = vars.getItemById('NotExistant');
    assert.ok(v instanceof Variable);
  });
  describe('inherited methods', () => {
    let vars = new VariableCollection({
      names: {
        de: 'de-Test',
        en: 'en-Test'
      }
    });
    it('names', () => {
      assert.equal(vars.name, 'de-Test');
      assert.equal(vars.getNameByLang('en'), 'en-Test');
    });
    it('collection', () => {
      vars.append(new Variable());
      assert.equal(vars.count, 1);
      assert.equal(vars.variables.length, 1);
    });
  });
  it('id', () => {
    let vars = new VariableCollection({ id: 'test' });
    assert.equal(vars.id, 'test');
    vars.id = 'test2';
    assert.equal(vars.id, 'test2');
  });
  it('append ', () => {
    let vars = new VariableCollection();
    let v = new Variable();
    vars.append(v);
    assert.equal(vars.count, 1);
    assert.equal(vars.variables.length, 1);
    assert.ok(v.variableCollection === vars);
  });
});
describe('VariableCollection class, import via name', () => {
  describe('simple', () => {
    let a = new Variable({ id: 'a' });
    let b = new Variable({ id: 'b' });
    let vars = new VariableCollectionClass();
    vars.append(a,b);
    it('count', () => {
      assert.equal(vars.count, 2);
    });
  });
});