const assert = require("assert");
import Unique from '../../../src/meteoJS/base/Unique.js';
import NamedCollection from '../../../src/meteoJS/base/NamedCollection.js';
import { NamedCollection as NamedCollectionClass }
  from '../../../src/meteoJS/base/NamedCollection.js';

describe('NamedCollection class, import via default (equal to Named tests)', () => {
  describe('empty constructor', () => {
    let n = new NamedCollection();
    it('name', () => {
      assert.equal(n.name, '');
    });
    it('getNameByLang()', () => {
      assert.equal(n.getNameByLang(), '');
    });
    it('getNameByLang(\'en\')', () => {
      assert.equal(n.getNameByLang('en'), '');
    });
    it('getNameByLang(\'de\')', () => {
      assert.equal(n.getNameByLang('de'), '',);
    });
    it('getNameByLang(\'fr\')', () => {
      assert.equal(n.getNameByLang('fr'), '');
    });
    it('getNameByLang(\'rm\')', () => {
      assert.equal(n.getNameByLang('rm'), '');
    });
    it('getNameByLangNoFallback(\'en\')', () => {
      assert.equal(n.getNameByLangNoFallback('en'), '');
    });
    it('getNameByLangNoFallback(\'de\')', () => {
      assert.equal(n.getNameByLangNoFallback('de'), '');
    });
    it('getNameByLangNoFallback(\'fr\')', () => {
      assert.equal(n.getNameByLangNoFallback('fr'), '');
    });
    it('getNameByLangNoFallback(\'rm\')', () => {
      assert.equal(n.getNameByLangNoFallback('rm'), '');
    });
  });
  describe('constructor with empty names', () => {
    let n = new NamedCollection({
      names: {}
    });
    it('name', () => {
      assert.equal(n.name, '');
    });
    it('getNameByLang()', () => {
      assert.equal(n.getNameByLang(), '');
    });
    it('getNameByLang(\'en\')', () => {
      assert.equal(n.getNameByLang('en'), '');
    });
    it('getNameByLang(\'de\')', () => {
      assert.equal(n.getNameByLang('de'), '',);
    });
    it('getNameByLang(\'fr\')', () => {
      assert.equal(n.getNameByLang('fr'), '');
    });
    it('getNameByLang(\'rm\')', () => {
      assert.equal(n.getNameByLang('rm'), '');
    });
    it('getNameByLangNoFallback(\'en\')', () => {
      assert.equal(n.getNameByLangNoFallback('en'), '');
    });
    it('getNameByLangNoFallback(\'de\')', () => {
      assert.equal(n.getNameByLangNoFallback('de'), '');
    });
    it('getNameByLangNoFallback(\'fr\')', () => {
      assert.equal(n.getNameByLangNoFallback('fr'), '');
    });
    it('getNameByLangNoFallback(\'rm\')', () => {
      assert.equal(n.getNameByLangNoFallback('rm'), '');
    });
  });
  describe('constructor with one name in de', () => {
    let n = new NamedCollection({
      names: {
        de: 'Test'
      }
    });
    it('name', () => {
      assert.equal(n.name, 'Test');
    });
    it('getNameByLang()', () => {
      assert.equal(n.getNameByLang(), 'Test');
    });
    it('getNameByLang(\'en\')', () => {
      assert.equal(n.getNameByLang('en'), 'Test');
    });
    it('getNameByLang(\'de\')', () => {
      assert.equal(n.getNameByLang('de'), 'Test',);
    });
    it('getNameByLang(\'fr\')', () => {
      assert.equal(n.getNameByLang('fr'), 'Test');
    });
    it('getNameByLang(\'rm\')', () => {
      assert.equal(n.getNameByLang('rm'), 'Test');
    });
    it('getNameByLangNoFallback(\'en\')', () => {
      assert.equal(n.getNameByLangNoFallback('en'), '');
    });
    it('getNameByLangNoFallback(\'de\')', () => {
      assert.equal(n.getNameByLangNoFallback('de'), 'Test');
    });
    it('getNameByLangNoFallback(\'fr\')', () => {
      assert.equal(n.getNameByLangNoFallback('fr'), '');
    });
    it('getNameByLangNoFallback(\'rm\')', () => {
      assert.equal(n.getNameByLangNoFallback('rm'), '');
    });
  });
  describe('constructor with two names in de and en', () => {
    let n = new NamedCollection({
      names: {
        en: 'en-Test',
        de: 'de-Test'
      }
    });
    it('name', () => {
      assert.equal(n.name, 'en-Test');
    });
    it('getNameByLang()', () => {
      assert.equal(n.getNameByLang(), 'en-Test');
    });
    it('getNameByLang(\'en\')', () => {
      assert.equal(n.getNameByLang('en'), 'en-Test');
    });
    it('getNameByLang(\'de\')', () => {
      assert.equal(n.getNameByLang('de'), 'de-Test',);
    });
    it('getNameByLang(\'fr\')', () => {
      assert.equal(n.getNameByLang('fr'), 'en-Test');
    });
    it('getNameByLang(\'rm\')', () => {
      assert.equal(n.getNameByLang('rm'), 'en-Test');
    });
    it('getNameByLangNoFallback(\'en\')', () => {
      assert.equal(n.getNameByLangNoFallback('en'), 'en-Test');
    });
    it('getNameByLangNoFallback(\'de\')', () => {
      assert.equal(n.getNameByLangNoFallback('de'), 'de-Test');
    });
    it('getNameByLangNoFallback(\'fr\')', () => {
      assert.equal(n.getNameByLangNoFallback('fr'), '');
    });
    it('getNameByLangNoFallback(\'rm\')', () => {
      assert.equal(n.getNameByLangNoFallback('rm'), '');
    });
  });
  describe('constructor with two names and adjusted sortation', () => {
    let n = new NamedCollection({
      names: {
        en: 'en-Test',
        de: 'de-Test'
      },
      langSortation: ['de', 'en']
    });
    it('name', () => {
      assert.equal(n.name, 'de-Test');
    });
    it('getNameByLang()', () => {
      assert.equal(n.getNameByLang(), 'de-Test');
    });
    it('getNameByLang(\'en\')', () => {
      assert.equal(n.getNameByLang('en'), 'en-Test');
    });
    it('getNameByLang(\'de\')', () => {
      assert.equal(n.getNameByLang('de'), 'de-Test',);
    });
    it('getNameByLang(\'fr\')', () => {
      assert.equal(n.getNameByLang('fr'), 'de-Test');
    });
    it('getNameByLang(\'rm\')', () => {
      assert.equal(n.getNameByLang('rm'), 'de-Test');
    });
    it('getNameByLangNoFallback(\'en\')', () => {
      assert.equal(n.getNameByLangNoFallback('en'), 'en-Test');
    });
    it('getNameByLangNoFallback(\'de\')', () => {
      assert.equal(n.getNameByLangNoFallback('de'), 'de-Test');
    });
    it('getNameByLangNoFallback(\'fr\')', () => {
      assert.equal(n.getNameByLangNoFallback('fr'), '');
    });
    it('getNameByLangNoFallback(\'rm\')', () => {
      assert.equal(n.getNameByLangNoFallback('rm'), '');
    });
  });
});
describe('NamedCollection class, import via name (equal to Named tests)', () => {
  describe('simple', () => {
    let n = new NamedCollectionClass({ names: { de: 'Test' } });
    it('name', () => {
      assert.equal(n.name, 'Test');
    });
  });
});

