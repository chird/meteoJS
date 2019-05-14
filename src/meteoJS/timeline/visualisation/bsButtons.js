/**
 * @module meteoJS/timeline/visualisation/bsButtons
 */

import $ from 'jquery';
import Visualisation from '../Visualisation.js';

/**
 * Options for meteoJS/timeline/visualisation/bsButtons.
 * 
 * @typedef {Object} meteoJS/timeline/visualisation/bsButtons~options
 * @augments meteoJS/timeline/visualisation~options
 */

/**
 * Show timeline as a group of buttons.
 * 
 * @constructor
 * @augments meteoJS/timeline/visualisation
 * @param {meteoJS/timeline/visualisation/bsButtons~options} options Options.
 */
export default class bsButtons extends Visualisation {

constructor(options) {
  /* Sets explictly values, if an option is not existing. $.extend overrides
   * undefined values by the values passed. Without this explictly check you
   * could not pass undefined values, but this is itended. */
  if (!('format' in options))
    options.format = 'HH';
  if (!('groupingFormat' in options))
    options.groupingFormat = 'ddd, DD. MMM';
  if (!('classMain' in options))
    options.classMain = 'btn-toolbar';
  if (!('classButtonGroup' in options))
    options.classButtonGroup = 'btn-group';
  if (!('classButtonGroupMargin' in options))
    options.classButtonGroupMargin = 'mr-2';
  if (!('classLabelSpan' in options))
    options.classLabelSpan = 'd-block w-100';
  if (!('classButton' in options))
    options.classButton = 'btn';
  if (!('classButtonActive' in options))
    options.classButtonActive = 'active';
  if (!('classButtonNotEnabled' in options))
    options.classButtonNotEnabled = 'btn-light';
  if (!('classButtonEnabled' in options))
    options.classButtonEnabled = 'btn-secondary';
  if (!('classButtonAllEnabled' in options))
    options.classButtonAllEnabled = 'btn-primary';
  options = $.extend(true, {
    // new part
    format: undefined,
    grouping: 'daily',
    groupingFormat: undefined,
    classMain: undefined,
    classButtonGroup: undefined,
    classButtonGroupMargin: undefined,
    classLabel: undefined,
    classLabelSpan: undefined,
    classButton: undefined,
    classButtonActive: undefined,
    classButtonNotEnabled: undefined,
    classButtonEnabled: undefined,
    classButtonAllEnabled: undefined,
    /*prependNodes: undefined,
    appendNodes: undefined*/
  }, options);
  
  super(options);
  
  /** @member {jQuery|undefined} */
  this.toolbarNode = undefined;
  
  this.setNode(this.options.node);
}

/**
 * @augments meteoJS.timeline.visualisation.onChangeTime
 */
onChangeTime() {
  if (this.toolbarNode === undefined)
    return;
  
  var time = this.options.timeline.getSelectedTime();
  var that = this;
  this.toolbarNode.find('button').each(function () {
    var t = new Date(+$(this).data('time'));
    $(this)
      .removeClass(that.options.classButtonActive)
      /*.removeClass(that.options.classButtonAllEnabled)
      .removeClass(that.options.classButtonEnabled)
      .removeClass(that.options.classButtonNotEnabled);*/
    if (time.valueOf() == t.valueOf())
      $(this).addClass(that.options.classButtonActive);
    /*else if (that.options.timeline.isTimeAllEnabled(t))
      $(this).addClass(that.options.classButtonAllEnabled);
    else if (that.options.timeline.isTimeEnabled(t))
      $(this).addClass(that.options.classButtonEnabled);
    else
      $(this).addClass(that.options.classButtonNotEnabled);*/
  });
}

/**
 * @augments meteoJS.timeline.visualisation.onChangeTimes
 */
onChangeTimes() {
  if (this.toolbarNode === undefined)
    this.toolbarNode = $('<div>');
  this.toolbarNode.empty();
  
  var groupingFormat =
    (this.options.grouping == 'daily') ? 'YYYY-MM-DD' :
    (this.options.grouping == 'hourly') ? 'YYYY-MM-DD HH' :
    this.options.grouping;
  var lastNode = undefined;
  this.getTimelineTimes().forEach(function (time) {
    if (lastNode === undefined ||
        lastNode.data('date') != this.timeToText(time, groupingFormat)) {
      var btnGroup = $('<div>')
        .addClass(this.options.classButtonGroup)
        .addClass(this.options.classButtonGroupMargin)
        .attr('role', 'group')
        .attr('aria-label', this.timeToText(time, groupingFormat));
      if (this.options.groupingFormat === undefined) {
        lastNode = btnGroup;
      }
      else {
        var span = $('<span>')
          .addClass(this.options.classLabelSpan)
          .text(this.timeToText(time, this.options.groupingFormat));
        lastNode = $('<label>')
          .addClass(this.options.classLabel)
          .append(span);
        btnGroup.attr('aria-label', span.text());
        lastNode.append(btnGroup);
      }
      lastNode.data('date', this.timeToText(time, groupingFormat));
      this.toolbarNode.append(lastNode);
    }
    
    var btn = $('<button>')
      .addClass(this.options.classButton)
      .attr('type', 'button')
      .text(this.timeToText(time, this.options.format))
      .data('time', time.valueOf());
    if (this.options.timeline.isTimeAllEnabled(time))
      btn.addClass(this.options.classButtonAllEnabled);
    else if (this.options.timeline.isTimeEnabled(time))
      btn.addClass(this.options.classButtonEnabled);
    else
      btn.addClass(this.options.classButtonNotEnabled);
    var that = this;
    btn.click(function () {
      that.options.timeline.setSelectedTime(new Date(+$(this).data('time')));
      that.trigger('input');
    });
    if (lastNode.hasClass(this.options.classButtonGroup))
      lastNode.append(btn);
    else
      lastNode.children('div').append(btn);
  }, this);
  this.toolbarNode.find('div.'+this.options.classButtonGroup).last().removeClass(this.options.classButtonGroupMargin);
}

/**
 * @augments meteoJS.timeline.visualisation.emptyNode
 */
emptyNode() {
  this.toolbarNode = undefined;
  this.options.node.empty();
}

/**
 * @augments meteoJS.timeline.visualisation.onInitNode
 */
onInitNode(isListenersDefined) {
  this.toolbarNode = $('<div>')
    .addClass(this.options.classMain)
    .attr('role', 'toolbar')
    .attr('aria-label', 'Timeline toolbar');
  this.options.node.append(this.toolbarNode);
}

}