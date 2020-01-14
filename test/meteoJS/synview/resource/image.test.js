import assert from 'assert';
import 'jsdom-global/register';
import Image from '../../../../src/meteoJS/synview/resource/Image.js';

describe('synview/resource/Image', () => {
  it("simple use case", () => {
    let res = new Image();
    assert.equal(res.getId(), undefined, 'empty ID');
    assert.equal(res.getUrl(), undefined, 'undefined Url');
    assert.equal(res.getDatetime(), undefined, 'undefined Datetime');
    assert.equal(res.className, undefined, 'className');
    
    let datetime = new Date('2018-08-01T00:00:00.000Z');
    let res1 = new Image({
      datetime,
      url: 'http://www.example.com',
      extent: [1,2,3,4]
    });
    assert.equal(res1.getId(), 'http://www.example.com', 'empty ID');
    assert.equal(res1.getUrl(), 'http://www.example.com', 'undefined Url');
    assert.equal(res1.getDatetime(), datetime, 'undefined Datetime');
    assert.equal(res1.className, undefined, 'className');
    let layer = res1.getOLLayer();
    assert.equal(layer.getSource().getUrl(), 'http://www.example.com', 'no URL');
  });
});