QUnit.skip("interaction stops animation", function (assert) {
  var tl = new meteoJS.timeline();
  tl.setTimesBySetID('', [
    new Date('2018-07-19 00:00'),
    new Date('2018-07-19 03:00'),
    new Date('2018-07-19 06:00'),
    new Date('2018-07-19 09:00'),
    new Date('2018-07-19 12:00')
  ]);
  var animation = new meteoJS.timeline.animation({
    timeline: tl
  });
  animation.start();
  assert.ok(animation.isStarted(), 'Animation started');
  var node = $('<div>');
  var slider = new meteoJS.timeline.visualisation.bsButtons({
    timeline: tl,
    node: node,
    animation: animation
  });
  node.find('button').click();
  assert.ok(!animation.isStarted(), 'Animation stopped');
});
QUnit.skip("setOutputTimezone", function (assert) {
  var tl = new meteoJS.timeline();
  tl.setTimesBySetID('', [
    new Date('2018-08-12 22:00:00.000Z'),
    new Date('2018-08-12 23:00:00.000Z'),
    new Date('2018-08-13 00:00:00.000Z'),
    new Date('2018-08-13 01:00:00.000Z'),
    new Date('2018-08-13 02:00:00.000Z'),
    new Date('2018-08-13 03:00:00.000Z'),
    new Date('2018-08-13 04:00:00.000Z')
  ]);
  tl.first();
  var node = $('<div>');
  var vis = new meteoJS.timeline.visualisation.bsButtons({
    timeline: tl,
    node: node,
    format: 'HH',
    groupingFormat: 'D.M.YYYY'
  });
  assert.equal(node.find('.btn-toolbar > label > span').text(),
    '12.8.201813.8.2018', 'Grouping-Headers in UTC');
  assert.equal(node.find('.btn-group .btn').text(),
    '22230001020304', 'Items in UTC');
  vis.setOutputTimezone('Europe/Zurich');
  assert.equal(node.find('.btn-toolbar > label > span').text(),
    '13.8.2018', 'Grouping-Headers in Europe/Zurich');
  assert.equal(node.find('.btn-group .btn').text(),
    '00010203040506', 'Items in Europe/Zurich');
});