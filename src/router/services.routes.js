import Layout from '@/layouts/index.vue'; // import UserLayout from '@/layouts/user-layout.vue';
import RouteView from '@/layouts/route-view.vue';
const name = 'services';
const routes = [
  {
    name: 'index',
    path: '/',
    redirect: '/',
    component: Layout,
    children: [
      // 首页
      {
        path: '/services',
        name: name + 'index',
        meta: {
          title: '首页',
          icon: '',
          hideChildrenInMenu: true,
        },
        component: RouteView,
        redirect: '/services/home',
        children: [
          {
            path: '/services/home',
            name: name + 'home',
            meta: {
              title: '首页',
            },
            component: () => import('@/views/services/home'),
          },
        ],
      },
      // 任务管理
      {
        path: '/services/TaskManagement',
        name: name + 'TaskManagement',
        meta: {
          title: '任务管理',
          icon: '',
          hideChildrenInMenu: true,
        },
        component: RouteView,
        redirect: '/services/TaskManagement/index',
        children: [
          {
            path: '/services/TaskManagement/index',
            name: name + 'TaskHome',
            meta: {
              title: '任务管理',
            },
            component: () => import('@/views/services/TaskManagement/index'),
          },
          {
            path: '/services/TaskManagement/add',
            name: name + 'addTask',
            meta: {
              title: '新建任务',
            },
            component: () => import('@/views/services/TaskManagement/Add/index'),
          },
        ],
      },
      // 公共服务统计
      {
        path: '/services/statistic',
        name: name + 'statistic',
        meta: {
          title: '公共服务统计',
          icon: '',
        },
        component: RouteView,
        // component: () => import('@/views/services/table/index'),
        children: [
          {
            path: '/services/statistic/Management',
            name: name + 'Management',
            meta: {
              title: '教师公共服务管理与统计',
              icon: '',
            },
            component: () => import('@/views/services/statistic/Management/index'),
          },
          {
            path: '/services/statistic/Detail',
            name: name + 'ManagementDetail',
            meta: {
              title: '公共服务统计明细',
              icon: '',
            },
            component: () => import('@/views/services/statistic/Detail/index'),
          },
        ],
      },
      // 系统配置
      {
        path: '/services/system',
        name: name + 'system',
        meta: {
          title: '系统配置',
          icon: '',
          // hideChildrenInMenu: true,
          // hideInMenu: true,
        },
        component: RouteView,
        children: [
          {
            path: '/services/system/teacher',
            name: name + 'systemteacher',
            meta: {
              title: '教师',
              icon: '',
              // hideInMenu: true,
            },
            component: () => import('@/views/services/system/Teacher/index'),
          },
        ],
      },
      // 教师状态页面
      {
        path: '/services/teacher',
        name: name + 'teacher',
        redirect: '/services/teacher/list',
        meta: {
          title: '师资库',
          icon: '',
          hideChildrenInMenu: true,
          // hideInMenu: true,
        },
        component: RouteView,
        children: [
          {
            path: '/services/teacher/list',
            name: name + 'teacherlist',
            meta: {
              title: '师资库',
              icon: '',
              // hideInMenu: true,
            },
            component: import('@/views/services/teacher/Teachers'),
          },
        ],
      },
    ],
  },
];
export default routes;
