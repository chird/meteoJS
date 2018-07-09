var methodName = 'test';
QUnit[methodName]("empty object", function (assert) {
  var lg = new ol.layer.Group();
  var map = new ol.Map({ layers: [lg], target: $('<div>').get().shift() });
  var type = new meteoJS.synview.type();
  type.setLayerGroup(lg);
  var changeVisibleCounter = 0;
  var changeTimesCounter = 0;
  type.on('change:visible', function () { changeVisibleCounter++; });
  type.on('change:times', function () { changeTimesCounter++; });
  assert.equal(type.getId(), undefined, 'undefined ID');
  assert.equal(type.getVisible(), true, 'getVisible');
  assert.equal(type.getZIndex(), undefined, 'getZIndex');
  assert.equal(type.getLayerGroup(), lg, 'getLayerGroup');
  assert.equal(type.getLayerGroup().getLayers().getLength(), 0, 'no ol layers');
  assert.equal(type.getResourceCollection().getItems().length, 0, 'empty resource collection');
  assert.equal(type.getDisplayedResource().getUrl(), undefined, 'empty displayed resource');
  assert.equal(changeVisibleCounter, 0, 'no visible event');
  assert.equal(changeTimesCounter, 0, 'no times event');
  var lg = new ol.layer.Group();
  type.setId('test-id').setVisible(false).setZIndex(10).setLayerGroup(lg);
  assert.equal(type.getId(), 'test-id', 'getId');
  assert.equal(type.getVisible(), false, 'getVisible');
  assert.equal(type.getZIndex(), 10, 'getZIndex');
  assert.equal(type.getLayerGroup(), lg, 'getLayerGroup');
  assert.equal(type.getLayerGroup().getLayers().getLength(), 0, 'no ol layers');
  assert.equal(changeVisibleCounter, 1, '1 visible event');
  assert.equal(changeTimesCounter, 0, 'no times event');
});
QUnit[methodName]("static image", function (assert) {
  var lg = new ol.layer.Group();
  var map = new ol.Map({ layers: [lg], target: $('<div>').get().shift() });
  var type = new meteoJS.synview.type();
  type.setLayerGroup(lg);
  var resource = new meteoJS.synview.resource.GeoImage({
    url: 'test.png'
  });
  var changeVisibleCounter = 0;
  var changeTimesCounter = 0;
  type.on('change:visible', function () { changeVisibleCounter++; });
  type.on('change:times', function () { changeTimesCounter++; });
  type.getResourceCollection().append(resource);
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
  assert.equal(changeTimesCounter, 0, '1 times event');
  
  var resource2 = new meteoJS.synview.resource.GeoImage({
    url: 'test2.png',
    extent: [0,0,45,45]
  });
  type.getResourceCollection().swapResources([resource2]);
  assert.equal(type.getResourceCollection().getCount(), 1, '1 item');
  assert.equal(type.getResourceCollection().getTimes().length, 0, '0 times');
  assert.equal(type.getLayerGroup().getLayers().getLength(), 1, '1 ol layers');
  assert.equal(type.getDisplayedResource().getUrl(), 'test2.png', 'Display image');
  type.setDisplayTime(new Date('2018-07-02 00:00:00'));
  assert.equal(type.getDisplayedResource().getUrl(), 'test2.png', 'Display image');
  type.setDisplayTime(new Date('invalid'));
  assert.equal(type.getDisplayedResource().getUrl(), 'test2.png', 'Display image');
  assert.equal(type.getLayerGroup().getLayers().getLength(), 1, '1 ol layers');
  assert.equal(changeVisibleCounter, 0, '1 visible event');
  assert.equal(changeTimesCounter, 0, '1 times event');
  
  type.setVisible(false);
  assert.equal(type.getLayerGroup().getLayers().getLength(), 0, '0 ol layers');
  assert.equal(type.getDisplayedResource().getUrl(), undefined, 'No displayed resource');
  assert.equal(changeVisibleCounter, 1, '2 visible event');
  assert.equal(changeTimesCounter, 0, '1 times event');
  type.setVisible(true);
  assert.equal(type.getLayerGroup().getLayers().getLength(), 0, '1 ol layers');
  assert.equal(type.getDisplayedResource().getUrl(), 'test2.png', 'Display image');
  assert.equal(changeVisibleCounter, 2, '2 visible event');
  assert.equal(changeTimesCounter, 0, '1 times event');
});
QUnit[methodName]("Time serie of images", function (assert) {
  var lg = new ol.layer.Group();
  var map = new ol.Map({ layers: [lg], target: $('<div>').get().shift() });
  var type = new meteoJS.synview.type();
  type.setLayerGroup(lg);
  var changeVisibleCounter = 0;
  var changeTimesCounter = 0;
  type.on('change:visible', function () { changeVisibleCounter++; });
  type.on('change:times', function () { changeTimesCounter++; });
  var date0 = new Date('2018-07-02 00:00:00');
  var resources = [0,1,2].map(function (i) {
    return new meteoJS.synview.resource.GeoImage({
      url: i+'.png',
      datetime: new Date(date0.valueOf() + i*1000*3600)
    });
  });
  type.getResourceCollection().swapResources(resources);
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
  assert.equal(changeTimesCounter, 1, '1 times event');
});