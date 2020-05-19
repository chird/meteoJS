/**
 * @module meteoJS/thermodynamicDiagramPluggable
 */
import { SVG } from '@svgdotjs/svg.js';
import Collection from './base/Collection.js';
import DiagramSounding from './thermodynamicDiagram/DiagramSounding.js';

/**
 * Options for the constructor.
 * 
 * @typedef {Object} module:meteoJS/thermodynamicDiagramPluggable~options
 * @param {external:HTMLElement} [renderTo] - Element to render diagram into.
 * @param {integer} [width=undefined] - Width of the whole container.
 * @param {integer} [height=undefined] - Height of the whole container.
 */

/**
 * Class to draw a SVG thermodynamic diagram.
 * 
 * <pre><code>import ThermodynamicDiagramPluggable from 'meteoJS/thermodynamicDiagramPluggable';</code></pre>
 * 
 * @extends module:meteoJS/base/collection.Collection
 */
export class ThermodynamicDiagramPluggable extends Collection {
  
  /**
   * @param {module:meteoJS/thermodynamicDiagram~options} options - Options.
   */
  constructor({
    renderTo = undefined,
    width = undefined,
    height = undefined
  } = {}) {
    super({
      fireReplace: false,
      fireAddRemoveOnReplace: true,
      emptyObjectMaker: () => new DiagramSounding()
    });
    
    /**
     * @type external:SVG
     * @private
     */
    this._svgNode =
      (renderTo === undefined || 'node' in renderTo || 'instance' in renderTo)
        ? SVG(renderTo) : SVG().addTo(renderTo);
    if (width !== undefined ||
        height !== undefined)
      this._svgNode.size(width, height);
    else if (width === undefined &&
             height === undefined &&
             renderTo !== undefined &&
             'getBoundingClientRect' in renderTo) {
      let boundingRect = renderTo.getBoundingClientRect(); // size incl. padding
      let computedStyle = window.getComputedStyle(renderTo);
      this._svgNode.size(
        boundingRect.width -
        parseFloat(computedStyle.getPropertyValue('padding-left')) -
        parseFloat(computedStyle.getPropertyValue('padding-right')),
        boundingRect.height - 
        parseFloat(computedStyle.getPropertyValue('padding-top')) -
        parseFloat(computedStyle.getPropertyValue('padding-bottom'))
      );
    }
    
    /**
     * @type Set.<module:meteoJS/thermodynamicDiagram/plotArea.PlotArea>
     * @private
     */
    this._plotAreas = new Set();
    
    // PlotAltitudeDataArea objects
    this._svgNode.on('mousemove', e => {
      for (let plotArea of this._plotAreas)
        if ('isHoverLabelsRemote' in plotArea)
          plotArea.svgNode.dispatchEvent(e);
    });
    this._svgNode.on('mouseout', e => {
      if (this._svgNode.node === e.target)
        for (let plotArea of this._plotAreas)
          if ('_hoverLabelsGroup' in plotArea)
            plotArea._hoverLabelsGroup.clear();
    });
    
    // PlotDataArea objects
    this.on('add:item', sounding => {
      for (let plotArea of this._plotAreas)
        if ('addSounding' in plotArea)
          plotArea.addSounding(sounding);
    });
    this.on('remove:item', sounding => {
      for (let plotArea of this._plotAreas)
        if ('removeSounding' in plotArea)
          plotArea.removeSounding(sounding);
    });
  }

  /**
   * SVG object of the complete diagram.
   * 
   * @type external:SVG
   * @readonly
   */
  get svgNode() {
    return this._svgNode;
  }
  
  /**
   * Appends a PlotArea object to this thermodynamic diagram.
   * 
   * @param {module:meteoJS/thermodynamicDiagram/plotArea.PlotArea} plotArea
   *   PlotArea object.
   * @returns {module:meteoJS/thermodynamicDiagramPluggable.ThermodynamicDiagramPluggable}
   *   This.
   */
  appendPlotArea(plotArea) {
    if (this._plotAreas.has(plotArea))
      return;
    
    this._plotAreas.add(plotArea);
    
    plotArea.addTo(this.svgNode);
    for (let sounding of this)
      if ('addSounding' in plotArea)
        plotArea.addSounding(sounding);
    
    return this;
  }
  
  /**
   * Removes a PlotArea object from this thermodynamic diagram.
   * 
   * @param {module:meteoJS/thermodynamicDiagram/plotArea.PlotArea} plotArea
   *   PlotArea object.
   * @returns {module:meteoJS/thermodynamicDiagramPluggable.ThermodynamicDiagramPluggable}
   *   This.
   */
  removePlotArea(plotArea) {
    if (!this._plotAreas.has(plotArea))
      return;
    
    for (let sounding of this)
      plotArea.removeSounding(sounding);
    this._plotAreas.delete(plotArea);
    
    return this;
  }
  
  /**
   * Exchanges the coordinate system in the PlotArea objects. The optional,
   * second argument defines an already used coordinate system. If this
   * argument is passed, only the coordinate system of the PlotArea's with
   * this coordinate system will exchanged.
   * 
   * @param {module:meteoJS/thermodynamicDiagram/coordinateSystem.CoordinateSystem}
   *   coordinateSystem - Coordinate system.
   * @param {module:meteoJS/thermodynamicDiagram/coordinateSystem.CoordinateSystem}
   *   [formerCoordinateSystem=undefined] - Coordinate system.
   */
  exchangeCoordinateSystem(
    coordinateSystem,
    formerCoordinateSystem = undefined
  ) {
    for (let plotArea of this._plotAreas)
      if (formerCoordinateSystem === undefined ||
          plotArea.coordinateSystem === formerCoordinateSystem)
        plotArea.coordinateSystem = coordinateSystem;
  }
  
  /**
   * Add a sounding to the diagram.
   * 
   * @param {module:meteoJS/sounding.Sounding} sounding - Sounding object.
   * @param {module:meteoJS/thermodynamicDiagram/diagramSounding~options}
   *   [options] - Display options.
   * @returns {module:meteoJS/thermodynamicDiagram/diagramSounding.DiagramSounding}
   *   Sounding object for the diagram with display options.
   */
  addSounding(sounding, options = {}) {
    let diagramSounding = new DiagramSounding(sounding, options);
    let i = 1;
    let id = `sounding-${i}`;
    while (this.containsId(id)) {
      i++;
      id = `sounding-${i}`;
    }
    diagramSounding.id = id;
    this.append(diagramSounding);
    return diagramSounding;
  }
  
}
export default ThermodynamicDiagramPluggable;