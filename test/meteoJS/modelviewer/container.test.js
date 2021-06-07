import assert from 'assert';
import 'jsdom-global/register';
import {
  makeResources,
  fillImageResources,
  makeAdvancedResources,
  fillImageAdvancedResources
} from './helperCreateResources.js';
import VariableCollection
  from '../../../src/meteoJS/modelviewer/VariableCollection.js';
import Node from '../../../src/meteoJS/modelviewer/Node.js';
import Resources from '../../../src/meteoJS/modelviewer/Resources.js';
import Modelviewer from '../../../src/meteoJS/Modelviewer.js';
import Display from '../../../src/meteoJS/modelviewer/Display.js';
import Variable from '../../../src/meteoJS/modelviewer/Variable.js';
import TimeVariable from '../../../src/meteoJS/modelviewer/TimeVariable.js';
import Resource from '../../../src/meteoJS/modelviewer/Resource.js';
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
    assert.equal(c.selectedVariables.size, 4, 'selectedVariables count');
    assert.equal([...c.selectedVariables].map(v => v.id).sort().join(','), '10m,1572739200000,GFS,geopotential', 'selectedVariables');
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
    assert.equal(changedVisibleResourceCounter, 6, 'changedVisibleResourceCounter');
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
      assert.equal(c.selectedVariables.size, 3, 'selectedVariables count');
      assert.equal(c.visibleResource.id, undefined, 'no visibleResource');
      assert.equal(c.enabledTimes.length, 0, 'enabledTimes');
      assert.equal(c.modelviewer.timeline.getTimes().length, 0, 'timeline times');
      assert.equal(changedDisplayVariableCounter, 6, 'changedDisplayVariableCounter');
      assert.equal(changedVisibleResourceCounter, 6, 'changedVisibleResourceCounter');
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 500);
      })
      .then(() => {
        assert.equal(changedSelectedVariableCounter, 2, 'changedSelectedVariableCounter');
        assert.equal(c.visibleResource.id, undefined, 'no visibleResource');
        assert.equal([...lastAddedVariables].map(v => v.id).sort().join(','), '850hPa,temperature', 'addedVariables');
        assert.equal([...lastRemovedVariables].map(v => v.id).sort().join(','), '1572739200000,500hPa,geopotential', 'removedVariables');
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
    assert.equal(c.visibleResource.variables.map(v => v.id).sort().join(','), '1572739200000,6h,>25mm,ECMWF,precipitation', 'resource variables');
    assert.equal(c.visibleResource.datetime.valueOf(), date2.valueOf(), 'resource datetime');
    assert.equal(c.enabledTimes.length, 13, 'enabledTimes');
    assert.equal(c.modelviewer.timeline.getTimes().length, 25, 'timeline times');
  });
  it('displayVariables, disable adaptSuitableResource, advanced', async function () {
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const modelNode = new Node(new VariableCollection({ id: 'models' }));
    const runNode = new Node(new VariableCollection({ id: 'runs' }));
    const regionNode = new Node(new VariableCollection({ id: 'regions' }));
    const fieldNode = new Node(new VariableCollection({ id: 'fields' }));
    const levelNode = new Node(new VariableCollection({ id: 'levels' }));
    const accumulationNode = new Node(new VariableCollection({ id: 'accumulations' }));
    const pointNode = new Node(new VariableCollection({ id: 'points' }));
    modelNode
      .appendChild(runNode
        .appendChild(regionNode
          .appendChild(fieldNode
            .appendChild(levelNode)
            .appendChild(accumulationNode)),
          pointNode));
    const resources = new Resources({
      topNode: modelNode,
      timesVariableCollections: new Set([modelNode.variableCollection, runNode.variableCollection])
    });
    const modelviewer = new Modelviewer({ resources });
    const c1 = new Container({ adaptSuitableResource: { enabled: false } });
    modelviewer.append(c1);
    assert.equal(c1.displayVariables.size, 0, 'displayVariables count');
    assert.equal(c1.selectedVariables.size, 0, 'selectedVariables count');
    assert.equal(c1.enabledTimes.length, 0, 'enabledTimes');
    assert.equal(c1.modelviewer.timeline.getTimes().length, 0, 'timeline times');
    const model = new Variable({ id: 'ECMWF' });
    modelNode.variableCollection.append(model);
    const run1 = new TimeVariable({ datetime: new Date(Date.UTC(2021, 6, 1)) });
    const run2 = new TimeVariable({ datetime: new Date(Date.UTC(2021, 6, 1, 12)) });
    runNode.variableCollection.append(run1, run2);
    const point1 = new Variable({ id: 'zrh' });
    const point2 = new Variable({ id: 'lug' });
    pointNode.variableCollection.append(point1, point2);
    for (const r of runNode.variableCollection) {
      resources.append(new Resource({ variables: [model, r] }));
      for (const p of pointNode.variableCollection)
        resources.append(new Resource({ variables: [model, r, p] }));
    }
    await delay(200); // Wait until Resources' change:resources is fired
    assert.equal(c1.displayVariables.size, 0, 'displayVariables count');
    assert.equal(c1.selectedVariables.size, 0, 'selectedVariables count');
    assert.equal(c1.enabledTimes.length, 0, 'enabledTimes');
    assert.equal(c1.modelviewer.timeline.getTimes().length, 0, 'timeline times');
    c1.displayVariables = [model, run1, point1];
    assert.equal(c1.displayVariables.size, 3, 'displayVariables count');
    assert.equal(c1.selectedVariables.size, 3, 'selectedVariables count');
    assert.equal(c1.enabledTimes.length, 0, 'enabledTimes');
    assert.equal(c1.modelviewer.timeline.getTimes().length, 0, 'timeline times');
    [...Array(25).keys()].map(offset => offset*3600).forEach(offset => {
      resources.append(new Resource({
        variables: [model, run1, point1],
        run: run1.datetime,
        offset
      }));
    });
    await delay(200); // Wait until Resources' change:resources is fired
    assert.equal(c1.displayVariables.size, 3, 'displayVariables count');
    assert.equal([...c1.displayVariables].map(v => v.id).sort().join(','), '1625097600000,ECMWF,zrh', 'displayVariables after added first data');
    assert.equal(c1.selectedVariables.size, 3, 'selectedVariables count');
    assert.equal([...c1.selectedVariables].map(v => v.id).sort().join(','), '1625097600000,ECMWF,zrh', 'selectedVariables after added first data');
    assert.equal(c1.enabledTimes.length, 25, 'enabledTimes after added first data');
    assert.equal(c1.modelviewer.timeline.getTimes().length, 25, 'timeline times after added first data');
    c1.exchangeDisplayVariable([point2]);
    assert.equal(c1.displayVariables.size, 3, 'displayVariables count');
    assert.equal([...c1.displayVariables].map(v => v.id).sort().join(','), '1625097600000,ECMWF,lug', 'displayVariables after added changed to point2');
    assert.equal(c1.selectedVariables.size, 3, 'selectedVariables count');
    assert.equal([...c1.selectedVariables].map(v => v.id).sort().join(','), '1625097600000,ECMWF,lug', 'selectedVariables after added changed to point2');
    assert.equal(c1.enabledTimes.length, 0, 'enabledTimes after added changed to point2');
    assert.equal(c1.modelviewer.timeline.getTimes().length, 25, 'timeline times after added changed to point2');
    [...Array(25).keys()].map(offset => offset*3600).forEach(offset => {
      resources.append(new Resource({
        variables: [model, run1, point2],
        run: run1.datetime,
        offset
      }));
    });
    await delay(200); // Wait until Resources' change:resources is fired
    assert.equal(c1.displayVariables.size, 3, 'displayVariables count');
    assert.equal([...c1.displayVariables].map(v => v.id).sort().join(','), '1625097600000,ECMWF,lug', 'displayVariables after added data for point2');
    assert.equal(c1.selectedVariables.size, 3, 'selectedVariables count');
    assert.equal([...c1.selectedVariables].map(v => v.id).sort().join(','), '1625097600000,ECMWF,lug', 'selectedVariables after added data for point2');
    assert.equal(c1.enabledTimes.length, 25, 'enabledTimes after added data for point2');
    assert.equal(c1.modelviewer.timeline.getTimes().length, 25, 'timeline times after added data for point2');
    c1.exchangeDisplayVariable([run2]);
    assert.equal(c1.displayVariables.size, 3, 'displayVariables count');
    assert.equal([...c1.displayVariables].map(v => v.id).sort().join(','), '1625140800000,ECMWF,lug', 'displayVariables after change to run2');
    assert.equal(c1.selectedVariables.size, 3, 'selectedVariables count');
    assert.equal([...c1.selectedVariables].map(v => v.id).sort().join(','), '1625140800000,ECMWF,lug', 'selectedVariables after change to run2');
    assert.equal(c1.enabledTimes.length, 0, 'enabledTimes after change to run2');
    assert.equal(c1.modelviewer.timeline.getTimes().length, 0, 'timeline times after change to run2');
    [...Array(25).keys()].map(offset => offset*3600).forEach(offset => {
      resources.append(new Resource({
        variables: [model, run2, point2],
        run: run2.datetime,
        offset
      }));
    });
    await delay(200); // Wait until Resources' change:resources is fired
    assert.equal(c1.displayVariables.size, 3, 'displayVariables count');
    assert.equal([...c1.displayVariables].map(v => v.id).sort().join(','), '1625140800000,ECMWF,lug', 'displayVariables after added data for run2');
    assert.equal(c1.selectedVariables.size, 3, 'selectedVariables count');
    assert.equal([...c1.selectedVariables].map(v => v.id).sort().join(','), '1625140800000,ECMWF,lug', 'selectedVariables after added data for run2');
    assert.equal(c1.enabledTimes.length, 25, 'enabledTimes after added data for run2');
    assert.equal(c1.modelviewer.timeline.getTimes().length, 25, 'timeline times after added data for run2');

    const region1 = new Variable({ id: 'EU' });
    regionNode.variableCollection.append(region1);
    const field1 = new Variable({ id: 'pcp' });
    fieldNode.variableCollection.append(field1);
    const acc1 = new Variable({ id: '3h' });
    accumulationNode.variableCollection.append(acc1);
    const level1 = new Variable({ id: '700hPa' });
    levelNode.variableCollection.append(level1);
    [...Array(9).keys()].map(offset => offset*3*3600).forEach(offset => {
      resources.append(new Resource({
        variables: [model, run1, region1, field1, acc1],
        run: run1.datetime,
        offset
      }));
      resources.append(new Resource({
        variables: [model, run1, region1, field1, level1],
        run: run1.datetime,
        offset
      }));
    });
    await delay(200); // Wait until Resources' change:resources is fired
    assert.equal(c1.displayVariables.size, 3, 'displayVariables count');
    assert.equal([...c1.displayVariables].map(v => v.id).sort().join(','), '1625140800000,ECMWF,lug', 'displayVariables after added some other data');
    assert.equal(c1.selectedVariables.size, 3, 'selectedVariables count');
    assert.equal([...c1.selectedVariables].map(v => v.id).sort().join(','), '1625140800000,ECMWF,lug', 'selectedVariables after added some other data');
    assert.equal(c1.enabledTimes.length, 25, 'enabledTimes after added some other data');
    assert.equal(c1.modelviewer.timeline.getTimes().length, 25, 'timeline times after added some other data');
    c1.exchangeDisplayVariable([point1]);
    assert.equal(c1.displayVariables.size, 3, 'displayVariables count');
    assert.equal([...c1.displayVariables].map(v => v.id).sort().join(','), '1625140800000,ECMWF,zrh', 'displayVariables after back-change to point1');
    assert.equal(c1.selectedVariables.size, 3, 'selectedVariables count');
    assert.equal([...c1.selectedVariables].map(v => v.id).sort().join(','), '1625140800000,ECMWF,zrh', 'selectedVariables after back-change to point1');
    assert.equal(c1.enabledTimes.length, 0, 'enabledTimes after back-change to point1');
    assert.equal(c1.modelviewer.timeline.getTimes().length, 25, 'timeline times after back-change to point1');
    [...Array(25).keys()].map(offset => offset*3600).forEach(offset => {
      resources.append(new Resource({
        variables: [model, run2, point1],
        run: run2.datetime,
        offset
      }));
    });
    await delay(200); // Wait until Resources' change:resources is fired
    assert.equal(c1.displayVariables.size, 3, 'displayVariables count');
    assert.equal([...c1.displayVariables].map(v => v.id).sort().join(','), '1625140800000,ECMWF,zrh', 'displayVariables');
    assert.equal(c1.selectedVariables.size, 3, 'selectedVariables count');
    assert.equal([...c1.selectedVariables].map(v => v.id).sort().join(','), '1625140800000,ECMWF,zrh', 'selectedVariables');
    assert.equal(c1.enabledTimes.length, 25, 'enabledTimes');
    assert.equal(c1.modelviewer.timeline.getTimes().length, 25, 'timeline times');
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
    const c2MirrorsFrom = c2.getMirrorsFrom();
    assert.equal(c2.displayVariables.size, 0, 'c2 displayVariables');
    assert.equal(c2MirrorsFrom.size, 1, 'Mirrors from 1 container');
    for (const [container, variableCollections] of c2MirrorsFrom.entries()) {
      assert.equal(container, c1, 'c2 mirrors from c1');
      assert.equal(variableCollections.length, 4, 'c2 mirrors 4 VariableCollections');
      assert.equal(variableCollections.map(c => c.id).sort().join(','), 'fields,levels,models,runs', 'Mirrored VariableCollections');
    }
    c1.displayVariables = [vEC];
    assert.equal([...c1.displayVariables].map(v => v.id).sort().join(','), 'ECMWF', 'c1 displayVariables');
    assert.equal([...c2.displayVariables].map(v => v.id).sort().join(','), 'ECMWF', 'c2 displayVariables');
    c3.mirrorsFrom(c1);
    assert.equal([...c3.displayVariables].map(v => v.id).sort().join(','), 'ECMWF', 'c3 displayVariables');
    const c3MirrorsFrom = c3.getMirrorsFrom();
    assert.equal(c3MirrorsFrom.size, 1, 'Mirrors from 1 container');
    for (const [container, variableCollections] of c3MirrorsFrom.entries()) {
      assert.equal(container, c1, 'c3 mirrors from c1');
      assert.equal(variableCollections.length, 4, 'c3 mirrors 4 VariableCollections');
      assert.equal(variableCollections.map(c => c.id).sort().join(','), 'fields,levels,models,runs', 'Mirrored VariableCollections');
    }
    c2.mirrorsFrom();
    assert.equal([...c2.displayVariables].map(v => v.id).sort().join(','), 'ECMWF', 'c2 displayVariables');
    assert.equal(c2.getMirrorsFrom().size, 0, 'Mirrors from 0 container');
    c2.displayVariables = new Set([vGFS, vTemp]);
    assert.equal([...c2.displayVariables].map(v => v.id).sort().join(','), 'GFS,temperature', 'c2 displayVariables');
    c3.mirrorsFrom(c2);
    assert.equal([...c3.displayVariables].map(v => v.id).sort().join(','), 'GFS,temperature', 'c3 displayVariables');
    assert.equal(c3.getMirrorsFrom().size, 1, 'Mirrors from 1 container');
    for (const [container, variableCollections] of c3.getMirrorsFrom().entries()) {
      assert.equal(container, c2, 'c3 mirrors from c2');
      assert.equal(variableCollections.length, 4, 'c3 mirrors 4 VariableCollections');
      assert.equal(variableCollections.map(c => c.id).sort().join(','), 'fields,levels,models,runs', 'Mirrored VariableCollections');
    }
    c2.mirrorsFrom(c1);
    assert.equal([...c1.displayVariables].map(v => v.id).sort().join(','), 'ECMWF', 'c1 displayVariables');
    assert.equal(c2.getMirrorsFrom().size, 1, 'Mirrors from 1 container');
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
    const c3MirrorsFrom = c3.getMirrorsFrom();
    assert.equal(c3MirrorsFrom.size, 2, 'Mirrors from 2 container');
    const c3MirrorKeys = [...c3MirrorsFrom.keys()];
    const c3MirrorValues = [...c3MirrorsFrom.values()];
    assert.equal(c3MirrorKeys.map(c => c.id).sort().join(','), 'container1,container2', 'c3 mirrors from c1 and c2');
    assert.equal(c3MirrorValues.map(colls => colls.map(c => c.id).sort().join(',')).sort().join(';'), 'fields;models', 'c3 mirrored VariableCollections');
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