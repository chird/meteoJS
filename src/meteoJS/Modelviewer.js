/**
 * @module meteoJS/modelviewer
 */
import Collection from './base/Collection.js';
//import Timeline from './Timeline.js';
import addEventFunctions from './Events.js';
class Timeline {};
addEventFunctions(Timeline.prototype);

/**
 * Options for constructor.
 * 
 * @typedef {Object} module:meteoJS/modelviewer~options
 * @param {module:meteoJS/timeline.Timeline} [timeline]
 *   Shared Timeline between containers.
 * @param {module:meteoJS/modelviewer/resources.Resources} resources
 *   Available resources.
 * @param {jQuery} containers jQuery-Node to append containers.
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
                timeline = undefined } = {}) {
    super({
      fireReplace: false,
      fireAddRemoveOnReplace: true
    });
    
    /**
     * @type module:meteoJS/timeline.Timeline
     * @private
     */
    this._timeline = (timeline === undefined) ? new Timeline: timeline;
    
    /**
     * @type module:meteoJS/modelviewer/resources.Resources
     * @private
     */
    this._resources = resources;
    
    this.on('add:item', container => container.modelviewer = this);
    this.on('remove:item', container => container.modelviewer = undefined);
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
   * Resources.
   * 
   * @type module:meteoJS/modelviewer/resources.Resources
   * @readonly
   */
  get resources() {
    return this._resources;
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
}
export default Modelviewer;