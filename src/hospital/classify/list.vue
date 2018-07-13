<style scoped>

</style>

<template>
  <section class="plr-sm">
    <header class="y-center ptb-xs">
      <span class="size-md bolder">分类列表</span>
      <router-link to="/classify/edit">
        <el-button class="mlr-sm" size="small" type="primary">添加分类</el-button>
      </router-link>
    </header>
    <el-card>
      <header slot="header">
        <el-row class="text-center">
          <el-col :span="8">分类名</el-col>
          <el-col :span="5">导航栏显示</el-col>
          <el-col :span="5">排序（由小到大）</el-col>
          <el-col :span="6">操作</el-col>
        </el-row>
      </header>
      <tree-root class="plr-xs" :level="0" :list="classifyList"></tree-root>
    </el-card>
  </section>
</template>

<script>
  import Classify from '@/tool/Classify.js'
  import treeRoot from './tree-root'

  export default {
    name: 'classify-list',
    data() {
      return {
        classifyList: []
      }
    },

    components: {
      treeRoot
    },

    activated() {
      this.getClassifyList();
    },

    methods: {
      getClassifyList() {
        let that = this;
        Classify.prototype.getClassifyList().then(res => {
          let list = res.data.data || [];
          that.classifyList.splice(0, that.classifyList.length, ...list);
        });
      }
    }
  }
</script>
