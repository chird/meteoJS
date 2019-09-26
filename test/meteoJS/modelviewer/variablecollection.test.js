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
    assert.ok(v.variableCollection === vars);
  });
  it('children', () => {
    let appendCounter = 0;
    let vc1 = new VariableCollection({ id: '1' });
    vc1.on('append:child', child => {
      appendCounter++;
    });
    let vc2 = new VariableCollection({ id: '2' });
    let vc3 = new VariableCollection({ id: '3' });
    vc1.appendChild(vc2).appendChild(vc3);
    assert.equal(vc1.children.length, 2, 'vc1 has 2 children');
    assert.equal(appendCounter, 2, 'two append events');
    assert.ok(vc1.children[0] === vc2, 'first child is vc2');
    assert.ok(vc1.children[1] === vc3, 'last child is vc3');
    assert.equal(vc2.parents.length, 1, 'vc2 has one parent');
    assert.ok(vc2.parents[0] === vc1, 'vc2\'s parent is vc1');
    assert.equal(vc3.parents.length, 1, 'vc3 has one parent');
    assert.ok(vc3.parents[0] === vc1, 'vc3\'s parent is vc1');
    vc1.removeChild(vc2).removeChild(vc3);
    assert.equal(vc1.children.length, 0, 'vc1 has no children');
    assert.equal(vc2.parents.length, 0, 'vc2 has no parent');
    assert.equal(vc3.parents.length, 0, 'vc3 has no parent');
    vc1.appendChild(vc2, vc3);
    assert.equal(vc1.children.length, 2, 'vc1 has 2 children');
    assert.equal(appendCounter, 4, 'another two append events');
    vc1.removeChild(vc2, vc3);
    assert.equal(vc1.children.length, 0, 'vc1 has no children');
  });
  it('parents', () => {
    let vc1 = new VariableCollection({ id: '1' });
    let vc2 = new VariableCollection({ id: '2' });
    let vc3 = new VariableCollection({ id: '3' });
    vc1._addParent(vc2);
    assert.equal(vc1.parents.length, 1);
    vc1._addParent(vc3);
    assert.equal(vc1.parents.length, 2);
    assert.ok(vc1.parents[0] === vc2, 'first parent is vc2');
    assert.ok(vc1.parents[1] === vc3, 'last parent is vc3');
    vc1._removeParent(vc2);
    assert.equal(vc1.parents.length, 1);
    assert.ok(vc1.parents[0] === vc3, 'first parent is vc3');
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