import assert from 'assert';
import ResourceCollection from '../../../src/meteoJS/synview/ResourceCollection.js';
import Resource from '../../../src/meteoJS/synview/Resource.js';

it('only resources with time', () => {
  let collection = new ResourceCollection();
  let dates = [
    new Date('2018-06-26T00:00'),
    new Date('2018-06-26T01:00'),
    new Date('2018-06-26T02:00')
  ];
  dates.forEach(function (date) {
    collection.append(new Resource({
      datetime: date
    }));
  });
  assert.equal(collection.getItems().length, 3, 'getItems');
  assert.equal(collection.getItemIds().length, 3, 'getItemIds');
  assert.equal(collection.getCount(), 3, 'getCount');
  assert.equal(collection.getResources().length, 3, 'getResources');
  assert.equal(collection.getResources().reduce(function (acc, val) { return acc && (val !== undefined); }, true), true, 'getResources not undefined');
  assert.equal(collection.getTimes().length, 3, 'getTimes');
  let res0 = collection.getItemById(dates[0].valueOf());
  assert.equal(res0.getDatetime() == dates[0], true, 'Item 0');
  assert.equal(collection.getIndexById((new Date('2016-01-01')).valueOf()), -1, 'getIndexById -1');
  assert.equal(collection.getIndexById(dates[0].valueOf()), 0, 'Item 0');
  let res1 = collection.getResourceByTime(dates[1]);
  assert.equal(res1.getDatetime() == dates[1], true, 'Item 1');
  assert.equal(collection.getIndexByTime(new Date('2016-01-01')), -1, 'getIndexById -1');
  assert.equal(collection.getIndexByTime(dates[2]), 2, 'Item 2');
  assert.equal(collection.containsTime(new Date('invalid')), false, 'containsTime(\'invalid\')');
  assert.equal(collection.containsTime(new Date('2016-01-01')), false, 'containsTime(1.1.2016)');
  assert.equal(collection.containsTime(new Date('2018-06-26T00:00')), true, 'containsTime(26.6.2018)');
  collection.remove(dates[0]);
  let res2 = collection.getResourceByTime(dates[0]);
  assert.equal(res2.getDatetime(), undefined, 'Item 0 inexstant');
  assert.equal(collection.getIndexByTime(new Date('2016-01-01')), -1, 'getIndexById -1');
  assert.equal(collection.getIndexByTime(dates[2]), 1, 'Item 2, jetzt 1');
  assert.equal(collection.containsTime(new Date('invalid')), false, 'containsTime(\'invalid\')');
  assert.equal(collection.containsTime(new Date('2016-01-01')), false, 'containsTime(1.1.2016)');
  assert.equal(collection.containsTime(new Date('2018-06-26T00:00')), false, 'containsTime(26.6.2018), nicht mehr');
});
it('one resource without time', () => {
  let collection = new ResourceCollection();
  collection.append(new Resource({ url: 'test' }));
  assert.equal(collection.getItems().length, 1, 'getItems');
  assert.equal(collection.getItemIds().length, 1, 'getItemIds');
  assert.equal(collection.getItemIds()[0], '', 'undefined ID');
  assert.equal(collection.getCount(), 1, 'getCount');
  assert.equal(collection.getResources().length, 0, 'getResources');
  assert.equal(collection.getTimes().length, 0, 'getTimes');
  let res = collection.getItemById('');
  assert.equal(res.getUrl(), 'test', 'Resource');
  assert.equal(collection.getIndexById((new Date('2016-01-01')).valueOf()), -1, 'getIndexById -1');
  let res1 = collection.getResourceByTime(new Date('invalid'));
  assert.equal(res1.getUrl(), 'test', 'Resource');
  let resInv = collection.getResourceByTime(new Date('2016-01-01'));
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
it('mixed resources with/without time', () => {
  let collection = new ResourceCollection();
  collection.append(new Resource({
    datetime: new Date('2018-06-26T00:00')
  }));
  collection.append(new Resource({
    datetime: new Date('2018-06-26T01:00')
  }));
  collection.append(new Resource({
    datetime: new Date('2018-06-26T02:00')
  }));
  collection.append(new Resource());
  assert.equal(collection.getItems().length, 4, 'getItems');
  assert.equal(collection.getItemIds().length, 4, 'getItemIds');
  assert.equal(collection.getCount(), 4, 'getCount');
  assert.equal(collection.getResources().length, 3, 'getResources');
  assert.equal(collection.getResources().reduce(function (acc, val) { return acc && (val !== undefined); }, true), true, 'getResources not undefined');
  assert.equal(collection.getTimes().length, 3, 'getTimes');
  collection.remove(new Date('2018-06-26T01:00'));
  assert.equal(collection.getItems().length, 3, 'getItems');
  assert.equal(collection.getItemIds().length, 3, 'getItemIds');
  assert.equal(collection.getCount(), 3, 'getCount');
  assert.equal(collection.getResources().length, 2, 'getResources');
  assert.equal(collection.getResources().reduce(function (acc, val) { return acc && (val !== undefined); }, true), true, 'getResources not undefined');
  assert.equal(collection.getTimes().length, 2, 'getTimes');
});