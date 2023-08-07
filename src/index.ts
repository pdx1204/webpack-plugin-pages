import path from "path";
import webpack from "webpack";
import { generateRouterView, handle } from "./generate";
import chokidar from "chokidar";
import { ALLOW_SUFFIX, DEFAULT_WEBPACK_PLUGIN_PAGES_OPTIONS } from "./constants";

type WebpackPluginPagesOptions = {
  path: { pages: string; layout: string };
  extensions: {
    files: string[];
    dirs: string[];
  };
  outFolderPath: string;
  fallback: React.ReactNode;
};

export class WebpackPluginPages {
  private options: WebpackPluginPagesOptions;
  private pagesPath: string;

  constructor(options: WebpackPluginPagesOptions) {
    this.options = {
      ...DEFAULT_WEBPACK_PLUGIN_PAGES_OPTIONS,
      ...options,
    };
    this.pagesPath = path.resolve(process.cwd(), this.options.path.pages);
  }

  apply(compiler: webpack.Compiler) {
    const { path: currentPath, extensions, outFolderPath, fallback } = this.options;
    compiler.hooks.afterPlugins.tap("WebpackPluginPages", async () => {
      const outDir = path.resolve(process.cwd(), outFolderPath);

      await handle(this.pagesPath, currentPath.layout, extensions, outDir);
      await generateRouterView(fallback);

      if (compiler.options.mode === "production") return;

      const watchPath = path.join(this.pagesPath, "**/*");
      // 递归监听文件夹变化
      const watcher = chokidar.watch(watchPath, {
        ignoreInitial: true, // 忽略第一次变化
      });
      watcher.on("all", (eventName, filePath) => {
        console.log(eventName, filePath);
        if (ALLOW_SUFFIX.includes(path.extname(filePath)))
          handle(this.pagesPath, currentPath.layout, extensions, outFolderPath);
      });
    });
  }
}
