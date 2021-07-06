import assert from 'assert';
import { createSVGWindow } from 'svgdom';
import { SVG, registerWindow } from '@svgdotjs/svg.js';
global.window = createSVGWindow();
global.document = window.document;
import Sounding from '../../../src/meteoJS/Sounding.js';
import SkewTlogPDiagram from '../../../src/meteoJS/thermodynamicDiagram/coordinateSystem/SkewTlogPDiagram.js';
import StueveDiagram from '../../../src/meteoJS/thermodynamicDiagram/coordinateSystem/StueveDiagram.js';
import DiagramSounding from '../../../src/meteoJS/thermodynamicDiagram/DiagramSounding.js';
import { default as PlotDataArea, PlotDataArea as PlotDataAreaClass }
  from '../../../src/meteoJS/thermodynamicDiagram/PlotDataArea.js';

registerWindow(global.window, global.document);

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
    let preinsertSoundingCounter = 0;
    let postinsertSoundingCounter = 0;
    plotArea.on('preinsert:sounding', e => {
      assert.ok('sounding' in e, 'e.sounding');
      assert.ok('node' in e, 'e.node');
      preinsertSoundingCounter++;
    });
    plotArea.on('postinsert:sounding', e => {
      assert.ok('sounding' in e, 'e.sounding');
      assert.ok('node' in e, 'e.node');
      postinsertSoundingCounter++;
    });
    assert.equal(plotArea.svgNode.children().length, 3, 'svgNode.children');
    assert.equal(plotArea.svgNode.children()[0].children().length, 0, 'svgNode background');
    let soundingsNode = plotArea.svgNode.children()[1];
    assert.equal(soundingsNode.children().length, 0, 'svgNode data');
    assert.equal(addSoundingCounter, 0, 'addSoundingCounter');
    assert.equal(removeSoundingCounter, 0, 'removeSoundingCounter');
    assert.equal(preinsertSoundingCounter, 0, 'preinsertSoundingCounter');
    assert.equal(postinsertSoundingCounter, 0, 'postinsertSoundingCounter');
    
    let s1 = new DiagramSounding(new Sounding());
    let s2 = new DiagramSounding(new Sounding());
    plotArea.addSounding(s1);
    assert.equal(addSoundingCounter, 1, 'addSoundingCounter');
    assert.equal(removeSoundingCounter, 0, 'removeSoundingCounter');
    assert.equal(preinsertSoundingCounter, 0, 'preinsertSoundingCounter');
    assert.equal(postinsertSoundingCounter, 0, 'postinsertSoundingCounter');
    plotArea.addSounding(s2);
    assert.equal(plotArea.svgNode.children()[0].children().length, 0, 'svgNode background');
    assert.equal(soundingsNode.children().length, 2, 'svgNode data');
    assert.equal(soundingsNode.children()[0].css('display'), 'inline', 'display sounding');
    assert.equal(soundingsNode.children()[1].css('display'), 'inline', 'display sounding');
    assert.equal(addSoundingCounter, 2, 'addSoundingCounter');
    assert.equal(removeSoundingCounter, 0, 'removeSoundingCounter');
    assert.equal(preinsertSoundingCounter, 0, 'preinsertSoundingCounter');
    assert.equal(postinsertSoundingCounter, 0, 'postinsertSoundingCounter');
    s2.visible = false;
    assert.equal(soundingsNode.children()[0].css('display'), 'inline', 'display sounding');
    assert.equal(soundingsNode.children()[1].css('display'), 'none', 'display sounding');
    assert.equal(addSoundingCounter, 2, 'addSoundingCounter');
    assert.equal(removeSoundingCounter, 0, 'removeSoundingCounter');
    assert.equal(preinsertSoundingCounter, 0, 'preinsertSoundingCounter');
    assert.equal(postinsertSoundingCounter, 0, 'postinsertSoundingCounter');
    
    plotArea.removeSounding(s1);
    assert.equal(plotArea._svgNode.children()[1].children().length, 1, 'svgNode data');
    assert.equal(addSoundingCounter, 2, 'addSoundingCounter');
    assert.equal(removeSoundingCounter, 1, 'removeSoundingCounter');
    assert.equal(preinsertSoundingCounter, 0, 'preinsertSoundingCounter');
    assert.equal(postinsertSoundingCounter, 0, 'postinsertSoundingCounter');
    
    plotArea.coordinateSystem = new SkewTlogPDiagram();
    assert.equal(plotArea.svgNode.children().length, 3, 'svgNode.children');
    assert.equal(plotArea.svgNode.children()[0].children().length, 0, 'svgNode background');
    assert.equal(soundingsNode.children().length, 1, 'svgNode data');
    assert.equal(addSoundingCounter, 2, 'addSoundingCounter');
    assert.equal(removeSoundingCounter, 1, 'removeSoundingCounter');
    assert.equal(preinsertSoundingCounter, 1, 'preinsertSoundingCounter');
    assert.equal(postinsertSoundingCounter, 1, 'postinsertSoundingCounter');
    
    plotArea.addSounding(s1);
    assert.equal(soundingsNode.children().length, 2, 'svgNode data');
    assert.equal(addSoundingCounter, 3, 'addSoundingCounter');
    assert.equal(removeSoundingCounter, 1, 'removeSoundingCounter');
    assert.equal(preinsertSoundingCounter, 2, 'preinsertSoundingCounter');
    assert.equal(postinsertSoundingCounter, 2, 'postinsertSoundingCounter');
    
    s1.visible = false;
    s2.visible = true;
    assert.equal(soundingsNode.children().length, 2, 'svgNode data');
    assert.equal(addSoundingCounter, 3, 'addSoundingCounter');
    assert.equal(removeSoundingCounter, 1, 'removeSoundingCounter');
    assert.equal(preinsertSoundingCounter, 2, 'preinsertSoundingCounter');
    assert.equal(postinsertSoundingCounter, 2, 'postinsertSoundingCounter');
    
    plotArea.coordinateSystem = new StueveDiagram();
    assert.equal(soundingsNode.children().length, 2, 'svgNode data');
    assert.equal(addSoundingCounter, 3, 'addSoundingCounter');
    assert.equal(removeSoundingCounter, 1, 'removeSoundingCounter');
    assert.equal(preinsertSoundingCounter, 4, 'preinsertSoundingCounter');
    assert.equal(postinsertSoundingCounter, 4, 'postinsertSoundingCounter');
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
  describe('filter data points', () => {
    it('no filtering', () => {
      const plotArea = new PlotDataArea();
      assert.equal(plotArea._minDataPointsDistance, 0, '_minDataPointsDistance');
      assert.equal(plotArea._filterDataPoint, undefined, '_filterDataPoint');
    });
    it('minDataPointsDistance', () => {
      const s = new Sounding();
      for (let i=1; i<=10; i++) {
        if (i == 7) {
          s.addLevel({ pres: i*10, tmpk: undefined, dwpk: undefined });
          continue;
        }
        s.addLevel({ pres: i*10, tmpk: 270, dwpk: 270 });
      }
      const ds = new DiagramSounding(s);
      let insertDataGroupIntoCounter = 0;
      let pointCounter = 0;
      const plotArea = new PlotDataArea({
        dataGroupIds: ['tmpk'],
        getCoordinatesByLevelData: (dataGroupId, sounding, levelData, pA) => {
          return (levelData.tmpk === undefined) ? {} : { x: levelData.pres, y: 10 };
        },
        insertDataGroupInto: (soundingGroup, dataGroupId, sounding, data, plotArea) => {
          pointCounter = data.length;
          insertDataGroupIntoCounter++;
        },
        minDataPointsDistance: 0
      });
      assert.equal(plotArea._minDataPointsDistance, 0, '_minDataPointsDistance');
      assert.ok(plotArea._filterDataPoint === undefined, '_filterDataPoint');
      assert.ok(plotArea._getFilterDataPointFunction() === undefined, '_getFilterDataPointFunction');
      plotArea.init();
      plotArea.coordinateSystem = new SkewTlogPDiagram();
      plotArea.addSounding(ds);
      assert.equal(insertDataGroupIntoCounter, 1, 'insertDataGroupIntoCounter');
      assert.equal(pointCounter, 9, 'pointCounter');
      plotArea.minDataPointsDistance = 10;
      assert.equal(plotArea._minDataPointsDistance, 10, '_minDataPointsDistance');
      assert.ok(plotArea._filterDataPoint === undefined, '_filterDataPoint');
      assert.ok(plotArea._getFilterDataPointFunction() !== undefined, '_getFilterDataPointFunction');
      const filter10 = plotArea._getFilterDataPointFunction();
      assert.ok(filter10({ x: 10, y: 0 }, { x: 10, y: 0 }), 'filter');
      assert.ok(filter10({ x: 10, y: 0 }, { x: 11, y: 0 }), 'filter');
      assert.ok(!filter10({ x: 10, y: 0 }, { x: 20, y: 0 }), 'filter');
      assert.ok(!filter10({ x: 10, y: 0 }, { x: 30, y: 0 }), 'filter');
      assert.ok(!filter10({ x: 10, y: 0 }, { x: 50, y: 0 }), 'filter');
      assert.equal(insertDataGroupIntoCounter, 2, 'insertDataGroupIntoCounter');
      assert.equal(pointCounter, 9, 'pointCounter');
      plotArea.minDataPointsDistance = 15;
      assert.equal(plotArea._minDataPointsDistance, 15, '_minDataPointsDistance');
      assert.ok(plotArea._filterDataPoint === undefined, '_filterDataPoint');
      assert.ok(plotArea._getFilterDataPointFunction() !== undefined, '_getFilterDataPointFunction');
      const filter15 = plotArea._getFilterDataPointFunction();
      assert.ok(filter15({ x: 10, y: 0 }, { x: 10, y: 0 }), 'filter');
      assert.ok(filter15({ x: 10, y: 0 }, { x: 11, y: 0 }), 'filter');
      assert.ok(filter15({ x: 10, y: 0 }, { x: 20, y: 0 }), 'filter');
      assert.ok(!filter15({ x: 10, y: 0 }, { x: 30, y: 0 }), 'filter');
      assert.ok(!filter15({ x: 10, y: 0 }, { x: 50, y: 0 }), 'filter');
      assert.equal(insertDataGroupIntoCounter, 3, 'insertDataGroupIntoCounter');
      assert.equal(pointCounter, 5, 'pointCounter');
      plotArea.minDataPointsDistance = 25;
      assert.equal(plotArea._minDataPointsDistance, 25, '_minDataPointsDistance');
      assert.ok(plotArea._filterDataPoint === undefined, '_filterDataPoint');
      assert.ok(plotArea._getFilterDataPointFunction() !== undefined, '_getFilterDataPointFunction');
      const filter25 = plotArea._getFilterDataPointFunction();
      assert.ok(filter25({ x: 10, y: 0 }, { x: 10, y: 0 }), 'filter');
      assert.ok(filter25({ x: 10, y: 0 }, { x: 11, y: 0 }), 'filter');
      assert.ok(filter25({ x: 10, y: 0 }, { x: 20, y: 0 }), 'filter');
      assert.ok(filter25({ x: 10, y: 0 }, { x: 30, y: 0 }), 'filter');
      assert.ok(!filter25({ x: 10, y: 0 }, { x: 50, y: 0 }), 'filter');
      assert.equal(insertDataGroupIntoCounter, 4, 'insertDataGroupIntoCounter');
      assert.equal(pointCounter, 3, 'pointCounter');
    });
    it('filterDataPoint', () => {
      const s = new Sounding();
      for (let i=1; i<=10; i++) {
        if (i == 7) {
          s.addLevel({ pres: i*10, tmpk: undefined, dwpk: undefined });
          continue;
        }
        s.addLevel({ pres: i*10, tmpk: 270, dwpk: 270 });
      }
      const ds = new DiagramSounding(s);
      let pointCounter = 0;
      let emptyLastPointDataCounter = 0;
      const filterDataPoint = (pointData, lastPointData) => {
        if (lastPointData.x === undefined)
          emptyLastPointDataCounter++;
        return pointData.x == 20;
      };
      const plotArea = new PlotDataArea({
        dataGroupIds: ['tmpk'],
        getCoordinatesByLevelData: (dataGroupId, sounding, levelData, pA) => {
          return (levelData.tmpk === undefined) ? {} : { x: levelData.pres, y: 10 };
        },
        insertDataGroupInto: (soundingGroup, dataGroupId, sounding, data, plotArea) => {
          pointCounter = data.length;
        },
        filterDataPoint
      });
      assert.equal(plotArea._minDataPointsDistance, 0, '_minDataPointsDistance');
      assert.ok(plotArea._filterDataPoint !== undefined, '_filterDataPoint');
      assert.equal(plotArea._getFilterDataPointFunction(), filterDataPoint, '_getFilterDataPointFunction');
      plotArea.init();
      plotArea.coordinateSystem = new SkewTlogPDiagram();
      plotArea.addSounding(ds);
      assert.equal(emptyLastPointDataCounter, 1, 'emptyLastPointDataCounter');
      assert.equal(pointCounter, 8, 'pointCounter');
    });
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