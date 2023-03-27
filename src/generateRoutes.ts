let template =
  `
import {
  LazyExoticComponent,
  MemoExoticComponent,
  ComponentType,
  lazy,
} from "react";

export type RouteType = {
  path?: string;
  index?: boolean;
  component?:
    | LazyExoticComponent<ComponentType<unknown>>
    | MemoExoticComponent<ComponentType>;
  children?: RouteType[];
};
\nconst _import = (path: string) => lazy(() => import(`@/pages/\${path}\`));\nexport const routes: RouteType[] = [`;

import fs from "fs/promises";
import path from "path";

export async function generateRoutes(pagesPath: string, routePath = "/") {
  const files = await fs.readdir(pagesPath);

  for (const filename of files) {
    const fileDir = path.join(pagesPath, filename);
    const filehandle = await fs.open(fileDir);
    const stat = await filehandle.stat();
    await filehandle.close();
    const isFile = stat.isFile();
    const isDir = stat.isDirectory();
    const removeSuffix = filename.replace(/\.(tsx|ts)$/, "");

    const rp = removeSuffix === "index" ? routePath : routePath + removeSuffix;

    if (isFile && (filename.endsWith(".tsx") || filename.endsWith(".ts"))) {
      template += `
      {
        path: '${
          rp.length > 1 && rp[rp.length - 1] === "/" ? rp.slice(0, -1) : rp
        }',
        component: _import('${filename.replace(/\.(tsx|ts)$/, "")}'),
        children: []
      },`;
    }
    if (isDir) {
      await generateRoutes(fileDir, `${routePath}${filename}/`); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
    }
  }
}

export const handle = async (context: string) => {
  const pagesPath = path.resolve(context, "src/pages");

  await generateRoutes(pagesPath);
  template += "\n];";
  try {
    await fs.access("src/routes/index.ts");
    await fs.rm("src/routes/index.ts");
  } catch (error) {
    console.log(error);
  }
  fs.writeFile("src/routes/index.ts", template, "utf8");
};
