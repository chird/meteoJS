const assert = require("assert");
import Unique from '../../../src/meteoJS/base/Unique.js';
import NamedCollection from '../../../src/meteoJS/base/NamedCollection.js';
import { NamedCollection as NamedCollectionClass }
  from '../../../src/meteoJS/base/NamedCollection.js';

describe('NamedCollection class, import via default (equal to Named tests)', () => {
  it('empty constructor', () => {
    let n = new NamedCollection();
    assert.equal(n.name, '', 'name');
    assert.equal(n.getNameByLang(), '', 'getNameByLang()');
    assert.equal(n.getNameByLang('en'), '', 'getNameByLang(\'en\')');
    assert.equal(n.getNameByLang('de'), '', 'getNameByLang(\'de\')');
    assert.equal(n.getNameByLang('fr'), '', 'getNameByLang(\'fr\')');
    assert.equal(n.getNameByLang('rm'), '', 'getNameByLang(\'rm\')');
    assert.equal(n.getNameByLangNoFallback('en'), '', 'getNameByLangNoFallback(\'en\')');
    assert.equal(n.getNameByLangNoFallback('de'), '', 'getNameByLangNoFallback(\'de\')');
    assert.equal(n.getNameByLangNoFallback('fr'), '', 'getNameByLangNoFallback(\'fr\')');
    assert.equal(n.getNameByLangNoFallback('rm'), '', 'getNameByLangNoFallback(\'rm\')');
  });
  it('constructor with empty names', () => {
    let n = new NamedCollection({
      names: {}
    });
    assert.equal(n.name, '', 'name');
    assert.equal(n.getNameByLang(), '', 'getNameByLang()');
    assert.equal(n.getNameByLang('en'), '', 'getNameByLang(\'en\')');
    assert.equal(n.getNameByLang('de'), '', 'getNameByLang(\'de\')');
    assert.equal(n.getNameByLang('fr'), '', 'getNameByLang(\'fr\')');
    assert.equal(n.getNameByLang('rm'), '', 'getNameByLang(\'rm\')');
    assert.equal(n.getNameByLangNoFallback('en'), '', 'getNameByLangNoFallback(\'en\')');
    assert.equal(n.getNameByLangNoFallback('de'), '', 'getNameByLangNoFallback(\'de\')');
    assert.equal(n.getNameByLangNoFallback('fr'), '', 'getNameByLangNoFallback(\'fr\')');
    assert.equal(n.getNameByLangNoFallback('rm'), '', 'getNameByLangNoFallback(\'rm\')');
  });
  it('constructor with default name', () => {
    let n = new NamedCollection({
      name: 'Test'
    });
    assert.equal(n.name, 'Test', 'name');
    assert.equal(n.getNameByLang(), 'Test', 'getNameByLang()');
    assert.equal(n.getNameByLang('en'), 'Test', 'getNameByLang(\'en\')');
    assert.equal(n.getNameByLang('de'), 'Test', 'getNameByLang(\'de\')');
    assert.equal(n.getNameByLang('fr'), 'Test', 'getNameByLang(\'fr\')');
    assert.equal(n.getNameByLang('rm'), 'Test', 'getNameByLang(\'rm\')');
    assert.equal(n.getNameByLangNoFallback('en'), '', 'getNameByLangNoFallback(\'en\')');
    assert.equal(n.getNameByLangNoFallback('de'), '', 'getNameByLangNoFallback(\'de\')');
    assert.equal(n.getNameByLangNoFallback('fr'), '', 'getNameByLangNoFallback(\'fr\')');
    assert.equal(n.getNameByLangNoFallback('rm'), '', 'getNameByLangNoFallback(\'rm\')');
  });
  it('constructor with one name in de', () => {
    let n = new NamedCollection({
      name: 'Test-default',
      names: {
        de: 'Test'
      }
    });
    assert.equal(n.name, 'Test-default', 'name');
    assert.equal(n.getNameByLang(), 'Test', 'getNameByLang()');
    assert.equal(n.getNameByLang('en'), 'Test', 'getNameByLang(\'en\')');
    assert.equal(n.getNameByLang('de'), 'Test', 'getNameByLang(\'de\')');
    assert.equal(n.getNameByLang('fr'), 'Test', 'getNameByLang(\'fr\')');
    assert.equal(n.getNameByLang('rm'), 'Test', 'getNameByLang(\'rm\')');
    assert.equal(n.getNameByLangNoFallback('en'), '', 'getNameByLangNoFallback(\'en\')');
    assert.equal(n.getNameByLangNoFallback('de'), 'Test', 'getNameByLangNoFallback(\'de\')');
    assert.equal(n.getNameByLangNoFallback('fr'), '', 'getNameByLangNoFallback(\'fr\')');
    assert.equal(n.getNameByLangNoFallback('rm'), '', 'getNameByLangNoFallback(\'rm\')');
  });
  it('constructor with two names in de and en', () => {
    let n = new NamedCollection({
      name: 'Test-Default',
      names: {
        en: 'en-Test',
        de: 'de-Test'
      }
    });
    assert.equal(n.name, 'Test-Default', 'name');
    assert.equal(n.getNameByLang(), 'en-Test', 'getNameByLang()');
    assert.equal(n.getNameByLang('en'), 'en-Test', 'getNameByLang(\'en\')');
    assert.equal(n.getNameByLang('de'), 'de-Test', 'getNameByLang(\'de\')');
    assert.equal(n.getNameByLang('fr'), 'en-Test', 'getNameByLang(\'fr\')');
    assert.equal(n.getNameByLang('rm'), 'en-Test', 'getNameByLang(\'rm\')');
    assert.equal(n.getNameByLangNoFallback('en'), 'en-Test', 'getNameByLangNoFallback(\'en\')');
    assert.equal(n.getNameByLangNoFallback('de'), 'de-Test', 'getNameByLangNoFallback(\'de\')');
    assert.equal(n.getNameByLangNoFallback('fr'), '', 'getNameByLangNoFallback(\'fr\')');
    assert.equal(n.getNameByLangNoFallback('rm'), '', 'getNameByLangNoFallback(\'rm\')');
  });
  it('constructor with two names and adjusted sortation', () => {
    let n = new NamedCollection({
      name: 'Test-Default',
      names: {
        en: 'en-Test',
        de: 'de-Test'
      },
      langSortation: ['de', 'en']
    });
    assert.equal(n.name, 'Test-Default', 'name');
    assert.equal(n.getNameByLang(), 'de-Test', 'getNameByLang()');
    assert.equal(n.getNameByLang('en'), 'en-Test', 'getNameByLang(\'en\')');
    assert.equal(n.getNameByLang('de'), 'de-Test', 'getNameByLang(\'de\')');
    assert.equal(n.getNameByLang('fr'), 'de-Test', 'getNameByLang(\'fr\')');
    assert.equal(n.getNameByLang('rm'), 'de-Test', 'getNameByLang(\'rm\')');
    assert.equal(n.getNameByLangNoFallback('en'), 'en-Test', 'getNameByLangNoFallback(\'en\')');
    assert.equal(n.getNameByLangNoFallback('de'), 'de-Test', 'getNameByLangNoFallback(\'de\')');
    assert.equal(n.getNameByLangNoFallback('fr'), '', 'getNameByLangNoFallback(\'fr\')');
    assert.equal(n.getNameByLangNoFallback('rm'), '', 'getNameByLangNoFallback(\'rm\')');
  });
  it('setter methods', () => {
    let n = new NamedCollection({ langSortation: ['en', 'de']});
    assert.equal(n.name, '', 'name');
    assert.equal(n.getNameByLang(), '', 'getNameByLang()');
    assert.equal(n.getNameByLang('en'), '', 'getNameByLang(\'en\')');
    assert.equal(n.getNameByLang('de'), '', 'getNameByLang(\'de\')');
    assert.equal(n.getNameByLangNoFallback('en'), '', 'getNameByLangNoFallback(\'en\')');
    assert.equal(n.getNameByLangNoFallback('de'), '', 'getNameByLangNoFallback(\'de\')');
    n.name = 'Test';
    assert.equal(n.name, 'Test', 'name');
    assert.equal(n.getNameByLang(), 'Test', 'getNameByLang()');
    assert.equal(n.getNameByLang('en'), 'Test', 'getNameByLang(\'en\')');
    assert.equal(n.getNameByLang('de'), 'Test', 'getNameByLang(\'de\')');
    assert.equal(n.getNameByLangNoFallback('en'), '', 'getNameByLangNoFallback(\'en\')');
    assert.equal(n.getNameByLangNoFallback('de'), '', 'getNameByLangNoFallback(\'de\')');
    n.setNameByLang('de', 'Test-de');
    assert.equal(n.name, 'Test', 'name');
    assert.equal(n.getNameByLang(), 'Test-de', 'getNameByLang()');
    assert.equal(n.getNameByLang('en'), 'Test-de', 'getNameByLang(\'en\')');
    assert.equal(n.getNameByLang('de'), 'Test-de', 'getNameByLang(\'de\')');
    assert.equal(n.getNameByLangNoFallback('en'), '', 'getNameByLangNoFallback(\'en\')');
    assert.equal(n.getNameByLangNoFallback('de'), 'Test-de', 'getNameByLangNoFallback(\'de\')');
    n.setNameByLang('en', 'Test-en');
    assert.equal(n.name, 'Test', 'name');
    assert.equal(n.getNameByLang(), 'Test-en', 'getNameByLang()');
    assert.equal(n.getNameByLang('en'), 'Test-en', 'getNameByLang(\'en\')');
    assert.equal(n.getNameByLang('de'), 'Test-de', 'getNameByLang(\'de\')');
    assert.equal(n.getNameByLangNoFallback('en'), 'Test-en', 'getNameByLangNoFallback(\'en\')');
    assert.equal(n.getNameByLangNoFallback('de'), 'Test-de', 'getNameByLangNoFallback(\'de\')');
    n.setNameByLang('de', undefined);
    assert.equal(n.name, 'Test', 'name');
    assert.equal(n.getNameByLang(), 'Test-en', 'getNameByLang()');
    assert.equal(n.getNameByLang('en'), 'Test-en', 'getNameByLang(\'en\')');
    assert.equal(n.getNameByLang('de'), 'Test-en', 'getNameByLang(\'de\')');
    assert.equal(n.getNameByLangNoFallback('en'), 'Test-en', 'getNameByLangNoFallback(\'en\')');
    assert.equal(n.getNameByLangNoFallback('de'), '', 'getNameByLangNoFallback(\'de\')');
  });
});
describe('NamedCollection class, import via name (equal to Named tests)', () => {
  it('simple', () => {
    let n = new NamedCollectionClass({ names: { de: 'Test' } });
    assert.equal(n.name, 'Test', 'name',);
  });
});

