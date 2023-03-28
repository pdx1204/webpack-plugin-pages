/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

const devConfig = merge(common, {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  plugins: [],
});

module.exports = devConfig;
