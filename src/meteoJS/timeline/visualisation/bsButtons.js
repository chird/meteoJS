/**
 * @module meteoJS/timeline/visualisation/bsButtons
 */
import $ from 'jquery';
import Visualisation from '../Visualisation.js';

/**
 * Dynamic format string to output the time for each Time-Button.
 * 
 * @typedef {Function} module:meteoJS/timeline/visualisation/bsButtons~timeFormatFunction
 * @param {Date} time - Timestamp of the Button.
 * @returns {String} A string to format the time for the Time-Buttons.
 */

/**
 * Options for constructor.
 * 
 * @typedef {module:meteoJS/timeline/visualisation~options}
 *   module:meteoJS/timeline/visualisation/bsButtons~options
 * @property {String|module:meteoJS/timeline/visualisation/bsButtons~timeFormatFunction} [format='HH']
 *   Format-String for the time of the Time-Buttons.
 */

/**
 * Show timeline as a group of buttons.
 * 
 * @extends module:meteoJS/timeline/visualisation.Visualisation
 */
export class bsButtons extends Visualisation {
  
  /**
   * @param {module:meteoJS/timeline/visualisation/bsButtons~options} options - Options.
   */
  constructor({
    format = 'HH',
    grouping = 'daily',
    groupingFormat = 'ddd, DD. MMM',
    classMain = 'btn-toolbar',
    classButtonGroup = 'btn-group',
    classButtonGroupMargin = 'mr-2',
    classLabel = undefined,
    classLabelSpan = 'd-block w-100',
    classButton = 'btn',
    classButtonActive = 'active',
    classButtonNotEnabled = 'btn-light',
    classButtonEnabled = 'btn-secondary',
    classButtonAllEnabled = 'btn-primary',
    /*prependNodes = undefined,
      appendNodes = undefined*/
    ...rest
  } = {}) {
    super(rest);
    
    this.options.format = format;
    this.options.grouping = grouping;
    this.options.groupingFormat = groupingFormat;
    this.options.classMain = classMain;
    this.options.classButtonGroup = classButtonGroup;
    this.options.classButtonGroupMargin = classButtonGroupMargin;
    this.options.classLabel = classLabel;
    this.options.classLabelSpan = classLabelSpan;
    this.options.classButton = classButton;
    this.options.classButtonActive = classButtonActive;
    this.options.classButtonNotEnabled = classButtonNotEnabled;
    this.options.classButtonEnabled = classButtonEnabled;
    this.options.classButtonAllEnabled = classButtonAllEnabled;
    
    /**
     * @member {external:jQuery|undefined}
     * @private
     */
    this.toolbarNode = undefined;
    
    this.setNode(this.options.node);
  }
  
  /**
   * @inheritdoc
   */
  onChangeTime() {
    if (this.toolbarNode === undefined)
      return;
    
    var time = this.options.timeline.getSelectedTime();
    var that = this;
    this.toolbarNode.find('button').each(function () {
      var t = new Date(+$(this).data('time'));
      $(this)
        .removeClass(that.options.classButtonActive);
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
   * @inheritdoc
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
        .data('time', time.valueOf());
      if (typeof this.options.format == 'function')
        btn.text(this.timeToText(time, this.options.format.call(this, time)));
      else
        btn.text(this.timeToText(time, this.options.format));
      if (this.options.timeline.isTimeAllEnabled(time))
        btn.addClass(this.options.classButtonAllEnabled);
      else if (this.options.timeline.isTimeEnabled(time))
        btn.addClass(this.options.classButtonEnabled);
      else
        btn.addClass(this.options.classButtonNotEnabled);
      let selectedTime = this.options.timeline.getSelectedTime();
      if (time.valueOf() == selectedTime.valueOf())
        btn.addClass(this.options.classButtonActive);
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
   * @inheritdoc
   */
  emptyNode() {
    this.toolbarNode = undefined;
    this.options.node.empty();
  }
  
  /**
   * @inheritdoc
   */
  onInitNode() {
    this.toolbarNode = $('<div>')
      .addClass(this.options.classMain)
      .attr('role', 'toolbar')
      .attr('aria-label', 'Timeline toolbar');
    this.options.node.append(this.toolbarNode);
  }
  
}
export default bsButtons;