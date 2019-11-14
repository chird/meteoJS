const assert = require("assert");
import Resource
  from '../../../src/meteoJS/modelviewer/Resource.js';
import Variable from '../../../src/meteoJS/modelviewer/Variable.js';
import VariableCollection
  from '../../../src/meteoJS/modelviewer/VariableCollection.js';
import Node from '../../../src/meteoJS/modelviewer/Node.js';
import { Node as NodeClass } from '../../../src/meteoJS/modelviewer/Node.js';

describe('Default Node, import via default', () => {
  describe('children', () => {
    it('simple append', () => {
      let appendCounter = 0;
      let node1 = new Node(new VariableCollection({ id: '1' }));
      assert.equal(node1.variableCollection.node, node1, 'VariableCollectoin\'s Node');
      node1.on('append:child', child => {
        appendCounter++;
      });
      let node2 = new Node(new VariableCollection({ id: '2' }));
      assert.equal(node2.variableCollection.node, node2, 'VariableCollectoin\'s Node');
      let node3 = new Node(new VariableCollection({ id: '3' }));
      assert.equal(node3.variableCollection.node, node3, 'VariableCollectoin\'s Node');
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
  it ('empty resource', () => {
    let r = new Resource();
    let node = new Node(new VariableCollection({ id: 'test' }));
    node.append(r);
    assert.equal(node.resources.length, 0, 'no resources');
  });
  it('resources', () => {
    let vc = new VariableCollection({ id: 'testA' });
    let v1 = new Variable({ id: 'Test1' });
    let v2 = new Variable({ id: 'Test2' });
    let v3 = new Variable({ id: 'Test3' });
    vc.append(v1, v2, v3);
    let vcB = new VariableCollection({ id: 'testB' });
    let v4 = new Variable({ id: 'Test4' });
    let v5 = new Variable({ id: 'Test5' });
    vcB.append(v4, v5);
    let r1 = new Resource({ variables: [v1] });
    let r2 = new Resource({ variables: [v2] });
    let r3 = new Resource({ variables: [v3] });
    let r4 = new Resource({ variables: [v1, v4] });
    let r5 = new Resource({ variables: [v5] });
    assert.equal(r1.getVariableByVariableCollection(vc).id, 'Test1', 'Variable r1');
    assert.equal(r2.getVariableByVariableCollection(vc).id, 'Test2', 'Variable r2');
    assert.equal(r3.getVariableByVariableCollection(vc).id, 'Test3', 'Variable r3');
    assert.equal(r4.getVariableByVariableCollection(vc).id, 'Test1', 'Variable r4');
    assert.equal(r5.getVariableByVariableCollection(vc).id, undefined, 'Variable r5');
    let node = new Node(vc);
    node.append(r1);
    node.append(r2);
    assert.equal(node.resources.length, 2, '2 resources');
    assert.equal(node._resources.size, 1, 'internal: 1 variableCollections in _resources');
    for (let s of node._resources.values())
      assert.equal(s.size, 2, 'internal: 2 Resources in the Set');
    node.append(r3, r4, r5);
    assert.equal(node.resources.length, 4, '4 resources');
    assert.equal(node._resources.size, 2, 'internal: 2 variableCollections in _resources');
    let _resourcesIterator = node._resources.entries();
    let firstSet = _resourcesIterator.next().value;
    assert.equal(firstSet[0].id, 'testA', 'internal: First collection is A in _resources');
    assert.equal(firstSet[1].size, 4, 'internal: 4 Resources in the first Set of _resources');
    let secondSet = _resourcesIterator.next().value;
    assert.equal(secondSet[0].id, 'testB', 'internal: Second collection is B in _resources');
    assert.equal(secondSet[1].size, 1, 'internal: 1 Resources in the second Set of _resources');
  });
  it('getResourcesByVariables', () => {
    let vc = new VariableCollection({ id: 'test' });
    let v1 = new Variable({ id: 'Test1' });
    let v2 = new Variable({ id: 'Test2' });
    let v3 = new Variable({ id: 'Test3' });
    let vc1 = new VariableCollection({ id: 'testA' });
    let v4 = new Variable({ id: 'Test4' });
    vc1.append(v4);
    let v5 = new Variable({ id: 'Test5' });
    vc.append(v1, v2, v3, v5);
    let r1 = new Resource({ variables: [v1] });
    let r2 = new Resource({ variables: [v2] });
    let r3 = new Resource({ variables: [v3] });
    let r4 = new Resource({ variables: [v1, v4] });
    let r5 = new Resource({ variables: [v5] });
    let node = new Node(vc);
    node.append(r1, r2, r3, r4, r5);
    assert.equal(node.resources.length, 5, '5 resources');
  });
});
describe('Node class, import via name', () => {
  it('constructor test', () => {
    let vc = new VariableCollection();
    let node = new NodeClass(vc);
    assert.ok(node.variableCollection === vc);
  });
});