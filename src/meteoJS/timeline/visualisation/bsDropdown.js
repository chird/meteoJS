/**
 * @module meteoJS/timeline/visualisation/bsDropdown
 */

import $ from 'jquery';
import Visualisation from '../Visualisation.js';
import Text from './Text.js';

/**
 * Options for meteoJS/timeline/visualisation/bsDropdown.
 * 
 * @typedef {Object} meteoJS/timeline/visualisation/bsDropdown~options
 * @augments meteoJS/timeline/visualisation~options
 * @param {string|undefined} format
 *   Format string for dropdown items, used for {@link moment.format}.
 * @param {string|undefined} buttonFormat
 *   Format string for dropdown button, used for {@link moment.format}.
 * @param {string} grouping
 *   'daily', 'hourly' or a format string. Defines if items will be grouped and
 *   be title depending on groupingDivider and groupingFormat.
 * @param {boolean} groupingDivider Show dropdown divider above an item group.
 * @param {undefined|string} groupingFormat
 *   Format string for a dropdown header above an item group.
 * @param {undefined|string} classMain Class for the main node.
 * @param {undefined|string} classDropdownMenu Class for the dropdown node.
 * @param {undefined|string} classDropdownItem Class for a dropdown item.
 * @param {undefined|string} classItemActive Class for an active item.
 * @param {undefined|string} classItemNotEnabled Class for a not enabled item.
 * @param {undefined|string} classItemEnabled Class for an enabled item.
 * @param {undefined|string} classItemAllEnabled Class for an all enabled item.
 * @param {undefined|string} classDropdownHeader Class for dropdown header.
 * @param {undefined|string} classDropdownDivider Class for dropdown divider.
 * @param {undefined|string} classDropdownButton Class for the dropdown button.
 * @param {undefined|string} classButtonNotEnabled
 *   Class for the dropdown button if the selected time is not enabled.
 * @param {undefined|string} classButtonEnabled
 *   Class for the dropdown button if the selected time is enabled.
 * @param {undefined|string} classButtonAllEnabled
 *   Class for the dropdown button if the selected time is all enabled.
 */

/**
 * Show timeline in a dropdown menu. The menu will be build according to
 * bootstrap.
 * 
 * @constructor
 * @augments meteoJS/timeline/visualisation
 * @param {meteoJS/timeline/visualisation/bsDropdown~options} options Options.
 */
