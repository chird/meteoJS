﻿import assert from 'assert';
import { createSVGWindow, Event } from 'svgdom';
import { SVG, registerWindow } from '@svgdotjs/svg.js';
global.window = createSVGWindow();
global.document = window.document;
import SkewTlogPDiagram from '../../../src/meteoJS/thermodynamicDiagram/coordinateSystem/SkewTlogPDiagram.js';
import Sounding from '../../../src/meteoJS/Sounding.js';
import Parcel from '../../../src/meteoJS/sounding/Parcel.js';
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
      assert.equal(Object.keys(diagram.options[key]).length, 9, key);
      assert.equal(diagram.options[key].visible, true, 'visible');
      assert.ok(Object.keys(diagram.options[key].style).length >= 2, 'style');
      assert.equal(diagram.options[key].style.width, 1, 'width');
      assert.equal(diagram.options[key].interval, undefined, 'interval');
      assert.equal(diagram.options[key].lines, undefined, 'lines');
      assert.equal(diagram.options[key].max, undefined, 'max');
      assert.equal(diagram.options[key].min, undefined, 'min');
      assert.equal(diagram.options[key].maxPressure, undefined, 'maxPressure');
    });
    assert.equal(diagram.options.isobars.style.color, 'black', 'isobars.style.color');
    assert.equal(diagram.options.isotherms.style.color, 'black', 'isotherms.style.color');
    assert.equal(diagram.options.dryadiabats.style.color, 'black', 'dryadiabats.style.color');
    assert.equal(diagram.options.pseudoadiabats.style.color, 'rgb(102, 51, 0)', 'pseudoadiabats.style.color');
    assert.equal(diagram.options.mixingratio.style.color, 'rgb(102, 51, 0)', 'mixingratio.style.color');
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
    const coordinateSystem = new SkewTlogPDiagram({ pressure: { max: 1000 } });
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
    assert.equal(diagram._hoverLabelsGroup.children()[0].array()[1][0], 60, 'pres x1');
    assert.equal(diagram._hoverLabelsGroup.children()[3].attr().r, 4, 'temp circle');
    assert.equal(diagram._hoverLabelsGroup.children()[3].attr().fill, 'green', 'temp circle');
    assert.equal(diagram._hoverLabelsGroup.children()[5].attr().r, 5, 'temp circle');
    assert.equal(diagram._hoverLabelsGroup.children()[5].attr().fill, 'blue', 'temp circle');
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
    const coordinateSystem = new SkewTlogPDiagram({ width: 200, pressure: { max: 1000 } });
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
    assert.equal(diagram._hoverLabelsGroup.children()[1].children()[1].attr('text-anchor'), 'end', 'text-anchor');
    assert.equal(diagram._hoverLabelsGroup.children()[7].attr().r, 10, 'temp circle');
    assert.equal(diagram._hoverLabelsGroup.children()[7].attr().fill, 'green', 'temp circle');
    assert.equal(diagram._hoverLabelsGroup.children()[5].attr().r, 5, 'temp circle');
    assert.equal(diagram._hoverLabelsGroup.children()[5].attr().fill, 'blue', 'temp circle');
    assert.equal(diagram._hoverLabelsGroup.children()[6].children()[1].attr('font-size'), 50, 'font-size');
    assert.equal(diagram._hoverLabelsGroup.children()[6].children()[1].attr('color'), 'yellow', 'color');
  });
  it('default getHoverSounding', () => {
    const soundings = Array.from({length: 3}, () => {
      const s = new Sounding();
      return new DiagramSounding(s);
    });
    const plotArea = new TDDiagram();
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
    const plotArea = new TDDiagram({
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
  it('parcels', () => {
    const diagram = new TDDiagram();
    assert.equal(diagram._soundings.size, 0, 'soundings size');
    assert.equal(diagram._parcels.size, 0, 'parcels size');
    const s1 = new DiagramSounding(new Sounding());
    s1.sounding.parcelCollection
      .append(new Parcel({ id: 'p1', pres: 1000, tmpc: 30, dwpc: 0 }))
      .append(new Parcel({ id: 'p2', pres: 1000, tmpc: 30, dwpc: 0 }));
    const s2 = new DiagramSounding(new Sounding());
    const s3 = new DiagramSounding(new Sounding());
    diagram.addSounding(s1);
    diagram.addSounding(s2);
    diagram.addSounding(s3);
    assert.equal(diagram._soundings.size, 3, 'soundings size');
    assert.equal(diagram._parcels.size, 3, 'parcels size');
    assert.ok(diagram._parcels.has(s1), 'has s1');
    assert.ok(diagram._parcels.get(s1).parcelsGroup === undefined, 'parcelsGroup');
    assert.equal(diagram._parcels.get(s1).parcelsGroups.size, 0, 'parcelsGroups size');
    assert.ok(diagram._parcels.get(s1).addItemListenerKey !== undefined, 'addItemListenerKey');
    assert.equal(diagram._parcels.get(s1).changeVisibleListeners.length, 2, 'changeVisibleListeners');
    assert.equal(diagram._parcels.get(s1).changeOptionsListeners.length, 2, 'changeOptionsListeners');
    assert.ok(diagram._parcels.has(s2), 'has s2');
    assert.ok(diagram._parcels.get(s2).parcelsGroup === undefined, 'parcelsGroup');
    assert.equal(diagram._parcels.get(s2).parcelsGroups.size, 0, 'parcelsGroups size');
    assert.ok(diagram._parcels.get(s2).addItemListenerKey !== undefined, 'addItemListenerKey');
    assert.equal(diagram._parcels.get(s2).changeVisibleListeners.length, 0, 'changeVisibleListeners');
    assert.equal(diagram._parcels.get(s2).changeOptionsListeners.length, 0, 'changeOptionsListeners');
    assert.ok(diagram._parcels.has(s3), 'has s3');
    assert.ok(diagram._parcels.get(s3).parcelsGroup === undefined, 'parcelsGroup');
    assert.equal(diagram._parcels.get(s3).parcelsGroups.size, 0, 'parcelsGroups size');
    assert.ok(diagram._parcels.get(s3).addItemListenerKey !== undefined, 'listenerKey');
    assert.equal(diagram._parcels.get(s3).changeVisibleListeners.length, 0, 'changeVisibleListeners');
    assert.equal(diagram._parcels.get(s3).changeOptionsListeners.length, 0, 'changeOptionsListeners');
    assert.equal(Object.keys(s1.diagramParcelCollection.listeners['add:item']).length, 1, 'add:item listener');
    assert.equal(Object.keys(s2.diagramParcelCollection.listeners['add:item']).length, 1, 'add:item listener');
    assert.equal(Object.keys(s3.diagramParcelCollection.listeners['add:item']).length, 1, 'add:item listener');
    diagram.removeSounding(s2);
    assert.equal(diagram._parcels.size, 2, 'parcels size');
    assert.ok(diagram._parcels.has(s1), 'has s1');
    assert.ok(diagram._parcels.get(s1).parcelsGroup === undefined, 'parcelsGroup');
    assert.ok(diagram._parcels.get(s1).addItemListenerKey !== undefined, 'addItemListenerKey');
    assert.ok(!diagram._parcels.has(s2), '!has s2');
    assert.ok(diagram._parcels.has(s3), 'has s3');
    assert.ok(diagram._parcels.get(s3).parcelsGroup === undefined, 'parcelsGroup');
    assert.ok(diagram._parcels.get(s3).addItemListenerKey !== undefined, 'addItemListenerKey');
    assert.equal(Object.keys(s1.diagramParcelCollection.listeners['add:item']).length, 1, 'add:item listener');
    assert.equal(Object.keys(s2.diagramParcelCollection.listeners['add:item']).length, 0, 'add:item listener');
    assert.equal(Object.keys(s3.diagramParcelCollection.listeners['add:item']).length, 1, 'add:item listener');
    diagram.coordinateSystem = new SkewTlogPDiagram();
    assert.ok(diagram._parcels.get(s1).parcelsGroup !== undefined, 'parcelsGroup');
    assert.equal(diagram._parcels.get(s1).parcelsGroups.size, 2, 'parcelsGroups size');
    assert.ok(diagram._parcels.get(s3).parcelsGroup !== undefined, 'parcelsGroup');
    assert.equal(diagram._parcels.get(s3).parcelsGroups.size, 0, 'parcelsGroups size');
    s3.addParcel(new Parcel({ id: 'p3', pres: 1000, tmpc: 30, dwpc: 0 }));
    assert.ok(diagram._parcels.get(s3).parcelsGroup !== undefined, 'parcelsGroup');
    assert.equal(diagram._parcels.get(s3).parcelsGroups.size, 1, 'parcelsGroups size');
    assert.ok(diagram._parcels.get(s3).addItemListenerKey !== undefined, 'addItemListenerKey');
    assert.equal(diagram._parcels.get(s3).changeVisibleListeners.length, 1, 'changeVisibleListeners');
    assert.equal(diagram._parcels.get(s3).changeOptionsListeners.length, 1, 'changeOptionsListeners');
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