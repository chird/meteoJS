import assert from 'assert';
import { createSVGWindow } from 'svgdom';
import { SVG, registerWindow } from '@svgdotjs/svg.js';
const window = createSVGWindow();
const document = window.document;
import SkewTlogPDiagram from '../../../src/meteoJS/thermodynamicDiagram/coordinateSystem/SkewTlogPDiagram.js';
import { default as TDDiagram, TDDiagram as TDDiagramClass }
  from '../../../src/meteoJS/thermodynamicDiagram/TDDiagram.js';

registerWindow(window, document);

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