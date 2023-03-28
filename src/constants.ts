export const ALLOW_SUFFIX = [".tsx", ".jsx"];

export const DEPS_TEXT = (isLayout: boolean) => `
import {
    LazyExoticComponent,
    MemoExoticComponent,
    ComponentType,
    lazy,
  } from "react";

${isLayout && 'import Layout from "@/layouts";'}
`;

export const TYPE_TEXT = `
export type RouteType = {
    path?: string;
    index?: boolean;
    component?:
        | LazyExoticComponent<ComponentType<unknown>>
        | MemoExoticComponent<ComponentType>;
    children?: RouteType[];
};
`;

export const IMPORT_TEXT =
  "const _import = (path: string) => lazy(() => import(`@/pages${path}`));";

export const EXPORT_TEXT = (routesText: string) =>
  `export const routes: RouteType[] = [${routesText}]`;
