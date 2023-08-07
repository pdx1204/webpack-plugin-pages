import fs from "fs/promises";
import path from "path";
import {
  ALLOW_SUFFIX,
  DEPS_TEXT,
  EXPORT_TEXT,
  IMPORT_TEXT,
  ROUTER_VIEW_TEXT,
  TYPE_TEXT,
} from "./constants";
import prettier from "prettier";

export async function generateRouterView(fallback: React.ReactNode) {
  const outPath = path.resolve(process.cwd(), ".routes/RouterView.tsx");
  try {
    await fs.access(outPath);
    await fs.rm(outPath);
  } catch (error) {
    // console.log(error);
  }

  const formatStr = await prettier.format(ROUTER_VIEW_TEXT(fallback), { parser: "babel-ts" });
  fs.writeFile(outPath, formatStr, "utf8");
}

const otherRoutePathMap: { [key: string]: string } = {
  "/404": "*",
};

export async function generateRoutes(
  pagesPath: string,
  extensions: {
    files: string[];
    dirs: string[];
  },
  isLayout: boolean,
  template = "",
  routeP = "/"
) {
  const files = await fs.readdir(pagesPath);

  for (const filename of files) {
    const fileDir = path.join(pagesPath, filename);
    const filehandle = await fs.open(fileDir);
    const stat = await filehandle.stat();
    await filehandle.close();
    const isFile = stat.isFile();
    const isDir = stat.isDirectory();
    const suffix = path.extname(filename);
    const removeSuffixPath = filename.replace(suffix, "");

    if (isFile && ALLOW_SUFFIX.includes(suffix)) {
      // 过滤掉 styled 文件
      if (extensions.files.includes(removeSuffixPath)) continue;

      // 路由路径
      const rp = removeSuffixPath === "index" ? routeP : routeP + removeSuffixPath;
      const filePath = rp.length > 1 && rp[rp.length - 1] === "/" ? rp.slice(0, -1) : rp;

      // 动态路由
      let routePath = otherRoutePathMap[filePath] ?? filePath;
      if (routePath.search(/\[.+\]/) !== -1)
        routePath = routePath.replace(/\[.+\]/, `:${routePath.match(/\[.+\]/)?.[0].slice(1, -1)}`);

      template = parseRouteTemplate(isLayout, routePath, template, filePath);
    }
    if (isDir) {
      // 排除 components 文件夹
      if (extensions.dirs.includes(filename)) continue;

      //递归，如果是文件夹，就继续遍历该文件夹下面的文件
      template = await generateRoutes(
        fileDir,
        extensions,
        isLayout,
        template,
        `${routeP}${filename}/`
      );
    }
  }
  return template;
}

export const handle = async (
  pagesPath: string,
  layoutPath: string,
  extensions: {
    files: string[];
    dirs: string[];
  },
  outDir: string
) => {
  let isLayout = false;
  const fullLayoutPath = path.join(process.cwd(), layoutPath);
  try {
    await fs.access(fullLayoutPath);
    isLayout = true;
  } catch (error) {
    console.log("没有layouts文件夹");
  }

  const routesText = await generateRoutes(pagesPath, extensions, isLayout);

  const template = await prettier.format(
    `${DEPS_TEXT(isLayout)}\n${TYPE_TEXT}\n${IMPORT_TEXT}\n${EXPORT_TEXT(routesText)}`,
    {
      parser: "babel-ts",
    }
  );

  try {
    await fs.mkdir(outDir, { recursive: true });
  } catch (error) {
    // console.log(error);
  }
  const outPath = path.resolve(outDir, "index.ts");

  try {
    await fs.access(outPath);
    await fs.rm(outPath);
  } catch (error) {
    // console.log(error);
  }

  fs.writeFile(outPath, template, "utf8");
};

function parseRouteTemplate(
  isLayout: boolean,
  routePath: string,
  template: string,
  filePath: string
) {
  if (isLayout) {
    // 不需要使用布局
    if (routePath.endsWith("@") || routePath === "*") {
      if (routePath.endsWith("index@")) {
        routePath = routePath.replace("/index@", "");
        if (routePath === "") routePath = "/";
      } else {
        routePath = routePath.replace("@", "");
      }
      template += `
          {
            path: '${routePath}',
            component: _import('${filePath}'),
          },`;
    } else {
      template += `
          {
            path: '${routePath}',
            component: Layout,
            children: [
              {
                index: true,
                component: _import('${filePath}'),
              }
            ],
          },`;
    }
  } else {
    template += `
        {
          path: '${routePath}',
          component: _import('${filePath}'),
          children: []
        },`;
  }
  return template;
}
