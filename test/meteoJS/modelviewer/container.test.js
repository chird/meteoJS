import assert from 'assert';
import { makeResources, fillImageResources } from './helperCreateResources.js';
import Modelviewer from '../../../src/meteoJS/Modelviewer.js';
import Display from '../../../src/meteoJS/modelviewer/Display.js';
import Container from '../../../src/meteoJS/modelviewer/Container.js';
import { Container as ContainerClass }
  from '../../../src/meteoJS/modelviewer/Container.js';

describe('Container class, import via default', () => {
  it('empty constructor', () => {
    let c = new Container();
    assert.equal(c.id, undefined, 'id');
    assert.equal(c.display, undefined, 'display');
    assert.equal(c.modelviewer, undefined, 'modelviewer');
    assert.equal(c.visibleResource.id, undefined, 'visibleResource');
    let d = new Display();
    c.id = 'a';
    c.display = d;
    assert.equal(c.id, 'a', 'id');
    assert.equal(c.display, d, 'display');
  });
  it('displayVariables', () => {
    let resources = makeResources();
    let modelviewer = new Modelviewer({ resources });
    let c = new Container();
    assert.equal(c.visibleResource.variables.length, 0, 'no visible resource');
    assert.equal(c.visibleResource.datetime, undefined, 'no visible resource');
    c.modelviewer = modelviewer;
    assert.equal(c.visibleResource.variables.length, 0, 'no visible resource');
    assert.equal(c.visibleResource.datetime, undefined, 'no visible resource');
    fillImageResources(resources);
    assert.equal(c.visibleResource.variables.length, 1, 'visible resource');
    assert.equal(c.visibleResource.datetime, 'abc', 'visible resource');
  });
});
describe('Container class, import via name', () => {
  it('simple', () => {
    let c = new ContainerClass();
    assert.equal(c.display, undefined, 'display');
    assert.equal(c.modelviewer, undefined, 'modelviewer');
  });
});