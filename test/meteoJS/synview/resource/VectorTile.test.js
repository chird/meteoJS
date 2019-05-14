﻿QUnit.test("different use cases", function (assert) {
  var res = new meteoJS.synview.resource.VectorTile();
  assert.equal(res.getId(), '', 'empty ID');
  assert.equal(res.getUrl(), undefined, 'undefined Url');
  assert.equal(res.getDatetime(), undefined, 'undefined Datetime');
  res.setOLStyle(); // Check for no error
  
  var res1 = new meteoJS.synview.resource.VectorTile({
    datetime: new Date('2018-08-08T00:00:00.000Z')
  });
  assert.equal(res1.getId(), '2018-08-08T00:00:00.000Z', 'time ID');
  assert.equal(res1.getUrl(), undefined, 'undefined Url');
  assert.equal(res1.getDatetime().toISOString(), '2018-08-08T00:00:00.000Z', 'correct Datetime');
  var olLayer1 = res1.getOLLayer();
  assert.equal(olLayer1.getSource().getUrls(), undefined, 'Source URL');
  res1.setOLStyle(); // Check for no error
  
  var res2 = new meteoJS.synview.resource.VectorTile({
    datetime: new Date('2018-08-01T00:00:00.000Z'),
    url: 'http://www.example.com'
  });
  assert.equal(res2.getId(), '2018-08-01T00:00:00.000Z', 'time ID');
  assert.equal(res2.getUrl(), 'http://www.example.com', 'correct Url');
  assert.equal(res2.getDatetime().toISOString(), '2018-08-01T00:00:00.000Z', 'correct Datetime');
  var olLayer2 = res2.getOLLayer();
  assert.equal(olLayer2.getSource().getUrls(), undefined, 'no URL');
  res2.setOLStyle(); // Check for no error
  
  var res3 = new meteoJS.synview.resource.VectorTile({
    datetime: new Date('2018-08-02T00:00:00.000Z'),
    url: 'http://www.example.com/2',
    ol: {
      source: {
        format: new ol.format.GeoJSON()
      }
    }
  });
  assert.equal(res3.getId(), '2018-08-02T00:00:00.000Z', 'time ID');
  assert.equal(res3.getUrl(), 'http://www.example.com/2', 'correct Url');
  assert.equal(res3.getDatetime().toISOString(), '2018-08-02T00:00:00.000Z', 'correct Datetime');
  var olLayer3 = res3.getOLLayer();
  assert.equal(olLayer3.getSource().getUrls(), 'http://www.example.com/2', 'Source URL');
  res3.setOLStyle(); // Check for no error
  
  var res4 = new meteoJS.synview.resource.VectorTile({
    datetime: new Date('2019-08-02T00:00:00.000Z'),
    url: 'http://www.example.com/3',
    ol: {
      source: {
        format: new ol.format.GeoJSON(),
        tileUrlFunction: function (TileCoord, ratio, proj) { return 'http://www.example.com/3/'+TileCoord[0]+'/'+TileCoord[1]+'/'+TileCoord[2] },
        tileGrid: new ol.tilegrid.createXYZ()
      }
    }
  });
  assert.equal(res4.getId(), '2019-08-02T00:00:00.000Z', 'time ID');
  assert.equal(res4.getUrl(), 'http://www.example.com/3', 'correct Url');
  assert.equal(res4.getDatetime().toISOString(), '2019-08-02T00:00:00.000Z', 'correct Datetime');
  var olLayer4 = res4.getOLLayer();
  assert.notEqual(olLayer4.getSource().getTileUrlFunction(), undefined, 'TileUrlFunction exists');
  assert.notEqual(olLayer4.getSource().getTileGrid(), undefined, 'TileGrid exists');
  assert.equal(olLayer4.getSource().getUrls(), undefined, 'No URL');
  res4.setOLStyle(); // Check for no error
});