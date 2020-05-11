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
    let svgNode = SVG();
    let coordinateSystem = new SkewTlogPDiagram();
    let plotArea = new PlotDataArea({
      svgNode,
      coordinateSystem
    });
    assert.equal(svgNode.children().length, 1, 'children');
    assert.equal(plotArea._svgNode.children().length, 2, '_svgNode.children');
    assert.equal(plotArea._svgNode.children()[0].children().length, 0, '_svgNode background');
    let soundingsNode = plotArea._svgNode.children()[1];
    assert.equal(soundingsNode.children().length, 0, '_svgNode data');
    
    let s1 = new DiagramSounding();
    let s2 = new DiagramSounding();
    plotArea.addSounding(s1);
    plotArea.addSounding(s2);
    assert.equal(plotArea._svgNode.children()[0].children().length, 0, '_svgNode background');
    assert.equal(soundingsNode.children().length, 2, '_svgNode data');
    assert.equal(soundingsNode.children()[0].css('display'), 'inline', 'display sounding');
    assert.equal(soundingsNode.children()[1].css('display'), 'inline', 'display sounding');
    s2.visible = false;
    assert.equal(soundingsNode.children()[0].css('display'), 'inline', 'display sounding');
    assert.equal(soundingsNode.children()[1].css('display'), 'none', 'display sounding');
    
    plotArea.removeSounding(s1);
    assert.equal(plotArea._svgNode.children()[1].children().length, 1, '_svgNode data');
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