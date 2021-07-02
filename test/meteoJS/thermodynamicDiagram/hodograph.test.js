import assert from 'assert';
import { createSVGWindow } from 'svgdom';
import { SVG, registerWindow } from '@svgdotjs/svg.js';
global.window = createSVGWindow();
global.document = window.document;
import { default as Hodograph, Hodograph as HodographClass }
  from '../../../src/meteoJS/thermodynamicDiagram/Hodograph.js';

registerWindow(global.window, global.document);

describe('Hodograph class, import via default', () => {
  it('Default options', () => {
    let svgNode = SVG().size(300,300);
    let hodograph = new Hodograph({
      svgNode,
      x: 0,
      y: 0,
      width: 100,
      height: 100
    });
    assert.ok(hodograph.center instanceof Array, 'center');
    assert.ok(hodograph.center.length, 2, 'center array length');
    assert.equal(hodograph.center[0], 50, 'center x coordinate');
    assert.equal(hodograph.center[1], 50, 'center y coordinate');
    assert.equal(hodograph.origin, undefined, 'origin');
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
  it('origin tests', () => {
    const hodograph = new Hodograph({
      svgNode: SVG().size(300,300),
      x: 0,
      y: 0,
      width: 100,
      height: 100
    });
    let redrawBackgroundCounter = 0;
    hodograph.on('postbuild:background', () => redrawBackgroundCounter++);
    assert.ok(hodograph.center instanceof Array, 'center');
    assert.ok(hodograph.center.length, 2, 'center array length');
    assert.equal(hodograph.center[0], 50, 'center x coordinate');
    assert.equal(hodograph.center[1], 50, 'center y coordinate');
    assert.equal(hodograph.origin, undefined, 'origin');
    // Change options after construction
    hodograph.origin = [0.5, 0.5];
    assert.ok(hodograph.origin instanceof Array, 'origin is Array');
    assert.ok(hodograph.origin.length, 2, 'origin array length');
    assert.equal(hodograph.origin[0], 0.5, 'origin x coordinate');
    assert.equal(hodograph.origin[1], 0.5, 'origin y coordinate');
    assert.ok(hodograph.center instanceof Array, 'center');
    assert.ok(hodograph.center.length, 2, 'center array length');
    assert.equal(hodograph.center[0], 75, 'center x coordinate');
    assert.equal(hodograph.center[1], 25, 'center y coordinate');
    assert.equal(redrawBackgroundCounter, 1, 'redrawBackgroundCounter');
    hodograph.width = 50;
    assert.ok(hodograph.center instanceof Array, 'center');
    assert.ok(hodograph.center.length, 2, 'center array length');
    assert.equal(hodograph.center[0], 37.5, 'center x coordinate');
    assert.equal(hodograph.center[1], 37.5, 'center y coordinate');
    assert.equal(redrawBackgroundCounter, 2, 'redrawBackgroundCounter');
    hodograph.height = 50;
    assert.ok(hodograph.center instanceof Array, 'center');
    assert.ok(hodograph.center.length, 2, 'center array length');
    assert.equal(hodograph.center[0], 37.5, 'center x coordinate');
    assert.equal(hodograph.center[1], 12.5, 'center y coordinate');
    assert.equal(redrawBackgroundCounter, 3, 'redrawBackgroundCounter');
    hodograph.origin = [1, -1];
    assert.ok(hodograph.origin instanceof Array, 'origin is Array');
    assert.ok(hodograph.origin.length, 2, 'origin array length');
    assert.equal(hodograph.origin[0], 1, 'origin x coordinate');
    assert.equal(hodograph.origin[1], -1, 'origin y coordinate');
    assert.ok(hodograph.center instanceof Array, 'center');
    assert.ok(hodograph.center.length, 2, 'center array length');
    assert.equal(hodograph.center[0], 50, 'center x coordinate');
    assert.equal(hodograph.center[1], 50, 'center y coordinate');
    assert.equal(redrawBackgroundCounter, 4, 'redrawBackgroundCounter');
    hodograph.origin = undefined;
    assert.equal(hodograph.origin, undefined, 'origin');
    assert.ok(hodograph.center instanceof Array, 'center');
    assert.ok(hodograph.center.length, 2, 'center array length');
    assert.equal(hodograph.center[0], 25, 'center x coordinate');
    assert.equal(hodograph.center[1], 25, 'center y coordinate');
    assert.equal(redrawBackgroundCounter, 5, 'redrawBackgroundCounter');
  });
  it('pixelPerSpeed tests', () => {
    const hodograph = new Hodograph({
      svgNode: SVG().size(300,300),
      x: 0,
      y: 0,
      width: 100,
      height: 100
    });
    assert.equal(hodograph.pixelPerSpeed, 0.6479481641468682, 'pixelPerSpeed');
    hodograph.width = 50;
    assert.equal(hodograph.pixelPerSpeed, 0.3239740820734341, 'pixelPerSpeed');
  });
});
describe('Hodograph class, import via name', () => {
  it('empty object', () => {
    let svgNode = SVG();
    let hodograph = new HodographClass({
      svgNode
    });
    assert.equal(hodograph.x, 0, 'x');
    assert.equal(hodograph.y, 0, 'y');
    assert.equal(hodograph.width, 100, 'width');
    assert.equal(hodograph.height, 100, 'height');
  });
});