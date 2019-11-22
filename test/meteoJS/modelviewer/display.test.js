import assert from 'assert';
import 'jsdom-global/register';
import Modelviewer from '../../../src/meteoJS/Modelviewer.js';
import makeResources from './helperCreateResources.js';
import Container from '../../../src/meteoJS/modelviewer/Container.js';
import Display from '../../../src/meteoJS/modelviewer/Display.js';
import { Display as DisplayClass }
  from '../../../src/meteoJS/modelviewer/Display.js';

describe('modelviewer/Display', () => {
  let resources = makeResources();
  it('Display - manual init', () => {
    let d = new Display();
    assert.equal(d.modelviewer, undefined, 'modelviewer');
    assert.equal(d.container, undefined, 'container');
    assert.equal(d.parentNode, undefined, 'parentNode');
    let m = new Modelviewer({ resources });
    let c = new Container();
    m.append(c);
    assert.ok(c.containerNode instanceof HTMLElement, 'containerNode');
    c.containerNode.appendChild(document.createElement('div'));
    assert.equal(c.containerNode.childNodes.length, 1, 'containerNode.childNodes');
    c.display = d;
    assert.equal(d.modelviewer, m, 'modelviewer');
    assert.equal(d.container, c, 'container');
    assert.ok(d.parentNode instanceof HTMLElement, 'parentNode');
    assert.equal(d.parentNode.childNodes.length, 0, 'parentNode.childNodes');
    let node = document.createElement('div');
    node.appendChild(document.createElement('div'));
    d.parentNode = node;
    assert.equal(d.modelviewer, m, 'modelviewer');
    assert.equal(d.container, c, 'container');
    assert.notEqual(d.container.containerNode, node, 'containerNode');
    assert.equal(d.parentNode, node, 'parentNode');
    assert.equal(d.parentNode.childNodes.length, 0, 'parentNode.childNodes');
  });
  it('Display - early container assignment', () => {
    let d = new Display();
    assert.equal(d.modelviewer, undefined, 'modelviewer');
    assert.equal(d.container, undefined, 'container');
    assert.equal(d.parentNode, undefined, 'parentNode');
    let c = new Container({
      display: d
    });
    assert.equal(d.modelviewer, undefined, 'modelviewer');
    assert.equal(d.container, c, 'container');
    assert.equal(d.container.containerNode, undefined, 'containerNode');
    assert.equal(d.parentNode, undefined, 'parentNode');
    let node = document.createElement('div');
    node.appendChild(document.createElement('div'));
    assert.equal(node.childNodes.length, 1, 'parentNode.childNodes');
    c.containerNode = node;
    assert.equal(d.modelviewer, undefined, 'modelviewer');
    assert.equal(d.container, c, 'container');
    assert.equal(d.container.containerNode, node, 'containerNode');
    assert.equal(d.parentNode, node, 'parentNode');
    assert.equal(d.parentNode.childNodes.length, 0, 'parentNode.childNodes');
    node.appendChild(document.createElement('div'));
    assert.equal(d.parentNode.childNodes.length, 1, 'parentNode.childNodes');
    let m = new Modelviewer({ resources });
    m.append(c);
    assert.equal(d.modelviewer, m, 'modelviewer');
    assert.equal(d.container, c, 'container');
    assert.equal(d.container.containerNode, node, 'containerNode');
    assert.equal(d.parentNode, node, 'parentNode');
    assert.equal(d.parentNode.childNodes.length, 0, 'parentNode.childNodes');
  });
  it('Display - late container assignment', () => {
    let d = new Display();
    assert.equal(d.modelviewer, undefined, 'modelviewer');
    assert.equal(d.container, undefined, 'container');
    assert.equal(d.parentNode, undefined, 'parentNode');
    let m = new Modelviewer({ resources });
    let node = document.createElement('div');
    node.appendChild(document.createElement('div'));
    let c = new Container();
    c.containerNode = node;
    assert.equal(c.containerNode, node, 'containerNode');
    assert.equal(c.containerNode.childNodes.length, 1, 'containerNode.childNodes');
    m.append(c);
    assert.equal(c.containerNode, node, 'containerNode');
    assert.equal(c.containerNode.childNodes.length, 1, 'containerNode.childNodes');
    c.display = d;
    assert.equal(d.modelviewer, m, 'modelviewer');
    assert.equal(d.container, c, 'container');
    assert.equal(d.parentNode, node, 'parentNode');
    assert.equal(c.containerNode.childNodes.length, 0, 'containerNode.childNodes');
    assert.equal(d.parentNode.childNodes.length, 0, 'parentNode.childNodes');
  });
  it('Display class, import via name', () => {
    let c = new DisplayClass();
    assert.equal(c.modelviewer, undefined, 'modelviewer');
  });
});