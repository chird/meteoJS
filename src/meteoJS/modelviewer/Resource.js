/**
 * @module meteoJS/modelviewer/resource
 */

/**
 * Objekt für ein Modelplot oder ein Sounding
 */
export class Resource {
  
  get keys() {
  }
  
  getVariable(key) {
  }
  setVariable(key, variable) {
  }
  
  // XXX: Könnten so alle Soundings zu einem Ort aber zu allen Zeiten geladen werden?
  get url() {
  }
  // XXX: Ev. Lösung, dass mehreres geladen werden kann. Direkt Daten angeben. (besser Weg zum Laden der Daten)
  get data() {
  }
}
export default Resource;