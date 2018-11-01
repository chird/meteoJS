var methodName = 'skip';
QUnit[methodName]("empty object", function (assert) {
  var lg = new ol.layer.Group();
  var map = new ol.Map({ layers: [lg], target: $('<div>').get().shift() });
  var type = new meteoJS.synview.type();
  type.setLayerGroup(lg);
  var changeVisibleCounter = 0;
  var changeResCounter = 0;
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
  var lg = new ol.layer.Group();
  type.setId('test-id').setVisible(false).setZIndex(10).setLayerGroup(lg);
  assert.equal(type.getId(), 'test-id', 'getId');
  assert.equal(type.getVisible(), false, 'getVisible');
  assert.equal(type.getZIndex(), 10, 'getZIndex');
  assert.equal(type.getLayerGroup(), lg, 'getLayerGroup');
  assert.equal(type.getLayerGroup().getZIndex(), 10, 'LayerGroup ZIndex');
  assert.equal(type.getLayerGroup().getLayers().getLength(), 0, 'no ol layers');
  assert.equal(changeVisibleCounter, 1, '1 visible event');
  assert.equal(changeResCounter, 0, 'no resources event');
});
QUnit[methodName]("static image", function (assert) {
  var lg = new ol.layer.Group();
  var map = new ol.Map({ layers: [lg], target: $('<div>').get().shift() });
  var type = new meteoJS.synview.type();
  type.setLayerGroup(lg);
  var resource = new meteoJS.synview.resource({
    url: 'test.png'
  });
  var changeVisibleCounter = 0;
  var changeResCounter = 0;
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
  
  var resource2 = new meteoJS.synview.resource({
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
QUnit[methodName]("Time serie of images", function (assert) {
  var lg = new ol.layer.Group();
  var map = new ol.Map({ layers: [lg], target: $('<div>').get().shift() });
  var type = new meteoJS.synview.type();
  type.setLayerGroup(lg);
  var changeVisibleCounter = 0;
  var changeResCounter = 0;
  type.on('change:visible', function () { changeVisibleCounter++; });
  type.on('change:resources', function () { changeResCounter++; });
  var date0 = new Date('2018-07-02 00:00:00');
  [0,1,2].map(function (i) {
    type.appendResource(new meteoJS.synview.resource({
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
  var resource = type.getResourceCollection().getItems()[1];
  type.setDisplayTime(resource.getDatetime());
  assert.equal(type.getDisplayedResource().getUrl(), '1.png', 'Display image');
  type.removeResource(resource);
  assert.equal(type.getResourceCollection().getCount(), 2, '2 item');
  assert.equal(type.getResourceCollection().getTimes().length, 2, '2 times');
  assert.equal(type.getLayerGroup().getLayers().getLength(), 2, '2 ol layers');
  assert.equal(type.getDisplayedResource().getUrl(), '0.png', 'First image displayed');
  assert.equal(changeResCounter, 4, '4 resources event');
});
QUnit[methodName]("Mix: Static image and time serie of images", function (assert) {
  var lg = new ol.layer.Group();
  var map = new ol.Map({ layers: [lg], target: $('<div>').get().shift() });
  var type = new meteoJS.synview.type();
  type.setLayerGroup(lg);
  var changeVisibleCounter = 0;
  var changeResCounter = 0;
  type.on('change:visible', function () { changeVisibleCounter++; });
  type.on('change:resources', function () { changeResCounter++; });
  var date0 = new Date('2018-07-02 00:00:00');
  var resources = [0,1,2].map(function (i) {
    return new meteoJS.synview.resource({
      url: i+'.png',
      datetime: new Date(date0.valueOf() + i*1000*3600)
    });
  });
  resources.push(new meteoJS.synview.resource({
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
  var resource = type.getResourceCollection().getResourceByTime('');
  type.removeResource(resource);
  assert.equal(type.getLayerGroup().getLayers().getLength(), 3, '3 ol layers');
  assert.equal(type.getLayerGroup().getLayers().getArray().reduce(function (acc, layer) {
    if (layer.getVisible())
      acc++;
    return acc;
  }, 0), 1, '1 visible layers');
  assert.equal(changeResCounter, 2, '2 resources event');
});
QUnit[methodName]("Option: displayMethod", function (assert) {
  var map = new ol.Map({ layers: [], target: $('<div>').get().shift() });
  var date0 = new Date('2018-07-02 00:00:00');
  var types = [
    new meteoJS.synview.type({ displayMethod: 'nearest' }),
    new meteoJS.synview.type({ displayMethod: 'floor' }),
    new meteoJS.synview.type({ displayMethod: 'exact' })
  ];
  types.map(function (type) {
    var lg = new ol.layer.Group();
    map.addLayer(lg);
    var resources = [0,1,2].map(function (i) {
      return new meteoJS.synview.resource({
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
QUnit[methodName]("setLayerGroup: static image", function (assert) {
  var map = new ol.Map({ layers: [], target: $('<div>').get().shift() });
  var resource = new meteoJS.synview.resource({
    url: 'test.png'
  });
  var type = new meteoJS.synview.type({
    zIndex: 5
  });
  var changeVisibleCounter = 0;
  var changeResCounter = 0;
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
  
  var lg = new ol.layer.Group();
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
  type.setLayerGroup(new ol.layer.Group());
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
QUnit[methodName]("setLayerGroup: timed resources", function (assert) {
  var map = new ol.Map({ layers: [], target: $('<div>').get().shift() });
  var date0 = new Date('2018-07-02 00:00:00');
  var resources = [0,1,2].map(function (i) {
    return new meteoJS.synview.resource({
      url: i+'.png',
      datetime: new Date(date0.valueOf() + i*1000*3600)
    });
  });
  var type = new meteoJS.synview.type({
    zIndex: 5,
    resources: resources
  });
  var changeVisibleCounter = 0;
  var changeResCounter = 0;
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
  
  var lg = new ol.layer.Group();
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
  type.setLayerGroup(new ol.layer.Group());
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
QUnit[methodName]("visibility static resource", function (assert) {
  var res = new meteoJS.synview.resource({
    url: 'test.json'
  });
  assert.equal(res.getVisible(), false, 'Resource not visible');
  var type = new meteoJS.synview.type({
    visible: false,
    resources: [res]
  });
  assert.equal(type.getVisible(), false, 'Type not visible');
  assert.equal(res.getVisible(), false, 'Resource not visible');
  type.setVisible(true);
  assert.equal(type.getVisible(), true, 'Type visible');
  assert.equal(res.getVisible(), true, 'Resource visible');
  var res2 = new meteoJS.synview.resource({
    url: 'test.json'
  });
  assert.equal(res2.getVisible(), false, 'Resource not visible');
  var type2 = new meteoJS.synview.type({
    resources: [res2]
  });
  assert.equal(type2.getVisible(), true, 'Type visible');
  assert.equal(res2.getVisible(), true, 'Resource visible');
});