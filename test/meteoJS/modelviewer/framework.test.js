import assert from 'assert';
import 'jsdom-global/register';
import makeResources from './helperCreateResources.js';
import Container from '../../../src/meteoJS/modelviewer/Container.js';
import Display from '../../../src/meteoJS/modelviewer/Display.js';
import Modelviewer from '../../../src/meteoJS/Modelviewer.js';

describe('Simple modelviewer setup', () => {
  // Create objects
  let resources = makeResources();
  let containersNode = document.createElement('div');
  let modelviewer = new Modelviewer({ resources, containersNode });
  modelviewer.append(
    new Container(),
    new Container(),
    new Container()
  );
  
  // Create resources
  /* intentionally after creating objects. In real world, the resources are
   * loaded, after the objects are created. */
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
  
  // Testing
});