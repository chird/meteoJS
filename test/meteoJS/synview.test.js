import assert from 'assert';
import Synview from '../../src/meteoJS/Synview.js';
import Type from '../../src/meteoJS/synview/Type.js';

describe('Synview', () => {
  it('appendType', () => {
    let synview = new Synview();
    let type1 = new Type({
      id: 'synview-type-1'
    });
    let type2 = new Type();
    let type3 = new Type();
    synview
      .appendType(type1)
      .appendType(type2)
      .appendType(type3);
    assert.equal(type1.getId(), 'synview-type-1', 'Id type1');
    assert.equal(type2.getId(), 'synview-type-0', 'Id type1');
    assert.equal(type3.getId(), 'synview-type-2', 'Id type1');
    assert.equal(synview.getTypeCollection().getCount(), 3, 'Count of types');
    assert.equal(synview.getTooltip(), undefined, 'getTooltip');
  });
});