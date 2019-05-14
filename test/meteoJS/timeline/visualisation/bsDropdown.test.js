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
  var slider = new meteoJS.timeline.visualisation.bsDropdown({
    timeline: tl,
    node: node,
    animation: animation
  });
  node.find('button.dropdown-item').click();
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
  var vis = new meteoJS.timeline.visualisation.bsDropdown({
    timeline: tl,
    node: node,
    buttonFormat: 'D.M.YYYY HH:mm',
    groupingFormat: 'D.M.YYYY'
  });
  assert.equal(node.find('.dropdown-toggle').text(),
    '12.8.2018 22:00', 'Toggle-Button in UTC');
  assert.equal(node.find('.dropdown-menu .dropdown-header').text(),
    '12.8.201813.8.2018', 'Grouping-Headers in UTC');
  assert.equal(node.find('.dropdown-menu .dropdown-item').text(),
    '22:0023:0000:0001:0002:0003:0004:00', 'Items in UTC');
  vis.setOutputTimezone('Europe/Zurich');
  assert.equal(node.find('.dropdown-toggle').text(),
    '13.8.2018 00:00', 'Toggle-Button in Europe/Zurich');
  assert.equal(node.find('.dropdown-menu .dropdown-header').text(),
    '13.8.2018', 'Grouping-Headers in Europe/Zurich');
  assert.equal(node.find('.dropdown-menu .dropdown-item').text(),
    '00:0001:0002:0003:0004:0005:0006:00', 'Items in Europe/Zurich');
});