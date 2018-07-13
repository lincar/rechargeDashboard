<style scoped>
  .el-icon-circle-plus-outline {
    position: absolute;
    top: 22%;
    left: -20px;
    transition: .3s;
    transform: rotateZ(0deg);
  }

  .el-icon-circle-plus-outline.show {
    transform: rotateZ(90deg);
  }

  .tree-wrapper > *:not(.tree-child) {
    border-bottom: 1px solid var(--border-color);
  }

  .tree-name {
    position: relative;
    padding-left: 1em;
  }

  .tree-root > *:not(.tree-child) {
    padding: 14px 0;
    cursor: default;
    user-select: none;
  }

  .tree-child {

  }
</style>

<template>
  <section>
    <el-row v-for="(item,index) in list" :key="item.id" class="tree-wrapper text-center">
      <el-col :span="18" class="tree-root">
        <div @click="changeShow(item)">
          <el-row>
            <el-col :style="{paddingLeft: level + 'em'}" class="tree-name text-left" :span="10">
              <i :style="{left: 16 * level - 18 + 'px'}" v-if="item.subClassifies.length" :class="{'el-icon-circle-plus-outline':true, show:item.isShow}"></i>
              <span> {{item.name}}</span>
            </el-col>
            <el-col class="text-success" v-if="item.showInNavBar" :span="7">是</el-col>
            <el-col class="text-danger" v-if="!item.showInNavBar" :span="7">否</el-col>
            <el-col :span="7">{{item.seq}}</el-col>
          </el-row>
        </div>
      </el-col>
      <el-col style="padding:10px 0;" :span="6">
        <router-link :to="'/classify/edit?classifyId=' + item.id">
          <el-button size="small" type="primary">编辑</el-button>
        </router-link>
        <el-button @click="deleteClassify(index)" size="small" type="danger">删除</el-button>
      </el-col>
      <el-col class="tree-child" v-if="item.subClassifies.length && !item.isShow" :span="24">
        <tree-child :level="_level" :list="item.subClassifies"></tree-child>
      </el-col>
    </el-row>
  </section>
</template>

<script>
  import Classify from '@/tool/Classify.js'

  export default {
    props: {
      list: {
        type: Array
      },
      level: {
        type: Number,
        default: 0
      }
    },

    computed: {
      _level: function () {
        return 1 + this.level;
      }
    },

    components: {
      treeChild: resolve => {
        require(['./tree-child.vue'], resolve);
      }
    }
    ,

    methods: {
      changeShow(item) {
        item.isShow = !item.isShow;
        this.$forceUpdate();
      },

      deleteClassify(index) {
        const that = this;
        that.$confirm('删除请点击确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let item = that.list[index];
          let classify = new Classify({classify: item});
          classify.deleteClassify().then(() => {
            that.list.splice(index, 1);
          });
        });
      }
    }
  }
</script>
