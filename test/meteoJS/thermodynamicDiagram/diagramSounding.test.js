﻿import assert from 'assert';
import Sounding  from '../../../src/meteoJS/Sounding.js';
import { default as DiagramSounding, DiagramSounding as DiagramSoundingClass }
  from '../../../src/meteoJS/thermodynamicDiagram/DiagramSounding.js';

describe('DiagramSounding class, import via default', () => {
  it('Empty constructor', () => {
    let s = new DiagramSounding();
    assert.ok(s.sounding === undefined, 'sounding');
    assert.ok(s.visible, 'visible');
    let changeVisibleCounter = 0;
    s.on('change:visible', () => changeVisibleCounter++);
    s.visible = false;
    assert.ok(!s.visible, 'visible');
    s.visible = true;
    assert.ok(s.visible, 'visible');
    assert.equal(changeVisibleCounter, 2, 'changeVisibleCounter');
  });
  it('Unique functionality', () => {
    let s = new DiagramSounding();
    assert.equal(s.id, undefined, 'id');
    s.id = 'a';
    assert.equal(s.id, 'a', 'id');
  });
  it('Constructor with Sounding', () => {
    let sounding = new Sounding();
    let s = new DiagramSounding(sounding);
    assert.equal(s.sounding, sounding, 'sounding');
  });
  it('Default Options', () => {
    let s = new DiagramSounding();
    ['diagram', 'windprofile', 'hodograph'].forEach(key => {
      assert.ok(key in s.options, key);
      assert.ok('visible' in s.options[key], 'visible');
      assert.ok(s.options[key].visible, 'visible default');
    });
    assert.ok('temp' in s.options.diagram, 'temp');
    assert.ok('dewp' in s.options.diagram, 'dewp');
    assert.ok('windbarbs' in s.options.windprofile, 'windbarbs');
    assert.ok('windspeed' in s.options.windprofile, 'windspeed');
    const lineOptions = new Map([
      ['color', undefined],
      ['width', 1],
      ['opacity', undefined],
      ['linecap', undefined],
      ['linejoin', undefined],
      ['dasharray', undefined],
    ]);
    [['diagram', ['temp', 'dewp']],
     ['windprofile', ['windbarbs', 'windspeed']]].forEach(tests => {
      tests[1].forEach(key => {
        assert.ok(key in s.options[tests[0]], key);
        assert.ok('visible' in s.options[tests[0]][key], 'visible');
        assert.ok(s.options[tests[0]][key].visible, 'visible default');
        assert.ok('style' in s.options[tests[0]][key], 'style');
        for (let t of lineOptions) {
          assert.ok(t[0] in s.options[tests[0]][key].style, t[0]);
          assert.equal(s.options[tests[0]][key].style[t[0]], t[1], t[1]);
        }
      });
    });
    assert.ok('style' in s.options.hodograph, 'style');
    for (let t of lineOptions) {
      assert.ok(t[0] in s.options.hodograph.style, t[0]);
      assert.equal(s.options.hodograph.style[t[0]], t[1], t[1]);
    }
  });
  it('Partly changed Options', () => {
    let s = new DiagramSounding(undefined, {
      diagram: {
        dewp: {
          style: {
            color: 'red'
          }
        }
      },
      windprofile: {
        visible: false
      },
      hodograph: {
        visible: true,
        style: {
          width: 2
        }
      }
    });
    ['diagram', 'windprofile', 'hodograph'].forEach(key => {
      assert.ok(key in s.options, key);
      assert.ok('visible' in s.options[key], 'visible');
      assert.ok(s.options[key].visible == (key != 'windprofile'), 'visible default');
    });
    assert.ok('temp' in s.options.diagram, 'temp');
    assert.ok('dewp' in s.options.diagram, 'dewp');
    assert.ok('windbarbs' in s.options.windprofile, 'windbarbs');
    assert.ok('windspeed' in s.options.windprofile, 'windspeed');
    const lineOptions = new Map([
      ['color', undefined],
      ['width', 1],
      ['opacity', undefined],
      ['linecap', undefined],
      ['linejoin', undefined],
      ['dasharray', undefined],
    ]);
    [['diagram', ['temp', 'dewp']],
     ['windprofile', ['windbarbs', 'windspeed']]].forEach(tests => {
      tests[1].forEach(key => {
        assert.ok(key in s.options[tests[0]], key);
        assert.ok('visible' in s.options[tests[0]][key], 'visible');
        assert.ok(s.options[tests[0]][key].visible, 'visible default');
        assert.ok('style' in s.options[tests[0]][key], 'style');
        for (let t of lineOptions) {
          assert.ok(t[0] in s.options[tests[0]][key].style, t[0]);
          if (tests[0] == 'diagram' && key == 'dewp' && t[0] == 'color')
            assert.equal(s.options[tests[0]][key].style[t[0]], 'red', 'red');
          else
            assert.equal(s.options[tests[0]][key].style[t[0]], t[1], t[1]);
        }
      });
    });
    assert.ok('style' in s.options.hodograph, 'style');
    for (let t of lineOptions) {
      assert.ok(t[0] in s.options.hodograph.style, t[0]);
      if (t[0] == 'width')
        assert.equal(s.options.hodograph.style[t[0]], 2, 'width');
      else
        assert.equal(s.options.hodograph.style[t[0]], t[1], t[1]);
    }
  });
  it('update()', () => {
    let s = new DiagramSounding();
    let changeOptionsCounter = 0;
    s.on('change:options', () => changeOptionsCounter++);
    let changeVisibleCounter = 0;
    s.on('change:visible', () => changeVisibleCounter++);
    assert.ok(s.visible, 'visible');
    assert.ok(s.options.diagram.visible, 'visible');
    assert.ok(s.options.windprofile.visible, 'visible');
    assert.ok(s.options.hodograph.visible, 'visible');
    s.update({
      windprofile: {
        visible: false
      },
      hodograph: {
        visible: false
      }
    });
    assert.ok(s.visible, 'visible');
    assert.ok(s.options.diagram.visible, 'visible');
    assert.ok(!s.options.windprofile.visible, 'visible');
    assert.ok(!s.options.hodograph.visible, 'visible');
    assert.equal(changeOptionsCounter, 1, 'changeOptionsCounter');
    assert.equal(changeVisibleCounter, 0, 'changeVisibleCounter');
    s.update({
      visible: false
    });
    assert.ok(!s.visible, 'visible');
    assert.ok(s.options.diagram.visible, 'visible');
    assert.ok(!s.options.windprofile.visible, 'visible');
    assert.ok(!s.options.hodograph.visible, 'visible');
    assert.equal(changeOptionsCounter, 1, 'changeOptionsCounter');
    assert.equal(changeVisibleCounter, 1, 'changeVisibleCounter');
    s.update({
      diagram: {
        temp: {
          style: { color: 'red' }
        },
        dewp: {
          style: { color: 'blue' }
        }
      },
      windprofile: {
        visible: true,
        windbarbs: {
          style: { color: 'yellow' }
        },
        windspeed: {
          style: { color: 'gray' }
        }
      },
      hodograph: {
        visible: true,
        style: { color: 'green' }
      }
    });
    assert.ok(!s.visible, 'visible');
    assert.ok(s.options.diagram.visible, 'visible');
    assert.ok(s.options.windprofile.visible, 'visible');
    assert.ok(s.options.hodograph.visible, 'visible');
    assert.equal(s.options.diagram.temp.style.color, 'red', 'color');
    assert.equal(s.options.diagram.temp.style.width, '1', 'width');
    assert.equal(s.options.diagram.dewp.style.color, 'blue', 'color');
    assert.equal(s.options.diagram.dewp.style.width, '1', 'width');
    assert.equal(s.options.windprofile.windbarbs.style.color, 'yellow', 'color');
    assert.equal(s.options.windprofile.windbarbs.style.width, '1', 'width');
    assert.equal(s.options.windprofile.windspeed.style.color, 'gray', 'color');
    assert.equal(s.options.windprofile.windspeed.style.width, '1', 'width');
    assert.equal(s.options.hodograph.style.color, 'green', 'color');
    assert.equal(s.options.hodograph.style.width, '1', 'width');
    assert.equal(changeOptionsCounter, 2, 'changeOptionsCounter');
    assert.equal(changeVisibleCounter, 1, 'changeVisibleCounter');
    s.visible = true;
    assert.ok(s.visible, 'visible');
    assert.equal(changeOptionsCounter, 2, 'changeOptionsCounter');
    assert.equal(changeVisibleCounter, 2, 'changeVisibleCounter');
  });
});
describe('DiagramSounding class, import via name', () => {
  it('empty object', () => {
    let s = new DiagramSoundingClass();
    assert.ok(s.sounding === undefined, 'sounding');
    assert.ok(s.visible, 'visible');
  });
});