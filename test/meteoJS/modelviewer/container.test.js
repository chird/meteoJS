import assert from 'assert';
import { makeResources, fillImageResources } from './helperCreateResources.js';
import Modelviewer from '../../../src/meteoJS/Modelviewer.js';
import Display from '../../../src/meteoJS/modelviewer/Display.js';
import Variable from '../../../src/meteoJS/modelviewer/Variable.js';
import Container from '../../../src/meteoJS/modelviewer/Container.js';
import { Container as ContainerClass }
  from '../../../src/meteoJS/modelviewer/Container.js';

describe('modelviewer/Container', () => {
  it('empty constructor', () => {
    let c = new Container();
    assert.equal(c.id, undefined, 'id');
    assert.equal(c.display, undefined, 'display');
    assert.equal(c.modelviewer, undefined, 'modelviewer');
    assert.equal(c.containerNode, undefined, 'containerNode');
    assert.equal(c.visibleResource.id, undefined, 'visibleResource');
    assert.equal(c.displayVariables.length, 0, 'displayVariables');
    let d = new Display();
    c.id = 'a';
    c.display = d;
    assert.equal(c.id, 'a', 'id');
    assert.equal(c.display, d, 'display');
    assert.equal(c.containerNode, undefined, 'containerNode');
    assert.equal(d.modelviewer, undefined, 'modelviewer');
    assert.equal(d.container, c, 'container');
    assert.equal(d.parentNode, undefined, 'parentNode');
    c.containerNode = 'a';
    assert.equal(c.containerNode, 'a', 'containerNode');
    assert.equal(c.display.parentNode, 'a', 'display.parentNode');
  });
  it('setDisplayVariableByVariableCollection', () => {
    let resources = makeResources();
    let modelviewer = new Modelviewer({ resources });
    let c = new Container();
    modelviewer.append(c);
    c.displayVariables = [
      resources.getNodeByVariableCollectionId('models')
        .variableCollection.getVariableById('ECMWF')
    ];
    assert.equal(c.displayVariables.map(v => v.id).sort().join(','), 'ECMWF', 'displayVariable');
    c.setDisplayVariableByVariableCollection(
      resources.getNodeByVariableCollectionId('models')
        .variableCollection.getVariableById('GFS'),
      resources.getNodeByVariableCollectionId('fields')
      .variableCollection.getVariableById('temperature')
    );
    assert.equal(c.displayVariables.map(v => v.id).sort().join(','), 'GFS,temperature', 'displayVariable');
  });
  it('displayVariables, showSimiliarResource=false', () => {
    let resources = makeResources();
    let modelviewer = new Modelviewer({ resources });
    let c = new Container();
    assert.equal(c.modelviewer, undefined, 'modelviewer');
    modelviewer.append(c);
    assert.equal(c.modelviewer, modelviewer, 'modelviewer');
    assert.equal(c.visibleResource.variables.length, 0, 'no visible resource');
    assert.equal(c.visibleResource.datetime, undefined, 'no visible resource');
    fillImageResources(resources);
    assert.equal(c.visibleResource.variables.length, 0, 'no visible resource');
    assert.equal(c.visibleResource.datetime, undefined, 'no visible resource');
    let date = new Date(Date.UTC(2019, 10, 3));
    let model = resources.getNodeByVariableCollectionId('models')
      .variableCollection.getVariableById('GFS');
    let run = resources.getNodeByVariableCollectionId('runs')
      .variableCollection.getVariableById(date.valueOf());
    let field = resources.getNodeByVariableCollectionId('fields')
      .variableCollection.getVariableById('temperature');
    let level = resources.getNodeByVariableCollectionId('levels')
      .variableCollection.getVariableById('850hPa');
    c.displayVariables = [ model, field, run, level ];
    assert.equal(c.enabledTimes.length, 25, 'enabledTimes');
    assert.equal(c.visibleResource.variables.length, 0, 'visible resource');
    modelviewer.timeline.setSelectedTime(date);
    assert.equal(c.visibleResource.datetime, 'abc', 'visible resource');
    assert.equal(c.visibleResource.variables.length, 1, 'visible resource');
    assert.equal(c.getEnabledTimes().length, 17, 'enabledTimes');
    c.setDisplayVariableByVariableCollection(
      resources.getNodeByVariableCollectionId('fields')
        .variableCollection.getVariableById('wind'));
    assert.equal(c.visibleResource.variables.length, 1, 'visible resource');
    assert.equal(c.visibleResource.datetime, 'abc', 'visible resource');
    assert.equal(c.getEnabledTimes().length, 17, 'enabledTimes');
    c.setDisplayVariableByVariableCollection(
      resources.getNodeByVariableCollectionId('fields')
        .variableCollection.getVariableById('geopotential'));
    assert.equal(c.visibleResource.variables.length, 1, 'visible resource');
    assert.equal(c.visibleResource.datetime, 'abc', 'visible resource');
    assert.equal(c.getEnabledTimes().length, 17, 'enabledTimes');
  });
  it('mirrorsFrom', () => {
    let resources = makeResources();
    let modelCollection =
      resources.getNodeByVariableCollectionId('models').variableCollection;
    let fieldCollection =
      resources.getNodeByVariableCollectionId('fields').variableCollection;
    let modelviewer = new Modelviewer({ resources });
    let vEC = modelCollection.getItemById('ECMWF');
    let vGFS = modelCollection.getItemById('GFS');
    let vTemp = fieldCollection.getItemById('temperature');
    
    let changeDisplayVariablesCounterC1 = 0;
    let changeDisplayVariablesCounterC2 = 0;
    let changeDisplayVariablesCounterC3 = 0;
    let c1 = new Container();
    c1.on('change:displayVariables', () => changeDisplayVariablesCounterC1++);
    let c2 = new Container();
    c2.on('change:displayVariables', () => changeDisplayVariablesCounterC2++);
    let c3 = new Container();
    c3.on('change:displayVariables', () => changeDisplayVariablesCounterC3++);
    modelviewer.append(c1, c2, c3);
    assert.equal(c1.displayVariables.length, 0, 'c1 displayVariables');
    assert.equal(c2.displayVariables.length, 0, 'c2 displayVariables');
    assert.equal(c3.displayVariables.length, 0, 'c3 displayVariables');
    c2.mirrorsFrom(c1);
    assert.equal(c2.displayVariables.length, 0, 'c2 displayVariables');
    c1.displayVariables = [ vEC ];
    assert.equal(c1.displayVariables.map(v => v.id).sort().join(','), 'ECMWF', 'c1 displayVariables');
    assert.equal(c2.displayVariables.map(v => v.id).sort().join(','), 'ECMWF', 'c2 displayVariables');
    c3.mirrorsFrom(c1);
    assert.equal(c3.displayVariables.map(v => v.id).sort().join(','), 'ECMWF', 'c3 displayVariables');
    c2.mirrorsFrom();
    assert.equal(c2.displayVariables.map(v => v.id).sort().join(','), 'ECMWF', 'c2 displayVariables');
    c2.displayVariables = [ vGFS, vTemp ];
    assert.equal(c2.displayVariables.map(v => v.id).sort().join(','), 'GFS,temperature', 'c2 displayVariables');
    c3.mirrorsFrom(c2);
    assert.equal(c3.displayVariables.map(v => v.id).sort().join(','), 'GFS,temperature', 'c3 displayVariables');
    c2.mirrorsFrom(c1);
    assert.equal(c1.displayVariables.map(v => v.id).sort().join(','), 'ECMWF', 'c1 displayVariables');
    assert.equal(c2.displayVariables.map(v => v.id).sort().join(','), 'ECMWF,temperature', 'c2 displayVariables');
    assert.equal(c3.displayVariables.map(v => v.id).sort().join(','), 'ECMWF,temperature', 'c3 displayVariables');
    assert.equal(changeDisplayVariablesCounterC1, 1, 'changeDisplayVariablesCounterC1');
    assert.equal(changeDisplayVariablesCounterC2, 3, 'changeDisplayVariablesCounterC2');
    assert.equal(changeDisplayVariablesCounterC3, 3, 'changeDisplayVariablesCounterC3');
  });
  it('Container class, import via name', () => {
    let c = new ContainerClass();
    assert.equal(c.id, undefined, 'id');
    assert.equal(c.display, undefined, 'display');
    assert.equal(c.modelviewer, undefined, 'modelviewer');
  });
});