describe('Default NamedCollection, import via default (equal to Collection tests)', () => {
  let a = new Unique({ id: 'a' });
  let b = new Unique({ id: 'b' });
  let c = new Unique({ id: 'c' });
  let d = new Unique({ id: 'd' });
  let e = new Unique({ id: 'e' });
  it('empty', () => {
    let coll = new NamedCollection();
    assert.equal(coll.count, 0, 'count');
    assert.equal(coll.items.length, 0, 'items.length');
    assert.equal(coll.itemIds.length, 0, 'itemIds.length');
    assert.equal(coll.sortFunction, undefined, 'sortFunction');
    assert.equal(coll.getItemById('a').id, undefined, 'getItemById a');
    assert.equal(coll.getItemById('e').id, undefined, 'getItemById e');
    assert.ok(!coll.contains(a), 'contains object a');
    assert.ok(!coll.contains(e), 'contains object e');
    assert.ok(!coll.containsId('a'), 'containsId a');
    assert.ok(!coll.containsId('e'), 'containsId e');
    let iteratorCount = 0;
    for (let value of coll)
      iteratorCount++;
    assert.equal(iteratorCount, 0, 'iterator size');
  });
  it('append four objects', () => {
    let counter = 0;
    let coll = new NamedCollection();
    coll.on('add:item', item => {
      counter++;
    });
    coll.append(a).append(b).append(c).append(d);
    assert.equal(coll.count, 4, 'count');
    assert.equal(coll.items.length, 4, 'items.length');
    assert.equal(coll.itemIds.length, 4, 'itemIds.length');
    assert.equal(coll.sortFunction, undefined, 'sortFunction');
    assert.equal(coll.getItemById('a').id, 'a', 'getItemById a');
    assert.equal(coll.getItemById('e').id, undefined, 'getItemById e');
    assert.ok(coll.contains(a), 'contains object a');
    assert.ok(!coll.contains(e), 'contains object e');
    assert.ok(coll.containsId('a'), 'containsId a');
    assert.ok(!coll.containsId('e'), 'containsId e');
    assert.equal(counter, 4, 'fire counter');
    let iteratorCount = 0;
    for (let value of coll)
      iteratorCount++;
    assert.equal(iteratorCount, 4, 'iterator size');
  });
  it('sort', () => {
    let counter = 0;
    let coll = new NamedCollection();
    coll.on('add:item', item => {
      counter++;
    });
    coll.append(a,b,c,d);
    assert.equal(coll.count, 4);
    assert.equal(coll.itemIds[0], 'a');
    assert.equal(coll.itemIds[1], 'b');
    assert.equal(coll.itemIds[2], 'c');
    assert.equal(coll.itemIds[3], 'd');
    for (let value of coll) {
      assert.equal(value.id, 'a', 'iterator first element');
      break;
    }
    coll.sortFunction = (a, b) => {
      return b.id.localeCompare(a.id)
    };
    assert.equal(coll.count, 4);
    assert.equal(coll.itemIds[0], 'd');
    assert.equal(coll.itemIds[1], 'c');
    assert.equal(coll.itemIds[2], 'b');
    assert.equal(coll.itemIds[3], 'a');
    it('fire counter', () => {
      assert.equal(counter, 4);
    });
    for (let value of coll) {
      assert.equal(value.id, 'd', 'iterator first element');
      break;
    }
    let iteratorCount = 0;
    for (let value of coll)
      iteratorCount++;
    assert.equal(iteratorCount, 4, 'iterator size');
  });
  describe('remove tests', () => {
    it('remove', () => {
      let addCounter = 0;
      let removeCounter = 0;
      let replaceCounter = 0;
      let coll = new NamedCollection();
      coll.on('add:item', item => {
        addCounter++;
      });
      coll.on('remove:item', item => {
        removeCounter++;
      });
      coll.on('replace:item', (item, removedItem) => {
        replaceCounter++;
      });
      coll.append(a,b,c,d,e).remove(b).remove(e);
      assert.equal(coll.count, 3);
      assert.equal(coll.itemIds[0], 'a');
      assert.equal(coll.itemIds[2], 'd');
      assert.equal(addCounter, 5);
      assert.equal(removeCounter, 2);
      assert.equal(replaceCounter, 0);
    });
    it('removeById', () => {
      let addCounter = 0;
      let removeCounter = 0;
      let replaceCounter = 0;
      let coll = new NamedCollection();
      coll.on('add:item', item => {
        addCounter++;
      });
      coll.on('remove:item', item => {
        removeCounter++;
      });
      coll.on('replace:item', (item, removedItem) => {
        replaceCounter++;
      });
      coll.append(a,b,c,d,e).removeById('a').removeById('b');
      assert.equal(coll.count, 3);
      assert.equal(coll.itemIds[0], 'c');
      assert.equal(coll.itemIds[2], 'e');
      assert.equal(addCounter, 5);
      assert.equal(removeCounter, 2);
      assert.equal(replaceCounter, 0);
    });
  });
  describe('replace', () => {
    it('replace by same', () => {
      let addCounter = 0;
      let removeCounter = 0;
      let replaceCounter = 0;
      let coll = new NamedCollection();
      coll.on('add:item', item => {
        addCounter++;
      });
      coll.on('remove:item', item => {
        removeCounter++;
      });
      coll.on('replace:item', (item, removedItem) => {
        replaceCounter++;
      });
      coll.append(a,b,c,d,e).append(a).append(d);
      assert.equal(coll.count, 5);
      assert.equal(coll.itemIds[0], 'b');
      assert.equal(coll.itemIds[1], 'c');
      assert.equal(coll.itemIds[2], 'e');
      assert.equal(coll.itemIds[3], 'a');
      assert.equal(coll.itemIds[4], 'd');
      assert.ok(coll.contains(a));
      assert.ok(coll.contains(d));
      assert.equal(addCounter, 5);
      assert.equal(removeCounter, 0);
      assert.equal(replaceCounter, 0);
    });
    it('replace by other', () => {
      let aa = new Unique({ id: 'a' });
      let dd = new Unique({ id: 'd' });
      let addCounter = 0;
      let removeCounter = 0;
      let replaceCounter = 0;
      let coll = new NamedCollection();
      coll.on('add:item', item => {
        addCounter++;
      });
      coll.on('remove:item', item => {
        removeCounter++;
      });
      coll.on('replace:item', (item, removedItem) => {
        replaceCounter++;
      });
      coll.append(a,b,c,d,e).append(aa).append(dd);
      assert.equal(coll.count, 5);
      assert.equal(coll.itemIds[0], 'b');
      assert.equal(coll.itemIds[1], 'c');
      assert.equal(coll.itemIds[2], 'e');
      assert.equal(coll.itemIds[3], 'a');
      assert.equal(coll.itemIds[4], 'd');
      assert.ok(!coll.contains(a));
      assert.ok(!coll.contains(d));
      assert.ok(coll.contains(aa));
      assert.ok(coll.contains(dd));
      assert.equal(addCounter, 5);
      assert.equal(removeCounter, 0);
      assert.equal(replaceCounter, 2);
    });
  });
});
describe('with constructor options', () => {
  let a = new Unique({ id: 'a' });
  a.key = 2;
  let b = new Unique({ id: 'b' });
  b.key = 4;
  let c = new Unique({ id: 'c' });
  c.key = 5;
  let d = new Unique({ id: 'd' });
  d.key = 1;
  let e = new Unique({ id: 'e' });
  e.key = 3;
  describe('sortFunction', () => {
    it('reverse sort', () => {
      let coll = new NamedCollection({
        sortFunction: (a, b) => {
          return b.id.localeCompare(a.id)
        }
      });
      coll.append(a,b,c,d,e);
      assert.equal(coll.count, 5);
      assert.equal(coll.itemIds[0], 'e');
      assert.equal(coll.itemIds[1], 'd');
      assert.equal(coll.itemIds[2], 'c');
      assert.equal(coll.itemIds[3], 'b');
      assert.equal(coll.itemIds[4], 'a');
    });
    it('sort by property', () => {
      let coll = new NamedCollection({
        sortFunction: (a, b) => {
          return a.key - b.key
        }
      });
      coll.append(a,b,c,d,e);
      assert.equal(coll.count, 5);
      assert.equal(coll.itemIds[0], 'd');
      assert.equal(coll.itemIds[1], 'a');
      assert.equal(coll.itemIds[2], 'e');
      assert.equal(coll.itemIds[3], 'b');
      assert.equal(coll.itemIds[4], 'c');
    });
  });
  describe('replace', () => {
    it('replace by same', () => {
      let addCounter = 0;
      let removeCounter = 0;
      let replaceCounter = 0;
      let coll = new NamedCollection({
        fireAddRemoveOnReplace: true,
        appendOnReplace: false
      });
      coll.on('add:item', item => {
        addCounter++;
      });
      coll.on('remove:item', item => {
        removeCounter++;
      });
      coll.on('replace:item', (item, removedItem) => {
        replaceCounter++;
      });
      coll.append(a,b,c,d,e).append(a).append(d);
      assert.equal(coll.count, 5);
      assert.equal(coll.itemIds[0], 'a');
      assert.equal(coll.itemIds[1], 'b');
      assert.equal(coll.itemIds[2], 'c');
      assert.equal(coll.itemIds[3], 'd');
      assert.equal(coll.itemIds[4], 'e');
      assert.ok(coll.contains(a));
      assert.ok(coll.contains(d));
      assert.equal(addCounter, 5);
      assert.equal(removeCounter, 0);
      assert.equal(replaceCounter, 0);
    });
    it('replace by other', () => {
      let aa = new Unique({ id: 'a' });
      let dd = new Unique({ id: 'd' });
      let addCounter = 0;
      let removeCounter = 0;
      let replaceCounter = 0;
      let coll = new NamedCollection({
        fireAddRemoveOnReplace: true,
        appendOnReplace: false
      });
      coll.on('add:item', item => {
        addCounter++;
      });
      coll.on('remove:item', item => {
        removeCounter++;
      });
      coll.on('replace:item', (item, removedItem) => {
        replaceCounter++;
      });
      coll.append(a,b,c,d,e).append(aa).append(dd);
      assert.equal(coll.count, 5);
      assert.equal(coll.itemIds[0], 'a');
      assert.equal(coll.itemIds[1], 'b');
      assert.equal(coll.itemIds[2], 'c');
      assert.equal(coll.itemIds[3], 'd');
      assert.equal(coll.itemIds[4], 'e');
      assert.ok(!coll.contains(a));
      assert.ok(!coll.contains(d));
      assert.ok(coll.contains(aa));
      assert.ok(coll.contains(dd));
      assert.equal(addCounter, 7);
      assert.equal(removeCounter, 2);
      assert.equal(replaceCounter, 2);
    });
  });
  describe('emptyObjectMaker', () => {
    let coll = new NamedCollection({
      emptyObjectMaker: () => { return new Date() }
    });
    let d = coll.getItemById('notExistant');
    assert.ok(d instanceof Date);
  });
});
describe('NamedCollection class, import via name (equal to Collection tests)', () => {
  it('simple', () => {
    let a = new Unique({ id: 'a' });
    let b = new Unique({ id: 'b' });
    let c = new NamedCollectionClass();
    c.append(a,b);
    assert.equal(c.count, 2, 'count');
  });
});