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

describe('UniqueNamed class, import via default (equal to Named tests)', () => {
  it('empty constructor', () => {
    let n = new UniqueNamed();
    assert.equal(n.name, '', 'name');
    assert.equal(n.getNameByLang(), '', 'getNameByLang()');
    assert.equal(n.getNameByLang('en'), '', 'getNameByLang(\'en\')');
    assert.equal(n.getNameByLang('de'), '', 'getNameByLang(\'de\')');
    assert.equal(n.getNameByLang('fr'), '', 'getNameByLang(\'fr\')');
    assert.equal(n.getNameByLang('rm'), '', 'getNameByLang(\'rm\')');
    assert.equal(n.getNameByLangNoFallback('en'), '', 'getNameByLangNoFallback(\'en\')');
    assert.equal(n.getNameByLangNoFallback('de'), '', 'getNameByLangNoFallback(\'de\')');
    assert.equal(n.getNameByLangNoFallback('fr'), '', 'getNameByLangNoFallback(\'fr\')');
    assert.equal(n.getNameByLangNoFallback('rm'), '', 'getNameByLangNoFallback(\'rm\')');
  });
  it('constructor with empty names', () => {
    let n = new UniqueNamed({
      names: {}
    });
    assert.equal(n.name, '', 'name');
    assert.equal(n.getNameByLang(), '', 'getNameByLang()');
    assert.equal(n.getNameByLang('en'), '', 'getNameByLang(\'en\')');
    assert.equal(n.getNameByLang('de'), '', 'getNameByLang(\'de\')');
    assert.equal(n.getNameByLang('fr'), '', 'getNameByLang(\'fr\')');
    assert.equal(n.getNameByLang('rm'), '', 'getNameByLang(\'rm\')');
    assert.equal(n.getNameByLangNoFallback('en'), '', 'getNameByLangNoFallback(\'en\')');
    assert.equal(n.getNameByLangNoFallback('de'), '', 'getNameByLangNoFallback(\'de\')');
    assert.equal(n.getNameByLangNoFallback('fr'), '', 'getNameByLangNoFallback(\'fr\')');
    assert.equal(n.getNameByLangNoFallback('rm'), '', 'getNameByLangNoFallback(\'rm\')');
  });
  it('constructor with default name', () => {
    let n = new UniqueNamed({
      name: 'Test'
    });
    assert.equal(n.name, 'Test', 'name');
    assert.equal(n.getNameByLang(), 'Test', 'getNameByLang()');
    assert.equal(n.getNameByLang('en'), 'Test', 'getNameByLang(\'en\')');
    assert.equal(n.getNameByLang('de'), 'Test', 'getNameByLang(\'de\')');
    assert.equal(n.getNameByLang('fr'), 'Test', 'getNameByLang(\'fr\')');
    assert.equal(n.getNameByLang('rm'), 'Test', 'getNameByLang(\'rm\')');
    assert.equal(n.getNameByLangNoFallback('en'), '', 'getNameByLangNoFallback(\'en\')');
    assert.equal(n.getNameByLangNoFallback('de'), '', 'getNameByLangNoFallback(\'de\')');
    assert.equal(n.getNameByLangNoFallback('fr'), '', 'getNameByLangNoFallback(\'fr\')');
    assert.equal(n.getNameByLangNoFallback('rm'), '', 'getNameByLangNoFallback(\'rm\')');
  });
  it('constructor with one name in de', () => {
    let n = new UniqueNamed({
      name: 'Hidden',
      names: {
        de: 'Test'
      }
    });
    assert.equal(n.name, 'Test', 'name');
    assert.equal(n.getNameByLang(), 'Test', 'getNameByLang()');
    assert.equal(n.getNameByLang('en'), 'Test', 'getNameByLang(\'en\')');
    assert.equal(n.getNameByLang('de'), 'Test', 'getNameByLang(\'de\')');
    assert.equal(n.getNameByLang('fr'), 'Test', 'getNameByLang(\'fr\')');
    assert.equal(n.getNameByLang('rm'), 'Test', 'getNameByLang(\'rm\')');
    assert.equal(n.getNameByLangNoFallback('en'), '', 'getNameByLangNoFallback(\'en\')');
    assert.equal(n.getNameByLangNoFallback('de'), 'Test', 'getNameByLangNoFallback(\'de\')');
    assert.equal(n.getNameByLangNoFallback('fr'), '', 'getNameByLangNoFallback(\'fr\')');
    assert.equal(n.getNameByLangNoFallback('rm'), '', 'getNameByLangNoFallback(\'rm\')');
  });
  it('constructor with two names in de and en', () => {
    let n = new UniqueNamed({
      name: 'Hidden',
      names: {
        en: 'en-Test',
        de: 'de-Test'
      }
    });
    assert.equal(n.name, 'en-Test', 'name');
    assert.equal(n.getNameByLang(), 'en-Test', 'getNameByLang()');
    assert.equal(n.getNameByLang('en'), 'en-Test', 'getNameByLang(\'en\')');
    assert.equal(n.getNameByLang('de'), 'de-Test', 'getNameByLang(\'de\')');
    assert.equal(n.getNameByLang('fr'), 'en-Test', 'getNameByLang(\'fr\')');
    assert.equal(n.getNameByLang('rm'), 'en-Test', 'getNameByLang(\'rm\')');
    assert.equal(n.getNameByLangNoFallback('en'), 'en-Test', 'getNameByLangNoFallback(\'en\')');
    assert.equal(n.getNameByLangNoFallback('de'), 'de-Test', 'getNameByLangNoFallback(\'de\')');
    assert.equal(n.getNameByLangNoFallback('fr'), '', 'getNameByLangNoFallback(\'fr\')');
    assert.equal(n.getNameByLangNoFallback('rm'), '', 'getNameByLangNoFallback(\'rm\')');
  });
  it('constructor with two names and adjusted sortation', () => {
    let n = new UniqueNamed({
      name: 'Hidden',
      names: {
        en: 'en-Test',
        de: 'de-Test'
      },
      langSortation: ['de', 'en']
    });
    assert.equal(n.name, 'de-Test', 'name');
    assert.equal(n.getNameByLang(), 'de-Test', 'getNameByLang()');
    assert.equal(n.getNameByLang('en'), 'en-Test', 'getNameByLang(\'en\')');
    assert.equal(n.getNameByLang('de'), 'de-Test', 'getNameByLang(\'de\')');
    assert.equal(n.getNameByLang('fr'), 'de-Test', 'getNameByLang(\'fr\')');
    assert.equal(n.getNameByLang('rm'), 'de-Test', 'getNameByLang(\'rm\')');
    assert.equal(n.getNameByLangNoFallback('en'), 'en-Test', 'getNameByLangNoFallback(\'en\')');
    assert.equal(n.getNameByLangNoFallback('de'), 'de-Test', 'getNameByLangNoFallback(\'de\')');
    assert.equal(n.getNameByLangNoFallback('fr'), '', 'getNameByLangNoFallback(\'fr\')');
    assert.equal(n.getNameByLangNoFallback('rm'), '', 'getNameByLangNoFallback(\'rm\')');
  });
});
describe('UniqueNamed class, import via name (equal to UniqueNamed tests)', () => {
  it('simple', () => {
    let n = new UniqueNamedClass({ names: { de: 'Test' } });
    assert.equal(n.name, 'Test', 'name');
  });
});