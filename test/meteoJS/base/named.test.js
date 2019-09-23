const assert = require("assert");
import Named from '../../../src/meteoJS/base/Named.js';
import { Named as NamedClass } from '../../../src/meteoJS/base/Named.js';

describe('Named class, import via default', () => {
  describe('empty constructor', () => {
    let n = new Named();
    it('name', () => {
      assert.equal(n.name, '');
    });
    it('getNameByLang()', () => {
      assert.equal(n.getNameByLang(), '');
    });
    it('getNameByLang(\'en\')', () => {
      assert.equal(n.getNameByLang('en'), '');
    });
    it('getNameByLang(\'de\')', () => {
      assert.equal(n.getNameByLang('de'), '',);
    });
    it('getNameByLang(\'fr\')', () => {
      assert.equal(n.getNameByLang('fr'), '');
    });
    it('getNameByLang(\'rm\')', () => {
      assert.equal(n.getNameByLang('rm'), '');
    });
    it('getNameByLangNoFallback(\'en\')', () => {
      assert.equal(n.getNameByLangNoFallback('en'), '');
    });
    it('getNameByLangNoFallback(\'de\')', () => {
      assert.equal(n.getNameByLangNoFallback('de'), '');
    });
    it('getNameByLangNoFallback(\'fr\')', () => {
      assert.equal(n.getNameByLangNoFallback('fr'), '');
    });
    it('getNameByLangNoFallback(\'rm\')', () => {
      assert.equal(n.getNameByLangNoFallback('rm'), '');
    });
  });
  describe('constructor with empty names', () => {
    let n = new Named({
      names: {}
    });
    it('name', () => {
      assert.equal(n.name, '');
    });
    it('getNameByLang()', () => {
      assert.equal(n.getNameByLang(), '');
    });
    it('getNameByLang(\'en\')', () => {
      assert.equal(n.getNameByLang('en'), '');
    });
    it('getNameByLang(\'de\')', () => {
      assert.equal(n.getNameByLang('de'), '',);
    });
    it('getNameByLang(\'fr\')', () => {
      assert.equal(n.getNameByLang('fr'), '');
    });
    it('getNameByLang(\'rm\')', () => {
      assert.equal(n.getNameByLang('rm'), '');
    });
    it('getNameByLangNoFallback(\'en\')', () => {
      assert.equal(n.getNameByLangNoFallback('en'), '');
    });
    it('getNameByLangNoFallback(\'de\')', () => {
      assert.equal(n.getNameByLangNoFallback('de'), '');
    });
    it('getNameByLangNoFallback(\'fr\')', () => {
      assert.equal(n.getNameByLangNoFallback('fr'), '');
    });
    it('getNameByLangNoFallback(\'rm\')', () => {
      assert.equal(n.getNameByLangNoFallback('rm'), '');
    });
  });
  describe('constructor with one name in de', () => {
    let n = new Named({
      names: {
        de: 'Test'
      }
    });
    it('name', () => {
      assert.equal(n.name, 'Test');
    });
    it('getNameByLang()', () => {
      assert.equal(n.getNameByLang(), 'Test');
    });
    it('getNameByLang(\'en\')', () => {
      assert.equal(n.getNameByLang('en'), 'Test');
    });
    it('getNameByLang(\'de\')', () => {
      assert.equal(n.getNameByLang('de'), 'Test',);
    });
    it('getNameByLang(\'fr\')', () => {
      assert.equal(n.getNameByLang('fr'), 'Test');
    });
    it('getNameByLang(\'rm\')', () => {
      assert.equal(n.getNameByLang('rm'), 'Test');
    });
    it('getNameByLangNoFallback(\'en\')', () => {
      assert.equal(n.getNameByLangNoFallback('en'), '');
    });
    it('getNameByLangNoFallback(\'de\')', () => {
      assert.equal(n.getNameByLangNoFallback('de'), 'Test');
    });
    it('getNameByLangNoFallback(\'fr\')', () => {
      assert.equal(n.getNameByLangNoFallback('fr'), '');
    });
    it('getNameByLangNoFallback(\'rm\')', () => {
      assert.equal(n.getNameByLangNoFallback('rm'), '');
    });
  });
  describe('constructor with two names in de and en', () => {
    let n = new Named({
      names: {
        en: 'en-Test',
        de: 'de-Test'
      }
    });
    it('name', () => {
      assert.equal(n.name, 'en-Test');
    });
    it('getNameByLang()', () => {
      assert.equal(n.getNameByLang(), 'en-Test');
    });
    it('getNameByLang(\'en\')', () => {
      assert.equal(n.getNameByLang('en'), 'en-Test');
    });
    it('getNameByLang(\'de\')', () => {
      assert.equal(n.getNameByLang('de'), 'de-Test',);
    });
    it('getNameByLang(\'fr\')', () => {
      assert.equal(n.getNameByLang('fr'), 'en-Test');
    });
    it('getNameByLang(\'rm\')', () => {
      assert.equal(n.getNameByLang('rm'), 'en-Test');
    });
    it('getNameByLangNoFallback(\'en\')', () => {
      assert.equal(n.getNameByLangNoFallback('en'), 'en-Test');
    });
    it('getNameByLangNoFallback(\'de\')', () => {
      assert.equal(n.getNameByLangNoFallback('de'), 'de-Test');
    });
    it('getNameByLangNoFallback(\'fr\')', () => {
      assert.equal(n.getNameByLangNoFallback('fr'), '');
    });
    it('getNameByLangNoFallback(\'rm\')', () => {
      assert.equal(n.getNameByLangNoFallback('rm'), '');
    });
  });
  describe('constructor with two names and adjusted sortation', () => {
    let n = new Named({
      names: {
        en: 'en-Test',
        de: 'de-Test'
      },
      langSortation: ['de', 'en']
    });
    it('name', () => {
      assert.equal(n.name, 'de-Test');
    });
    it('getNameByLang()', () => {
      assert.equal(n.getNameByLang(), 'de-Test');
    });
    it('getNameByLang(\'en\')', () => {
      assert.equal(n.getNameByLang('en'), 'en-Test');
    });
    it('getNameByLang(\'de\')', () => {
      assert.equal(n.getNameByLang('de'), 'de-Test',);
    });
    it('getNameByLang(\'fr\')', () => {
      assert.equal(n.getNameByLang('fr'), 'de-Test');
    });
    it('getNameByLang(\'rm\')', () => {
      assert.equal(n.getNameByLang('rm'), 'de-Test');
    });
    it('getNameByLangNoFallback(\'en\')', () => {
      assert.equal(n.getNameByLangNoFallback('en'), 'en-Test');
    });
    it('getNameByLangNoFallback(\'de\')', () => {
      assert.equal(n.getNameByLangNoFallback('de'), 'de-Test');
    });
    it('getNameByLangNoFallback(\'fr\')', () => {
      assert.equal(n.getNameByLangNoFallback('fr'), '');
    });
    it('getNameByLangNoFallback(\'rm\')', () => {
      assert.equal(n.getNameByLangNoFallback('rm'), '');
    });
  });
});
describe('Named class, import via name', () => {
  describe('simple', () => {
    let n = new NamedClass({ names: { de: 'Test' } });
    it('name', () => {
      assert.equal(n.name, 'Test');
    });
  });
});