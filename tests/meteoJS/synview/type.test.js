QUnit.test("empty object", function (assert) {
  var type = new meteoJS.synview.type();
  assert.equal(type.getId(), undefined, 'undefined ID');
  assert.equal(type.getVisible(), true, 'getVisible');
  assert.equal(type.getZIndex(), undefined, 'getZIndex');
  assert.equal(type.getLayerGroup(), 'ol', 'getLayerGroup');
  assert.equal(type.getResourceCollection(), 'ol', 'getResourceCollection');
  assert.equal(type.getDisplayedResource(), 'resource', 'getDisplayedResource');
  var lg = new ol.layer.Group();
  type.setId('id').setVisible(false).setZIndex(10).setLayerGroup(lg);
  assert.equal(type.getId(), 'id', 'getId');
  assert.equal(type.getVisible(), false, 'getVisible');
  assert.equal(type.getZIndex(), 10, 'getZIndex');
  assert.equal(type.getLayerGroup(), 'ol', 'getLayerGroup');
  type.setVisible(true);
});
QUnit.test("static image", function (assert) {
});
QUnit.test("Time serie of images", function (assert) {
});