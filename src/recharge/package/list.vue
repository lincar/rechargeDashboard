<template>
  <section class="plr-sm">
    <header class="y-center ptb-xs sticky">
      <span class="size-md bolder">套餐列表</span>
      <el-button @click="prevShowEditModal()" class="mlr-sm" size="small" type="primary">添加套餐</el-button>
    </header>
    <my-table :data="packageList" :config="tableConfig">
      <div slot="operating" slot-scope="package">
        <el-button @click="prevShowEditModal(package.item)" size="small" type="success">编辑</el-button>
        <el-button @click="deletePackgeItem(package.item,package.index)" size="small" type="danger">删除</el-button>
      </div>
    </my-table>

    <!--编辑套餐-->
    <el-dialog
      :append-to-body="true"
      :visible.sync="showEditModal">
      <div class="p-sm">
        <div class="edit-modal-item">
          <span class="plr-sm">套餐名称</span>
          <el-input v-model="packageItem.name" class="w-5"></el-input>
        </div>
        <div class="edit-modal-item">
          <span class="plr-sm">套餐代码</span>
          <el-input v-model="packageItem.code" class="w-5"></el-input>
        </div>
        <div class="edit-modal-item">
          <span class="plr-sm">套餐类型</span>
          <el-select v-model="packageItem.type" class="w-5">
            <el-option :value="1" label="话费"></el-option>
            <el-option :value="2" label="流量"></el-option>
          </el-select>
        </div>
        <div class="edit-modal-item">
          <span class="plr-sm">售价(元)</span>
          <el-input type="number" v-model="packageItem.price" class="w-5"></el-input>
        </div>
        <div class="edit-modal-item">
          <span class="plr-sm">排序</span>
          <el-input type="number" v-model="packageItem.seq" class="w-5"></el-input>
        </div>
      </div>
      <div slot="footer" class="text-center">
        <el-button @click="commitPackageItem()" type="primary">保存</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import Product from '@/tool/Product.js';
  import myTable from '@/common/m-table.vue';

  export default {
    name: "package-list",
    data() {
      return {
        showEditModal: false,
        packageItem: {},
        packageList: [],
        tableConfig: [
          {
            label: '套餐名称',
            property: 'name'
          },
          {
            label: '套餐代码',
            property: 'code'
          },
          {
            label: '套餐类型',
            property: 'typeName'
          },
          {
            label: '售价(元)',
            property: 'price'
          },
          {
            label: '排序',
            property: 'seq'
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
      this.getPackageList();
    },

    methods: {
      deletePackgeItem(obj, index) {
        const that = this;
        that.$Modal.confirm({
          title: '提示',
          content: '是否删除，请确认',
          onOk: () => {
            let product = new Product(obj);
            product.delete().then(() => {
              that.packageList.splice(index, 1);
            });
          }
        });
      },

      commitPackageItem() {
        const that = this;
        let product = new Product(that.packageItem);
        let thenObj = null;
        if (product.id) {
          thenObj = product.edit();
        } else {
          thenObj = product.add();
        }
        thenObj.then(() => {
          that.showEditModal = false;
          that.getPackageList();
        });
      },

      prevShowEditModal(obj) {
        this.packageItem = obj || {type: 1, seq: 1, price: 0.00.toFixed(2)};
        this.showEditModal = true;
      },

      filterPackageList(list) {
        list.map(item => {
          item.seq = item.seq || 1;
          item.price = (item.price / 100).toFixed(2);
          item.typeName = item.type === 1 ? '话费' : '流量';
        });

        list.sort((x, y) => {
          let typeFlag = x.type - y.type;
          let seqFlag = x.seq - y.seq;
          if (!typeFlag) {
            return seqFlag;
          }
          return typeFlag;
        });
      },

      getPackageList() {
        const that = this;
        Product.prototype.getList().then(res => {
          let list = res.data.data || [];
          that.filterPackageList(list);
          that.packageList.splice(0, that.packageList.length, ...list);
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
