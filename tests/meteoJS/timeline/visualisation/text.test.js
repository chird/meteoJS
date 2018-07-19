QUnit.test("visualisation.text defaults", function (assert) {
  var node = $('<p>');
  var tl = new meteoJS.timeline();
  var vis = new meteoJS.timeline.visualisation.text({ node: node, timeline: tl });
  assert.equal(node.text(), '-', 'Invalid output');
  tl.setTimesBySetID('', [new Date('2018-06-11T12:00:00')]);
  assert.equal(node.text(), '-', 'Invalid output');
  tl.first();
  assert.equal(node.text(), '2018-06-11T12:00:00Z', 'Valid output');
  vis.setNode(undefined);
  assert.equal(node.text(), '', 'Empty text');
  vis.setNode(node);
  assert.equal(node.text(), '2018-06-11T12:00:00Z', 'Same output as before');
});
QUnit.test("visualisation.text UTC", function (assert) {
  var node = $('<p>');
  var tl = new meteoJS.timeline();
  new meteoJS.timeline.visualisation.text({
    node: node,
    timeline: tl,
    format: 'HH:mm',
    textInvalid: '--:--'
  });
  assert.equal(node.text(), '--:--', 'Invalid output');
  tl.setTimesBySetID('', [new Date('2018-06-11T12:00:00')]);
  tl.first();
  assert.equal(node.text(), '12:00', 'Valid output');
});
QUnit.test("visualisation.text Local", function (assert) {
  var node = $('<p>');
  var tl = new meteoJS.timeline();
  new meteoJS.timeline.visualisation.text({
    node: node,
    timeline: tl,
    format: 'D.M.YYYY HH:mm',
    textInvalid: '--',
    outputTimezone: 'local'
  });
  assert.equal(node.text(), '--', 'Invalid output');
  tl.setTimesBySetID('', [new Date('2018-06-11T12:00:00')]);
  tl.first();
  assert.equal(node.text(), '11.6.2018 14:00', 'Valid output');
});
QUnit.test("visualisation.text Timezone", function (assert) {
  var node = $('<p>');
  var tl = new meteoJS.timeline();
  new meteoJS.timeline.visualisation.text({
    node: node,
    timeline: tl,
    format: 'D.M.YYYY HH:mm',
    textInvalid: '--',
    outputTimezone: 'Europe/Zurich'
  });
  assert.equal(node.text(), '--', 'Invalid output');
  tl.setTimesBySetID('', [new Date('2018-06-11T12:00:00')]);
  tl.first();
  assert.equal(node.text(), '11.6.2018 14:00', 'Valid output');
});