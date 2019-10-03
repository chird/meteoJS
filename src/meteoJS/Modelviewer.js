/**
 * @module meteoJS/modelviewer
 */
import Collection from './base/Collection.js';
//import Timeline from './Timeline.js';
import addEventFunctions from './Events.js';
class Timeline {};
addEventFunctions(Timeline.prototype);

/**
 * Makes a HTML node for a container that is appended to a modelviewer.
 * 
 * @typedef {Function} module:meteoJS/modelviewer~makeContainerNode
 * @param {module:meteoJS/modelviewer.Modelviewer} modelviewer
 *   Modelviewer, that contains the container.
 * @param {module:meteoJS/modelviewer/container.Container} container
 *   Container to append.
 * @returns {HTMLElement} Top node of the appended container.
 */

/**
 * Options for constructor.
 * 
 * @typedef {Object} module:meteoJS/modelviewer~options
 * @param {module:meteoJS/modelviewer/resources.Resources} resources
 *   Available resources.
 * @param {HTMLElement} containersNode Node to append the containers.
 * @param {module:meteoJS/timeline.Timeline} [timeline]
 *   Shared Timeline between containers.
 * @param {module:meteoJS/modelviewer~makeContainerNode} [makeContainerNode]
 *   Function to create the top node of each container.
 */

/**
 * @classdesc
 
 * Beinhaltet sicher Timeline und Resources
 * Entscheidet über das Design der Container (auch Darstellungsbreite -> entsprechend welche Navigation)
 * Wie kann der User die Anordnung der Container ändern?
   * Dies soll für Bootstrap aber auch allg. funktionieren
   * Wie soll dazu die Navigation angepasst werden können
 * Handelt wahrscheinlich die Darstellung der Container (irgendwie…)
 * Eigentlich wäre gut, wenn auch keine Abhängikeit von jQuery… (geht das?)
 * Output Container -> Modelviewer
   * Kann entweder nur ein Bild/Sounding/etc. anzeigen
   * Kann je nach dem auch noch Navigation(en) ausgeben
   * Je nach Output unterschiedlicher Aufbau des Container-div's
   * Wie übergibt man diesem Objekt die Darstellung (z.B. der Navigation)
   * Navigation muss sich anpassen (Änderung einer Collection, Änderung der Resource, …)
 * Wie löst man das Vererben der Anzeige des vorangegangenen Containers -> Modelviewer
 * Wie löst man, dass öffnen eines nächsten Runs vom vorangegangenen Container -> Modelviewer
 * Bei Image -> hover funktion -> Modelviewer
 * Bei Image -> Überblenden von Punkten für z.B. Ensembles -> Modelviewer
 * Default-Navigation mit <select>-Nodes. -> Modelviewer
 * 2te Default-Navigation mit vertikal angeordneten Listen -> Modelviewer
 * Keydown für Zeitnavigation -> über Timeline-Module lösen (auch die Zeit-Navigations-Buttons...)
 
 * @fires module:meteoJS/modelviewer#
 */
export class Modelviewer extends Collection {
  
  /**
   * @param {module:meteoJS/modelviewer~options} options - Options.
   */
  constructor({ resources,
                containersNode,
                timeline = undefined,
                makeContainerNode = undefined } = {}) {
    super({
      fireReplace: false,
      fireAddRemoveOnReplace: true
    });
    
    /**
     * @type module:meteoJS/modelviewer/resources.Resources
     * @private
     */
    this._resources = resources;
    
    /**
     * @type HTMLElement
     * @private
     */
    this._containersNode = containersNode;
    
    /**
     * @type module:meteoJS/timeline.Timeline
     * @private
     */
    this._timeline = (timeline === undefined) ? new Timeline: timeline;
    
    /**
     * @type undefined|Function
     * @private
     */
    this._makeContainerNode = makeContainerNode;
    
    this.on('add:item', container => {
      container.modelviewer = this;
      if (container.display !== undefined)
        container.display.parentNode = this._getContainerNode(container);
    });
    this.on('remove:item', container => {
      container.modelviewer = undefined;
      if (container.display !== undefined)
        container.display.parentNode = undefined;
    });
  }
  
  /**
   * Resources.
   * 
   * @type module:meteoJS/modelviewer/resources.Resources
   * @readonly
   */
  get resources() {
    return this._resources;
  }
  
  /**
   * Node to append the container's node into.
   * 
   * @type HTMLElement
   * @readonly
   */
  get containersNode() {
    return this._containersNode;
  }
  
  /**
   * Timeline.
   * 
   * @type module:meteoJS/timeline.Timeline
   * @readonly
   */
  get timeline() {
    return this._timeline;
  }
  
  /**
   * Appends container(s).
   * 
   * @param {...module:meteoJS/modelviewer/container.Container} containers
   *   New containers.
   * @returns {module:meteoJS/modelviewer.Modelviewer} This.
   * @override
   */
  append(...containers) {
    let ids = [...this.itemIds];
    containers
    .filter(container => container.id !== undefined)
    .forEach(container => ids.push(container.id));
    containers
    .filter(container => container.id === undefined)
    .forEach(container => {
      let i = 1;
      let id = `container${i}`;
      while (ids.indexOf(id) > -1) {
        i++;
        id = `container${i}`;
      }
      container.id = id;
      ids.push(id);
    });
    super.append(...containers);
    return this;
  }
  
  /**
   * Creates a HTMLElement to append the container content into it. This
   * element is appended to the containersNode.
   * 
   * @param {module:meteoJS/modelviewer/container.Container} container
   *   Create Node for this container.
   * @returns {HTMLElement} Node.
   * @private
   */
  _getContainerNode(container) {
    if (this._makeContainerNode !== undefined)
      return this._makeContainerNode.call(this, container);
    else {
      let containerNode = document.createElement('div');
      if (this.containersNode !== undefined)
        this.containersNode.append(containerNode);
      return containerNode;
    }
  }
}
export default Modelviewer;