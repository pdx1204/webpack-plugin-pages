import { Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { routes, RouteType } from "../../.routes";

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
            element={<Suspense fallback="加载中...">{element}</Suspense>}
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
