const assert = require("assert");
import Variable from '../../../src/meteoJS/modelviewer/Variable.js';
import VariableCollection
  from '../../../src/meteoJS/modelviewer/VariableCollection.js';
import { VariableCollection as VariableCollectionClass }
  from '../../../src/meteoJS/modelviewer/VariableCollection.js';

describe('Default VariableCollection, import via default', () => {
  it('Triggered events', () => {
    let addCounter = 0;
    let removeCounter = 0;
    let a = new Variable({ id: 'a' });
    let b = new Variable({ id: 'b' });
    let vars = new VariableCollection();
    vars.on('add:variable', v => addCounter++);
    vars.on('remove:variable', v => removeCounter++);
    vars.append(a).append(b).remove(a);
    assert.equal(addCounter, 2, 'addCounter');
    assert.equal(removeCounter, 1, 'removeCounter');
  });
  it('empty object', () => {
    let vars = new VariableCollection();
    let v = vars.getItemById('NotExistant');
    assert.ok(v instanceof Variable, 'instanceof');
    let v1 = vars.getVariableById('NotExistant');
    assert.ok(v1 instanceof Variable, 'instanceof');
  });
  it('inherited methods', () => {
    let vars = new VariableCollection({
      names: {
        de: 'de-Test',
        en: 'en-Test'
      }
    });
    assert.equal(vars.name, 'de-Test', 'name');
    assert.equal(vars.getNameByLang('en'), 'en-Test', 'getNameByLang(\'en\')');
    vars.append(new Variable());
    assert.equal(vars.count, 1, 'count');
    assert.equal(vars.variables.length, 1, 'length');
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
  it('simple', () => {
    let a = new Variable({ id: 'a' });
    let b = new Variable({ id: 'b' });
    let vars = new VariableCollectionClass();
    vars.append(a,b);
    assert.equal(vars.count, 2, 'count');
  });
});