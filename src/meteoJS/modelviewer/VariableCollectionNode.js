/**
 * @module meteoJS/modelviewer/variableCollectionNode
 */

/**
 * Setzt Hierarchie der VariableCollections. Muss mehrere Parents haben. Bspw.
 * Offset hat mehrere Levels/Accumul. als Parent(). Auch Field hat mehrere Parents,
 * nämlich Region, Punkt, Querschnitt, etc.
 * 
 * @fires addChild (oder so?)
 */
export class VariableCollectionNode {
  
  /**
   * @returns {VariableCollection}
   */
  get variableCollection() {
  }
  
  /**
   * @returns {VariableCollection[]}
   */
  get parents() {
  }
  
  /**
   * @returns {VariableCollection[]}
   */
  get children() {
  }
}
export default VariableCollectionNode;