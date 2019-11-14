﻿import assert from 'assert';
import 'jsdom-global/register';
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
    assert.equal(c.displayVariables.size, 0, 'displayVariables');
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
    assert.equal([...c.displayVariables].map(v => v.id).sort().join(','), 'ECMWF', 'displayVariable');
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
    assert.equal(c.displayVariables.size, 0, 'displayVariables count');
    assert.equal(c.visibleResource.id, undefined, 'no visibleResource');
    assert.equal(c.enabledTimes.length, 0, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 0, 'no timeline times');
    fillImageResources(resources);
    assert.equal(c.displayVariables.size, 0, 'displayVariables count');
    assert.equal(c.visibleResource.id, undefined, 'no visibleResource');
    assert.equal(c.enabledTimes.length, 0, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 0, 'no timeline times');
    let date1 = new Date(Date.UTC(2019, 10, 4));
    let date2 = new Date(Date.UTC(2019, 10, 3));
    let model = resources.getNodeByVariableCollectionId('models')
      .variableCollection.getVariableById('GFS');
    let run = resources.getNodeByVariableCollectionId('runs')
      .variableCollection.getVariableById(date2.valueOf());
    let field = resources.getNodeByVariableCollectionId('fields')
      .variableCollection.getVariableById('temperature');
    let level = resources.getNodeByVariableCollectionId('levels')
      .variableCollection.getVariableById('850hPa');
    c.displayVariables = [ model, field, run, level ];
    assert.equal(c.displayVariables.size, 4, 'displayVariables count');
    assert.equal(c.visibleResource.id, undefined, 'no visibleResource');
    assert.equal(c.enabledTimes.length, 25, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'timeline times');
    modelviewer.timeline.setSelectedTime(date1);
    assert.equal(c.displayVariables.size, 4, 'displayVariables count');
    assert.equal(c.visibleResource.variables.map(v => v.id).sort().join(','), '1572739200000,850hPa,GFS,temperature', 'resource variables');
    assert.equal(c.visibleResource.datetime.valueOf(), date1.valueOf(), 'resource datetime');
    assert.equal(c.enabledTimes.length, 25, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'timeline times');
    c.setDisplayVariableByVariableCollection(
      resources.getNodeByVariableCollectionId('fields')
        .variableCollection.getVariableById('wind'));
    assert.equal(c.displayVariables.size, 4, 'displayVariables count');
    assert.equal(c.visibleResource.variables.map(v => v.id).sort().join(','), '1572739200000,850hPa,GFS,wind', 'resource variables');
    assert.equal(c.visibleResource.datetime.valueOf(), date1.valueOf(), 'resource datetime');
    assert.equal(c.enabledTimes.length, 25, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'timeline times');
    c.setDisplayVariableByVariableCollection(
      resources.getNodeByVariableCollectionId('levels')
        .variableCollection.getVariableById('10m'));
    assert.equal(c.displayVariables.size, 4, 'displayVariables count');
    assert.equal(c.visibleResource.variables.map(v => v.id).sort().join(','), '10m,1572739200000,GFS,wind', 'resource variables');
    assert.equal(c.visibleResource.datetime.valueOf(), date1.valueOf(), 'resource datetime');
    assert.equal(c.enabledTimes.length, 25, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'timeline times');
    c.setDisplayVariableByVariableCollection(
      resources.getNodeByVariableCollectionId('fields')
        .variableCollection.getVariableById('geopotential'));
    assert.equal(c.displayVariables.size, 4, 'displayVariables count');
    assert.equal(c.visibleResource.id, undefined, 'no visibleResource');
    assert.equal(c.enabledTimes.length, 0, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'timeline times');
    c.setDisplayVariableByVariableCollection(
      resources.getNodeByVariableCollectionId('levels')
        .variableCollection.getVariableById('500hPa'));
    assert.equal(c.displayVariables.size, 4, 'displayVariables count');
    assert.equal(c.visibleResource.variables.map(v => v.id).sort().join(','), '1572739200000,500hPa,GFS,geopotential', 'resource variables');
    assert.equal(c.visibleResource.datetime.valueOf(), date1.valueOf(), 'resource datetime');
    assert.equal(c.enabledTimes.length, 13, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'timeline times');
    let date3 = new Date(Date.UTC(2019, 10, 3, 1));
    modelviewer.timeline.setSelectedTime(date3);
    assert.equal(c.displayVariables.size, 4, 'displayVariables count');
    assert.equal(c.visibleResource.id, undefined, 'no visibleResource');
    assert.equal(c.enabledTimes.length, 13, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'timeline times');
    modelviewer.timeline.setSelectedTime(date1);
    c.displayVariables = [ model, field, level ];
    assert.equal(c.displayVariables.size, 3, 'displayVariables count');
    assert.equal(c.visibleResource.id, undefined, 'no visibleResource');
    assert.equal(c.enabledTimes.length, 0, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 0, 'no timeline times');
  });
  it('displayVariables, showSimiliarResource=true', () => {
    let resources = makeResources();
    let modelviewer = new Modelviewer({ resources });
    let c = new Container({ showSimiliarResource: true });
    modelviewer.append(c);
    assert.equal(c.displayVariables.size, 0, 'displayVariables count');
    assert.equal(c.visibleResource.id, undefined, 'no visibleResource');
    assert.equal(c.enabledTimes.length, 0, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 0, 'no timeline times');
    fillImageResources(resources);
    assert.equal(c.displayVariables.size, 0, 'displayVariables count');
    assert.equal(c.visibleResource.id, undefined, 'no visibleResource');
    assert.equal(c.enabledTimes.length, 0, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 0, 'no timeline times');
    let date1 = new Date(Date.UTC(2019, 10, 3));
    let date2 = new Date(Date.UTC(2019, 10, 4));
    modelviewer.timeline.setSelectedTime(date1);
    assert.equal(c.displayVariables.size, 0, 'displayVariables count');
    assert.equal(c.visibleResource.variables.map(v => v.id).sort().join(','), 'ECMWF,1200,temperature,500hPa', 'resource variables');
    assert.equal(c.visibleResource.datetime.valueOf(), date1.valueOf(), 'resource datetime');
    assert.equal(c.enabledTimes.length, 17, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'timeline times');
    modelviewer.timeline.setSelectedTime(date2);
    assert.equal(c.displayVariables.size, 0, 'displayVariables count');
    assert.equal(c.visibleResource.variables.map(v => v.id).sort().join(','), 'ECMWF,1200,temperature,500hPa', 'resource variables');
    assert.equal(c.visibleResource.datetime.valueOf(), date2.valueOf(), 'resource datetime');
    assert.equal(c.enabledTimes.length, 17, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'timeline times');
    c.setDisplayVariableByVariableCollection(resources
      .getNodeByVariableCollectionId('models')
      .variableCollection.getVariableById('GFS'));
    assert.equal(c.displayVariables.size, 1, 'displayVariables count');
    assert.equal(c.visibleResource.variables.map(v => v.id).sort().join(','), 'GFS,1200,temperature,500hPa', 'resource variables');
    assert.equal(c.visibleResource.datetime.valueOf(), date2.valueOf(), 'resource datetime');
    assert.equal(c.enabledTimes.length, 17, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'timeline times');
    c.setDisplayVariableByVariableCollection(resources
      .getNodeByVariableCollectionId('levels')
      .variableCollection.getVariableById('700hPa'));
    assert.equal(c.displayVariables.size, 2, 'displayVariables count');
    assert.equal(c.visibleResource.variables.map(v => v.id).sort().join(','), 'GFS,1200,temperature,700hPa', 'resource variables');
    assert.equal(c.visibleResource.datetime.valueOf(), date2.valueOf(), 'resource datetime');
    assert.equal(c.enabledTimes.length, 17, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'timeline times');
    c.setDisplayVariableByVariableCollection(resources
      .getNodeByVariableCollectionId('fields')
      .variableCollection.getVariableById('wind'),
      resources
      .getNodeByVariableCollectionId('levels')
      .variableCollection.getVariableById('10m'));
    assert.equal(c.displayVariables.size, 3, 'displayVariables count');
    assert.equal(c.visibleResource.variables.map(v => v.id).sort().join(','), 'GFS,1200,wind,10m', 'resource variables');
    assert.equal(c.visibleResource.datetime.valueOf(), date2.valueOf(), 'resource datetime');
    assert.equal(c.enabledTimes.length, 17, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'timeline times');
    c.setDisplayVariableByVariableCollection(resources
      .getNodeByVariableCollectionId('fields')
      .variableCollection.getVariableById('geopotential'));
    assert.equal(c.displayVariables.size, 3, 'displayVariables count');
    assert.equal(c.visibleResource.variables.map(v => v.id).sort().join(','), 'GFS,1200,geopotential,700hPa', 'resource variables');
    assert.equal(c.visibleResource.datetime.valueOf(), date2.valueOf(), 'resource datetime');
    assert.equal(c.enabledTimes.length, 17, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'timeline times');
    let date3 = new Date(Date.UTC(2019, 10, 3, 1));
    modelviewer.timeline.setSelectedTime(date3);
    assert.equal(c.displayVariables.size, 3, 'displayVariables count');
    assert.equal(c.visibleResource.id, undefined, 'no visibleResource');
    assert.equal(c.enabledTimes.length, 17, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'timeline times');
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
    assert.equal(c1.displayVariables.size, 0, 'c1 displayVariables');
    assert.equal(c2.displayVariables.size, 0, 'c2 displayVariables');
    assert.equal(c3.displayVariables.size, 0, 'c3 displayVariables');
    c2.mirrorsFrom(c1);
    assert.equal(c2.displayVariables.size, 0, 'c2 displayVariables');
    c1.displayVariables = [vEC];
    assert.equal([...c1.displayVariables].map(v => v.id).sort().join(','), 'ECMWF', 'c1 displayVariables');
    assert.equal([...c2.displayVariables].map(v => v.id).sort().join(','), 'ECMWF', 'c2 displayVariables');
    c3.mirrorsFrom(c1);
    assert.equal([...c3.displayVariables].map(v => v.id).sort().join(','), 'ECMWF', 'c3 displayVariables');
    c2.mirrorsFrom();
    assert.equal([...c2.displayVariables].map(v => v.id).sort().join(','), 'ECMWF', 'c2 displayVariables');
    c2.displayVariables = new Set([vGFS, vTemp]);
    assert.equal([...c2.displayVariables].map(v => v.id).sort().join(','), 'GFS,temperature', 'c2 displayVariables');
    c3.mirrorsFrom(c2);
    assert.equal([...c3.displayVariables].map(v => v.id).sort().join(','), 'GFS,temperature', 'c3 displayVariables');
    c2.mirrorsFrom(c1);
    assert.equal([...c1.displayVariables].map(v => v.id).sort().join(','), 'ECMWF', 'c1 displayVariables');
    assert.equal([...c2.displayVariables].map(v => v.id).sort().join(','), 'ECMWF,temperature', 'c2 displayVariables');
    assert.equal([...c3.displayVariables].map(v => v.id).sort().join(','), 'ECMWF,temperature', 'c3 displayVariables');
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