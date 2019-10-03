const assert = require("assert");
import Container from '../../src/meteoJS/modelviewer/Container.js';
import Modelviewer from '../../src/meteoJS/Modelviewer.js';
import { Modelviewer as ModelviewerClass }
  from '../../src/meteoJS/Modelviewer.js';

describe('Modelviewer class, import via default', () => {
  it('simple constructor', () => {
    let m = new Modelviewer();
    assert.ok(m.timeline !== undefined, 'Timeline object');
  });
  it('append containers', () => {
    let a = new Container();
    let b = new Container();
    let c = new Container({ id: 'a' });
    let d = new Container({ id: 'container1' });
    let m = new Modelviewer();
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
    let m = new Modelviewer();
    m.append(a,b,c,d);
    assert.equal(m.count, 4, '4 containers');
    assert.equal(m.itemIds[0], 'container2', 'id1');
    assert.equal(m.itemIds[1], 'container3', 'id2');
    assert.equal(m.itemIds[2], 'a', 'id3');
    assert.equal(m.itemIds[3], 'container1', 'id4');
  });
});
describe('Modelviewer class, import via name', () => {
  it('simple', () => {
    let m = new ModelviewerClass();
    assert.ok(m.timeline !== undefined, 'Timeline object');
  });
});