export const DEPS_TEXT = `
import {
    LazyExoticComponent,
    MemoExoticComponent,
    ComponentType,
    lazy,
  } from "react";
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
