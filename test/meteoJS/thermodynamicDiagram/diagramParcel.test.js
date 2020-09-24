import assert from 'assert';
import Parcel from '../../../src/meteoJS/sounding/Parcel.js';
import { default as DiagramParcel, DiagramParcel as DiagramParcelClass }
  from '../../../src/meteoJS/thermodynamicDiagram/DiagramParcel.js';

describe('DiagramParcel class, import via default', () => {
  it('Empty constructor', () => {
    const p = new DiagramParcel();
    assert.ok(p.parcel === undefined, 'sounding');
    assert.ok(p.visible, 'visible');
    let changeVisibleCounter = 0;
    p.on('change:visible', () => changeVisibleCounter++);
    p.visible = false;
    assert.ok(!p.visible, 'visible');
    p.visible = true;
    assert.ok(p.visible, 'visible');
    assert.equal(changeVisibleCounter, 2, 'changeVisibleCounter');
  });
  it('Unique functionality', () => {
    const p = new DiagramParcel();
    assert.equal(p.id, undefined, 'id');
    p.id = 'a';
    assert.equal(p.id, 'a', 'id');
    const p1 = new DiagramParcel({ id: 'b' });
    assert.equal(p1.id, 'b', 'id');
  });
  it('Constructor with Sounding', () => {
    let parcel = new Parcel();
    let p = new DiagramParcel({ parcel });
    assert.equal(p.parcel, parcel, 'sounding');
  });
});
describe('DiagramParcel class, import via name', () => {
  it('empty object', () => {
    let s = new DiagramParcelClass();
    assert.ok(s.parcel === undefined, 'sounding');
    assert.ok(s.visible, 'visible');
  });
});