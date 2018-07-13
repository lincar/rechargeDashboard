// noinspection JSAnnotator
import Main from './views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录'
  },
  component: resolve => {
    require(['./views/login.vue'], resolve);
  }
};


// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: '/',
  name: 'otherRouter',
  redirect: '/graphic/list',
  component: Main,
  children: [
    {
      path: 'classify/edit',
      title: '添加分类',
      name: 'classify-edit',
      component: resolve => {
        require(['./hospital/classify/edit.vue'], resolve);
      }
    },
    {
      path: 'graphic/edit',
      title: '添加图文',
      name: 'graphic-edit',
      component: resolve => {
        require(['./hospital/graphic/edit.vue'], resolve);
      }
    }
  ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
//如果想保持组件keep-alive，组件名和name字段保持一致
export const appRouter = [
  {
    path: '/classify',
    icon: 'android-folder',
    name: 'classify',
    title: '分类管理',
    component: Main,
    children: [
      {
        path: 'list',
        title: '分类列表',
        name: 'classify-list',
        component: resolve => {
          require(['./hospital/classify/list.vue'], resolve);
        }
      }
    ]
  },
  {
    path: '/graphic',
    icon: 'images',
    name: 'graphic',
    title: '图文管理',
    component: Main,
    children: [
      {
        path: 'list',
        title: '图文列表',
        name: 'graphic-list',
        component: resolve => {
          require(['./hospital/graphic/list.vue'], resolve);
        }
      }
    ]
  },
  {
    path: '/account',
    icon: 'android-contacts',
    name: 'account',
    title: '账号管理',
    component: Main,
    children: [
      {
        path: 'list',
        title: '账号列表',
        icon: 'ios-list-outline',
        name: 'account-list',
        component: resolve => {
          require(['./hospital/account/list.vue'], resolve);
        }
      }
    ]
  }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  loginRouter,
  otherRouter,
  ...appRouter,
];
