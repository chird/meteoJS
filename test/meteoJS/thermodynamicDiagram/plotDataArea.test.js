import assert from 'assert';
import { createSVGWindow } from 'svgdom';
import { SVG, registerWindow } from '@svgdotjs/svg.js';
const window = createSVGWindow();
const document = window.document;
import Sounding from '../../../src/meteoJS/Sounding.js';
import SkewTlogPDiagram from '../../../src/meteoJS/thermodynamicDiagram/coordinateSystem/SkewTlogPDiagram.js';
import DiagramSounding from '../../../src/meteoJS/thermodynamicDiagram/DiagramSounding.js';
import { default as PlotDataArea, PlotDataArea as PlotDataAreaClass }
  from '../../../src/meteoJS/thermodynamicDiagram/PlotDataArea.js';

registerWindow(window, document);

describe('PlotDataArea class, import via default', () => {
  it('Inheritiance tests', () => {
    let svgNode = SVG();
    let coordinateSystem = new SkewTlogPDiagram();
    let plotArea = new PlotDataArea({
      svgNode,
      coordinateSystem,
      x: 10,
      y: 20,
      width: 200,
      height: 150,
      visible: false,
      style: {
        overflow: 'visible',
        display: 'inline'
      }
    });
    assert.equal(plotArea.x, 10, 'x');
    assert.equal(plotArea.y, 20, 'y');
    assert.equal(plotArea.width, 200, 'width');
    assert.equal(plotArea.height, 150, 'height');
    assert.equal(plotArea.visible, false, 'visible');
    assert.equal(Object.keys(plotArea.style).length, 2, 'style');
    assert.equal(plotArea.style.overflow, 'visible', 'overflow');
    assert.equal(plotArea.style.display, 'none', 'display');
  });
  it('Add/remove soundings', () => {
    const plotArea = new PlotDataArea();
    let addSoundingCounter = 0;
    let removeSoundingCounter = 0;
    plotArea.on('add:sounding', () => addSoundingCounter++);
    plotArea.on('remove:sounding', () => removeSoundingCounter++);
    assert.equal(plotArea.svgNode.children().length, 2, 'svgNode.children');
    assert.equal(plotArea.svgNode.children()[0].children().length, 0, 'svgNode background');
    let soundingsNode = plotArea.svgNode.children()[1];
    assert.equal(soundingsNode.children().length, 0, 'svgNode data');
    assert.equal(addSoundingCounter, 0, 'addSoundingCounter');
    assert.equal(removeSoundingCounter, 0, 'removeSoundingCounter');
    
    let s1 = new DiagramSounding(new Sounding());
    let s2 = new DiagramSounding(new Sounding());
    plotArea.addSounding(s1);
    assert.equal(addSoundingCounter, 1, 'addSoundingCounter');
    assert.equal(removeSoundingCounter, 0, 'removeSoundingCounter');
    plotArea.addSounding(s2);
    assert.equal(plotArea.svgNode.children()[0].children().length, 0, 'svgNode background');
    assert.equal(soundingsNode.children().length, 2, 'svgNode data');
    assert.equal(soundingsNode.children()[0].css('display'), 'inline', 'display sounding');
    assert.equal(soundingsNode.children()[1].css('display'), 'inline', 'display sounding');
    assert.equal(addSoundingCounter, 2, 'addSoundingCounter');
    assert.equal(removeSoundingCounter, 0, 'removeSoundingCounter');
    s2.visible = false;
    assert.equal(soundingsNode.children()[0].css('display'), 'inline', 'display sounding');
    assert.equal(soundingsNode.children()[1].css('display'), 'none', 'display sounding');
    assert.equal(addSoundingCounter, 2, 'addSoundingCounter');
    assert.equal(removeSoundingCounter, 0, 'removeSoundingCounter');
    
    plotArea.removeSounding(s1);
    assert.equal(plotArea._svgNode.children()[1].children().length, 1, 'svgNode data');
    assert.equal(addSoundingCounter, 2, 'addSoundingCounter');
    assert.equal(removeSoundingCounter, 1, 'removeSoundingCounter');
    
    plotArea.coordinateSystem = new SkewTlogPDiagram();
    assert.equal(plotArea.svgNode.children().length, 2, 'svgNode.children');
    assert.equal(plotArea.svgNode.children()[0].children().length, 0, 'svgNode background');
    assert.equal(soundingsNode.children().length, 1, 'svgNode data');
    assert.equal(addSoundingCounter, 2, 'addSoundingCounter');
    assert.equal(removeSoundingCounter, 1, 'removeSoundingCounter');
  });
  it('drawing functions', () => {
    const s = new Sounding();
    for (let i=1; i<=10; i++) {
      if (i == 8) {
        s.addLevel({ pres: i*100, tmpk: undefined, dwpk: undefined });
        continue;
      }
      s.addLevel({ pres: i*100, tmpk: 270, dwpk: 270 });
    }
    const ds = new DiagramSounding(s);
    let plotArea;
    let getCoordinatesByLevelDataCounter = 0;
    const getCoordinatesByLevelData = (dataGroupId, sounding, levelData, pA) => {
      getCoordinatesByLevelDataCounter++;
      assert.equal(dataGroupId, 'temp', 'dataGroupId');
      assert.equal(sounding, ds, 'sounding');
      assert.equal(Object.keys(levelData).length, 3, 'levelData');
      assert.equal(pA, plotArea, 'plotArea');
      return (levelData.tmpk === undefined) ? {} : { x: 10, y: 10 };
    };
    let insertDataGroupIntoCounter = 0;
    plotArea = new PlotDataArea({
      dataGroupIds: ['temp'],
      getCoordinatesByLevelData,
      insertDataGroupInto: (svgNode, dataGroupId, sounding, data) => {
        insertDataGroupIntoCounter++;
        assert.equal(dataGroupId, 'temp', 'dataGroupId');
        assert.equal(sounding, ds, 'sounding');
        assert.equal(data.length, 9, 'data');
        assert.equal(Object.keys(data[0]).length, 3, 'data[0]');
      }
    });
    assert.equal(plotArea.dataGroupIds.length, 1, 'dataGroupIds');
    assert.equal(plotArea.dataGroupIds[0], 'temp', 'dataGroupIds');
    assert.equal(plotArea.getCoordinatesByLevelData, getCoordinatesByLevelData, 'getCoordinatesByLevelData');
    plotArea.init();
    plotArea.coordinateSystem = new SkewTlogPDiagram();
    plotArea.addSounding(ds);
    assert.equal(getCoordinatesByLevelDataCounter, 10, 'getCoordinatesByLevelDataCounter');
    assert.equal(insertDataGroupIntoCounter, 1, 'insertDataGroupIntoCounter');
  });
});
describe('PlotDataArea class, import via name', () => {
  it('empty object', () => {
    let svgNode = SVG();
    let coordinateSystem = new SkewTlogPDiagram();
    let plotArea = new PlotDataAreaClass({
      svgNode,
      coordinateSystem
    });
    assert.equal(plotArea.x, 0, 'x');
    assert.equal(plotArea.y, 0, 'y');
    assert.equal(plotArea.width, 100, 'width');
    assert.equal(plotArea.height, 100, 'height');
  });
});