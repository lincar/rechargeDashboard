<template>
  <div class="main" :class="{'main-hide-text': hideMenuText}">
    <div :style="{width:hideMenuText?'0':'200px'}" class="sidebar-menu-con">
      <div class="logo-con">
        <img src="../images/logo.jpg" key="max-logo"/>
      </div>
      <sidebar-menu :menuList="menuList" :iconSize="20"/>
    </div>
    <div class="main-content">
      <div class="main-header-con" :style="{paddingLeft: hideMenuText?'0':'200px'}">
        <div class="main-header">
          <div class="navicon-con">
            <Button :style="{transform: 'rotateZ(' + (this.hideMenuText ? '-90' : '0') + 'deg)'}" type="text"
                    @click="toggleClick">
              <Icon type="navicon" size="32"></Icon>
            </Button>
          </div>
          <div class="header-avator-con hide-mobile">
            <div @click="handleFullScreen" v-if="showFullScreenBtn" class="full-screen-btn-con">
              <Tooltip :content="isFullScreen ? '退出全屏' : '全屏'" placement="bottom">
                <Icon :type="isFullScreen ? 'arrow-shrink' : 'arrow-expand'" :size="23"></Icon>
              </Tooltip>
            </div>
            <div class="user-dropdown-menu-con">
              <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                <Dropdown trigger="click" @on-click="handleClickUserDropdown">
                  <a href="javascript:void(0)">
                    <span class="main-user-name">{{ user.username }}</span>
                    <Icon type="arrow-down-b"></Icon>
                  </a>
                  <DropdownMenu slot="list">
                    <DropdownItem name="loginout">退出登录</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </Row>
            </div>
          </div>
        </div>
        <div class="tags-con">
          <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
        </div>
      </div>
      <div id="single-page-con" class="single-page-con" :style="{left: hideMenuText?'0':'200px'}">
        <div class="single-page">
          <keep-alive :include="cachePage">
            <router-view></router-view>
          </keep-alive>
        </div>
      </div>
      <up-down srcollEl="#single-page-con"></up-down>
    </div>
  </div>
</template>
<script>
  import sidebarMenu from './main_components/sidebarMenu.vue'
  import tagsPageOpened from './main_components/tagsPageOpened.vue'
  import upDown from '@/common/upDown.vue'
  import util from '@/libs/util.js'
  import Admin from '@/tool/Admin.js'

  export default {
    components: {
      sidebarMenu,
      tagsPageOpened,
      upDown
    },
    data() {
      return {
        user: {},
        spanLeft: 4,
        spanRight: 20,
        currentPageName: '',
        hideMenuText: false,
        showFullScreenBtn: window.navigator.userAgent.indexOf('MSIE') < 0,
        messageCount: 0,
        lockScreenSize: 0
      };
    },
    computed: {
      menuList() {
        return this.$store.state.menuList;
      },

      tagsList() {
        return this.$store.state.tagsList;  // 所有页面的页面对象
      },

      pageTagsList() {
        return this.$store.state.pageOpenedList;  // 打开的页面的页面对象
      },

      currentPath() {
        return this.$store.state.currentPath;  // 当前面包屑数组
      },

      menuIconColor() {
        return this.$store.state.menuTheme === 'dark' ? 'white' : '#495060';
      },

      cachePage() {
        return this.$store.state.cachePage;
      },

      isFullScreen() {
        return this.$store.state.isFullScreen;
      }
    },
    methods: {
      init() {
        this.$store.commit('setCurrentPageName', this.$route.name);
        let pathArr = util.setCurrentPath(this, this.$route.name);
        if (pathArr.length >= 2) {
          this.$store.commit('addOpenSubmenu', pathArr[1].name);
        }
      },

      toggleClick() {
        this.hideMenuText = !this.hideMenuText;
      },

      handleClickUserDropdown(name) {
        let that = this;
        if (name === 'loginout') {
          Admin.prototype.logout().then(() => {
            that.$store.commit('clearOpenedSubmenu');
            localStorage.removeItem('user');
            that.$router.push('/login');
          });
        }
      },

      handleFullScreen() {
        this.$store.commit('handleFullScreen');
      },

      checkTag(name) {
        let openpageHasTag = this.pageTagsList.some(item => {
          if (item.name === name) {
            return true;
          }
        });
        if (!openpageHasTag) {  //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
          util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
        }
      },

      getCurrentUser() {
        const that = this;
        Admin.prototype.getCurrentInfo().then(
          res => {
            let user = res.data.data || {};
            that.user = user;
            localStorage.setItem('user', JSON.stringify(user));
          },
          () => {
            localStorage.removeItem('user');
            location.href = `#/login?returnUrl=${location.href}`;
          }
        );
      }
    },

    watch: {
      '$route'(to) {
        this.$store.commit('setCurrentPageName', to.name);
        let pathArr = util.setCurrentPath(this, to.name);
        if (pathArr.length > 2) {
          this.$store.commit('addOpenSubmenu', pathArr[1].name);
        }
        this.checkTag(to.name);
      }
    },
    mounted() {

    },

    created() {
      this.init();
      this.getCurrentUser();
      this.user = JSON.parse(localStorage.getItem('user')) || {};
      this.hideMenuText = document.documentElement.clientWidth <= 768;
      this.$store.commit('changeMenuTheme', 'dark');
      this.$store.commit('changeMainTheme', 'b');
      this.$store.commit('setOpenedList');
    }
  };
</script>
