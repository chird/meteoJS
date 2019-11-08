﻿import assert from 'assert';
import VariableCollection from '../../../src/meteoJS/modelviewer/VariableCollection.js';
import Variable from '../../../src/meteoJS/modelviewer/Variable.js';
import TimeVariable from '../../../src/meteoJS/modelviewer/TimeVariable.js';
import NWPResources from '../../../src/meteoJS/modelviewer/NWPResources.js';

describe('NWPResources', () => {
  it('some tests', () => {
    let resources = new NWPResources();
    assert.ok(resources.models instanceof VariableCollection, 'instanceof models');
    assert.ok(resources.runs instanceof VariableCollection, 'instanceof runs');
    assert.ok(resources.regions instanceof VariableCollection, 'instanceof regions');
    assert.ok(resources.fields instanceof VariableCollection, 'instanceof fields');
    assert.ok(resources.levels instanceof VariableCollection, 'instanceof levels');
    assert.ok(resources.accumulations instanceof VariableCollection, 'instanceof accumulations');
    assert.ok(resources.thresholds instanceof VariableCollection, 'instanceof thresholds');
    resources.addVariable(resources.models, { id: 'ECMWF' });
    resources.addVariable(resources.models, { id: 'GFS' });
    resources.addVariable(resources.runs, { datetime: new Date(Date.UTC(2019, 10, 23)) });
    resources.addVariable(resources.fields, { id: 'temp', name: 'Geopotential/Temperature' });
    resources.addVariable(resources.fields, { id: 'pcp', name: 'Pcp', names: { de: 'Niederschlag', en: 'Precipitation' } });
    resources.addVariable(resources.levels, { id: '500hPa' });
    console.log(resources.levels.variables.length);
    resources.addVariable(resources.levels, { id: '850hPa' });
    console.log(resources.levels.variables.length);
    resources.addVariable(resources.levels, { id: '10m' });
    console.log(resources.levels.variables.length);
    resources.addVariable(resources.levels, { id: '700hPa' });
    console.log(resources.levels.variables.length);
    resources.addVariable(resources.levels, { id: '2m' });
    console.log(resources.levels.variables.length);
    resources.addVariable(resources.levels, { id: '925hPa' });
    console.log(resources.levels.variables.length);
    assert.equal(resources.models.variables.length, 2, 'models variables');
    assert.ok(resources.models.variables[0] instanceof Variable, 'ECMWF variable');
    assert.equal(resources.models.variables[0].id, 'ECMWF', 'ECMWF variable');
    assert.equal(resources.models.variables[0].variableCollection, resources.models, 'ECMWF collection');
    assert.ok(resources.models.variables[1] instanceof Variable, 'GFS variable');
    assert.equal(resources.models.variables[1].id, 'GFS', 'GFS variable');
    assert.equal(resources.models.variables[1].variableCollection, resources.models, 'GFS collection');
    assert.equal(resources.runs.variables.length, 1, 'runs variables');
    assert.ok(resources.runs.variables[0] instanceof TimeVariable, 'Run variable');
    assert.equal(resources.runs.variables[0].variableCollection, resources.runs, 'Run collection');
    assert.equal(resources.fields.variables.length, 2, 'fields variables');
    assert.ok(resources.fields.variables[0] instanceof Variable, 'temp variable');
    assert.equal(resources.fields.variables[0].id, 'temp', 'temp variable');
    assert.equal(resources.fields.variables[0].variableCollection, resources.fields, 'temp collection');
    assert.equal(resources.fields.variables[0].name, 'Geopotential/Temperature', 'temp name');
    assert.ok(resources.fields.variables[1] instanceof Variable, 'pcp variable');
    assert.equal(resources.fields.variables[1].id, 'pcp', 'pcp variable');
    assert.equal(resources.fields.variables[1].variableCollection, resources.fields, 'pcp collection');
    assert.equal(resources.fields.variables[1].name, 'Niederschlag', 'pcp name');
    assert.equal(resources.fields.variables[1].getNameByLang(), 'Niederschlag', 'pcp names');
    assert.equal(resources.fields.variables[1].getNameByLang('de'), 'Niederschlag', 'pcp names');
    assert.equal(resources.fields.variables[1].getNameByLang('en'), 'Precipitation', 'pcp names');
    console.log(resources.levels.variables.length);
    assert.equal(resources.levels.variables.length, 6, 'levels variables');
    assert.equal(resources.levels.variables.map(v => v.id).join(','), '300hPa,500hPa,700hPa,850hPa,925hPa,10m,2m', 'sorted levels');
  });
});