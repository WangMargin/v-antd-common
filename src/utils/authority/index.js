// import { Permission } from '@/store/modules/user/typing';
export const filterChildRoute = (route, permissions) =>
  route.children
    ?.filter(item => {
      const hasAllow = hasAuthority(item, permissions);

      if (hasAllow && item.children && item.children.length > 0) {
        item.children = filterChildRoute(item, permissions);
      }

      return hasAllow;
    })
    .filter(item => item); // permissions: Permission[]

export const hasAuthority = (route, permissions) => {
  if (route.meta?.authority) {
    return permissions.some(value => {
      return route.meta?.authority?.includes(value);
    });
  }

  return true;
};
