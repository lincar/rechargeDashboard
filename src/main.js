import Vue from 'vue'
import iView from 'iview'
import ElementUI from 'element-ui';
import Store from './store'
import App from './app.vue'
import {appRouter} from './router'
import {router} from './routerSafe'
import $axios from '@/tool/axios.js'

import 'iview/dist/styles/iview.css'
import 'element-ui/lib/theme-chalk/index.css';
import 'bulma/css/bulma.css'
import '@/styles/css/common.css'
import '@/styles/css/normalize.css'

Vue.use(iView);
Vue.use(ElementUI);

Vue.prototype.$axios = $axios;

router.beforeEach(function (to, from, next) {
  let cachePage = JSON.parse(localStorage.cachePage || '[]');
  cachePage = [...new Set([to.name, ...cachePage])];
  localStorage.cachePage = JSON.stringify(cachePage);
  Store.commit('initCachepage');
  next();
});

new Vue({
  el: '#app',
  router: router,
  store: Store,
  render: h => h(App),
  data: {
    currentPageName: ''
  },
  mounted() {
    this.currentPageName = this.$route.name;
    this.$store.commit('initCachepage');
    // 权限菜单过滤相关
    this.$store.commit('updateMenulist');
    // 全屏相关
    document.addEventListener('fullscreenchange', () => {
      this.$store.commit('changeFullScreenState');
    });
    document.addEventListener('mozfullscreenchange', () => {
      this.$store.commit('changeFullScreenState');
    });
    document.addEventListener('webkitfullscreenchange', () => {
      this.$store.commit('changeFullScreenState');
    });
    document.addEventListener('msfullscreenchange', () => {
      this.$store.commit('changeFullScreenState');
    });
  },


  created() {
    let tagsList = [];
    appRouter.map((item) => {
      if (item.children.length <= 1) {
        tagsList.push(item.children[0]);
      } else {
        tagsList.push(...item.children);
      }
    });
    this.$store.commit('setTagsList', tagsList);
  }

});