describe('Default NamedCollection, import via default', () => {
  let a = new Unique({ id: 'a' });
  let b = new Unique({ id: 'b' });
  let c = new Unique({ id: 'c' });
  let d = new Unique({ id: 'd' });
  let e = new Unique({ id: 'e' });
  describe('empty', () => {
    let coll = new NamedCollection();
    it('count', () => {
      assert.equal(coll.count, 0);
    });
    it('items.length', () => {
      assert.equal(coll.items.length, 0);
    });
    it('itemIds.length', () => {
      assert.equal(coll.itemIds.length, 0);
    });
    it('sortFunction', () => {
      assert.equal(coll.sortFunction, undefined);
    });
    it('getItemById a', () => {
      assert.equal(coll.getItemById('a').id, undefined);
    });
    it('getItemById e', () => {
      assert.equal(coll.getItemById('e').id, undefined);
    });
    it('contains object a', () => {
      assert.ok(!coll.contains(a));
    });
    it('contains object e', () => {
      assert.ok(!coll.contains(e));
    });
    it('containsId a', () => {
      assert.ok(!coll.containsId('a'));
    });
    it('containsId e', () => {
      assert.ok(!coll.containsId('e'));
    });
  });
  describe('append four objects', () => {
    let counter = 0;
    let coll = new NamedCollection();
    coll.on('add:item', item => {
      counter++;
    });
    coll.append(a).append(b).append(c).append(d);
    it('count', () => {
      assert.equal(coll.count, 4);
    });
    it('items.length', () => {
      assert.equal(coll.items.length, 4);
    });
    it('itemIds.length', () => {
      assert.equal(coll.itemIds.length, 4);
    });
    it('sortFunction', () => {
      assert.equal(coll.sortFunction, undefined);
    });
    it('getItemById a', () => {
      assert.equal(coll.getItemById('a').id, 'a');
    });
    it('getItemById e', () => {
      assert.equal(coll.getItemById('e').id, undefined);
    });
    it('contains object a', () => {
      assert.ok(coll.contains(a));
    });
    it('contains object e', () => {
      assert.ok(!coll.contains(e));
    });
    it('containsId a', () => {
      assert.ok(coll.containsId('a'));
    });
    it('containsId e', () => {
      assert.ok(!coll.containsId('e'));
    });
    it('fire counter', () => {
      assert.equal(counter, 4);
    });
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
});
describe('NamedCollection class, import via name', () => {
  describe('simple', () => {
    let a = new Unique({ id: 'a' });
    let b = new Unique({ id: 'b' });
    let c = new NamedCollectionClass();
    c.append(a,b);
    it('count', () => {
      assert.equal(c.count, 2);
    });
  });
});