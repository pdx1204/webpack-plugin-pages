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

  constructor(
    options: WebpackPluginPagesOptions = { path: "src/pages", out: ".routes" },
  ) {
    this.options = options;
    this.pagesPath = path.resolve(process.cwd(), this.options.path);
    console.log(this.pagesPath);
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.entryOption.tap(
      "WebpackPluginPages",
      (context: string, entry: webpack.EntryNormalized) => {
        handle(this.pagesPath, this.options.out);
        return true;
      },
    );

    compiler.hooks.afterCompile.tapAsync(
      "WebpackPluginPages",
      async (compilation: webpack.Compilation, callback) => {
        const watcher = fs.watch(this.pagesPath);
        for await (const event of watcher) {
          console.log(event);
          if (ALLOW_SUFFIX.includes(path.extname(event.filename)))
            handle(this.pagesPath, this.options.out);
        }
        callback();
      },
    );
  }
}
