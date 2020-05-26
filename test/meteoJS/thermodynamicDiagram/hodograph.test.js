import assert from 'assert';
import { createSVGWindow } from 'svgdom';
import { SVG, registerWindow } from '@svgdotjs/svg.js';
const window = createSVGWindow();
const document = window.document;
import SkewTlogPDiagram from '../../../src/meteoJS/thermodynamicDiagram/coordinateSystem/SkewTlogPDiagram.js';
import { default as Hodograph, Hodograph as HodographClass }
  from '../../../src/meteoJS/thermodynamicDiagram/Hodograph.js';

registerWindow(window, document);

describe('Hodograph class, import via default', () => {
  it('Default options', () => {
    let svgNode = SVG().size(300,300);
    let coordinateSystem = new SkewTlogPDiagram();
    let hodograph = new Hodograph({
      svgNode,
      coordinateSystem,
      x: 0,
      y: 0,
      width: 100,
      height: 100
    });
    assert.ok(hodograph.center instanceof Array, 'center');
    assert.equal(hodograph.center[0], 50, 'center');
    assert.equal(hodograph.center[1], 50, 'center');
    assert.equal(hodograph.pixelPerSpeed, 0.6479481641468682, 'pixelPerSpeed');
    assert.equal(Object.keys(hodograph._gridOptions).length, 4, 'grid options');
    assert.equal(Math.round(hodograph._gridOptions.max*1000)/1000, 77.167, 'max');
    assert.equal(Object.keys(hodograph._gridOptions.axes).length, 2, 'axes');
    assert.equal(hodograph._gridOptions.axes.visible, true, 'visible');
    assert.equal(hodograph._gridOptions.axes.style.color, 'black', 'axes.style.color');
    assert.equal(hodograph._gridOptions.axes.style.width, 1, 'axes.style.width');
    assert.equal(Object.keys(hodograph._gridOptions.circles).length, 3, 'circles');
    assert.equal(hodograph._gridOptions.circles.visible, true, 'visible');
    assert.equal(hodograph._gridOptions.circles.style.color, 'black', 'circles.style.color');
    assert.equal(hodograph._gridOptions.circles.style.width, 1, 'circles.style.width');
    assert.equal(Math.round(hodograph._gridOptions.circles.interval*100)/100, 13.89, 'interval');
    assert.equal(Object.keys(hodograph._gridOptions.labels).length, 3, 'labels');
    assert.equal(hodograph._gridOptions.labels.visible, true, 'visible');
    assert.equal(hodograph._gridOptions.labels.angle, 225, 'angle');
    assert.equal(Object.keys(hodograph._gridOptions.labels.font).length, 2, 'labels.font');
    assert.equal(hodograph._gridOptions.labels.font.size, 12, 'labels.font.size');
  });
});
describe('Hodograph class, import via name', () => {
  it('empty object', () => {
    let svgNode = SVG();
    let coordinateSystem = new SkewTlogPDiagram();
    let hodograph = new HodographClass({
      svgNode,
      coordinateSystem
    });
    assert.equal(hodograph.x, 0, 'x');
    assert.equal(hodograph.y, 0, 'y');
    assert.equal(hodograph.width, 100, 'width');
    assert.equal(hodograph.height, 100, 'height');
  });
});