export default class bsDropdown extends Visualisation {

constructor(options) {
  /* Sets explictly values, if an option is not existing. $.extend overrides
   * undefined values by the values passed. Without this explictly check you
   * could not pass undefined values, but this is itended. */
  if (!('format' in options))
    options.format = 'HH:mm';
  if (!('buttonFormat' in options))
    options.buttonFormat = 'DD. MMMM YYYY HH:mm';
  if (!('groupingFormat' in options))
    options.groupingFormat = 'ddd, DD. MMMM YYYY';
  if (!('classMain' in options))
    options.classMain = 'dropdown';
  if (!('classDropdownMenu' in options))
    options.classDropdownMenu = 'dropdown-menu';
  if (!('classDropdownItem' in options))
    options.classDropdownItem = 'dropdown-item';
  if (!('classItemActive' in options))
    options.classItemActive = 'active';
  if (!('classItemNotEnabled' in options))
    options.classItemNotEnabled = 'disabled';
  if (!('classDropdownHeader' in options))
    options.classDropdownHeader = 'dropdown-header';
  if (!('classDropdownDivider' in options))
    options.classDropdownDivider = 'dropdown-divider';
  if (!('classDropdownButton' in options))
    options.classDropdownButton = 'btn dropdown-toggle';
  options = $.extend(true, {
    format: undefined,
    buttonFormat: undefined,
    grouping: 'daily',
    groupingDivider: true,
    groupingFormat: undefined,
    classMain: undefined,
    classDropdownMenu: undefined,
    classDropdownItem: undefined,
    classItemActive: undefined,
    classItemNotEnabled: undefined,
    classItemEnabled: undefined,
    classItemAllEnabled: undefined,
    classDropdownHeader: undefined,
    classDropdownDivider: undefined,
    classDropdownButton: undefined,
    classButtonNotEnabled: undefined,
    classButtonEnabled: undefined,
    classButtonAllEnabled: undefined
  }, options);
  
  super(options);
  
  /**
   * @member {meteoJS/timeline/visualisation/text}
   */
  this.visualisationButtonText = new Text({
    timeline: this.options.timeline,
    format: this.options.buttonFormat,
    textInvalid: this.options.textInvalid,
    outputTimezone: this.options.outputTimezone
  });
  /** @member {jQuery|undefined} */
  this.dropdownNode = undefined;
  
  this.setNode(this.options.node);
}

/**
 * Sets output timezone, undefined for UTC.
 * 
 * @augments setOutputTimezone
 * @param {string|undefined} outputTimezone Timezone for datetime output.
 * @returns {meteoJS.timeline.visualisation.bsDropdown} This.
 */
setOutputTimezone(outputTimezone) {
  meteoJS.timeline.visualisation.prototype.setOutputTimezone.call(this, outputTimezone);
  this.visualisationButtonText.setOutputTimezone(outputTimezone);
  return this;
}

/**
 * @augments meteoJS.timeline.visualisation.onChangeTime
 */
onChangeTime() {
  if (this.dropdownNode === undefined)
    return;
  
  var time = this.options.timeline.getSelectedTime();
  this.options.node.children('button')
    .removeClass(this.options.classButtonActive)
    .removeClass(this.options.classButtonNotEnabled)
    .removeClass(this.options.classButtonEnabled)
    .removeClass(this.options.classButtonAllEnabled);
  if (this.options.timeline.isTimeAllEnabled(time))
    this.options.node.children('button')
      .addClass(this.options.classButtonAllEnabled);
  else if (this.options.timeline.isTimeEnabled(time))
    this.options.node.children('button')
      .addClass(this.options.classButtonEnabled);
  else
    this.options.node.children('button')
      .addClass(this.options.classButtonNotEnabled);
  var that = this;
  this.dropdownNode
    .children('button.'+this.options.classDropdownItem)
    .each(function () {
      var t = new Date(+$(this).data('time'));
      $(this)
        .removeClass(that.options.classItemActive)
        .removeClass(that.options.classItemNotEnabled)
        .removeClass(that.options.classItemEnabled)
        .removeClass(that.options.classItemAllEnabled);
      if (time.valueOf() == t.valueOf())
        $(this).addClass(that.options.classItemActive);
      else if (that.options.timeline.isTimeAllEnabled(t))
        $(this).addClass(that.options.classItemAllEnabled);
      else if (that.options.timeline.isTimeEnabled(t))
        $(this).addClass(that.options.classItemEnabled);
      else
        $(this).addClass(that.options.classItemNotEnabled);
    });
}

/**
 * @augments meteoJS.timeline.visualisation.onChangeTimes
 */
onChangeTimes() {
  if (this.dropdownNode === undefined)
    this.dropdownNode = $('<div>');
  this.dropdownNode.empty();
  
  var groupingFormat =
    (this.options.grouping == 'daily') ? 'YYYY-MM-DD' :
    (this.options.grouping == 'hourly') ? 'YYYY-MM-DD HH' :
    this.options.grouping;
  var lastGroupTimeStr = undefined;
  this.getTimelineTimes().forEach(function (time) {
    if (lastGroupTimeStr === undefined ||
        lastGroupTimeStr != this.timeToText(time, groupingFormat)) {
      if (lastGroupTimeStr !== undefined && // No divider at the beginning
          this.options.groupingDivider)
        this.dropdownNode
          .append($('<div>')
          .addClass(this.options.classDropdownDivider));
      if (this.options.groupingFormat !== undefined)
        this.dropdownNode
          .append($('<h6>')
          .addClass(this.options.classDropdownHeader)
          .text(this.timeToText(time, this.options.groupingFormat)));
      lastGroupTimeStr = this.timeToText(time, groupingFormat);
    }
    var btn = $('<button>')
      .addClass(this.options.classDropdownItem)
      .attr('type', 'button')
      .text(this.timeToText(time, this.options.format))
      .data('time', time.valueOf());
    var that = this;
    btn.click(function () {
      that.options.timeline.setSelectedTime(new Date(+$(this).data('time')));
      that.trigger('input');
    });
    this.dropdownNode.append(btn);
  }, this);
}

/**
 * @augments meteoJS.timeline.visualisation.emptyNode
 */
emptyNode() {
  if (this.visualisationButtonText !== undefined)
    this.visualisationButtonText.setNode(undefined);
  this.dropdownNode = undefined;
  this.options.node.empty();
}

/**
 * @augments meteoJS.timeline.visualisation.onInitNode
 */
onInitNode(isListenersDefined) {
  var id = 'dropdownMenuButton';
  var i=0;
  while (document.getElementById(id) != null) {
    id = 'dropdownMenuButton'+(++i);
  }
  
  var button = $('<button>')
    .addClass(this.options.classDropdownButton)
    .attr('type', 'button')
    .attr('id', id)
    .attr('data-toggle', 'dropdown')
    .attr('aria-haspopup', true)
    .attr('aria-expanded', false);
  this.visualisationButtonText.setNode(button);
  this.dropdownNode = $('<div>')
    .addClass(this.options.classDropdownMenu)
    .attr('aria-labelledby', id);
  this.options.node
    .addClass(this.options.classMain)
    .append(button)
    .append(this.dropdownNode);
}

}