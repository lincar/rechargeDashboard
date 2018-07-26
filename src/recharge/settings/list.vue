<template>
  <section class="plr-sm">
    <header class="y-center ptb-xs sticky">
      <span class="size-md bolder">设置列表</span>
    </header>
    <el-card>
      <el-row class="y-center ptb-md">
        <el-col class="y-center" :span="8">
          <div class="plr-md">隐藏充值</div>
          <el-switch
            v-model="settings.isCheck"
            active-text="是"
            inactive-text="否">
          </el-switch>
        </el-col>
        <el-col class="y-center" :span="8">
          <div class="plr-md">客服电话</div>
          <el-input class="w-5" v-model="settings.servicePhone"></el-input>
        </el-col>
      </el-row>
      <el-row class="y-center ptb-md">
        <div class="plr-md">温馨提示</div>
        <el-input
          class="w-5"
          type="textarea"
          v-model="settings.tips"
          :autosize="{ minRows: 4, maxRows: 10}"
          placeholder="请输入内容">
        </el-input>
      </el-row>
      <el-row class="y-center ptb-md">
        <div class="plr-md">话费详情</div>
        <el-input
          class="w-5"
          type="textarea"
          v-model="settings.chargeTips"
          :autosize="{ minRows: 4, maxRows: 10}"
          placeholder="请输入内容">
        </el-input>
      </el-row>
      <el-row class="y-center ptb-md">
        <div class="plr-md">流量详情</div>
        <el-input
          class="w-5"
          type="textarea"
          v-model="settings.flowTips"
          :autosize="{ minRows: 4, maxRows: 10}"
          placeholder="请输入内容">
        </el-input>
      </el-row>
      <div class="xy-center ptb-md">
        <el-button @click="sumbitSettings" type="primary">保存</el-button>
      </div>
    </el-card>
    </el-row>
  </section>
</template>

<script>
  import Settings from '@/tool/classFactory/Settings.js';

  export default {
    name: "settings-list",
    data() {
      return {
        settings: {}
      }
    },

    activated() {
      this.getSettings();
    },

    methods: {
      sumbitSettings() {
        const that = this;
        let settings = that.settings;
        for (let key in settings) {
          let value = settings[key];
          let type = typeof value;
          let item = {
            key,
            value,
            type
          };
          item = new Settings(item);
          item.edit().then();
        }
        that.$notify({
          title: '保存成功',
          type: 'success'
        });
      },

      getSettings() {
        const that = this;
        Settings.prototype.getList().then(res => {
          that.settings = res.data.data || {};
        });
      }
    }
  }
</script>

<style scoped>

</style>
