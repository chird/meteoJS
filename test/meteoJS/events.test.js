const assert = require("assert);
import addEventFunctions from '../../src/meteoJS/Events.js';

it('addEventFunctions', () => {
  let obj = new (function () {});
  addEventFunctions(obj);
  assert.equal(typeof(obj.on), 'function', "on");
  assert.equal(typeof(obj.un), 'function', "un");
  assert.equal(typeof(obj.once), 'function', "once");
  assert.equal(typeof(obj.hasListener), 'function', "hasListener");
  assert.equal(typeof(obj.trigger), 'function', "trigger");
});
it('trigger von on/once', () => {
  let obj = new (function () {});
  addEventFunctions(obj);
  let counterA = 0;
  let counterB = 0;
  let funcA = function () { counterA++; };
  let func_A = function () { counterA++; };
  let funcB = function () { counterB++; };
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
  obj.on('A', func_A);
  obj.trigger('A');
  assert.equal(counterA, 11, 'counterA=11');
  assert.equal(counterB, 3, 'counterB=3');
});
it('recursive once', () => {
  let obj = new (function () {});
  addEventFunctions(obj);
  let counter = 0;
  let func = function () { counter++; obj.trigger('A'); };
  obj.once('A', func);
  obj.trigger('A');
  assert.equal(counter, 1, 'counter=1');
});
it('thisArg', () => {
  let obj = new (function () {
    this.test = 'A';
  });
  addEventFunctions(obj);
  let obj2 = new (function () {
    this.test = 'B';
  });
  addEventFunctions(obj2);
  let result = '';
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