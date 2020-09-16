import assert from 'assert';
import {
  default as Visualisation,
  Visualisation as VisualisationClass
} from '../../../src/meteoJS/timeline/Visualisation.js';

describe('Visualisation', () => {
  it('Visualisation getTimeText', () => {
    const visualisation = new Visualisation();
    const dateInvalid = new Date('invalid');
    const date = new Date(Date.UTC(2020, 5, 5, 2, 3, 21, 30));
    assert.equal(visualisation.options.getTimeText, undefined, 'getTimeText');
    assert.equal(visualisation.timeToText(dateInvalid), '-', 'timeToText invalid');
    assert.equal(visualisation.timeToText(date), '2020-06-05T02:03:21.030Z', 'timeToText');
    visualisation.options.getTimeText = (time, format) => {
      return `${time.toISOString()} - ${format}`;
    };
    assert.ok(visualisation.options.getTimeText !== undefined, 'getTimeText');
    assert.equal(visualisation.timeToText(dateInvalid), '-', 'timeToText invalid');
    assert.equal(visualisation.timeToText(date), '2020-06-05T02:03:21.030Z - undefined', 'timeToText');
    assert.equal(visualisation.timeToText(dateInvalid, 'HH:mm'), '-', 'timeToText invalid');
    assert.equal(visualisation.timeToText(date, 'HH:mm'), '2020-06-05T02:03:21.030Z - HH:mm', 'timeToText');
  });
});