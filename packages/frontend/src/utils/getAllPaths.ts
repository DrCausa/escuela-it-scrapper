import type { RouteObject } from "react-router-dom";

export const getAllPaths = (
  routes: RouteObject[],
  base: string = ""
): string[] => {
  let paths: any = [];
  routes.forEach((route: RouteObject) => {
    const fullPath = route.path
      ? `${base}/${route.path}`.replace(/\/+/g, "/")
      : base;
    if (route.children) {
      paths = [...paths, ...getAllPaths(route.children, fullPath)];
    } else if (route.index) {
      paths.push(base || "/");
    } else {
      paths.push(fullPath);
    }
  });

  return paths;
};
