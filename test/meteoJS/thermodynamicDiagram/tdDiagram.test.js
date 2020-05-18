﻿import assert from 'assert';
import { createSVGWindow } from 'svgdom';
import { Event } from 'svgdom/src/dom/Event';
import { SVG, registerWindow } from '@svgdotjs/svg.js';
global.window = createSVGWindow();
global.document = window.document;
import SkewTlogPDiagram from '../../../src/meteoJS/thermodynamicDiagram/coordinateSystem/SkewTlogPDiagram.js';
import Sounding from '../../../src/meteoJS/Sounding.js';
import DiagramSounding from '../../../src/meteoJS/thermodynamicDiagram/DiagramSounding.js';
import { default as TDDiagram, TDDiagram as TDDiagramClass }
  from '../../../src/meteoJS/thermodynamicDiagram/TDDiagram.js';

registerWindow(global.window, global.document);

describe('TDDiagram class, import via default', () => {
  it('Default options', () => {
    let svgNode = SVG().size(300,300);
    let coordinateSystem = new SkewTlogPDiagram();
    let diagram = new TDDiagram({
      svgNode,
      coordinateSystem,
      x: 0,
      y: 0,
      width: 100,
      height: 100
    });
    assert.equal(Object.keys(diagram.options).length, 5, 'options');
    ['isobars', 'isotherms', 'dryadiabats', 'pseudoadiabats', 'mixingratio'].forEach(key => {
      assert.equal(Object.keys(diagram.options[key]).length, 7, key);
      assert.equal(diagram.options[key].visible, true, 'visible');
      assert.equal(Object.keys(diagram.options[key].style).length, 6, 'style');
      assert.equal(diagram.options[key].style.width, 1, 'width');
      assert.equal(diagram.options[key].interval, undefined, 'interval');
      assert.equal(diagram.options[key].lines, undefined, 'lines');
      assert.equal(diagram.options[key].max, undefined, 'max');
      assert.equal(diagram.options[key].min, undefined, 'min');
    });
    assert.equal(diagram.options.isobars.style.color, 'black', 'isobars.style.color');
    assert.equal(diagram.options.isotherms.style.color, 'black', 'isotherms.style.color');
    assert.equal(diagram.options.dryadiabats.style.color, 'green', 'dryadiabats.style.color');
    assert.equal(diagram.options.pseudoadiabats.style.color, 'blue', 'pseudoadiabats.style.color');
    assert.equal(diagram.options.mixingratio.style.color, 'red', 'mixingratio.style.color');
    assert.ok(diagram.options.isotherms.highlightedLines instanceof Array, 'isotherms highlightedLines');
    assert.ok(diagram.options.isotherms.highlightedLines.length, 1, 'isotherms highlightedLines length');
    assert.ok(diagram.options.isotherms.highlightedLines[0], 273.15, 'isotherms highlightedLines');
  });
  it('hoverLabels defaults', () => {
    const sounding = new Sounding();
    for (let pres=1000; pres>=100; pres-=50) {
      const tmpk = 73.15 + (Math.floor(Math.random() * 4000) - 2000) / 100;
      sounding.addLevel({
        pres,
        tmpk,
        dwpk: tmpk - Math.floor(Math.random() * 3000)/100
      });
    }
    const s = new DiagramSounding(sounding, {
      diagram: {
        temp: {
          style: {
            color: 'red',
            width: 5
          }
        },
        dewp: {
          style: {
          color: 'blue',
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
    const diagram = new TDDiagram({
      svgNode,
      coordinateSystem,
      x: 50,
      y: 50,
      width: 200,
      height: 200
    });
    diagram.addSounding(s);
    assert.ok(diagram.isHoverLabelsRemote, 'isHoverLabelsRemote');
    assert.equal(diagram._hoverLabelsGroup.children().length, 0, 'hoverLabelsGroup');
    diagram._svgNode.dispatchEvent(mousemoveEvent);
    assert.equal(diagram._hoverLabelsGroup.children().length, 9, 'hoverLabelsGroup');
    assert.equal(diagram._hoverLabelsGroup.children()[0].array()[0][0], 0, 'pres x0');
    assert.equal(diagram._hoverLabelsGroup.children()[0].array()[1][0], 10, 'pres x1');
    assert.equal(diagram._hoverLabelsGroup.children()[3].attr().r, 4.5, 'temp circle');
    assert.equal(diagram._hoverLabelsGroup.children()[3].attr().fill, 'red', 'temp circle');
    assert.equal(diagram._hoverLabelsGroup.children()[6].attr().r, 3.5, 'temp circle');
    assert.equal(diagram._hoverLabelsGroup.children()[6].attr().fill, 'blue', 'temp circle');
  });
  it('hoverLabels options tests', () => {
    const sounding = new Sounding();
    for (let pres=1000; pres>=100; pres-=50) {
      const tmpk = 73.15 + (Math.floor(Math.random() * 4000) - 2000) / 100;
      sounding.addLevel({
        pres,
        tmpk,
        dwpk: tmpk - Math.floor(Math.random() * 3000)/100
      });
    }
    const s = new DiagramSounding(sounding);
    const mousemoveEvent = new Event('mousemove');
    mousemoveEvent.pageX = 100;
    mousemoveEvent.pageY = 100;
    
    let insertFuncCounter = 0;
    const svgNode = SVG().size(300,300);
    const coordinateSystem = new SkewTlogPDiagram();
    const diagram = new TDDiagram({
      svgNode,
      coordinateSystem,
      x: 50,
      y: 50,
      width: 200,
      height: 200,
      hoverLabels: {
        pres: {
          length: '100%',
          align: 'right',
          style: {
            width: 3
          }
        },
        temp: {
          radius: 10,
          style: {
            color: 'green'
          }
        },
        dewp: {
          font: {
            size: 50,
            color: 'yellow'
          }
        }
      }
    });
    diagram.addSounding(s);
    assert.ok(diagram.isHoverLabelsRemote, 'isHoverLabelsRemote');
    assert.equal(diagram._hoverLabelsGroup.children().length, 0, 'hoverLabelsGroup');
    diagram._svgNode.dispatchEvent(mousemoveEvent);
    assert.equal(diagram._hoverLabelsGroup.children().length, 9, 'hoverLabelsGroup');
    assert.equal(diagram._hoverLabelsGroup.children()[0].array()[0][0], 0, 'pres x0');
    assert.equal(diagram._hoverLabelsGroup.children()[0].array()[1][0], 200, 'pres x1');
    assert.equal(diagram._hoverLabelsGroup.children()[0].attr('stroke-width'), 3, 'stroke-width');
    assert.equal(diagram._hoverLabelsGroup.children()[2].attr('text-anchor'), 'end', 'text-anchor');
    assert.equal(diagram._hoverLabelsGroup.children()[3].attr().r, 10, 'temp circle');
    assert.equal(diagram._hoverLabelsGroup.children()[3].attr().fill, 'green', 'temp circle');
    assert.equal(diagram._hoverLabelsGroup.children()[6].attr().r, 2.5, 'temp circle');
    assert.equal(diagram._hoverLabelsGroup.children()[6].attr().fill, 'black', 'temp circle');
    assert.equal(diagram._hoverLabelsGroup.children()[8].attr('font-size'), 50, 'font-size');
    assert.equal(diagram._hoverLabelsGroup.children()[8].attr('color'), 'yellow', 'color');
  });
});
describe('TDDiagram class, import via name', () => {
  it('empty object', () => {
    let svgNode = SVG();
    let coordinateSystem = new SkewTlogPDiagram();
    let diagram = new TDDiagramClass({
      svgNode,
      coordinateSystem
    });
    assert.equal(diagram.x, 0, 'x');
    assert.equal(diagram.y, 0, 'y');
    assert.equal(diagram.width, 100, 'width');
    assert.equal(diagram.height, 100, 'height');
  });
});