import Layout from '@/layouts/index.vue'; // import UserLayout from '@/layouts/user-layout.vue';
import RouteView from '@/layouts/route-view.vue';
import Home from '@/views/services/home.vue';
const name = 'services'
const routes = [

  {
    name: 'index',
    path: '/',
    redirect: '/',
    component: Layout,
    children: [
      {
        path: '/services/teacher',
        name: name + 'teacher',
        meta: {
          title: 'teacher',
          icon: ''
        },
        component: () => import('@/views/services/teacher/index'),
      },
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
    ],
  },
]
export default routes