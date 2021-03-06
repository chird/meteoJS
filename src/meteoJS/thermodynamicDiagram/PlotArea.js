/**
 * @module meteoJS/thermodynamicDiagram/plotArea
 */
import addEventFunctions from '../Events.js';
import { SVG } from '@svgdotjs/svg.js';

/**
 * Event with a sounding object.
 * 
 * @typedef {Object} module:meteoJS/thermodynamicDiagram/plotArea~backgroundEvent
 * @property {external:SVG} node
 *   SVG node which contains the background nodes.
 */

/**
 * Fired before creating the background.
 * 
 * @event module:meteoJS/thermodynamicDiagram/plotArea#prebuild:background
 * @type {module:meteoJS/thermodynamicDiagram/plotArea~backgroundEvent}
 */

/**
 * Fired after creating the background.
 * 
 * @event module:meteoJS/thermodynamicDiagram/plotArea#postbuild:background
 * @type {module:meteoJS/thermodynamicDiagram/plotArea~backgroundEvent}
 */

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
 * Events options. On event a
 * {@link module:meteoJS/thermodynamicDiagram/plotArea~event}
 * is passed to the listener.
 * 
 * @typedef {Object} module:meteoJS/thermodynamicDiagram/plotArea~eventsOptions
 * @property {Function} [click] - Click listener.
 * @property {Function} [dblclick] - Dblclick listener.
 * @property {Function} [mousedown] - Mousedown listener.
 * @property {Function} [mouseup] - Mouseup listener.
 * @property {Function} [mouseover] - Mouseover listener.
 * @property {Function} [mouseout] - Mouseout listener.
 * @property {Function} [mousemove] - Mousemove listener.
 * @property {Function} [touchstart] - Touchstart listener.
 * @property {Function} [touchmove] - Touchmove listener.
 * @property {Function} [touchleave] - Touchleave listener.
 * @property {Function} [touchend] - Touchend listener.
 * @property {Function} [touchcancel] - Touchcancel listener.
 */

/**
 * Options for the constructor.
 * 
 * @typedef {Object} module:meteoJS/thermodynamicDiagram/plotArea~options
 * @param {external:SVG} [svgNode] - SVG Node.
 * @property {module:meteoJS/thermodynamicDiagram/coordinateSystem.CoordinateSystem}
 *   [coordinateSystem] - Coordinate system.
 * @param {integer} [x=0] - X.
 * @param {integer} [y=0] - Y.
 * @param {integer} [width=100] - Width.
 * @param {integer} [height=100] - Height.
 * @param {Object} [style] - SVG-Style for this Area. Default: overflow=hidden.
 * @param {boolean} [visible=true] - Visibility.
 * @param {module:meteoJS/thermodynamicDiagram/plotArea~eventsOptions}
 *   [events] - Events.
 */

/**
 * Abstract class to define an area on the SVG.
 * 
 * <pre><code>import PlotArea from 'meteojs/thermodynamicDiagram/PlotArea';</code></pre>
 * 
 * @fires module:meteoJS/thermodynamicDiagram/plotArea#change:visible
 * @fires module:meteoJS/thermodynamicDiagram/plotArea#change:position
 * @fires module:meteoJS/thermodynamicDiagram/plotArea#change:extent
 * @fires module:meteoJS/thermodynamicDiagram/plotArea#prebuild:background
 * @fires module:meteoJS/thermodynamicDiagram/plotArea#postbuild:background
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
    svgNode = undefined,
    coordinateSystem = undefined,
    x = 0,
    y = 0,
    width = 100,
    height = 100,
    style = {},
    visible = true,
    events = {}
  } = {}) {
    /**
     * @type external:SVG
     * @private
     */
    this._svgNode = SVG()
      .attr({
        x,
        y,
        width,
        height
      })
      .css(this._getNormalizedStyle(style))
      .css('display', visible ? 'inline' : 'none');
    if (svgNode !== undefined)
      this.addTo(svgNode);
    
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
    
    /**
     * @type mixed
     * @private
     */
    this._coordinateSystemListenerKey = (this._coordinateSystem !== undefined)
      ? this._coordinateSystem
        .on('change:options', () => this.onCoordinateSystemChange())
      : undefined;
    
    this.on('change:extent', () => this.onCoordinateSystemChange());
    
    this._initEvents(events);
  }
  
  /**
   * SVG container node.
   * 
   * @type external:SVG
   * @public
   * @readonly
   */
  get svgNode() {
    return this._svgNode;
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
   * @public
   */
  get coordinateSystem() {
    return this._coordinateSystem;
  }
  set coordinateSystem(coordinateSystem) {
    if (this._coordinateSystemListenerKey !== undefined)
      this._coordinateSystem
        .un('change:options', this._coordinateSystemListenerKey);
    this._coordinateSystem = coordinateSystem;
    this._coordinateSystemListenerKey =
      this._coordinateSystem
        .on('change:options', () => this.onCoordinateSystemChange());
    this.onCoordinateSystemChange();
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
   * Sets the plot area as a child of the argument.
   * 
   * @param {external:SVG} svgNode - SVG node.
   */
  addTo(svgNode) {
    this._svgNode.addTo(svgNode);
  }
  
  /**
   * Init the area.
   * 
   * @protected
   */
  init() {
    this.onCoordinateSystemChange();
  }
  
  /**
   * Called, when the coordinateSystem object changes.
   * 
   * @protected
   */
  onCoordinateSystemChange() {
    if (this._coordinateSystem !== undefined)
      this.drawBackground(this._svgNodeBackground);
  }
  
  /**
   * Draw background into SVG group.
   * 
   * This method is only called, when this.coordinateSystem isn't undefined.
   * 
   * @param {external:SVG} svgNode - SVG group, SVG.G.
   * @protected
   */
  drawBackground(svgNode) {
    svgNode.clear();
    this.trigger('prebuild:background', { node: svgNode });
    this._drawBackground(svgNode);
    this.trigger('postbuild:background', { node: svgNode });
  }
  
  /**
   * Method to inherit from child classes to draw the background of the plot
   * area.
   * 
   * This method is only called, when this.coordinateSystem isn't undefined.
   * 
   * @param {external:SVG} svgNode - SVG group, SVG.G.
   * @protected
   */
  _drawBackground() {}
  
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