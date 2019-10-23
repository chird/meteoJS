import assert from 'assert';
import { makeResources, fillImageResources } from './helperCreateResources.js';
import Variable from '../../../src/meteoJS/modelviewer/Variable.js';
import TimeVariable from '../../../src/meteoJS/modelviewer/TimeVariable.js';
import VariableCollection from '../../../src/meteoJS/modelviewer/VariableCollection.js';
import Node from '../../../src/meteoJS/modelviewer/Node.js';
import Resource from '../../../src/meteoJS/modelviewer/Resource.js';
import Resources from '../../../src/meteoJS/modelviewer/Resources.js';
import { Resources as ResourcesClass } from '../../../src/meteoJS/modelviewer/Resources.js';

describe('Resources class, import via default', () => {
  it('topNode', () => {
    let topNode = new Node(new VariableCollection({ id: 'test' }));
    let resources = new Resources({ topNode });
    assert.ok(resources.topNode === topNode, 'topNode');
  });
  it('getNodeByVariableCollection', () => {
    let vcA = new VariableCollection({ id: 'testA' });
    let vcB = new VariableCollection({ id: 'testB' });
    let vcC = new VariableCollection({ id: 'testC' });
    let topNode = new Node(vcA);
    topNode.appendChild(new Node(vcB), new Node(vcC));
    let resources = new Resources({ topNode });
    assert.equal(
      resources.getNodeByVariableCollection(vcA).variableCollection.id,
      'testA', 'vcA');
    assert.equal(
      resources.getNodeByVariableCollection(vcB).variableCollection.id,
      'testB', 'vcB');
    assert.equal(
      resources.getNodeByVariableCollection(vcC).variableCollection.id,
      'testC', 'vcC');
    assert.equal(
      resources.getNodeByVariableCollection(new VariableCollection({ id: ''})).variableCollection.id,
      undefined, 'unknown collection');
    assert.equal(
      resources.getNodeByVariableCollection(new VariableCollection({ id: 'testB'})).variableCollection.id,
      undefined, 'unknown collection');
    assert.equal(
      resources.getNodeByVariableCollectionById('testA').variableCollection.id,
      'testA', 'ID testA');
    assert.equal(
      resources.getNodeByVariableCollectionById('testB').variableCollection.id,
      'testB', 'ID testB');
    assert.equal(
      resources.getNodeByVariableCollectionById('testC').variableCollection.id,
      'testC', 'ID testC');
    assert.equal(
      resources.getNodeByVariableCollectionById(new VariableCollection({ id: ''})).variableCollection.id,
      undefined, 'unknown id');
  });
  it('append/getAvailableVariables/remove', () => {
    let models = new VariableCollection({ id: 'models' });
    models.append(
      new Variable({ id: 'ECMWF' }),
      new Variable({ id: 'GFS' })
    );
    let ECmodel = models.getVariableById('ECMWF');
    assert.equal(ECmodel.id, 'ECMWF', 'ECMWF variable');
    let runs = new VariableCollection({ id: 'runs' });
    runs.append(
      new TimeVariable({ datetime: new Date('2019-09-26T00:00:00') }),
      new TimeVariable({ datetime: new Date('2019-09-25T12:00:00') }),
      new TimeVariable({ datetime: new Date('2019-09-25T00:00:00') })
    );
    assert.equal(runs.items.length, 3, '3 runs');
    let fields = new VariableCollection({ id: 'fields' });
    fields.append(
      new Variable({ id: 'precipitation' }),
      new Variable({ id: 'geopotential' }),
      new Variable({ id: 'wind' })
    );
    let offsets = new VariableCollection({ id: 'offsets' });
    offsets.append(
      new Variable({ id: 0 }),
      new Variable({ id: 3 }),
      new Variable({ id: 6 }),
      new Variable({ id: 9 }),
      new Variable({ id: 12 }),
      new Variable({ id: 15 }),
      new Variable({ id: 18 }),
      new Variable({ id: 21 }),
      new Variable({ id: 24 })
    );
    let modelNode = new Node(models);
    let runNode = new Node(runs);
    let fieldNode = new Node(fields);
    let offsetNode = new Node(offsets);
    modelNode.appendChild(runNode.appendChild(fieldNode.appendChild(offsetNode)));
    let resources = new Resources({ topNode: modelNode });
    let changeResourcesCount = 0;
    let addedResourcesCount = 0;
    let removedResourcesCount = 0;
    resources.on('change:resources', ({ addedResources = [], removedResources = [] }) => {
      changeResourcesCount++
      addedResourcesCount += addedResources.length;
      removedResourcesCount += removedResources.length;
    });
    assert.equal(
      resources.getNodeByVariableCollection(models).variableCollection.id,
      'models', 'find models collection');
    assert.equal(
      resources.getNodeByVariableCollection(runs).variableCollection.id,
      'runs', 'find runs collection');
    assert.equal(
      resources.getNodeByVariableCollection(fields).variableCollection.id,
      'fields', 'find fields collection');
    assert.equal(
      resources.getNodeByVariableCollection(offsets).variableCollection.id,
      'offsets', 'find offsets collection');
    models.items.forEach(model => {
      runs.items.forEach(run => {
        fields.items.forEach(field => {
          offsets.items.forEach(offset => {
            resources.append(new Resource({
              variables: [model, run, field, offset]
            }));
          });
        });
      });
    });
    assert.equal(modelNode.resources.length, 0, '0 resources in models');
    assert.equal(runNode.resources.length, 0, '0 resources in runs');
    assert.equal(fieldNode.resources.length, 0, '0 resources in fields');
    assert.equal(offsetNode.resources.length, 162, '162 resources in offsets');
    assert.equal(Object.keys(offsetNode._resources).length, 9+3+3+2, 'internal: count of ids for _resources');
    assert.equal(changeResourcesCount, 162, 'changeResourcesCount');
    assert.equal(addedResourcesCount, 162, 'addedResourcesCount');
    assert.equal(removedResourcesCount, 0, 'removedResourcesCount');
    let EC_runs =
      resources.getAvailableVariables(runs, { variables: [ECmodel] });
    assert.equal(EC_runs.length, 3, '3 available ECMWF-Runs');
    resources.remove(...resources
      .getNodeByVariableCollection(offsets)
      .resources
      .filter(resource =>
        resource.getVariableByVariableCollection(models).id == 'ECMWF' &&
        !(resource.getVariableByVariableCollection(offsets).id % 12)));
    assert.equal(changeResourcesCount, 163, 'changeResourcesCount');
    assert.equal(addedResourcesCount, 162, 'addedResourcesCount');
    assert.equal(removedResourcesCount, 27, 'removedResourcesCount');
  });
  it('getTimes', () => {
    let resources = makeResources();
    fillImageResources(resources);
    let date = new Date(Date.UTC(2019, 10, 3));
    let model = resources.getNodeByVariableCollectionById('models')
      .variableCollection.getItemById('ECMWF');
    assert.equal(model.id, 'ECMWF', 'model id');
    let run = resources.getNodeByVariableCollectionById('runs')
      .variableCollection.getItemById(date.valueOf());
    assert.equal(run.datetime.valueOf(), date.valueOf(), 'run id');
    let field = resources.getNodeByVariableCollectionById('fields')
      .variableCollection.getItemById('wind');
    assert.equal(field.id, 'wind', 'wind id');
    let geopot = resources.getNodeByVariableCollectionById('fields')
      .variableCollection.getItemById('geopotential');
    assert.equal(geopot.id, 'geopotential', 'geopot id');
    let level = resources.getNodeByVariableCollectionById('levels')
      .variableCollection.getItemById('500hPa');
    assert.equal(level.id, '500hPa', 'level id');
    assert.equal(resources.getTimes(model, run).length, 0, 'No resources for model, wind');
    let times = resources.getTimes(model, run, field, level);
    assert.equal(times.length, 25, 'Resources for model, wind, field, level');
    assert.ok(times[0].valueOf() < times[1].valueOf(), 'Sorted upward');
    assert.equal(resources.getTimes(model, run, geopot, level).length, 13, 'Resources for model, wind, geopot, level');
    assert.equal(resources.getTimes(field).length, 33, 'Resources for level');
  });
});
describe('Resources class, import via name', () => {
  it('simple', () => {
    let resources = new Resources({
      topNode: new Node(new VariableCollection())
    });
  });
});