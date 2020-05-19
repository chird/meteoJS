import assert from 'assert';
import { createSVGWindow } from 'svgdom';
import { Event } from 'svgdom/src/dom/Event';
import { SVG, registerWindow } from '@svgdotjs/svg.js';
global.window = createSVGWindow();
global.document = window.document;
import SkewTlogPDiagram from '../../../src/meteoJS/thermodynamicDiagram/coordinateSystem/SkewTlogPDiagram.js';
import { default as PlotArea, PlotArea as PlotAreaClass }
  from '../../../src/meteoJS/thermodynamicDiagram/PlotArea.js';

registerWindow(global.window, global.document);

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
  it('late addTo', () => {
    const coordinateSystem = new SkewTlogPDiagram();
    const plotArea = new PlotArea({
      coordinateSystem,
      x: 10,
      y: 20,
      width: 200,
      height: 150
    });
    assert.ok(plotArea.svgNode !== undefined, 'svgNode');
    assert.equal(plotArea.svgNode.children().length, 1, 'svgNode.children');
    assert.equal(plotArea.svgNode.attr('x'), 10, 'x');
    assert.equal(plotArea.x, 10, 'x');
    assert.equal(plotArea.svgNode.attr('y'), 20, 'y');
    assert.equal(plotArea.y, 20, 'y');
    assert.equal(plotArea.svgNode.attr('width'), 200, 'width');
    assert.equal(plotArea.width, 200, 'width');
    assert.equal(plotArea.svgNode.attr('height'), 150, 'height');
    assert.equal(plotArea.height, 150, 'height');
    assert.equal(plotArea.minExtentLength, 150, 'minExtentLength');
    assert.equal(plotArea.maxExtentLength, 200, 'maxExtentLength');
    assert.equal(plotArea.svgNode.css('display'), 'inline', 'visible');
    assert.equal(plotArea.visible, true, 'visible');
    assert.equal(plotArea.svgNode.css('overflow'), 'hidden', 'overflow');
    assert.equal(Object.keys(plotArea.style).length, 2, 'style');
    assert.equal(plotArea.style.overflow, 'hidden', 'overflow');
    assert.equal(plotArea.style.display, 'inline', 'display');
    
    const svgNode = SVG().size(300,300);
    plotArea.addTo(svgNode);
    assert.equal(svgNode.children().length, 1, 'children');
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
  it('click/mouse/touch events', () => {
    const makeEventTest = (type, counterInc) => {
      return e => {
        assert.equal(e.type, type, 'type');
        assert.ok('elementX' in e, 'elementX');
        assert.equal(e.elementX, 100, 'elementX');
        assert.ok('elementY' in e, 'elementY');
        assert.equal(e.elementY, 50, 'elementY');
        counterInc();
      };
    };
    const eventKeys = [
      'click',
      'dblclick',
      'mousedown',
      'mouseup',
      'mouseover',
      'mouseout',
      'mousemove',
      'touchstart',
      'touchmove',
      'touchleave',
      'touchend',
      'touchcancel'
    ];
    const svgNode = SVG();
    const coordinateSystem = new SkewTlogPDiagram();
    let counters = {};
    let onCounters = {};
    let events = {};
    eventKeys.forEach(eventKey => {
      counters[eventKey] = 0;
      events[eventKey] = makeEventTest(eventKey, () => counters[eventKey]++);
    });
    const plotArea = new PlotArea({
      svgNode,
      coordinateSystem,
      events
    });
    eventKeys.forEach(eventKey => {
      onCounters[eventKey] = 0;
      plotArea.on(eventKey, makeEventTest(eventKey, () => onCounters[eventKey]++));
    });
    eventKeys.forEach(eventKey => {
      const e = new Event(eventKey);
      e.pageX = 100;
      e.pageY = 50;
      plotArea._svgNode.dispatchEvent(e);
    });
    eventKeys.forEach(eventKey => {
      assert.equal(counters[eventKey], 1, `counters ${eventKey}`);
      assert.equal(onCounters[eventKey], 1, `onCounters ${eventKey}`);
    });
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