require('core-js/stable');
require('regenerator-runtime/runtime');
const ignoreStyles = require('ignore-styles');
ignoreStyles.default(undefined, (module, filename) => {
  if (/\.svg$/.test(filename))
    module.exports = '<svg>SVG test node</svg>';
});
const register = require('@babel/register');
register({
  ignore: [
    /\/utils\.js$/
  ]
});