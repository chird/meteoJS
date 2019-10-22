import assert from 'assert';
import { makeResources, fillImageResources } from './helperCreateResources.js';
import Modelviewer from '../../../src/meteoJS/Modelviewer.js';
import Display from '../../../src/meteoJS/modelviewer/Display.js';
import Container from '../../../src/meteoJS/modelviewer/Container.js';
import { Container as ContainerClass }
  from '../../../src/meteoJS/modelviewer/Container.js';

describe('modelviewer/Container', () => {
  it('empty constructor', () => {
    let c = new Container();
    assert.equal(c.id, undefined, 'id');
    assert.equal(c.display, undefined, 'display');
    assert.equal(c.modelviewer, undefined, 'modelviewer');
    assert.equal(c.visibleResource.id, undefined, 'visibleResource');
    assert.equal(c.displayVariables.length, 0, 'displayVariables');
    let d = new Display();
    c.id = 'a';
    c.display = d;
    assert.equal(c.id, 'a', 'id');
    assert.equal(c.display, d, 'display');
    assert.equal(d.modelviewer, undefined, 'modelviewer');
    assert.equal(d.container, c, 'container');
    assert.equal(d.parentNode, undefined, 'parentNode');
  });
  it('displayVariables', () => {
    let resources = makeResources();
    let modelviewer = new Modelviewer({ resources });
    let c = new Container();
    assert.equal(c.modelviewer, undefined, 'modelviewer');
    modelviewer.append(c);
    assert.equal(c.modelviewer, modelviewer, 'modelviewer');
    assert.equal(c.visibleResource.variables.length, 0, 'no visible resource');
    assert.equal(c.visibleResource.datetime, undefined, 'no visible resource');
    fillImageResources(resources);
    assert.equal(c.visibleResource.variables.length, 1, 'visible resource');
    assert.equal(c.visibleResource.datetime, 'abc', 'visible resource');
    c.displayVariables = [
      resources.getNodeByVariableCollectionById('models')
        .variableCollection.getVariableById('GFS'),
      resources.getNodeByVariableCollectionById('runs')
        .variableCollection.getVariableById(12000),
      resources.getNodeByVariableCollectionById('fields')
        .variableCollection.getVariableById('temperature'),
      resources.getNodeByVariableCollectionById('levels')
        .variableCollection.getVariableById('10m')
    ];
    assert.equal(c.visibleResource.variables.length, 1, 'visible resource');
    assert.equal(c.visibleResource.datetime, 'abc', 'visible resource');
    assert.equal(c.getEnabledTimes().length, 17, 'enabledTimes');
    c.setDisplayVariableByVariableCollection(
      resources.getNodeByVariableCollectionById('fields')
        .variableCollection.getVariableById('wind'));
    assert.equal(c.visibleResource.variables.length, 1, 'visible resource');
    assert.equal(c.visibleResource.datetime, 'abc', 'visible resource');
    assert.equal(c.getEnabledTimes().length, 17, 'enabledTimes');
    c.setDisplayVariableByVariableCollection(
      resources.getNodeByVariableCollectionById('fields')
        .variableCollection.getVariableById('geopotential'));
    assert.equal(c.visibleResource.variables.length, 1, 'visible resource');
    assert.equal(c.visibleResource.datetime, 'abc', 'visible resource');
    assert.equal(c.getEnabledTimes().length, 17, 'enabledTimes');
  });
  it('Container class, import via name', () => {
    let c = new ContainerClass();
    assert.equal(c.id, undefined, 'id');
    assert.equal(c.display, undefined, 'display');
    assert.equal(c.modelviewer, undefined, 'modelviewer');
  });
});