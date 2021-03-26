import assert from 'assert';
import { createSVGWindow, Event } from 'svgdom';
//import {  } from 'svgdom/src/dom/Event.js';
import { SVG, registerWindow } from '@svgdotjs/svg.js';
global.window = createSVGWindow();
global.document = window.document;
import SkewTlogPDiagram from '../../../src/meteoJS/thermodynamicDiagram/coordinateSystem/SkewTlogPDiagram.js';
import Sounding from '../../../src/meteoJS/Sounding.js';
import DiagramSounding from '../../../src/meteoJS/thermodynamicDiagram/DiagramSounding.js';
import {
  default as PlotAltitudeDataArea,
  PlotAltitudeDataArea as PlotAltitudeDataAreaClass
} from '../../../src/meteoJS/thermodynamicDiagram/PlotAltitudeDataArea.js';

registerWindow(global.window, global.document);

describe('PlotAltitudeDataArea class, import via default', () => {
  it('hoverLabelsSounding', () => {
    const svgNode = SVG().size(300,300);
    const coordinateSystem = new SkewTlogPDiagram();
    const plotArea = new PlotAltitudeDataArea({
      svgNode,
      coordinateSystem,
      hoverLabels: {
        remote: false
      }
    });
    assert.ok(!plotArea.isHoverLabelsRemote, 'isHoverLabelsRemote');
    const s1 = new DiagramSounding(new Sounding());
    const s2 = new DiagramSounding(new Sounding());
    const s3 = new DiagramSounding(new Sounding());
    plotArea.addSounding(s1);
    plotArea.addSounding(s2);
    plotArea.addSounding(s3);
    assert.equal(s1.visible, true, 's1 visible');
    assert.equal(s2.visible, true, 's2 visible');
    assert.equal(s3.visible, true, 's3 visible');
    assert.equal(plotArea.hoverLabelsSounding, s1, 'hoverLabelsSounding');
    s1.visible = false;
    assert.equal(plotArea.hoverLabelsSounding, s2, 'hoverLabelsSounding');
    s2.visible = false;
    assert.equal(plotArea.hoverLabelsSounding, s3, 'hoverLabelsSounding');
  });
  it('empty construction', () => {
    const svgNode = SVG().size(300,300);
    const coordinateSystem = new SkewTlogPDiagram();
    const plotArea = new PlotAltitudeDataArea();
    assert.ok(plotArea.isHoverLabelsRemote, 'isHoverLabelsRemote');
    assert.ok(plotArea.width, 100, 'width');
    assert.ok(plotArea.height, 100, 'height');
    const s1 = new DiagramSounding(new Sounding());
    const s2 = new DiagramSounding(new Sounding());
    plotArea.addSounding(s1);
    plotArea.addSounding(s2);
    assert.equal(s1.visible, true, 's1 visible');
    assert.equal(s2.visible, true, 's2 visible');
    assert.equal(plotArea.hoverLabelsSounding, s1, 'hoverLabelsSounding');
  });
  it('mousemove-Event', () => {
    const sounding = new Sounding();
    for (let pres=1000; pres>=100; pres-=50) {
      const tmpk = 73.15 + (Math.floor(Math.random() * 4000) - 2000) / 100;
      sounding.addLevel({
        pres,
        tmpk,
        dwpk: tmpk - Math.floor(Math.random() * 3000)/100
      });
    }
    const s = new DiagramSounding(sounding);
    const mousemoveEvent = new Event('mousemove');
    mousemoveEvent.pageX = 100;
    mousemoveEvent.pageY = 100;
    const mousemoveRemoteEvent = new Event('mousemove');
    mousemoveRemoteEvent.pageX = 5;
    mousemoveRemoteEvent.pageY = 140;
    
    let insertFuncCounter = 0;
    const svgNode = SVG().size(300,300);
    const coordinateSystem = new SkewTlogPDiagram({ pressure: { max: 1000 } });
    const plotArea = new PlotAltitudeDataArea({
      svgNode,
      coordinateSystem,
      x: 50,
      y: 50,
      width: 200,
      height: 200,
      hoverLabels: {
        insertLabelsFunc: (sounding, levelData, group) => {
          group.clear();
          assert.equal(sounding, s, 'sounding');
          assert.ok((levelData.pres == 300) ? true : (levelData.pres == 800) ? true : false, 'pres');
          assert.equal(group, plotArea._hoverLabelsGroup, '_hoverLabelsGroup');
          group.circle(50);
          insertFuncCounter++;
        }
      }
    });
    assert.ok(plotArea.isHoverLabelsRemote, 'isHoverLabelsRemote');
    plotArea.addSounding(s);
    assert.equal(insertFuncCounter, 0, 'insertFuncCounter');
    assert.equal(plotArea._hoverLabelsGroup.children().length, 0, 'hoverLabelsGroup');
    plotArea._svgNode.dispatchEvent(mousemoveEvent);
    assert.equal(insertFuncCounter, 1, 'insertFuncCounter');
    assert.equal(plotArea._hoverLabelsGroup.children().length, 1, 'hoverLabelsGroup');
    plotArea.width = 100;
    plotArea.height = 100;
    assert.equal(insertFuncCounter, 1, 'insertFuncCounter');
    assert.equal(plotArea._hoverLabelsGroup.children().length, 0, 'hoverLabelsGroup');
    plotArea._svgNode.dispatchEvent(mousemoveEvent);
    assert.equal(insertFuncCounter, 2, 'insertFuncCounter');
    assert.equal(plotArea._hoverLabelsGroup.children().length, 1, 'hoverLabelsGroup');
    s.visible = false;
    assert.equal(insertFuncCounter, 2, 'insertFuncCounter');
    assert.equal(plotArea._hoverLabelsGroup.children().length, 0, 'hoverLabelsGroup');
    s.visible = true;
    assert.equal(insertFuncCounter, 2, 'insertFuncCounter');
    assert.equal(plotArea._hoverLabelsGroup.children().length, 0, 'hoverLabelsGroup');
    plotArea._svgNode.dispatchEvent(mousemoveEvent);
    assert.equal(insertFuncCounter, 3, 'insertFuncCounter');
    assert.equal(plotArea._hoverLabelsGroup.children().length, 1, 'hoverLabelsGroup');
    s.update({
      diagram: {
        temp: {
          style: {
            color: 'red'
          }
        }
      }
    });
    assert.equal(insertFuncCounter, 3, 'insertFuncCounter');
    assert.equal(plotArea._hoverLabelsGroup.children().length, 0, 'hoverLabelsGroup');
    plotArea._svgNode.dispatchEvent(mousemoveEvent);
    assert.equal(insertFuncCounter, 4, 'insertFuncCounter');
    assert.equal(plotArea._hoverLabelsGroup.children().length, 1, 'hoverLabelsGroup');
    plotArea._svgNode.dispatchEvent(mousemoveRemoteEvent);
    assert.equal(insertFuncCounter, 5, 'insertFuncCounter');
    assert.equal(plotArea._hoverLabelsGroup.children().length, 1, 'hoverLabelsGroup');
    
    // Make hoverLabels only invisible, when a visible sounding is added.
    const diagramSounding1 = new DiagramSounding(new Sounding());
    diagramSounding1.visible = false;
    plotArea.addSounding(diagramSounding1);
    assert.equal(insertFuncCounter, 5, 'insertFuncCounter');
    assert.equal(plotArea._hoverLabelsGroup.children().length, 1, 'hoverLabelsGroup');
    const diagramSounding2 = new DiagramSounding(new Sounding());
    diagramSounding2.visible = true;
    plotArea.addSounding(diagramSounding2);
    assert.equal(insertFuncCounter, 5, 'insertFuncCounter');
    assert.equal(plotArea._hoverLabelsGroup.children().length, 0, 'hoverLabelsGroup');
  });
});
describe('PlotAltitudeDataArea class, import via name', () => {
  it('simple test', () => {
    const svgNode = SVG().size(300,300);
    const coordinateSystem = new SkewTlogPDiagram();
    const plotArea = new PlotAltitudeDataAreaClass({
      svgNode,
      coordinateSystem
    });
    assert.equal(plotArea._hoverLabelsGroup.children().length, 0, 'hoverLabelsGroup');
  });
});