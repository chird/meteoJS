import assert from 'assert';
import 'jsdom-global/register';
import GeoJSON from '../../../../src/meteoJS/synview/resource/GeoJSON.js';

it("differnt use cases", () => {
  let res = new GeoJSON();
  assert.equal(res.getId(), '', 'empty ID');
  assert.equal(res.getUrl(), undefined, 'undefined Url');
  assert.equal(res.getDatetime(), undefined, 'undefined Datetime');
  assert.equal(res.className, undefined, 'className');
  
  let res1 = new GeoJSON({
    datetime: new Date('2018-08-08T00:00:00.000Z'),
    url: 'http://www.example.com',
    className: 'test'
  });
  assert.equal(res1.getId(), '2018-08-08T00:00:00.000Z', 'time ID');
  assert.equal(res1.getUrl(), 'http://www.example.com', 'correct Url');
  assert.equal(res1.getDatetime().toISOString(), '2018-08-08T00:00:00.000Z', 'correct Datetime');
  assert.equal(res1.className, 'test', 'className');
  let olLayer1 = res1.getOLLayer();
  assert.equal(olLayer1.getSource().getUrl(), 'http://www.example.com', 'Source URL');
  assert.ok(olLayer1.getSource().getFormat() !== undefined, 'Defined source format');
  assert.equal(olLayer1.getClassName(), 'test', 'getClassName');
});