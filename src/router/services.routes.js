import Layout from '@/layouts/index.vue'; // import UserLayout from '@/layouts/user-layout.vue';
import RouteView from '@/layouts/route-view.vue';
import Teacher from '@/views/services/teacher/index';
const name = 'services';
const routes = [
  {
    name: 'index',
    path: '/',
    redirect: '/',
    component: Layout,
    children: [
      {
        path: '/services',
        name: name + 'index',
        meta: {
          title: '首页',
          icon: '',
        },
        component: RouteView,
        redirect: '/services/home',
        children: [
          {
            path: '/services/home',
            name: name + 'home',
            meta: {
              title: 'home',
            },
            component: () => import('@/views/services/home'),
          },
        ],
      },
      {
        path: '/services/table',
        name: name + 'table',
        meta: {
          title: '表各',
          icon: '',
        },
        component: () => import('@/views/services/table/index'),
      },
      {
        path: '/services/teacher',
        name: name + 'teacher',
        redirect: '/services/teacher/list',
        meta: {
          title: 'teacher',
          icon: '',
          hideChildrenInMenu: true,
        },
        component: RouteView,
        children: [
          {
            path: '/services/teacher/list',
            name: name + 'teacherlist',
            meta: {
              title: 'teacher',
              icon: '',
              // hideInMenu: true,
            },
            component: Teacher,
          }
        ]
      },
    ],
  },
];
export default routes;
