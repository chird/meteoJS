import assert from 'assert';
import { createSVGWindow } from 'svgdom';
import { SVG, registerWindow } from '@svgdotjs/svg.js';
global.window = createSVGWindow();
global.document = window.document;
import { default as Hodograph, Hodograph as HodographClass }
  from '../../../src/meteoJS/thermodynamicDiagram/Hodograph.js';

registerWindow(global.window, global.document);

describe('Hodograph class, import via default', () => {
  it('Default construction', () => {
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
    assert.equal(Object.keys(hodograph._gridOptions.labels).length, 6, 'labels');
    assert.equal(hodograph._gridOptions.labels.visible, true, 'visible');
    assert.equal(hodograph._gridOptions.labels.angle, 225, 'angle');
    assert.equal(hodograph._gridOptions.labels.unit, 'km/h', 'unit');
    assert.equal(hodograph._gridOptions.labels.prefix, '', 'prefix');
    assert.equal(hodograph._gridOptions.labels.decimalPlaces, 0, 'decimalPlaces');
    assert.equal(Object.keys(hodograph._gridOptions.labels.font).length, 2, 'labels.font');
    assert.equal(hodograph._gridOptions.labels.font.size, 12, 'labels.font.size');
  });
  it('Construction options', () => {
    const hodograph = new Hodograph({
      svgNode: SVG().size(300,300),
      x: 10,
      y: 20,
      width: 200,
      height: 150,
      grid: {
        axes: {
          visible: false,
          style: {
            color: 'red'
          }
        },
        circles: {
          interval: 5,
          style: {
            color: 'yellow',
            width: 3
          }
        },
        labels: {
          angle: 180,
          unit: 'km/h',
          prefix: ' km/h',
          decimalPlaces: 1,
          visible: false,
          font: {
            size: 10,
            color: 'grey'
          }
        },
        max: 60
      },
      windspeedMax: 30,
      origin: [0.5, 0.5]
    });
    assert.equal(hodograph.x, 10, 'x');
    assert.equal(hodograph.y, 20, 'y');
    assert.equal(hodograph.width, 200, 'width');
    assert.equal(hodograph.height, 150, 'height');
    assert.ok(hodograph.center instanceof Array, 'center is array');
    assert.ok(hodograph.center.length, 2, 'center array length');
    assert.equal(hodograph.center[0], 137.5, 'center x coordinate');
    assert.equal(hodograph.center[1], 37.5, 'center y coordinate');
    assert.ok(hodograph.origin instanceof Array, 'origin is array');
    assert.ok(hodograph.origin.length, 2, 'origin array length');
    assert.equal(hodograph.origin[0], 0.5, 'orign[0]');
    assert.equal(hodograph.origin[1], 0.5, 'orign[1]');
    assert.equal(hodograph._windspeedMax, 30, '_windspeedMax');
    assert.equal(Object.keys(hodograph._gridOptions).length, 4, 'grid options');
    assert.equal(hodograph._gridOptions.max, 60, 'max');
    assert.equal(Object.keys(hodograph._gridOptions.axes).length, 2, 'axes');
    assert.equal(hodograph._gridOptions.axes.visible, false, 'axes.visible');
    assert.equal(hodograph._gridOptions.axes.style.color, 'red', 'axes.style.color');
    assert.equal(hodograph._gridOptions.axes.style.width, 1, 'axes.style.width');
    assert.equal(Object.keys(hodograph._gridOptions.circles).length, 3, 'circles');
    assert.equal(hodograph._gridOptions.circles.visible, true, 'circles.visible');
    assert.equal(hodograph._gridOptions.circles.style.color, 'yellow', 'circles.style.color');
    assert.equal(hodograph._gridOptions.circles.style.width, 3, 'circles.style.width');
    assert.equal(hodograph._gridOptions.circles.interval, 5, 'circles.interval');
    assert.equal(Object.keys(hodograph._gridOptions.labels).length, 6, 'labels');
    assert.equal(hodograph._gridOptions.labels.visible, false, 'visible');
    assert.equal(hodograph._gridOptions.labels.angle, 180, 'labels.angle');
    assert.equal(hodograph._gridOptions.labels.unit, 'km/h', 'labels.unit');
    assert.equal(hodograph._gridOptions.labels.prefix, ' km/h', 'labels.prefix');
    assert.equal(hodograph._gridOptions.labels.decimalPlaces, 1, 'labels.decimalPlaces');
    assert.equal(Object.keys(hodograph._gridOptions.labels.font).length, 2, 'labels.font');
    assert.equal(hodograph._gridOptions.labels.font.size, 10, 'labels.font.size');
    assert.equal(hodograph._gridOptions.labels.font.color, 'grey', 'labels.font.color');
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
  describe('label configuration', () => {
    it('default', () => {
      const hodograph = new Hodograph({
        svgNode: SVG().size(300,300),
        x: 0,
        y: 0,
        width: 100,
        height: 100
      });
      assert.equal(hodograph._svgNodeBackground.children()
        .filter(el => el.type == 'text').length, 5, 'label count');
      hodograph._svgNodeBackground.children()
        .filter(el => el.type == 'text')
        .map(el => assert.ok(el.text().match(/^(5|10|15|20|25)0$/)));
    });
    it('unit', () => {
      const hodograph = new Hodograph({
        svgNode: SVG().size(300,300),
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        grid: {
          labels: {
            unit: 'kn'
          }
        }
      });
      assert.equal(hodograph._svgNodeBackground.children()
        .filter(el => el.type == 'text').length, 5, 'label count');
      hodograph._svgNodeBackground.children()
        .filter(el => el.type == 'text')
        .map(el => assert.ok(el.text().match(/^(27|54|81|108|135)$/)));
    });
    it('prefix and decimalPlaces', () => {
      const hodograph = new Hodograph({
        svgNode: SVG().size(300,300),
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        grid: {
          labels: {
            prefix: ' km/h',
            decimalPlaces: 1
          }
        }
      });
      assert.equal(hodograph._svgNodeBackground.children()
        .filter(el => el.type == 'text').length, 5, 'label count');
      hodograph._svgNodeBackground.children()
        .filter(el => el.type == 'text')
        //.map(el => console.log(el.text()));
        .map(el => assert.ok(el.text().match(/^(5|10|15|20|25)0\.0 km\/h$/)));
    });
    it('unit, prefix and decimalPlaces', () => {
      const hodograph = new Hodograph({
        svgNode: SVG().size(300,300),
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        grid: {
          labels: {
            unit: 'm/s',
            prefix: ' m/s',
            decimalPlaces: 1
          }
        }
      });
      assert.equal(hodograph._svgNodeBackground.children()
        .filter(el => el.type == 'text').length, 5, 'label count');
      hodograph._svgNodeBackground.children()
        .filter(el => el.type == 'text')
        .map(el => assert.ok(el.text().match(/^(13\.9|27\.8|41\.7|55\.6|69\.4) m\/s$/)));
    });
    it('unit and circles.interval', () => {
      const hodograph = new Hodograph({
        svgNode: SVG().size(300,300),
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        grid: {
          circles: {
            interval: 10.2888888888888 // 20 knots
          },
          labels: {
            unit: 'kn',
          }
        }
      });
      assert.equal(hodograph._svgNodeBackground.children()
        .filter(el => el.type == 'text').length, 7, 'label count');
      hodograph._svgNodeBackground.children()
        .filter(el => el.type == 'text')
        .map(el => assert.ok(el.text().match(/^(20|40|60|80|100|120|140)$/)));
    });
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