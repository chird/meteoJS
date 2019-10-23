import assert from 'assert';
import 'jsdom-global/register';
import $ from 'jquery';
import makeResources from './modelviewer/helperCreateResources.js';
import Container from '../../src/meteoJS/modelviewer/Container.js';
import Display from '../../src/meteoJS/modelviewer/Display.js';
import Modelviewer from '../../src/meteoJS/Modelviewer.js';
import { Modelviewer as ModelviewerClass }
  from '../../src/meteoJS/Modelviewer.js';

describe('Modelviewer class, import via default', () => {
  let resources = makeResources();
  it('simple constructor', () => {
    let m = new Modelviewer();
    assert.ok(m.timeline !== undefined, 'Timeline object');
    assert.equal(m.containersNode, undefined, 'containersNode');
  });
  it('append containers', () => {
    let a = new Container();
    let b = new Container();
    let c = new Container({ id: 'a' });
    let d = new Container({ id: 'container1' });
    let m = new Modelviewer({ resources });
    m.append(a,b,c);
    assert.equal(m.count, 3, '3 containers');
    assert.equal(m.itemIds[0], 'container1', 'id1');
    assert.equal(m.itemIds[1], 'container2', 'id2');
    assert.equal(m.itemIds[2], 'a', 'id3');
    assert.equal(a.modelviewer, m, 'modelviewer of a');
    assert.equal(b.modelviewer, m, 'modelviewer of b');
    assert.equal(c.modelviewer, m, 'modelviewer of c');
    assert.equal(d.modelviewer, undefined, 'modelviewer of d');
    m.append(d);
    assert.equal(m.count, 3, '3 containers');
    assert.equal(a.modelviewer, undefined, 'modelviewer of a');
    assert.equal(b.modelviewer, m, 'modelviewer of b');
    assert.equal(c.modelviewer, m, 'modelviewer of c');
    assert.equal(d.modelviewer, m, 'modelviewer of d');
  });
  it('append container with same id', () => {
    let a = new Container();
    let b = new Container();
    let c = new Container({ id: 'a' });
    let d = new Container({ id: 'container1' });
    let m = new Modelviewer({ resources });
    m.append(a,b,c,d);
    assert.equal(m.count, 4, '4 containers');
    assert.equal(m.itemIds[0], 'container2', 'id1');
    assert.equal(m.itemIds[1], 'container3', 'id2');
    assert.equal(m.itemIds[2], 'a', 'id3');
    assert.equal(m.itemIds[3], 'container1', 'id4');
    assert.equal(a.modelviewer, m, 'modelviewer of a');
    assert.equal(b.modelviewer, m, 'modelviewer of b');
    assert.equal(c.modelviewer, m, 'modelviewer of c');
    assert.equal(d.modelviewer, m, 'modelviewer of d');
  });
  it('DOM with containers', () => {
    let display = new Display();
    let cA = new Container({ display });
    let cB = new Container({ display });
    let containersNode = document.createElement('div');
    let m = new Modelviewer({
      resources,
      containersNode
    });
    assert.equal(m.containersNode, containersNode, 'containersNode');
    m.append(cA, cB);
    assert.equal(containersNode.children.length, 2, '2 child nodes');
    assert.equal(containersNode.children[0].nodeName, 'DIV', 'div child node');
  });
  it('DOM with containers, own function', () => {
    let display = new Display();
    let cA = new Container({ display });
    let cB = new Container({ display });
    let cC = new Container({ display });
    let cD = new Container({ display });
    let containersNode = document.createElement('div');
    
    let i = 0;
    let currentRow = undefined;
    let makeContainerNode = cN => {
      if (cN.children.length == 0 ||
          i % 2 == 0) {
        currentRow = document.createElement('div');
        currentRow.classList.add('row');
        cN.append(currentRow);
      }
      let containerSpan = document.createElement('span');
      currentRow.append(containerSpan);
      i++
      return containerSpan;
    };
    
    let m = new Modelviewer({
      resources,
      containersNode,
      makeContainerNode
    });
    m.append(cA);
    assert.equal(containersNode.children.length, 1, '1 row');
    assert.equal(containersNode.children[0].nodeName, 'DIV', 'div child node');
    assert.equal(containersNode.children[0].nodeName, 'DIV', 'has row class');
    assert.equal(cA.containerNode.nodeName, 'SPAN', 'container has node');
    assert.equal(cB.containerNode, undefined, 'container hasnt node');
    assert.equal(cC.containerNode, undefined, 'container hasnt node');
    assert.equal(cD.containerNode, undefined, 'container hasnt node');
    m.append(cB, cC, cD);
    assert.equal(containersNode.children.length, 2, '2 rows');
    assert.equal(containersNode.children[0].children.length, 2, '2 cols');
    assert.equal(containersNode.children[1].children.length, 2, '2 cols');
    assert.equal(containersNode.children[0].children[0].nodeName, 'SPAN', 'span col');
    assert.equal(cA.containerNode.nodeName, 'SPAN', 'container has node');
    assert.equal(cB.containerNode.nodeName, 'SPAN', 'container has node');
    assert.equal(cC.containerNode.nodeName, 'SPAN', 'container has node');
    assert.equal(cD.containerNode.nodeName, 'SPAN', 'container has node');
  });
  it('jQuery DOM', () => {
    let containersNode = $('<div>');
    let m = new Modelviewer({
      resources,
      containersNode,
      makeContainerNode: cN => {
        let node = $('<div>');
        $(cN).append(node);
        return node;
      }
    });
    assert.equal(typeof m.containersNode, 'object', 'typeof containersNode');
    assert.equal(m.containersNode.jquery, undefined, 'containersNode');
    let display = new Display();
    let c = new Container({ display });
    m.append(c);
    assert.equal(m.containersNode.children.length, 1, '1 container div');
  });
});
describe('Modelviewer class, import via name', () => {
  it('simple', () => {
    let m = new ModelviewerClass();
    assert.ok(m.timeline !== undefined, 'Timeline object');
  });
});