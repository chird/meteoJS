import assert from 'assert';
import 'jsdom-global/register';
import Timeline from '../../../src/meteoJS/Timeline.js';
import Animation from '../../../src/meteoJS/timeline/Animation.js';

describe('Animation', () => {
  let lastDatetime = Date.UTC(2020, 1, 9, 16);
  let timeline = new Timeline();
  timeline.setTimesBySetID('', [
    Date.UTC(2020, 1, 9, 12),
    Date.UTC(2020, 1, 9, 13),
    Date.UTC(2020, 1, 9, 14),
    Date.UTC(2020, 1, 9, 15),
    lastDatetime
  ]);
  it('Defaults', () => {
    let animation = new Animation({
      timeline
    });
    assert.equal(animation.getImagePeriod(), 0.2, 'getImagePeriod');
    assert.equal(animation.getImageFrequency(), 5, 'getImageFrequency');
    assert.equal(animation.getRestartPause(), 1.8, 'getRestartPause');
    assert.equal(animation.isStarted(), false, 'isStarted');
    animation.start();
    assert.equal(animation.isStarted(), true, 'isStarted');
    animation.stop();
  });
  it('Events', function() {
    let animation = new Animation({
      timeline
    });
    let startAnimationCounter = 0;
    animation.on('start:animation', () => startAnimationCounter++);
    let stopAnimationCounter = 0;
    animation.on('stop:animation', () => stopAnimationCounter++);
    let endAnimationCounter = 0;
    animation.on('end:animation', () => endAnimationCounter++);
    let restartAnimationCounter = 0;
    animation.on('restart:animation', () => restartAnimationCounter++);
    let changeImageFrequencyCounter = 0;
    animation.on('change:imageFrequency', () => changeImageFrequencyCounter++);
    let changeRestartPause = 0;
    animation.on('change:restartPause', () => changeRestartPause++);
    animation.setRestartPause(0);
    animation.setImagePeriod(0.01);
    assert.equal(animation.getImagePeriod(), 0.01, 'getImagePeriod');
    assert.equal(animation.getImageFrequency(), 100, 'getImageFrequency');
    assert.equal(animation.getRestartPause(), 0, 'getRestartPause');
    assert.equal(animation.isStarted(), false, 'isStarted');
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1000);
      animation.start();
    })
    .then(() => {
      assert.equal(startAnimationCounter, 1, 'startAnimationCounter');
      assert.equal(stopAnimationCounter, 0, 'stopAnimationCounter');
      assert.ok(endAnimationCounter > 15, 'endAnimationCounter');
      animation.stop();
      let restartTestCount = endAnimationCounter;
      if (timeline.getSelectedTime() === lastDatetime)
        restartTestCount--;
      assert.equal(restartAnimationCounter, restartTestCount, 'restartAnimationCounter');
      assert.equal(stopAnimationCounter, 1, 'stopAnimationCounter');
      assert.equal(changeImageFrequencyCounter, 1, 'changeImageFrequencyCounter');
      assert.equal(changeRestartPause, 1, 'changeRestartPause');
    })
    .finally(() => animation.stop(), () => animation.stop());
  });
});