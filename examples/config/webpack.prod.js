/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

const CopyWebpackPlugin = require("copy-webpack-plugin"); // 复制文件

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  output: {
    path: path.resolve(process.cwd(), "dist"),
    filename: "js/[name].js",
    // webpack5.20+ 功能:CleanWebpackPlugin
    clean: true,
  },
  plugins: [
    // 将public下面的资源复制到dist目录去（除了index.html）
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(process.cwd(), "public"),
          to: path.resolve(process.cwd(), "dist"),
          toType: "dir",
          noErrorOnMissing: true, // 不生成错误
          globOptions: {
            // 忽略文件
            ignore: ["**/index.html"],
          },
          info: {
            // 跳过terser压缩js
            minimized: true,
          },
        },
      ],
    }),
  ],
});
