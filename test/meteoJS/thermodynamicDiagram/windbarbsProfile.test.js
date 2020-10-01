import assert from 'assert';
import { createSVGWindow } from 'svgdom';
import { SVG, registerWindow } from '@svgdotjs/svg.js';
global.window = createSVGWindow();
global.document = window.document;
import SkewTlogPDiagram from '../../../src/meteoJS/thermodynamicDiagram/coordinateSystem/SkewTlogPDiagram.js';
import Sounding from '../../../src/meteoJS/Sounding.js';
import DiagramSounding from '../../../src/meteoJS/thermodynamicDiagram/DiagramSounding.js';
import {
  default as WindbarbsProfile,
  WindbarbsProfile as WindbarbsProfileClass
} from '../../../src/meteoJS/thermodynamicDiagram/WindbarbsProfile.js';

registerWindow(global.window, global.document);

describe('WindbarbsProfile class, import via default', () => {
  it('minDataPointsDistance', () => {
    const sounding = new Sounding();
    for (let pres=1000; pres>=100; pres-=50) {
      const tmpk = 73.15 + (Math.floor(Math.random() * 4000) - 2000) / 100;
      sounding.addLevel({
        pres,
        wdir: Math.floor(Math.random() * 360),
        wspd: Math.floor(Math.random() * 200)/100 / 3.6
      });
    }
    const s = new DiagramSounding(sounding);
    const height = 400;
    const width = 200;
    const svgNode = SVG().size(width, height);
    const coordinateSystem = new SkewTlogPDiagram({
      width,
      height,
      pressure: {
        min: 100,
        max: 1000
      }
    });
    let dataPointsLength = undefined;
    const windbarbs = new WindbarbsProfile({
      width,
      height,
      svgNode,
      coordinateSystem,
      insertDataGroupInto: (svgNode, dataGroupId, sounding, data, plotArea) => {
        dataPointsLength = data.length;
      }
    });
    windbarbs.addSounding(s);
    assert.equal(windbarbs._windbarbLength, 80, '_windbarbLength');
    assert.equal(windbarbs.minDataPointsDistance, 40, 'minDataPointsDistance');
    assert.equal(dataPointsLength, 8, 'dataPointsLength');
    windbarbs.minDataPointsDistance = 0;
    assert.equal(windbarbs._windbarbLength, 80, '_windbarbLength');
    assert.equal(windbarbs.minDataPointsDistance, 0, 'minDataPointsDistance');
    assert.equal(dataPointsLength, 19, 'dataPointsLength');
  });
});
describe('WindbarbsProfile class, import via name', () => {
  it('empty object', () => {
    const svgNode = SVG();
    const coordinateSystem = new SkewTlogPDiagram();
    const diagram = new WindbarbsProfileClass({
      svgNode,
      coordinateSystem
    });
    assert.equal(diagram.x, 0, 'x');
    assert.equal(diagram.y, 0, 'y');
    assert.equal(diagram.width, 100, 'width');
    assert.equal(diagram.height, 100, 'height');
  });
});