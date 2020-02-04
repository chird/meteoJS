import assert from 'assert';
import 'jsdom-global/register';
import $ from 'jquery';
import BootstrapTooltip from '../../../src/meteoJS/tooltip/BootstrapTooltip.js';
import { BootstrapTooltip as BootstrapTooltipClass }
  from '../../../src/meteoJS/tooltip/BootstrapTooltip.js';

describe('Defaults', () => {
  it('default constructor', () => {
    let tooltip = new BootstrapTooltip();
    assert.ok(!tooltip.isShown, 'isShown');
    assert.equal(tooltip.content, undefined, 'content');
    assert.equal(tooltip.tooltipNode, undefined, 'tooltipNode');
    let nodeForTooltip = $('<div>');
    tooltip.tooltipNode = nodeForTooltip;
    assert.equal(tooltip.tooltipNode, nodeForTooltip, 'tooltipNode');
    tooltip.content = 'Test';
    assert.equal(tooltip.content, 'Test', 'content');
    let testContent = $('<p>').text('Test');
    tooltip.content = testContent;
    assert.equal(tooltip.content, testContent, 'content');
  });
  it('constructor with options', () => {
    let nodeForTooltip = $('<div>');
    let tooltip = new BootstrapTooltipClass({
      tooltipNode: nodeForTooltip
    });
    assert.ok(!tooltip.isShown, 'isShown');
    assert.equal(tooltip.content, undefined, 'content');
    assert.equal(tooltip.tooltipNode, nodeForTooltip, 'tooltipNode');
  });
});