<template>
  <section class="plr-sm">
    <header class="y-center ptb-xs sticky">
      <span class="size-md bolder">分成列表</span>
    </header>
    <my-table :data="profitList" :config="tableConfig"></my-table>
    <div v-if="profitList.length" class="text-center p-sm">
      <el-pagination
        @current-change="getProfitList"
        :current-page.sync="search.page"
        :page-size="search.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="profitSum">
      </el-pagination>
    </div>
  </section>
</template>

<script>
  import Profit from '@/tool/Profit.js';
  import Distributor from '@/tool/Distributor.js';
  import myTable from '@/common/m-table.vue';

  export default {
    name: "profit-list",
    data() {
      return {
        distributorList: [],
        profitList: [],
        profitSum: 0,
        search: {
          page: 1,
          pageSize: 15,
        },
        tableConfig: [
          {
            label: '分销商姓名',
            property: 'name'
          },
          {
            label: '套餐名称',
            property: 'order.productName'
          },
          {
            label: '套餐价格(元)',
            property: 'order.price'
          },
          {
            label: '充值手机',
            property: 'order.phone'
          },
          {
            label: '分销商佣金(元)',
            property: 'profit'
          },
          {
            label: '时间',
            property: 'createdAt'
          }
        ]
      }
    },

    components: {
      myTable
    },

    activated() {
      this.getDistributorList();
    },

    methods: {
      getDistributorList() {
        const that = this;
        Distributor.prototype.getList().then(res => {
          let list = res.data.data || [];
          that.distributorList.splice(0, that.distributorList.length, ...list);
          that.getProfitList();
        });
      },

      filterProfitList(list) {
        const that = this;
        list.map(item => {
          item.order.price = (item.order.price / 100).toFixed(2);
          item.profit = (item.profit / 100).toFixed(2);
          for (let i = 0; i < that.distributorList.length; i++) {
            let distributor = that.distributorList[i];
            if (distributor.id === item.distributorId) {
              item.name = distributor.name;
              item.username = distributor.username;
            }
          }
        });
      },

      getProfitList() {
        const that = this;
        let search = that.search;
        Profit.prototype.getList(search).then(res => {
          let list = res.data.data || [];
          that.filterProfitList(list);
          that.profitList.splice(0, that.profitList.length, ...list);
          that.profitSum = res.data.extra.count || list.length;
        });
      }
    }
  }
</script>

<style scoped>
  .edit-modal-item {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--sm);
  }

  .edit-modal-item span {
    display: inline-block;
    min-width: 6em;
    text-align: right;
  }
</style>
