import assert from 'assert';
import { createSVGWindow } from 'svgdom';
import { registerWindow } from '@svgdotjs/svg.js';
const window = createSVGWindow();
const document = window.document;
import {
  default as ThermodynamicDiagram,
  ThermodynamicDiagram as ThermodynamicDiagramClass
} from '../../src/meteoJS/thermodynamicDiagram.js';
import Sounding from '../../src/meteoJS/Sounding.js';
import DiagramSounding from '../../src/meteoJS/thermodynamicDiagram/DiagramSounding.js';

registerWindow(window, document);

describe('Thermodynamic diagram: default appearance', () => {
  it('350x300', () => {
    let renderTo = document.createElement('div');
    renderTo.clientWidth = 350;
    renderTo.clientHeight = 300;
    let td = new ThermodynamicDiagram({
      renderTo,
      width: 350,
      height: 300
    });
    [
      td.getDiagramPlotArea(),
      td.xAxis,
      td.yAxis,
      td.windprofile,
      td.hodograph
    ].forEach(element => {
      assert.equal(element.visible, true, 'visible');
      assert.equal(Object.keys(element.style).length, 2, 'style length');
      assert.equal(element.style.display, 'inline', 'display');
      assert.equal(element.style.overflow, 'hidden', 'overflow');
    });
    assert.equal(td.getDiagramPlotArea().x, 49, 'td.getDiagramPlotArea().x');
    assert.equal(td.getDiagramPlotArea().y, 17.5, 'td.getDiagramPlotArea().y');
    assert.equal(td.getDiagramPlotArea().width, 220.5, 'td.getDiagramPlotArea().width');
    assert.equal(td.getDiagramPlotArea().height, 247, 'td.getDiagramPlotArea().height');
    assert.equal(td.xAxis.x, 49, 'td.xAxis.x');
    assert.equal(td.xAxis.y, 264.5, 'td.xAxis.y');
    assert.equal(td.xAxis.width, 220.5, 'td.xAxis.width');
    assert.equal(td.xAxis.height, 18, 'td.xAxis.height');
    assert.equal(td.yAxis.x, 17.5, 'td.yAxis.x');
    assert.equal(td.yAxis.y, 17.5, 'td.yAxis.y');
    assert.equal(td.yAxis.width, 31.5, 'td.yAxis.width');
    assert.equal(td.yAxis.height, 247, 'td.yAxis.height');
    assert.equal(td.windprofile.x, 269.5, 'td.windprofile.x');
    assert.equal(td.windprofile.y, 17.5, 'td.windprofile.y');
    assert.equal(td.windprofile.width, 63, 'td.windprofile.width');
    assert.equal(td.windprofile.height, 247, 'td.windprofile.height');
    assert.equal(td.hodograph.x, 49, 'td.hodograph.x');
    assert.equal(td.hodograph.y, 17.5, 'td.hodograph.y');
    assert.equal(td.hodograph.width, 88.2, 'td.hodograph.width');
    assert.equal(td.hodograph.height, 88.2, 'td.hodograph.height');
  });
  it('730x730', () => {
    let renderTo = document.createElement('div');
    renderTo.clientWidth = 730;
    renderTo.clientHeight = 730;
    let td = new ThermodynamicDiagram({
      renderTo,
      width: 730,
      height: 730
    });
    [
      td.getDiagramPlotArea(),
      td.xAxis,
      td.yAxis,
      td.windprofile,
      td.hodograph
    ].forEach(element => {
      assert.equal(element.visible, true, 'visible');
      assert.equal(Object.keys(element.style).length, 2, 'style length');
      assert.equal(element.style.display, 'inline', 'display');
      assert.equal(element.style.overflow, 'hidden', 'overflow');
    });
    assert.equal(td.getDiagramPlotArea().x, 102.2, 'td.getDiagramPlotArea().x');
    assert.equal(td.getDiagramPlotArea().y, 36.5, 'td.getDiagramPlotArea().y');
    assert.equal(td.getDiagramPlotArea().width, 459.9, 'td.getDiagramPlotArea().width');
    assert.equal(td.getDiagramPlotArea().height, 613.2, 'td.getDiagramPlotArea().height');
    assert.equal(td.xAxis.x, 102.2, 'td.xAxis.x');
    assert.equal(td.xAxis.y, 649.7, 'td.xAxis.y');
    assert.equal(td.xAxis.width, 459.9, 'td.xAxis.width');
    assert.equal(td.xAxis.height, 43.8, 'td.xAxis.height');
    assert.equal(td.yAxis.x, 36.5, 'td.yAxis.x');
    assert.equal(td.yAxis.y, 36.5, 'td.yAxis.y');
    assert.equal(td.yAxis.width, 65.7, 'td.yAxis.width');
    assert.equal(td.yAxis.height, 613.2, 'td.yAxis.height');
    assert.equal(td.windprofile.x, 562.1, 'td.windprofile.x');
    assert.equal(td.windprofile.y, 36.5, 'td.windprofile.y');
    assert.equal(td.windprofile.width, 131.4, 'td.windprofile.width');
    assert.equal(td.windprofile.height, 613.2, 'td.windprofile.height');
    assert.equal(td.hodograph.x, 102.2, 'td.hodograph.x');
    assert.equal(td.hodograph.y, 36.5, 'td.hodograph.y');
    assert.equal(td.hodograph.width, 183.96, 'td.hodograph.width');
    assert.equal(td.hodograph.height, 183.96, 'td.hodograph.height');
  });
  it('1100x600', () => {
    let renderTo = document.createElement('div');
    renderTo.clientWidth = 1100;
    renderTo.clientHeight = 600;
    let td = new ThermodynamicDiagram({
      renderTo,
      width: 1100,
      height: 600
    });
    [
      td.getDiagramPlotArea(),
      td.xAxis,
      td.yAxis,
      td.windprofile,
      td.hodograph
    ].forEach(element => {
      assert.equal(element.visible, true, 'visible');
      assert.equal(Object.keys(element.style).length, 2, 'style length');
      assert.equal(element.style.display, 'inline', 'display');
      assert.equal(element.style.overflow, 'hidden', 'overflow');
    });
    assert.equal(td.getDiagramPlotArea().x, 154, 'td.getDiagramPlotArea().x');
    assert.equal(td.getDiagramPlotArea().y, 55, 'td.getDiagramPlotArea().y');
    assert.equal(td.getDiagramPlotArea().width, 693, 'td.getDiagramPlotArea().width');
    assert.equal(td.getDiagramPlotArea().height, 454, 'td.getDiagramPlotArea().height');
    assert.equal(td.xAxis.x, 154, 'td.xAxis.x');
    assert.equal(td.xAxis.y, 509, 'td.xAxis.y');
    assert.equal(td.xAxis.width, 693, 'td.xAxis.width');
    assert.equal(td.xAxis.height, 36, 'td.xAxis.height');
    assert.equal(td.yAxis.x, 55, 'td.yAxis.x');
    assert.equal(td.yAxis.y, 55, 'td.yAxis.y');
    assert.equal(td.yAxis.width, 99, 'td.yAxis.width');
    assert.equal(td.yAxis.height, 454, 'td.yAxis.height');
    assert.equal(td.windprofile.x, 847, 'td.windprofile.x');
    assert.equal(td.windprofile.y, 55, 'td.windprofile.y');
    assert.equal(td.windprofile.width, 198, 'td.windprofile.width');
    assert.equal(td.windprofile.height, 454, 'td.windprofile.height');
    assert.equal(td.hodograph.x, 154, 'td.hodograph.x');
    assert.equal(td.hodograph.y, 55, 'td.hodograph.y');
    assert.equal(Math.round(td.hodograph.width*10)/10, 181.6, 'td.hodograph.width');
    assert.equal(Math.round(td.hodograph.height*10)/10, 181.6, 'td.hodograph.height');
  });
});
describe('Collection functionality', () => {
  it('Id creation', () => {
    let renderTo = document.createElement('div');
    let td = new ThermodynamicDiagram({
      renderTo,
      height: 300,
      width: 300
    });
    let addItemCounter = 0;
    td.on('add:item', () => addItemCounter++);
    assert.equal(td.count, 0, 'count');
    assert.equal(addItemCounter, 0, 'addItemCounter');
    let ds2 = new DiagramSounding(new Sounding());
    ds2.id = 'sounding-2';
    let ds1 = td.addSounding(new Sounding());
    assert.equal(td.count, 1, 'count');
    assert.equal(addItemCounter, 1, 'addItemCounter');
    td.append(ds2);
    assert.equal(td.count, 2, 'count');
    assert.equal(addItemCounter, 2, 'addItemCounter');
    let ds3 = td.addSounding(new Sounding());
    assert.equal(td.count, 3, 'count');
    assert.equal(addItemCounter, 3, 'addItemCounter');
    assert.equal(ds1.id, 'sounding-1', 'id');
    assert.equal(ds2.id, 'sounding-2', 'id');
    assert.equal(ds3.id, 'sounding-3', 'id');
  });
});