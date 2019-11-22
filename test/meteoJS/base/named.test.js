const assert = require("assert");
import Named from '../../../src/meteoJS/base/Named.js';
import { Named as NamedClass } from '../../../src/meteoJS/base/Named.js';

describe('Named class, import via default', () => {
  it('empty constructor', () => {
    let n = new Named();
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
    let n = new Named({
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
    let n = new Named({
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
    let n = new Named({
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
    let n = new Named({
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
    let n = new Named({
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
    let n = new Named({ langSortation: ['en', 'de']});
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
describe('Named class, import via name', () => {
  it('simple', () => {
    let n = new NamedClass({ names: { de: 'Test' } });
    assert.equal(n.name, 'Test', 'name');
  });
});