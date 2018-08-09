QUnit.test("different use cases", function (assert) {
  var res = new meteoJS.synview.resource();
  assert.equal(res.getId(), undefined, 'empty ID');
  assert.equal(res.getUrl(), undefined, 'undefined Url');
  assert.equal(res.getDatetime(), undefined, 'undefined Datetime');
  assert.equal(res.getMIMEType(), 'application/octet-stream', 'MIME-Type');
  assert.notEqual(res.getOLLayer, undefined, 'Default layer');
  
  var res1 = new meteoJS.synview.resource({
    url: 'http://www.example.com',
    datetime: new Date('2018-08-09T00:00:00.000Z'),
    mimetype: 'image/png'
  });
  assert.equal(res1.getId(), 'http://www.example.com', 'Url=ID');
  assert.equal(res1.getUrl(), 'http://www.example.com', 'Url');
  assert.equal(res1.getDatetime().toISOString(), '2018-08-09T00:00:00.000Z', 'Datetime');
  assert.equal(res1.getMIMEType(), 'image/png', 'MIME-Type');
  assert.notEqual(res1.getOLLayer(), undefined, 'Default layer');
  
  var res2 = new meteoJS.synview.resource({
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
  assert.notEqual(res2.getOLLayer(), undefined, 'Default layer');
  
  var res3 = new meteoJS.synview.resource({
    url: 'http://www.example.com',
    datetime: new Date('2018-08-09T00:00:00.000Z'),
    mimetype: 'image/png',
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
  assert.notEqual(res3.getOLLayer(), undefined, 'Default layer');
});