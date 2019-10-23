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
    collectTimesVariableCollections: [models, runs]
  });
}
export default makeResources;

export let fillImageResources = resources => {
  resources.getNodeByVariableCollectionId('models').variableCollection.variables.forEach(model => {
    resources.getNodeByVariableCollectionId('runs').variableCollection.variables.forEach(run => {
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
}