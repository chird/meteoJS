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