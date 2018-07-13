<style scoped>
  .el-cascader {
    width: 100%;
  }

  .avatar-uploader {
    display: inline-block;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    object-fit: cover;
    vertical-align: bottom;
    display: inline-block;
  }
</style>

<template>
  <section class="p-sm">
    <header class="title is-5">添加分类</header>
    <el-card>
      <el-row class="y-center ptb-sm">
        <el-col :span="4">分类名称</el-col>
        <el-col :span="10">
          <el-input v-model="classify.name"></el-input>
        </el-col>
      </el-row>
      <el-row class="y-center ptb-sm">
        <el-col :span="4">上级分类</el-col>
        <el-col :span="10">
          <el-cascader placeholder="留空则设置为顶级分类"
                       v-model="classify.superList"
                       :clearable="true"
                       :props="props"
                       :options="classifyList"
                       change-on-select>
          </el-cascader>
        </el-col>
      </el-row>
      <el-row class="y-center ptb-sm">
        <el-col :span="4">导航栏显示</el-col>
        <el-col :span="10">
          <el-radio v-model="classify.showInNavBar" :label="true">是</el-radio>
          <el-radio v-model="classify.showInNavBar" :label="false">否</el-radio>
        </el-col>
      </el-row>
      <el-row class="y-center ptb-sm">
        <el-col :span="4">排序</el-col>
        <el-col :span="10">
          <el-input v-model="classify.seq" placeholder="由小至大"></el-input>
        </el-col>
      </el-row>
      <el-row class="y-center ptb-sm">
        <el-col :span="4">分类封面</el-col>
        <el-col :span="10">
          <el-upload
            :style="{border:classify.imgUrl?'none':'1px dashed #d9d9d9'}"
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="uploadSuccess"
            accept="image/*">
            <img v-if="classify.imgUrl" :src="classify.imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
      </el-row>
      <el-row class="ptb-sm">
        <el-col :span="14" class="text-center">
          <el-button @click="commitClassify" type="success">提交</el-button>
        </el-col>
      </el-row>
    </el-card>
  </section>
</template>

<script>
  import Classify from '@/tool/Classify.js';

  export default {
    name: 'classify-edit',
    data() {
      return {
        props: {
          value: 'id',
          label: 'name',
          children: 'subClassifies'
        },
        classify: {
          name: '',
          showInNavBar: true,
          seq: 0,
          superId: '',
          superList: [],
          imgUrl: ''
        },
        classifyList: [],
        classifyId: null
      }
    },

    watch: {
      'classify.superList': function () {
        let len = this.classify.superList.length;
        this.classify.superId = this.classify.superList[len - 1] || '';
      }
    },

    async activated() {
      this.initClassify(this.classifyId);
      await this.getClassifyList();
      this.classifyId && this.getClassify();
    },

    methods: {
      initClassify(oldClassifyId) {
        this.classifyId = this.$route.query.classifyId || null;
        if (oldClassifyId || this.classifyId) {
          this.classify = {
            name: '',
            showInNavBar: true,
            seq: 0,
            superId: '',
            superList: [],
            imgUrl: ''
          }
        }
      },


      checkValid() {
        if (!this.classify.name) {
          return false;
        }
        return true;
      },


      commitClassify() {
        const that = this;
        if (that.checkValid()) {
          let classify = new Classify({classify: that.classify});

          that.classifyId && classify.editClassify(that.classifyId).then(() => {
            that.$router.push('/classify/list');
            that.$store.commit('removeTag', 'classify-edit');
            that.$store.commit('closePage', 'classify-edit');
          });

          !that.classifyId && classify.addClassify().then(() => {
            that.$router.push('/classify/list');
            that.$store.commit('removeTag', 'classify-edit');
            that.$store.commit('closePage', 'classify-edit');
          });
        }
      },


      uploadSuccess(res) {
        this.classify.imgUrl = res.data || '';
        this.$forceUpdate();
      },


      initSuperId() {
        const that = this;
        let superId = that.classify.superId;
        let list = that.classifyList;
        let superList = that.classify.superList;

        for (let i = 0; i < list.length; i++) {
          let superItem = list[i];
          if (superItem.id === superId) {
            superList.push(superItem.id);
            break;
          } else if (superItem.subClassifies) {
            let flag = false;
            for (let j = 0; j < superItem.subClassifies.length; j++) {
              let childItem = superItem.subClassifies[j];
              if (childItem.id === superId) {
                superList.push(superItem.id, childItem.id);
                flag = true;
                break;
              }
            }
            if (flag) {
              break;
            }
          }
        }
      },


      getClassify() {
        const that = this;
        let id = that.classifyId;
        let classify = new Classify({classify: {id}});
        classify.getClassify().then(res => {
          let data = res.data.data || {};
          that.classify.name = data.name;
          that.classify.superId = data.superId;
          that.classify.seq = data.seq;
          that.classify.showInNavBar = data.showInNavBar;
          that.classify.imgUrl = data.imgUrl;
          data.superId && that.initSuperId();
        });
      },


      filterClassifyList(list) {
        list.forEach(superClassify => {
          // superClassify.subClassifies.forEach(item => {
          //   delete item.subClassifies;
          // });
          // if (!superClassify.subClassifies.length) {
          //   delete superClassify.subClassifies;
          // }
          delete superClassify.subClassifies;
        });
      },


      getClassifyList() {
        let that = this;
        return new Promise(function (resolve, reject) {
          Classify.prototype.getClassifyList().then(res => {
            resolve();
            let list = res.data.data || [];
            that.filterClassifyList(list);
            that.classifyList.splice(0, that.classifyList.length, ...list);
          });
        });
      }
    }
  }
</script>
