<style scoped>
  .y-center {
    flex-wrap: wrap;
  }

  .el-cascader {
    width: 100%;
  }

  .avatar-uploader:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    width: 100%;
    height: 100%;
    font-size: 28px;
    color: #8c939d;
    position: absolute;
    transform: translateY(-50%);
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .avatar-uploader {
    width: 200px;
    height: 100px;
    display: flex;
    align-items: center;
    overflow: hidden;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
  }

  .avatar-uploader img {
    max-width: 100%;
  }

  #editSide {
    position: -webkit-sticky;
    position: sticky;
    z-index: 2;
    top: 0;
  }
</style>

<template>
  <section v-loading="isLoading" element-loading-text="文件上传中，请稍后" class="p-sm">
    <header class="title is-5">添加{{affixLabel}}</header>
    <el-row :gutter="20">
      <el-col :span="18">
        <el-card>
          <el-row class="y-center ptb-sm">
            <el-col :sm="24" :lg="2">标题</el-col>
            <el-col :sm="24" :lg="16">
              <el-input v-model="graphic.title"></el-input>
            </el-col>
          </el-row>
          <el-row class="y-center ptb-sm">
            <el-col :sm="24" :lg="2">简介</el-col>
            <el-col :sm="24" :lg="16">
              <el-input type="textarea" :rows="4" placeholder="请输入内容，字数上限40个字" v-model="graphic.introduction"></el-input>
            </el-col>
          </el-row>
          <el-row class="y-center ptb-sm">
            <el-col :sm="24" :lg="2">封面</el-col>
            <el-col :sm="24" :lg="16">
              <el-upload
                class="avatar-uploader"
                action="/api/upload"
                :show-file-list="false"
                :on-success="uploadSuccess">
                <img v-if="graphic.imgUrl" :src="graphic.imgUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-col>
          </el-row>
          <el-row class="ptb-sm">
            <el-col :sm="24" :lg="2">附件</el-col>
            <el-col :sm="24" :lg="16">
              <el-upload
                :multiple="graphic.type===1"
                ref="affix"
                action="/api/upload"
                :file-list="graphic.attachments">
                <el-button size="small" type="primary">上传附件</el-button>
              </el-upload>
            </el-col>
          </el-row>
          <el-row class="y-center ptb-sm" v-if="graphic.type===1">
            <el-col>
              <rich-text-editor @upLoadChange="upLoadChange" scrollEl="#single-page-con" v-model="graphic.content.content"></rich-text-editor>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col id="editSide" :span="6">
        <el-card>
          <el-row class="y-center ptb-sm">
            <el-col class="ptb-xs">
              <Icon type="android-folder"></Icon>
              <span>选择分类</span>
            </el-col>
            <el-col>
              <el-cascader v-model="graphic.classifyIdList"
                           :clearable="true"
                           :props="props"
                           :options="classifyList"
                           change-on-select>
              </el-cascader>
            </el-col>
          </el-row>
          <el-row>
            <el-col class="ptb-xs">
              <Icon type="calendar"></Icon>
              <span>发布日期</span>
            </el-col>
            <el-col class="y-center">
              <el-date-picker
                v-model="graphic.createdAt"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-col>
          </el-row>
          <div class="text-center ptb-md">
            <el-button style="width:150px;" @click="commitGraphic" type="success">保存</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script>
  import Graphic from '@/tool/Graphic.js'
  import Classify from '@/tool/Classify.js'
  import richTextEditor from '@/common/editor.vue'
  import scrollFix from '@/tool/scrollFix.js'

  export default {
    name: 'graphic-edit',
    data() {
      return {
        url: '/graphic/list',
        graphicId: null,
        isLoading: false,
        props: {
          value: 'id',
          label: 'name',
          children: 'subClassifies'
        },
        graphic: {
          classifyIdList: [],
          classify: {
            id: ''
          },
          title: '',
          imgUrl: '',
          introduction: '',
          content: {
            content: ''
          },
          type: 1,
          attachments: []
        },
        classifyList: [],
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
      richTextEditor
    },

    async activated() {
      this.graphicId = this.$route.query.graphicId || null;
      this.clearDirtyData();
      switch (this.affixType) {
        case 1:
          await this.getClassifyList();
          break;
        case 2:
          await this.getClassifyListByName('授课课件');
          break;
        case 3:
          await this.getClassifyListByName('参考书籍');
          break;
      }
      this.graphicId && this.getGraphic();
      this.init();
    },

    mounted() {
      // let correctRect = {
      //   top: 0,
      //   left: -6,
      //   width: -2
      // };
      // scrollFix.scrollFixeder.addFixed('#single-page-con', '#editSide', correctRect);
    },

    methods: {
      clearDirtyData() {
        let temp = {
          classifyIdList: [],
          classify: {
            id: ''
          },
          title: '',
          imgUrl: '',
          introduction: '',
          content: {
            content: ''
          },
          type: 1,
          attachments: []
        };

        if (this.graphicId || this.graphic.id) {
          this.graphic = temp;
        }
      },


      init() {
        this.graphic.type = this.affixType;

        switch (this.affixType) {
          case 1:
            this.url = '/graphic/list';
            break;
          case 2:
            this.url = '/affix/list';
            break;
          case 3:
            this.url = '/refer/edit';
            break;
        }
      },


      upLoadChange(flag) {
        this.isLoading = flag;
      },


      commitGraphic() {

        const that = this;
        let classifyIdList = that.graphic.classifyIdList;
        that.graphic.classify.id = classifyIdList[classifyIdList.length - 1];
        that.graphic.attachments = [];
        that.$refs.affix.uploadFiles.forEach(file => {
          that.graphic.attachments.push({
            name: file.name,
            size: file.size,
            url: file.url.includes('blob:') ? file.response.data : file.url
          });
        });

        let graphic = new Graphic({graphic: that.graphic});

        that.graphicId && graphic.editGraphic().then(() => {
          that.$router.push(this.url);
          that.$store.commit('removeTag', 'graphic-edit');
          that.$store.commit('closePage', 'graphic-edit');
        });


        !that.graphicId && graphic.addGraphic().then(() => {
          that.$router.push(this.url);
          that.$store.commit('removeTag', 'graphic-edit');
          that.$store.commit('closePage', 'graphic-edit');
        });
      },


      uploadSuccess(res) {
        this.graphic.imgUrl = res.data || '';
      },


      initClassifyId(id, list, result) {
        const that = this;
        for (let i = 0; i < list.length; i++) {
          let item = list[i];
          if (item.id === id) {
            result.unshift(item.id);
            return true;
          } else if (item.subClassifies) {
            let flag = that.initClassifyId(id, item.subClassifies, result);
            if (flag) {
              result.unshift(item.id);
              return true;
            }
          }
        }
      },


      getGraphic() {
        const that = this;
        let graphic = new Graphic({graphic: {id: that.graphicId}});
        graphic.getGraphic().then(res => {
          that.graphic = res.data.data;
          that.graphic.classifyIdList = [];
          that.initClassifyId(that.graphic.classify.id, that.classifyList, that.graphic.classifyIdList);
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
        return new Promise(function (resolve) {
          Classify.prototype.getClassifyListByName(name).then(res => {
            let list = [(res.data.data || {})];
            that.filterClassifyList(list);
            that.classifyList.splice(0, that.classifyList.length, ...list);
            resolve(res);
          });
        });
      },


      getClassifyList() {
        let that = this;
        return new Promise(function (resolve) {
          Classify.prototype.getClassifyList().then(res => {
            let list = res.data.data || [];
            that.filterClassifyList(list);
            that.classifyList.splice(0, that.classifyList.length, ...list);
            resolve(res);
          });
        });
      }
    }
  }
</script>
