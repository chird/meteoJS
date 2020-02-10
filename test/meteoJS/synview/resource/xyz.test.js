import assert from 'assert';
import 'jsdom-global/register';
import XYZ from '../../../../src/meteoJS/synview/resource/XYZ.js';

describe('synview/resource/xyz', () => {
  it('some tests', () => {
    let res = new XYZ();
    assert.equal(res.getId(), undefined, 'empty ID');
    assert.equal(res.getUrl(), undefined, 'undefined Url');
    assert.equal(res.getDatetime(), undefined, 'undefined Datetime');
    assert.equal(res.className, undefined, 'className');
    
    let datetime = new Date('2020-02-10T00:00:00.000Z');
    let res1 = new XYZ({
      datetime,
      url: 'http://subdomain-{a-f}.example.com/{x}/{y}/{z}.png',
      className: 'test'
    });
    assert.equal(res1.getId(), 'http://subdomain-{a-f}.example.com/{x}/{y}/{z}.png', 'id');
    assert.equal(res1.getUrl(), 'http://subdomain-{a-f}.example.com/{x}/{y}/{z}.png', 'URL');
    assert.equal(res1.getDatetime(), datetime, 'undefined Datetime');
    assert.equal(res1.className, 'test', 'className');
    let layer = res1.getOLLayer();
    assert.equal(layer.getSource().getUrls()[0], 'http://subdomain-a.example.com/{x}/{y}/{z}.png', 'URL[0]');
  });
});