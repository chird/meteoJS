import assert from 'assert';
import { createSVGWindow } from 'svgdom';
import { SVG, registerWindow } from '@svgdotjs/svg.js';
global.window = createSVGWindow();
global.document = window.document;
import Sounding from '../../../src/meteoJS/Sounding.js';
import DiagramSounding
  from '../../../src/meteoJS/thermodynamicDiagram/DiagramSounding.js';
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
    assert.equal(Object.keys(hodograph._gridOptions.labels).length, 7, 'labels');
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
    assert.equal(Object.keys(hodograph._gridOptions.labels).length, 7, 'labels');
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
    describe('grid label placement', () => {
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
        assert.equal(Math.round(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[0].x()), 37, 'x first label');
        assert.equal(Math.round(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[0].y()), 48, 'y first label');
        assert.equal(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[0].font('anchor'), 'start', 'text-anchor first label');
        assert.equal(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[0].font('color'), 'black', 'font-color first label');
        assert.equal(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[0].font('size'), 12, 'font-size first label');
        assert.equal(Math.round(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[4].x()), 8, 'x last label');
        assert.equal(Math.round(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[4].y()), 74, 'y last label');
        assert.equal(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[4].font('anchor'), 'start', 'text-anchor last label');
        assert.equal(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[4].font('color'), 'black', 'font-color last label');
        assert.equal(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[4].font('size'), 12, 'font-size last label');
      });
      it('angle=90', () => {
        const hodograph = new Hodograph({
          svgNode: SVG().size(300,300),
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          grid: {
            labels: {
              angle: 90
            }
          }
        });
        assert.equal(hodograph._svgNodeBackground.children()
          .filter(el => el.type == 'text').length, 5, 'label count');
        assert.equal(Math.round(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[0].x()), 52, 'x first label');
        assert.equal(Math.round(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[0].y()), 53, 'y first label');
        assert.equal(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[0].font('anchor'), 'start', 'text-anchor first label');
        assert.equal(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[0].font('color'), 'black', 'font-color first label');
        assert.equal(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[0].font('size'), 12, 'font-size first label');
        assert.equal(Math.round(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[4].x()), 85, 'x last label');
        assert.equal(Math.round(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[4].y()), 53, 'y last label');
        assert.equal(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[4].font('anchor'), 'start', 'text-anchor last label');
        assert.equal(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[4].font('color'), 'black', 'font-color last label');
        assert.equal(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[4].font('size'), 12, 'font-size last label');
      });
      it('angle=0', () => {
        const hodograph = new Hodograph({
          svgNode: SVG().size(300,300),
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          grid: {
            labels: {
              angle: 0,
              font: {
                'text-anchor': 'end'
              }
            }
          }
        });
        assert.equal(hodograph._svgNodeBackground.children()
          .filter(el => el.type == 'text').length, 5, 'label count');
        assert.equal(Math.round(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[0].x()), 33, 'x first label');
        assert.equal(Math.round(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[0].y()), 33, 'y first label');
        assert.equal(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[0].font('anchor'), 'end', 'text-anchor first label');
        assert.equal(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[0].font('color'), 'black', 'font-color first label');
        assert.equal(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[0].font('size'), 12, 'font-size first label');
        assert.equal(Math.round(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[4].x()), 26, 'x last label');
        assert.equal(Math.round(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[4].y()), -3, 'y last label');
        assert.equal(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[4].font('anchor'), 'end', 'text-anchor last label');
        assert.equal(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[4].font('color'), 'black', 'font-color last label');
        assert.equal(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[4].font('size'), 12, 'font-size last label');
      });
      it('font', () => {
        const hodograph = new Hodograph({
          svgNode: SVG().size(300,300),
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          grid: {
            labels: {
              font: {
                size: 8,
                color: 'grey'
              }
            }
          }
        });
        assert.equal(hodograph._svgNodeBackground.children()
          .filter(el => el.type == 'text').length, 5, 'label count');
        assert.equal(Math.round(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[0].x()), 39, 'x first label');
        assert.equal(Math.round(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[0].y()), 51, 'y first label');
        assert.equal(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[0].font('anchor'), 'start', 'text-anchor first label');
        assert.equal(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[0].font('color'), 'grey', 'font-color first label');
        assert.equal(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[0].font('size'), 8, 'font-size first label');
        assert.equal(Math.round(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[4].x()), 11, 'x last label');
        assert.equal(Math.round(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[4].y()), 76, 'y last label');
        assert.equal(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[4].font('anchor'), 'start', 'text-anchor last label');
        assert.equal(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[4].font('color'), 'grey', 'font-color last label');
        assert.equal(hodograph._svgNodeBackground.children().filter(el => el.type == 'text')[4].font('size'), 8, 'font-size last label');
      });
    });
  });
  describe('sounding plotting', () => {
    it('default', () => {
      const sounding = new Sounding();
      Array.from({length: 20 }, (v, i) => i).map(i => {
        sounding.addLevel({
          pres: 1000 - i * 50,
          wspd: Math.random() * 100,
          wdir: Math.random() * 360
        });
      });
      const diagramSounding = new DiagramSounding(sounding);
      const hodograph = new Hodograph({
        svgNode: SVG().size(300,300),
        x: 0,
        y: 0,
        width: 100,
        height: 100
      });
      hodograph.addSounding(diagramSounding);
      assert.ok(hodograph._svgNodeData.children()[0].visible(), 'visible');
      assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[0].type,
        'polyline', 'match polyline');
      assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[0].array().length,
        20, '20 data points');
      assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[0].stroke(),
        'green', 'stroke');
      assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[0].fill(),
        'none', 'fill');
    });
    it('minPressure/maxPressure', () => {
      const sounding = new Sounding();
      Array.from({length: 20 }, (v, i) => i).map(i => {
        sounding.addLevel({
          pres: 1000 - i * 50,
          wspd: Math.random() * 100,
          wdir: Math.random() * 360
        });
      });
      const diagramSounding = new DiagramSounding(sounding, {
        hodograph: {
          minPressure: 300,
          maxPressure: 950
        }
      });
      const hodograph = new Hodograph({
        svgNode: SVG().size(300,300),
        x: 0,
        y: 0,
        width: 100,
        height: 100
      });
      hodograph.addSounding(diagramSounding);
      assert.ok(hodograph._svgNodeData.children()[0].visible(), 'visible');
      assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[0].type,
        'polyline', 'match polyline');
      assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[0].array().length,
        14, '20 data points');
      assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[0].stroke(),
        'green', 'stroke');
      assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[0].fill(),
        'none', 'fill');
    });
    it('style options', () => {
      const sounding = new Sounding();
      Array.from({length: 20 }, (v, i) => i).map(i => {
        sounding.addLevel({
          pres: 1000 - i * 50,
          wspd: Math.random() * 100,
          wdir: Math.random() * 360
        });
      });
      const diagramSounding = new DiagramSounding(sounding, {
        hodograph: {
          visible: false,
          style: {
            color: 'red',
            width: 3
          }
        }
      });
      const hodograph = new Hodograph({
        svgNode: SVG().size(300,300),
        x: 0,
        y: 0,
        width: 100,
        height: 100
      });
      hodograph.addSounding(diagramSounding);
      assert.ok(!hodograph._svgNodeData.children()[0].visible(), 'not visible');
      assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[0].type,
        'polyline', 'match polyline');
      assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[0].array().length,
        20, '20 data points');
      assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[0].stroke(),
        'red', 'stroke');
      assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[0].fill(),
        'none', 'fill');
    });
    describe('segments', () => {
      it('test one', () => {
        const sounding = new Sounding();
        Array.from({length: 20 }, (v, i) => i).map(i => {
          sounding.addLevel({
            pres: 1000 - i * 50,
            wspd: Math.random() * 100,
            wdir: Math.random() * 360
          });
        });
        const diagramSounding = new DiagramSounding(sounding, {
          hodograph: {
            segments: [{
              minPressure: 850,
              style: {
                color: 'red'
              }
            }, {
              maxPressure: 800,
              minPressure: 700,
              style: {
                color: 'orange'
              }
            }, {
              maxPressure: 499,
              minPressure: 401,
              style: {
                color: 'yellow'
              }
            }, {
              maxPressure: 60,
              style: {
                color: 'violet'
              }
            }]
          }
        });
        const hodograph = new Hodograph({
          svgNode: SVG().size(300,300),
          x: 0,
          y: 0,
          width: 100,
          height: 100
        });
        hodograph.addSounding(diagramSounding);
        assert.ok(hodograph._svgNodeData.children()[0].visible(), 'visible');
        assert.equal(hodograph._svgNodeData.children()[0].children()[0].children().length,
          6, 'polyline count');
        hodograph._svgNodeData.children()[0].children()[0].children()
          .map(n => assert.equal(n.type, 'polyline', 'SVG node type'));
        assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[0].array().length,
          2, '[0]: point count');
        assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[0].stroke(),
          'green', '[0]: color');
        assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[1].array().length,
          14, '[1]: point count');
        assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[1].stroke(),
          'green', '[1]: color');
        assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[2].array().length,
          4, '[2]: point count');
        assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[2].stroke(),
          'red', '[2]: color');
        assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[3].array().length,
          3, '[3]: point count');
        assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[3].stroke(),
          'orange', '[3]: color');
        assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[4].array().length,
          1, '[4]: point count');
        assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[4].stroke(),
          'yellow', '[4]: color');
        assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[5].array().length,
          1, '[5]: point count');
        assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[5].stroke(),
          'violet', '[5]: color');
      });
      it('test two', () => {
        const sounding = new Sounding();
        Array.from({length: 20 }, (v, i) => i).map(i => {
          sounding.addLevel({
            pres: 50 + i * 50,
            wspd: Math.random() * 100,
            wdir: Math.random() * 360
          });
        });
        const diagramSounding = new DiagramSounding(sounding, {
          hodograph: {
            minPressure: 110,
            maxPressure: 750,
            segments: [{
              minPressure: 850,
              style: {
                color: 'red'
              }
            }, {
              maxPressure: 800,
              minPressure: 700,
              style: {
                color: 'orange'
              }
            }, {
              maxPressure: 499,
              minPressure: 401,
              style: {
                color: 'yellow'
              }
            }, {
              maxPressure: 60,
              style: {
                color: 'violet'
              }
            }]
          }
        });
        const hodograph = new Hodograph({
          svgNode: SVG().size(300,300),
          x: 0,
          y: 0,
          width: 100,
          height: 100
        });
        hodograph.addSounding(diagramSounding);
        assert.ok(hodograph._svgNodeData.children()[0].visible(), 'visible');
        assert.equal(hodograph._svgNodeData.children()[0].children()[0].children().length,
          3, 'polyline count');
        hodograph._svgNodeData.children()[0].children()[0].children()
          .map(n => assert.equal(n.type, 'polyline', 'SVG node type'));
        assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[0].array().length,
          12, '[0]: point count');
        assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[0].stroke(),
          'green', '[0]: color');
        assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[1].array().length,
          2, '[1]: point count');
        assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[1].stroke(),
          'orange', '[1]: color');
        assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[2].array().length,
          1, '[2]: point count');
        assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[2].stroke(),
          'yellow', '[2]: color');
        diagramSounding.update({
          hodograph: {
            segments: [{
              minPressure: 850,
              style: {
                color: 'red'
              }
            }]
          }
        });
        assert.ok(hodograph._svgNodeData.children()[0].visible(), 'visible');
        assert.equal(hodograph._svgNodeData.children()[0].children()[0].children().length,
          1, 'polyline count');
        hodograph._svgNodeData.children()[0].children()[0].children()
          .map(n => assert.equal(n.type, 'polyline', 'SVG node type'));
        assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[0].array().length,
          13, '[0]: point count');
        assert.equal(hodograph._svgNodeData.children()[0].children()[0].children()[0].stroke(),
          'green', '[0]: color');
      });
    });
  });
  describe('hover labels', () => {
    it('hoverLabelsSounding getter', () => {
      const plotArea = new Hodograph({
        svgNode: SVG().size(300,300)
      });
      const s1 = new DiagramSounding(new Sounding());
      const s2 = new DiagramSounding(new Sounding());
      const s3 = new DiagramSounding(new Sounding());
      plotArea.addSounding(s1);
      plotArea.addSounding(s2);
      plotArea.addSounding(s3);
      assert.equal(s1.visible, true, 's1 visible');
      assert.equal(s2.visible, true, 's2 visible');
      assert.equal(s3.visible, true, 's3 visible');
      assert.equal(plotArea.hoverLabelsSounding, s1, 'hoverLabelsSounding');
      s1.visible = false;
      assert.equal(plotArea.hoverLabelsSounding, s2, 'hoverLabelsSounding');
      s2.visible = false;
      assert.equal(plotArea.hoverLabelsSounding, s3, 'hoverLabelsSounding');
    });
    it('mousemove-Event', () => {
      const sounding = new Sounding();
      Array.from({length: 20 }, (v, i) => i).map(i => {
        sounding.addLevel({
          pres: 1000 - i * 50,
          wspd: 1 + 99 * i/19,
          wdir: 45
        });
      });
      const s = new DiagramSounding(sounding);
      const mousemoveEvent = new Event('mousemove');
      mousemoveEvent.pageX = 100;
      mousemoveEvent.pageY = 200;
      
      let insertFuncCounter = 0;
      const hodograph = new Hodograph({
        svgNode: SVG().size(300,300),
        x: 50,
        y: 50,
        width: 200,
        height: 200,
        hoverLabels: {
          insertLabelsFunc: (sounding, levelData, group) => {
            group.clear();
            assert.equal(sounding, s, 'sounding');
            assert.equal(group, hodograph._hoverLabelsGroup, '_hoverLabelsGroup');
            if ('pres' in levelData) {
              group.circle(50);
              assert.ok((levelData.pres == 500) ? true : (levelData.pres == 1000) ? true : false, 'pres');
            }
            insertFuncCounter++;
          }
        }
      });
      hodograph.addSounding(s);
      assert.equal(insertFuncCounter, 0, 'insertFuncCounter');
      assert.equal(hodograph._hoverLabelsGroup.children().length, 0, 'empty hoverLabelsGroup at beginning');
      hodograph._svgNode.dispatchEvent(mousemoveEvent);
      assert.equal(insertFuncCounter, 1, 'insertFuncCounter');
      assert.equal(hodograph._hoverLabelsGroup.children().length, 1, 'hoverLabelsGroup after mouse event');
      s.visible = false;
      assert.equal(insertFuncCounter, 1, 'insertFuncCounter');
      assert.equal(hodograph._hoverLabelsGroup.children().length, 0, 'hoverLabelsGroup after invisible sounding');
      s.visible = true;
      assert.equal(insertFuncCounter, 1, 'insertFuncCounter');
      assert.equal(hodograph._hoverLabelsGroup.children().length, 0, 'hoverLabelsGroup after visible sounding');
      hodograph._svgNode.dispatchEvent(mousemoveEvent);
      assert.equal(insertFuncCounter, 2, 'insertFuncCounter');
      assert.equal(hodograph._hoverLabelsGroup.children().length, 1, 'hoverLabelsGroup after second mouse event');
      hodograph.width = 100;
      hodograph.height = 100;
      assert.equal(insertFuncCounter, 2, 'insertFuncCounter');
      assert.equal(hodograph._hoverLabelsGroup.children().length, 0, 'hoverLabelsGroup after resize');
      hodograph._svgNode.dispatchEvent(mousemoveEvent);
      assert.equal(insertFuncCounter, 3, 'insertFuncCounter');
      assert.equal(hodograph._hoverLabelsGroup.children().length, 0, 'hoverLabelsGroup after third mouse event');
      hodograph.origin = [-0.5, 0.5];
      assert.equal(insertFuncCounter, 3, 'insertFuncCounter');
      assert.equal(hodograph._hoverLabelsGroup.children().length, 0, 'hoverLabelsGroup after origin move');
      mousemoveEvent.pageX = 90;
      mousemoveEvent.pageY = 75;
      hodograph._svgNode.dispatchEvent(mousemoveEvent);
      assert.equal(insertFuncCounter, 4, 'insertFuncCounter');
      assert.equal(hodograph._hoverLabelsGroup.children().length, 1, 'hoverLabelsGroup after fourth mouse event');
      mousemoveEvent.pageX = 100;
      mousemoveEvent.pageY = 75;
      hodograph._svgNode.dispatchEvent(mousemoveEvent);
      assert.equal(insertFuncCounter, 5, 'insertFuncCounter');
      assert.equal(hodograph._hoverLabelsGroup.children().length, 0, 'hoverLabelsGroup after fifth mouse event');
    });
    it('default insertFunction, with segments and different snapDistance', () => {
      const sounding = new Sounding();
      Array.from({length: 20 }, (v, i) => i).map(i => {
        sounding.addLevel({
          pres: 1000 - i * 50,
          wspd: 1 + 99 * i/19,
          wdir: 45
        });
      });
      const s = new DiagramSounding(sounding, {
        hodograph: {
          maxPressure: 900,
          segments: [{
            minPressure: 700,
            style: {
              color: 'orange'
            }
          }]
        }
      });
      const mousemoveEvent = new Event('mousemove');
      mousemoveEvent.pageX = 100;
      mousemoveEvent.pageY = 200;
      
      const hodograph = new Hodograph({
        svgNode: SVG().size(300,300),
        x: 50,
        y: 50,
        width: 200,
        height: 200,
        hoverLabels: {
          snapDistance: 50
        }
      });
      hodograph.addSounding(s);
      assert.equal(hodograph._hoverLabelsGroup.children().length, 0, 'empty hoverLabelsGroup at beginning');
      hodograph._svgNode.dispatchEvent(mousemoveEvent);
      //console.log(hodograph._hoverLabelsGroup.children(), hodograph._hoverLabelsGroup.children()[0].fill());
      assert.equal(hodograph._hoverLabelsGroup.children().length, 5, 'hoverLabelsGroup after mouse event');
      assert.equal(hodograph._hoverLabelsGroup.children()[0].type, 'circle', 'circle in hoverLabelsGroup');
      assert.equal(hodograph._hoverLabelsGroup.children()[0].fill(), 'green', 'circle color in hoverLabelsGroup');
      assert.equal(hodograph._hoverLabelsGroup.children()[0].attr('r'), 3, 'circle radius in hoverLabelsGroup');
      assert.equal(hodograph._hoverLabelsGroup.children()[1].type, 'rect', 'background rect in hoverLabelsGroup');
      assert.equal(hodograph._hoverLabelsGroup.children()[1].fill(), 'white', 'background rect color in hoverLabelsGroup');
      assert.equal(hodograph._hoverLabelsGroup.children()[1].attr('fill-opacity'), 0.7, 'background rect opacity in hoverLabelsGroup');
      ['500 hPa', '103 kn', '45°'].map((text, i) => {
        assert.equal(hodograph._hoverLabelsGroup.children()[i+2].children()[0].type, 'text', `${i}'s text node in hoverLabelsGroup: type`);
        assert.equal(hodograph._hoverLabelsGroup.children()[i+2].children()[0].text(), text, `${i}'s text node in hoverLabelsGroup: text`);
        assert.equal(hodograph._hoverLabelsGroup.children()[i+2].children()[0].attr('font-size'), 12, `${i}'s text node in hoverLabelsGroup: font-size`);
        assert.equal(hodograph._hoverLabelsGroup.children()[i+2].children()[0].attr('color'), 'black', `${i}'s text node in hoverLabelsGroup: color`);
        assert.equal(hodograph._hoverLabelsGroup.children()[i+2].children()[0].attr('text-anchor'), 'start', `${i}'s text node in hoverLabelsGroup: text-anchor`);
        assert.equal(hodograph._hoverLabelsGroup.children()[i+2].children()[0].attr('alignment-baseline'), 'bottom', `${i}'s text node in hoverLabelsGroup: alignment-baseline`);
        assert.equal(hodograph._hoverLabelsGroup.children()[i+2].children()[0].attr('fill'), 'black', `${i}'s text node in hoverLabelsGroup: fill`);
      });
      s.visible = false;
      assert.equal(hodograph._hoverLabelsGroup.children().length, 0, 'hoverLabelsGroup after invisible sounding');
      s.visible = true;
      assert.equal(hodograph._hoverLabelsGroup.children().length, 0, 'hoverLabelsGroup after visible sounding');
      hodograph._svgNode.dispatchEvent(mousemoveEvent);
      assert.equal(hodograph._hoverLabelsGroup.children().length, 5, 'hoverLabelsGroup after second mouse event');
      assert.equal(hodograph._hoverLabelsGroup.children()[0].type, 'circle', 'circle in hoverLabelsGroup');
      assert.equal(hodograph._hoverLabelsGroup.children()[0].fill(), 'green', 'circle color in hoverLabelsGroup');
      assert.equal(hodograph._hoverLabelsGroup.children()[1].type, 'rect', 'background rect in hoverLabelsGroup');
      assert.equal(hodograph._hoverLabelsGroup.children()[2].children()[0].type, 'text', 'type of a text node in hoverLabelsGroup');
      assert.equal(hodograph._hoverLabelsGroup.children()[2].children()[0].text(), '500 hPa', 'part of text in hoverLabelsGroup');
      mousemoveEvent.pageX = 150;
      mousemoveEvent.pageY = 150;
      hodograph._svgNode.dispatchEvent(mousemoveEvent);
      assert.equal(hodograph._hoverLabelsGroup.children().length, 5, 'hoverLabelsGroup after third mouse event');
      assert.equal(hodograph._hoverLabelsGroup.children()[0].type, 'circle', 'circle in hoverLabelsGroup');
      assert.equal(hodograph._hoverLabelsGroup.children()[0].fill(), 'orange', 'circle color in hoverLabelsGroup');
      assert.equal(hodograph._hoverLabelsGroup.children()[1].type, 'rect', 'background rect in hoverLabelsGroup');
      ['900 hPa', '22 kn', '45°'].map((text, i) => {
        assert.equal(hodograph._hoverLabelsGroup.children()[i+2].children()[0].type, 'text', `${i}'s text node in hoverLabelsGroup: type`);
        assert.equal(hodograph._hoverLabelsGroup.children()[i+2].children()[0].text(), text, `${i}'s text node in hoverLabelsGroup: text`);
        assert.equal(hodograph._hoverLabelsGroup.children()[i+2].children()[0].attr('font-size'), 12, `${i}'s text node in hoverLabelsGroup: font-size`);
        assert.equal(hodograph._hoverLabelsGroup.children()[i+2].children()[0].attr('color'), 'black', `${i}'s text node in hoverLabelsGroup: color`);
        assert.equal(hodograph._hoverLabelsGroup.children()[i+2].children()[0].attr('text-anchor'), 'start', `${i}'s text node in hoverLabelsGroup: text-anchor`);
        assert.equal(hodograph._hoverLabelsGroup.children()[i+2].children()[0].attr('alignment-baseline'), 'bottom', `${i}'s text node in hoverLabelsGroup: alignment-baseline`);
        assert.equal(hodograph._hoverLabelsGroup.children()[i+2].children()[0].attr('fill'), 'black', `${i}'s text node in hoverLabelsGroup: fill`);
      });
      mousemoveEvent.pageX = 150;
      mousemoveEvent.pageY = 110;
      hodograph._svgNode.dispatchEvent(mousemoveEvent);
      assert.equal(hodograph._hoverLabelsGroup.children().length, 0, 'hoverLabelsGroup after fourth mouse event');
    });
    describe('hoverLabel style', () => {
      it('invisible', () => {
        const sounding = new Sounding();
        Array.from({length: 20 }, (v, i) => i).map(i => {
          sounding.addLevel({
            pres: 1000 - i * 50,
            wspd: 1 + 99 * i/19,
            wdir: 45
          });
        });
        const s = new DiagramSounding(sounding);
        const mousemoveEvent = new Event('mousemove');
        mousemoveEvent.pageX = 100;
        mousemoveEvent.pageY = 200;
        
        const hodograph = new Hodograph({
          svgNode: SVG().size(300,300),
          x: 50,
          y: 50,
          width: 200,
          height: 200,
          hoverLabels: {
            hodograph: {
              visible: false
            }
          }
        });
        hodograph.addSounding(s);
        assert.equal(hodograph._hoverLabelsGroup.children().length, 0, 'empty hoverLabelsGroup at beginning');
        hodograph._svgNode.dispatchEvent(mousemoveEvent);
        assert.equal(hodograph._hoverLabelsGroup.children().length, 0, 'empty hoverLabelsGroup at beginning');
      });
      it('several styles', () => {
        const sounding = new Sounding();
        Array.from({length: 20 }, (v, i) => i).map(i => {
          sounding.addLevel({
            pres: 1000 - i * 50,
            wspd: 1 + 99 * i/19,
            wdir: 45
          });
        });
        const s = new DiagramSounding(sounding);
        const mousemoveEvent = new Event('mousemove');
        mousemoveEvent.pageX = 100;
        mousemoveEvent.pageY = 200;
        
        const hodograph = new Hodograph({
          svgNode: SVG().size(300,300),
          x: 50,
          y: 50,
          width: 200,
          height: 200,
          hoverLabels: {
            hodograph: {
              style: {
                color: 'grey'
              },
              font: {
                size: 8,
                color: 'orange'
              },
              fill: {
                color: 'red',
                opacity: 0.5
              },
              radiusPlus: 4,
              pressure: {
                decimalPlaces: 2,
                prefix: ' mmHg'
              },
              windspeed: {
                decimalPlaces: 1,
                unit: 'km/h',
                prefix: ' km/h'
              },
              winddir: {
                visible: false
              }
            }
          }
        });
        hodograph.addSounding(s);
        assert.equal(hodograph._hoverLabelsGroup.children().length, 0, 'empty hoverLabelsGroup at beginning');
        hodograph._svgNode.dispatchEvent(mousemoveEvent);
        assert.equal(hodograph._hoverLabelsGroup.children().length, 4, 'hoverLabelsGroup after mouse event');
        assert.equal(hodograph._hoverLabelsGroup.children()[0].type, 'circle', 'circle in hoverLabelsGroup');
        assert.equal(hodograph._hoverLabelsGroup.children()[0].fill(), 'grey', 'circle color in hoverLabelsGroup');
        assert.equal(hodograph._hoverLabelsGroup.children()[0].attr('r'), 5, 'circle width in hoverLabelsGroup');
        assert.equal(hodograph._hoverLabelsGroup.children()[1].type, 'rect', 'background rect in hoverLabelsGroup');
        assert.equal(hodograph._hoverLabelsGroup.children()[1].fill(), 'red', 'background rect color in hoverLabelsGroup');
        assert.equal(hodograph._hoverLabelsGroup.children()[1].attr('fill-opacity'), 0.5, 'background rect opacity in hoverLabelsGroup');
        ['500.00 mmHg', '191.2 km/h'].map((text, i) => {
          assert.equal(hodograph._hoverLabelsGroup.children()[i+2].children()[0].type, 'text', `${i}'s text node in hoverLabelsGroup: type`);
          assert.equal(hodograph._hoverLabelsGroup.children()[i+2].children()[0].text(), text, `${i}'s text node in hoverLabelsGroup: text`);
          assert.equal(hodograph._hoverLabelsGroup.children()[i+2].children()[0].attr('font-size'), 8, `${i}'s text node in hoverLabelsGroup: font-size`);
          assert.equal(hodograph._hoverLabelsGroup.children()[i+2].children()[0].attr('color'), 'orange', `${i}'s text node in hoverLabelsGroup: color`);
          assert.equal(hodograph._hoverLabelsGroup.children()[i+2].children()[0].attr('text-anchor'), 'start', `${i}'s text node in hoverLabelsGroup: text-anchor`);
          assert.equal(hodograph._hoverLabelsGroup.children()[i+2].children()[0].attr('alignment-baseline'), 'bottom', `${i}'s text node in hoverLabelsGroup: alignment-baseline`);
          assert.equal(hodograph._hoverLabelsGroup.children()[i+2].children()[0].attr('fill'), 'orange', `${i}'s text node in hoverLabelsGroup: fill`);
        });
      });
      it('radius', () => {
        const sounding = new Sounding();
        Array.from({length: 20 }, (v, i) => i).map(i => {
          sounding.addLevel({
            pres: 1000 - i * 50,
            wspd: 1 + 99 * i/19,
            wdir: 45
          });
        });
        const s = new DiagramSounding(sounding);
        const mousemoveEvent = new Event('mousemove');
        mousemoveEvent.pageX = 100;
        mousemoveEvent.pageY = 200;
        
        const hodograph = new Hodograph({
          svgNode: SVG().size(300,300),
          x: 50,
          y: 50,
          width: 200,
          height: 200,
          hoverLabels: {
            hodograph: {
              radius: 10
            }
          }
        });
        hodograph.addSounding(s);
        assert.equal(hodograph._hoverLabelsGroup.children().length, 0, 'empty hoverLabelsGroup at beginning');
        hodograph._svgNode.dispatchEvent(mousemoveEvent);
        assert.equal(hodograph._hoverLabelsGroup.children().length, 5, 'hoverLabelsGroup after mouse event');
        assert.equal(hodograph._hoverLabelsGroup.children()[0].type, 'circle', 'circle in hoverLabelsGroup');
        assert.equal(hodograph._hoverLabelsGroup.children()[0].fill(), 'green', 'circle color in hoverLabelsGroup');
        assert.equal(hodograph._hoverLabelsGroup.children()[0].attr('r'), 10, 'circle width in hoverLabelsGroup');
      });
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