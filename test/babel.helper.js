const register = require('@babel/register');
register({
  ignore: []
});
require('@babel/polyfill');