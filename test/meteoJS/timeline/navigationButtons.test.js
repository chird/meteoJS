import assert from 'assert';
import 'jsdom-global/register';
import Timeline from '../../../src/meteoJS/Timeline.js';
import NavigationButtons
  from '../../../src/meteoJS/timeline/NavigationButtons.js';
import { NavigationButtons as NavigationButtonsClass }
  from '../../../src/meteoJS/timeline/NavigationButtons.js';

describe('NavigationButtons', () => {
  let timeline = new Timeline();
  timeline.setTimesBySetID('',
    [...Array(17).keys()]
    .map(i => i*3)
    .map(i => new Date(Date.UTC(2019, 10, 21 + Math.trunc(i/24), i % 24))));
  it('Defaults', () => {
    let clickCounter = 0;
    let timeChangedCounter = 0;
    let nB = new NavigationButtons({ timeline });
    nB.on('click:button', ({ isTimeChanged }) => {
      clickCounter++;
      if (isTimeChanged)
        timeChangedCounter++;
    });
    let node = document.createElement('div');
    nB.insertButtonInto(node,
      { methodName: 'first' },
      { methodName: 'prevAllEnabled' },
      { methodName: 'prev',
        title: 'Previous' },
      { methodName: 'sub',
        timeAmount: 12,
        timeKey: 'h' },
      { methodName: 'sub',
        timeAmount: 6,
        timeKey: 'h',
        text: 'ABC' },
      { methodName: 'sub',
        timeAmount: 3,
        timeKey: 'h' },
      { methodName: 'add',
        timeAmount: 3,
        timeKey: 'h' },
      { methodName: 'add',
        timeAmount: 12,
        timeKey: 'h' },
      { methodName: 'next',
        buttonClass: 'btn' },
      { methodName: 'nextAllEnabled' },
      { methodName: 'last' });
    assert.equal(node.childElementCount, 11, 'children count');
    [['', undefined, '|«'],
     ['', undefined, '«'],
     ['', 'Previous', '«'],
     ['', undefined, '-12h'],
     ['', undefined, 'ABC'],
     ['', undefined, '-3h'],
     ['', undefined, '+3h'],
     ['', undefined, '+12h'],
     ['btn', undefined, '»'],
     ['', undefined, '»'],
     ['', undefined, '»|']].forEach((result, i) => {
      assert.equal(node.children[i].className, result[0], `${i}: class`);
      assert.equal(node.children[i].getAttribute('title'), result[1], `${i}: title`);
      assert.equal(node.children[i].textContent, result[2], `${i}: textContent`);
    });
    node.children[10].dispatchEvent(new CustomEvent('onclick')); // last
    assert.equal(timeline.getSelectedTime(), timeline.getTimes()[16], 'selected time 16');
    node.children[6].dispatchEvent(new CustomEvent('onclick')); // +3h
    assert.equal(timeline.getSelectedTime(), timeline.getTimes()[16], 'selected time 16');
    node.children[2].dispatchEvent(new CustomEvent('onclick')); // Prev
    assert.equal(timeline.getSelectedTime(), timeline.getTimes()[15], 'selected time 15');
    node.children[3].dispatchEvent(new CustomEvent('onclick')); // -12h
    assert.equal(timeline.getSelectedTime().valueOf(), timeline.getTimes()[11].valueOf(), 'selected time 11');
    assert.equal(clickCounter, 4, 'click counter');
    assert.equal(timeChangedCounter, 3, 'timeChanged counter');

  });
  it('Constructor options: buttonClass', () => {
    let nB = new NavigationButtons({
      timeline,
      buttonClass: 'btn btn-secondary'
    });
    let node = document.createElement('div');
    nB.insertButtonInto(node,
      { methodName: 'first' },
      { methodName: 'last' });
    assert.equal(node.childElementCount, 2, 'children count');
    assert.equal(node.children[0].className, 'btn,btn-secondary', '0: class');
    assert.equal(node.children[0].getAttribute('title'), undefined, '0: title');
    assert.equal(node.children[0].textContent, '|«', '0: textContent');
    assert.equal(node.children[1].className, 'btn,btn-secondary', '0: class');
    assert.equal(node.children[1].getAttribute('title'), undefined, '0: title');
    assert.equal(node.children[1].textContent, '»|', '0: textContent');
  });
  it('named import', () => {
    let nB = new NavigationButtons({
      timeline
    });
    let node = document.createElement('div');
    nB.insertButtonInto(node, { methodName: 'first' });
    assert.equal(node.childElementCount, 1, 'children count');
  });
});