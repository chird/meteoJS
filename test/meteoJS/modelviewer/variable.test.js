import Named from 'modelviewer/Variable.js';

QUnit.test("some tests", function (assert) {
  let v = new Variable();
  assert.equal(v.id, undefined, 'undefined id');
  v.id = 'abc';
  assert.equal(v.id, 'abc', 'defined id');
  v.id = undefined;
  assert.equal(v.id, undefined, 'undefined id');
  let v1 = new Variable({ id: 123 });
  assert.equal(v.id, 123, 'id=123');
  v.id = 'abcd';
  assert.equal(v.id, 'abcd', 'defined id');
});