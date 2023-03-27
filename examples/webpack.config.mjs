import path from "path";
import { WebpackPluginPages } from "../dist/index.mjs";

const devConfig = {
  mode: "development",
  entry: {
    index: path.resolve(process.cwd(), "src/index.ts"),
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
  plugins: [new WebpackPluginPages()],
  stats: "minimal",
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
    extensions: [".js", ".ts", ".tsx", ".json", ".wasm"],
    modules: ["node_modules"],
  },
};

export default devConfig;
