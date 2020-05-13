/**
 * @module meteoJS/thermodynamicDiagram/plotArea
 */
import addEventFunctions from '../Events.js';

/**
 * Object passed on events.
 * 
 * @typedef {external:Event} module:meteoJS/thermodynamicDiagram/plotArea~event
 * @property {number} elementX - X coordinate.
 * @property {number} elementY - Y coordinate.
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/plotArea#click
 * @type {module:meteoJS/thermodynamicDiagram/plotArea~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/plotArea#dblclick
 * @type {module:meteoJS/thermodynamicDiagram/plotArea~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/plotArea#mousedown
 * @type {module:meteoJS/thermodynamicDiagram/plotArea~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/plotArea#mouseup
 * @type {module:meteoJS/thermodynamicDiagram/plotArea~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/plotArea#mouseover
 * @type {module:meteoJS/thermodynamicDiagram/plotArea~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/plotArea#mouseout
 * @type {module:meteoJS/thermodynamicDiagram/plotArea~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/plotArea#mousemove
 * @type {module:meteoJS/thermodynamicDiagram/plotArea~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/plotArea#touchstart
 * @type {module:meteoJS/thermodynamicDiagram/plotArea~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/plotArea#touchmove
 * @type {module:meteoJS/thermodynamicDiagram/plotArea~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/plotArea#touchleave
 * @type {module:meteoJS/thermodynamicDiagram/plotArea~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/plotArea#touchend
 * @type {module:meteoJS/thermodynamicDiagram/plotArea~event}
 */

/**
 * @event module:meteoJS/thermodynamicDiagram/plotArea#touchcancel
 * @type {module:meteoJS/thermodynamicDiagram/plotArea~event}
 */

/**
 * Options for the constructor.
 * 
 * @typedef {Object} module:meteoJS/thermodynamicDiagram/plotArea~options
 * @param {external:SVG} svgNode - SVG Node.
 * @param {integer} [x=0] - X.
 * @param {integer} [y=0] - Y.
 * @param {integer} [width=100] - Width.
 * @param {integer} [height=100] - Height.
 * @param {Object} [style] - SVG-Style for this Area. Default: overflow=hidden.
 * @param {boolean} [visible=true] - Visibility.
 */

/**
 * Abstract class to define an area on the SVG.
 * 
 * @fires module:meteoJS/thermodynamicDiagram/plotArea#change:visible
 * @fires module:meteoJS/thermodynamicDiagram/plotArea#change:position
 * @fires module:meteoJS/thermodynamicDiagram/plotArea#change:extent
 * @fires module:meteoJS/thermodynamicDiagram/plotArea#click
 * @fires module:meteoJS/thermodynamicDiagram/plotArea#dblclick
 * @fires module:meteoJS/thermodynamicDiagram/plotArea#mousedown
 * @fires module:meteoJS/thermodynamicDiagram/plotArea#mouseup
 * @fires module:meteoJS/thermodynamicDiagram/plotArea#mouseover
 * @fires module:meteoJS/thermodynamicDiagram/plotArea#mouseout
 * @fires module:meteoJS/thermodynamicDiagram/plotArea#mousemove
 * @fires module:meteoJS/thermodynamicDiagram/plotArea#touchstart
 * @fires module:meteoJS/thermodynamicDiagram/plotArea#touchmove
 * @fires module:meteoJS/thermodynamicDiagram/plotArea#touchleave
 * @fires module:meteoJS/thermodynamicDiagram/plotArea#touchend
 * @fires module:meteoJS/thermodynamicDiagram/plotArea#touchcancel
 */
export class PlotArea {
  
  /**
   * @param {module:meteoJS/thermodynamicDiagram/plotArea~options}
   *   options - Options.
   */
  constructor({
    svgNode,
    coordinateSystem,
    x = 0,
    y = 0,
    width = 100,
    height = 100,
    style = {},
    visible = true,
    events = {}
  }) {
    /**
     * @type external:SVG
     * @private
     */
    this._svgNode = svgNode.nested()
      .attr({
        x,
        y,
        width,
        height
      })
      .css(this._getNormalizedStyle(style))
      .css('display', visible ? 'inline' : 'none');
    
    /**
     * @type external:SVG
     * @private
     */
    this._svgNodeBackground = this._svgNode.group();
    
    /**
     * @type boolean
     * @private
     */
    this._visible = visible;
    
    /**
     * @type module:meteoJS/thermodynamicDiagram/coordinateSystem.CoordinateSystem
     * @private
     */
    this._coordinateSystem = coordinateSystem;
    
    this.on('change:extent', () => this.drawBackground(this._svgNodeBackground));
    
    this._initEvents(events);
  }
  
