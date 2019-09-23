const assert = require("assert");
import UniqueNamed from '../../../src/meteoJS/base/UniqueNamed.js';
import { UniqueNamed as UniqueNamedClass }
  from '../../../src/meteoJS/base/UniqueNamed.js';

describe('UniqueNamed class, import via default (equal to Unique tests)', () => {
  describe('empty class', () => {
    let u = new UniqueNamed();
    it('empty id by default', () => {
      assert.equal(u.id, undefined);
    });
    it('id now set', () => {
      u.id = 'a';
      assert.equal(u.id, 'a');
    });
  });
  describe('class with set id', () => {
    let u = new UniqueNamed({
      id: 'b'
    });
    it('id is b', () => {
      assert.equal(u.id, 'b');
    });
    it('changed id', () => {
      u.id = 'c';
      assert.equal(u.id, 'c');
    });
  });
});
describe('UniqueNamed class, named import, Unique tests', () => {
  describe('simple', () => {
    it('id is d', () => {
      let u = new UniqueNamedClass({ id: 'd' });
      assert.equal(u.id, 'd');
    });
  });
});

describe('UniqueNamed class, import via default (equal to UniqueNamed tests)', () => {
  describe('empty constructor', () => {
    let n = new UniqueNamed();
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
    let n = new UniqueNamed({
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
    let n = new UniqueNamed({
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
    let n = new UniqueNamed({
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
    let n = new UniqueNamed({
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
  describe('id-setter Hook', () => {
    let counter = 0;
    class A extends UniqueNamed {
      setId(id) {
        super.setId(id);
        counter++;
      }
    };
    let a = new A();
    a.id = 'a';
    a.id = 'b';
    it('two setId() calls', () => {
      assert.equal(counter, 2);
    });
    it('id', () => {
      assert.equal(a.id, 'b');
    });
  });
});
describe('UniqueNamed class, import via name (equal to UniqueNamed tests)', () => {
  describe('simple', () => {
    let n = new UniqueNamedClass({ names: { de: 'Test' } });
    it('name', () => {
      assert.equal(n.name, 'Test');
    });
  });
});