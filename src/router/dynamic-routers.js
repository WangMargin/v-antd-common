import RouteView from '@/layouts/route-view.vue';

// 前端路由表
const constantRouterComponents = {
  RouteView: RouteView,
  Home: () => import('@/views/home/home.vue'),
  Information: () => import('@/views/information/information.vue'),
  Subject: () => import('@/views/system/subject.vue'),
  SubjectContent: () => import('@/views/system/subject/content.vue'),
  Statistics: () => import('@/views/system/statistics.vue'),
  Examine: () => import('@/views/system/examine.vue'),
  Dynamic: () => import('@/views/dynamic/dynamic.vue'),
  Category: () => import('@/views/dynamic/category.vue'),
  ResearchDataAdd: () => import('@/views/researchdata/add.vue'),
  ResearchDataEdit: () => import('@/views/researchdata/edit.vue'),
  ResearchDataBatch: () => import('@/views/researchdata/batch.vue'),
  TaskList: () => import('@/views/task/task-list.vue'),
  TaskDetail: () => import('@/views/task/task-detail.vue'),
  TaskAddEdit: () => import('@/views/task/task-add-edit.vue'),
  AccountManagement: () => import('@/views/system/account-management.vue'),
  Administrators: () => import('@/views/system/administrators.vue'),
  AchievementList: () => import('@/views/achievement/achievement-list.vue'),
};

export const generatorDynamicRouter = routes => {
  return routes.map(item => {
    const { title, icon, hideChildrenInMenu, hideInMenu } = item.meta || {};
    const currentRouter = {
      path: item.path,
      // 路由名称，唯一
      name: item.name,
      // 该路由对应页面的 组件
      component: constantRouterComponents[item.component],
      // meta: 页面标题, 菜单图标
      meta: {
        title: title,
        icon: icon || undefined,
      },
    };
    // 是否设置了隐藏子菜单
    if (hideChildrenInMenu === 1) {
      currentRouter.meta.hideChildrenInMenu = true;
    }
    // 是否隐藏当前菜单
    if (hideInMenu === 1) {
      currentRouter.meta.hideInMenu = true;
    }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect);
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      currentRouter.children = generatorDynamicRouter(item.children);
    }
    return currentRouter;
  });
};
