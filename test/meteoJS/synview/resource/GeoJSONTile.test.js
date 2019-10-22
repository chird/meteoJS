import assert from 'assert';
import GeoJSONTile from '../../../../src/meteoJS/synview/resource/GeoJSONTile.js';

it("different use cases", () => {
  let res = new GeoJSONTile();
  assert.equal(res.getId(), '', 'empty ID');
  assert.equal(res.getUrl(), undefined, 'undefined Url');
  assert.equal(res.getDatetime(), undefined, 'undefined Datetime');
  res.setOLStyle(); // Check for no error
  
  let res1 = new GeoJSONTile({
    datetime: new Date('2018-08-08T00:00:00.000Z')
  });
  assert.equal(res1.getId(), '2018-08-08T00:00:00.000Z', 'time ID');
  assert.equal(res1.getUrl(), undefined, 'undefined Url');
  assert.equal(res1.getDatetime().toISOString(), '2018-08-08T00:00:00.000Z', 'correct Datetime');
  let olLayer1 = res1.getOLLayer();
  assert.equal(olLayer1.getSource().getUrls(), undefined, 'Source URL');
  res1.setOLStyle(); // Check for no error
  
  let res2 = new GeoJSONTile({
    datetime: new Date('2018-08-01T00:00:00.000Z'),
    url: 'http://www.example.com'
  });
  assert.equal(res2.getId(), '2018-08-01T00:00:00.000Z', 'time ID');
  assert.equal(res2.getUrl(), 'http://www.example.com', 'correct Url');
  assert.equal(res2.getDatetime().toISOString(), '2018-08-01T00:00:00.000Z', 'correct Datetime');
  let olLayer2 = res2.getOLLayer();
  assert.equal(olLayer2.getSource().getUrls(), 'http://www.example.com', 'no URL');
  res2.setOLStyle(); // Check for no error
  
  let res3 = new GeoJSONTile({
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
  let olLayer3 = res3.getOLLayer();
  assert.equal(olLayer3.getSource().getUrls(), 'http://www.example.com/2', 'Source URL');
  res3.setOLStyle(); // Check for no error
});