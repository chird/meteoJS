const assert = require("assert");
import 'jsdom-global/register';
import $ from 'jquery';
import Timeline from '../../../../src/meteoJS/Timeline.js';
import Animation from '../../../../src/meteoJS/timeline/Animation.js';
import bsButtons from '../../../../src/meteoJS/timeline/visualisation/bsButtons.js';

describe('bsButtons class, import via default', () => {
  it('interaction stops animation', () => {
    let tl = new Timeline();
    tl.setTimesBySetID('', [
      new Date('2018-07-19 00:00'),
      new Date('2018-07-19 03:00'),
      new Date('2018-07-19 06:00'),
      new Date('2018-07-19 09:00'),
      new Date('2018-07-19 12:00')
    ]);
    let animation = new Animation({
      timeline: tl
    });
    animation.start();
    assert.ok(animation.isStarted(), 'Animation started');
    let node = $('<div>');
    let slider = new bsButtons({
      timeline: tl,
      node: node,
      animation: animation
    });
    node.find('button').click();
    assert.ok(!animation.isStarted(), 'Animation stopped');
  });
  it('setOutputTimezone', () => {
    let tl = new Timeline();
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
    let node = $('<div>');
    let vis = new bsButtons({
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
  it('modelviewer use case', () => {
    let times = [
      new Date('2018-08-13T00:00:00.000Z'),
      new Date('2018-08-13T03:00:00.000Z'),
      new Date('2018-08-13T06:00:00.000Z'),
      new Date('2018-08-13T09:00:00.000Z'),
      new Date('2018-08-13T12:00:00.000Z'),
      new Date('2018-08-13T15:00:00.000Z'),
      new Date('2018-08-13T18:00:00.000Z'),
      new Date('2018-08-13T21:00:00.000Z'),
      new Date('2018-08-14T00:00:00.000Z'),
      new Date('2018-08-14T03:00:00.000Z'),
      new Date('2018-08-14T06:00:00.000Z'),
      new Date('2018-08-14T09:00:00.000Z'),
      new Date('2018-08-14T12:00:00.000Z'),
      new Date('2018-08-14T15:00:00.000Z'),
      new Date('2018-08-14T18:00:00.000Z'),
      new Date('2018-08-14T21:00:00.000Z')
    ];
    let times2 = times.filter(function (t) {
      return (t.getUTCHours() % 6) == 0;
    });
    let times3 = times.filter(function (t) {
      return (t.getUTCHours() % 12) == 0;
    });
    assert.equal(times.length, 16, 'times count');
    assert.equal(times2.length, 8, 'times2 count');
    assert.equal(times3.length, 4, 'times3 count');
    let tl = new Timeline({
      maxTimeGap: 3600
    });
    tl.setTimesBySetID('a', times);
    tl.setTimesBySetID('b', times2);
    let node = $('<div>');
    let vis = new bsButtons({
      timeline: tl,
      node: node,
      enabledStepsOnly: false,
      format: 'HH',
      groupingFormat: 'D.M.YYYY'
    });
    assert.equal(node.find('.btn-group .btn').length, 46, 'All buttons');
    assert.equal(node.find('.btn-group .btn-primary').length, 8, 'All enabled buttons');
    assert.equal(node.find('.btn-group .btn-secondary').length, 8, 'Enabled buttons');
    assert.equal(node.find('.btn-group .btn-light').length, 30, 'Not enabled buttons');
    tl.setEnabledTimesBySetID('b', times3);
    assert.equal(node.find('.btn-group .btn').length, 46, 'All buttons');
    assert.equal(node.find('.btn-group .btn-primary').length, 4, 'All enabled buttons');
    assert.equal(node.find('.btn-group .btn-secondary').length, 12, 'Enabled buttons');
    assert.equal(node.find('.btn-group .btn-light').length, 30, 'Not enabled buttons');
  });
});