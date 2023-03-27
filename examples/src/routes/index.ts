
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

const _import = (path: string) => lazy(() => import(`@/pages/${path}`));
export const routes: RouteType[] = [
      {
        path: '/',
        component: _import('index'),
        children: []
      },
      {
        path: '/page1/about',
        component: _import('about'),
        children: []
      },
      {
        path: '/page1',
        component: _import('index'),
        children: []
      },
      {
        path: '/page2/about',
        component: _import('index'),
        children: []
      },
      {
        path: '/page2',
        component: _import('index'),
        children: []
      },
      {
        path: '/page3',
        component: _import('page3'),
        children: []
      },
      {
        path: '/ttt',
        component: _import('ttt'),
        children: []
      },
      {
        path: '/tttt',
        component: _import('tttt'),
        children: []
      },
];