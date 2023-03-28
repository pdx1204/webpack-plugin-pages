import path from "path";
import fs from "fs/promises";
import webpack from "webpack";
import { handle } from "./generate";
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
      handle(this.pagesPath, this.options.out);
    });
    // 编译器关闭时监听文件变化
    compiler.hooks.shutdown.tapAsync("WebpackPluginPages", async () => {
      // 递归监听文件夹变化
      const watcher = fs.watch(this.pagesPath, { recursive: true });
      for await (const event of watcher) {
        console.log(event);
        if (ALLOW_SUFFIX.includes(path.extname(event.filename)))
          handle(this.pagesPath, this.options.out);
      }
    });
  }
}
