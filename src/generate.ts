import fs from "fs/promises";
import path from "path";
import { ALLOW_SUFFIX, DEPS_TEXT, EXPORT_TEXT, IMPORT_TEXT, TYPE_TEXT } from "./constants";
import prettier from "prettier";

export async function generateRoutes(pagesPath: string, template = "", routePath = "/") {
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
      if (removeSuffixPath === "styled") continue;

      const rp = removeSuffixPath === "index" ? routePath : routePath + removeSuffixPath;

      const path = rp.length > 1 && rp[rp.length - 1] === "/" ? rp.slice(0, -1) : rp;
      template += `
      {
        path: '${path}',
        component: _import('${path}'),
        children: []
      },`;
    }
    if (isDir) {
      template = await generateRoutes(fileDir, template, `${routePath}${filename}/`); //递归，如果是文件夹，就继续遍历该文件夹下面的文件
    }
  }
  return template;
}

export const handle = async (pagesPath: string, out: string) => {
  const routesText = await generateRoutes(pagesPath);

  const template = prettier.format(
    `${DEPS_TEXT}\n${TYPE_TEXT}\n${IMPORT_TEXT}\n${EXPORT_TEXT(routesText)}`
  );

  const outDir = path.resolve(process.cwd(), `${out}`);
  try {
    await fs.mkdir(outDir, { recursive: true });
  } catch (error) {
    console.log(error);
  }

  const outPath = path.resolve(outDir, "index.ts");

  try {
    await fs.access(outPath);
    await fs.rm(outPath);
  } catch (error) {
    console.log(error);
  }

  fs.writeFile(outPath, template, "utf8");
};
