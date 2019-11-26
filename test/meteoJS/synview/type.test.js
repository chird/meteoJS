import assert from 'assert';
import $ from 'jquery';
import LayerGroup from 'ol/layer/Group';
import Map from 'ol/Map';
import Resource from '../../../src/meteoJS/synview/Resource.js';
import Type from '../../../src/meteoJS/synview/Type.js';



if(!requestAnimationFrame) 
    requestAnimationFrame = setImmediate;



it('empty object', () => {
  let lg = new LayerGroup();
  let map = new Map({ layers: [lg], target: $('<div>').get().shift() });
  let type = new Type();
  type.setLayerGroup(lg);
  let changeVisibleCounter = 0;
  let changeResCounter = 0;
  type.on('change:visible', function () { changeVisibleCounter++; });
  type.on('change:resources', function () { changeResCounter++; });
  assert.equal(type.getId(), undefined, 'undefined ID');
  assert.equal(type.getVisible(), true, 'getVisible');
  assert.equal(type.getZIndex(), undefined, 'getZIndex');
  assert.equal(type.getLayerGroup(), lg, 'getLayerGroup');
  assert.equal(type.getLayerGroup().getLayers().getLength(), 0, 'no ol layers');
  assert.equal(type.getResourceCollection().getItems().length, 0, 'empty resource collection');
  assert.equal(type.getDisplayedResource().getUrl(), undefined, 'empty displayed resource');
  assert.equal(changeVisibleCounter, 0, 'no visible event');
  assert.equal(changeResCounter, 0, 'no resources event');
  let lg1 = new LayerGroup();
  type.setId('test-id').setVisible(false).setZIndex(10).setLayerGroup(lg1);
  assert.equal(type.getId(), 'test-id', 'getId');
  assert.equal(type.getVisible(), false, 'getVisible');
  assert.equal(type.getZIndex(), 10, 'getZIndex');
  assert.equal(type.getLayerGroup(), lg, 'getLayerGroup');
  assert.equal(type.getLayerGroup().getZIndex(), 10, 'LayerGroup ZIndex');
  assert.equal(type.getLayerGroup().getLayers().getLength(), 0, 'no ol layers');
  assert.equal(changeVisibleCounter, 1, '1 visible event');
  assert.equal(changeResCounter, 0, 'no resources event');
});
it('static image', () => {
  let lg = new LayerGroup();
  let map = new Map({ layers: [lg], target: $('<div>').get().shift() });
  let type = new Type();
  type.setLayerGroup(lg);
  let resource = new Resource({
    url: 'test.png'
  });
  let changeVisibleCounter = 0;
  let changeResCounter = 0;
  type.on('change:visible', function () { changeVisibleCounter++; });
  type.on('change:resources', function () { changeResCounter++; });
  type.setResources([resource]);
  assert.equal(type.getResourceCollection().getCount(), 1, '1 item');
  assert.equal(type.getResourceCollection().getTimes().length, 0, '0 times');
  assert.equal(type.getLayerGroup().getLayers().getLength(), 1, '1 ol layers');
  assert.equal(type.getDisplayedResource().getUrl(), 'test.png', 'Display image');
  type.setDisplayTime(new Date('2018-07-02 00:00:00'));
  assert.equal(type.getDisplayedResource().getUrl(), 'test.png', 'Display image');
  type.setDisplayTime(new Date('invalid'));
  assert.equal(type.getDisplayedResource().getUrl(), 'test.png', 'Display image');
  assert.equal(type.getLayerGroup().getLayers().getLength(), 1, '1 ol layers');
  assert.equal(changeVisibleCounter, 0, '1 visible event');
  assert.equal(changeResCounter, 1, '1 resources event');
  
  let resource2 = new Resource({
    url: 'test2.png'
  });
  type.setResources([resource2]);
  assert.equal(type.getResourceCollection().getCount(), 1, '1 item');
  assert.equal(type.getResourceCollection().getTimes().length, 0, '0 resources');
  assert.equal(type.getLayerGroup().getLayers().getLength(), 1, '1 ol layers');
  assert.equal(type.getDisplayedResource().getUrl(), 'test2.png', 'Display image');
  type.setDisplayTime(new Date('2018-07-02 00:00:00'));
  assert.equal(type.getDisplayedResource().getUrl(), 'test2.png', 'Display image');
  type.setDisplayTime(new Date('invalid'));
  assert.equal(type.getDisplayedResource().getUrl(), 'test2.png', 'Display image');
  assert.equal(type.getLayerGroup().getLayers().getLength(), 1, '1 ol layers');
  assert.equal(changeVisibleCounter, 0, '1 visible event');
  assert.equal(changeResCounter, 2, '2 resources event');
  
  type.setVisible(false);
  assert.equal(type.getLayerGroup().getLayers().getLength(), 0, '0 ol layers');
  assert.equal(type.getDisplayedResource().getUrl(), undefined, 'No displayed resource');
  assert.equal(changeVisibleCounter, 1, '2 visible event');
  assert.equal(changeResCounter, 2, '2 resources event');
  type.setVisible(true);
  assert.equal(type.getLayerGroup().getLayers().getLength(), 1, '1 ol layers');
  assert.equal(type.getDisplayedResource().getUrl(), 'test2.png', 'Display image');
  assert.equal(changeVisibleCounter, 2, '2 visible event');
  assert.equal(changeResCounter, 2, '2 resources event');
});
it('Time serie of images', () => {
  let lg = new LayerGroup();
  let map = new Map({ layers: [lg], target: $('<div>').get().shift() });
  let type = new Type();
  type.setLayerGroup(lg);
  let changeVisibleCounter = 0;
  let changeResCounter = 0;
  type.on('change:visible', function () { changeVisibleCounter++; });
  type.on('change:resources', function () { changeResCounter++; });
  let date0 = new Date('2018-07-02 00:00:00');
  [0,1,2].map(function (i) {
    type.appendResource(new Resource({
      url: i+'.png',
      datetime: new Date(date0.valueOf() + i*1000*3600)
    }));
  });
  assert.equal(type.getResourceCollection().getCount(), 3, '3 item');
  assert.equal(type.getResourceCollection().getTimes().length, 3, '3 times');
  assert.equal(type.getLayerGroup().getLayers().getLength(), 3, '3 ol layers');
  assert.equal(type.getDisplayedResource().getUrl(), undefined, 'No time set, no displayed image');
  type.setDisplayTime(new Date('2018-07-02 00:00:00'));
  assert.equal(type.getDisplayedResource().getUrl(), '0.png', 'Display image');
  type.setDisplayTime(new Date('2018-07-02 01:30:00'));
  assert.equal(type.getDisplayedResource().getUrl(), '1.png', 'Display image');
  type.setDisplayTime(new Date('2018-07-02 01:59:00'));
  assert.equal(type.getDisplayedResource().getUrl(), '1.png', 'Display image');
  type.setDisplayTime(new Date('2018-07-03 00:00:00'));
  assert.equal(type.getDisplayedResource().getUrl(), '2.png', 'Display image');
  type.setDisplayTime(new Date('invalid'));
  assert.equal(type.getDisplayedResource().getUrl(), undefined, 'No displayed image');
  assert.equal(type.getLayerGroup().getLayers().getLength(), 3, '3 ol layers');
  assert.equal(changeVisibleCounter, 0, '0 visible event');
  assert.equal(changeResCounter, 3, '3 resources event');
  let resource = type.getResourceCollection().getItems()[1];
  type.setDisplayTime(resource.getDatetime());
  assert.equal(type.getDisplayedResource().getUrl(), '1.png', 'Display image');
  type.removeResource(resource);
  assert.equal(type.getResourceCollection().getCount(), 2, '2 item');
  assert.equal(type.getResourceCollection().getTimes().length, 2, '2 times');
  assert.equal(type.getLayerGroup().getLayers().getLength(), 2, '2 ol layers');
  assert.equal(type.getDisplayedResource().getUrl(), '0.png', 'First image displayed');
  assert.equal(changeResCounter, 4, '4 resources event');
});
it('Mix: Static image and time serie of images', () => {
  let lg = new LayerGroup();
  let map = new Map({ layers: [lg], target: $('<div>').get().shift() });
  let type = new Type();
  type.setLayerGroup(lg);
  let changeVisibleCounter = 0;
  let changeResCounter = 0;
  type.on('change:visible', function () { changeVisibleCounter++; });
  type.on('change:resources', function () { changeResCounter++; });
  let date0 = new Date('2018-07-02 00:00:00');
  let resources = [0,1,2].map(function (i) {
    return new Resource({
      url: i+'.png',
      datetime: new Date(date0.valueOf() + i*1000*3600)
    });
  });
  resources.push(new Resource({
    url: 'test.png'
  }));
  type.setResources(resources);
  assert.equal(type.getResourceCollection().getCount(), 4, '4 items');
  assert.equal(type.getResourceCollection().getTimes().length, 3, '3 times');
  assert.equal(type.getLayerGroup().getLayers().getLength(), 4, '3 ol layers');
  assert.equal(type.getLayerGroup().getLayers().getArray().reduce(function (acc, layer) {
    if (layer.getVisible())
      acc++;
    return acc;
  }, 0), 1, '1 visible layers');
  assert.equal(type.getDisplayedResource().getUrl(), undefined, 'No time set, no displayed image');
  type.setDisplayTime(new Date('2018-07-02 00:00:00'));
  assert.equal(type.getDisplayedResource().getUrl(), '0.png', 'Display image');
  assert.equal(type.getLayerGroup().getLayers().getArray().reduce(function (acc, layer) {
    if (layer.getVisible())
      acc++;
    return acc;
  }, 0), 2, '2 visible layers');
  type.setDisplayTime(new Date('2018-07-02 01:30:00'));
  assert.equal(type.getDisplayedResource().getUrl(), '1.png', 'Display image');
  type.setDisplayTime(new Date('2018-07-02 01:59:00'));
  assert.equal(type.getDisplayedResource().getUrl(), '1.png', 'Display image');
  type.setDisplayTime(new Date('2018-07-03 00:00:00'));
  assert.equal(type.getDisplayedResource().getUrl(), '2.png', 'Display image');
  assert.equal(type.getLayerGroup().getLayers().getArray().reduce(function (acc, layer) {
    if (layer.getVisible())
      acc++;
    return acc;
  }, 0), 2, '2 visible layers');
  type.setDisplayTime(new Date('invalid'));
  assert.equal(type.getDisplayedResource().getUrl(), undefined, 'No displayed image');
  assert.equal(type.getLayerGroup().getLayers().getArray().reduce(function (acc, layer) {
    if (layer.getVisible())
      acc++;
    return acc;
  }, 0), 1, '1 visible layers');
  assert.equal(type.getLayerGroup().getLayers().getLength(), 4, '4 ol layers');
  type.setDisplayTime(new Date('2018-07-03 00:00:00'));
  type.setVisible(false);
  assert.equal(type.getDisplayedResource().getUrl(), undefined, 'No displayed image');
  assert.equal(type.getLayerGroup().getLayers().getArray().reduce(function (acc, layer) {
    if (layer.getVisible())
      acc++;
    return acc;
  }, 0), 0, '0 visible layers');
  type.setVisible(true);
  assert.equal(type.getDisplayedResource().getUrl(), '2.png', 'Displayed image');
  assert.equal(type.getLayerGroup().getLayers().getArray().reduce(function (acc, layer) {
    if (layer.getVisible())
      acc++;
    return acc;
  }, 0), 2, '2 visible layers');
  assert.equal(changeVisibleCounter, 2, '2 visible event');
  assert.equal(changeResCounter, 1, '1 resources event');
  let resource = type.getResourceCollection().getResourceByTime('');
  type.removeResource(resource);
  assert.equal(type.getLayerGroup().getLayers().getLength(), 3, '3 ol layers');
  assert.equal(type.getLayerGroup().getLayers().getArray().reduce(function (acc, layer) {
    if (layer.getVisible())
      acc++;
    return acc;
  }, 0), 1, '1 visible layers');
  assert.equal(changeResCounter, 2, '2 resources event');
});
it('Option: displayMethod', () => {
  let map = new Map({ layers: [], target: $('<div>').get().shift() });
  let date0 = new Date('2018-07-02 00:00:00');
  let types = [
    new Type({ displayMethod: 'nearest' }),
    new Type({ displayMethod: 'floor' }),
    new Type({ displayMethod: 'exact' })
  ];
  types.map(function (type) {
    let lg = new LayerGroup();
    map.addLayer(lg);
    let resources = [0,1,2].map(function (i) {
      return new Resource({
        url: i+'.png',
        datetime: new Date(date0.valueOf() + i*1000*3600)
      });
    });
    type.setLayerGroup(lg).setResources(resources);
  });
  [
    [new Date('2018-07-02 00:00:00'), '0.png', 1, '0.png', 1, '0.png', 1],
    [new Date('2018-07-02 01:30:00'), '1.png', 0.86, '1.png', 0.86, undefined, 0],
    [new Date('2018-07-02 01:59:00'), '2.png', 1, '1.png', 0.7, undefined, 0],
    [new Date('2018-07-03 00:00:00'), '2.png', 0, '2.png', 0, undefined, 0],
    [new Date('invalid'), undefined, 0, undefined, 0, undefined, 0]
  ].forEach(function (testArr, testI) {
    types.map(function (type, i) {
      type.setDisplayTime(testArr[0]);
      assert.equal(type.getDisplayedResource().getUrl(), testArr[2*i+1], testI+' ('+i+')');
      assert.equal(type.getLayerGroup().getLayers().getArray().reduce(function (acc, layer) {
        if (layer.getVisible())
          acc = Math.max(layer.getOpacity()*100, acc);
        return Math.round(acc);
      }, 0), Math.round(100*testArr[2*(i+1)]), 'Opacity: '+testI+' ('+i+')');
    });
  });
});
it('setLayerGroup: static image', () => {
  let map = new Map({ layers: [], target: $('<div>').get().shift() });
  let resource = new Resource({
    url: 'test.png'
  });
  let type = new Type({
    zIndex: 5
  });
  let changeVisibleCounter = 0;
  let changeResCounter = 0;
  type.on('change:visible', function () { changeVisibleCounter++; });
  type.on('change:resources', function () { changeResCounter++; });
  type.setResources([resource]);
  assert.equal(type.getResourceCollection().getCount(), 1, '1 item');
  assert.equal(type.getResourceCollection().getTimes().length, 0, '0 times');
  assert.equal(type.getLayerGroup().getLayers().getLength(), 0, '0 no ol layers in abstract layer group');
  assert.equal(type.getLayerGroup().getZIndex(), undefined, 'layer group zIndex');
  assert.equal(type.getDisplayedResource().getUrl(), undefined, 'No displayed image');
  type.setDisplayTime(new Date('2018-07-02 00:00:00'));
  assert.equal(type.getDisplayedResource().getUrl(), undefined, 'No displayed image');
  type.setDisplayTime(new Date('invalid'));
  assert.equal(type.getDisplayedResource().getUrl(), undefined, 'No displayed image');
  assert.equal(type.getLayerGroup().getLayers().getLength(), 0, '0 no ol layers in abstract layer group');
  assert.equal(changeVisibleCounter, 0, '0 visible event');
  assert.equal(changeResCounter, 1, '1 resources event');
  
  let lg = new LayerGroup();
  type.setLayerGroup(lg);
  assert.equal(type.getResourceCollection().getCount(), 1, '1 item');
  assert.equal(type.getResourceCollection().getTimes().length, 0, '0 times');
  assert.equal(type.getLayerGroup().getZIndex(), 5, 'layer group zIndex');
  assert.equal(type.getLayerGroup().getLayers().getLength(), 1, '1 ol layers');
  assert.equal(type.getDisplayedResource().getUrl(), 'test.png', 'Display image');
  type.setDisplayTime(new Date('2018-07-02 00:00:00'));
  assert.equal(type.getDisplayedResource().getUrl(), 'test.png', 'Display image');
  type.setDisplayTime(new Date('invalid'));
  assert.equal(type.getDisplayedResource().getUrl(), 'test.png', 'Display image');
  assert.equal(type.getLayerGroup().getLayers().getLength(), 1, '1 ol layers');
  assert.equal(changeVisibleCounter, 0, '1 visible event');
  assert.equal(changeResCounter, 1, '1 resources event');
  
  assert.equal(lg.getLayers().getLength(), 1, '1 layer in layer-group');
  type.setLayerGroup(new LayerGroup());
  assert.equal(lg.getLayers().getLength(), 0, '0 layer in layer-group');
  assert.equal(type.getResourceCollection().getCount(), 1, '1 item');
  assert.equal(type.getResourceCollection().getTimes().length, 0, '0 times');
  assert.equal(type.getLayerGroup().getZIndex(), 5, 'layer group zIndex');
  assert.equal(type.getLayerGroup().getLayers().getLength(), 1, '1 ol layers');
  assert.equal(type.getDisplayedResource().getUrl(), 'test.png', 'Display image');
  type.setDisplayTime(new Date('2018-07-02 00:00:00'));
  assert.equal(type.getDisplayedResource().getUrl(), 'test.png', 'Display image');
  type.setDisplayTime(new Date('invalid'));
  assert.equal(type.getDisplayedResource().getUrl(), 'test.png', 'Display image');
  assert.equal(type.getLayerGroup().getLayers().getLength(), 1, '1 ol layers');
  assert.equal(changeVisibleCounter, 0, '1 visible event');
  assert.equal(changeResCounter, 1, '1 resources event');
});
it('setLayerGroup: timed resources', () => {
  let map = new Map({ layers: [], target: $('<div>').get().shift() });
  let date0 = new Date('2018-07-02 00:00:00');
  let resources = [0,1,2].map(function (i) {
    return new Resource({
      url: i+'.png',
      datetime: new Date(date0.valueOf() + i*1000*3600)
    });
  });
  let type = new Type({
    zIndex: 5,
    resources: resources
  });
  let changeVisibleCounter = 0;
  let changeResCounter = 0;
  type.on('change:visible', function () { changeVisibleCounter++; });
  type.on('change:resources', function () { changeResCounter++; });
  assert.equal(type.getLayerGroup().getZIndex(), undefined, 'layer group zIndex');
  assert.equal(type.getLayerGroup().getLayers().getLength(), 0, '0 no ol layers in abstract layer group');
  assert.equal(type.getDisplayedResource().getUrl(), undefined, 'No displayed image');
  assert.equal(type.setDisplayTime(new Date('2018-07-02 00:00:00')).getDisplayedResource().getUrl(), undefined, 'No displayed image');
  assert.equal(type.setDisplayTime(new Date('invalid')).getDisplayedResource().getUrl(), undefined, 'No displayed image');
  assert.equal(type.getLayerGroup().getLayers().getLength(), 0, '0 no ol layers in abstract layer group');
  assert.equal(changeVisibleCounter, 0, '0 visible event');
  assert.equal(changeResCounter, 0, '0 resources event');
  
  let lg = new LayerGroup();
  type.setLayerGroup(lg);
  assert.equal(type.getLayerGroup().getZIndex(), 5, 'layer group zIndex');
  assert.equal(type.getLayerGroup().getLayers().getLength(), 3, '3 ol layers');
  assert.equal(type.getDisplayedResource().getUrl(), undefined, 'No displayed image');
  assert.equal(type.setDisplayTime(new Date('2018-07-02 00:00:00')).getDisplayedResource().getUrl(), '0.png', 'Display image');
  assert.equal(type.setDisplayTime(new Date('invalid')).getDisplayedResource().getUrl(), undefined, 'No displayed image');
  assert.equal(type.getLayerGroup().getLayers().getLength(), 3, '3 ol layers');
  assert.equal(changeVisibleCounter, 0, '0 visible event');
  assert.equal(changeResCounter, 0, '0 resources event');
  
  assert.equal(lg.getLayers().getLength(), 3, '3 layer in layer-group');
  type.setLayerGroup(new LayerGroup());
  assert.equal(lg.getLayers().getLength(), 0, '0 layer in layer-group');
  assert.equal(type.getLayerGroup().getZIndex(), 5, 'layer group zIndex');
  assert.equal(type.getLayerGroup().getLayers().getLength(), 3, '3 ol layers');
  assert.equal(type.getDisplayedResource().getUrl(), undefined, 'No displayed image');
  assert.equal(type.setDisplayTime(new Date('2018-07-02 00:00:00')).getDisplayedResource().getUrl(), '0.png', 'Display image');
  assert.equal(type.setDisplayTime(new Date('invalid')).getDisplayedResource().getUrl(), undefined, 'No displayed image');
  assert.equal(type.getLayerGroup().getLayers().getLength(), 3, '3 ol layers');
  assert.equal(changeVisibleCounter, 0, '0 visible event');
  assert.equal(changeResCounter, 0, '0 resources event');
});
it('visibility static resource', () => {
  let res = new Resource({
    url: 'test.json'
  });
  assert.equal(res.getVisible(), false, 'Resource not visible');
  let type = new Type({
    visible: false,
    resources: [res]
  });
  assert.equal(type.getVisible(), false, 'Type not visible');
  assert.equal(res.getVisible(), false, 'Resource not visible');
  type.setVisible(true);
  assert.equal(type.getVisible(), true, 'Type visible');
  assert.equal(res.getVisible(), true, 'Resource visible');
  let res2 = new Resource({
    url: 'test.json'
  });
  assert.equal(res2.getVisible(), false, 'Resource not visible');
  let type2 = new Type({
    resources: [res2]
  });
  assert.equal(type2.getVisible(), true, 'Type visible');
  assert.equal(res2.getVisible(), true, 'Resource visible');
});