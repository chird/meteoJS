QUnit.test("defaults", function (assert) {
  var node = $('<input>').attr('type', 'range');
  var tl = new meteoJS.timeline();
  new meteoJS.timeline.visualisation.slider(tl, { node: node });
  assert.equal(node.val(), 1, 'val() for invalid time');
  assert.equal(node.attr('max'), 0, 'max for invalid time');
  tl.setTimesBySetID('', [new Date('2018-06-11T12:00:00')]);
  assert.equal(node.val(), 1, 'val for invalid selected time');
  assert.equal(node.attr('max'), 1, 'max for invalid selected time');
  tl.first();
  assert.equal(node.val(), 1, 'val() for valid selceted time');
  assert.equal(node.attr('max'), 1, 'max for valid selceted time');
});
QUnit.test("all times", function (assert) {
  var node = $('<input>').attr('type', 'range');
  var tl = new meteoJS.timeline({
    maxTimeGap: 3*3600
  });
  new meteoJS.timeline.visualisation.slider(tl, {
    node: node,
    enabledStepsOnly: false
  });
  tl.setTimesBySetID('', [
    new Date('2018-06-23T00:00:00'),
    new Date('2018-06-23T06:00:00'),
    new Date('2018-06-23T21:00:00')
  ]);
  assert.equal(node.attr('max'), 8, 'max');
  assert.equal(node.val(), 1, 'val() at start');
  tl.last()
  assert.equal(node.val(), 8, 'val() after last()');
  tl.sub(3, 'h');
  assert.equal(node.val(), 7, 'val() after sub()');
  tl.prev();
  assert.equal(node.val(), 3, 'val() after prev()');
});
QUnit.test("allEnabled", function (assert) {
  var node = $('<input>').attr('type', 'range');
  var tl = new meteoJS.timeline();
  new meteoJS.timeline.visualisation.slider(tl, {
    node: node,
    allEnabledStepsOnly: true
  });
  tl.setTimesBySetID('A', [
    new Date('2018-06-23T00:00:00'),
    new Date('2018-06-23T06:00:00'),
    new Date('2018-06-23T09:00:00'),
    new Date('2018-06-23T21:00:00')
  ]);
  tl.setTimesBySetID('B', [
    new Date('2018-06-23T03:00:00'),
    new Date('2018-06-23T06:00:00'),
    new Date('2018-06-23T21:00:00')
  ]);
  assert.equal(node.attr('max'), 2, 'max');
  assert.equal(node.val(), 1, 'val() at start');
  tl.last()
  assert.equal(node.val(), 2, 'val() after last()');
  tl.prev();
  assert.equal(node.val(), 1, 'val() after prev()');
});