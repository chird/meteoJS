import assert from 'assert';
import 'jsdom-global/register';
import {
  makeResources,
  fillImageResources,
  makeAdvancedResources,
  fillImageAdvancedResources
} from './helperCreateResources.js';
import Modelviewer from '../../../src/meteoJS/Modelviewer.js';
import Display from '../../../src/meteoJS/modelviewer/Display.js';
import Variable from '../../../src/meteoJS/modelviewer/Variable.js';
import Container from '../../../src/meteoJS/modelviewer/Container.js';
import { Container as ContainerClass }
  from '../../../src/meteoJS/modelviewer/Container.js';

describe('modelviewer/Container', () => {
  it('empty constructor', () => {
    let d = new Display();
    let c = new Container({
      display: d
    });
    assert.equal(c.id, undefined, 'id');
    assert.equal(c.display, d, 'display');
    assert.equal(c.modelviewer, undefined, 'modelviewer');
    assert.equal(c.containerNode, undefined, 'containerNode');
    assert.equal(c.visibleResource.id, undefined, 'visibleResource');
    assert.equal(c.displayVariables.size, 0, 'displayVariables');
    c.id = 'a';
    assert.equal(c.id, 'a', 'id');
    assert.equal(c.containerNode, undefined, 'containerNode');
    assert.equal(d.modelviewer, undefined, 'modelviewer');
    assert.equal(d.container, c, 'container');
    assert.equal(d.parentNode, undefined, 'parentNode');
    c.containerNode = 'a';
    assert.equal(c.containerNode, 'a', 'containerNode');
    assert.equal(c.display.parentNode, 'a', 'display.parentNode');
  });
  it('exchangeDisplayVariable', () => {
    let resources = makeResources();
    let modelviewer = new Modelviewer({ resources });
    let c = new Container();
    modelviewer.append(c);
    c.displayVariables = [
      resources.getNodeByVariableCollectionId('models')
        .variableCollection.getVariableById('ECMWF')
    ];
    assert.equal([...c.displayVariables].map(v => v.id).sort().join(','), 'ECMWF', 'displayVariable');
    c.exchangeDisplayVariable([
      resources.getNodeByVariableCollectionId('models')
        .variableCollection.getVariableById('GFS'),
      resources.getNodeByVariableCollectionId('fields')
      .variableCollection.getVariableById('temperature')
    ]);
    assert.equal([...c.displayVariables].map(v => v.id).sort().join(','), 'GFS,temperature', 'displayVariable');
  });
  it('displayVariables, disable adaptSuitableResource', async () => {
    let resources = makeResources();
    let modelviewer = new Modelviewer({
      resources,
      firstTimeOnInit: false
    });
    let changedDisplayVariableCounter = 0;
    let changedSelectedVariableCounter = 0;
    let lastAddedVariables = new Set();
    let lastRemovedVariables = new Set();
    let changedVisibleResourceCounter = 0;
    let c = new Container({ adaptSuitableResource: { enabled: false } });
    c.on('change:displayVariables', () => changedDisplayVariableCounter++);
    c.on('change:selectedVariables', ({
      addedVariables,
      removedVariables
    }) => {
      changedSelectedVariableCounter++;
      lastAddedVariables = new Set([...addedVariables]);
      lastRemovedVariables = new Set([...removedVariables]);
    });
    c.on('change:visibleResource', () => changedVisibleResourceCounter++);
    assert.equal(c.modelviewer, undefined, 'modelviewer');
    modelviewer.append(c);
    assert.equal(c.modelviewer, modelviewer, 'modelviewer');
    assert.equal(c.displayVariables.size, 0, 'displayVariables count');
    assert.equal(c.selectedVariables.size, 0, 'selectedVariables count');
    assert.equal(c.visibleResource.id, undefined, 'no visibleResource');
    assert.equal(c.enabledTimes.length, 0, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 0, 'no timeline times');
    await fillImageResources(resources);
    assert.equal(c.displayVariables.size, 0, 'displayVariables count');
    assert.equal(c.selectedVariables.size, 0, 'selectedVariables count');
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
    assert.equal(c.selectedVariables.size, 4, 'selectedVariables count');
    assert.equal(c.visibleResource.id, undefined, 'no visibleResource');
    assert.equal(c.enabledTimes.length, 25, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'timeline times');
    assert.equal(changedVisibleResourceCounter, 0, 'changedVisibleResourceCounter');
    modelviewer.timeline.setSelectedTime(date1);
    assert.equal(c.displayVariables.size, 4, 'displayVariables count');
    assert.equal(c.selectedVariables.size, 4, 'selectedVariables count');
    assert.equal(c.visibleResource.variables.map(v => v.id).sort().join(','), '1572739200000,850hPa,GFS,temperature', 'resource variables');
    assert.equal(c.visibleResource.datetime.valueOf(), date1.valueOf(), 'resource datetime');
    assert.equal(c.enabledTimes.length, 25, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'timeline times');
    assert.equal(changedVisibleResourceCounter, 1, 'changedVisibleResourceCounter');
    c.exchangeDisplayVariable([
      resources.getNodeByVariableCollectionId('fields')
        .variableCollection.getVariableById('wind')]);
    assert.equal(c.displayVariables.size, 4, 'displayVariables count');
    assert.equal(c.selectedVariables.size, 4, 'selectedVariables count');
    assert.equal(c.visibleResource.variables.map(v => v.id).sort().join(','), '1572739200000,850hPa,GFS,wind', 'resource variables');
    assert.equal(c.visibleResource.datetime.valueOf(), date1.valueOf(), 'resource datetime');
    assert.equal(c.enabledTimes.length, 25, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'timeline times');
    c.exchangeDisplayVariable([
      resources.getNodeByVariableCollectionId('levels')
        .variableCollection.getVariableById('10m')]);
    assert.equal(c.displayVariables.size, 4, 'displayVariables count');
    assert.equal(c.selectedVariables.size, 4, 'selectedVariables count');
    assert.equal(c.visibleResource.variables.map(v => v.id).sort().join(','), '10m,1572739200000,GFS,wind', 'resource variables');
    assert.equal(c.visibleResource.datetime.valueOf(), date1.valueOf(), 'resource datetime');
    assert.equal(c.enabledTimes.length, 25, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'timeline times');
    c.exchangeDisplayVariable([
      resources.getNodeByVariableCollectionId('fields')
        .variableCollection.getVariableById('geopotential')]);
    assert.equal(c.displayVariables.size, 4, 'displayVariables count');
    assert.equal([...c.displayVariables].map(v => v.id).sort().join(','), '10m,1572739200000,GFS,geopotential', 'displayVariables');
    assert.equal(c.selectedVariables.size, 2, 'selectedVariables count');
    assert.equal([...c.selectedVariables].map(v => v.id).sort().join(','), '1572739200000,GFS', 'selectedVariables');
    assert.equal(c.visibleResource.id, undefined, 'no visibleResource');
    assert.equal(c.enabledTimes.length, 0, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'timeline times');
    c.exchangeDisplayVariable([
      resources.getNodeByVariableCollectionId('levels')
        .variableCollection.getVariableById('500hPa')]);
    assert.equal(c.displayVariables.size, 4, 'displayVariables count');
    assert.equal(c.selectedVariables.size, 4, 'selectedVariables count');
    assert.equal(c.visibleResource.variables.map(v => v.id).sort().join(','), '1572739200000,500hPa,GFS,geopotential', 'resource variables');
    assert.equal(c.visibleResource.datetime.valueOf(), date1.valueOf(), 'resource datetime');
    assert.equal(c.enabledTimes.length, 13, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'timeline times');
    let date3 = new Date(Date.UTC(2019, 10, 3, 1));
    modelviewer.timeline.setSelectedTime(date3);
    assert.equal(c.displayVariables.size, 4, 'displayVariables count');
    assert.equal(c.selectedVariables.size, 4, 'selectedVariables count');
    assert.equal(c.visibleResource.id, undefined, 'no visibleResource');
    assert.equal(c.enabledTimes.length, 13, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'timeline times');
    modelviewer.timeline.setSelectedTime(date1);
    assert.equal(changedDisplayVariableCounter, 5, 'changedDisplayVariableCounter');
    assert.equal(changedVisibleResourceCounter, 7, 'changedVisibleResourceCounter');
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 500);
    })
    .then(() => {
      assert.equal(changedSelectedVariableCounter, 1, 'changedSelectedVariableCounter');
      assert.equal([...lastAddedVariables].map(v => v.id).sort().join(','), '1572739200000,500hPa,GFS,geopotential', 'addedVariables');
      assert.equal([...lastRemovedVariables].map(v => v.id).sort().join(','), '10m,850hPa,temperature,wind', 'removedVariables');
      c.displayVariables = [ model, field, level ];
      assert.equal(c.displayVariables.size, 3, 'displayVariables count');
      assert.equal([...c.displayVariables].map(v => v.id).sort().join(','), '850hPa,GFS,temperature', 'displayVariables');
      assert.equal(c.selectedVariables.size, 0, 'selectedVariables count');
      assert.equal(c.visibleResource.id, undefined, 'no visibleResource');
      assert.equal(c.enabledTimes.length, 0, 'enabledTimes');
      assert.equal(c.modelviewer.timeline.getTimes().length, 0, 'timeline times');
      assert.equal(changedDisplayVariableCounter, 6, 'changedDisplayVariableCounter');
      assert.equal(changedVisibleResourceCounter, 8, 'changedVisibleResourceCounter');
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 500);
      })
      .then(() => {
        assert.equal(changedSelectedVariableCounter, 2, 'changedSelectedVariableCounter');
        assert.equal([...lastAddedVariables].map(v => v.id).sort().join(','), '', 'addedVariables');
        assert.equal([...lastRemovedVariables].map(v => v.id).sort().join(','), '1572739200000,500hPa,GFS,geopotential', 'removedVariables');
      });
    });
  });
  it('displayVariables, enable adaptSuitableResource', async () => {
    let resources = makeResources();
    let modelviewer = new Modelviewer({ resources });
    let c = new Container();
    modelviewer.append(c);
    assert.equal(c.displayVariables.size, 0, 'displayVariables count');
    assert.equal(c.selectedVariables.size, 0, 'selectedVariables count');
    assert.equal(c.visibleResource.id, undefined, 'no visibleResource');
    assert.equal(c.enabledTimes.length, 0, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 0, 'no timeline times');
    await fillImageResources(resources);
    assert.equal(c.displayVariables.size, 0, 'displayVariables count');
    assert.equal(c.selectedVariables.size, 4, 'selectedVariables count');
    assert.equal(c.visibleResource.id, undefined, 'no visibleResource');
    assert.equal(c.enabledTimes.length, 25, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'Timeline times');
    let date1 = new Date(Date.UTC(2019, 10, 3));
    let date2 = new Date(Date.UTC(2019, 10, 4));
    modelviewer.timeline.setSelectedTime(date1);
    assert.equal(c.displayVariables.size, 0, 'displayVariables count');
    assert.equal(c.selectedVariables.size, 4, 'selectedVariables count');
    assert.equal([...c.selectedVariables].map(v => v.id).sort().join(','), '1572739200000,500hPa,ECMWF,temperature', 'selectedVariables');
    assert.equal(c.visibleResource.variables.map(v => v.id).sort().join(','), '1572739200000,500hPa,ECMWF,temperature', 'resource variables');
    assert.equal(c.visibleResource.datetime.valueOf(), date1.valueOf(), 'resource datetime');
    assert.equal(c.enabledTimes.length, 25, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'timeline times');
    modelviewer.timeline.setSelectedTime(date2);
    assert.equal(c.displayVariables.size, 0, 'displayVariables count');
    assert.equal(c.selectedVariables.size, 4, 'selectedVariables count');
    assert.equal([...c.selectedVariables].map(v => v.id).sort().join(','), '1572739200000,500hPa,ECMWF,temperature', 'selectedVariables');
    assert.equal(c.visibleResource.variables.map(v => v.id).sort().join(','), '1572739200000,500hPa,ECMWF,temperature', 'resource variables');
    assert.equal(c.visibleResource.datetime.valueOf(), date2.valueOf(), 'resource datetime');
    assert.equal(c.enabledTimes.length, 25, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'timeline times');
    c.exchangeDisplayVariable([resources
      .getNodeByVariableCollectionId('models')
      .variableCollection.getVariableById('GFS')]);
    assert.equal(c.displayVariables.size, 1, 'displayVariables count');
    assert.equal(c.selectedVariables.size, 4, 'selectedVariables count');
    assert.equal([...c.selectedVariables].map(v => v.id).sort().join(','), '1572739200000,500hPa,GFS,temperature', 'selectedVariables');
    assert.equal(c.visibleResource.variables.map(v => v.id).sort().join(','), '1572739200000,500hPa,GFS,temperature', 'resource variables');
    assert.equal(c.visibleResource.datetime.valueOf(), date2.valueOf(), 'resource datetime');
    assert.equal(c.enabledTimes.length, 25, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'timeline times');
    c.exchangeDisplayVariable([resources
      .getNodeByVariableCollectionId('levels')
      .variableCollection.getVariableById('850hPa')]);
    assert.equal(c.displayVariables.size, 2, 'displayVariables count');
    assert.equal(c.selectedVariables.size, 4, 'selectedVariables count');
    assert.equal([...c.selectedVariables].map(v => v.id).sort().join(','), '1572739200000,850hPa,GFS,temperature', 'selectedVariables');
    assert.equal(c.visibleResource.variables.map(v => v.id).sort().join(','), '1572739200000,850hPa,GFS,temperature', 'resource variables');
    assert.equal(c.visibleResource.datetime.valueOf(), date2.valueOf(), 'resource datetime');
    assert.equal(c.enabledTimes.length, 25, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'timeline times');
    c.exchangeDisplayVariable([resources
      .getNodeByVariableCollectionId('fields')
      .variableCollection.getVariableById('wind'),
      resources
      .getNodeByVariableCollectionId('levels')
      .variableCollection.getVariableById('10m')]);
    assert.equal(c.displayVariables.size, 3, 'displayVariables count');
    assert.equal(c.selectedVariables.size, 4, 'selectedVariables count');
    assert.equal([...c.selectedVariables].map(v => v.id).sort().join(','), '10m,1572739200000,GFS,wind', 'selectedVariables');
    assert.equal(c.visibleResource.variables.map(v => v.id).sort().join(','), '10m,1572739200000,GFS,wind', 'resource variables');
    assert.equal(c.visibleResource.datetime.valueOf(), date2.valueOf(), 'resource datetime');
    assert.equal(c.enabledTimes.length, 25, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'timeline times');
    c.exchangeDisplayVariable([resources
      .getNodeByVariableCollectionId('fields')
      .variableCollection.getVariableById('geopotential')]);
    assert.equal(c.displayVariables.size, 3, 'displayVariables count');
    assert.equal([...c.displayVariables].map(v => v.id).sort().join(','), '10m,GFS,geopotential', 'displayVariables');
    assert.equal(c.selectedVariables.size, 4, 'selectedVariables count');
    assert.equal([...c.selectedVariables].map(v => v.id).sort().join(','), '1572739200000,500hPa,GFS,geopotential', 'selectedVariables');
    assert.equal(c.visibleResource.id, undefined, 'no valid resource');
    assert.equal(c.enabledTimes.length, 13, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'timeline times');
    c.exchangeDisplayVariable([resources
      .getNodeByVariableCollectionId('levels')
      .variableCollection.getVariableById('500hPa')]);
    assert.equal(c.displayVariables.size, 3, 'displayVariables count');
    assert.equal([...c.displayVariables].map(v => v.id).sort().join(','), '500hPa,GFS,geopotential', 'displayVariables');
    assert.equal(c.selectedVariables.size, 4, 'selectedVariables count');
    assert.equal([...c.selectedVariables].map(v => v.id).sort().join(','), '1572739200000,500hPa,GFS,geopotential', 'selectedVariables');
    assert.equal(c.visibleResource.variables.map(v => v.id).sort().join(','), '1572739200000,500hPa,GFS,geopotential', 'resource variables');
    assert.equal(c.visibleResource.datetime.valueOf(), date2.valueOf(), 'resource datetime');
    assert.equal(c.enabledTimes.length, 13, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'timeline times');
    let date3 = new Date(Date.UTC(2019, 10, 3, 1));
    modelviewer.timeline.setSelectedTime(date3);
    assert.equal(c.displayVariables.size, 3, 'displayVariables count');
    assert.equal(c.selectedVariables.size, 4, 'selectedVariables count');
    assert.equal([...c.selectedVariables].map(v => v.id).sort().join(','), '1572739200000,500hPa,GFS,geopotential', 'selectedVariables');
    assert.equal(c.visibleResource.id, undefined, 'no visibleResource');
    assert.equal(c.enabledTimes.length, 13, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'timeline times');
  });
  it('displayVariables, enable adaptSuitableResource, advanced', async () => {
    let resources = makeAdvancedResources();
    let modelviewer = new Modelviewer({ resources });
    let c = new Container();
    modelviewer.append(c);
    assert.equal(c.displayVariables.size, 0, 'displayVariables count');
    assert.equal(c.selectedVariables.size, 0, 'selectedVariables count');
    assert.equal(c.visibleResource.id, undefined, 'no visibleResource');
    assert.equal(c.enabledTimes.length, 0, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 0, 'no timeline times');
    await fillImageAdvancedResources(resources);
    let date1 = new Date(Date.UTC(2019, 10, 3));
    let date2 = new Date(Date.UTC(2019, 10, 4));
    assert.equal(c.displayVariables.size, 0, 'displayVariables count');
    assert.equal(c.selectedVariables.size, 4, 'selectedVariables count');
    assert.equal([...c.selectedVariables].map(v => v.id).sort().join(','), '1572739200000,500hPa,ECMWF,temperature', 'selectedVariables');
    assert.equal(c.visibleResource.id, undefined, 'no visibleResource');
    assert.equal(c.enabledTimes.length, 25, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'Timeline times');
    c.displayVariables = [
      resources.getNodeByVariableCollectionId('models')
      .variableCollection.getVariableById('ECMWF'),
      resources.getNodeByVariableCollectionId('runs')
      .variableCollection.getVariableById(date1.valueOf()),
      resources.getNodeByVariableCollectionId('fields')
      .variableCollection.getVariableById('precipitation'),
      resources.getNodeByVariableCollectionId('levels')
      .variableCollection.getVariableById('850hPa'),
      resources.getNodeByVariableCollectionId('accumulations')
      .variableCollection.getVariableById('6h')
    ];
    assert.equal(c.displayVariables.size, 5, 'displayVariables count');
    assert.equal(c.selectedVariables.size, 4, 'selectedVariables count');
    assert.equal([...c.selectedVariables].map(v => v.id).sort().join(','), '1572739200000,6h,ECMWF,precipitation', 'selectedVariables');
    assert.equal(c.visibleResource.id, undefined, 'no visibleResource');
    assert.equal(c.enabledTimes.length, 13, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'no timeline times');
    modelviewer.timeline.setSelectedTime(date2);
    assert.equal(c.displayVariables.size, 5, 'displayVariables count');
    assert.equal(c.selectedVariables.size, 4, 'selectedVariables count');
    assert.equal([...c.selectedVariables].map(v => v.id).sort().join(','), '1572739200000,6h,ECMWF,precipitation', 'selectedVariables');
    assert.equal(c.visibleResource.variables.map(v => v.id).sort().join(','), '1572739200000,6h,ECMWF,precipitation', 'resource variables');
    assert.equal(c.visibleResource.datetime.valueOf(), date2.valueOf(), 'resource datetime');
    assert.equal(c.enabledTimes.length, 13, 'enabledTimes');
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
  it('mirrorsFrom multiple Containers', () => {
    const resources = makeResources();
    const modelCollection =
      resources.getNodeByVariableCollectionId('models').variableCollection;
    const fieldCollection =
      resources.getNodeByVariableCollectionId('fields').variableCollection;
    const runCollection =
      resources.getNodeByVariableCollectionId('runs').variableCollection;
    const modelviewer = new Modelviewer({ resources });
    const vEC = modelCollection.getItemById('ECMWF');
    const vGFS = modelCollection.getItemById('GFS');
    const vTemp = fieldCollection.getItemById('temperature');
    const vGeopot = fieldCollection.getItemById('geopotential');
    const vRun = runCollection.getItemById(1572696000000);
    const vRun2 = runCollection.getItemById(1572739200000);
    
    let changeDisplayVariablesCounterC1 = 0;
    let changeDisplayVariablesCounterC2 = 0;
    let changeDisplayVariablesCounterC3 = 0;
    const c1 = new Container();
    c1.on('change:displayVariables', () => changeDisplayVariablesCounterC1++);
    const c2 = new Container();
    c2.on('change:displayVariables', () => changeDisplayVariablesCounterC2++);
    const c3 = new Container();
    c3.on('change:displayVariables', () => changeDisplayVariablesCounterC3++);
    modelviewer.append(c1, c2, c3);
    assert.equal(c1.displayVariables.size, 0, 'c1 displayVariables');
    assert.equal(c1._listeners.mirror.length, 0, 'c1 _listeners.mirror');
    assert.equal(c2.displayVariables.size, 0, 'c2 displayVariables');
    assert.equal(c2._listeners.mirror.length, 0, 'c2 _listeners.mirror');
    assert.equal(c3.displayVariables.size, 0, 'c3 displayVariables');
    assert.equal(c3._listeners.mirror.length, 0, 'c3 _listeners.mirror');
    c3.mirrorsFrom(c1, [ modelCollection ]);
    assert.equal(c3.displayVariables.size, 0, 'c3 displayVariables');
    assert.equal(c3._listeners.mirror.length, 1, 'c3 _listeners.mirror');
    c3.mirrorsFrom(c2, [ fieldCollection ]);
    assert.equal(c3.displayVariables.size, 0, 'c3 displayVariables');
    assert.equal(c3._listeners.mirror.length, 2, 'c3 _listeners.mirror');
    c1.displayVariables = [vEC, vTemp];
    assert.equal([...c1.displayVariables].map(v => v.id).sort().join(','), 'ECMWF,temperature', 'c1 displayVariables');
    assert.equal([...c3.displayVariables].map(v => v.id).sort().join(','), 'ECMWF', 'c3 displayVariables');
    c2.displayVariables = [vGFS, vGeopot];
    assert.equal([...c2.displayVariables].map(v => v.id).sort().join(','), 'GFS,geopotential', 'c2 displayVariables');
    assert.equal([...c3.displayVariables].map(v => v.id).sort().join(','), 'ECMWF,geopotential', 'c3 displayVariables');
    assert.equal(changeDisplayVariablesCounterC1, 1, 'changeDisplayVariablesCounterC1');
    assert.equal(changeDisplayVariablesCounterC2, 1, 'changeDisplayVariablesCounterC2');
    assert.equal(changeDisplayVariablesCounterC3, 2, 'changeDisplayVariablesCounterC3');
    c3.mirrorsFrom(c1, [ modelCollection, runCollection ]);
    assert.equal([...c3.displayVariables].map(v => v.id).sort().join(','), 'ECMWF,geopotential', 'c3 displayVariables');
    assert.equal(c3._listeners.mirror.length, 2, 'c3 _listeners.mirror');
    c1.displayVariables = [vEC, vRun, vTemp];
    assert.equal([...c1.displayVariables].map(v => v.id).sort().join(','), '1572696000000,ECMWF,temperature', 'c1 displayVariables');
    assert.equal([...c3.displayVariables].map(v => v.id).sort().join(','), '1572696000000,ECMWF,geopotential', 'c3 displayVariables');
    assert.equal(changeDisplayVariablesCounterC1, 2, 'changeDisplayVariablesCounterC1');
    assert.equal(changeDisplayVariablesCounterC2, 1, 'changeDisplayVariablesCounterC2');
    assert.equal(changeDisplayVariablesCounterC3, 3, 'changeDisplayVariablesCounterC3');
    c3.mirrorsFrom(c2, [ runCollection, fieldCollection ]);
    assert.equal([...c3.displayVariables].map(v => v.id).sort().join(','), '1572696000000,ECMWF,geopotential', 'c3 displayVariables');
    assert.equal(c3._listeners.mirror.length, 2, 'c3 _listeners.mirror');
    c2.exchangeDisplayVariable([vRun2]);
    assert.equal([...c2.displayVariables].map(v => v.id).sort().join(','), '1572739200000,GFS,geopotential', 'c2 displayVariables');
    assert.equal([...c3.displayVariables].map(v => v.id).sort().join(','), '1572739200000,ECMWF,geopotential', 'c3 displayVariables');
    assert.equal(changeDisplayVariablesCounterC1, 2, 'changeDisplayVariablesCounterC1');
    assert.equal(changeDisplayVariablesCounterC2, 2, 'changeDisplayVariablesCounterC2');
    assert.equal(changeDisplayVariablesCounterC3, 4, 'changeDisplayVariablesCounterC3');
  });
  it('remove', () => {
    const resources = makeResources();
    const modelviewer = new Modelviewer({ resources });
    assert.equal(modelviewer.timeline.getSetIDs().length, 0, 'no timeline set-ID');
    const c1 = new Container();
    const c2 = new Container();
    const c3 = new Container();
    modelviewer.append(c1, c2, c3);
    assert.equal(modelviewer.timeline.getSetIDs().length, 3, '3 timeline set-IDs');
    modelviewer.remove(c2);
    assert.equal(modelviewer.timeline.getSetIDs().length, 2, '3 timeline set-IDs');
  });
  it('Container class, import via name', () => {
    let c = new ContainerClass();
    assert.equal(c.id, undefined, 'id');
    assert.notEqual(c.display, undefined, 'display');
    assert.equal(c.modelviewer, undefined, 'modelviewer');
  });
});