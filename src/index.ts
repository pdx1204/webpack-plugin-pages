import path from "path";
import webpack from "webpack";
import { handle } from "./generate";
import chokidar from "chokidar";

type WebpackPluginPagesOptions = {
  path: string;
  out: string;
};

export class WebpackPluginPages {
  private options: WebpackPluginPagesOptions;
  private pagesPath: string;

  constructor(options: WebpackPluginPagesOptions = { path: "src/pages", out: ".routes" }) {
    this.options = options;
    this.pagesPath = path.resolve(process.cwd(), this.options.path);
    console.log(this.pagesPath);
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.afterPlugins.tap("WebpackPluginPages", () => {
      const outDir = path.resolve(process.cwd(), this.options.out);
      handle(this.pagesPath, outDir);

      const watchPath = path.join(this.pagesPath, "**/*.{jsx,tsx}");
      console.log(watchPath);

      // 递归监听文件夹变化
      const watcher = chokidar.watch(watchPath, {
        ignoreInitial: true, // 忽略第一次变化
      });
      watcher.on("add", (filePath) => {
        console.log(filePath);
        handle(this.pagesPath, outDir);
      });
      watcher.on("unlink", (filePath) => {
        console.log(filePath);
        handle(this.pagesPath, outDir);
      });
    });
  }
}
