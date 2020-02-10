/**
 * @module meteoJS/synview/typeCollection
 */
import Collection from '../base/Collection.js';
import Type from './Type.js';

/**
 * Options for constructor.
 * 
 * @typedef {Object} module:meteoJS/synview/typeCollection~options
 * @param {boolean} [exclusiveVisibility=false]
 *   At the same time, only one single type is visible.
 * @param {boolean} [syncVisibility=false]
 *   If the visibility of a type changes, all other types are also adjusted.
 *   If exclusiveVisibility is set to true, this will be ignored.
 */

/**
 * Collection of {@link module:meteoJS/synview/type.Type}-objects. With the
 * {@link module:meteoJS/synview/typeCollection~options|Options}, you could
 * ensure, that only a single type of this collection is visible. Or that all
 * types of this collection are synchronously visible. This class implements
 * the Symbol.iterator interface like its parent class.
 * 
 * @extends module:meteoJS/base/collection.Collection
 */
export class TypeCollection extends Collection {
  
  /**
   * @param {module:meteoJS/synview/typeCollection~options} options - Options.
   */
  constructor({
    exclusiveVisibility = false,
    syncVisibility = false
  } = {}) {
    super({
      fireReplace: false,
      fireAddRemoveOnReplace: true,
      emptyObjectMaker: () => new Type()
    });
    
    /**
     * @type boolean
     * @private
     */
    this.exclusiveVisibility = exclusiveVisibility;
    
    /**
     * @type boolean
     * @private
     */
    this.syncVisibility = syncVisibility;
  }
  
  /**
   * Append type to this collection. If type with same ID is present, the type
   * will be exchanged.
   * 
   * @override
   * @param {...module:meteoJS/synview/type.Type} type Type.
   * @return {module:meteoJS/synview/typeCollection.TypeCollection} This.
   */
  append(...types) {
    types.forEach(type => {
      if (this.exclusiveVisibility &&
          type.getVisible() &&
          this.isVisible())
        type.setVisible(false);
      else if (this.syncVisibility) {
        if (type.getVisible()) {
          if (!this.isVisible())
            this.items.forEach(t => t.setVisible(true));
        }
        else {
          if (this.isVisible())
            type.setVisible(true);
        }
      }
      
      type.on('change:visible', () => {
        if (this.exclusiveVisibility) {
          if (type.getVisible())
            this.items.forEach(t => {
              if (t.id != type.id)
                t.setVisible(false);
            });
        }
        else if (this.syncVisibility) {
          this.items.forEach(t => {
            if (t.id != type.id)
              t.setVisible(type.getVisible());
          });
        }
      });
      super.append(type);
    });
    return this;
  }
  
  /**
   * Returns the types of this collection with getVisible() == true.
   * 
   * @return {module:meteoJS/synview/type.Type[]} Types.
   */
  getVisibleTypes() {
    return this.items.filter(type => type.getVisible());
  }
  
  /**
   * Returns, if at least one type is visible.
   * 
   * @return {boolean}
   */
  isVisible() {
    return this.getVisibleTypes().length > 0;
  }
  
  /**
   * Sets the option exclusiveVisibility.
   * If several types are visible and this will be set to true, then the first
   * type in the getItems() iterator will stay visible.
   * 
   * @return {module:meteoJS/synview/typeCollection.TypeCollection} This.
   */
  setExclusiveVisibility(exclusiveVisibility) {
    if (this.exclusiveVisibility != exclusiveVisibility &&
        exclusiveVisibility) {
      let isVisibleType = false;
      this.items.forEach(t => {
        if (!isVisibleType)
          isVisibleType = t.getVisible();
        else
          t.setVisible(false);
      });
    }
    this.exclusiveVisibility = exclusiveVisibility;
    return this;
  }
  
  /**
   * Sets the option syncVisibility.
   * If any type is visible and this will be set to true, then every type will
   * be set visible.
   * 
   * @return {module:meteoJS/synview/typeCollection.TypeCollection} This.
   */
  setSyncVisibility(syncVisibility) {
    if (this.syncVisibility != syncVisibility &&
        syncVisibility &&
        this.isVisible()) {
      this.items.forEach(t => t.setVisible(true));
    }
    this.syncVisibility = syncVisibility;
    return this;
  }
  
}
export default TypeCollection;