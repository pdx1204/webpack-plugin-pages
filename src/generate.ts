import fs from "fs/promises";
import path from "path";
import { ALLOW_SUFFIX, IMPORT_TEXT } from "./constants";

export async function generateRoutes(
  pagesPath: string,
  template: string,
  routePath = "/",
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

    const rp =
      removeSuffixPath === "index" ? routePath : routePath + removeSuffixPath;

    if (isFile && ALLOW_SUFFIX.includes(suffix)) {
      // 过滤掉 styled 文件
      if (removeSuffixPath === "styled") continue;

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
      template = await generateRoutes(
        fileDir,
        template,
        `${routePath}${filename}/`,
      ); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
    }
  }
  return template;
}

export const handle = async (pagesPath: string, out: string) => {
  const template = `
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
\nconst _import = (path: string) => lazy(() => ${IMPORT_TEXT});\nexport const routes: RouteType[] = [`;

  const t = (await generateRoutes(pagesPath, template)) + "\n];";

  const outDir = path.resolve(process.cwd(), `${out}`);
  try {
    await fs.mkdir(outDir, { recursive: true });
  } catch (error) {}

  const outPath = path.resolve(outDir, "index.ts");

  try {
    await fs.access(outPath);
    await fs.rm(outPath);
  } catch (error) {
    console.log(error);
  }

  fs.writeFile(outPath, t, "utf8");
};
