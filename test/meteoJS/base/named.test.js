const assert = require("assert");
import Named from '../../../src/meteoJS/base/Named.js';

describe('Empty class', function () {
  let n = new Named();
  it('name', function () {
    assert.equal(n.name, '', 'name');
  });
  assert.equal(n.getNameByLang(), '', 'getNameByLang');
  assert.equal(n.getNameByLang('en'), '', 'getNameByLang');
  assert.equal(n.getNameByLang('de'), '', 'getNameByLang');
  assert.equal(n.getNameByLang('fr'), '', 'getNameByLang');
  assert.equal(n.getNameByLang('rm'), '', 'getNameByLang');
  assert.equal(n.getNameByLangNoFallback('en'), '', 'getNameByLangNoFallback');
  assert.equal(n.getNameByLangNoFallback('de'), '', 'getNameByLangNoFallback');
  assert.equal(n.getNameByLangNoFallback('fr'), '', 'getNameByLangNoFallback');
  assert.equal(n.getNameByLangNoFallback('rm'), '', 'getNameByLangNoFallback');
});
describe("No languages", function () {
  let n = new Named({
    names: {}
  });
  assert.equal(n.name, '', 'name');
  assert.equal(n.getNameByLang(), '', 'getNameByLang');
  assert.equal(n.getNameByLang('en'), '', 'getNameByLang');
  assert.equal(n.getNameByLang('de'), '', 'getNameByLang');
  assert.equal(n.getNameByLang('fr'), '', 'getNameByLang');
  assert.equal(n.getNameByLang('rm'), '', 'getNameByLang');
  assert.equal(n.getNameByLangNoFallback('en'), '', 'getNameByLangNoFallback');
  assert.equal(n.getNameByLangNoFallback('de'), '', 'getNameByLangNoFallback');
  assert.equal(n.getNameByLangNoFallback('fr'), '', 'getNameByLangNoFallback');
  assert.equal(n.getNameByLangNoFallback('rm'), '', 'getNameByLangNoFallback');
});
describe("One language", function () {
  let n = new Named({
    names: {
      de: 'Test'
    }
  });
  assert.equal(n.name, 'Test', 'name');
  assert.equal(n.getNameByLang(), 'Test', 'getNameByLang');
  assert.equal(n.getNameByLang('en'), 'Test', 'getNameByLang');
  assert.equal(n.getNameByLang('de'), 'Test', 'getNameByLang');
  assert.equal(n.getNameByLang('fr'), 'Test', 'getNameByLang');
  assert.equal(n.getNameByLang('rm'), 'Test', 'getNameByLang');
  assert.equal(n.getNameByLangNoFallback('en'), '', 'getNameByLangNoFallback');
  assert.equal(n.getNameByLangNoFallback('de'), 'Test', 'getNameByLangNoFallback');
  assert.equal(n.getNameByLangNoFallback('fr'), '', 'getNameByLangNoFallback');
  assert.equal(n.getNameByLangNoFallback('rm'), '', 'getNameByLangNoFallback');
});
describe("Two languages", function () {
  let n = new Named({
    names: {
      en: 'en-Test',
      de: 'de-Test'
    }
  });
  assert.equal(n.name, 'en-Test', 'name');
  assert.equal(n.getNameByLang(), 'en-Test', 'getNameByLang');
  assert.equal(n.getNameByLang('en'), 'en-Test', 'getNameByLang');
  assert.equal(n.getNameByLang('de'), 'de-Test', 'getNameByLang');
  assert.equal(n.getNameByLang('fr'), 'en-Test', 'getNameByLang');
  assert.equal(n.getNameByLang('rm'), 'en-Test', 'getNameByLang');
  assert.equal(n.getNameByLangNoFallback('en'), 'en-Test', 'getNameByLangNoFallback');
  assert.equal(n.getNameByLangNoFallback('de'), 'de-Test', 'getNameByLangNoFallback');
  assert.equal(n.getNameByLangNoFallback('fr'), '', 'getNameByLangNoFallback');
  assert.equal(n.getNameByLangNoFallback('rm'), '', 'getNameByLangNoFallback');
});
describe("Two languages, adjusted sortation", function () {
  let n = new Named({
    names: {
      en: 'en-Test',
      de: 'de-Test'
    },
    langSortation: ['de', 'en']
  });
  assert.equal(n.name, 'de-Test', 'name');
  assert.equal(n.getNameByLang(), 'de-Test', 'getNameByLang');
  assert.equal(n.getNameByLang('en'), 'en-Test', 'getNameByLang');
  assert.equal(n.getNameByLang('de'), 'de-Test', 'getNameByLang');
  assert.equal(n.getNameByLang('fr'), 'de-Test', 'getNameByLang');
  assert.equal(n.getNameByLang('rm'), 'de-Test', 'getNameByLang');
  assert.equal(n.getNameByLangNoFallback('en'), 'en-Test', 'getNameByLangNoFallback');
  assert.equal(n.getNameByLangNoFallback('de'), 'de-Test', 'getNameByLangNoFallback');
  assert.equal(n.getNameByLangNoFallback('fr'), '', 'getNameByLangNoFallback');
  assert.equal(n.getNameByLangNoFallback('rm'), '', 'getNameByLangNoFallback');
});