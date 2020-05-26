import assert from 'assert';
import { createSVGWindow } from 'svgdom';
import { Event } from 'svgdom/src/dom/Event';
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