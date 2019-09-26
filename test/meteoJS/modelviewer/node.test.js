const assert = require("assert");
import Resource
  from '../../../src/meteoJS/modelviewer/Resource.js';
import VariableCollection
  from '../../../src/meteoJS/modelviewer/VariableCollection.js';
import Node from '../../../src/meteoJS/modelviewer/Node.js';
import { Node as NodeClass } from '../../../src/meteoJS/modelviewer/Node.js';

describe('Default Node, import via default', () => {
  describe('children', () => {
    it('simple append', () => {
      let appendCounter = 0;
      let node1 = new Node(new VariableCollection({ id: '1' }));
      node1.on('append:child', child => {
        appendCounter++;
      });
      let node2 = new Node(new VariableCollection({ id: '2' }));
      let node3 = new Node(new VariableCollection({ id: '3' }));
      node1.appendChild(node2).appendChild(node3);
      assert.equal(node1.children.length, 2, 'node1 has 2 children');
      assert.equal(appendCounter, 2, 'two append events');
      assert.ok(node1.children[0] === node2, 'first child is node2');
      assert.ok(node1.children[1] === node3, 'last child is node3');
      assert.equal(node2.parents.length, 1, 'node2 has one parent');
      assert.ok(node2.parents[0] === node1, 'node2\'s parent is node1');
      assert.equal(node3.parents.length, 1, 'node3 has one parent');
      assert.ok(node3.parents[0] === node1, 'node3\'s parent is node1');
    });
    it('multi append', () => {
      let appendCounter = 0;
      let node1 = new Node(new VariableCollection({ id: '1' }));
      node1.on('append:child', child => {
        appendCounter++;
      });
      let node2 = new Node(new VariableCollection({ id: '2' }));
      let node3 = new Node(new VariableCollection({ id: '3' }));
      node1.appendChild(node2, node3);
      assert.equal(node1.children.length, 2, 'node1 has 2 children');
      assert.equal(appendCounter, 2, 'two append events');
      assert.ok(node1.children[0] === node2, 'first child is node2');
      assert.ok(node1.children[1] === node3, 'last child is node3');
      assert.equal(node2.parents.length, 1, 'node2 has one parent');
      assert.ok(node2.parents[0] === node1, 'node2\'s parent is node1');
      assert.equal(node3.parents.length, 1, 'node3 has one parent');
      assert.ok(node3.parents[0] === node1, 'node3\'s parent is node1');
    });
  });
  it('parents', () => {
    let node1 = new Node(new VariableCollection({ id: '1' }));
    let node2 = new Node(new VariableCollection({ id: '2' }));
    let node3 = new Node(new VariableCollection({ id: '3' }));
    node1._addParent(node2);
    assert.equal(node1.parents.length, 1, 'node1 has one parent');
    node1._addParent(node3);
    assert.equal(node1.parents.length, 2, 'node1 has two parents');
    assert.ok(node1.parents[0] === node2, 'first parent is node2');
    assert.ok(node1.parents[1] === node3, 'last parent is node3');
  });
  it('resources', () => {
    let r1 = new Resource();
    let r2 = new Resource();
    let r3 = new Resource();
    let r4 = new Resource();
    let r5 = new Resource();
    let node = new Node(new VariableCollection({ id: 'test' }));
    node.append(r1);
    node.append(r2);
    assert.equal(node.resources.length, 2, '2 resources');
    node.append(r3, r4, r5);
    assert.equal(node.resources.length, 5, '5 resources');
    node.remove(r2, r4);
    assert.equal(node.resources.length, 3, '3 resources');
  });
});
describe('Node class, import via name', () => {
  it('constructor test', () => {
    let vc = new VariableCollection();
    let node = new NodeClass(vc);
    assert.ok(node.variableCollection === vc);
  });
});