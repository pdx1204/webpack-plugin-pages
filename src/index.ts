import path from "path";
import webpack from "webpack";
import { handle } from "./generate";
import chokidar from "chokidar";
import { ALLOW_SUFFIX } from "./constants";

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

      if (compiler.options.mode === "production") return;

      const watchPath = path.join(this.pagesPath, "**/*");
      // 递归监听文件夹变化
      const watcher = chokidar.watch(watchPath, {
        ignoreInitial: true, // 忽略第一次变化
      });
      watcher.on("all", (eventName, filePath) => {
        console.log(eventName, filePath);
        if (ALLOW_SUFFIX.includes(path.extname(filePath))) handle(this.pagesPath, this.options.out);
      });
    });
  }
}
