const assert = require("assert");
import Unique from '../../../src/meteoJS/base/Unique.js';
import { Unique as UniqueClass } from '../../../src/meteoJS/base/Unique.js';

describe('Unique class, import via default', () => {
  describe('empty class', () => {
    let u = new Unique();
    it('empty id by default', () => {
      assert.equal(u.id, undefined);
    });
    it('id now set', () => {
      u.id = 'a';
      assert.equal(u.id, 'a');
    });
  });
  describe('class with set id', () => {
    let u = new Unique({
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
describe('Unique class, import via name', () => {
  describe('simple', () => {
    it('id is d', () => {
      let u = new UniqueClass({ id: 'd' });
      assert.equal(u.id, 'd');
    });
  });
});