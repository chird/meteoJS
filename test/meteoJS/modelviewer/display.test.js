import assert from 'assert';
import 'jsdom-global/register';
import Modelviewer from '../../../src/meteoJS/Modelviewer.js';
import { makeResources, fillImageResources }
  from './helperCreateResources.js';
import Container from '../../../src/meteoJS/modelviewer/Container.js';
import Display from '../../../src/meteoJS/modelviewer/Display.js';
import { Display as DisplayClass }
  from '../../../src/meteoJS/modelviewer/Display.js';
import Variable from '../../../src/meteoJS/modelviewer/Variable.js';

describe('modelviewer/Display', () => {
  let resources = makeResources();
  it('Display - early modelviewer assignment', () => {
    let d = new Display();
    assert.equal(d.modelviewer, undefined, 'modelviewer');
    assert.equal(d.container, undefined, 'container');
    assert.equal(d.parentNode, undefined, 'parentNode');
    let c = new Container({
      display: d
    });
    assert.equal(d.modelviewer, undefined, 'modelviewer');
    assert.equal(d.container, c, 'container');
    assert.equal(d.container.containerNode, undefined, 'containerNode');
    assert.equal(d.parentNode, undefined, 'parentNode');
    let node = document.createElement('div');
    node.appendChild(document.createElement('div'));
    assert.equal(node.childNodes.length, 1, 'parentNode.childNodes');
    c.containerNode = node;
    assert.equal(d.modelviewer, undefined, 'modelviewer');
    assert.equal(d.container, c, 'container');
    assert.equal(d.container.containerNode, node, 'containerNode');
    assert.equal(d.parentNode, node, 'parentNode');
    assert.equal(d.parentNode.childNodes.length, 0, 'parentNode.childNodes');
    node.appendChild(document.createElement('div'));
    assert.equal(d.parentNode.childNodes.length, 1, 'parentNode.childNodes');
    let m = new Modelviewer({ resources });
    m.append(c);
    assert.equal(d.modelviewer, m, 'modelviewer');
    assert.equal(d.container, c, 'container');
    assert.equal(d.container.containerNode, node, 'containerNode');
    assert.equal(d.parentNode, node, 'parentNode');
    assert.equal(d.parentNode.childNodes.length, 0, 'parentNode.childNodes');
  });
  it('Display - late modelviewer assignment', () => {
    let d = new Display();
    assert.equal(d.modelviewer, undefined, 'modelviewer');
    assert.equal(d.container, undefined, 'container');
    assert.equal(d.parentNode, undefined, 'parentNode');
    let m = new Modelviewer({ resources });
    let c = new Container({
      display: d
    });
    let node = document.createElement('div');
    node.appendChild(document.createElement('div'));
    c.containerNode = node;
    assert.equal(c.containerNode, node, 'containerNode');
    assert.equal(c.containerNode.childNodes.length, 0, 'containerNode.childNodes');
    m.append(c);
    assert.equal(c.containerNode, node, 'containerNode');
    assert.equal(c.containerNode.childNodes.length, 0, 'containerNode.childNodes');
    assert.equal(d.modelviewer, m, 'modelviewer');
    assert.equal(d.container, c, 'container');
    assert.equal(d.parentNode, node, 'parentNode');
  });
  it('Display - event tests', async function () {
    this.timeout(5000);
    const delay = ms => new Promise(res => setTimeout(res, ms));
    let models = resources.getNodeByVariableCollectionId('models').variableCollection;
    let runs = resources.getNodeByVariableCollectionId('runs').variableCollection;
    let fields = resources.getNodeByVariableCollectionId('fields').variableCollection;
    let levels = resources.getNodeByVariableCollectionId('levels').variableCollection;
    let initDisplayCounter = 0;
    let addVariableCollectionCounter = 0;
    let addVariableCounter = 0;
    let changeSelectedVariableCounter = 0;
    let aV = new Map();
    let selectedVariables = new Map();
    const testMaps = (testDefs) => {
      testDefs.forEach(tests => {
        assert.equal([...aV.get(tests[0])].map(v => v.id).sort().join(','), tests[1], `availableVariables - ${tests[0].id}`);
        assert.equal(selectedVariables.get(tests[0]).id, tests[2], `selectedVariable - ${tests[0].id}`);
      });
    }
    resources.variableCollections.forEach(collection => {
      aV.set(collection, new Set());
      selectedVariables.set(collection, new Variable());
    });
    let d = new Display();
    d.on('init:display', () => initDisplayCounter++);
    d.on('add:variableCollection', () => addVariableCollectionCounter++);
    d.on('add:variable', () => addVariableCounter++);
    d.on('change:availableVariables', ({ availableVariables, variableCollection }) => {
      aV.set(variableCollection, availableVariables);
    });
    d.on('change:selectedVariable', ({ variable, variableCollection }) => {
      selectedVariables.set(variableCollection, variable);
      changeSelectedVariableCounter++;
    });
    let c = new Container({
      display: d
    });
    assert.equal(initDisplayCounter, 0, 'initDisplayCounter');
    assert.equal(addVariableCollectionCounter, 0, 'addVariableCollectionCounter');
    assert.equal(addVariableCounter, 0, 'addVariableCounter');
    assert.equal(changeSelectedVariableCounter, 0, 'changeSelectedVariableCounter');
    let m = new Modelviewer({ resources });
    m.append(c);
    assert.equal(initDisplayCounter, 1, 'initDisplayCounter');
    assert.equal(addVariableCollectionCounter, 4, 'addVariableCollectionCounter');
    assert.equal(addVariableCounter, 11, 'addVariableCounter');
    assert.equal(changeSelectedVariableCounter, 0, 'changeSelectedVariableCounter');
    testMaps([
      [models, '', undefined],
      [runs, '', undefined],
      [fields, '', undefined],
      [levels, '', undefined]
    ]);
    await fillImageResources(resources);
    assert.equal(addVariableCollectionCounter, 4, 'addVariableCollectionCounter');
    assert.equal(addVariableCounter, 11, 'addVariableCounter');
    await delay(500);
    assert.equal(changeSelectedVariableCounter, 4, 'changeSelectedVariableCounter');
    assert.equal([...c.selectedVariables].map(v => v.id).sort().join(','), '1572739200000,500hPa,ECMWF,temperature', 'selectedVariables');
    testMaps([
      [models, 'ECMWF,GFS', 'ECMWF'],
      [runs, '1572652800000,1572696000000,1572739200000', '1572739200000'],
      [fields, 'geopotential,temperature,wind', 'temperature'],
      [levels, '500hPa,850hPa', '500hPa']
    ]);
    fields.append(new Variable({ id: 'vorticity' }));
    assert.equal(addVariableCounter, 12, 'addVariableCounter');
    c.exchangeDisplayVariable([models.getItemById('ECMWF')]);
    await delay(500);
    assert.equal([...c.selectedVariables].map(v => v.id).sort().join(','), '1572739200000,500hPa,ECMWF,temperature', 'selectedVariables');
    assert.equal(changeSelectedVariableCounter, 4, 'changeSelectedVariableCounter');
    testMaps([
      [models, 'ECMWF,GFS', 'ECMWF'],
      [runs, '1572652800000,1572696000000,1572739200000', '1572739200000'],
      [fields, 'geopotential,temperature,wind', 'temperature'],
      [levels, '500hPa,850hPa', '500hPa']
    ]);
    c.exchangeDisplayVariable([models.getItemById('GFS')]);
    await delay(500);
    assert.equal([...c.selectedVariables].map(v => v.id).sort().join(','), '1572739200000,500hPa,GFS,temperature', 'selectedVariables');
    assert.equal(changeSelectedVariableCounter, 5, 'changeSelectedVariableCounter');
    testMaps([
      [models, 'ECMWF,GFS', 'GFS'],
      [runs, '1572652800000,1572739200000', '1572739200000'],
      [fields, 'geopotential,temperature,wind', 'temperature'],
      [levels, '500hPa,850hPa', '500hPa']
    ]);
    c.exchangeDisplayVariable([levels.getItemById('10m')]);
    await delay(500);
    assert.equal([...c.selectedVariables].map(v => v.id).sort().join(','), '1572739200000,500hPa,GFS,temperature', 'selectedVariables');
    assert.equal(changeSelectedVariableCounter, 5, 'changeSelectedVariableCounter');
    testMaps([
      [models, 'ECMWF,GFS', 'GFS'],
      [runs, '1572652800000,1572739200000', '1572739200000'],
      [fields, 'geopotential,temperature,wind', 'temperature'],
      [levels, '500hPa,850hPa', '500hPa']
    ]);
    c.exchangeDisplayVariable([fields.getItemById('wind')]);
    await delay(500);
    assert.equal([...c.selectedVariables].map(v => v.id).sort().join(','), '10m,1572739200000,GFS,wind', 'selectedVariables');
    assert.equal(changeSelectedVariableCounter, 7, 'changeSelectedVariableCounter');
    testMaps([
      [models, 'ECMWF,GFS', 'GFS'],
      [runs, '1572652800000,1572739200000', '1572739200000'],
      [fields, 'geopotential,temperature,wind', 'wind'],
      [levels, '10m,500hPa,850hPa', '10m']
    ]);
    c.exchangeDisplayVariable([fields.getItemById('temperature')]);
    await delay(500);
    assert.equal([...c.selectedVariables].map(v => v.id).sort().join(','), '1572739200000,500hPa,GFS,temperature', 'selectedVariables');
    assert.equal(changeSelectedVariableCounter, 9, 'changeSelectedVariableCounter');
    testMaps([
      [models, 'ECMWF,GFS', 'GFS'],
      [runs, '1572652800000,1572739200000', '1572739200000'],
      [fields, 'geopotential,temperature,wind', 'temperature'],
      [levels, '500hPa,850hPa', '500hPa']
    ]);
    c.displayVariables = [
      models.getItemById('ECMWF'),
      runs.getItemById(1572739200000),
      fields.getItemById('wind'),
      levels.getItemById('10m')
    ];
    await delay(500);
    assert.equal([...c.selectedVariables].map(v => v.id).sort().join(','), '10m,1572739200000,ECMWF,wind', 'selectedVariables');
    assert.equal(changeSelectedVariableCounter, 12, 'changeSelectedVariableCounter');
    testMaps([
      [models, 'ECMWF,GFS', 'ECMWF'],
      [runs, '1572652800000,1572696000000,1572739200000', '1572739200000'],
      [fields, 'geopotential,temperature,wind', 'wind'],
      [levels, '10m,500hPa,850hPa', '10m']
    ]);
    c.exchangeDisplayVariable([fields.getItemById('vorticity')]);
    await delay(500);
    assert.equal([...c.selectedVariables].map(v => v.id).sort().join(','), '1572739200000,500hPa,ECMWF,temperature', 'selectedVariables');
    assert.equal(changeSelectedVariableCounter, 14, 'changeSelectedVariableCounter');
  });
  it('Display class, import via name', () => {
    let c = new DisplayClass();
    assert.equal(c.modelviewer, undefined, 'modelviewer');
  });
});