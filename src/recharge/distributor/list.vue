<template>
  <section class="plr-sm">
    <header class="y-center ptb-xs sticky">
      <span class="size-md bolder">分销商列表</span>
      <el-button @click="prevShowEditModal()" class="mlr-sm" size="small" type="primary">添加分销商</el-button>
    </header>
    <my-table :data="distributorList" :config="tableConfig">
      <div slot="operating" slot-scope="distributor">
        <el-button @click="prevShowEditModal(distributor.item)" size="small" type="success">编辑</el-button>
        <el-button @click="deleteDistributorItem(distributor.item,distributor.index)" size="small" type="danger">删除</el-button>
      </div>
    </my-table>

    <!--编辑分销商-->
    <el-dialog
      :append-to-body="true"
      :visible.sync="showEditModal">
      <div class="p-sm">
        <div class="edit-modal-item">
          <span class="plr-sm">姓名</span>
          <el-input v-model="distributorItem.name" class="w-5"></el-input>
        </div>
        <div class="edit-modal-item">
          <span class="plr-sm">账号</span>
          <el-input v-model="distributorItem.username" class="w-5"></el-input>
        </div>
        <div v-if="!distributorItem.id" class="edit-modal-item">
          <span class="plr-sm">密码</span>
          <el-input type="password" v-model="distributorItem.password" class="w-5"></el-input>
        </div>
        <div class="edit-modal-item">
          <span class="plr-sm">手机</span>
          <el-input v-model="distributorItem.phone" class="w-5"></el-input>
        </div>
        <div class="edit-modal-item">
          <span class="plr-sm">佣金(%)</span>
          <el-input type="number" v-model="distributorItem.profit" class="w-5"></el-input>
        </div>
      </div>
      <div slot="footer" class="text-center">
        <el-button @click="commitDistributorItem()" type="primary">保存</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import Distributor from '@/tool/Distributor.js';
  import myTable from '@/common/m-table.vue';

  export default {
    name: "distributor-list",
    data() {
      return {
        showEditModal: false,
        distributorItem: {},
        distributorList: [],
        tableConfig: [
          {
            label: '姓名',
            property: 'name'
          },
          {
            label: '账号',
            property: 'username'
          },
          {
            label: '手机',
            property: 'phone'
          },
          {
            label: '佣金(%)',
            property: 'profit'
          },
          {
            label: '操作',
            type: 'operating'
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
      deleteDistributorItem(obj, index) {
        const that = this;
        that.$Modal.confirm({
          title: '提示',
          content: '是否删除，请确认',
          onOk: () => {
            let distributor = new Distributor(obj);
            distributor.delete().then(() => {
              that.distributorList.splice(index, 1);
            });
          }
        });
      },

      commitDistributorItem() {
        const that = this;
        let distributor = new Distributor(that.distributorItem);
        let thenObj = null;
        if (distributor.id) {
          thenObj = distributor.edit();
        } else {
          thenObj = distributor.add();
        }
        thenObj.then(() => {
          that.showEditModal = false;
          that.getDistributorList();
        });
      },

      prevShowEditModal(obj) {
        this.distributorItem = obj || {};
        this.showEditModal = true;
      },

      filterDistributorList(list) {
        list.map(item => {
          item.profit = item.profit * 100;
        });
      },

      getDistributorList() {
        const that = this;
        Distributor.prototype.getList().then(res => {
          let list = res.data.data || [];
          that.filterDistributorList(list);
          that.distributorList.splice(0, that.distributorList.length, ...list);
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
