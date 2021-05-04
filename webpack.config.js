const path = require("path");
const webpack = require("webpack");
const packageJSON = require("./package.json");

module.exports = {
  mode: "production",
  entry: {
    "meteoJS.min": "./src/meteoJS/index.js",
  },
  devtool: "source-map",
  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: 'babel-loader'
      }
    }, {
      test: /\.svg$/,
      include: [
        path.resolve(__dirname, 'node_modules/bootstrap-icons')
      ],
      loader: "raw-loader"
    }]
  },
  output: {
    path: path.resolve(__dirname, "."),
    filename: "[name].js",
    library: "meteoJS",
    libraryTarget: "var"
  },
  externals: [{
    'popper.js': 'Poppers',
    jquery: 'jQuery',
    leaflet: 'L',
    '@svgdotjs/svg.js': 'SVG'
  },
  function (context, request, callback) {
    if (/^ol($|\/)/.test(request))
      return callback(null, request.replace(/\//g, '.'));
    if (/^bootstrap($|\/)/.test(request) ||
        (/\/bootstrap($|\/)/.test(context) &&
         /\.\//.test(request)))
      return callback(null, 'bootstrap');
    callback();
  }],
  plugins: [
    new webpack.BannerPlugin({
      banner: 'var SVG = SVG ? SVG : {}; var jQuery = jQuery ? jQuery : {}; var ol = ol ? ol : { layer: {}, source: {}, format: {}, style: {} }; var Popper = Popper ? Popper : {}; var bootstrap = bootstrap ? bootstrap : {};',
      raw: true
    }),
    new webpack.BannerPlugin(`/*meteoJS v${packageJSON.version} | (c) ${packageJSON.author.name} | https://chird.github.io/meteoJS/LICENSE*/`)
  ]
};