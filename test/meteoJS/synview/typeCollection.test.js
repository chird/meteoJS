import assert from 'assert';
import Type from '../../../src/meteoJS/synview/Type.js';
import TypeCollection from '../../../src/meteoJS/synview/TypeCollection.js';

it('exclusiveVisibility (standard)', () => {
  let c = new TypeCollection({ exclusiveVisibility: true });
  [0,1,2].forEach(function (id) {
    c.append(new Type({ id: id, visible: false }));
  });
  assert.equal(c.getVisibleTypes().length, 0, 'No visible types');
  assert.equal(c.isVisible(), false, 'collection not visible');
  c.getItemById(0).setVisible(true);
  assert.equal(c.getVisibleTypes().map(function (t) { return t.getId(); }).join(','), '0', 'Visible ID');
  assert.equal(c.isVisible(), true, 'collection not visible');
  c.getItemById(1).setVisible(true);
  assert.equal(c.getVisibleTypes().map(function (t) { return t.getId(); }).join(','), '1', 'Visible ID');
  assert.equal(c.isVisible(), true, 'collection not visible');
  c.getItemById(0).setVisible(false);
  assert.equal(c.getVisibleTypes().map(function (t) { return t.getId(); }).join(','), '1', 'Visible ID');
  assert.equal(c.isVisible(), true, 'collection visible');
  c.append(new meteoJS.synview.type({ id: 4, visible: true }));
  assert.equal(c.getVisibleTypes().map(function (t) { return t.getId(); }).join(','), '1', 'Visible ID');
  assert.equal(c.isVisible(), true, 'collection visible');
  c.getItemById(1).setVisible(false);
  assert.equal(c.getVisibleTypes().length, 0, 'No visible types');
  assert.equal(c.isVisible(), false, 'collection not visible');
});
it('exclusiveVisibility (option change)', () => {
  let c1 = new TypeCollection();
  [0,1,2].forEach(function (id) {
    c1.append(new Type({ id: id, visible: true }));
  });
  assert.equal(c1.getVisibleTypes().length, 3, '3 visible types');
  assert.equal(c1.isVisible(), true, 'collection visible');
  c1.setExclusiveVisibility(true);
  assert.equal(c1.getVisibleTypes().length, 1, '1 visible types');
  assert.equal(c1.getVisibleTypes()[0].getId(), 0, 'Visible type ID = 0');
  assert.equal(c1.isVisible(), true, 'collection visible');
  let c2 = new meteoJS.synview.typeCollection();
  [0,1,2].forEach(function (id) {
    c2.append(new Type({ id: id, visible: (id < 2) ? false : true }));
  });
  assert.equal(c2.getVisibleTypes().length, 1, '1 visible types');
  assert.equal(c2.getVisibleTypes()[0].getId(), 2, 'Visible type ID = 2');
  assert.equal(c2.isVisible(), true, 'collection visible');
  c2.setExclusiveVisibility(true);
  assert.equal(c2.getVisibleTypes().length, 1, '1 visible types');
  assert.equal(c2.getVisibleTypes()[0].getId(), 2, 'Visible type ID = 2');
  assert.equal(c2.isVisible(), true, 'collection visible');
  c2.getItemById(1).setVisible(true);
  assert.equal(c2.getVisibleTypes().length, 1, '1 visible types');
  assert.equal(c2.getVisibleTypes()[0].getId(), 1, 'Visible type ID = 1');
  assert.equal(c2.isVisible(), true, 'collection visible');
  let c3 = new meteoJS.synview.typeCollection();
  [0,1,2].forEach(function (id) {
    c3.append(new Type({ id: id, visible: (id < 1) ? false : true }));
  });
  assert.equal(c3.getVisibleTypes().length, 2, '2 visible types');
  assert.equal(c3.isVisible(), true, 'collection visible');
  c3.setExclusiveVisibility(true);
  assert.equal(c3.getVisibleTypes().length, 1, '1 visible types');
  assert.equal(c3.getVisibleTypes()[0].getId(), 1, 'Visible type ID = 1');
  assert.equal(c3.isVisible(), true, 'collection visible');
});
it('syncVisibility (standard)', () => {
  let c = new TypeCollection({ syncVisibility: true });
  [0,1,2].forEach(function (id) {
    c.append(new Type({ id: id, visible: false }));
  });
  assert.equal(c.getVisibleTypes().length, 0, 'No visible types');
  assert.equal(c.isVisible(), false, 'collection not visible');
  c.append(new meteoJS.synview.type({ id: 4, visible: true }));
  assert.equal(c.getVisibleTypes().length, 4, '4 visible types');
  assert.equal(c.isVisible(), true, 'collection visible');
  c.append(new Type({ id: 5, visible: false }));
  assert.equal(c.getVisibleTypes().length, 5, '5 visible types');
  assert.equal(c.isVisible(), true, 'collection visible');
  c.getItemById(4).setVisible(false);
  assert.equal(c.getVisibleTypes().length, 0, 'No visible types');
  assert.equal(c.isVisible(), false, 'collection not visible');
});
it('syncVisibility (option change)', () => {
  let c1 = new TypeCollection({});
  [0,1,2].forEach(function (id) {
    c1.append(new Type({ id: id, visible: false }));
  });
  assert.equal(c1.getVisibleTypes().length, 0, 'No visible types');
  assert.equal(c1.isVisible(), false, 'collection not visible');
  c1.setSyncVisibility(true);
  assert.equal(c1.getVisibleTypes().length, 0, 'No visible types');
  assert.equal(c1.isVisible(), false, 'collection not visible');
  c1.getItemById(0).setVisible(true);
  assert.equal(c1.getVisibleTypes().length, 3, '3 visible types');
  assert.equal(c1.isVisible(), true, 'collection visible');
  let c2 = new meteoJS.synview.typeCollection({});
  [0,1,2].forEach(function (id) {
    c2.append(new Type({ id: id, visible: true }));
  });
  assert.equal(c2.getVisibleTypes().length, 3, '3 visible types');
  assert.equal(c2.isVisible(), true, 'collection visible');
  c2.setSyncVisibility(true);
  assert.equal(c2.getVisibleTypes().length, 3, '3 visible types');
  assert.equal(c2.isVisible(), true, 'collection visible');
  c2.getItemById(0).setVisible(false);
  assert.equal(c2.getVisibleTypes().length, 0, 'No visible types');
  assert.equal(c2.isVisible(), false, 'collection not visible');
  let c3 = new TypeCollection({});
  [0,1,2].forEach(function (id) {
    c3.append(new Type({ id: id, visible: (id < 2) ? false : true }));
  });
  assert.equal(c3.getVisibleTypes().length, 1, '1 visible types');
  assert.equal(c3.isVisible(), true, 'collection visible');
  c3.setSyncVisibility(true);
  assert.equal(c3.getVisibleTypes().length, 3, '3 visible types');
  assert.equal(c3.isVisible(), true, 'collection visible');
  let c4 = new TypeCollection({});
  [0,1,2].forEach(function (id) {
    c4.append(new Type({ id: id, visible: (id < 1) ? false : true }));
  });
  assert.equal(c4.getVisibleTypes().length, 2, '2 visible types');
  assert.equal(c4.isVisible(), true, 'collection visible');
  c4.setSyncVisibility(true);
  assert.equal(c4.getVisibleTypes().length, 3, '3 visible types');
  assert.equal(c4.isVisible(), true, 'collection visible');
});