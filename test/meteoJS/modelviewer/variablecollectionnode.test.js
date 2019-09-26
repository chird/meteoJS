const assert = require("assert");
import VariableCollection
  from '../../../src/meteoJS/modelviewer/VariableCollection.js';
import VariableCollectionNode
  from '../../../src/meteoJS/modelviewer/VariableCollectionNode.js';
import { VariableCollectionNode as VariableCollectionNodeClass }
  from '../../../src/meteoJS/modelviewer/VariableCollectionNode.js';

describe('Default VariableCollectionNode, import via default', () => {
  it('children', () => {
    let appendCounter = 0;
    let node1 = new VariableCollectionNode(new VariableCollection({ id: '1' }));
    node1.on('append:child', child => {
      appendCounter++;
    });
    let node2 = new VariableCollectionNode(new VariableCollection({ id: '2' }));
    let node3 = new VariableCollectionNode(new VariableCollection({ id: '3' }));
    node1.appendChild(node2).appendChild(node3);
    assert.equal(node1.children.length, 2, 'node1 has 2 children');
    assert.equal(appendCounter, 2, 'two append events');
    assert.ok(node1.children[0] === node2, 'first child is node2');
    assert.ok(node1.children[1] === node3, 'last child is node3');
    assert.equal(node2.parents.length, 1, 'node2 has one parent');
    assert.ok(node2.parents[0] === node1, 'node2\'s parent is node1');
    assert.equal(node3.parents.length, 1, 'node3 has one parent');
    assert.ok(node3.parents[0] === node1, 'node3\'s parent is node1');
    node1.removeChild(node2).removeChild(node3);
    assert.equal(node1.children.length, 0, 'node1 has no children');
    assert.equal(node2.parents.length, 0, 'node2 has no parent');
    assert.equal(node3.parents.length, 0, 'node3 has no parent');
    node1.appendChild(node2, node3);
    assert.equal(node1.children.length, 2, 'node1 has 2 children');
    assert.equal(appendCounter, 4, 'another two append events');
    node1.removeChild(node2, node3);
    assert.equal(node1.children.length, 0, 'node1 has no children');
  });
  it('parents', () => {
    let node1 = new VariableCollectionNode(new VariableCollection({ id: '1' }));
    let node2 = new VariableCollectionNode(new VariableCollection({ id: '2' }));
    let node3 = new VariableCollectionNode(new VariableCollection({ id: '3' }));
    node1._addParent(node2);
    assert.equal(node1.parents.length, 1, 'node1 has one parent');
    node1._addParent(node3);
    assert.equal(node1.parents.length, 2, 'node1 has two parents');
    assert.ok(node1.parents[0] === node2, 'first parent is node2');
    assert.ok(node1.parents[1] === node3, 'last parent is node3');
    node1._removeParent(node2);
    assert.equal(node1.parents.length, 1);
    assert.ok(node1.parents[0] === node3, 'first parent is node3');
  });
});
describe('VariableCollectionNode class, import via name', () => {
  it('constructor test', () => {
    let vc = new VariableCollection();
    let node = new VariableCollectionNode(vc);
    assert.ok(node.variableCollection === vc);
  });
});