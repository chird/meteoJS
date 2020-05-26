import assert from 'assert';
import {
  default as CoordinateSystem,
  CoordinateSystem as CoordinateSystemClass
} from '../../../src/meteoJS/thermodynamicDiagram/CoordinateSystem.js';

describe('CoordinateSystem class, import via default', () => {
  it('Options on construction', () => {
    const cs = new CoordinateSystem({
      width: 500,
      height: 500,
      pressure: {
        min: 500,
        max: 1050
      },
      temperature: {
        min: 200,
        max: 300,
        reference: 850,
        inclinationAngle: 30
      }
    });
    assert.equal(cs.width, 500, 'width');
    assert.equal(cs.height, 500, 'height');
    assert.equal(Math.round(cs.temperatureBottomLeft*100)/100, 216.44, 'temperatureBottomLeft');
    assert.equal(Math.round(cs.temperatureBottomRight*100)/100, 316.44, 'temperatureBottomRight');
    assert.equal(Math.round(cs.inclinationTan*1000)/1000, 0.577, 'inclinationTan');
    assert.equal(Object.keys(cs.options.pressure).length, 2, 'pressure');
    assert.equal(cs.options.pressure.min, 500, 'min pressure');
    assert.equal(cs.options.pressure.max, 1050, 'max pressure');
    assert.equal(Object.keys(cs.options.temperature).length, 4, 'temperature');
    assert.equal(cs.options.temperature.min, 200, 'min temperature');
    assert.equal(cs.options.temperature.max, 300, 'max temperature');
    assert.equal(cs.options.temperature.reference, 850, 'reference temperature');
    assert.equal(cs.options.temperature.inclinationAngle, 30, 'inclinationAngle temperature');
  });
  it('change options', () => {
    let optionsChangeCounter = 0;
    const cs = new CoordinateSystem();
    cs.on('change:options', () => optionsChangeCounter++);
    assert.equal(cs.width, 100, 'width');
    assert.equal(cs.height, 100, 'height');
    assert.equal(cs.options.pressure.min, 100, 'min pressure');
    assert.equal(cs.options.pressure.max, 1050, 'max pressure');
    assert.equal(Math.round(cs.options.temperature.min*100)/100, 233.15, 'min temperature');
    assert.equal(cs.options.temperature.max, 318.15, 'max temperature');
    assert.equal(cs.options.temperature.reference, 'base', 'reference temperature');
    assert.equal(cs.options.temperature.inclinationAngle, 45, 'inclinationAngle temperature');
    cs.width = 500;
    cs.height = 500;
    assert.equal(cs.width, 500, 'width');
    assert.equal(cs.height, 500, 'height');
    assert.equal(optionsChangeCounter, 2, 'optionsChangeCounter');
    cs.update({
      pressure: {
        min: 500,
        max: 1050
      }
    });
    assert.equal(cs.options.pressure.min, 500, 'min pressure');
    assert.equal(cs.options.pressure.max, 1050, 'max pressure');
    cs.update({
      pressure: {
        min: undefined
      },
      temperature: {
        min: 200,
        max: 300,
        reference: 850,
        inclinationAngle: 30
      }
    });
    assert.equal(cs.options.pressure.min, 100, 'min pressure');
    assert.equal(cs.options.pressure.max, 1050, 'max pressure');
    assert.equal(cs.options.temperature.min, 200, 'min temperature');
    assert.equal(cs.options.temperature.max, 300, 'max temperature');
    assert.equal(cs.options.temperature.reference, 850, 'reference temperature');
    assert.equal(cs.options.temperature.inclinationAngle, 30, 'inclinationAngle temperature');
    assert.equal(optionsChangeCounter, 4, 'optionsChangeCounter');
  });
});
describe('CoordinateSystem class, import via name', () => {
  it('Empty construction', () => {
    const cs = new CoordinateSystemClass();
    assert.equal(cs.width, 100, 'width');
    assert.equal(cs.height, 100, 'height');
    assert.equal(Math.round(cs.temperatureBottomLeft*100)/100, 233.15, 'temperatureBottomLeft');
    assert.equal(cs.temperatureBottomRight, 318.15, 'temperatureBottomRight');
    assert.equal(cs.inclinationTan, 1, 'inclinationTan');
    assert.equal(Object.keys(cs.options.pressure).length, 2, 'pressure');
    assert.equal(cs.options.pressure.min, 100, 'min pressure');
    assert.equal(cs.options.pressure.max, 1050, 'max pressure');
    assert.equal(Object.keys(cs.options.temperature).length, 4, 'temperature');
    assert.equal(Math.round(cs.options.temperature.min*100)/100, 233.15, 'min temperature');
    assert.equal(cs.options.temperature.max, 318.15, 'max temperature');
    assert.equal(cs.options.temperature.reference, 'base', 'reference temperature');
    assert.equal(cs.options.temperature.inclinationAngle, 45, 'inclinationAngle temperature');
  });
});