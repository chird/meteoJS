const assert = require("assert");
import 'jsdom-global/register';
import $ from 'jquery';
import Timeline from '../../../../src/meteoJS/Timeline.js';
import Animation from '../../../../src/meteoJS/timeline/Animation.js';
import Slider from '../../../../src/meteoJS/timeline/visualisation/Slider.js';

describe('bsButtons class, import via default', () => {
  it('visualisation.slider defaults', () => {
    let node = $('<input>').attr('type', 'range');
    let tl = new Timeline();
    new Slider({ node: node, timeline: tl });
    assert.equal(node.val(), 1, 'val() for invalid time');
    assert.equal(node.attr('max'), 0, 'max for invalid time');
    tl.setTimesBySetID('', [new Date('2018-06-11T12:00:00')]);
    assert.equal(node.val(), 1, 'val for invalid selected time');
    assert.equal(node.attr('max'), 1, 'max for invalid selected time');
    tl.first();
    assert.equal(node.val(), 1, 'val() for valid selceted time');
    assert.equal(node.attr('max'), 1, 'max for valid selceted time');
  });
  it('visualisation.slider all times', () => {
    let node = $('<input>').attr('type', 'range');
    let tl = new Timeline({
      maxTimeGap: 3*3600
    });
    let vis = new Slider({
      node: node,
      timeline: tl,
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
    
    vis.setNode(undefined);
    assert.equal(node.val(), 3, 'val() somewhat');
    node.val(1);
    assert.equal(node.val(), 1, 'val() somewhat');
    vis.setNode(node);
    assert.equal(node.val(), 3, 'val() as before');
  });
  it('visualisation.slider allEnabled', () => {
    let node = $('<input>').attr('type', 'range');
    let tl = new Timeline();
    new Slider({
      node: node,
      timeline: tl,
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
  it('interaction stops animation', () => {
    let tl = new Timeline();
    let animation = new Animation({
      timeline: tl
    });
    animation.start();
    assert.ok(animation.isStarted(), 'Animation started');
    let node = $('<input>').attr('type', 'range');
    let slider = new Slider({
      timeline: tl,
      node: node,
      animation: animation
    });
    node.trigger('change');
    assert.ok(!animation.isStarted(), 'Animation stopped');
  });
});