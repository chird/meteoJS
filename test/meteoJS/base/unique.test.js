const assert = require("assert");
import Unique from '../../../src/meteoJS/base/Unique.js';
import { Unique as UniqueClass } from '../../../src/meteoJS/base/Unique.js';

describe('Unique class, import via default', () => {
  it('empty class', () => {
    let u = new Unique();
    assert.equal(u.id, undefined, 'empty id by default');
    u.id = 'a';
    assert.equal(u.id, 'a', 'id now set');
  });
  it('class with set id', () => {
    let u = new Unique({
      id: 'b'
    });
    assert.equal(u.id, 'b', 'id is b');
    u.id = 'c';
    assert.equal(u.id, 'c', 'changed id');
  });
});
describe('Unique class, import via name', () => {
  it('simple', () => {
    let u = new UniqueClass({ id: 'd' });
    assert.equal(u.id, 'd', 'id is d');
  });
});