import Vuex from 'vuex';
import Vue from 'vue';
import Cookies from 'js-cookie';
import Util from './libs/util';
import {otherRouter, appRouter} from './router';
import {router} from './routerSafe';


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    routers: [
      otherRouter,
      ...appRouter
    ],
    menuList: [],
    tagsList: [...otherRouter.children],
    pageOpenedList: [],
    currentPageName: '',
    currentPath: [],
    openedSubmenuArr: [],
    menuTheme: '',
    theme: '',
    cachePage: [],
    lang: '',
    isFullScreen: false,
    dontCache: []
  },
  getters: {},
  mutations: {
    setTagsList(state, list) {
      state.tagsList.push(...list);
    },
    closePage(state, name) {
      state.cachePage.forEach((item, index) => {
        if (item === name) {
          state.cachePage.splice(index, 1);
          localStorage.cachePage = JSON.stringify(state.cachePage);
        }
      });
    },
    increateTag(state, tagObj) {
      if (!Util.oneOf(tagObj.name, state.dontCache)) {
        state.cachePage = [...new Set([tagObj.name, ...state.cachePage])];
        localStorage.cachePage = JSON.stringify(state.cachePage);
      }
      state.pageOpenedList.push(tagObj);
    },
    initCachepage(state) {
      if (localStorage.cachePage) {
        state.cachePage = [...new Set(JSON.parse(localStorage.cachePage))];
      }
    },
    removeTag(state, name) {
      state.pageOpenedList.map((item, index) => {
        if (item.name === name) {
          state.pageOpenedList.splice(index, 1);
          localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        }
      });
    },
    pageOpenedList(state, get) {
      let openedPage = state.pageOpenedList[get.index];
      if (get.argu) {
        openedPage.argu = get.argu;
      }
      if (get.query) {
        openedPage.query = get.query;
      }
      state.pageOpenedList.splice(get.index, 1, openedPage);
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
    },
    clearAllTags(state) {
      state.pageOpenedList.splice(1);
      router.push({
        name: 'question-list'
      });
      state.cachePage.length = 0;
      localStorage.cachePage = JSON.stringify(state.cachePage);
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
    },
    clearOtherTags(state, vm) {
      let currentName = vm.$route.name;
      let currentIndex = 0;
      state.pageOpenedList.forEach((item, index) => {
        if (item.name === currentName) {
          currentIndex = index;
        }
      });
      if (currentIndex === 0) {
        state.pageOpenedList.splice(1);
      } else {
        state.pageOpenedList.splice(currentIndex + 1);
        state.pageOpenedList.splice(1, currentIndex - 1);
      }
      let newCachepage = state.cachePage.filter(item => {
        return item === currentName;
      });
      state.cachePage = newCachepage;
      localStorage.cachePage = JSON.stringify(state.cachePage);
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
    },
    setOpenedList(state) {
      state.pageOpenedList = localStorage.pageOpenedList ? JSON.parse(localStorage.pageOpenedList) : [otherRouter.children[0]];
    },
    setCurrentPath(state, pathArr) {
      state.currentPath = pathArr;
    },
    setCurrentPageName(state, name) {
      state.currentPageName = name;
    },
    addOpenSubmenu(state, name) {
      let hasThisName = false;
      let isEmpty = false;
      if (name.length === 0) {
        isEmpty = true;
      }
      if (state.openedSubmenuArr.indexOf(name) > -1) {
        hasThisName = true;
      }
      if (!hasThisName && !isEmpty) {
        state.openedSubmenuArr.push(name);
      }
    },
    clearOpenedSubmenu(state) {
      state.openedSubmenuArr.length = 0;
    },
    changeMenuTheme(state, theme) {
      state.menuTheme = theme;
    },
    changeMainTheme(state, mainTheme) {
      state.theme = mainTheme;
    },
    lock(state) {
      Cookies.set('locking', '1');
    },
    unlock(state) {
      Cookies.set('locking', '0');
    },
    setMenuList(state, menulist) {
      state.menuList = menulist;
    },
    updateMenulist(state) {
      let accessCode = parseInt(Cookies.get('access'));
      let menuList = [];
      appRouter.forEach((item, index) => {
        if (item.access !== undefined) {
          if (Util.showThisRoute(item.access, accessCode)) {
            if (item.children.length === 1) {
              menuList.push(item);
            } else {
              let len = menuList.push(item);
              let childrenArr = [];
              childrenArr = item.children.filter(child => {
                if (child.access !== undefined) {
                  if (child.access === accessCode) {
                    return child;
                  }
                } else {
                  return child;
                }
              });
              menuList[len - 1].children = childrenArr;
            }
          }
        } else {
          if (item.children.length === 1) {
            menuList.push(item);
          } else {
            let len = menuList.push(item);
            let childrenArr = [];
            childrenArr = item.children.filter(child => {
              if (child.access !== undefined) {
                if (Util.showThisRoute(child.access, accessCode)) {
                  return child;
                }
              } else {
                return child;
              }
            });
            let handledItem = JSON.parse(JSON.stringify(menuList[len - 1]));
            handledItem.children = childrenArr;
            menuList.splice(len - 1, 1, handledItem);
          }
        }
      });
      state.menuList = menuList;
    },
    setAvator(state, path) {
      localStorage.avatorImgPath = path;
    },
    switchLang(state, lang) {
      state.lang = lang;
      Vue.config.lang = lang;
    },
    handleFullScreen(state) {
      let main = document.body;
      if (state.isFullScreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (main.requestFullscreen) {
          main.requestFullscreen();
        } else if (main.mozRequestFullScreen) {
          main.mozRequestFullScreen();
        } else if (main.webkitRequestFullScreen) {
          main.webkitRequestFullScreen();
        } else if (main.msRequestFullscreen) {
          main.msRequestFullscreen();
        }
      }
    },
    changeFullScreenState(state) {
      state.isFullScreen = !state.isFullScreen;
    }
  },
  actions: {}
});
