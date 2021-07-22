import assert from 'assert';
import { createSVGWindow, Event } from 'svgdom';
import { SVG, registerWindow } from '@svgdotjs/svg.js';
global.window = createSVGWindow();
global.document = window.document;
import SkewTlogPDiagram from '../../../src/meteoJS/thermodynamicDiagram/coordinateSystem/SkewTlogPDiagram.js';
import Sounding from '../../../src/meteoJS/Sounding.js';
import DiagramSounding from '../../../src/meteoJS/thermodynamicDiagram/DiagramSounding.js';
import {
  default as WindspeedProfile,
  WindspeedProfile as WindspeedProfileClass
} from '../../../src/meteoJS/thermodynamicDiagram/WindspeedProfile.js';

registerWindow(global.window, global.document);

describe('WindspeedProfile class, import via default', () => {
  describe('windspeedMax', () => {
    it('default', () => {
      const svgNode = SVG().size(100,100);
      const coordinateSystem = new SkewTlogPDiagram();
      const windprofile = new WindspeedProfile({
        svgNode,
        coordinateSystem,
        x: 0,
        y: 0,
        width: 100,
        height: 100
      });
      const getCoordinatesByLevelData = windprofile.getCoordinatesByLevelData;
      let eventCounter = 0;
      windprofile.on('change:windspeedMax', () => eventCounter++);
      assert.equal(windprofile.windspeedMax.toFixed(3), '77.167', 'default windspeedMax');
      assert.equal(eventCounter, 0, 'eventCounter');
      [{
        pres: 1050,
        wspd: 0,
        xTest: 0,
        yTest: 100
      }, {
        pres: 100,
        wspd: windprofile.windspeedMax,
        xTest: 100,
        yTest: 0
      }, {
        pres: 100,
        wspd: 77.16666666666667,
        xTest: 100,
        yTest: 0
      }, {
        pres: 500,
        wspd: 50,
        xTest: 64.79481641468682,
        yTest: 68.44666360807102
      }].map(({
        pres,
        wspd,
        xTest,
        yTest
      }) => {
        const { x, y } = getCoordinatesByLevelData(undefined, undefined, { pres, wspd }, windprofile);
        assert.equal(x, xTest, `x of ${pres} hPa, ${wspd} m/s`);
        assert.equal(y, yTest, `y of ${pres} hPa, ${wspd} m/s`);
      });
      windprofile.windspeedMax = 50;
      assert.equal(windprofile.windspeedMax, 50, 'changed windspeedMax');
      assert.equal(eventCounter, 1, 'eventCounter');
      [{
        pres: 1050,
        wspd: 0,
        xTest: 0,
        yTest: 100
      }, {
        pres: 100,
        wspd: windprofile.windspeedMax,
        xTest: 100,
        yTest: 0
      }, {
        pres: 100,
        wspd: 77.16666666666667,
        xTest: 154.33333333333334,
        yTest: 0
      }, {
        pres: 500,
        wspd: 50,
        xTest: 100,
        yTest: 68.44666360807102
      }].map(({
        pres,
        wspd,
        xTest,
        yTest
      }) => {
        const { x, y } = getCoordinatesByLevelData(undefined, undefined, { pres, wspd }, windprofile);
        assert.equal(x, xTest, `x of ${pres} hPa, ${wspd} m/s`);
        assert.equal(y, yTest, `y of ${pres} hPa, ${wspd} m/s`);
      });
    });
    it('different construction', () => {
      const svgNode = SVG().size(100,100);
      const coordinateSystem = new SkewTlogPDiagram();
      const windprofile = new WindspeedProfile({
        svgNode,
        coordinateSystem,
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        windspeedMax: 70
      });
      const getCoordinatesByLevelData = windprofile.getCoordinatesByLevelData;
      let eventCounter = 0;
      windprofile.on('change:windspeedMax', () => eventCounter++);
      assert.equal(windprofile.windspeedMax, 70, 'default windspeedMax');
      assert.equal(eventCounter, 0, 'eventCounter');
      [{
        pres: 1050,
        wspd: 0,
        xTest: 0,
        yTest: 100
      }, {
        pres: 100,
        wspd: windprofile.windspeedMax,
        xTest: 100,
        yTest: 0
      }, {
        pres: 100,
        wspd: 70,
        xTest: 100,
        yTest: 0
      }, {
        pres: 500,
        wspd: 30,
        xTest: 42.857142857142854,
        yTest: 68.44666360807102
      }].map(({
        pres,
        wspd,
        xTest,
        yTest
      }) => {
        const { x, y } = getCoordinatesByLevelData(undefined, undefined, { pres, wspd }, windprofile);
        assert.equal(x, xTest, `x of ${pres} hPa, ${wspd} m/s`);
        assert.equal(y, yTest, `y of ${pres} hPa, ${wspd} m/s`);
      });
      windprofile.windspeedMax = 30;
      assert.equal(windprofile.windspeedMax, 30, 'changed windspeedMax');
      assert.equal(eventCounter, 1, 'eventCounter');
      [{
        pres: 1050,
        wspd: 0,
        xTest: 0,
        yTest: 100
      }, {
        pres: 100,
        wspd: windprofile.windspeedMax,
        xTest: 100,
        yTest: 0
      }, {
        pres: 100,
        wspd: 70,
        xTest: 233.33333333333334,
        yTest: 0
      }, {
        pres: 500,
        wspd: 30,
        xTest: 100,
        yTest: 68.44666360807102
      }].map(({
        pres,
        wspd,
        xTest,
        yTest
      }) => {
        const { x, y } = getCoordinatesByLevelData(undefined, undefined, { pres, wspd }, windprofile);
        assert.equal(x, xTest, `x of ${pres} hPa, ${wspd} m/s`);
        assert.equal(y, yTest, `y of ${pres} hPa, ${wspd} m/s`);
      });
    });
  });
  it('hoverLabels defaults', () => {
    const sounding = new Sounding();
    for (let pres=1000; pres>=100; pres-=50) {
      const tmpk = 73.15 + (Math.floor(Math.random() * 4000) - 2000) / 100;
      sounding.addLevel({
        pres,
        wspd: Math.floor(Math.random() * 200)/100 / 3.6
      });
    }
    const s = new DiagramSounding(sounding, {
      windprofile: {
        windspeed: {
          style: {
            color: 'red',
            width: 3
          }
        }
      }
    });
    const mousemoveEvent = new Event('mousemove');
    mousemoveEvent.pageX = 100;
    mousemoveEvent.pageY = 100;
    
    let insertFuncCounter = 0;
    const svgNode = SVG().size(300,300);
    const coordinateSystem = new SkewTlogPDiagram();
    const windprofile = new WindspeedProfile({
      svgNode,
      coordinateSystem,
      x: 50,
      y: 50,
      width: 200,
      height: 200
    });
    windprofile.addSounding(s);
    assert.ok(windprofile.isHoverLabelsRemote, 'isHoverLabelsRemote');
    assert.equal(windprofile._hoverLabelsGroup.children().length, 0, 'hoverLabelsGroup');
    windprofile._svgNode.dispatchEvent(mousemoveEvent);
    assert.equal(windprofile._hoverLabelsGroup.children().length, 2, 'hoverLabelsGroup');
    assert.equal(windprofile._hoverLabelsGroup.children()[0].attr().r, 3.5, 'circle');
    assert.equal(windprofile._hoverLabelsGroup.children()[0].attr().fill, 'red', 'circle');
  });
});
describe('WindspeedProfile class, import via name', () => {
  it('empty object', () => {
    let svgNode = SVG();
    let coordinateSystem = new SkewTlogPDiagram();
    let diagram = new WindspeedProfile({
      svgNode,
      coordinateSystem
    });
    assert.equal(diagram.x, 0, 'x');
    assert.equal(diagram.y, 0, 'y');
    assert.equal(diagram.width, 100, 'width');
    assert.equal(diagram.height, 100, 'height');
  });
});