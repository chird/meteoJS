import assert from 'assert';
import GeoJSON from 'ol/format/GeoJSON';
import { createXYZ } from 'ol/tilegrid';
import VectorTile from '../../../../src/meteoJS/synview/resource/VectorTile.js';

describe('synview/resource/VectorTile', () => {
  it("different use cases", () => {
    let res = new VectorTile();
    assert.equal(res.getId(), '', 'empty ID');
    assert.equal(res.getUrl(), undefined, 'undefined Url');
    assert.equal(res.getDatetime(), undefined, 'undefined Datetime');
    res.setOLStyle(); // Check for no error
    
    let res1 = new VectorTile({
      datetime: new Date('2018-08-08T00:00:00.000Z')
    });
    assert.equal(res1.getId(), '2018-08-08T00:00:00.000Z', 'time ID');
    assert.equal(res1.getUrl(), undefined, 'undefined Url');
    assert.equal(res1.getDatetime().toISOString(), '2018-08-08T00:00:00.000Z', 'correct Datetime');
    assert.equal(res1.className, undefined, 'className');
    let olLayer1 = res1.getOLLayer();
    assert.equal(olLayer1.getSource().getUrls(), undefined, 'Source URL');
    res1.setOLStyle(); // Check for no error
    
    let res2 = new VectorTile({
      datetime: new Date('2018-08-01T00:00:00.000Z'),
      url: 'http://www.example.com'
    });
    assert.equal(res2.getId(), '2018-08-01T00:00:00.000Z', 'time ID');
    assert.equal(res2.getUrl(), 'http://www.example.com', 'correct Url');
    assert.equal(res2.getDatetime().toISOString(), '2018-08-01T00:00:00.000Z', 'correct Datetime');
    assert.equal(res2.className, undefined, 'className');
    let olLayer2 = res2.getOLLayer();
    assert.equal(olLayer2.getSource().getUrls(), undefined, 'no URL');
    res2.setOLStyle(); // Check for no error
    
    let res3 = new VectorTile({
      datetime: new Date('2018-08-02T00:00:00.000Z'),
      url: 'http://www.example.com/2',
      ol: {
        source: {
          format: new GeoJSON()
        }
      }
    });
    assert.equal(res3.getId(), '2018-08-02T00:00:00.000Z', 'time ID');
    assert.equal(res3.getUrl(), 'http://www.example.com/2', 'correct Url');
    assert.equal(res3.getDatetime().toISOString(), '2018-08-02T00:00:00.000Z', 'correct Datetime');
    assert.equal(res3.className, undefined, 'className');
    let olLayer3 = res3.getOLLayer();
    assert.equal(olLayer3.getSource().getUrls(), 'http://www.example.com/2', 'Source URL');
    res3.setOLStyle(); // Check for no error
    
    let res4 = new VectorTile({
      datetime: new Date('2019-08-02T00:00:00.000Z'),
      url: 'http://www.example.com/3',
      ol: {
        source: {
          format: new GeoJSON(),
          tileUrlFunction: function (TileCoord, ratio, proj) { return 'http://www.example.com/3/'+TileCoord[0]+'/'+TileCoord[1]+'/'+TileCoord[2] },
          tileGrid: createXYZ()
        }
      },
      className: 'test'
    });
    assert.equal(res4.getId(), '2019-08-02T00:00:00.000Z', 'time ID');
    assert.equal(res4.getUrl(), 'http://www.example.com/3', 'correct Url');
    assert.equal(res4.getDatetime().toISOString(), '2019-08-02T00:00:00.000Z', 'correct Datetime');
    assert.equal(res4.className, 'test', 'className');
    let olLayer4 = res4.getOLLayer();
    assert.notEqual(olLayer4.getSource().getTileUrlFunction(), undefined, 'TileUrlFunction exists');
    assert.notEqual(olLayer4.getSource().getTileGrid(), undefined, 'TileGrid exists');
    assert.equal(olLayer4.getSource().getUrls(), undefined, 'No URL');
    assert.equal(olLayer4.getClassName(), 'test', 'layer className');
    res4.setOLStyle(); // Check for no error
  });
});