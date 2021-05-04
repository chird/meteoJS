/**
 * @module meteoJS/timeline/visualisation/bsDropdown
 */
import $ from 'jquery';
import Visualisation from '../Visualisation.js';
import Text from './Text.js';

/**
 * Options for constructor.
 * 
 * @typedef {module:meteoJS/timeline/visualisation~options}
 *   module:meteoJS/timeline/visualisation/bsDropdown~options
 * @param {string|undefined} format
 *   Format string for dropdown items, used for 'getTimeText'.
 * @param {string|undefined} buttonFormat
 *   Format string for dropdown button, used for 'getTimeText'.
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
 * @extends module:meteoJS/timeline/visualisation.Visualisation
 */
export class bsDropdown extends Visualisation {
  
  /**
   * @param {module:meteoJS/timeline/visualisation/bsDropdown~options} options - Options.
   */
  constructor({
    format = 'HH:mm',
    buttonFormat = 'DD. MMMM YYYY HH:mm',
    grouping = 'daily',
    groupingDivider = true,
    groupingFormat = 'ddd, DD. MMMM YYYY',
    classMain = 'dropdown',
    classDropdownMenu = 'dropdown-menu',
    classDropdownItem = 'dropdown-item',
    classItemActive = 'active',
    classItemNotEnabled = 'disabled',
    classItemEnabled = undefined,
    classItemAllEnabled = undefined,
    classDropdownHeader = 'dropdown-header',
    classDropdownDivider = 'dropdown-divider',
    classDropdownButton = 'btn dropdown-toggle',
    classButtonNotEnabled = undefined,
    classButtonEnabled = undefined,
    classButtonAllEnabled = undefined,
    ...rest
  } = {}) {
    super(rest);
    
    this.options.format = format;
    this.options.buttonFormat = buttonFormat;
    this.options.grouping = grouping;
    this.options.groupingDivider = groupingDivider;
    this.options.groupingFormat = groupingFormat;
    this.options.classMain = classMain;
    this.options.classDropdownMenu = classDropdownMenu;
    this.options.classDropdownItem = classDropdownItem;
    this.options.classItemActive = classItemActive;
    this.options.classItemNotEnabled = classItemNotEnabled;
    this.options.classItemEnabled = classItemEnabled;
    this.options.classItemAllEnabled = classItemAllEnabled;
    this.options.classDropdownHeader = classDropdownHeader;
    this.options.classDropdownDivider = classDropdownDivider;
    this.options.classDropdownButton = classDropdownButton;
    this.options.classButtonNotEnabled = classButtonNotEnabled;
    this.options.classButtonEnabled = classButtonEnabled;
    this.options.classButtonAllEnabled = classButtonAllEnabled;
    
    /**
     * @member {module:meteoJS/timeline/visualisation/text.Text}
     * @private
     */
    this.visualisationButtonText = new Text({
      timeline: this.options.timeline,
      format: this.options.buttonFormat,
      textInvalid: this.options.textInvalid,
      outputTimezone: this.options.outputTimezone,
      getTimeText: this.options.getTimeText
    });
    /**
     * @member {external:jQuery|undefined}
     * @private
     */
    this.dropdownNode = undefined;
    
    this.setNode(this.options.node);
  }
  
  /**
   * @inheritdoc
   */
  setOutputTimezone(outputTimezone) {
    super.setOutputTimezone(outputTimezone);
    this.visualisationButtonText.setOutputTimezone(outputTimezone);
    return this;
  }
  
  /**
   * @inheritdoc
   */
  onChangeTime() {
    if (this.dropdownNode === undefined)
      return;
    
    var time = this.options.timeline.getSelectedTime();
    this.options.node.children('li').children('button')
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
      .children('li')
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
   * @inheritdoc
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
      this.dropdownNode.append($('<li>').append(btn));
    }, this);
  }
  
  /**
   * @inheritdoc
   */
  emptyNode() {
    if (this.visualisationButtonText !== undefined)
      this.visualisationButtonText.setNode(undefined);
    this.dropdownNode = undefined;
    this.options.node.empty();
  }
  
  /**
   * @inheritdoc
   */
  onInitNode() {
    var id = 'dropdownMenuButton';
    var i=0;
    while (document.getElementById(id) != null) {
      id = 'dropdownMenuButton'+(++i);
    }
    
    var button = $('<button>')
      .addClass(this.options.classDropdownButton)
      .attr('type', 'button')
      .attr('id', id)
      .attr('data-bs-toggle', 'dropdown')
      .attr('aria-haspopup', true)
      .attr('aria-expanded', false);
    this.visualisationButtonText.setNode(button);
    this.dropdownNode = $('<ul>')
      .addClass(this.options.classDropdownMenu)
      .attr('aria-labelledby', id);
    this.options.node
      .addClass(this.options.classMain)
      .append(button)
      .append(this.dropdownNode);
  }
  
}
export default bsDropdown;