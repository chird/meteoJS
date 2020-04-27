import assert from 'assert';
import 'jsdom-global/register';
import Group from 'ol/layer/Group';
import Resource from '../../../src/meteoJS/synview/Resource.js';

describe('synview/Resource', () => {
  it('different use cases', () => {
    let res = new Resource();
    assert.equal(res.getId(), undefined, 'empty ID');
    assert.equal(res.getUrl(), undefined, 'undefined Url');
    assert.equal(res.getDatetime(), undefined, 'undefined Datetime');
    assert.equal(res.getMIMEType(), 'application/octet-stream', 'MIME-Type');
    assert.equal(res.layer, undefined, 'Internal layer undefined');
    let layer = res.getOLLayer();
    assert.notEqual(layer, undefined, 'Default layer');
    assert.equal(res.layer, layer, 'Layer created');
    assert.equal(layer.getClassName(), 'ol-layer', 'layer\'s className');
    assert.equal(res.getVisible(), false, 'not visible');
    assert.equal(res.getZIndex(), undefined, 'undefined zIndex');
    assert.equal(res.getOpacity(), 1, 'Opacity = 1');
    assert.equal(res.className, undefined, 'className');
    
    let res1 = new Resource({
      url: 'http://www.example.com',
      datetime: new Date('2018-08-09T00:00:00.000Z'),
      mimetype: 'image/png'
    });
    assert.equal(res1.getId(), 'http://www.example.com', 'Url=ID');
    assert.equal(res1.getUrl(), 'http://www.example.com', 'Url');
    assert.equal(res1.getDatetime().toISOString(), '2018-08-09T00:00:00.000Z', 'Datetime');
    assert.equal(res1.getMIMEType(), 'image/png', 'MIME-Type');
    assert.equal(res1.layer, undefined, 'Internal layer undefined');
    let layer1 = res1.getOLLayer();
    assert.notEqual(layer1, undefined, 'Default layer');
    assert.equal(res1.layer, layer1, 'Layer created');
    assert.equal(layer1.getClassName(), 'ol-layer', 'layer\'s className');
    assert.equal(res1.getVisible(), false, 'not visible');
    assert.equal(res1.getZIndex(), undefined, 'undefined zIndex');
    assert.equal(res1.getOpacity(), 1, 'Opacity = 1');
    assert.equal(res1.className, undefined, 'className');
    
    let res2 = new Resource({
      url: 'http://www.example.com',
      datetime: new Date('2018-08-09T00:00:00.000Z'),
      mimetype: 'image/png',
      ol: {
        source: undefined,
        events: undefined
      }
    });
    assert.equal(res2.getId(), 'http://www.example.com', 'Url=ID');
    assert.equal(res2.getUrl(), 'http://www.example.com', 'Url');
    assert.equal(res2.getDatetime().toISOString(), '2018-08-09T00:00:00.000Z', 'Datetime');
    assert.equal(res2.getMIMEType(), 'image/png', 'MIME-Type');
    assert.equal(res2.layer, undefined, 'Internal layer undefined');
    let layer2 = res2.getOLLayer();
    assert.notEqual(layer2, undefined, 'Default layer');
    assert.equal(res2.layer, layer2, 'Layer created');
    assert.equal(layer2.getClassName(), 'ol-layer', 'layer\'s className');
    assert.equal(res2.getVisible(), false, 'not visible');
    assert.equal(res2.getZIndex(), undefined, 'undefined zIndex');
    assert.equal(res2.getOpacity(), 1, 'Opacity = 1');
    assert.equal(res2.className, undefined, 'className');
    
    let res3 = new Resource({
      url: 'http://www.example.com',
      datetime: new Date('2018-08-09T00:00:00.000Z'),
      mimetype: 'image/png',
      className: 'test',
      ol: {
        source: undefined,
        events: {
          'postcompose': function () {}
        }
      }
    });
    assert.equal(res3.getId(), 'http://www.example.com', 'Url=ID');
    assert.equal(res3.getUrl(), 'http://www.example.com', 'Url');
    assert.equal(res3.getDatetime().toISOString(), '2018-08-09T00:00:00.000Z', 'Datetime');
    assert.equal(res3.getMIMEType(), 'image/png', 'MIME-Type');
    assert.equal(res3.layer, undefined, 'Internal layer undefined');
    let layer3 = res3.getOLLayer();
    assert.notEqual(layer3, undefined, 'Default layer');
    assert.equal(res3.layer, layer3, 'Layer created');
    assert.equal(layer3.getClassName(), 'test', 'layer\'s className');
    assert.equal(res3.getVisible(), false, 'not visible');
    assert.equal(res3.getZIndex(), undefined, 'undefined zIndex');
    assert.equal(res3.getOpacity(), 1, 'Opacity = 1');
    assert.equal(res3.className, 'test', 'className');
    res3.className = 'testA';
    assert.equal(res3.className, 'testA', 'className');
  });
  it('setLayerGroup', () => {
    let res = new Resource({
      url: 'http://www.example.com',
      datetime: new Date('2018-08-09T00:00:00.000Z'),
      mimetype: 'image/png'
    });
    assert.equal(res.layer, undefined, 'Internal layer undefined');
    assert.equal(res.getVisible(), false, 'not visible');
    assert.equal(res.getZIndex(), undefined, 'undefined zIndex');
    assert.equal(res.getOpacity(), 1, 'Opacity = 1');
    assert.equal(res.className, undefined, 'className');
    res.setVisible(true);
    res.setZIndex(5);
    res.setOpacity(0.5);
    assert.equal(res.getVisible(), true, 'not visible');
    assert.equal(res.getZIndex(), 5, 'undefined zIndex');
    assert.equal(res.getOpacity(), 0.5, 'Opacity = 1');
    let layerGroup = new Group();
    res.setLayerGroup(layerGroup);
    assert.equal(layerGroup.getLayers().getLength(), 1, '1 layer in group');
    assert.notEqual(res.layer, undefined, 'layer created');
    assert.equal(res.getVisible(), true, 'not visible');
    assert.equal(res.getZIndex(), 5, 'undefined zIndex');
    assert.equal(res.getOpacity(), 0.5, 'Opacity = 1');
    res.setLayerGroup(layerGroup);
    assert.equal(layerGroup.getLayers().getLength(), 1, '1 layer in group');
    assert.notEqual(res.layer, undefined, 'layer created');
    assert.equal(res.getVisible(), true, 'not visible');
    assert.equal(res.getZIndex(), 5, 'undefined zIndex');
    assert.equal(res.getOpacity(), 0.5, 'Opacity = 1');
    res.setLayerGroup(undefined);
    assert.equal(layerGroup.getLayers().getLength(), 0, '0 layer in group');
    assert.equal(res.layer, undefined, 'Internal layer undefined');
  });
  it('imageSmoothingEnabled', () => {
    const res = new Resource();
    assert.equal(res.imageSmoothingEnabled, undefined, 'default value');
    res.imageSmoothingEnabled = true;
    assert.equal(res.imageSmoothingEnabled, true, 'setter');
    const res1 = new Resource({
      imageSmoothingEnabled: true
    });
    assert.equal(res1.imageSmoothingEnabled, true, 'constructed value');
    res1.imageSmoothingEnabled = false;
    assert.equal(res1.imageSmoothingEnabled, false, 'setter');
  });
});