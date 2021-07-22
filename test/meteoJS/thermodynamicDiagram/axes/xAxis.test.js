import assert from 'assert';
import { createSVGWindow, Event } from 'svgdom';
import { SVG, registerWindow } from '@svgdotjs/svg.js';
global.window = createSVGWindow();
global.document = window.document;
import SkewTlogPDiagram from '../../../../src/meteoJS/thermodynamicDiagram/coordinateSystem/SkewTlogPDiagram.js';
import {
  default as xAxis,
  xAxis as xAxisClass
} from '../../../../src/meteoJS/thermodynamicDiagram/axes/xAxis.js';

registerWindow(global.window, global.document);

describe('xAxis class, import via default', () => {
  it('default construction', () => {
    let svgNode = SVG();
    let coordinateSystem = new SkewTlogPDiagram();
    let diagram = new xAxis({
      svgNode,
      coordinateSystem,
      title: {
        text: 'test'
      }
    });
    assert.equal(diagram.x, 0, 'x');
    assert.equal(diagram.y, 0, 'y');
    assert.equal(diagram.width, 100, 'width');
    assert.equal(diagram.height, 100, 'height');
    assert.equal(Object.keys(diagram._labelsOptions).length, 6, 'labelsOptions keys() count');
    assert.equal(diagram._labelsOptions.visible, true, 'labelsOptions.visible');
    assert.equal(diagram._labelsOptions.interval, 10, 'labelsOptions.interval');
    assert.equal(diagram._labelsOptions.unit, '°C', 'labelsOptions.unit');
    assert.equal(diagram._labelsOptions.prefix, '', 'labelsOptions.prefix');
    assert.equal(diagram._labelsOptions.decimalPlaces, 0, 'labelsOptions.decimalPlaces');
    assert.equal(Object.keys(diagram._labelsOptions.font).length, 3, 'labelsOptions.font keys() count');
    assert.equal(diagram._labelsOptions.font.size, 11, 'labelsOptions.font.size');
    assert.equal(diagram._labelsOptions.font.color, 'black', 'labelsOptions.font.color');
    assert.equal(diagram._labelsOptions.font.anchor, 'middle', 'labelsOptions.font.anchor');
    assert.equal(diagram.svgNode.children()[0].children().length, 2, '2 groups');
    assert.equal(Object.keys(diagram._titleOptions).length, 3, 'titleOptions keys() count');
    assert.equal(diagram._titleOptions.visible, true, 'titleOptions.visible');
    assert.equal(diagram._titleOptions.text, 'test', 'titleOptions.text');
    assert.equal(Object.keys(diagram._titleOptions.font).length, 3, 'titleOptions.font keys() count');
    assert.equal(diagram._titleOptions.font.size, 12, 'titleOptions.font.size');
    assert.equal(diagram._titleOptions.font.color, 'black', 'titleOptions.font.color');
    assert.equal(diagram._titleOptions.font.anchor, 'middle', 'titleOptions.font.anchor');
    assert.equal(diagram.svgNode.children()[0].children()[0].children().length, 9, 'Label count');
    assert.equal(diagram.svgNode.children()[0].children()[0].children().map(el => el.text()).join(','), '-40,-30,-20,-10,0,10,20,30,40', 'labels text');
    assert.equal(diagram.svgNode.children()[0].children()[0].children()[0].cx(), 0, 'labels cx');
    assert.equal(diagram.svgNode.children()[0].children()[0].children()[0].cy(), 11, 'labels cy');
    assert.equal(diagram.svgNode.children()[0].children()[0].children()[0].fill(), 'black', 'labels color');
    assert.equal(diagram.svgNode.children()[0].children()[0].children()[0].attr('font-size'), 11, 'labels font-size');
    assert.equal(diagram.svgNode.children()[0].children()[0].children()[0].attr('text-anchor'), 'middle', 'labels text-anchor');
    assert.equal(diagram.svgNode.children()[0].children()[1].children().length, 1, 'Title elements');
    assert.equal(diagram.svgNode.children()[0].children()[1].children()[0].text(), 'test', 'Title text');
    assert.equal(diagram.svgNode.children()[0].children()[1].children()[0].cx(), 50, 'title cx');
    assert.equal(diagram.svgNode.children()[0].children()[0].bbox().height, 14.97998046875, 'labels group height');
    assert.equal(diagram.svgNode.children()[0].children()[1].children()[0].cy(), 14.97998046875 + 12, 'title cy');
    assert.equal(diagram.svgNode.children()[0].children()[1].children()[0].fill(), 'black', 'Title color');
    assert.equal(diagram.svgNode.children()[0].children()[1].children()[0].attr('font-size'), 12, 'Title font-size');
    assert.equal(diagram.svgNode.children()[0].children()[1].children()[0].attr('text-anchor'), 'middle', 'Title text-anchor');
  });
  it('changed labels options, no title', () => {
    let svgNode = SVG();
    let coordinateSystem = new SkewTlogPDiagram();
    let diagram = new xAxis({
      svgNode,
      coordinateSystem,
      labels: {
        interval: 20,
        unit: 'K',
        prefix: ' K',
        decimalPlaces: 1,
        font: {
          size: 8,
          color: 'red',
          anchor: 'start'
        }
      },
      title: {
        visible: false
      }
    });
    assert.equal(diagram.x, 0, 'x');
    assert.equal(diagram.y, 0, 'y');
    assert.equal(diagram.width, 100, 'width');
    assert.equal(diagram.height, 100, 'height');
    assert.equal(Object.keys(diagram._labelsOptions).length, 6, 'labelsOptions keys() count');
    assert.equal(diagram._labelsOptions.visible, true, 'labelsOptions.visible');
    assert.equal(diagram._labelsOptions.interval, 20, 'labelsOptions.interval');
    assert.equal(diagram._labelsOptions.unit, 'K', 'labelsOptions.unit');
    assert.equal(diagram._labelsOptions.prefix, ' K', 'labelsOptions.prefix');
    assert.equal(diagram._labelsOptions.decimalPlaces, 1, 'labelsOptions.decimalPlaces');
    assert.equal(Object.keys(diagram._labelsOptions.font).length, 3, 'labelsOptions.font keys() count');
    assert.equal(diagram._labelsOptions.font.size, 8, 'labelsOptions.font.size');
    assert.equal(diagram._labelsOptions.font.color, 'red', 'labelsOptions.font.color');
    assert.equal(diagram._labelsOptions.font.anchor, 'start', 'labelsOptions.font.anchor');
    assert.equal(Object.keys(diagram._titleOptions).length, 3, 'titleOptions keys() count');
    assert.equal(diagram._titleOptions.visible, false, 'titleOptions.visible');
    assert.equal(diagram.svgNode.children()[0].children().length, 1, '2 groups');
    assert.equal(diagram.svgNode.children()[0].children()[0].children().length, 4, 'Label count');
    assert.equal(diagram.svgNode.children()[0].children()[0].children().map(el => el.text()).join(','), '240.0 K,260.0 K,280.0 K,300.0 K', 'labels text');
    assert.equal(diagram.svgNode.children()[0].children()[0].children()[0].cx(), 21.76585477941179, 'labels x');
    assert.equal(diagram.svgNode.children()[0].children()[0].children()[0].cy(), 8, 'labels cy');
    assert.equal(diagram.svgNode.children()[0].children()[0].children()[0].fill(), 'red', 'labels color');
    assert.equal(diagram.svgNode.children()[0].children()[0].children()[0].attr('font-size'), 8, 'labels font-size');
    assert.equal(diagram.svgNode.children()[0].children()[0].children()[0].attr('text-anchor'), 'start', 'labels text-anchor');
  });
  it('changed title options, no labels', () => {
    let svgNode = SVG();
    let coordinateSystem = new SkewTlogPDiagram();
    let diagram = new xAxis({
      svgNode,
      coordinateSystem,
      labels: {
        visible: false
      },
      title: {
        text: 'windspeed',
        font: {
          size: 15,
          color: 'green',
          anchor: 'end'
        }
      }
    });
    assert.equal(diagram.x, 0, 'x');
    assert.equal(diagram.y, 0, 'y');
    assert.equal(diagram.width, 100, 'width');
    assert.equal(diagram.height, 100, 'height');
    assert.equal(Object.keys(diagram._labelsOptions).length, 6, 'labelsOptions keys() count');
    assert.equal(diagram._labelsOptions.visible, false, 'labelsOptions.visible');
    assert.equal(Object.keys(diagram._titleOptions).length, 3, 'titleOptions keys() count');
    assert.equal(diagram._titleOptions.visible, true, 'titleOptions.visible');
    assert.equal(diagram._titleOptions.text, 'windspeed', 'titleOptions.text');
    assert.equal(Object.keys(diagram._titleOptions.font).length, 3, 'titleOptions.font keys() count');
    assert.equal(diagram._titleOptions.font.size, 15, 'titleOptions.font.size');
    assert.equal(diagram._titleOptions.font.color, 'green', 'titleOptions.font.color');
    assert.equal(diagram._titleOptions.font.anchor, 'end', 'titleOptions.font.anchor');
    assert.equal(diagram.svgNode.children()[0].children().length, 1, '2 groups');
    assert.equal(diagram.svgNode.children()[0].children()[0].children().length, 1, 'text node count');
    assert.equal(diagram.svgNode.children()[0].children()[0].children()[0].text(), 'windspeed', 'title text');
    assert.equal(diagram.svgNode.children()[0].children()[0].children()[0].bbox().x2, 50, 'title x2');
    assert.equal(diagram.svgNode.children()[0].children()[0].children()[0].cy(), 15, 'title cy');
    assert.equal(diagram.svgNode.children()[0].children()[0].children()[0].fill(), 'green', 'title color');
    assert.equal(diagram.svgNode.children()[0].children()[0].children()[0].attr('font-size'), 15, 'title font-size');
    assert.equal(diagram.svgNode.children()[0].children()[0].children()[0].attr('text-anchor'), 'end', 'title text-anchor');
  });
});
describe('xAxis class, import via name', () => {
  it('empty object', () => {
    let svgNode = SVG();
    let coordinateSystem = new SkewTlogPDiagram();
    let diagram = new xAxisClass({
      svgNode,
      coordinateSystem
    });
    assert.equal(diagram.x, 0, 'x');
    assert.equal(diagram.y, 0, 'y');
    assert.equal(diagram.width, 100, 'width');
    assert.equal(diagram.height, 100, 'height');
  });
});