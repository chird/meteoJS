const assert = require("assert");
import UniqueNamed from '../../../src/meteoJS/base/UniqueNamed.js';
import { UniqueNamed as UniqueNamedClass }
  from '../../../src/meteoJS/base/UniqueNamed.js';

describe('UniqueNamed class, import via default', () => {
  it('empty class', () => {
    let u = new UniqueNamed();
    assert.equal(u.id, undefined, 'empty id by default');
    assert.equal(u.name, '', 'empty name');
    u.id = 'a';
    assert.equal(u.id, 'a', 'id now set');
    assert.equal(u.name, 'a', 'name now set');
  });
  it('class with set id', () => {
    let u = new UniqueNamed({
      id: 'b'
    });
    assert.equal(u.id, 'b', 'id is b');
    assert.equal(u.name, 'b', 'name');
    u.id = 'c';
    assert.equal(u.id, 'c', 'changed id');
    assert.equal(u.name, 'c', 'name');
  });
});
describe('UniqueNamed class, import via name', () => {
  it('simple', () => {
    let u = new UniqueNamedClass({ id: 'd' });
    assert.equal(u.id, 'd', 'id is d');
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
      name: 'Test-default',
      names: {
        de: 'Test'
      }
    });
    assert.equal(n.name, 'Test-default', 'name');
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
      name: 'Test-Default',
      names: {
        en: 'en-Test',
        de: 'de-Test'
      }
    });
    assert.equal(n.name, 'Test-Default', 'name');
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
      name: 'Test-Default',
      names: {
        en: 'en-Test',
        de: 'de-Test'
      },
      langSortation: ['de', 'en']
    });
    assert.equal(n.name, 'Test-Default', 'name');
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
  it('setter methods', () => {
    let n = new UniqueNamed({ langSortation: ['en', 'de']});
    assert.equal(n.name, '', 'name');
    assert.equal(n.getNameByLang(), '', 'getNameByLang()');
    assert.equal(n.getNameByLang('en'), '', 'getNameByLang(\'en\')');
    assert.equal(n.getNameByLang('de'), '', 'getNameByLang(\'de\')');
    assert.equal(n.getNameByLangNoFallback('en'), '', 'getNameByLangNoFallback(\'en\')');
    assert.equal(n.getNameByLangNoFallback('de'), '', 'getNameByLangNoFallback(\'de\')');
    n.name = 'Test';
    assert.equal(n.name, 'Test', 'name');
    assert.equal(n.getNameByLang(), 'Test', 'getNameByLang()');
    assert.equal(n.getNameByLang('en'), 'Test', 'getNameByLang(\'en\')');
    assert.equal(n.getNameByLang('de'), 'Test', 'getNameByLang(\'de\')');
    assert.equal(n.getNameByLangNoFallback('en'), '', 'getNameByLangNoFallback(\'en\')');
    assert.equal(n.getNameByLangNoFallback('de'), '', 'getNameByLangNoFallback(\'de\')');
    n.setNameByLang('de', 'Test-de');
    assert.equal(n.name, 'Test', 'name');
    assert.equal(n.getNameByLang(), 'Test-de', 'getNameByLang()');
    assert.equal(n.getNameByLang('en'), 'Test-de', 'getNameByLang(\'en\')');
    assert.equal(n.getNameByLang('de'), 'Test-de', 'getNameByLang(\'de\')');
    assert.equal(n.getNameByLangNoFallback('en'), '', 'getNameByLangNoFallback(\'en\')');
    assert.equal(n.getNameByLangNoFallback('de'), 'Test-de', 'getNameByLangNoFallback(\'de\')');
    n.setNameByLang('en', 'Test-en');
    assert.equal(n.name, 'Test', 'name');
    assert.equal(n.getNameByLang(), 'Test-en', 'getNameByLang()');
    assert.equal(n.getNameByLang('en'), 'Test-en', 'getNameByLang(\'en\')');
    assert.equal(n.getNameByLang('de'), 'Test-de', 'getNameByLang(\'de\')');
    assert.equal(n.getNameByLangNoFallback('en'), 'Test-en', 'getNameByLangNoFallback(\'en\')');
    assert.equal(n.getNameByLangNoFallback('de'), 'Test-de', 'getNameByLangNoFallback(\'de\')');
    n.setNameByLang('de', undefined);
    assert.equal(n.name, 'Test', 'name');
    assert.equal(n.getNameByLang(), 'Test-en', 'getNameByLang()');
    assert.equal(n.getNameByLang('en'), 'Test-en', 'getNameByLang(\'en\')');
    assert.equal(n.getNameByLang('de'), 'Test-en', 'getNameByLang(\'de\')');
    assert.equal(n.getNameByLangNoFallback('en'), 'Test-en', 'getNameByLangNoFallback(\'en\')');
    assert.equal(n.getNameByLangNoFallback('de'), '', 'getNameByLangNoFallback(\'de\')');
  });
});