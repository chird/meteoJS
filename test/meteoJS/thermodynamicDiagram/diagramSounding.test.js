import assert from 'assert';
import Sounding from '../../../src/meteoJS/Sounding.js';
import Parcel from '../../../src/meteoJS/sounding/Parcel.js';
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
    ['diagram', 'windprofile', 'hodograph', 'parcels'].forEach(key => {
      assert.ok(key in s.options, key);
      assert.ok('visible' in s.options[key], 'visible');
      assert.ok(s.options[key].visible, 'visible default');
    });
    assert.ok('temp' in s.options.diagram, 'temp');
    assert.ok('dewp' in s.options.diagram, 'dewp');
    assert.ok('wetbulb' in s.options.diagram, 'wetbulb');
    assert.ok('windbarbs' in s.options.windprofile, 'windbarbs');
    assert.ok('windspeed' in s.options.windprofile, 'windspeed');
    [['diagram', ['temp', 'dewp', 'wetbulb']],
     ['windprofile', ['windbarbs', 'windspeed']]].forEach(tests => {
      tests[1].forEach(key => {
        assert.ok(key in s.options[tests[0]], key);
        assert.ok('visible' in s.options[tests[0]][key], 'visible');
        assert.ok(s.options[tests[0]][key].visible, 'visible default');
        assert.ok('style' in s.options[tests[0]][key], 'style');
        assert.ok(Object.keys(s.options[tests[0]][key].style).length > 1, 'style');
      });
    });
    assert.ok('style' in s.options.hodograph, 'style');
    assert.ok(Object.keys(s.options.hodograph.style).length > 1, 'style');
    assert.equal(s.options.hodograph.minPressure, undefined, 'hodograph.minPressure');
    assert.equal(s.options.hodograph.maxPressure, undefined, 'hodograph.maxPressure');
    assert.ok(s.options.hodograph.segments instanceof Array, 'hodograph.segments');
    assert.equal(s.options.hodograph.segments.length, 0, 'hodograph.segments');
    assert.equal(Object.keys(s.options.parcels).length, 2, 'length parcels options');
    assert.ok('default' in s.options.parcels, 'default');
    assert.equal(Object.keys(s.options.parcels.default).length, 3, 'length default options');
    assert.ok(!s.options.parcels.default.visible, 'default.visible');
    assert.ok('temp' in s.options.parcels.default, 'temp');
    assert.ok('dewp' in s.options.parcels.default, 'dewp');
    ['temp', 'dewp'].forEach(key => {
      assert.ok(s.options.parcels.default[key].visible, `default.${key}.visible`);
      assert.ok('style' in s.options.parcels.default[key], `default.${key}.style`);
      assert.ok(Object.keys(s.options.parcels.default[key].style).length > 1, 'style');
    });
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
        },
        minPressure: 300,
        maxPressure: 900,
        segments: [{
          visible: false,
          minPressure: 500,
          maxPressure: 800,
          style: {
            color: 'red',
            width: 3
          }
        }]
      },
      parcels: {
        default: {
          visible: false,
          temp: {
            style: {
              color: 'gray'
            }
          }
        },
        mupcl: {
          visible: true
        }
      }
    });
    ['diagram', 'windprofile', 'hodograph', 'parcels'].forEach(key => {
      assert.ok(key in s.options, key);
      assert.ok('visible' in s.options[key], 'visible');
      assert.ok(s.options[key].visible == (key != 'windprofile'), 'visible default');
    });
    assert.ok('temp' in s.options.diagram, 'temp');
    assert.ok('dewp' in s.options.diagram, 'dewp');
    assert.ok('wetbulb' in s.options.diagram, 'wetbulb');
    assert.ok('windbarbs' in s.options.windprofile, 'windbarbs');
    assert.ok('windspeed' in s.options.windprofile, 'windspeed');
    [['diagram', ['temp', 'dewp', 'wetbulb']],
     ['windprofile', ['windbarbs', 'windspeed']]].forEach(tests => {
      tests[1].forEach(key => {
        assert.ok(key in s.options[tests[0]], key);
        assert.ok('visible' in s.options[tests[0]][key], 'visible');
        assert.ok(s.options[tests[0]][key].visible, 'visible default');
        assert.ok('style' in s.options[tests[0]][key], 'style');
        if (tests[0] == 'diagram' && key != 'wetbulb') {
          assert.equal(Object.keys(s.options[tests[0]][key].style).length, 3, 'style');
          assert.equal(s.options[tests[0]][key].style.color, 'red', 'color');
          assert.equal(s.options[tests[0]][key].style.width, 3, 'width');
          assert.equal(s.options[tests[0]][key].style.linecap, 'round', 'linecap');
        }
        else if (tests[0] == 'diagram' && key == 'wetbulb') {
          assert.equal(Object.keys(s.options[tests[0]][key].style).length, 3, 'style');
          assert.equal(s.options[tests[0]][key].style.color, 'green', 'color');
          assert.equal(s.options[tests[0]][key].style.width, 2, 'width');
          assert.equal(s.options[tests[0]][key].style.linecap, 'round', 'linecap');
        }
        else {
          assert.equal(Object.keys(s.options[tests[0]][key].style).length, 2, 'style');
          assert.equal(s.options[tests[0]][key].style.color, 'black', 'color');
          assert.equal(s.options[tests[0]][key].style.width, 1, 'width');
        }
      });
    });
    assert.ok('style' in s.options.hodograph, 'style');
    assert.equal(Object.keys(s.options.hodograph.style).length, 2, 'length');
    assert.equal(s.options.hodograph.minPressure, 300, 'hodograph.minPressure');
    assert.equal(s.options.hodograph.maxPressure, 900, 'hodograph.maxPressure');
    assert.equal(s.options.hodograph.style.color, 'black', 'color');
    assert.equal(s.options.hodograph.style.width, 2, 'width');
    assert.ok(s.options.hodograph.segments instanceof Array, 'hodograph.segments');
    assert.equal(s.options.hodograph.segments.length, 1, 'hodograph.segments');
    assert.equal(s.options.hodograph.segments[0].minPressure, 500, 'hodograph.segments[0].minPressure');
    assert.equal(s.options.hodograph.segments[0].maxPressure, 800, 'hodograph.segments[0].maxPressure');
    assert.equal(s.options.hodograph.segments[0].visible, false, 'hodograph.segments[0].visible');
    assert.equal(Object.keys(s.options.hodograph.segments[0].style).length, 2, 'keys hodograph.segments[0].style');
    assert.equal(s.options.hodograph.segments[0].style.color, 'red', 'hodograph.segments[0].style.color');
    assert.equal(s.options.hodograph.segments[0].style.width, 3, 'hodograph.segments[0].style.width');
    assert.equal(Object.keys(s.options.parcels).length, 3, 'length parcels options');
    assert.ok(!s.options.parcels.default.visible, 'default.visible');
    assert.equal(Object.keys(s.options.parcels.default).length, 3, 'length default parcels options');
    assert.equal(s.options.parcels.default.temp.style.color, 'gray', 'default temp color');
    assert.equal(Object.keys(s.options.parcels.mupcl).length, 1, 'mupcl length');
    assert.ok(s.options.parcels.mupcl.visible, 'mupcl.visible');
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
      },
      parcels: {
        visible: false
      }
    });
    assert.ok(s.visible, 'visible');
    assert.ok(s.options.diagram.visible, 'visible');
    assert.ok(!s.options.windprofile.visible, 'visible');
    assert.ok(!s.options.hodograph.visible, 'visible');
    assert.ok(!s.options.parcels.visible, 'visible');
    assert.equal(changeOptionsCounter, 1, 'changeOptionsCounter');
    assert.equal(changeVisibleCounter, 0, 'changeVisibleCounter');
    s.update({
      visible: false
    });
    assert.ok(!s.visible, 'visible');
    assert.ok(s.options.diagram.visible, 'visible');
    assert.ok(!s.options.windprofile.visible, 'visible');
    assert.ok(!s.options.hodograph.visible, 'visible');
    assert.ok(!s.options.parcels.visible, 'visible');
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
        style: { color: 'green' },
        minPressure: 200,
        segments: [{
          minPressure: 300,
          maxPressure: 500,
          style: {
            color: 'orange'
          }
        }, {
          minPressure: 500,
          maxPressure: 700,
          style: {
            color: 'pink'
          }
        }]
      },
      parcels: {
        visible: true,
        default: {
          visible: false,
          temp: {
            style: {
              color: 'gray'
            }
          },
          dewp: {
            visible: false
          }
        },
        mupcl: {
          visible: true
        }
      }
    });
    assert.ok(!s.visible, 'visible');
    assert.ok(s.options.diagram.visible, 'visible');
    assert.ok(s.options.windprofile.visible, 'visible');
    assert.ok(s.options.hodograph.visible, 'visible');
    assert.ok(s.options.parcels.visible, 'visible');
    assert.equal(s.options.diagram.temp.style.color, 'red', 'color');
    assert.equal(s.options.diagram.temp.style.width, '3', 'width');
    assert.equal(s.options.diagram.dewp.style.color, 'blue', 'color');
    assert.equal(s.options.diagram.dewp.style.width, '3', 'width');
    assert.equal(s.options.diagram.wetbulb.style.color, 'green', 'color');
    assert.equal(s.options.diagram.wetbulb.style.width, '2', 'width');
    assert.equal(s.options.windprofile.windbarbs.style.color, 'yellow', 'color');
    assert.equal(s.options.windprofile.windbarbs.style.width, '1', 'width');
    assert.equal(s.options.windprofile.windspeed.style.color, 'gray', 'color');
    assert.equal(s.options.windprofile.windspeed.style.width, '1', 'width');
    assert.equal(s.options.hodograph.style.color, 'green', 'color');
    assert.equal(s.options.hodograph.style.width, '1', 'width');
    assert.equal(s.options.hodograph.minPressure, 200, 'hodograph.minPressure');
    assert.equal(s.options.hodograph.maxPressure, undefined, 'hodograph.maxPressure');
    assert.ok(s.options.hodograph.segments instanceof Array, 'hodograph.segments');
    assert.equal(s.options.hodograph.segments.length, 2, 'hodograph.segments');
    assert.equal(s.options.hodograph.segments[0].minPressure, 300, 'hodograph.segments[0].minPressure');
    assert.equal(s.options.hodograph.segments[0].maxPressure, 500, 'hodograph.segments[0].maxPressure');
    assert.equal(s.options.hodograph.segments[0].visible, true, 'hodograph.segments[0].visible');
    assert.equal(Object.keys(s.options.hodograph.segments[0].style).length, 2, 'keys hodograph.segments[0].style');
    assert.equal(s.options.hodograph.segments[0].style.color, 'orange', 'hodograph.segments[0].style.color');
    assert.equal(s.options.hodograph.segments[0].style.width, 1, 'hodograph.segments[0].style.width');
    assert.ok(!s.options.parcels.default.visible, 'visible');
    assert.equal(s.options.parcels.default.temp.style.color, 'gray', 'color');
    assert.ok(!s.options.parcels.default.dewp.visible, 'visible');
    assert.equal(Object.keys(s.options.parcels.mupcl).length, 1, 'mupcl length');
    assert.ok(s.options.parcels.mupcl.visible, 'mucpl');
    assert.equal(changeOptionsCounter, 2, 'changeOptionsCounter');
    assert.equal(changeVisibleCounter, 1, 'changeVisibleCounter');
    s.visible = true;
    assert.ok(s.visible, 'visible');
    assert.equal(changeOptionsCounter, 2, 'changeOptionsCounter');
    assert.equal(changeVisibleCounter, 2, 'changeVisibleCounter');
    s.update({
      hodograph: {
        segments: [{
          minPressure: 850,
          maxPressure: 1000,
          style: {
            color: 'violet'
          }
        }]
      }
    });
    assert.equal(s.options.hodograph.style.color, 'green', 'color');
    assert.equal(s.options.hodograph.style.width, '1', 'width');
    assert.equal(s.options.hodograph.minPressure, 200, 'hodograph.minPressure');
    assert.equal(s.options.hodograph.maxPressure, undefined, 'hodograph.maxPressure');
    assert.ok(s.options.hodograph.segments instanceof Array, 'hodograph.segments');
    assert.equal(s.options.hodograph.segments.length, 1, 'hodograph.segments');
    assert.equal(s.options.hodograph.segments[0].minPressure, 850, 'hodograph.segments[0].minPressure');
    assert.equal(s.options.hodograph.segments[0].maxPressure, 1000, 'hodograph.segments[0].maxPressure');
    assert.equal(s.options.hodograph.segments[0].visible, true, 'hodograph.segments[0].visible');
    assert.equal(Object.keys(s.options.hodograph.segments[0].style).length, 2, 'keys hodograph.segments[0].style');
    assert.equal(s.options.hodograph.segments[0].style.color, 'violet', 'hodograph.segments[0].style.color');
    assert.equal(s.options.hodograph.segments[0].style.width, 1, 'hodograph.segments[0].style.width');
    s.update({
      hodograph: {
        minPressure: undefined,
        maxPressure: undefined
      }
    });
    assert.equal(s.options.hodograph.style.color, 'green', 'color');
    assert.equal(s.options.hodograph.style.width, '1', 'width');
    assert.equal(s.options.hodograph.minPressure, undefined, 'hodograph.minPressure');
    assert.equal(s.options.hodograph.maxPressure, undefined, 'hodograph.maxPressure');
    assert.ok(s.options.hodograph.segments instanceof Array, 'hodograph.segments');
    assert.equal(s.options.hodograph.segments.length, 1, 'hodograph.segments');
    assert.equal(s.options.hodograph.segments[0].minPressure, 850, 'hodograph.segments[0].minPressure');
    assert.equal(s.options.hodograph.segments[0].maxPressure, 1000, 'hodograph.segments[0].maxPressure');
    assert.equal(s.options.hodograph.segments[0].visible, true, 'hodograph.segments[0].visible');
    assert.equal(Object.keys(s.options.hodograph.segments[0].style).length, 2, 'keys hodograph.segments[0].style');
    assert.equal(s.options.hodograph.segments[0].style.color, 'violet', 'hodograph.segments[0].style.color');
    assert.equal(s.options.hodograph.segments[0].style.width, 1, 'hodograph.segments[0].style.width');
  });
  it('getParcelOptions()', () => {
    const sounding = new Sounding();
    const s = new DiagramSounding(sounding);
    const defaultOptions = s.getParcelOptions();
    assert.equal(Object.keys(defaultOptions).length, 3, 'default length');
    assert.ok(!defaultOptions.visible, 'visible');
    assert.equal(Object.keys(defaultOptions.temp).length, 2, 'default temp length');
    assert.ok(defaultOptions.temp.visible, 'visible');
    assert.equal(Object.keys(defaultOptions.temp.style).length, 3, 'default temp style length');
    assert.equal(defaultOptions.temp.style.color, 'rgb(255, 153, 0)', 'color');
    assert.equal(defaultOptions.temp.style.width, 3, 'width');
    assert.equal(Object.keys(defaultOptions.dewp).length, 2, 'default dewp length');
    assert.ok(defaultOptions.dewp.visible, 'visible');
    assert.equal(Object.keys(defaultOptions.dewp.style).length, 3, 'default dewp style length');
    assert.equal(defaultOptions.dewp.style.color, 'rgb(255, 194, 102)', 'color');
    assert.equal(defaultOptions.dewp.style.width, 3, 'width');
    
    const p = new Parcel({ id: 'mupcl' });
    s.sounding.parcelCollection.append(p);
    const defaultOptions2 = s.getParcelOptions(p);
    assert.equal(Object.keys(defaultOptions2).length, 3, 'default length');
    assert.ok(!defaultOptions2.visible, 'visible');
    assert.equal(Object.keys(defaultOptions2.temp).length, 2, 'default temp length');
    assert.ok(defaultOptions2.temp.visible, 'visible');
    assert.equal(Object.keys(defaultOptions2.temp.style).length, 3, 'default temp style length');
    assert.equal(defaultOptions2.temp.style.color, 'rgb(255, 153, 0)', 'color');
    assert.equal(defaultOptions2.temp.style.width, 3, 'width');
    assert.equal(Object.keys(defaultOptions2.dewp).length, 2, 'default dewp length');
    assert.ok(defaultOptions2.dewp.visible, 'visible');
    assert.equal(Object.keys(defaultOptions2.dewp.style).length, 3, 'default dewp style length');
    assert.equal(defaultOptions2.dewp.style.color, 'rgb(255, 194, 102)', 'color');
    assert.equal(defaultOptions2.dewp.style.width, 3, 'width');
    
    s.update({
      parcels: {
        mupcl: {
          visible: true,
          temp: {
            style: {
              color: 'red',
              width: 3
            }
          },
          dewp: {
            visible: false
          }
        }
      }
    });
    const mupclOptions = s.getParcelOptions(p);
    assert.equal(Object.keys(mupclOptions).length, 3, 'default length');
    assert.ok(mupclOptions.visible, 'visible');
    assert.equal(Object.keys(mupclOptions.temp).length, 2, 'default temp length');
    assert.ok(mupclOptions.temp.visible, 'visible');
    assert.equal(Object.keys(mupclOptions.temp.style).length, 3, 'default temp style length');
    assert.equal(mupclOptions.temp.style.color, 'red', 'color');
    assert.equal(mupclOptions.temp.style.width, 3, 'width');
    assert.equal(Object.keys(mupclOptions.dewp).length, 2, 'default dewp length');
    assert.ok(!mupclOptions.dewp.visible, 'visible');
    assert.equal(Object.keys(mupclOptions.dewp.style).length, 3, 'default dewp style length');
    assert.equal(mupclOptions.dewp.style.color, 'rgb(255, 194, 102)', 'color');
    assert.equal(mupclOptions.dewp.style.width, 3, 'width');
  });
  it('diagramParcelCollection', () => {
    const s = new Sounding();
    const dp = new DiagramSounding(s);
    assert.equal(dp.diagramParcelCollection.count, 0, 'collection count');
    const p = new Parcel();
    s.parcelCollection.append(p);
    assert.equal(dp.diagramParcelCollection.count, 1, 'collection count');
    for (let diagramParcel of dp.diagramParcelCollection) {
      assert.ok(!diagramParcel.visible, 'visible');
      assert.ok(diagramParcel.options.temp.visible, 'temp visible');
      assert.equal(diagramParcel.options.temp.style.color, 'rgb(255, 153, 0)', 'temp color');
      assert.ok(diagramParcel.options.dewp.visible, 'dewp visible');
      assert.equal(diagramParcel.options.dewp.style.color, 'rgb(255, 194, 102)', 'dewp color');
      break;
    }
    s.parcelCollection.remove(p);
    assert.equal(dp.diagramParcelCollection.count, 0, 'collection count');
    const s1 = new Sounding();
    const p1 = new Parcel({ id: 'mlcape' });
    const p2 = new Parcel({ id: 'mucape' });
    s1.parcelCollection.append(p1).append(p2);
    assert.equal(s1.parcelCollection.count, 2, 'collection count');
    const dp1 = new DiagramSounding(s1, {
      parcels: {
        default: {
          visible: true,
          temp: {
            style: {
              color: 'gray'
            }
          }
        },
        mlcape: {
          temp: {
            style: {
              color: 'red'
            }
          }
        },
        mucape: {
          visible: false
        }
      }
    });
    assert.equal(dp1.diagramParcelCollection.count, 2, 'collection count');
    assert.ok(dp1.diagramParcelCollection.getItemById('mlcape') !== undefined, 'mlcape');
    assert.ok(dp1.diagramParcelCollection.getItemById('mlcape').visible, 'mlcape visible');
    assert.ok(dp1.diagramParcelCollection.getItemById('mlcape').options.temp.visible, 'mlcape temp visible');
    assert.equal(dp1.diagramParcelCollection.getItemById('mlcape').options.temp.style.color, 'red', 'mlcape temp color');
    assert.ok(dp1.diagramParcelCollection.getItemById('mlcape').options.dewp.visible, 'mlcape dewp visible');
    assert.equal(dp1.diagramParcelCollection.getItemById('mlcape').options.dewp.style.color, 'rgb(255, 194, 102)', 'mlcape dewp color');
    assert.ok(dp1.diagramParcelCollection.getItemById('mucape') !== undefined, 'mucape');
    assert.ok(!dp1.diagramParcelCollection.getItemById('mucape').visible, 'mucape visible');
    assert.ok(dp1.diagramParcelCollection.getItemById('mucape').options.temp.visible, 'mucape temp visible');
    assert.equal(dp1.diagramParcelCollection.getItemById('mucape').options.temp.style.color, 'gray', 'mucape temp color');
    assert.ok(dp1.diagramParcelCollection.getItemById('mucape').options.dewp.visible, 'mucape dewp visible');
    assert.equal(dp1.diagramParcelCollection.getItemById('mucape').options.dewp.style.color, 'rgb(255, 194, 102)', 'mucape dewp color');
    let MLOnChangeVisibleCounter = 0;
    dp1.diagramParcelCollection.getItemById('mlcape').on('change:visible', () => MLOnChangeVisibleCounter++);
    let MLOnChangeOptionsCounter = 0;
    dp1.diagramParcelCollection.getItemById('mlcape').on('change:options', () => MLOnChangeOptionsCounter++);
    let MUOnChangeVisibleCounter = 0;
    dp1.diagramParcelCollection.getItemById('mucape').on('change:visible', () => MUOnChangeVisibleCounter++);
    let MUOnChangeOptionsCounter = 0;
    dp1.diagramParcelCollection.getItemById('mucape').on('change:options', () => MUOnChangeOptionsCounter++);
    let DiagramChangeOptions = 0;
    dp1.on('change:options', () => DiagramChangeOptions++);
    dp1.diagramParcelCollection.getItemById('mlcape').visible = false;
    dp1.diagramParcelCollection.getItemById('mucape').visible = true;
    assert.ok(!dp1.diagramParcelCollection.getItemById('mlcape').visible, 'mlcape visible');
    assert.ok(dp1.diagramParcelCollection.getItemById('mucape').visible, 'mucape visible');
    assert.equal(MLOnChangeVisibleCounter, 1, 'MLOnChangeVisibleCounter');
    assert.equal(MLOnChangeOptionsCounter, 0, 'MLOnChangeOptionsCounter');
    assert.equal(MUOnChangeVisibleCounter, 1, 'MUOnChangeVisibleCounter');
    assert.equal(MUOnChangeOptionsCounter, 0, 'MUOnChangeOptionsCounter');
    assert.equal(DiagramChangeOptions, 0, 'DiagramChangeOptions');
    dp1.update({
      parcels: {
        default: {
          visible: false
        }
      }
    });
    assert.ok(!dp1.diagramParcelCollection.getItemById('mlcape').visible, 'mlcape visible');
    assert.ok(dp1.diagramParcelCollection.getItemById('mucape').visible, 'mucape visible');
    assert.equal(MLOnChangeVisibleCounter, 1, 'MLOnChangeVisibleCounter');
    assert.equal(MLOnChangeOptionsCounter, 0, 'MLOnChangeOptionsCounter');
    assert.equal(MUOnChangeVisibleCounter, 1, 'MUOnChangeVisibleCounter');
    assert.equal(MUOnChangeOptionsCounter, 0, 'MUOnChangeOptionsCounter');
    assert.equal(DiagramChangeOptions, 0, 'DiagramChangeOptions');
    dp1.update({
      parcels: {
        mlcape: {
          visible: true,
          temp: {
            style: {
              color: 'black'
            }
          }
        },
        mucape: {
          visible: false,
          temp: {
            style: {
              color: 'orange'
            }
          }
        }
      }
    });
    assert.ok(dp1.diagramParcelCollection.getItemById('mlcape').visible, 'mlcape visible');
    assert.ok(!dp1.diagramParcelCollection.getItemById('mucape').visible, 'mucape visible');
    assert.equal(dp1.diagramParcelCollection.getItemById('mlcape').options.temp.style.color, 'black', 'mlcape temp color');
    assert.equal(dp1.diagramParcelCollection.getItemById('mucape').options.temp.style.color, 'orange', 'mucape temp color');
    assert.equal(MLOnChangeVisibleCounter, 2, 'MLOnChangeVisibleCounter');
    assert.equal(MLOnChangeOptionsCounter, 1, 'MLOnChangeOptionsCounter');
    assert.equal(MUOnChangeVisibleCounter, 2, 'MUOnChangeVisibleCounter');
    assert.equal(MUOnChangeOptionsCounter, 1, 'MUOnChangeOptionsCounter');
    assert.equal(DiagramChangeOptions, 0, 'DiagramChangeOptions');
    dp1.diagramParcelCollection.getItemById('mlcape').update({
      temp: {
        style: {
          color: 'green'
        }
      }
    });
    dp1.diagramParcelCollection.getItemById('mucape').update({
      temp: {
        style: {
          color: 'pink'
        }
      }
    });
    assert.ok(dp1.diagramParcelCollection.getItemById('mlcape').visible, 'mlcape visible');
    assert.ok(!dp1.diagramParcelCollection.getItemById('mucape').visible, 'mucape visible');
    assert.equal(dp1.diagramParcelCollection.getItemById('mlcape').options.temp.style.color, 'green', 'mlcape temp color');
    assert.equal(dp1.diagramParcelCollection.getItemById('mucape').options.temp.style.color, 'pink', 'mucape temp color');
    assert.equal(MLOnChangeVisibleCounter, 2, 'MLOnChangeVisibleCounter');
    assert.equal(MLOnChangeOptionsCounter, 2, 'MLOnChangeOptionsCounter');
    assert.equal(MUOnChangeVisibleCounter, 2, 'MUOnChangeVisibleCounter');
    assert.equal(MUOnChangeOptionsCounter, 2, 'MUOnChangeOptionsCounter');
    assert.equal(DiagramChangeOptions, 0, 'DiagramChangeOptions');
    dp1.update({
      parcels: {
        default: {
          temp: {
            style: {
              color: 'black'
            }
          }
        }
      }
    });
    assert.ok(dp1.diagramParcelCollection.getItemById('mlcape').visible, 'mlcape visible');
    assert.ok(!dp1.diagramParcelCollection.getItemById('mucape').visible, 'mucape visible');
    assert.equal(dp1.diagramParcelCollection.getItemById('mlcape').options.temp.style.color, 'green', 'mlcape temp color');
    assert.equal(dp1.diagramParcelCollection.getItemById('mucape').options.temp.style.color, 'pink', 'mucape temp color');
    assert.equal(MLOnChangeVisibleCounter, 2, 'MLOnChangeVisibleCounter');
    assert.equal(MLOnChangeOptionsCounter, 2, 'MLOnChangeOptionsCounter');
    assert.equal(MUOnChangeVisibleCounter, 2, 'MUOnChangeVisibleCounter');
    assert.equal(MUOnChangeOptionsCounter, 2, 'MUOnChangeOptionsCounter');
    assert.equal(DiagramChangeOptions, 0, 'DiagramChangeOptions');
    const p3 = new Parcel({ id: 'sfccape' });
    s1.parcelCollection.append(p3);
    assert.equal(dp1.diagramParcelCollection.count, 3, 'collection count');
    assert.ok(dp1.diagramParcelCollection.getItemById('sfccape') !== undefined, 'sfccape');
    assert.ok(!dp1.diagramParcelCollection.getItemById('sfccape').visible, 'sfccape visible');
    assert.ok(dp1.diagramParcelCollection.getItemById('sfccape').options.temp.visible, 'sfccape temp visible');
    assert.equal(dp1.diagramParcelCollection.getItemById('sfccape').options.temp.style.color, 'black', 'sfccape temp color');
    assert.ok(dp1.diagramParcelCollection.getItemById('sfccape').options.dewp.visible, 'sfccape dewp visible');
    assert.equal(dp1.diagramParcelCollection.getItemById('sfccape').options.dewp.style.color, 'rgb(255, 194, 102)', 'sfccape dewp color');
    
    const p4 = new Parcel({ id: 'fcstcape' });
    const dp4 = dp1.addParcel(p4);
    assert.equal(dp1.diagramParcelCollection.count, 4, 'collection count');
    assert.ok(dp1.diagramParcelCollection.getItemById('fcstcape') !== undefined, 'fcstcape');
    assert.ok(!dp4.visible, 'fcstcape visible');
    assert.ok(dp4.options.temp.visible, 'fcstcape temp visible');
    assert.equal(dp4.options.temp.style.color, 'black', 'fcstcape temp color');
    assert.ok(dp4.options.dewp.visible, 'fcstcape dewp visible');
    assert.equal(dp4.options.dewp.style.color, 'rgb(255, 194, 102)', 'fcstcape dewp color');
    const p5 = new Parcel({ id: 'user' });
    const dp5 = dp1.addParcel(p5, {
      visible: true,
      temp: {
        visible: false,
        style: {
          color: 'yellow'
        }
      },
      dewp: {
        style: {
          color: 'rose'
        }
      }
    });
    assert.equal(dp1.diagramParcelCollection.count, 5, 'collection count');
    assert.ok(dp1.diagramParcelCollection.getItemById('user') !== undefined, 'user');
    assert.ok(dp5.visible, 'user visible');
    assert.ok(!dp5.options.temp.visible, 'user temp visible');
    assert.equal(dp5.options.temp.style.color, 'yellow', 'user temp color');
    assert.ok(dp5.options.dewp.visible, 'user dewp visible');
    assert.equal(dp5.options.dewp.style.color, 'rose', 'user dewp color');
  });
});
describe('DiagramSounding class, import via name', () => {
  it('empty object', () => {
    let s = new DiagramSoundingClass();
    assert.ok(s.sounding === undefined, 'sounding');
    assert.ok(s.visible, 'visible');
  });
});