import assert from 'assert';
import {
  getFirstDefinedValue,
  getNormalizedLineStyleOptions,
  getNormalizedFontOptions,
  drawWindbarbInto
} from '../../../src/meteoJS/thermodynamicDiagram/Functions.js';
import { createSVGWindow } from 'svgdom';
import { SVG, registerWindow } from '@svgdotjs/svg.js';
global.window = createSVGWindow();
global.document = window.document;

registerWindow(global.window, global.document);

describe('Function tests', () => {
  it('getFirstDefinedValue', () => {
    assert.equal(getFirstDefinedValue(undefined), undefined, 'undefined');
    assert.equal(getFirstDefinedValue(1), 1, '1');
    assert.equal(getFirstDefinedValue('A'), 'A', 'A');
    assert.equal(Object.keys(getFirstDefinedValue({ a: 1, b: 2 })).length, 2, 'Object');
    assert.equal(getFirstDefinedValue({ a: 1, b: 2 }).a, 1, 'Object');
    assert.equal(getFirstDefinedValue({ a: 1, b: 'c' }).b, 'c', 'Object');
    assert.equal(getFirstDefinedValue(undefined, undefined), undefined, 'undefined');
    assert.equal(getFirstDefinedValue(1, undefined), 1, '1');
    assert.equal(getFirstDefinedValue('A', undefined), 'A', 'A');
    assert.equal(getFirstDefinedValue(undefined, 1), 1, '1');
    assert.equal(getFirstDefinedValue(undefined, 'A'), 'A', 'A');
    assert.equal(getFirstDefinedValue(1, 'A'), 1, '1');
    assert.equal(Object.keys(getFirstDefinedValue({ a: 1, b: 'c' }, { c: 1 }, { d: 'e', f: 10, g: 100 })).length,
      2, 'Object');
    assert.equal(Object.keys(getFirstDefinedValue(undefined, { c: 1 }, { d: 'e', f: 10, g: 100 })).length,
      1, 'Object');
  });
  it('getNormalizedLineStyleOptions', () => {
    const empty = getNormalizedLineStyleOptions();
    assert.equal(Object.keys(empty).length, 2, 'empty');
    assert.equal(empty.color, 'black', 'empty');
    assert.equal(empty.width, 1, 'empty');
    const red = getNormalizedLineStyleOptions({ color: 'red' });
    assert.equal(Object.keys(red).length, 2, 'red');
    assert.equal(red.color, 'red', 'red');
    assert.equal(red.width, 1, 'red');
    const dasharray = getNormalizedLineStyleOptions({ dasharray: 3 });
    assert.equal(Object.keys(dasharray).length, 3, 'dasharray');
    assert.equal(dasharray.color, 'black', 'dasharray');
    assert.equal(dasharray.width, 1, 'dasharray');
    assert.equal(dasharray.dasharray, 3, 'dasharray');
    const green = getNormalizedLineStyleOptions({ color: 'green', dasharray: 3 });
    assert.equal(Object.keys(green).length, 3, 'green');
    assert.equal(green.color, 'green', 'green');
    assert.equal(green.width, 1, 'green');
    assert.equal(green.dasharray, 3, 'green');
    const pink = getNormalizedLineStyleOptions({ color: 'pink'}, { dasharray: 4 });
    assert.equal(Object.keys(pink).length, 3, 'pink');
    assert.equal(pink.color, 'pink', 'pink');
    assert.equal(pink.width, 1, 'pink');
    assert.equal(pink.dasharray, 4, 'pink');
  });
  it('getNormalizedFontOptions', () => {
    const empty = getNormalizedFontOptions();
    assert.equal(Object.keys(empty).length, 2, 'empty');
    assert.equal(empty.size, 12, 'empty');
    assert.equal(empty.color, 'black', 'empty');
    const red = getNormalizedFontOptions({ color: 'red' });
    assert.equal(Object.keys(red).length, 2, 'red');
    assert.equal(red.size, 12, 'red');
    assert.equal(red.color, 'red', 'red');
    const anchor = getNormalizedFontOptions({ color: 'red' }, { anchor: 'start' });
    assert.equal(Object.keys(anchor).length, 3, 'anchor');
    assert.equal(anchor.size, 12, 'anchor');
    assert.equal(anchor.color, 'red', 'anchor');
    assert.equal(anchor.anchor, 'start', 'anchor');
    const alignment = getNormalizedFontOptions({ color: 'red' }, { 'alignment-baseline': 'bottom', fill: 'white' });
    assert.equal(Object.keys(alignment).length, 4, 'alignment');
    assert.equal(alignment.size, 12, 'alignment');
    assert.equal(alignment.color, 'red', 'alignment');
    assert.equal(alignment['alignment-baseline'], 'bottom', 'alignment');
    assert.equal(alignment.fill, 'white', 'alignment');
    const fill = getNormalizedFontOptions({ color: 'red', fill: 'white' }, { 'alignment-baseline': 'bottom' });
    assert.equal(Object.keys(fill).length, 4, 'fill');
    assert.equal(fill.size, 12, 'fill');
    assert.equal(fill.color, 'red', 'fill');
    assert.equal(fill['alignment-baseline'], 'bottom', 'fill');
    assert.equal(fill.fill, 'white', 'fill');
  });
  it('drawWindbarbInto', () => {
    const node = SVG().size(100,100);
    drawWindbarbInto({
      node,
      x: 50,
      y: 50,
      wspd: 34,
      wdir: 270
    });
    assert.equal(node.children().length, 1, 'children');
    assert.equal(node.children()[0].children().length, 2, 'windbarb group children');
  });
});