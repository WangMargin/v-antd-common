import { createRouter, createWebHistory } from 'vue-router';

import UserLayout2 from '@/layouts/user-layout2.vue';

// import routes_ from './routes'
import routes_ from './services.routes'
export const routes = routes_;
export const staticRoutes = [
  {
    path: '/test',
    name: 'test',
    meta: {
      title: 'form.basicform.basic.title',
    },
    component: () => import('@/views/form/basic-form/index.vue'),
  },
  {
    path: '/user',
    name: 'user',
    meta: {
      hideInMenu: true,
      title: 'pages.layouts.userLayout.title',
    },
    component: UserLayout2,
    children: [
      {
        path: '/user/login',
        name: 'login',
        meta: {
          title: 'pages.login.accountLogin.tab',
        },
        component: () => import('@/views/user/login.vue'),
      },
      {
        path: '/user/register',
        name: 'register',
        meta: {
          title: 'pages.login.registerAccount',
        },
        component: () => import('@/views/user/register.vue'),
      },
      {
        path: '/user/register-result',
        name: 'register-result',
        meta: {
          title: 'pages.login.registerAccount',
        },
        component: () => import('@/views/user/register-result.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)',
    component: () => import('@/views/exception/404.vue'),
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
  // routes: staticRoutes,
});
export default router;
