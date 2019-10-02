/**
 * @module meteoJS/base/named
 */

/**
 * Options for constructor.
 * 
 * @typedef {Object} module:meteoJS/base/named~options
 * @param {string} [name] - Default name.
 * @param {Object.<string,string>} [names] - Names.
 * @param {string[]} [langSortation] - Priority of language codes.
 */

/**
 * @classdesc Class with a name in different languages.
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
    this.defaultName = name;
    /**
     * @type Object
     * @private
     */
    this.names = names;
    /**
     * @type Array
     * @private
     */
    this.langSortation = langSortation;
  }
  
  /**
   * Default name.
   * @type {string}
   */
  get name() {
    return this.getNameByLang();
  }
  
  /**
   * @param {string} [lang] - Language code.
   * @param {Object} [options] - Options.
   * @param {string[]} [options.langSortation] - Priority of language codes.
   * @returns {string} Name in the passed or a fallback language.
   */
  getNameByLang(lang = undefined, { langSortation = undefined } = {}) {
    let lS =
      (langSortation === undefined) ? this.langSortation : langSortation;
    let langs = Object.keys(this.names);
    if (langs.length < 1)
      return (this.defaultName === undefined) ? '' : this.defaultName;
    return this.names[langs.sort((a, b) => {
      if (a == lang) return -1;
      if (b == lang) return 1;
      let ia = lS.indexOf(a);
      let ib = lS.indexOf(b);
      if (ib < 0) return 0;
      if (ia < 0) return 1;
      return ia < ib ? -1 : ia == ib ? 0 : 1;
    })[0]];
  }
  
  /**
   * @param {string} lang - Language code.
   * @returns {string} Name in the passed language.
   */
  getNameByLangNoFallback(lang) {
    return (lang in this.names)  ? this.names[lang] : '';
  }
}
export default Named;