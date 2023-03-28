/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin"); // 配置html

const { WebpackPluginPages } = require("../../dist/index.cjs");

module.exports = {
  entry: {
    app: {
      import: path.resolve(process.cwd(), "src/main.tsx"),
    },
  },
  module: {
    rules: [
      // 解析ts与tsx文件
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "swc-loader",
            options: {
              cacheDirectory: true, // 开启swc编译缓存
              cacheCompression: false, // 缓存文件不要压缩
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
    extensions: [".js", ".ts", ".tsx", ".json", ".wasm"],
    modules: ["node_modules"],
  },
  stats: "minimal",
  plugins: [
    new HtmlWebpackPlugin({
      title: "examples",
      filename: "index.html", // 打包后的文件名
      template: path.resolve(process.cwd(), "public/index.html"), // 打包的 html
      chunks: ["app"], // 对于 entry 配置
    }),
    new WebpackPluginPages(),
  ],
};
