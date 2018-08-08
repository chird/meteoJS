QUnit.test("differnt use cases", function (assert) {
  var res = new meteoJS.synview.resource.GeoJSON();
  assert.equal(res.getId(), '', 'empty ID');
  assert.equal(res.getUrl(), undefined, 'undefined Url');
  assert.equal(res.getDatetime(), undefined, 'undefined Datetime');
  
  var res1 = new meteoJS.synview.resource.GeoJSON({
    datetime: new Date('2018-08-08T00:00:00.000Z'),
    url: 'http://www.example.com'
  });
  assert.equal(res1.getId(), '2018-08-08T00:00:00.000Z', 'time ID');
  assert.equal(res1.getUrl(), 'http://www.example.com', 'correct Url');
  assert.equal(res1.getDatetime().toISOString(), '2018-08-08T00:00:00.000Z', 'correct Datetime');
  var olLayer1 = res1.getOLLayer();
  assert.equal(olLayer1.getSource().getUrl(), 'http://www.example.com', 'Source URL');
  assert.ok(olLayer1.getSource().getFormat() !== undefined, 'Defined source format');
});