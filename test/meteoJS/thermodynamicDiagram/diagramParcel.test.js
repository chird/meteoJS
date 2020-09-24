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
  it('Default Options', () => {
    const p = new DiagramParcel();
    ['visible', 'temp', 'dewp'].forEach(key => {
      assert.ok(key in p.options, key);
      if (key == 'visible') {
        assert.ok(p.options.visible, 'visible');
        assert.equal(p.options.visible, p.visible, 'visible');
        return;
      }
      assert.ok('visible' in p.options[key], 'visible');
      assert.ok(p.options[key].visible, 'visible default');
      assert.ok('style' in p.options[key], 'style');
      const defaultOptions = {
        color: 'rgb(255, 153, 0)',
        width: 3,
        linecap: 'round'
      };
      assert.ok(Object.keys(p.options[key].style).length, Object.keys(defaultOptions).length, 'style');
      Object.keys(defaultOptions).forEach(styleKey => {
        assert.equal(p.options[key].style[styleKey], defaultOptions[styleKey], styleKey);
      });
    });
  });
  it('Partly changed options', () => {
    const p = new DiagramParcel({
      visible: false,
      temp: {
        style: {
          color: 'gray',
          opacity: 0.5
        }
      },
      dewp: {
        visible: false
      }
    });
    ['visible', 'temp', 'dewp'].forEach(key => {
      assert.ok(key in p.options, key);
      if (key == 'visible') {
        assert.ok(!p.options.visible, 'not visible');
        assert.equal(p.options.visible, p.visible, 'visible');
        return;
      }
      assert.ok('visible' in p.options[key], 'visible');
      assert.ok(p.options[key].visible == (key == 'temp'), 'visible');
      assert.ok('style' in p.options[key], 'style');
      if (key == 'temp') {
        assert.ok(Object.keys(p.options[key].style).length, 4, 'style');
        assert.equal(p.options[key].style.color, 'gray', 'color');
        assert.equal(p.options[key].style.opacity, 0.5, 'opacity');
        return;
      }
      assert.ok(Object.keys(p.options[key].style).length, 3, 'style');
    });
  });
  it('update()', () => {
    const p = new DiagramParcel();
    let changeOptionsCounter = 0;
    p.on('change:options', () => changeOptionsCounter++);
    let changeVisibleCounter = 0;
    p.on('change:visible', () => changeVisibleCounter++);
    assert.ok(p.visible, 'visible');
    p.update({
      temp: {
        visible: false
      },
      dewp: {
        visible: false
      }
    });
    assert.ok(p.visible, 'visible');
    assert.ok(!p.options.temp.visible, 'visible');
    assert.ok(!p.options.dewp.visible, 'visible');
    assert.equal(changeOptionsCounter, 1, 'changeOptionsCounter');
    assert.equal(changeVisibleCounter, 0, 'changeVisibleCounter');
    p.update({
      visible: false
    });
    assert.ok(!p.visible, 'visible');
    assert.ok(!p.options.temp.visible, 'visible');
    assert.ok(!p.options.dewp.visible, 'visible');
    assert.equal(changeOptionsCounter, 1, 'changeOptionsCounter');
    assert.equal(changeVisibleCounter, 1, 'changeVisibleCounter');
    p.update({
      temp: {
        style: { color: 'red' }
      },
      dewp: {
        style: { color: 'blue' }
      }
    });
    assert.ok(!p.visible, 'visible');
    assert.ok(!p.options.temp.visible, 'visible');
    assert.ok(!p.options.dewp.visible, 'visible');
    assert.equal(p.options.temp.style.color, 'red', 'color');
    assert.equal(p.options.temp.style.width, 3, 'width');
    assert.equal(p.options.dewp.style.color, 'blue', 'color');
    assert.equal(p.options.dewp.style.width, 3, 'width');
    assert.equal(changeOptionsCounter, 2, 'changeOptionsCounter');
    assert.equal(changeVisibleCounter, 1, 'changeVisibleCounter');
    p.visible = true;
    assert.ok(p.visible, 'visible');
    assert.equal(changeOptionsCounter, 2, 'changeOptionsCounter');
    assert.equal(changeVisibleCounter, 2, 'changeVisibleCounter');
  });
});
describe('DiagramParcel class, import via name', () => {
  it('empty object', () => {
    let s = new DiagramParcelClass();
    assert.ok(s.parcel === undefined, 'sounding');
    assert.ok(s.visible, 'visible');
  });
});