QUnit.skip("button tests", function (assert) {
  var animation = new meteoJS.timeline.animation();
  
  var btn1 = $('<button>');
  new meteoJS.timeline.animation.button({
    animation: animation,
    node: btn1
  });
  assert.equal(btn1.prop('class'), '', 'No class #1');
  assert.equal(btn1.text(), 'â–¶', 'Default stopped content #1'); // ▶
  btn1.click()
  assert.equal(btn1.prop('class'), '', 'No class #2');
  assert.equal(btn1.text(), 'â¸', 'Default started content #1'); // ⏸
  btn1.click()
  assert.equal(btn1.prop('class'), '', 'No class #3');
  assert.equal(btn1.text(), 'â–¶', 'Default stopped content #2'); // ▶
  
  var btn2 = $('<button>');
  new meteoJS.timeline.animation.button({
    animation: animation,
    node: btn2,
    startedContent: 'started',
    stoppedContent: 'stopped'
  });
  assert.equal(btn2.prop('class'), '', 'No class');
  assert.equal(btn2.text(), 'stopped', 'Stopped content #1');
  btn2.click()
  assert.equal(btn2.prop('class'), '', 'No class');
  assert.equal(btn2.text(), 'started', 'Started content #1');
  btn2.click()
  assert.equal(btn2.prop('class'), '', 'No class');
  assert.equal(btn2.text(), 'stopped', 'Stopped content #2');
  
  var btn3 = $('<button>');
  new meteoJS.timeline.animation.button({
    animation: animation,
    node: btn3,
    startedClass: 'started',
    startedContent: undefined,
    stoppedClass: 'stopped',
    stoppedContent: undefined
  });
  assert.equal(btn3.prop('class'), 'stopped', 'Stopped class #1');
  assert.equal(btn3.text(), '', 'No content');
  btn3.click()
  assert.equal(btn3.prop('class'), 'started', 'Started class #1');
  assert.equal(btn3.text(), '', 'No content');
  btn3.click()
  assert.equal(btn3.prop('class'), 'stopped', 'Stopped class #2');
  assert.equal(btn3.text(), '', 'No content');
  
  var btn4 = $('<button>');
  var startedContent = $('<span>').text('a');
  new meteoJS.timeline.animation.button({
    animation: animation,
    node: btn4,
    startedClass: 'started',
    startedContent: startedContent,
    stoppedClass: 'stopped',
    stoppedContent: $('<span>').text('b')
  });
  assert.equal(btn4.prop('class'), 'stopped', 'Stopped class #1');
  assert.equal(btn4.children().length, 1, '1 child #1');
  assert.equal(btn4.children().text(), 'b', 'Stopped Content #1');
  btn4.click()
  assert.equal(btn4.prop('class'), 'started', 'Started class #1');
  assert.equal(btn4.children().length, 1, '1 child #2');
  assert.equal(btn4.children().text(), 'a', 'Started Content #1');
  startedContent.text('c');
  assert.equal(btn4.children().text(), 'c', 'Started Content #2');
  btn4.click()
  assert.equal(btn4.prop('class'), 'stopped', 'Stopped class #2');
  assert.equal(btn4.children().length, 1, '1 child #3');
  assert.equal(btn4.children().text(), 'b', 'Stopped Content #2');
});