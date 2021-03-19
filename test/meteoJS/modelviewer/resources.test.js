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
  it('variableCollections', () => {
    let vcA = new VariableCollection({ id: 'testA' });
    let vcB = new VariableCollection({ id: 'testB' });
    let vcC = new VariableCollection({ id: 'testC' });
    let vcD = new VariableCollection({ id: 'testD' });
    let vcE = new VariableCollection({ id: 'testE' });
    let vcF = new VariableCollection({ id: 'testF' });
    let topNode = new Node(vcA);
    let nodeB = new Node(vcB);
    topNode.appendChild(nodeB, new Node(vcC));
    let nodeE = new Node(vcE);
    nodeB.appendChild(new Node(vcD), nodeE);
    nodeE.appendChild(new Node(vcF));
    let resources = new Resources({ topNode });
    assert.equal(resources.variableCollections.length, 6, 'count of collections');
    assert.ok(resources.variableCollections.indexOf(vcA) > -1, 'vcA');
    assert.ok(resources.variableCollections.indexOf(vcB) > -1, 'vcB');
    assert.ok(resources.variableCollections.indexOf(vcC) > -1, 'vcC');
    assert.ok(resources.variableCollections.indexOf(vcD) > -1, 'vcD');
    assert.ok(resources.variableCollections.indexOf(vcE) > -1, 'vcE');
    assert.ok(resources.variableCollections.indexOf(vcF) > -1, 'vcF');
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
      resources.getNodeByVariableCollectionId('testA').variableCollection.id,
      'testA', 'ID testA');
    assert.equal(
      resources.getNodeByVariableCollectionId('testB').variableCollection.id,
      'testB', 'ID testB');
    assert.equal(
      resources.getNodeByVariableCollectionId('testC').variableCollection.id,
      'testC', 'ID testC');
    assert.equal(
      resources.getNodeByVariableCollectionId(new VariableCollection({ id: ''})).variableCollection.id,
      undefined, 'unknown id');
  });
  it('append/getAvailableVariables/remove/availableVariablesMap', async function() {
    this.timeout(200);
    let models = new VariableCollection({ id: 'models' });
    models.append(
      new Variable({ id: 'ECMWF' }),
      new Variable({ id: 'GFS' })
    );
    let ECmodel = models.getVariableById('ECMWF');
    assert.equal(ECmodel.id, 'ECMWF', 'ECMWF variable');
    let runs = new VariableCollection({ id: 'runs' });
    runs.append(
      new TimeVariable({ datetime: new Date(Date.UTC(2019, 9, 26, 0)) }),
      new TimeVariable({ datetime: new Date(Date.UTC(2019, 9, 25, 12)) }),
      new TimeVariable({ datetime: new Date(Date.UTC(2019, 9, 25, 0)) })
    );
    let firstRun = runs.getVariableById(1572048000000);
    assert.equal(firstRun.id, 1572048000000, 'Run variable');
    assert.equal(runs.items.length, 3, '3 runs');
    let fields = new VariableCollection({ id: 'fields' });
    fields.append(
      new Variable({ id: 'precipitation' }),
      new Variable({ id: 'geopotential' }),
      new Variable({ id: 'wind' })
    );
    let PrecField = fields.getVariableById('precipitation');
    assert.equal(PrecField.id, 'precipitation', 'Field variable');
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
    let OffsetVariable = offsets.getVariableById(12);
    assert.equal(OffsetVariable.id, 12, 'Offset variable');
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
    await new Promise((resolve, reject) => {
      let eventFired = false;
      resources.on('change:resources', () => eventFired = true);
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
      let intervalId;
      let counter = 0;
      intervalId = setInterval(() => {
        if (eventFired) {
          clearInterval(intervalId);
          resolve();
        }
        counter++;
        if (counter > 10) {
          clearInterval(intervalId);
          reject();
        }
      }, 100);
    });
    assert.equal(modelNode.resources.length, 0, '0 resources in models');
    assert.equal(runNode.resources.length, 0, '0 resources in runs');
    assert.equal(fieldNode.resources.length, 0, '0 resources in fields');
    assert.equal(offsetNode.resources.length, 162, '162 resources in offsets');
    assert.equal(offsetNode._resources.size, 18, 'internal: Count of resourcesTreeNode in Map _resources');
    for (const mapByVariable of offsetNode._resources.values())
      for (const resources of mapByVariable.values())
        assert.equal(resources.size, 1, 'internal: Count of resources in each Map-element in _resources');
    assert.equal(changeResourcesCount, 1, 'changeResourcesCount');
    assert.equal(addedResourcesCount, 162, 'addedResourcesCount');
    assert.equal(removedResourcesCount, 0, 'removedResourcesCount');
    let EC_runs1 =
      resources
      .getAvailableVariables(
        runs,
        { variables: [ ECmodel, firstRun ] }
      );
    assert.equal(EC_runs1.size, 1, '1 available ECMWF-Run');
    let EC_runs =
      resources.getAvailableVariables(runs, { variables: [ECmodel] });
    assert.equal(EC_runs.size, 3, '3 available ECMWF-Runs');
    assert.equal(offsetNode.getResourcesByVariables(offsets.getItemById(0)).length, 18, '18 resources with offset 0');
    assert.equal(offsetNode.getResourcesByVariables(offsets.getItemById(3)).length, 18, '18 resources with offset 3');
    assert.equal(resources.availableVariablesMap.size, 4, '4 elements in availableVariablesMap');
    assert.equal(resources.availableVariablesMap.get(modelNode).size, 2, '2 models with available resources');
    assert.equal(resources.availableVariablesMap.get(runNode).size, 3, '3 runs with available resources');
    assert.equal(resources.availableVariablesMap.get(fieldNode).size, 3, '3 fields with available resources');
    assert.equal(resources.availableVariablesMap.get(offsetNode).size, 9, '9 offsets with available resources');
    resources.remove(...resources
      .getNodeByVariableCollection(offsets)
      .resources
      .filter(resource =>
        resource.getVariableByVariableCollection(models).id == 'ECMWF' &&
        !(resource.getVariableByVariableCollection(offsets).id % 12)));
    assert.equal(offsetNode.resources.length, 135, '135 resources in offsets');
    assert.equal(offsetNode.getResourcesByVariables(offsets.getItemById(0)).length, 9, '9 resources with offset 0');
    assert.equal(offsetNode.getResourcesByVariables(offsets.getItemById(3)).length, 18, '18 resources with offset 3');
    assert.equal(resources.availableVariablesMap.size, 4, '4 elements in availableVariablesMap');
    assert.equal(resources.availableVariablesMap.get(modelNode).size, 2, '2 models with available resources');
    assert.equal(resources.availableVariablesMap.get(runNode).size, 3, '3 runs with available resources');
    assert.equal(resources.availableVariablesMap.get(fieldNode).size, 3, '3 fields with available resources');
    assert.equal(resources.availableVariablesMap.get(offsetNode).size, 9, '9 offsets with available resources');
    assert.equal(changeResourcesCount, 2, 'changeResourcesCount');
    assert.equal(addedResourcesCount, 162, 'addedResourcesCount');
    assert.equal(removedResourcesCount, 27, 'removedResourcesCount');
    resources.remove(...resources
      .getNodeByVariableCollection(offsets)
      .resources
      .filter(resource =>
        !(resource.getVariableByVariableCollection(offsets).id % 12)));
    assert.equal(offsetNode.resources.length, 108, '135 resources in offsets');
    assert.equal(offsetNode.getResourcesByVariables(offsets.getItemById(0)).length, 0, '0 resources with offset 0');
    assert.equal(offsetNode.getResourcesByVariables(offsets.getItemById(3)).length, 18, '18 resources with offset 3');
    assert.equal(resources.availableVariablesMap.size, 4, '4 elements in availableVariablesMap');
    assert.equal(resources.availableVariablesMap.get(modelNode).size, 2, '2 models with available resources');
    assert.equal(resources.availableVariablesMap.get(runNode).size, 3, '3 runs with available resources');
    assert.equal(resources.availableVariablesMap.get(fieldNode).size, 3, '3 fields with available resources');
    assert.equal(resources.availableVariablesMap.get(offsetNode).size, 6, '6 offsets with available resources');
    assert.equal(changeResourcesCount, 3, 'changeResourcesCount');
    assert.equal(addedResourcesCount, 162, 'addedResourcesCount');
    assert.equal(removedResourcesCount, 54, 'removedResourcesCount');
  });
  it('getAvailableVariables', () => {
    const models = new VariableCollection({ id: 'models' });
    models.append(
      new Variable({ id: 'ECMWF' }),
      new Variable({ id: 'GFS' }),
      new Variable({ id: 'UKMO' })
    );
    const runs = new VariableCollection({ id: 'runs' });
    const firstRun =
      new TimeVariable({ datetime: new Date(Date.UTC(2020, 11, 13, 0)) });
    runs.append(
      firstRun,
      new TimeVariable({ datetime: new Date(Date.UTC(2020, 11, 13, 12)) }),
      new TimeVariable({ datetime: new Date(Date.UTC(2020, 11, 14, 0)) }),
      new TimeVariable({ datetime: new Date(Date.UTC(2020, 11, 14, 12)) })
    );
    const points = new VariableCollection({ id: 'points' });
    points.append(
      new Variable({ id: 'A' }),
      new Variable({ id: 'B' }),
      new Variable({ id: 'C' }),
      new Variable({ id: 'D' }),
      new Variable({ id: 'E' })
    );
    const modelNode = new Node(models);
    const runNode = new Node(runs);
    const pointsNode = new Node(points);
    modelNode.appendChild(runNode.appendChild(pointsNode));
    const resources = new Resources({ topNode: modelNode });
    Array.from(models).forEach((model, i) => {
      if (i > 1) return;
      Array.from(runs).forEach((run, i) => {
        if (i > 2) return;
        Array.from(points).forEach((point, i) => {
          if (i > 3) return;
          resources.append(new Resource({
            variables: [model, run, point]
          }));
        });
      });
    });
    assert.equal(pointsNode.resources.length, 24, 'resources.length');
    assert.equal(resources.getAvailableVariables(models).size, 2, 'getAvailableVariables(models)');
    assert.equal(resources.getAvailableVariables(runs).size, 3, 'getAvailableVariables(runs)');
    assert.equal(resources.getAvailableVariables(points).size, 4, 'getAvailableVariables(points)');
    assert.equal(resources.getAvailableVariables(models, {
      variables: [ models.getItemById('ECMWF') ]
    }).size, 1, 'getAvailableVariables(models), only ECMWF');
    assert.equal(resources.getAvailableVariables(models, {
      variables: [ firstRun ]
    }).size, 2, 'getAvailableVariables(models), only first Run');
    assert.equal(resources.getAvailableVariables(models, {
      variables: [ points.getItemById('A') ]
    }).size, 2, 'getAvailableVariables(models), only A');
    assert.equal(resources.getAvailableVariables(models, {
      variables: [ firstRun, points.getItemById('A') ]
    }).size, 2, 'getAvailableVariables(models), only first Run and A');
    assert.equal(resources.getAvailableVariables(models, {
      variables: [ models.getItemById('ECMWF'), firstRun, points.getItemById('A') ]
    }).size, 1, 'getAvailableVariables(models), only ECMWF, first Run and A');
    assert.equal(resources.getAvailableVariables(runs, {
      variables: [ models.getItemById('ECMWF') ]
    }).size, 3, 'getAvailableVariables(runs), only ECMWF');
    assert.equal(resources.getAvailableVariables(runs, {
      variables: [ firstRun ]
    }).size, 1, 'getAvailableVariables(runs), only first Run');
    assert.equal(resources.getAvailableVariables(runs, {
      variables: [ points.getItemById('A') ]
    }).size, 3, 'getAvailableVariables(runs), only A');
    assert.equal(resources.getAvailableVariables(runs, {
      variables: [ firstRun, points.getItemById('A') ]
    }).size, 1, 'getAvailableVariables(runs), only first Run and A');
    assert.equal(resources.getAvailableVariables(runs, {
      variables: [ models.getItemById('ECMWF'), firstRun, points.getItemById('A') ]
    }).size, 1, 'getAvailableVariables(runs), only ECMWF, first Run and A');
    assert.equal(resources.getAvailableVariables(points, {
      variables: [ models.getItemById('ECMWF') ]
    }).size, 4, 'getAvailableVariables(points), only ECMWF');
    assert.equal(resources.getAvailableVariables(points, {
      variables: [ firstRun ]
    }).size, 4, 'getAvailableVariables(points), only first Run');
    assert.equal(resources.getAvailableVariables(points, {
      variables: [ points.getItemById('A') ]
    }).size, 1, 'getAvailableVariables(points), only A');
    assert.equal(resources.getAvailableVariables(points, {
      variables: [ firstRun, points.getItemById('A') ]
    }).size, 1, 'getAvailableVariables(points), only first Run and A');
    assert.equal(resources.getAvailableVariables(points, {
      variables: [ models.getItemById('ECMWF'), firstRun, points.getItemById('A') ]
    }).size, 1, 'getAvailableVariables(points), only ECMWF, first Run and A');
  });
  it('getTopMostNodeWithAllVariables', () => {
    let resources = makeResources();
    let model = resources.getNodeByVariableCollectionId('models')
      .variableCollection.getItemById('ECMWF');
    let date = new Date(Date.UTC(2019, 10, 3));
    let run = resources.getNodeByVariableCollectionId('runs')
      .variableCollection.getItemById(date.valueOf());
    let field = resources.getNodeByVariableCollectionId('fields')
      .variableCollection.getItemById('wind');
    let level = resources.getNodeByVariableCollectionId('levels')
      .variableCollection.getItemById('500hPa');
    assert.equal(resources.getTopMostNodeWithAllVariables().variableCollection.id, 'models');
    assert.equal(resources.getTopMostNodeWithAllVariables(model).variableCollection.id, 'models');
    assert.equal(resources.getTopMostNodeWithAllVariables(run).variableCollection.id, 'runs');
    assert.equal(resources.getTopMostNodeWithAllVariables(field).variableCollection.id, 'fields');
    assert.equal(resources.getTopMostNodeWithAllVariables(level).variableCollection.id, 'levels');
    assert.equal(resources.getTopMostNodeWithAllVariables(model, run).variableCollection.id, 'runs');
    assert.equal(resources.getTopMostNodeWithAllVariables(model, run, field).variableCollection.id, 'fields');
    assert.equal(resources.getTopMostNodeWithAllVariables(model, run, level).variableCollection.id, 'levels');
    assert.equal(resources.getTopMostNodeWithAllVariables(model, run, field, level).variableCollection.id, 'levels');
    assert.equal(resources.getTopMostNodeWithAllVariables(field, level).variableCollection.id, 'levels');
    assert.equal(resources.getTopMostNodeWithAllVariables(model, field).variableCollection.id, 'fields');
    assert.equal(resources.getTopMostNodeWithAllVariables(new Variable()).variableCollection.id, undefined, 'no variableCollection');
    assert.equal(resources.getTopMostNodeWithAllVariables(model, run, new Variable()).variableCollection.id, undefined, 'no variableCollection');
  });
  it('getTimesByVariables', async () => {
    let resources = makeResources();
    await fillImageResources(resources);
    let date = new Date(Date.UTC(2019, 10, 3));
    let model = resources.getNodeByVariableCollectionId('models')
      .variableCollection.getItemById('ECMWF');
    assert.equal(model.id, 'ECMWF', 'model id');
    let run = resources.getNodeByVariableCollectionId('runs')
      .variableCollection.getItemById(date.valueOf());
    assert.equal(run.datetime.valueOf(), date.valueOf(), 'run id');
    let field = resources.getNodeByVariableCollectionId('fields')
      .variableCollection.getItemById('wind');
    assert.equal(field.id, 'wind', 'wind id');
    const level = resources.getNodeByVariableCollectionId('levels')
      .variableCollection.getItemById('850hPa');
    assert.equal(level.id, '850hPa', '850hPa id');
    assert.equal(resources.getTimesByVariables().length, 33, 'No times');
    assert.equal(resources.getTimesByVariables({ variables: [model] }).length, 33, 'No times only for model');
    assert.equal(resources.getTimesByVariables({ variables: [run] }).length, 25, 'No times only for run');
    let time = undefined;
    assert.equal(resources.getTimesByVariables({ variables: [model, run] })
      .map(t => {
        assert.ok(t instanceof Date, 'Date object');
        assert.ok(time === undefined || time.valueOf() < t.valueOf(), 'sortation');
      })
      .length,
      25, 'Times for model, run');
    assert.equal(resources.getTimesByVariables({ variables: [model, run, field] }).length, 25, 'Times for model, run, field');
    assert.equal(resources.getTimesByVariables({ variables: [model, run, field, level] }).length, 25, 'Times for full definition');
    assert.equal(resources.getTimesByVariables({ exact: true }).length, 0, 'No times');
    assert.equal(resources.getTimesByVariables({ variables: [model], exact: true }).length, 0, 'No times exactly for one model');
    assert.equal(resources.getTimesByVariables({ variables: [run], exact: true }).length, 0, 'No times exactly for one run');
    assert.equal(resources.getTimesByVariables({ variables: [model, run], exact: true }).length, 0, 'No times exactly for one model and run');
    assert.equal(resources.getTimesByVariables({ variables: [model, run, field], exact: true }).length, 0, 'No times exactly for one model, run and field');
    assert.equal(resources.getTimesByVariables({ variables: [model, run, field, level], exact: true }).length, 25, 'Times for exact definition');
  });
});
describe('Resources class, import via name', () => {
  it('simple', () => {
    let resources = new Resources({
      topNode: new Node(new VariableCollection())
    });
  });
});