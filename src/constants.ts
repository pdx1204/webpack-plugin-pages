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

export const ROUTER_VIEW_TEXT = (fallback: React.ReactNode) => `
import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { routes, RouteType } from ".";

const recursionGenerateRoute = (routes: RouteType[]) => {
  return routes.map((route: RouteType) => {
    if (route.component) {
      const element = <route.component />;
      if (route.index) {
        // 索引路由在其父路由的URL处呈现到父路由的Outlet(就像默认的子路由一样)。
        return (
          <Route
            key={window.crypto.randomUUID()}
            index
            element={<Suspense fallback={"加载中..."}>{element}</Suspense>}
          />
        );
      } else {
        return (
          <Route
            key={route.path}
            path={route.path}
            element={<Suspense fallback=${fallback}>{element}</Suspense>}
          >
            {route.children && recursionGenerateRoute(route.children)}
          </Route>
        );
      }
    } else {
      return (
        <Route key={route.path} path={route.path}>
          {route.children && recursionGenerateRoute(route.children)}
        </Route>
      );
    }
  });
};

export const RouterView = () => {
  return <Routes>{recursionGenerateRoute(routes)}</Routes>;
};
`;
