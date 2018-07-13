<style scoped>
  .ivu-icon {
    vertical-align: text-bottom;
  }
</style>
<template>
  <Menu ref="sideMenu" :active-name="$route.name" :open-names="openedSubmenuArr" :theme="$store.state.menuTheme" width="auto" @on-select="changeMenu">
    <div v-for="item in menuList" :key="item.path">
      <MenuItem v-if="item.children.length<=1" :name="item.children[0].name">
        <Icon :type="item.icon" :size="iconSize"></Icon>
        <span class="layout-text">{{ itemTitle(item) }}</span>
      </MenuItem>

      <Submenu v-if="item.children.length>1" :name="item.name">
        <template slot="title">
          <Icon :type="item.icon" :size="iconSize"></Icon>
          <span class="layout-text">{{ itemTitle(item) }}</span>
        </template>
        <div v-for="child in item.children" :key="child.name">
          <MenuItem :name="child.name">
            <Icon :type="child.icon" :size="iconSize"></Icon>
            <span class="layout-text">{{ child.title }}</span>
          </MenuItem>
        </div>
      </Submenu>
    </div>
  </Menu>
</template>

<script>
  import util from '@/libs/util';
  import Vue from 'vue';

  export default {
    data() {
      return {
        openedSubmenuArr: this.$store.state.openedSubmenuArr
      };
    },
    name: 'sidebarMenu',
    props: {
      slotTopClass: String,
      menuList: Array,
      iconSize: Number
    },
    computed: {
      tagsList() {
        return this.$store.state.tagsList;
      }
    },
    methods: {
      changeMenu(active) {
        if (active !== 'accesstest_index') {
          util.openNewPage(this, active);
          this.$router.push({
            name: active
          });
        }
      },
      itemTitle(item) {
        if (typeof item.title === 'object') {
          return item.title;
        } else {
          return item.title;
        }
      }
    },
    watch: {
      '$route'(to) {
        localStorage.currentPageName = to.name;
      },
      currentPageName() {
        this.openedSubmenuArr = this.$store.state.openedSubmenuArr;
      }
    }
  };
</script>
