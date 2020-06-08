const assert = require("assert");
import 'jsdom-global/register';
import $ from 'jquery';
import moment from 'moment-timezone';
import Timeline from '../../../../src/meteoJS/Timeline.js';
import { makeTimeTextCallbackFunction }
  from '../../../../src/meteoJS/timeline/Visualisation.js';
import Text from '../../../../src/meteoJS/timeline/visualisation/Text.js';

const getTimeText = makeTimeTextCallbackFunction(moment);

describe('Text class, import via default', () => {
  it('visualisation.text defaults', () => {
    let node = $('<p>');
    let tl = new Timeline();
    let vis = new Text({ node: node, timeline: tl, getTimeText });
    assert.equal(node.text(), '-', 'Invalid output');
    tl.setTimesBySetID('', [new Date('2018-06-11T12:00:00.000Z')]);
    assert.equal(node.text(), '-', 'Invalid output');
    tl.first();
    assert.equal(node.text(), '2018-06-11T12:00:00Z', 'Valid output');
    vis.setNode(undefined);
    assert.equal(node.text(), '', 'Empty text');
    vis.setNode(node);
    assert.equal(node.text(), '2018-06-11T12:00:00Z', 'Same output as before');
    vis.setOutputTimezone('Europe/Zurich');
    assert.equal(node.text(), '2018-06-11T14:00:00+02:00', 'Correct timezone');
    vis.setOutputTimezone(undefined);
    assert.equal(node.text(), '2018-06-11T12:00:00Z', 'Correct timezone');
  });
  it("visualisation.text UTC", () => {
    let node = $('<p>');
    let tl = new Timeline();
    let vis = new Text({
      node: node,
      timeline: tl,
      format: 'HH:mm',
      textInvalid: '--:--',
      getTimeText
    });
    assert.equal(node.text(), '--:--', 'Invalid output');
    tl.setTimesBySetID('', [new Date('2018-06-11T12:00:00.000Z')]);
    tl.first();
    assert.equal(node.text(), '12:00', 'Valid output');
    vis.setOutputTimezone('Europe/Zurich');
    assert.equal(node.text(), '14:00', 'Correct timezone');
  });
  it('visualisation.text Local', () => {
    let node = $('<p>');
    let tl = new Timeline();
    let vis = new Text({
      node: node,
      timeline: tl,
      format: 'D.M.YYYY HH:mm',
      textInvalid: '--',
      outputTimezone: 'local',
      getTimeText
    });
    assert.equal(node.text(), '--', 'Invalid output');
    tl.setTimesBySetID('', [new Date('2018-06-11T12:00:00.000Z')]);
    tl.first();
    assert.equal(node.text(), '11.6.2018 14:00', 'Valid output');
    vis.setOutputTimezone(undefined);
    assert.equal(node.text(), '11.6.2018 12:00', 'Correct timezone');
  });
  it('visualisation.text Timezone', () => {
    let node = $('<p>');
    let tl = new Timeline();
    let vis = new Text({
      node: node,
      timeline: tl,
      format: 'D.M.YYYY HH:mm',
      textInvalid: '--',
      outputTimezone: 'Europe/Zurich',
      getTimeText
    });
    assert.equal(node.text(), '--', 'Invalid output');
    tl.setTimesBySetID('', [new Date('2018-06-11T12:00:00.000Z')]);
    tl.first();
    assert.equal(node.text(), '11.6.2018 14:00', 'Valid output');
    vis.setOutputTimezone(undefined);
    assert.equal(node.text(), '11.6.2018 12:00', 'Correct timezone');
  });
});