  /**
   * Visibility of the area.
   * 
   * @type boolean
   * @public
   */
  get visible() {
    return this._visible;
  }
  set visible(visible) {
    let oldVisible = this._visible;
    this._visible = visible;
    if (oldVisible != this._visible) {
      this._svgNode.style('display', this._visible ? 'inline' : 'none');
      this.trigger('change:visible');
    }
  }
  
  /**
   * X of the top-left edge.
   * 
   * @type integer
   * @public
   */
  get x() {
    return this._svgNode.attr('x');
  }
  set x(x) {
    this._svgNode.attr({ x });
    this.trigger('change:position');
  }
  
  /**
   * Y of the top-left edge.
   * 
   * @type integer
   * @public
   */
  get y() {
    return this._svgNode.attr('y');
  }
  set y(y) {
    this._svgNode.attr({ y });
    this.trigger('change:position');
  }
  
  /**
   * Width of the area.
   * 
   * @type integer
   * @public
   */
  get width() {
    return this._svgNode.attr('width');
  }
  set width(width) {
    this._svgNode.attr({ width });
    this.trigger('change:extent');
  }
  
  /**
   * Height of the area.
   * 
   * @type integer
   * @public
   */
  get height() {
    return this._svgNode.attr('height');
  }
  set height(height) {
    this._svgNode.attr({ height });
    this.trigger('change:extent');
  }
  
  /**
   * Overflow-style of the area.
   * 
   * @type string
   * @public
   */
  get style() {
    return this._svgNode.css();
  }
  set style(style) {
    this._svgNode.css(style);
  }
  
  /**
   * Coordinate system.
   * 
   * @type module:meteoJS/thermodynamicDiagram/coordinateSystem.CoordinateSystem
   * @readonly
   */
  get coordinateSystem() {
    return this._coordinateSystem;
  }
  
  /**
   * Minimal extent length (either width or height).
   * 
   * @type integer
   * @readonly
   */
  get minExtentLength() {
    return Math.min(this.width, this.height);
  }
  
  /**
   * Maximal extent length (either width or height).
   * 
   * @type integer
   * @readonly
   */
  get maxExtentLength() {
    return Math.max(this.width, this.height);
  }
  
  /**
   * Init the area.
   * 
   * @protected
   */
  init() {
    this.drawBackground(this._svgNodeBackground);
  }
  
  /**
   * Draw background into SVG group.
   * 
   * @param {external:SVG} group - SVG group, SVG.G.
   * @protected
   */
  drawBackground(svgNode) {
    svgNode.clear();
  }
  
  /**
   * Returns normalized SVG style.
   * 
   * @private
   * @param {Object} style - Input SVG style.
   * @param {string} [style.overflow='hidden'] - Overflow style.
   * @returns {Object} - SVG style.
   */
  _getNormalizedStyle({
    overflow = 'hidden'
  }) {
    return {
      overflow
    };
  }
  
  /**
   * Initialize events.
   * 
   * @param {Object} options - Options.
   * @private
   */
  _initEvents({
    click = undefined,
    dblclick = undefined,
    mousedown = undefined,
    mouseup = undefined,
    mouseover = undefined,
    mouseout = undefined,
    mousemove = undefined,
    touchstart = undefined,
    touchmove = undefined,
    touchleave = undefined,
    touchend = undefined,
    touchcancel = undefined
  }) {
    const events = {
      click,
      dblclick,
      mousedown,
      mouseup,
      mouseover,
      mouseout,
      mousemove,
      touchstart,
      touchmove,
      touchleave,
      touchend,
      touchcancel
    };
    Object.keys(events).forEach(eventKey => {
      this._svgNode.on(eventKey, e => {
        const customEvent =
          this.getExtendedEvent(e,
            this._svgNode.point(
              e.pageX - window.pageXOffset,
              e.pageY - window.pageYOffset));
        if (events[eventKey] !== undefined)
          events[eventKey].call(this, customEvent);
        this.trigger(eventKey, customEvent);
      });
    });
  }
  
  /**
   * Extend an event with some properties.
   * 
   * @param {external:Event} e - Event.
   * @param {external:SVG} p - Point.
   * @protected
   */
  getExtendedEvent(e, p) {
    e.elementX = p.x;
    e.elementY = p.y;
    return e;
  }
}
addEventFunctions(PlotArea.prototype);
export default PlotArea;