import Named from 'Named.js';

QUnit.test("Empty class", function (assert) {
  let n = new Named();
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
QUnit.test("No languages", function (assert) {
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
QUnit.test("One language", function (assert) {
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
QUnit.test("Two languages", function (assert) {
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
QUnit.test("Two languages, adjusted sortation", function (assert) {
  let n = new Named({
    names: {
      en: 'en-Test',
      de: 'de-Test'
    },
    langSortation: ['de', 'en']
  });
  assert.equal(n.name, 'de-Test', 'name');
  assert.equal(n.getNameByLang(), 'en-Test', 'getNameByLang');
  assert.equal(n.getNameByLang('en'), 'en-Test', 'getNameByLang');
  assert.equal(n.getNameByLang('de'), 'de-Test', 'getNameByLang');
  assert.equal(n.getNameByLang('fr'), 'de-Test', 'getNameByLang');
  assert.equal(n.getNameByLang('rm'), 'de-Test', 'getNameByLang');
  assert.equal(n.getNameByLangNoFallback('en'), 'en-Test', 'getNameByLangNoFallback');
  assert.equal(n.getNameByLangNoFallback('de'), 'de-Test', 'getNameByLangNoFallback');
  assert.equal(n.getNameByLangNoFallback('fr'), '', 'getNameByLangNoFallback');
  assert.equal(n.getNameByLangNoFallback('rm'), '', 'getNameByLangNoFallback');
});