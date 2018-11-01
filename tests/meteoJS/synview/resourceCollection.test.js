QUnit.test("only resources with time", function (assert) {
  var collection = new meteoJS.synview.resourceCollection();
  var dates = [
    new Date('2018-06-26T00:00'),
    new Date('2018-06-26T01:00'),
    new Date('2018-06-26T02:00')
  ];
  dates.forEach(function (date) {
    collection.append(new meteoJS.synview.resource({
      datetime: date
    }));
  });
  assert.equal(collection.getItems().length, 3, 'getItems');
  assert.equal(collection.getItemIds().length, 3, 'getItemIds');
  assert.equal(collection.getCount(), 3, 'getCount');
  assert.equal(collection.getResources().length, 3, 'getResources');
  assert.equal(collection.getTimes().length, 3, 'getTimes');
  var res0 = collection.getItemById(dates[0].valueOf());
  assert.equal(res0.getDatetime() == dates[0], true, 'Item 0');
  assert.equal(collection.getIndexById((new Date('2016-01-01')).valueOf()), -1, 'getIndexById -1');
  assert.equal(collection.getIndexById(dates[0].valueOf()), 0, 'Item 0');
  var res1 = collection.getResourceByTime(dates[1]);
  assert.equal(res1.getDatetime() == dates[1], true, 'Item 1');
  assert.equal(collection.getIndexByTime(new Date('2016-01-01')), -1, 'getIndexById -1');
  assert.equal(collection.getIndexByTime(dates[2]), 2, 'Item 2');
  assert.equal(collection.containsTime(new Date('invalid')), false, 'containsTime(\'invalid\')');
  assert.equal(collection.containsTime(new Date('2016-01-01')), false, 'containsTime(1.1.2016)');
  assert.equal(collection.containsTime(new Date('2018-06-26T00:00')), true, 'containsTime(26.6.2018)');
  collection.remove(dates[0]);
  var res1 = collection.getResourceByTime(dates[0]);
  assert.equal(res1.getDatetime(), undefined, 'Item 0 inexstant');
  assert.equal(collection.getIndexByTime(new Date('2016-01-01')), -1, 'getIndexById -1');
  assert.equal(collection.getIndexByTime(dates[2]), 1, 'Item 2, jetzt 1');
  assert.equal(collection.containsTime(new Date('invalid')), false, 'containsTime(\'invalid\')');
  assert.equal(collection.containsTime(new Date('2016-01-01')), false, 'containsTime(1.1.2016)');
  assert.equal(collection.containsTime(new Date('2018-06-26T00:00')), false, 'containsTime(26.6.2018), nicht mehr');
});
QUnit.test("one resource without time", function (assert) {
  var collection = new meteoJS.synview.resourceCollection();
  collection.append(new meteoJS.synview.resource({ url: 'test' }));
  assert.equal(collection.getItems().length, 1, 'getItems');
  assert.equal(collection.getItemIds().length, 1, 'getItemIds');
  assert.equal(collection.getItemIds()[0], '', 'undefined ID');
  assert.equal(collection.getCount(), 1, 'getCount');
  assert.equal(collection.getResources().length, 0, 'getResources');
  assert.equal(collection.getTimes().length, 0, 'getTimes');
  var res = collection.getItemById('');
  assert.equal(res.getUrl(), 'test', 'Resource');
  assert.equal(collection.getIndexById((new Date('2016-01-01')).valueOf()), -1, 'getIndexById -1');
  var res = collection.getResourceByTime(new Date('invalid'));
  assert.equal(res.getUrl(), 'test', 'Resource');
  var resInv = collection.getResourceByTime(new Date('2016-01-01'));
  assert.equal(resInv.getUrl(), undefined, 'Res. not existant');
  assert.equal(collection.getIndexByTime(new Date('2016-01-01')), -1, 'getIndexById -1');
  assert.equal(collection.getIndexByTime(new Date('invalid')), -1, 'getIndexById -1');
  assert.equal(collection.containsTime(new Date('invalid')), true, 'containsTime(\'invalid\')');
  assert.equal(collection.containsTime(new Date('2016-01-01')), false, 'containsTime(1.1.2016)');
  collection.remove('');
  assert.equal(collection.getItems().length, 0, 'getItems');
  assert.equal(collection.getItemIds().length, 0, 'getItemIds');
  assert.equal(collection.getCount(), 0, 'getCount');
  assert.equal(collection.getResources().length, 0, 'getResources');
  assert.equal(collection.getTimes().length, 0, 'getTimes');
});
QUnit.test("mixed resources with/without time", function (assert) {
  var collection = new meteoJS.synview.resourceCollection();
  collection.append(new meteoJS.synview.resource({
    datetime: new Date('2018-06-26T00:00')
  }));
  collection.append(new meteoJS.synview.resource({
    datetime: new Date('2018-06-26T01:00')
  }));
  collection.append(new meteoJS.synview.resource({
    datetime: new Date('2018-06-26T02:00')
  }));
  collection.append(new meteoJS.synview.resource());
  assert.equal(collection.getItems().length, 4, 'getItems');
  assert.equal(collection.getItemIds().length, 4, 'getItemIds');
  assert.equal(collection.getCount(), 4, 'getCount');
  assert.equal(collection.getResources().length, 3, 'getResources');
  assert.equal(collection.getTimes().length, 3, 'getTimes');
  collection.remove(new Date('2018-06-26T01:00'));
  assert.equal(collection.getItems().length, 3, 'getItems');
  assert.equal(collection.getItemIds().length, 3, 'getItemIds');
  assert.equal(collection.getCount(), 3, 'getCount');
  assert.equal(collection.getResources().length, 2, 'getResources');
  assert.equal(collection.getTimes().length, 2, 'getTimes');
});