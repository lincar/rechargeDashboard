<style lang="less" scoped>
  @import "./list.less";
</style>
<template>
  <section class="plr-sm">
    <header class="y-center ptb-xs">
      <span class="size-md bolder">账号管理</span>
      <el-button type="primary" size="small" @click="showAdd = true;" class="mlr-sm">新建账号</el-button>
    </header>

    <el-card>
      <div class="admin-table">
        <el-row class="hide-mobile ptb-sm text-center bolder">
          <el-col :span="8">账号名</el-col>
          <el-col :span="8">创建时间</el-col>
          <el-col :span="8">操作</el-col>
        </el-row>
        <el-row v-for="(admin,index) in adminList" :key="admin.id" class="tr-mobile ptb-sm text-center">
          <el-col class="td-mobile" :span="8">{{admin.username}}</el-col>
          <el-col class="td-mobile" :span="8">{{admin.updatedAt}}</el-col>
          <el-col class="td-mobile" :span="8">
            <el-button type="primary" size="small" @click="currentIndex = index; showEdit = true;">修改密码</el-button>
            <el-button type="danger" size="small" @click="deleteAdmin(index)">删除</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <Modal
      v-model="showAdd"
      title="新建账号"
      @on-ok="addAdmin">
      <div class="columns xy-center">
        <span class="column is-2">账号名</span>
        <i-input placeholder="支持中文" class="column is-6" v-model="admin.username"></i-input>
      </div>
      <div class="columns xy-center">
        <span class="column is-2">密 码</span>
        <i-input type="password" placeholder="请输入密码" class="column is-6" v-model="admin.password"></i-input>
      </div>
    </Modal>


    <Modal
      v-model="showEdit"
      title="修改密码"
      @on-ok="changePassword">
      <div v-if="currentIndex !== -1" class="columns xy-center">
        <span class="column is-2">账号名</span>
        <span class="column is-6">{{adminList[currentIndex].username}}</span>
      </div>
      <div v-if="currentIndex !== -1" class="columns xy-center">
        <span class="column is-2">密 码</span>
        <i-input type="password" placeholder="请输入新密码" class="column is-6" v-model="adminList[currentIndex].password"></i-input>
      </div>
    </Modal>
  </section>
</template>

<script>
  import Admin from '@/tool/Admin.js'

  export default {
    name: 'account-list',
    data() {
      return {
        admin: {},
        adminList: [],
        showAdd: false,
        showEdit: false,
        currentIndex: -1
      }
    },
    activated() {
      this.getAdminList();
    },
    methods: {
      getAdminList() {
        const that = this;
        Admin.prototype.getList().then(
          res => {
            that.adminList.splice(0, that.adminList.length, ...res.data.data);
          }
        );
      },

      deleteAdmin(index) {
        const that = this;
        that.$Modal.confirm({
          title: '通知',
          content: `删除，请点击确认按钮`,
          onOk: () => {
            let admin = new Admin(that.adminList[index]);
            admin.delete().then(
              () => {
                that.adminList.splice(index, 1);
              }
            );
          }
        });
      },

      addAdmin() {
        const that = this;
        let admin = new Admin(that.admin);
        admin.add().then(() => {
          that.admin = {};
          that.getAdminList();
        });
      },

      changePassword() {
        const that = this;
        let admin = new Admin(that.adminList[that.currentIndex]);
        admin.changePassword().then(() => {
          that.getAdminList();
        });
      }
    }
  }
</script>
