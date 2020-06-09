const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

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
    }]
  },
  output: {
    path: path.resolve(__dirname, "."),
    filename: "[name].js",
    library: "meteoJS",
    libraryTarget: "var"
  },
  externals: {
    jquery: '$',
    leaflet: 'L',
    ol: 'ol',
    svgjs: 'SVG'
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: 'meteoJS v1.6.0 | (c) Ivo Sonderegger, SRF Meteo | https://chird.github.io/meteoJS/LICENSE'
    })
  ]
};