QUnit.test("namespace", function (assert) {
  assert.ok(meteoJS.events, "namespace 'meteoJS.events' exists");
});
QUnit.test("addEventFunctions", function (assert) {
  var obj = new (function () {});
  meteoJS.events.addEventFunctions(obj);
  assert.equal(typeof(obj.on), 'function', "on");
  assert.equal(typeof(obj.un), 'function', "un");
  assert.equal(typeof(obj.once), 'function', "once");
  assert.equal(typeof(obj.hasListener), 'function', "hasListener");
  assert.equal(typeof(obj.trigger), 'function', "trigger");
});
QUnit.test("trigger von on/once", function (assert) {
  var obj = new (function () {});
  meteoJS.events.addEventFunctions(obj);
  var counterA = 0;
  var counterB = 0;
  var funcA = function () { counterA++; };
  var funcB = function () { counterB++; };
  obj.on('A', funcA);
  obj.trigger('A');
  obj.once('A', funcA);
  obj.trigger('A');
  obj.trigger('A');
  obj.on('A', funcB);
  obj.trigger('A');
  obj.on('A', funcA);
  obj.trigger('A');
  obj.once('A', funcA);
  obj.trigger('A');
  assert.equal(counterA, 10, 'counterA=10');
  assert.equal(counterB, 3, 'counterB=3');
});
QUnit.test("recursive once", function (assert) {
  var obj = new (function () {});
  meteoJS.events.addEventFunctions(obj);
  var counter = 0;
  var func = function () { counter++; obj.trigger('A'); };
  obj.once('A', func);
  obj.trigger('A');
  assert.equal(counter, 1, 'counter=1');
});
QUnit.test("thisArg", function (assert) {
  var obj = new (function () {
    this.test = 'A';
  });
  meteoJS.events.addEventFunctions(obj);
  var obj2 = new (function () {
    this.test = 'B';
  });
  meteoJS.events.addEventFunctions(obj2);
  var result = '';
  obj.on('A', function () {
    result = this.test;
  });
  obj.trigger('A');
  assert.equal(result, 'A', 'A -> A');
  obj.on('B', function () {
    result = this.test;
  }, obj2);
  obj.trigger('B');
  assert.equal(result, 'B', 'B -> B');
});