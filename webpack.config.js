const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: "production",
  entry: {
    "meteoJS": "./dist/meteoJS/index.js",
    "meteoJS.min": "./dist/meteoJS/index.js",
  },
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "."),
    filename: "[name].js",
    library: "meteoJS",
    libraryTarget: "var"
  },
  optimization: {
    minimize: true,
    minimizer: [new UglifyJsPlugin({
      include: /\.min\.js$/
    })]
  },
  externals: {
    jquery: '$',
    leaflet: 'L',
    ol: 'ol',
    svgjs: 'SVG'
  }
};