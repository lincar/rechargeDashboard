<template>
  <section class="plr-sm">
    <header class="y-center ptb-xs sticky">
      <span class="size-md bolder">提现列表</span>
      <el-select @change="getWithdrawList()" class="mlr-sm" v-model="search.status">
        <el-option :value="1" label="未处理"></el-option>
        <el-option :value="2" label="已拒绝"></el-option>
        <el-option :value="3" label="已提现"></el-option>
      </el-select>
    </header>
    <my-table :data="withdrawList" :config="tableConfig">
      <div slot="operating" slot-scope="withdraw">
        <div v-if="withdraw.item.status===1">
          <el-button @click="agreeWithdraw(withdraw.item,withdraw.index)" size="small" type="success">同意</el-button>
          <el-button @click="rejectWithdraw(withdraw.item,withdraw.index)" size="small" type="danger">拒绝</el-button>
        </div>
      </div>
    </my-table>
    <div v-if="withdrawList.length" class="text-center p-sm">
      <el-pagination
        @current-change="getWithdrawList"
        :current-page.sync="search.page"
        :page-size="search.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="withdrawSum">
      </el-pagination>
    </div>
  </section>
</template>

<script>
  import Withdraw from '@/tool/Withdraw.js';
  import Distributor from '@/tool/Distributor.js';
  import myTable from '@/common/m-table.vue';

  export default {
    name: "withdraw-list",
    data() {
      return {
        withdrawList: [],
        distributorList: [],
        withdrawSum: 0,
        search: {
          status: 0,
          page: 1,
          pageSize: 15,
        },
        tableConfig: []
      }
    },

    watch: {
      'search.status': function (status) {
        let list = [
          {
            label: '分销商姓名',
            property: 'name'
          },
          {
            label: '分销商账号',
            property: 'username'
          },
          {
            label: '金额(元)',
            property: 'withdraw'
          },
          {
            label: '申请时间',
            property: 'createdAt'
          },
          {
            label: '状态',
            property: 'statusName'
          }
        ];
        if (status === 1) {
          list.push({
            label: '操作',
            type: 'operating'
          })
        }
        this.tableConfig = list;
      }
    },

    components: {
      myTable
    },

    created() {
      this.search.status = 1;
    },

    activated() {
      this.getDistributorList();
    },

    methods: {
      agreeWithdraw(obj, index) {
        const that = this;
        that.$Modal.confirm({
          title: '提示',
          content: '是否同意，请确认',
          onOk: () => {
            let withdraw = new Withdraw(obj);
            withdraw.agree().then(() => {
              that.withdrawList.splice(index, 1);
            });
          }
        });
      },

      rejectWithdraw(obj, index) {
        const that = this;
        that.$Modal.confirm({
          title: '提示',
          content: '是否拒绝，请确认',
          onOk: () => {
            let withdraw = new Withdraw(obj);
            withdraw.reject().then(() => {
              that.withdrawList.splice(index, 1);
            });
          }
        });
      },

      filterWithdrawList(list) {
        const that = this;
        list.map(item => {
          switch (item.status) {
            case 1:
              item.statusName = '未处理';
              break;
            case 2:
              item.statusName = '已拒绝';
              break;
            case 3:
              item.statusName = '已提现';
              break;
          }
          item.withdraw = (item.withdraw / 100).toFixed(2);
          for (let i = 0; i < that.distributorList.length; i++) {
            let distributor = that.distributorList[i];
            if (distributor.id === item.distributorId) {
              item.name = distributor.name;
              item.username = distributor.username;
            }
          }
        });
      },

      getDistributorList() {
        const that = this;
        Distributor.prototype.getList().then(res => {
          let list = res.data.data || [];
          that.distributorList.splice(0, that.distributorList.length, ...list);
          that.getWithdrawList();
        });
      },

      getWithdrawList() {
        const that = this;
        let search = that.search;
        Withdraw.prototype.getList(search).then(res => {
          let list = res.data.data || [];
          that.filterWithdrawList(list);
          that.withdrawList.splice(0, that.withdrawList.length, ...list);
          that.withdrawSum = res.data.extra.count || list.length;
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
