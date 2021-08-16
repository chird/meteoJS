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
  describe('grid', () => {
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
      assert.equal(windprofile.svgNode.children()[0].children().length, 2, 'background nodes');
      assert.equal(windprofile.svgNode.children()[0].children()[0].children().length, 10, 'isobar line count');
      assert.equal(windprofile.svgNode.children()[0].children()[0].children()[0].attr('x1'), 0, 'isobars[0] x1');
      assert.equal(windprofile.svgNode.children()[0].children()[0].children()[0].attr('y1'), 0, 'isobars[0] y1');
      assert.equal(windprofile.svgNode.children()[0].children()[0].children()[0].attr('x2'), 100, 'isobars[0] x2');
      assert.equal(windprofile.svgNode.children()[0].children()[0].children()[0].attr('y2'), 0, 'isobars[0] y2');
      assert.equal(windprofile.svgNode.children()[0].children()[0].children()[0].attr('stroke'), 'grey', 'isobars[0] color');
      assert.equal(windprofile.svgNode.children()[0].children()[0].children()[0].attr('stroke-width'), 1, 'isobars[0] width');
      assert.equal(windprofile.svgNode.children()[0].children()[0].children()[0].attr('stroke-dasharray'), '1 3', 'isobars[0] dasharray');
      assert.equal(windprofile.svgNode.children()[0].children()[0].children()[9].attr('x1'), 0, 'isobars[9] x1');
      assert.equal(windprofile.svgNode.children()[0].children()[0].children()[9].attr('y1'), 97.92503710240241, 'isobars[9] y1');
      assert.equal(windprofile.svgNode.children()[0].children()[0].children()[9].attr('x2'), 100, 'isobars[9] x2');
      assert.equal(windprofile.svgNode.children()[0].children()[0].children()[9].attr('y2'), 97.92503710240241, 'isobars[9] y2');
      assert.equal(windprofile.svgNode.children()[0].children()[0].children()[9].attr('stroke'), 'grey', 'isobars[9] color');
      assert.equal(windprofile.svgNode.children()[0].children()[0].children()[9].attr('stroke-width'), 1, 'isobars[9] width');
      assert.equal(windprofile.svgNode.children()[0].children()[0].children()[9].attr('stroke-dasharray'), '1 3', 'isobars[9] dasharray');
      assert.equal(windprofile.svgNode.children()[0].children()[1].children().length, 4, 'windspeed line count');
      assert.equal(windprofile.svgNode.children()[0].children()[1].children()[0].attr('x1'), 0, 'windspeed[0] x1');
      assert.equal(windprofile.svgNode.children()[0].children()[1].children()[0].attr('y1'), 0, 'windspeed[0] y1');
      assert.equal(windprofile.svgNode.children()[0].children()[1].children()[0].attr('x2'), 0, 'windspeed[0] x2');
      assert.equal(windprofile.svgNode.children()[0].children()[1].children()[0].attr('y2'), 100, 'windspeed[0] y2');
      assert.equal(windprofile.svgNode.children()[0].children()[1].children()[0].attr('stroke'), 'grey', 'windspeed[0] color');
      assert.equal(windprofile.svgNode.children()[0].children()[1].children()[0].attr('stroke-width'), 1, 'windspeed[0] width');
      assert.equal(windprofile.svgNode.children()[0].children()[1].children()[0].attr('stroke-dasharray'), '2 2', 'windspeed[0] dasharray');
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
        grid: {
          isobars: {
            interval: 200,
            min: 400,
            max: 950,
            style: {
              color: '#111111',
              width: 3
            }
          },
          isotachs: {
            interval: 10,
            min: 20,
            max: 60,
            style: {
              color: 'red',
              width: 4
            }
          }
        }
      });
      assert.equal(windprofile.svgNode.children()[0].children().length, 2, 'background nodes');
      assert.equal(windprofile.svgNode.children()[0].children()[0].children().length, 3, 'isobar line count');
      assert.equal(windprofile.svgNode.children()[0].children()[0].children()[0].attr('x1'), 0, 'isobars[0] x1');
      assert.equal(windprofile.svgNode.children()[0].children()[0].children()[0].attr('y1'), 58.95674698866279, 'isobars[0] y1');
      assert.equal(windprofile.svgNode.children()[0].children()[0].children()[0].attr('x2'), 100, 'isobars[0] x2');
      assert.equal(windprofile.svgNode.children()[0].children()[0].children()[0].attr('y2'), 58.95674698866279, 'isobars[0] y2');
      assert.equal(windprofile.svgNode.children()[0].children()[0].children()[0].attr('stroke'), '#111111', 'isobars[0] color');
      assert.equal(windprofile.svgNode.children()[0].children()[0].children()[0].attr('stroke-width'), 3, 'isobars[0] width');
      assert.equal(windprofile.svgNode.children()[0].children()[0].children()[0].attr('stroke-dasharray'), '1 3', 'isobars[0] dasharray');
      assert.equal(windprofile.svgNode.children()[0].children()[0].children()[2].attr('x1'), 0, 'isobars[2] x1');
      assert.equal(windprofile.svgNode.children()[0].children()[0].children()[2].attr('y1'), 88.4351204829942, 'isobars[2] y1');
      assert.equal(windprofile.svgNode.children()[0].children()[0].children()[2].attr('x2'), 100, 'isobars[2] x2');
      assert.equal(windprofile.svgNode.children()[0].children()[0].children()[2].attr('y2'), 88.4351204829942, 'isobars[2] y2');
      assert.equal(windprofile.svgNode.children()[0].children()[0].children()[2].attr('stroke'), '#111111', 'isobars[2] color');
      assert.equal(windprofile.svgNode.children()[0].children()[0].children()[2].attr('stroke-width'), 3, 'isobars[2] width');
      assert.equal(windprofile.svgNode.children()[0].children()[0].children()[2].attr('stroke-dasharray'), '1 3', 'isobars[2] dasharray');
      assert.equal(windprofile.svgNode.children()[0].children()[1].children().length, 5, 'windspeed line count');
      assert.equal(windprofile.svgNode.children()[0].children()[1].children()[0].attr('x1'), 25.91792656587473, 'windspeed[0] x1');
      assert.equal(windprofile.svgNode.children()[0].children()[1].children()[0].attr('y1'), 0, 'windspeed[0] y1');
      assert.equal(windprofile.svgNode.children()[0].children()[1].children()[0].attr('x2'), 25.91792656587473, 'windspeed[0] x2');
      assert.equal(windprofile.svgNode.children()[0].children()[1].children()[0].attr('y2'), 100, 'windspeed[0] y2');
      assert.equal(windprofile.svgNode.children()[0].children()[1].children()[0].attr('stroke'), 'red', 'windspeed[0] color');
      assert.equal(windprofile.svgNode.children()[0].children()[1].children()[0].attr('stroke-width'), 4, 'windspeed[0] width');
      assert.equal(windprofile.svgNode.children()[0].children()[1].children()[0].attr('stroke-dasharray'), '2 2', 'windspeed[0] dasharray');
    });
    it('invisible grid', () => {
      const svgNode = SVG().size(100,100);
      const coordinateSystem = new SkewTlogPDiagram();
      const windprofile = new WindspeedProfile({
        svgNode,
        coordinateSystem,
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        grid: {
          isobars: {
            visible: false
          },
          isotachs: {
            visible: false
          }
        }
      });
      assert.equal(windprofile.svgNode.children()[0].children().length, 0, 'background nodes');
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
  it('default getHoverSounding', () => {
    const soundings = Array.from({length: 3}, () => {
      const s = new Sounding();
      return new DiagramSounding(s);
    });
    const plotArea = new WindspeedProfile();
    assert.ok(plotArea._getHoverSounding !== undefined, 'internal getHoverSounding function');
    soundings.map(s => plotArea.addSounding(s));
    assert.equal(plotArea.hoverLabelsSounding, soundings[0], 'all visible: hover first sounding');
    soundings[0].visible = false;
    assert.equal(plotArea.hoverLabelsSounding, soundings[1], 'first invisible: hover second sounding');
    soundings[1].visible = false;
    assert.equal(plotArea.hoverLabelsSounding, soundings[2], 'only third visible: hover third sounding');
    soundings[2].visible = false;
    assert.equal(plotArea.hoverLabelsSounding, undefined, 'no visible sounding');
    soundings[1].visible = true;
    assert.equal(plotArea.hoverLabelsSounding, soundings[1], 'only second visible: hover second sounding');
    soundings[2].visible = true;
    assert.equal(plotArea.hoverLabelsSounding, soundings[1], 'second and third visible: hover second sounding');
  });
  it('custom getHoverSounding', () => {
    const soundings = Array.from({length: 3}, () => {
      const s = new Sounding();
      return new DiagramSounding(s);
    });
    const getHoverSounding = s => {
      for (const sounding of s) {
        if (sounding == soundings[2])
          return sounding
      }
      return undefined;
    };
    const plotArea = new WindspeedProfile({
      hoverLabels: {
        getHoverSounding
      }
    });
    assert.equal(plotArea._getHoverSounding, getHoverSounding, 'internal getHoverSounding function');
    soundings.map(s => plotArea.addSounding(s));
    assert.equal(plotArea.hoverLabelsSounding, soundings[2], 'all visible: hover third sounding');
    soundings[0].visible = false;
    assert.equal(plotArea.hoverLabelsSounding, soundings[2], 'first invisible: hover third sounding');
    soundings[1].visible = false;
    assert.equal(plotArea.hoverLabelsSounding, soundings[2], 'only third visible: hover third sounding');
    soundings[2].visible = false;
    assert.equal(plotArea.hoverLabelsSounding, undefined, 'no visible sounding');
    soundings[1].visible = true;
    assert.equal(plotArea.hoverLabelsSounding, undefined, 'only second visible: hover nothing');
    soundings[2].visible = true;
    assert.equal(plotArea.hoverLabelsSounding, soundings[2], 'second and third visible: hover third sounding');
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