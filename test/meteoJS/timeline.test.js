import assert from 'assert';
import 'jsdom-global/register';
import { default as Timeline, _indexOfTimeInTimesArray, _isEventMatchPressedKeys }
  from '../../src/meteoJS/Timeline.js';
import { Timeline as TimelineClass } from '../../src/meteoJS/Timeline.js';

describe('helper functions', () => {
  it('_indexOfTimeInTimesArray', () => {
    assert.equal(_indexOfTimeInTimesArray(new Date(), []),
                 -1, 'Leerer Such-Array');
    assert.equal(_indexOfTimeInTimesArray(new Date('2016-01-10T10:00:00'),
                                                         [new Date('2016-06-10T10:00:00')]),
                 -1, '1 gefunden');
    assert.equal(_indexOfTimeInTimesArray(new Date('2016-01-10T10:00:00'),
                                                         [new Date('2016-01-10T10:00:00')]),
                 0, '0 gefunden');
    assert.equal(_indexOfTimeInTimesArray(new Date('2016-01-10T10:00:00'),
                                                         [new Date('2016-01-10T10:00:00'),
                                                          new Date('2016-06-10T10:00:00')]),
                 0, '0 gefunden');
    assert.equal(_indexOfTimeInTimesArray(new Date('2016-06-10T10:00:00'),
                                                         [new Date('2016-01-10T10:00:00'),
                                                          new Date('2016-06-10T10:00:00')]),
                 1, '0 gefunden');
  });
  it('_isEventMatchPressedKeys', () => {
    let testEvent = (event, { isSingle = false, isCtrl = false,
                              isCtrlAlt = false, isShift = false,
                              isMeta = false } = {}) => {
      assert.ok(!_isEventMatchPressedKeys(event, undefined), 'undefined');
      assert.ok(isSingle === _isEventMatchPressedKeys(event, 36), 'Home');
      assert.ok(isSingle === _isEventMatchPressedKeys(event, [36]), 'Home');
      assert.ok(isCtrl === _isEventMatchPressedKeys(event, [36, 'ctrl']), 'Home+Ctrl');
      assert.ok(isCtrlAlt === _isEventMatchPressedKeys(event, [36, 'ctrl', 'alt']), 'Home+Ctrl+Alt');
      assert.ok(isShift === _isEventMatchPressedKeys(event, [36, 'shift']), 'Home+Shift');
      assert.ok(isMeta === _isEventMatchPressedKeys(event, [36, 'meta']), 'Home+Meta');
      assert.ok(!_isEventMatchPressedKeys(event, [36, 38]), 'Two keys -> always false');
    };
    let event = {
      keyCode: 0,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false
    };
    testEvent(event);
    event.keyCode = 42;
    testEvent(event);
    event.keyCode = 36;
    testEvent(event, { isSingle: true });
    event.ctrlKey = true;
    testEvent(event, { isCtrl: true });
    event.altKey = true;
    testEvent(event, { isCtrlAlt: true });
    event.shiftKey = true;
    testEvent(event);
    event.ctrlKey = false;
    testEvent(event);
    event.altKey = false;
    testEvent(event, { isShift: true });
    event.metaKey = true;
    testEvent(event);
    event.shiftKey = false;
    testEvent(event, { isMeta: true });
  });
  it('keydown', () => {
    let tNoKeyEvents = new Timeline();
    let tDefaultKeyEvents = new Timeline({
      keyboardNavigation: {
        enabled: true
      }
    });
    let tChangedKeyEvents = new Timeline({
      keyboardNavigation: {
        enabled: true,
        prev: 80,
        next: 78,
        add: {
          '12h': [78, 'shift'],
          '24h': [78, 'ctrl']
        },
        sub: {
          '12h': [80, 'shift'],
          '24h': [80, 'ctrl']
        }
      }
    });
    let dates = [...Array(17).keys()].map(i => new Date(Date.UTC(2019, 9, 10, i*3)));
    tNoKeyEvents.setTimesBySetID('', dates).first();
    tDefaultKeyEvents.setTimesBySetID('', dates).first();
    tChangedKeyEvents.setTimesBySetID('', dates).first();
    let dispatchKeydown = ({
      keyCode = undefined,
      ctrlKey = false,
      altKey = false,
      shiftKey = false,
      metaKey = false
    } = {}) =>
      document
      .dispatchEvent(
        new KeyboardEvent('keydown',
                          { keyCode, ctrlKey, altKey, shiftKey, metaKey}));
    dispatchKeydown({ keyCode: 0 });
    assert.equal(tNoKeyEvents.getSelectedTime(), dates[0], 'No key events -> still first datetime');
    assert.equal(tDefaultKeyEvents.getSelectedTime(), dates[0], 'First datetime');
    assert.equal(tChangedKeyEvents.getSelectedTime(), dates[0], 'First datetime');
    dispatchKeydown({ keyCode: 39 });
    assert.equal(tDefaultKeyEvents.getSelectedTime(), dates[1], 'Second datetime');
    assert.equal(tChangedKeyEvents.getSelectedTime(), dates[0], 'Changed keys -> still first datetime');
    dispatchKeydown({ keyCode: 36 });
    assert.equal(tDefaultKeyEvents.getSelectedTime(), dates[0], 'First datetime');
    assert.equal(tChangedKeyEvents.getSelectedTime(), dates[0], 'First datetime');
    dispatchKeydown({ keyCode: 35 });
    assert.equal(tDefaultKeyEvents.getSelectedTime(), dates[16], 'Last datetime');
    assert.equal(tChangedKeyEvents.getSelectedTime(), dates[16], 'Last datetime');
    dispatchKeydown({ keyCode: 37, ctrlKey: true });
    assert.equal(tDefaultKeyEvents.getSelectedTime(), dates[15], 'Second last datetime');
    assert.equal(tChangedKeyEvents.getSelectedTime(), dates[15], 'Second last datetime');
    dispatchKeydown({ keyCode: 36, ctrlKey: true });
    assert.equal(tDefaultKeyEvents.getSelectedTime(), dates[15], 'Second last datetime');
    assert.equal(tChangedKeyEvents.getSelectedTime(), dates[15], 'Second last datetime');
    dispatchKeydown({ keyCode: 39, ctrlKey: true });
    assert.equal(tDefaultKeyEvents.getSelectedTime(), dates[16], 'Last datetime');
    assert.equal(tChangedKeyEvents.getSelectedTime(), dates[16], 'Last datetime');
    dispatchKeydown({ keyCode: 80 });
    dispatchKeydown({ keyCode: 80 });
    assert.equal(tDefaultKeyEvents.getSelectedTime(), dates[16], 'Last datetime');
    assert.equal(tChangedKeyEvents.getSelectedTime(), dates[14], 'Third last datetime');
    dispatchKeydown({ keyCode: 78 });
    assert.equal(tDefaultKeyEvents.getSelectedTime(), dates[16], 'Last datetime');
    assert.equal(tChangedKeyEvents.getSelectedTime(), dates[15], 'Second last datetime');
    assert.equal(tNoKeyEvents.getSelectedTime(), dates[0], 'No key events -> still first datetime');
    dispatchKeydown({ keyCode: 36 });
    assert.equal(tDefaultKeyEvents.getSelectedTime(), dates[0], 'First datetime');
    assert.equal(tChangedKeyEvents.getSelectedTime(), dates[0], 'First datetime');
    dispatchKeydown({ keyCode: 39, altKey: true });
    assert.equal(tDefaultKeyEvents.getSelectedTime().valueOf(), dates[8].valueOf(), '+24h datetime');
    assert.equal(tChangedKeyEvents.getSelectedTime(), dates[0], 'First datetime');
    dispatchKeydown({ keyCode: 78, ctrlKey: true });
    assert.equal(tDefaultKeyEvents.getSelectedTime().valueOf(), dates[8].valueOf(), '+24h datetime');
    assert.equal(tChangedKeyEvents.getSelectedTime().valueOf(), dates[8].valueOf(), '+24h datetime');
    dispatchKeydown({ keyCode: 39, ctrlKey: true, shiftKey: true });
    assert.equal(tDefaultKeyEvents.getSelectedTime().valueOf(), dates[9].valueOf(), '+27h datetime');
    assert.equal(tChangedKeyEvents.getSelectedTime().valueOf(), dates[8].valueOf(), '+24h datetime');
    dispatchKeydown({ keyCode: 37, altKey: true });
    assert.equal(tDefaultKeyEvents.getSelectedTime().valueOf(), dates[1].valueOf(), '+3h datetime');
    assert.equal(tChangedKeyEvents.getSelectedTime().valueOf(), dates[8].valueOf(), '+24h datetime');
    dispatchKeydown({ keyCode: 39, shiftKey: true, altKey: true });
    assert.equal(tDefaultKeyEvents.getSelectedTime().valueOf(), dates[5].valueOf(), '+15h datetime');
    assert.equal(tChangedKeyEvents.getSelectedTime().valueOf(), dates[8].valueOf(), '+24h datetime');
    dispatchKeydown({ keyCode: 78, shiftKey: true });
    assert.equal(tDefaultKeyEvents.getSelectedTime().valueOf(), dates[5].valueOf(), '+15h datetime');
    assert.equal(tChangedKeyEvents.getSelectedTime().valueOf(), dates[12].valueOf(), '+36h datetime');
    dispatchKeydown({ keyCode: 37, shiftKey: true });
    assert.equal(tDefaultKeyEvents.getSelectedTime().valueOf(), dates[3].valueOf(), '+9h datetime');
    assert.equal(tChangedKeyEvents.getSelectedTime().valueOf(), dates[12].valueOf(), '+36h datetime');
    dispatchKeydown({ keyCode: 80, shiftKey: true });
    assert.equal(tDefaultKeyEvents.getSelectedTime().valueOf(), dates[3].valueOf(), '+9h datetime');
    assert.equal(tChangedKeyEvents.getSelectedTime().valueOf(), dates[8].valueOf(), '+24h datetime');
    dispatchKeydown({ keyCode: 37, ctrlKey: true, shiftKey: true });
    assert.equal(tDefaultKeyEvents.getSelectedTime().valueOf(), dates[2].valueOf(), '+6h datetime');
    assert.equal(tChangedKeyEvents.getSelectedTime().valueOf(), dates[8].valueOf(), '+24h datetime');
    dispatchKeydown({ keyCode: 39, shiftKey: true });
    assert.equal(tDefaultKeyEvents.getSelectedTime().valueOf(), dates[4].valueOf(), '+12h datetime');
    assert.equal(tChangedKeyEvents.getSelectedTime().valueOf(), dates[8].valueOf(), '+24h datetime');
    dispatchKeydown({ keyCode: 37, shiftKey: true, altKey: true });
    assert.equal(tDefaultKeyEvents.getSelectedTime().valueOf(), dates[0].valueOf(), '+0h datetime');
    assert.equal(tChangedKeyEvents.getSelectedTime().valueOf(), dates[8].valueOf(), '+24h datetime');
  });
  it('keyboard for second navigation', () => {
    const timeline = new Timeline({
      keyboardNavigation: {
        enabled: true,
        add: {
          '100ms': [30],
          '500ms': [31]
        },
        sub: {
          '100ms': [40],
          '500ms': [41]
        }
      }
    });
    const dates = [...Array(17).keys()].map(i => new Date(Date.UTC(2020, 10, 19, 12, 0, 0, i*100)));
    timeline.setTimesBySetID('', dates).first();
    let dispatchKeydown = ({
      keyCode = undefined,
      ctrlKey = false,
      altKey = false,
      shiftKey = false,
      metaKey = false
    } = {}) =>
      document
      .dispatchEvent(
        new KeyboardEvent('keydown',
                          { keyCode, ctrlKey, altKey, shiftKey, metaKey}));
    assert.equal(timeline.getSelectedTime(), dates[0], '0ms');
    dispatchKeydown({ keyCode: 30 });
    assert.equal(timeline.getSelectedTime().valueOf(), dates[1].valueOf(), '100ms');
    dispatchKeydown({ keyCode: 31 });
    assert.equal(timeline.getSelectedTime().valueOf(), dates[6].valueOf(), '600ms');
    dispatchKeydown({ keyCode: 40 });
    assert.equal(timeline.getSelectedTime().valueOf(), dates[5].valueOf(), '500ms');
    dispatchKeydown({ keyCode: 41 });
    assert.equal(timeline.getSelectedTime().valueOf(), dates[0].valueOf(), '0ms');
  });
});
describe('Timeline class, import via default', () => {
  it ('Empty object', () => {
    let timeline = new Timeline();
    assert.equal(typeof(timeline), 'object', 'Construction');
    let t = timeline.getSelectedTime();
    assert.equal(typeof(t), 'object', 'Return object of getSelectedTime()');
    assert.ok(isNaN(t), 'invalid date');
    assert.ok(isNaN(timeline.setSelectedTime(new Date()).getSelectedTime()), 'invalid date');
    assert.equal(timeline.getTimes().length, 0, 'getTimes() leer');
    assert.equal(timeline.getEnabledTimes().length, 0, 'getEnabledTimes() leer');
    assert.equal(timeline.getAllEnabledTimes().length, 0, 'getAllEnabledTimes() leer');
    assert.equal(timeline.getSetIDs().length, 0, 'getSetIDs() leer');
    assert.ok(isNaN(timeline.getFirstEnabledTime()), 'getFirstEnabeldTime() returns invalid date');
    assert.ok(isNaN(timeline.getLastEnabledTime()), 'getLastEnabeldTime() returns invalid date');
    assert.ok(isNaN(timeline.getNextEnabledTime()), 'getNextEnabeldTime() returns invalid date');
    assert.ok(isNaN(timeline.getPrevEnabledTime()), 'getPrevEnabeldTime() returns invalid date');
    assert.ok(isNaN(timeline.next().getSelectedTime()), 'next() -> still invalid date');
    assert.ok(isNaN(timeline.prev().getSelectedTime()), 'prev() -> still invalid date');
    assert.ok(isNaN(timeline.first().getSelectedTime()), 'first() -> still invalid date');
    assert.ok(isNaN(timeline.last().getSelectedTime()), 'last() -> still invalid date');
    assert.ok(isNaN(timeline.add(3, 'hours').getSelectedTime()), 'add(3, \'hours\') -> invalid date');
    assert.ok(isNaN(timeline.sub(3, 'hours').getSelectedTime()), 'sub(3, \'hours\') -> invalid date');
    assert.ok(!timeline.isTimeEnabled(new Date('invalid')), 'invalid date not isTimeEnabled');
    assert.ok(!timeline.isTimeAllEnabled(new Date('invalid')), 'invalid date not isTimeAllEnabled');
    assert.ok(!timeline.isTimeEnabled(new Date()), 'now not isTimeEnabled');
    assert.ok(!timeline.isTimeAllEnabled(new Date()), 'now not isTimeAllEnabled');
  });
  it('Simple usecase', () => {
    let timeline = new Timeline();
    let times = [
      new Date('2018-06-11T12:00:00'),
      new Date('2018-06-11T12:05:00'),
      new Date('2018-06-11T12:10:00'),
      new Date('2018-06-11T12:15:00'),
      new Date('2018-06-11T12:20:00'),
      new Date('2018-06-11T12:25:00'),
      new Date('2018-06-11T12:30:00'),
      new Date('2018-06-11T12:35:00'),
      new Date('2018-06-11T12:40:00'),
      new Date('2018-06-11T12:45:00'),
      new Date('2018-06-11T12:50:00'),
      new Date('2018-06-11T12:55:00'),
      new Date('2018-06-11T13:00:00')
    ];
    timeline
      .setTimesBySetID('radar', times)
      .setTimesBySetID('satellite', [
        times[0],
        times[3],
        times[6],
        times[9],
        times[12]
      ]);
    assert.ok(isNaN(timeline.getSelectedTime()), 'invalid date');
    assert.equal(timeline.getTimes().length, 13, 'getTimes()');
    assert.equal(timeline.getEnabledTimes().length, 13, 'getEnabledTimes()');
    assert.equal(timeline.getAllEnabledTimes().length, 5, 'getAllEnabledTimes()');
    assert.equal(timeline.getSetIDs().length, 2, 'getSetIDs()');
    assert.equal(timeline.getFirstEnabledTime().valueOf(), times[0].valueOf(), 'getFirstEnabeldTime()');
    assert.equal(timeline.getLastEnabledTime().valueOf(), times[12].valueOf(), 'getLastEnabeldTime()');
    assert.equal(timeline.getNextEnabledTime().valueOf(), times[0].valueOf(), 'getNextEnabeldTime()');
    assert.equal(timeline.getPrevEnabledTime().valueOf(), times[0].valueOf(), 'getPrevEnabeldTime()');
    assert.equal(timeline.first().getSelectedTime().valueOf(), times[0].valueOf(), 'first()');
    assert.equal(timeline.last().getSelectedTime().valueOf(), times[12].valueOf(), 'last()');
    assert.equal(timeline.prev().getSelectedTime().valueOf(), times[11].valueOf(), 'prev()');
    assert.equal(timeline.first().next().next().getSelectedTime().valueOf(), times[2].valueOf(), 'next()');
    assert.ok(!timeline.isTimeEnabled(new Date('invalid')), 'invalid date not isTimeEnabled');
    assert.ok(!timeline.isTimeAllEnabled(new Date('invalid')), 'invalid date not isTimeAllEnabled');
    assert.ok(timeline.isTimeEnabled(times[0]), 'isTimeEnabled');
    assert.ok(timeline.isTimeAllEnabled(times[0]), 'isTimeAllEnabled');
    assert.ok(!timeline.isTimeEnabled(new Date('2018-07-11T13:00:00')), 'not isTimeEnabled');
    assert.ok(!timeline.isTimeAllEnabled(new Date('2018-07-11T13:00:00')), 'not isTimeAllEnabled');
  });
  it('Modelviewer usecase', () => {
    let timeline = new Timeline();
    let times = [
      new Date('2018-06-11T12:00:00'),
      new Date('2018-06-11T15:00:00'),
      new Date('2018-06-11T18:00:00'),
      new Date('2018-06-11T21:00:00'),
      new Date('2018-06-12T00:00:00'),
      new Date('2018-06-12T03:00:00'),
      new Date('2018-06-12T06:00:00'),
      new Date('2018-06-12T09:00:00'),
      new Date('2018-06-12T12:00:00'),
      new Date('2018-06-12T15:00:00'),
      new Date('2018-06-12T18:00:00'),
      new Date('2018-06-12T21:00:00'),
      new Date('2018-06-13T00:00:00')
    ];
    timeline
      .setTimesBySetID('GFS', times)
      .setEnabledTimesBySetID('GFS', [
        times[0],
        times[2],
        times[4],
        times[6],
        times[8],
        times[10],
        times[12]
      ]);
    assert.ok(isNaN(timeline.getSelectedTime()), 'invalid date');
    assert.equal(timeline.getTimes().length, 13, 'getTimes()');
    assert.equal(timeline.getEnabledTimes().length, 7, 'getEnabledTimes()');
    assert.equal(timeline.getAllEnabledTimes().length, 7, 'getAllEnabledTimes()');
    assert.equal(timeline.getSetIDs().length, 1, 'getSetIDs()');
    timeline
      .setTimesBySetID('ECMWF', times.slice(0,10))
      .setEnabledTimesBySetID('ECMWF', [
        times[0],
        times[4],
        times[8]
      ]);
    assert.ok(isNaN(timeline.getSelectedTime()), 'invalid date');
    assert.equal(timeline.getTimes().length, 13, 'getTimes()');
    assert.equal(timeline.getEnabledTimes().length, 7, 'getEnabledTimes()');
    assert.equal(timeline.getAllEnabledTimes().length, 3, 'getAllEnabledTimes()');
    assert.equal(timeline.getSetIDs().length, 2, 'getSetIDs()');
    assert.equal(timeline.getFirstEnabledTime().valueOf(), times[0].valueOf(), 'getFirstEnabeldTime()');
    assert.equal(timeline.getLastEnabledTime().valueOf(), times[12].valueOf(), 'getLastEnabeldTime()');
    assert.equal(timeline.getNextEnabledTime().valueOf(), times[0].valueOf(), 'getNextEnabeldTime()');
    assert.equal(timeline.getPrevEnabledTime().valueOf(), times[0].valueOf(), 'getPrevEnabeldTime()');
    assert.equal(timeline.getFirstAllEnabledTime().valueOf(), times[0].valueOf(), 'getFirstAllEnabeldTime()');
    assert.equal(timeline.getLastAllEnabledTime().valueOf(), times[8].valueOf(), 'getLastAllEnabeldTime()');
    assert.equal(timeline.getNextAllEnabledTime().valueOf(), times[0].valueOf(), 'getNextAllEnabeldTime()');
    assert.equal(timeline.getPrevAllEnabledTime().valueOf(), times[0].valueOf(), 'getPrevAllEnabeldTime()');
    assert.ok(!timeline.isTimeEnabled(new Date('invalid')), 'invalid date not isTimeEnabled');
    assert.ok(!timeline.isTimeAllEnabled(new Date('invalid')), 'invalid date not isTimeAllEnabled');
    assert.ok(timeline.isTimeEnabled(times[0]), 'isTimeEnabled');
    assert.ok(timeline.isTimeAllEnabled(times[0]), 'isTimeAllEnabled');
    assert.ok(timeline.isTimeEnabled(times[2]), 'isTimeEnabled');
    assert.ok(!timeline.isTimeAllEnabled(times[2]), 'not isTimeAllEnabled');
    assert.ok(!timeline.isTimeEnabled(new Date('2018-07-11T13:00:00')), 'not isTimeEnabled');
    assert.ok(!timeline.isTimeAllEnabled(new Date('2018-07-11T13:00:00')), 'not isTimeAllEnabled');
  });
  it('Adding/removing times', () => {
    let timeline = new Timeline();
    let times = [
      new Date('2016-01-01T00:00:00'),
      new Date('2016-01-02T00:00:00'),
      new Date('2016-01-03T00:00:00'),
      new Date('2016-01-04T00:00:00'),
      new Date('2016-01-05T00:00:00'),
      new Date('2016-01-06T00:00:00')
    ];
    timeline.setTimesBySetID('A', []);
    assert.equal(timeline.getTimes().length, 0, 'Leer: getTimes()=0');
    assert.equal(timeline.getEnabledTimes().length, 0, 'Leer: getEnabledTimes()=0');
    assert.equal(timeline.getAllEnabledTimes().length, 0, 'Leer: getAllEnabledTimes()=0');
    assert.equal(timeline.getSetIDs().length, 1, 'getSetIDs()');
    timeline.setTimesBySetID('A', [times[0], times[1]]);
    timeline.setTimesBySetID('B', [times[2], times[3]]);
    timeline.setTimesBySetID('C', [times[4], times[5]]);
    assert.equal(timeline.getTimes().length, 6, 'Nicht überlappend: getTimes()=6');
    assert.equal(timeline.getEnabledTimes().length, 6, 'Nicht überlappend: getEnabledTimes()=6');
    assert.equal(timeline.getAllEnabledTimes().length, 0, 'Nicht überlappend: getAllEnabledTimes()=0');
    assert.equal(timeline.getSetIDs().length, 3, 'getSetIDs()');
    
    timeline.setTimesBySetID('A', []);
    timeline.setTimesBySetID('B', []);
    timeline.setTimesBySetID('C', []);
    assert.equal(timeline.getTimes().length, 0, 'Geleert: getTimes()=0');
    assert.equal(timeline.getEnabledTimes().length, 0, 'Geleert: getEnabledTimes()=0');
    assert.equal(timeline.getAllEnabledTimes().length, 0, 'Geleert: getAllEnabledTimes()=0');
    assert.equal(timeline.getSetIDs().length, 3, 'getSetIDs()');
    timeline.setTimesBySetID('A', [times[0], times[1]]);
    timeline.setTimesBySetID('B', [times[0], times[1]]);
    timeline.setTimesBySetID('C', [times[0], times[1]]);
    assert.equal(timeline.getTimes().length, 2, 'Gleich: getTimes()=2');
    assert.equal(timeline.getEnabledTimes().length, 2, 'Gleich: getEnabledTimes()=2');
    assert.equal(timeline.getAllEnabledTimes().length, 2, 'Gleich: getAllEnabledTimes()=2');
    assert.equal(timeline.getSetIDs().length, 3, 'getSetIDs()');
    
    timeline.deleteSetID('A');
    timeline.deleteSetID('B');
    timeline.deleteSetID('C');
    assert.equal(timeline.getTimes().length, 0, 'Cleared: getTimes()=0');
    assert.equal(timeline.getEnabledTimes().length, 0, 'Cleared: getEnabledTimes()=0');
    assert.equal(timeline.getAllEnabledTimes().length, 0, 'Cleared: getAllEnabledTimes()=0');
    assert.equal(timeline.getSetIDs().length, 0, 'getSetIDs()');
    timeline.setTimesBySetID('A', [times[0], times[1]]);
    timeline.setTimesBySetID('B', [times[1], times[2]]);
    timeline.setTimesBySetID('C', [times[1], times[3]]);
    assert.equal(timeline.getTimes().length, 4, 'Überlappend: getTimes()=4');
    assert.equal(timeline.getEnabledTimes().length, 4, 'Überlappend: getEnabledTimes()=4');
    assert.equal(timeline.getAllEnabledTimes().length, 1, 'Überlappend: getAllEnabledTimes()=1');
    assert.equal(timeline.getSetIDs().length, 3, 'getSetIDs()');
    
    assert.ok(!timeline.isTimeEnabled(new Date('invalid')), 'invalid date not isTimeEnabled');
    assert.ok(!timeline.isTimeAllEnabled(new Date('invalid')), 'invalid date not isTimeAllEnabled');
    assert.ok(timeline.isTimeEnabled(times[0]), 'isTimeEnabled');
    assert.ok(!timeline.isTimeAllEnabled(times[0]), 'not isTimeAllEnabled');
    assert.ok(timeline.isTimeEnabled(times[1]), 'isTimeEnabled');
    assert.ok(timeline.isTimeAllEnabled(times[1]), 'isTimeAllEnabled');
    assert.ok(!timeline.isTimeEnabled(new Date('2018-07-11T13:00:00')), 'not isTimeEnabled');
    assert.ok(!timeline.isTimeAllEnabled(new Date('2018-07-11T13:00:00')), 'not isTimeAllEnabled');
  });
  it('maxTimeGap', () => {
    let timeline = new Timeline({
      maxTimeGap: 3600
    });
    timeline.setTimesBySetID('A', [
      new Date('2016-01-01T00:00:00'),
      new Date('2016-01-01T12:00:00')
    ]);
    assert.equal(timeline.getTimes().length, 13, 'getTimes() inkl. Zwischenschritte');
    assert.equal(timeline.getEnabledTimes().length, 2, '2 verfügbare Zeitschritte');
    assert.ok(!timeline.isTimeEnabled(new Date('invalid')), 'invalid date not isTimeEnabled');
    assert.ok(!timeline.isTimeAllEnabled(new Date('invalid')), 'invalid date not isTimeAllEnabled');
    assert.ok(timeline.isTimeEnabled(new Date('2016-01-01T00:00:00')), 'isTimeEnabled');
    assert.ok(timeline.isTimeAllEnabled(new Date('2016-01-01T00:00:00')), 'isTimeAllEnabled');
    assert.ok(!timeline.isTimeEnabled(new Date('2016-01-01T01:00:00')), 'not isTimeEnabled');
    assert.ok(!timeline.isTimeAllEnabled(new Date('2016-01-01T01:00:00')), 'not isTimeAllEnabled');
  });
  it('maxTimeGap: only 12z steps', () => {
    let timeline = new Timeline({
      maxTimeGap: 3*3600
    });
    timeline.setTimesBySetID('12z', [
      new Date('2017-02-06T12:00:00'),
      new Date('2017-02-07T12:00:00'),
      new Date('2017-02-08T12:00:00'),
      new Date('2017-02-09T12:00:00'),
      new Date('2017-02-10T12:00:00'),
      new Date('2017-02-11T12:00:00'),
      new Date('2017-02-12T12:00:00')
    ]);
    let times = timeline.getTimes();
    assert.equal(times.length, 49, 'Anzahl Zeitschritte');
    assert.equal(_indexOfTimeInTimesArray(new Date('2017-02-06T12:00:00'),
                                                         times),
                 0, '2017-02-06T12:00:00 gefunden');
    assert.equal(_indexOfTimeInTimesArray(new Date('2017-02-07T00:00:00'),
                                                         times),
                 4, '2017-02-07T00:00:00 gefunden');
    assert.equal(_indexOfTimeInTimesArray(new Date('2017-02-08T09:00:00'),
                                                         times),
                 15, '2017-02-08T09:00:00 gefunden');
    assert.equal(_indexOfTimeInTimesArray(new Date('2017-02-11T03:00:00'),
                                                         times),
                 37, '2017-02-11T03:00:00 gefunden');
  });
  it('next()/add()', () => {
    let timeline = new Timeline();
    let times = [
      new Date('2016-01-01T00:00:00'),
      new Date('2016-01-01T03:00:00'),
      new Date('2016-01-01T06:00:00'),
      new Date('2016-01-01T09:00:00'),
      new Date('2016-01-01T12:00:00'),
      new Date('2016-01-01T15:00:00'),
      new Date('2016-01-01T18:00:00'),
      new Date('2016-01-01T21:00:00'),
      new Date('2016-01-02T00:00:00')
    ];
    timeline.setTimesBySetID('Test', times);
    assert.equal(timeline.getTimes().length, times.length, 'Korrekte Anzahl getTimes()');
    assert.equal(timeline.getEnabledTimes().length, times.length, 'Korrekte Anzahl getEnabledTimes()');
    timeline.next();
    assert.equal(timeline.getSelectedTime().valueOf(), times[0].valueOf(), 'Zeit nach erstem next()');
    timeline.next();
    timeline.next();
    assert.equal(timeline.getSelectedTime().valueOf(), times[2].valueOf(), 'Zeit nach 2x next()');
    timeline.add(12, 'h');
    assert.equal(timeline.getSelectedTime().valueOf(), times[6].valueOf(), 'Zeit nach add(12h)');
    timeline.first();
    assert.equal(timeline.getSelectedTime().valueOf(), times[0].valueOf(), 'Zeit nach first()');
    timeline.next();
    timeline.next();
    timeline.next();
    assert.equal(timeline.getSelectedTime().valueOf(), times[3].valueOf(), 'Zeit nach 3x next()');
    timeline.add(24, 'h');
    assert.equal(timeline.getSelectedTime().valueOf(), times[3].valueOf(), 'Zeit nach add(12h)');
  });
  it('next()/add() mit Leerstellen', () => {
    let timeline = new Timeline({
      maxTimeGap: 3*3600
    });
    let times = [
      new Date('2016-01-01T00:00:00'),
      new Date('2016-01-01T06:00:00'),
      new Date('2016-01-01T12:00:00'),
      new Date('2016-01-01T18:00:00'),
      new Date('2016-01-02T00:00:00')
    ];
    let t0 = new Date('2016-01-01T09:00:00');
    timeline.setTimesBySetID('Test', times);
    assert.equal(timeline.getTimes().length, 9, 'Korrekte Anzahl getTimes()');
    assert.equal(timeline.getEnabledTimes().length, times.length, 'Korrekte Anzahl getEnabledTimes()');
    timeline.next();
    assert.equal(timeline.getSelectedTime().valueOf(), times[0].valueOf(), 'Zeit nach erstem next()');
    timeline.next();
    timeline.next();
    assert.equal(timeline.getSelectedTime().valueOf(), times[2].valueOf(), 'Zeit nach 2x next()');
    timeline.setSelectedTime(t0);
    assert.equal(timeline.getSelectedTime().valueOf(), t0.valueOf(), 'Zeit nach fixem setzen');
    timeline.next();
    assert.equal(timeline.getSelectedTime().valueOf(), times[2].valueOf(), 'Zeit nach next()');
    timeline.setSelectedTime(t0);
    assert.equal(timeline.getSelectedTime().valueOf(), t0.valueOf(), 'Zeit nach fixem setzen');
    timeline.prev();
    assert.equal(timeline.getSelectedTime().valueOf(), times[1].valueOf(), 'Zeit nach prev()');
  });
  it('add()/sub()', () => {
    const timeline = new Timeline();
    let times = [
      new Date('2020-06-08T13:40:00+00:00'),
      new Date('2020-06-08T13:40:00.030+00:00'),
      new Date('2020-06-08T13:40:21+00:00'),
      new Date('2020-06-08T14:14:00+00:00'),
      new Date('2020-06-09T02:40:00+00:00'),
      new Date('2020-07-02T13:40:00+00:00'),
      new Date('2021-02-08T13:40:00+00:00'),
      new Date('2021-06-08T13:40:00+00:00')
    ];
    timeline.setTimesBySetID('Test', times);
    timeline.first();
    assert.equal(timeline.getSelectedTime().valueOf(), times[0].valueOf(), 'Time after first()');
    [
      [30, 'ms', 'milliseconds'],
      [21, 's', 'seconds'],
      [34, 'm', 'minutes'],
      [13, 'h', 'hours'],
      [24, 'd', 'days'],
      [8, 'M', 'months'],
      [1, 'y', 'years']
    ].forEach((config, i) => {
      const amount = config[0];
      const shortKey = config[1];
      const key = config[2];
      timeline.add(amount, shortKey);
      assert.equal(timeline.getSelectedTime().valueOf(), times[i+1].valueOf(), shortKey);
      timeline.sub(amount, shortKey);
      assert.equal(timeline.getSelectedTime().valueOf(), times[0].valueOf(), shortKey);
      timeline.add(amount, key);
      assert.equal(timeline.getSelectedTime().valueOf(), times[i+1].valueOf(), key);
      timeline.sub(amount, key);
      assert.equal(timeline.getSelectedTime().valueOf(), times[0].valueOf(), key);
    });
  });
  it('isLast/isFirst', () => {
    let timeline = new Timeline();
    let times = [
      new Date('2016-01-01T00:00:00'),
      new Date('2016-01-01T06:00:00'),
      new Date('2016-01-01T12:00:00'),
      new Date('2016-01-01T18:00:00'),
      new Date('2016-01-02T00:00:00')
    ];
    timeline.setTimesBySetID('Test', times);
    timeline.first();
    assert.ok(timeline.isFirstEnabledTime(), 'isFirst');
    timeline.last();
    assert.ok(timeline.isLastEnabledTime(), 'isLast');
  });
});
describe('Timeline class, import via name', () => {
  it('simple', () => {
    let t = new TimelineClass();
    assert.ok(t.getSelectedTime() instanceof Date, 'Date');
  });
});