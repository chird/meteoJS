import assert from 'assert';
import { createSVGWindow } from 'svgdom';
import { SVG, registerWindow } from '@svgdotjs/svg.js';
const window = createSVGWindow();
const document = window.document;
import SkewTlogPDiagram from '../../../src/meteoJS/thermodynamicDiagram/coordinateSystem/SkewTlogPDiagram.js';
import { default as PlotArea, PlotArea as PlotAreaClass }
  from '../../../src/meteoJS/thermodynamicDiagram/PlotArea.js';

registerWindow(window, document);

describe('PlotArea class, import via default', () => {
  it('Construction tests', () => {
    let svgNode = SVG().size(300,300);
    let coordinateSystem = new SkewTlogPDiagram();
    let plotArea = new PlotArea({
      svgNode,
      coordinateSystem,
      x: 10,
      y: 20,
      width: 200,
      height: 150
    });
    assert.equal(svgNode.children().length, 1, 'children');
    assert.equal(plotArea._svgNode.children().length, 1, '_svgNode.children');
    assert.equal(plotArea._svgNode.attr('x'), 10, 'x');
    assert.equal(plotArea.x, 10, 'x');
    assert.equal(plotArea._svgNode.attr('y'), 20, 'y');
    assert.equal(plotArea.y, 20, 'y');
    assert.equal(plotArea._svgNode.attr('width'), 200, 'width');
    assert.equal(plotArea.width, 200, 'width');
    assert.equal(plotArea._svgNode.attr('height'), 150, 'height');
    assert.equal(plotArea.height, 150, 'height');
    assert.equal(plotArea.minExtentLength, 150, 'minExtentLength');
    assert.equal(plotArea.maxExtentLength, 200, 'maxExtentLength');
    assert.equal(plotArea._svgNode.css('display'), 'inline', 'visible');
    assert.equal(plotArea.visible, true, 'visible');
    assert.ok(plotArea.coordinateSystem !== undefined, 'coordinateSystem');
    assert.equal(plotArea._svgNode.css('overflow'), 'hidden', 'overflow');
    assert.equal(Object.keys(plotArea.style).length, 2, 'style');
    assert.equal(plotArea.style.overflow, 'hidden', 'overflow');
    assert.equal(plotArea.style.display, 'inline', 'display');
    
    let plotArea2 = new PlotArea({
      svgNode,
      coordinateSystem,
      x: 150,
      y: 200,
      width: 300,
      height: 400,
      visible: false,
      style: {
        overflow: 'visible',
        display: 'inline'
      }
    });
    assert.equal(plotArea2.x, 150, 'x');
    assert.equal(plotArea2.y, 200, 'y');
    assert.equal(plotArea2.width, 300, 'width');
    assert.equal(plotArea2.height, 400, 'height');
    assert.equal(plotArea2.minExtentLength, 300, 'minExtentLength');
    assert.equal(plotArea2.maxExtentLength, 400, 'maxExtentLength');
    assert.equal(plotArea2.visible, false, 'visible');
    assert.equal(Object.keys(plotArea2.style).length, 2, 'style');
    assert.equal(plotArea2.style.overflow, 'visible', 'overflow');
    assert.equal(plotArea2.style.display, 'none', 'display');
  });
  it('Property/events tests', () => {
    let svgNode = SVG();
    let coordinateSystem = new SkewTlogPDiagram();
    let plotArea = new PlotArea({
      svgNode,
      coordinateSystem
    });
    let changeVisibleCounter = 0;
    plotArea.on('change:visible', () => changeVisibleCounter++);
    let changePositionCounter = 0;
    plotArea.on('change:position', () => changePositionCounter++);
    let changeExtentCounter = 0;
    plotArea.on('change:extent', () => changeExtentCounter++);
    assert.equal(plotArea.visible, true, 'visible');
    plotArea.visible = false;
    assert.equal(plotArea.visible, false, 'visible');
    assert.equal(changeVisibleCounter, 1, 'changeVisibleCounter');
    plotArea.x = 10;
    plotArea.y = 20;
    assert.equal(plotArea.x, 10, 'x');
    assert.equal(plotArea.y, 20, 'y');
    assert.equal(changePositionCounter, 2, 'changePositionCounter');
    plotArea.width = 150;
    plotArea.height = 50;
    assert.equal(plotArea.width, 150, 'width');
    assert.equal(plotArea.height, 50, 'height');
    assert.equal(plotArea.minExtentLength, 50, 'minExtentLength');
    assert.equal(plotArea.maxExtentLength, 150, 'minExtentLength');
    assert.equal(changeExtentCounter, 2, 'changeExtentCounter');
  });
});
describe('PlotArea class, import via name', () => {
  it('empty object', () => {
    let svgNode = SVG();
    let coordinateSystem = new SkewTlogPDiagram();
    let plotArea = new PlotAreaClass({
      svgNode,
      coordinateSystem
    });
    assert.equal(plotArea.x, 0, 'x');
    assert.equal(plotArea.y, 0, 'y');
    assert.equal(plotArea.width, 100, 'width');
    assert.equal(plotArea.height, 100, 'height');
  });
});