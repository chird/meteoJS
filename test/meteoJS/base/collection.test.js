const assert = require("assert");
import Unique from '../../../src/meteoJS/base/Unique.js';
import Collection from '../../../src/meteoJS/base/Collection.js';
import { Collection as CollectionClass } from '../../../src/meteoJS/base/Collection.js';

describe('Default collection, import via default', () => {
  let a = new Unique({ id: 'a' });
  let b = new Unique({ id: 'b' });
  let c = new Unique({ id: 'c' });
  let d = new Unique({ id: 'd' });
  let e = new Unique({ id: 'e' });
  it('empty', () => {
    let coll = new Collection();
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
    let coll = new Collection();
    coll.on('add:item', item => {
      assert.ok(coll.contains(item), 'contains');
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
    let coll = new Collection();
    coll.on('add:item', item => {
      assert.ok(coll.contains(item), 'contains');
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
      let coll = new Collection();
      coll.on('add:item', item => {
        assert.ok(coll.contains(item), 'contains');
        addCounter++;
      });
      coll.on('remove:item', item => {
        assert.ok(!coll.contains(item), 'contains');
        removeCounter++;
      });
      coll.on('replace:item', (item, removedItem) => {
        assert.ok(coll.contains(item), 'contains');
        assert.ok(!coll.contains(removedItem), 'contains');
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
      let coll = new Collection();
      coll.on('add:item', item => {
        assert.ok(coll.contains(item), 'contains');
        addCounter++;
      });
      coll.on('remove:item', item => {
        assert.ok(!coll.contains(item), 'contains');
        removeCounter++;
      });
      coll.on('replace:item', (item, removedItem) => {
        assert.ok(coll.contains(item), 'contains');
        assert.ok(!coll.contains(removedItem), 'contains');
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
      let coll = new Collection();
      coll.on('add:item', item => {
        assert.ok(coll.contains(item), 'contains');
        addCounter++;
      });
      coll.on('remove:item', item => {
        assert.ok(!coll.contains(item), 'contains');
        removeCounter++;
      });
      coll.on('replace:item', (item, removedItem) => {
        assert.ok(coll.contains(item), 'contains');
        assert.ok(!coll.contains(removedItem), 'contains');
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
      let coll = new Collection();
      coll.on('add:item', item => {
        assert.ok(coll.contains(item), 'contains');
        addCounter++;
      });
      coll.on('remove:item', item => {
        assert.ok(!coll.contains(item), 'contains');
        removeCounter++;
      });
      coll.on('replace:item', (item, removedItem) => {
        assert.ok(coll.contains(item), 'contains');
        assert.ok(!coll.contains(removedItem), 'contains');
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
      let coll = new Collection({
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
      let coll = new Collection({
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
      let coll = new Collection({
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
      let coll = new Collection({
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
    let coll = new Collection({
      emptyObjectMaker: () => { return new Date() }
    });
    let d = coll.getItemById('notExistant');
    assert.ok(d instanceof Date);
  });
});
describe('Collection class, import via name', () => {
  it('simple', () => {
    let a = new Unique({ id: 'a' });
    let b = new Unique({ id: 'b' });
    let c = new CollectionClass();
    c.append(a,b);
    assert.equal(c.count, 2, 'count');
  });
});