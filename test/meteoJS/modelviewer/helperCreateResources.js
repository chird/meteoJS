import Variable from '../../../src/meteoJS/modelviewer/Variable.js';
import TimeVariable from '../../../src/meteoJS/modelviewer/TimeVariable.js';
import VariableCollection
  from '../../../src/meteoJS/modelviewer/VariableCollection.js';
import Node from '../../../src/meteoJS/modelviewer/Node.js';
import Resources from '../../../src/meteoJS/modelviewer/Resources.js';

export let makeResources = () => {
  // Build hierarchy
  let models = new VariableCollection({ id: 'models' });
  models.append(
    new Variable({ id: 'ECMWF' }),
    new Variable({ id: 'GFS' })
  );
  let runs = new VariableCollection({ id: 'runs' });
  runs.append(
    new TimeVariable({ datetime: new Date(Date.UTC(2019, 10, 3)) }),
    new TimeVariable({ datetime: new Date(Date.UTC(2019, 10, 2, 12)) }),
    new TimeVariable({ datetime: new Date(Date.UTC(2019, 10, 2)) })
  );
  let fields = new VariableCollection({ id: 'fields' });
  fields.append(
    new Variable({ id: 'temperature' }),
    new Variable({ id: 'geopotential' }),
    new Variable({ id: 'wind' })
  );
  let levels = new VariableCollection({ id: 'levels' });
  levels.append(
    new Variable({ id: '500hPa' }),
    new Variable({ id: '850hPa' }),
    new Variable({ id: '10m' })
  );
  let topNode = new Node(models);
  let runNode = new Node(runs);
  let fieldNode = new Node(fields);
  let levelNode = new Node(levels);
  topNode.appendChild(runNode.appendChild(fieldNode.appendChild(levelNode)));
  
  // Create objects
  return new Resources({
    topNode,
    timesVariableCollections: new Set([models, runs])
  });
}
export default makeResources;

export let fillImageResources = async resources => {
  return new Promise((resolve, reject) => {
    let eventFired = false;
    resources.on('change:resources', () => eventFired = true);
    resources.getNodeByVariableCollectionId('models').variableCollection.variables.forEach(model => {
      resources.getNodeByVariableCollectionId('runs').variableCollection.variables.forEach(run => {
        if (model.id == 'GFS' && 
            (run.id % (24*60*60*1000)) != 0)
          return;
        resources.getNodeByVariableCollectionId('fields').variableCollection.variables.forEach(field => {
          resources.getNodeByVariableCollectionId('levels').variableCollection.variables.forEach(level => {
            if (level.id == '10m' &&
                field.id != 'wind')
              return;
            [...Array(25).keys()].map(offset => { return offset*3*3600; })
            .forEach(offset => {
              if (field.id == 'geopotential' &&
                  (offset/3600) % 6 != 0)
                return;
              resources.appendImage({
                variables: [model, run, field, level],
                run: run.datetime,
                offset
              });
            });
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
}

export let makeAdvancedResources = () => {
  // Build hierarchy
  let models = new VariableCollection({ id: 'models' });
  models.append(
    new Variable({ id: 'ECMWF' }),
    new Variable({ id: 'GFS' })
  );
  let runs = new VariableCollection({ id: 'runs' });
  runs.append(
    new TimeVariable({ datetime: new Date(Date.UTC(2019, 10, 3)) }),
    new TimeVariable({ datetime: new Date(Date.UTC(2019, 10, 2, 12)) }),
    new TimeVariable({ datetime: new Date(Date.UTC(2019, 10, 2)) })
  );
  let fields = new VariableCollection({ id: 'fields' });
  fields.append(
    new Variable({ id: 'temperature' }),
    new Variable({ id: 'geopotential' }),
    new Variable({ id: 'wind' }),
    new Variable({ id: 'precipitation' })
  );
  let levels = new VariableCollection({ id: 'levels' });
  levels.append(
    new Variable({ id: '500hPa' }),
    new Variable({ id: '850hPa' }),
    new Variable({ id: '10m' })
  );
  let accumulations = new VariableCollection({ id: 'accumulations' });
  accumulations.append(
    new Variable({ id: '6h' }),
    new Variable({ id: '12h' }),
    new Variable({ id: '24h' })
  );
  let thresholds = new VariableCollection({ id: 'thresholds' });
  thresholds.append(
    new Variable({ id: '>1mm' }),
    new Variable({ id: '>10mm' }),
    new Variable({ id: '>25mm' })
  );
  let topNode = new Node(models);
  let runNode = new Node(runs);
  let fieldNode = new Node(fields);
  let levelNode = new Node(levels);
  let accumulationNode = new Node(accumulations);
  let thresholdNode = new Node(thresholds);
  fieldNode
  .appendChild(levelNode.appendChild(thresholdNode))
  .appendChild(accumulationNode.appendChild(thresholdNode));
  topNode.appendChild(runNode.appendChild(fieldNode));
  
  // Create objects
  return new Resources({
    topNode,
    timesVariableCollections: new Set([models, runs])
  });
}

export let fillImageAdvancedResources = async resources => {
  return new Promise((resolve, reject) => {
    let eventFired = false;
    resources.on('change:resources', () => eventFired = true);
    resources.getNodeByVariableCollectionId('models').variableCollection.variables.forEach(model => {
      resources.getNodeByVariableCollectionId('runs').variableCollection.variables.forEach(run => {
        resources.getNodeByVariableCollectionId('fields').variableCollection.variables.forEach(field => {
          if (field.id == 'precipitation')
            return;
          resources.getNodeByVariableCollectionId('levels').variableCollection.variables.forEach(level => {
            if (level.id == '10m' &&
                field.id != 'wind')
              return;
            [...Array(25).keys()].map(offset => { return offset*3*3600; })
            .forEach(offset => {
              if (field.id == 'geopotential' &&
                  (offset/3600) % 6 != 0)
                return;
              resources.appendImage({
                variables: [model, run, field, level],
                run: run.datetime,
                offset
              });
            });
            resources.getNodeByVariableCollectionId('thresholds').variableCollection.variables.forEach(threshold => {
              if (field.id != 'wind')
                return;
              [...Array(25).keys()].map(offset => { return offset*3*3600; })
              .forEach(offset => {
                resources.appendImage({
                  variables: [model, run, field, level, threshold],
                  run: run.datetime,
                  offset
                });
              });
            });
          });
        });
      });
    });
    resources.getNodeByVariableCollectionId('models').variableCollection.variables.forEach(model => {
      resources.getNodeByVariableCollectionId('runs').variableCollection.variables.forEach(run => {
        resources.getNodeByVariableCollectionId('fields').variableCollection.variables.forEach(field => {
          if (field.id != 'precipitation')
            return;
          resources.getNodeByVariableCollectionId('accumulations').variableCollection.variables.forEach(accumulation => {
            [...Array(13).keys()].map(offset => { return offset*6*3600; })
            .forEach(offset => {
              resources.appendImage({
                variables: [model, run, field, accumulation],
                run: run.datetime,
                offset
              });
            });
            resources.getNodeByVariableCollectionId('thresholds').variableCollection.variables.forEach(threshold => {
              [...Array(13).keys()].map(offset => { return offset*6*3600; })
              .forEach(offset => {
                resources.appendImage({
                  variables: [model, run, field, accumulation, threshold],
                  run: run.datetime,
                  offset
                });
              });
            });
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
}