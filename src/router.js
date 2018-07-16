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
  redirect: '/package/list',
  component: Main,
  children: [
    {
      path: 'package/edit',
      title: '添加套餐',
      name: 'package-edit',
      component: resolve => {
        require(['./recharge/package/edit.vue'], resolve);
      }
    }
  ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
//如果想保持组件keep-alive，组件名和name字段保持一致
export const appRouter = [
  {
    path: '/package',
    icon: 'android-folder',
    name: 'package',
    title: '套餐管理',
    component: Main,
    children: [
      {
        path: 'list',
        title: '套餐列表',
        name: 'package-list',
        component: resolve => {
          require(['./recharge/package/list.vue'], resolve);
        }
      }
    ]
  },
  {
    path: '/distributor',
    icon: 'android-folder',
    name: 'distributor',
    title: '分销商管理',
    component: Main,
    children: [
      {
        path: 'list',
        title: '分销商列表',
        name: 'distributor-list',
        component: resolve => {
          require(['./recharge/distributor/list.vue'], resolve);
        }
      }
    ]
  },
  {
    path: '/withdraw',
    icon: 'android-folder',
    name: 'withdraw',
    title: '提现管理',
    component: Main,
    children: [
      {
        path: 'list',
        title: '提现列表',
        name: 'withdraw-list',
        component: resolve => {
          require(['./recharge/withdraw/list.vue'], resolve);
        }
      }
    ]
  },
  {
    path: '/profit',
    icon: 'android-folder',
    name: 'profit',
    title: '分成管理',
    component: Main,
    children: [
      {
        path: 'list',
        title: '分成列表',
        name: 'profit-list',
        component: resolve => {
          require(['./recharge/profit/list.vue'], resolve);
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
