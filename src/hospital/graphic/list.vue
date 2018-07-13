<style scoped>

</style>

<template>
  <section class="plr-sm">
    <header class="y-center ptb-xs">
      <span class="size-md bolder">{{affixLabel}}列表</span>
      <router-link :to="url">
        <el-button class="mlr-sm" size="small" type="primary">添加{{affixLabel}}</el-button>
      </router-link>
    </header>
    <el-card>
      <div class=" ptb-sm b-border">
        <el-select @change="getGraphicList" v-model="search.status" clearable placeholder="按上架状态显示">
          <el-option :value="1" label="上架中"></el-option>
          <el-option :value="0" label="已下架"></el-option>
        </el-select>
        <el-cascader v-model="classifyIdList"
                     @change="getGraphicList"
                     placeholder="按分类显示"
                     :clearable="true"
                     :props="props"
                     :options="classifyList"
                     change-on-select>
        </el-cascader>
      </div>
      <m-table :data="graphicList" :config="config">
        <div slot-scope="graphic" slot="operating">
          <el-button @click="changeGraphicStatus(graphic.index,graphic.item,'on')" size="small" type="success" v-if="!graphic.item.status">上架</el-button>
          <el-button @click="changeGraphicStatus(graphic.index,graphic.item,'off')" size="small" type="warning" v-else>下架</el-button>
          <router-link :to="url + '?graphicId=' + graphic.item.id">
            <el-button size="small" type="primary">编辑</el-button>
          </router-link>
          <el-button @click="deleteGraphic(graphic.index,graphic.item)" size="small" type="danger">删除</el-button>
        </div>
      </m-table>
      <div class="text-center text-old" v-if="!isLoading && !graphicList.length">
        <h1>暂无数据</h1>
      </div>
      <div v-if="graphicList.length" class="text-center p-sm">
        <el-pagination
          @current-change="getGraphicList"
          :current-page.sync="search.page"
          :page-size="search.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="graphicSum">
        </el-pagination>
      </div>
    </el-card>
  </section>
</template>

<script>
  import mTable from '@/common/m-table.vue'
  import Graphic from '@/tool/Graphic.js'
  import Classify from '@/tool/Classify.js'
  import {dateFormat} from '@/tool/transform.js'

  export default {
    name: 'graphic-list',
    data() {
      return {
        isLoading: true,
        url: '/graphic/edit',
        classifyIdList: [],
        search: {
          type: 1,
          pageSize: 15,
          page: 1,
          classifyId: '',
          status: ''
        },
        classifyList: [],
        graphicList: [],
        graphicSum: 0,
        config: [
          {
            label: '图文名称',
            property: 'title'
          },
          {
            label: '是否上架',
            property: 'statusName'
          },
          {
            label: '分类名称',
            property: 'classifyName'
          },
          {
            label: '创建时间',
            property: 'createdAt'
          },
          {
            label: '操作',
            type: 'operating'
          }
        ],
        props: {
          value: 'id',
          label: 'name',
          children: 'subClassifies'
        },
      }
    },

    props: {
      affixType: {
        type: Number,
        default: 1
      },
      affixLabel: {
        type: String,
        default: '图文'
      }
    },

    components: {
      mTable
    },

    activated() {
      this.init();
      switch (this.affixType) {
        case 1:
          this.getClassifyList();
          break;
        case 2:
          this.getClassifyListByName('授课课件');
          break;
        case 3:
          this.getClassifyListByName('参考书籍');
          break;
      }
      this.getGraphicList();
    },

    methods: {

      init() {
        this.config[0].label = `${this.affixLabel}名称`;
        this.search.type = this.affixType;

        switch (this.affixType) {
          case 1:
            this.url = '/graphic/edit';
            break;
          case 2:
            this.url = '/affix/edit';
            break;
          case 3:
            this.url = '/refer/edit';
            break;
        }
      },

      changeGraphicStatus(index, item, type) {
        const that = this;
        let graphic = new Graphic({graphic: item});
        graphic.changeGraphicStatus(type).then(() => {
          switch (type) {
            case 'on':
              that.graphicList[index].status = 1;
              that.graphicList[index].statusName = '上架中';
              break;
            case 'off':
              that.graphicList[index].status = 0;
              that.graphicList[index].statusName = '已下架';
              break;
          }
        });
      },


      deleteGraphic(index, item) {
        const that = this;
        that.$confirm('删除请点击确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let graphic = new Graphic({graphic: item});
          graphic.deleteGraphic().then(() => {
            if (that.graphicList.length <= 1) {
              that.page = that.page - 1 ? that.page - 1 : 0;
            }
            that.getGraphicList();
          });
        });
      },


      filterClassifyList(list) {
        const that = this;
        list.forEach(item => {
          if (item.subClassifies.length) {
            that.filterClassifyList(item.subClassifies);
          } else {
            delete item.subClassifies;
          }
        });
      },


      getClassifyListByName(name) {
        let that = this;
        Classify.prototype.getClassifyListByName(name).then(res => {
          let list = [(res.data.data || {})];
          that.filterClassifyList(list);
          that.classifyList.splice(0, that.classifyList.length, ...list);
        });
      },


      getClassifyList() {
        let that = this;
        Classify.prototype.getClassifyList().then(res => {
          let list = res.data.data || [];
          that.filterClassifyList(list);
          that.classifyList.splice(0, that.classifyList.length, ...list);
        });
      },


      initGraphicList(list) {
        list.forEach(item => {
          item.statusName = item.status ? '上架中' : '已下架';
          item.createdAt = dateFormat(item.createdAt);
          item.classifyName = item.classify && item.classify.name || '';
        });
      },


      getGraphicList() {
        let that = this;

        if (that.classifyIdList.length) {
          that.search.classifyId = that.classifyIdList[that.classifyIdList.length - 1];
        }

        !that.classifyIdList.length && (that.search.classifyId = '');


        Graphic.prototype.getGraphicList(that.search).then(res => {
          let list = res.data.data || [];
          that.initGraphicList(list);
          that.graphicList.splice(0, that.graphicList.length, ...list);
          that.graphicSum = res.data.extra.count || 0;
          that.isLoading = false;
        });
      }
    }
  }
</script>
