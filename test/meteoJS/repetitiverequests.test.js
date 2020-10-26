import assert from 'assert';
import RepetitiveRequests from '../../src/meteoJS/RepetitiveRequests.js';
import { RepetitiveRequests as RepetitiveRequestsClass }
  from '../../src/meteoJS/RepetitiveRequests.js';

describe('RepetitiveRequests', () => {
  describe('default import', () => {
    let rr = new RepetitiveRequests();
    it ('properties', () => {
      assert.equal(rr.url, undefined, 'url');
      assert.equal(rr.user, '', 'user');
      assert.equal(rr.password, '', 'password');
      assert.equal(rr.responseType, '', 'responseType');
      rr.url = 'https://github.com';
      rr.user = 'abc';
      rr.password = '123';
      rr.responseType = 'json';
      assert.equal(rr.url, 'https://github.com', 'url');
      assert.equal(rr.user, 'abc', 'user');
      assert.equal(rr.password, '123', 'password');
      assert.equal(rr.responseType, 'json', 'responseType');
      let rr1 = new RepetitiveRequests({
        url: 'https://github.com/chird',
        user: 'ABC',
        password: '1234',
        responseType: 'text'
      });
      assert.equal(rr1.url, 'https://github.com/chird', 'url');
      assert.equal(rr1.user, 'ABC', 'user');
      assert.equal(rr1.password, '1234', 'password');
      assert.equal(rr1.responseType, 'text', 'responseType');
    });
  });
  describe('named import', () => {
    let rr = new RepetitiveRequestsClass();
  });
});