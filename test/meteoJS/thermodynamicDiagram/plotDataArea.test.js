import assert from 'assert';
import { createSVGWindow } from 'svgdom';
import { SVG, registerWindow } from '@svgdotjs/svg.js';
const window = createSVGWindow();
const document = window.document;
import SkewTlogPDiagram from '../../../src/meteoJS/thermodynamicDiagram/coordinateSystem/SkewTlogPDiagram.js';
import DiagramSounding from '../../../src/meteoJS/thermodynamicDiagram/DiagramSounding.js';
import { default as PlotDataArea, PlotDataArea as PlotDataAreaClass }
  from '../../../src/meteoJS/thermodynamicDiagram/PlotDataArea.js';

registerWindow(window, document);

describe('PlotDataArea class, import via default', () => {
  it('Inheritiance tests', () => {
    let svgNode = SVG();
    let coordinateSystem = new SkewTlogPDiagram();
    let plotArea = new PlotDataArea({
      svgNode,
      coordinateSystem,
      x: 10,
      y: 20,
      width: 200,
      height: 150,
      visible: false,
      style: {
        overflow: 'visible',
        display: 'inline'
      }
    });
    assert.equal(plotArea.x, 10, 'x');
    assert.equal(plotArea.y, 20, 'y');
    assert.equal(plotArea.width, 200, 'width');
    assert.equal(plotArea.height, 150, 'height');
    assert.equal(plotArea.visible, false, 'visible');
    assert.equal(Object.keys(plotArea.style).length, 2, 'style');
    assert.equal(plotArea.style.overflow, 'visible', 'overflow');
    assert.equal(plotArea.style.display, 'none', 'display');
  });
  it('Add/remove soundings', () => {
    const plotArea = new PlotDataArea();
    assert.equal(plotArea.svgNode.children().length, 2, 'svgNode.children');
    assert.equal(plotArea.svgNode.children()[0].children().length, 0, 'svgNode background');
    let soundingsNode = plotArea.svgNode.children()[1];
    assert.equal(soundingsNode.children().length, 0, 'svgNode data');
    
    let s1 = new DiagramSounding();
    let s2 = new DiagramSounding();
    plotArea.addSounding(s1);
    plotArea.addSounding(s2);
    assert.equal(plotArea.svgNode.children()[0].children().length, 0, 'svgNode background');
    assert.equal(soundingsNode.children().length, 2, 'svgNode data');
    assert.equal(soundingsNode.children()[0].css('display'), 'inline', 'display sounding');
    assert.equal(soundingsNode.children()[1].css('display'), 'inline', 'display sounding');
    s2.visible = false;
    assert.equal(soundingsNode.children()[0].css('display'), 'inline', 'display sounding');
    assert.equal(soundingsNode.children()[1].css('display'), 'none', 'display sounding');
    
    plotArea.removeSounding(s1);
    assert.equal(plotArea._svgNode.children()[1].children().length, 1, 'svgNode data');
    
    plotArea.coordinateSystem = new SkewTlogPDiagram();
    assert.equal(plotArea.svgNode.children().length, 2, 'svgNode.children');
    assert.equal(plotArea.svgNode.children()[0].children().length, 0, 'svgNode background');
    assert.equal(soundingsNode.children().length, 1, 'svgNode data');
  });
});
describe('PlotDataArea class, import via name', () => {
  it('empty object', () => {
    let svgNode = SVG();
    let coordinateSystem = new SkewTlogPDiagram();
    let plotArea = new PlotDataAreaClass({
      svgNode,
      coordinateSystem
    });
    assert.equal(plotArea.x, 0, 'x');
    assert.equal(plotArea.y, 0, 'y');
    assert.equal(plotArea.width, 100, 'width');
    assert.equal(plotArea.height, 100, 'height');
  });
});