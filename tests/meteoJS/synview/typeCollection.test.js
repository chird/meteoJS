QUnit.test("exclusiveVisibility", function (assert) {
  var c = new meteoJS.synview.typeCollection({ exclusiveVisibility: true });
  [0,1,2].forEach(function (id) {
    c.append(new meteoJS.synview.type({ id: id, visible: false }));
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
  assert.equal(c.isVisible(), true, 'collection not visible');
  c.getItemById(1).setVisible(false);
  assert.equal(c.getVisibleTypes().length, 0, 'No visible types');
  assert.equal(c.isVisible(), false, 'collection not visible');
});