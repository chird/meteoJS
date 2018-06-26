QUnit.test("defaults", function (assert) {
  var node = $('<p>');
  var tl = new meteoJS.timeline();
  new meteoJS.timeline.visualisation.text(tl, { node: node });
  assert.equal(node.text(), '-', 'Invalid output');
  tl.setTimesBySetID('', [new Date('2018-06-11T12:00:00')]);
  assert.equal(node.text(), '-', 'Invalid output');
  tl.first();
  assert.equal(node.text(), '2018-06-11T12:00:00Z', 'Valid output');
});
QUnit.test("UTC", function (assert) {
  var node = $('<p>');
  var tl = new meteoJS.timeline();
  new meteoJS.timeline.visualisation.text(tl, {
    node: node,
    format: 'HH:mm',
    textInvalid: '--:--'
  });
  assert.equal(node.text(), '--:--', 'Invalid output');
  tl.setTimesBySetID('', [new Date('2018-06-11T12:00:00')]);
  tl.first();
  assert.equal(node.text(), '12:00', 'Valid output');
});
QUnit.test("Local", function (assert) {
  var node = $('<p>');
  var tl = new meteoJS.timeline();
  new meteoJS.timeline.visualisation.text(tl, {
    node: node,
    format: 'D.M.YYYY HH:mm',
    textInvalid: '--',
    outputLocal: true
  });
  assert.equal(node.text(), '--', 'Invalid output');
  tl.setTimesBySetID('', [new Date('2018-06-11T12:00:00')]);
  tl.first();
  assert.equal(node.text(), '11.6.2018 14:00', 'Valid output');
});
QUnit.test("Timezone", function (assert) {
  var node = $('<p>');
  var tl = new meteoJS.timeline();
  new meteoJS.timeline.visualisation.text(tl, {
    node: node,
    format: 'D.M.YYYY HH:mm',
    textInvalid: '--',
    outputTimezone: 'Europe/Zurich'
  });
  assert.equal(node.text(), '--', 'Invalid output');
  tl.setTimesBySetID('', [new Date('2018-06-11T12:00:00')]);
  tl.first();
  assert.equal(node.text(), '11.6.2018 14:00', 'Valid output');
});