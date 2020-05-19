import assert from 'assert';
import { createSVGWindow } from 'svgdom';
import { SVG, registerWindow } from '@svgdotjs/svg.js';
const window = createSVGWindow();
const document = window.document;
import Sounding from '../../src/meteoJS/Sounding.js';
import StueveDiagram from '../../src/meteoJS/thermodynamicDiagram/coordinateSystem/StueveDiagram.js';
import Emagram from '../../src/meteoJS/thermodynamicDiagram/coordinateSystem/Emagram.js';
import SkewTlogPDiagram from '../../src/meteoJS/thermodynamicDiagram/coordinateSystem/SkewTlogPDiagram.js';
import DiagramSounding from '../../src/meteoJS/thermodynamicDiagram/DiagramSounding.js';
import PlotArea from '../../src/meteoJS/thermodynamicDiagram/PlotArea.js';
import PlotDataArea from '../../src/meteoJS/thermodynamicDiagram/PlotDataArea.js';
import {
  default as ThermodynamicDiagramPluggable,
  ThermodynamicDiagramPluggable as ThermodynamicDiagramPluggableClass
} from '../../src/meteoJS/thermodynamicDiagramPluggable.js';

registerWindow(window, document);

describe('ThermodynamicDiagramPluggable, imported via default', () => {
  it('Id creation', () => {
    let renderTo = document.createElement('div');
    let td = new ThermodynamicDiagramPluggable({
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
  it('exchangeCoordinateSystem', () => {
    const td = new ThermodynamicDiagramPluggable();
    assert.equal(td._plotAreas.size, 0, '_plotAreas size');
    const plotArea1 = new PlotArea();
    const plotArea2 = new PlotDataArea();
    const plotArea3 = new PlotDataArea();
    assert.equal(plotArea1.coordinateSystem, undefined, 'coordinateSystem');
    assert.equal(plotArea2.coordinateSystem, undefined, 'coordinateSystem');
    assert.equal(plotArea3.coordinateSystem, undefined, 'coordinateSystem');
    td
      .appendPlotArea(plotArea1)
      .appendPlotArea(plotArea2)
      .appendPlotArea(plotArea3);
    assert.equal(td._plotAreas.size, 3, '_plotAreas size');
    td
      .appendPlotArea(plotArea2);
    assert.equal(td._plotAreas.size, 3, '_plotAreas size');
    const ds1 = td.addSounding(new Sounding());
    const ds2 = td.addSounding(new Sounding());
    const skewTlogP = new SkewTlogPDiagram();
    const emagram = new Emagram();
    const stueve = new StueveDiagram();
    td.exchangeCoordinateSystem(skewTlogP);
    assert.equal(plotArea1.coordinateSystem, skewTlogP, 'coordinateSystem');
    assert.equal(plotArea2.coordinateSystem, skewTlogP, 'coordinateSystem');
    assert.equal(plotArea3.coordinateSystem, skewTlogP, 'coordinateSystem');
    plotArea3.coordinateSystem = stueve;
    assert.equal(plotArea1.coordinateSystem, skewTlogP, 'coordinateSystem');
    assert.equal(plotArea2.coordinateSystem, skewTlogP, 'coordinateSystem');
    assert.equal(plotArea3.coordinateSystem, stueve, 'coordinateSystem');
    td.exchangeCoordinateSystem(emagram, skewTlogP);
    assert.equal(plotArea1.coordinateSystem, emagram, 'coordinateSystem');
    assert.equal(plotArea2.coordinateSystem, emagram, 'coordinateSystem');
    assert.equal(plotArea3.coordinateSystem, stueve, 'coordinateSystem');
  });
});
describe('ThermodynamicDiagramPluggable, imported via name', () => {
  it('pure SVG', () => {
    const svg = SVG().size(500, 500);
    const td = new ThermodynamicDiagramPluggable({
      renderTo: svg
    });
    assert.equal(td.svgNode.width(), 500, 'width');
    assert.equal(td.svgNode.height(), 500, 'height');
    assert.equal(td.svgNode.children().length, 0, 'children');
    assert.equal(td._plotAreas.size, 0, '_plotAreas size');
    const plotArea1 = new PlotArea();
    const plotArea2 = new PlotDataArea();
    const plotArea3 = new PlotDataArea();
    assert.equal(plotArea2._soundings.size, 0, '_soundings size');
    assert.equal(plotArea3._soundings.size, 0, '_soundings size');
    td.appendPlotArea(plotArea1).appendPlotArea(plotArea2);
    assert.equal(td.svgNode.children().length, 2, 'children');
    assert.equal(td._plotAreas.size, 2, '_plotAreas size');
    const ds1 = td.addSounding(new Sounding());
    const ds2 = td.addSounding(new Sounding());
    assert.equal(plotArea2._soundings.size, 2, '_soundings size');
    td.appendPlotArea(plotArea3);
    assert.equal(td._plotAreas.size, 3, '_plotAreas size');
    assert.equal(plotArea3._soundings.size, 2, '_soundings size');
    const ds3 = td.addSounding(new Sounding());
    assert.equal(plotArea2._soundings.size, 3, '_soundings size');
    assert.equal(plotArea3._soundings.size, 3, '_soundings size');
    td.removePlotArea(plotArea2);
    assert.equal(td._plotAreas.size, 2, '_plotAreas size');
    assert.equal(plotArea2._soundings.size, 0, '_soundings size');
    assert.equal(plotArea3._soundings.size, 3, '_soundings size');
  });
});