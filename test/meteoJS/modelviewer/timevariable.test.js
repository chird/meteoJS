import Named from 'modelviewer/TimeVariable.js';

QUnit.test("some tests", function (assert) {
  let d1 = new Date('2019-09-12T00:00:00');
  let d2 = new Date('2018-01-10T00:00:00');
  let tv1 = new TimeVariable();
  assert.equal(tv1.id, undefined, 'undefined id');
  assert.equal(tv1.datetime, undefined, 'undefined datetime');
  tv1.datetime = d1;
  assert.equal(tv1.id, d1.valueOf(), 'id=d1');
  assert.equal(tv1.datetime.valueOf(), d1.valueOf(), 'datetime=d1');
  tv1.id = d2.valueOf();
  assert.equal(tv1.id, d2.valueOf(), 'id=d2');
  assert.equal(tv1.datetime.valueOf(), d2.valueOf(), 'datetime=d2');
  tv1.datetime = undefined;
  assert.equal(tv1.id, undefined, 'undefined id');
  assert.equal(tv1.datetime, undefined, 'undefined datetime');
  let tv2 = new TimeVariable({
    datetime: d1
  });
  assert.equal(tv2.id, d1.valueOf(), 'id=d1');
  assert.equal(tv2.datetime.valueOf(), d1.valueOf(), 'datetime=d1');
  let tv3 = new TimeVariable({
    id: d1.valueOf(),
    datetime: d2
  });
  assert.equal(tv3.id, d2.valueOf(), 'id=d2');
  assert.equal(tv3.datetime.valueOf(), d2.valueOf(), 'datetime=d2');
  let tv4 = new TimeVariable({
    id: d1.valueOf()
  });
  assert.equal(tv4.id, d1.valueOf(), 'id=d1');
  assert.equal(tv4.datetime.valueOf(), d1.valueOf(), 'datetime=d1');
});