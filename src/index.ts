import path from "path";
import fs from "fs/promises";
import webpack from "webpack";
import { handle } from "./generateRoutes";

export class WebpackPluginPages {
  apply(compiler: webpack.Compiler) {
    compiler.hooks.entryOption.tap(
      "WebpackPluginPages",
      (context: string, entry: webpack.EntryNormalized) => {
        console.log(context, entry);
        handle(context);
        return true;
      },
    );
    compiler.hooks.afterCompile.tapAsync(
      "WebpackPluginPages",
      async (compilation, callback) => {
        const folderPath = path.resolve(compiler.context, "src/pages");
        const watcher = fs.watch(folderPath, { recursive: true });
        for await (const event of watcher) console.log(event);
        callback();
      },
    );
  }
}
