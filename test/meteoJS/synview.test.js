QUnit.test("appendType", function (assert) {
  var synview = new meteoJS.synview();
  var type1 = new meteoJS.synview.type({
    id: 'synview-type-1'
  });
  var type2 = new meteoJS.synview.type();
  var type3 = new meteoJS.synview.type();
  synview
    .appendType(type1)
    .appendType(type2)
    .appendType(type3);
  assert.equal(type1.getId(), 'synview-type-1', 'Id type1');
  assert.equal(type2.getId(), 'synview-type-0', 'Id type1');
  assert.equal(type3.getId(), 'synview-type-2', 'Id type1');
  assert.equal(synview.getTypeCollection().getCount(), 3, 'Count of types');
});