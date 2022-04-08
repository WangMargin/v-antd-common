export const filterMenu = routes => {
  return routes.find(item => item.name === 'index')?.children || [];
};
export const genMenuInfo = routes => {
  const menuKeyMap = {};

  const getMenuInfo = (routes, parentKeys = []) => {
    return routes.map(route => {
      const currentRouter = { ...route };
      menuKeyMap[currentRouter.path] = {
        parentKeys: parentKeys,
      };

      if (route.meta?.hideChildrenInMenu) {
        route.children &&
          route.children
            .map(item => item.path)
            .forEach(
              value =>
                (menuKeyMap[value] = {
                  parentKeys: [...parentKeys, currentRouter.path],
                }),
            );
      } // 是否有子菜单，并递归处理

      if (route.children && route.children.length > 0 && !route.meta?.hideChildrenInMenu) {
        // Recursion
        currentRouter.children = getMenuInfo(route.children, [...parentKeys, currentRouter.path]);
      } else {
        currentRouter.children = undefined;
      }

      return currentRouter;
    });
  };

  const menus = getMenuInfo(routes);
  return {
    menus,
    menuKeyMap,
  };
};
export const getMenuFirstChildren = menus => {
  return menus.map(menu => {
    // eslint-disable-next-line
    const {
      children: _children,
      ...rest
    } = menu;
    return rest;
  });
};
export const findMenuChildren = (menus, key) => {
  return (menus && menus.find(item => item.name === key)?.children) || [];
};
