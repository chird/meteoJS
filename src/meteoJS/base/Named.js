/**
 * @module meteoJS/base/named
 */

/**
 * Options for constructor.
 * 
 * @typedef {Object} module:meteoJS/base/named~options
 * @property {string} [name] - Default name.
 * @property {Object.<string,string>} [names] - Names.
 * @property {string[]} [langSortation] - Priority of language codes.
 */

/**
 * Class with a name in different languages.
 */
export class Named {
  
  /**
   * @param {module:meteoJS/base/named~options} [options] - Options.
   */
  constructor({ name = undefined, names = {}, langSortation = [] } = {}) {
    /**
     * @type undefined|string
     * @private
     */
    this._name = name;
    
    /**
     * @type Object<string,string>
     * @private
     */
    this._names = names;
    
    /**
     * @type string[]
     * @private
     */
    this._langSortation = langSortation;
  }
  
  /**
   * Default name.
   * 
   * @type {string}
   */
  get name() {
    return this.getDefaultName();
  }
  set name(name) {
    this._name = name;
  }
  
  /**
   * Returns the name in the passed language.
   * 
   * @param {string} lang - Language code.
   * @returns {string} Name in the passed language.
   */
  getNameByLangNoFallback(lang) {
    return (lang in this._names)  ? this._names[lang] : '';
  }
  
  /**
   * Sets the name of a certain language. Pass undefined to delete name.
   * 
   * @param {string} lang - Language code.
   * @param {string} name - Name.
   */
  setNameByLang(lang, name) {
    this._names[lang] = name;
    if (name === undefined)
      delete this._names[lang];
  }
  
  /**
   * Default order of the languages.
   * 
   * @type string[]
   */
  get langSortation() {
    return this._langSortation;
  }
  set langSortation(langSortation) {
    this._langSortation = langSortation;
  }
  
  /**
   * Default name.
   * 
   * @returns {string}
   * @protected
   */
  getDefaultName() {
    return (this._name !== undefined) ? this._name : this.getNameByLang();
  }
  
  /**
   * Returns a name, if available in the passed language, otherwise in a
   * fallback language.
   * 
   * @param {string} [lang] - Language code.
   * @param {Object} [options] - Options.
   * @param {string[]} [options.langSortation] - Priority of language codes.
   * @returns {string} Name in the passed or a fallback language.
   */
  getNameByLang(lang = undefined, { langSortation = undefined } = {}) {
    let lS =
      (langSortation === undefined) ? this._langSortation : langSortation;
    let langs = Object.keys(this._names);
    if (langs.length < 1)
      return (this._name === undefined) ? '' : this._name;
    return this._names[langs.sort((a, b) => {
      if (a == lang) return -1;
      if (b == lang) return 1;
      let ia = lS.indexOf(a);
      let ib = lS.indexOf(b);
      if (ib < 0) return 0;
      if (ia < 0) return 1;
      return ia < ib ? -1 : ia == ib ? 0 : 1;
    })[0]];
  }
}
export default Named;