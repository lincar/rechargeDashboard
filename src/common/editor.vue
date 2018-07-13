<style>
  .ql-editor {
    min-height: 200px;
  }

  video {
    object-fit: cover;
  }

  #toolbar {
    position: sticky;
    position: -webkit-sticky;
    top: 0;
    z-index: 2;
    background-color: #f9f9f9;
  }

  .el-card, .el-message {
    overflow: visible !important;
  }
</style>

<template>
  <div>
    <quill-editor v-model="content" ref="richTextEditor" :options="editorOption" @change="onChange">
      <div id="toolbar" slot="toolbar">

        <span class="ql-formats">
          <select class="ql-size" style="z-index: 3">
            <option value="small">小号</option>
            <option selected>默认</option>
            <option value="large">大号</option>
            <option value="huge">超大号</option>
          </select>
        </span>

        <span class="ql-formats"> <button class="ql-bold"></button></span>
        <span class="ql-formats"> <button class="ql-italic"></button></span>
        <span class="ql-formats"><select class="ql-color"></select></span>
        <span class="ql-formats"><select class="ql-background"></select></span>
        <span class="ql-formats"><button class="ql-list" value="ordered"></button></span>
        <span class="ql-formats"><button class="ql-list" value="bullet"></button></span>
        <span class="ql-formats"><button class="ql-indent" value=-1></button></span>
        <span class="ql-formats"><button class="ql-indent" value=+1></button></span>
        <span class="ql-formats"><button class="ql-align"></button></span>
        <span class="ql-formats"><button class="ql-align" value="center"></button></span>
        <span class="ql-formats"><button class="ql-align" value="right"></button></span>

        <span class="ql-formats">
          <button type="button" style="outline:none" @click="imgClick">
          <svg viewBox="0 0 18 18"> <rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect> <circle class="ql-fill" cx="6" cy="7" r="1"></circle> <polyline
            class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline> </svg>
          </button>
        </span>

        <!--<span class="ql-formats">-->
        <!--<button type="button" style="outline:none" @click="videoClick">-->
        <!--<svg viewBox="0 0 18 18">-->
        <!--<rect class="ql-stroke" height="12" width="12" x="3" y="3"></rect>-->
        <!--<rect class="ql-fill" height="12" width="1" x="5" y="3"></rect>-->
        <!--<rect class="ql-fill" height="12" width="1" x="12" y="3"></rect>-->
        <!--<rect class="ql-fill" height="2" width="8" x="5" y="8"></rect>-->
        <!--<rect class="ql-fill" height="1" width="3" x="3" y="5"></rect>-->
        <!--<rect class="ql-fill" height="1" width="3" x="3" y="7"></rect>-->
        <!--<rect class="ql-fill" height="1" width="3" x="3" y="10"></rect>-->
        <!--<rect class="ql-fill" height="1" width="3" x="3" y="12"></rect>-->
        <!--<rect class="ql-fill" height="1" width="3" x="12" y="5"></rect>-->
        <!--<rect class="ql-fill" height="1" width="3" x="12" y="7"></rect>-->
        <!--<rect class="ql-fill" height="1" width="3" x="12" y="10"></rect>-->
        <!--<rect class="ql-fill" height="1" width="3" x="12" y="12"></rect>-->
        <!--</svg>-->
        <!--</button>-->
        <!--</span>-->


      </div>
    </quill-editor>
  </div>
</template>
<script>
  import Quill from 'quill'
  import {quillEditor} from 'vue-quill-editor'
  import {ImageImport} from './modules/ImageImport.js'
  import {ImageResize} from './modules/ImageResize.js'

  Quill.register('modules/imageImport', ImageImport);
  Quill.register('modules/imageResize', ImageResize);

  export default {
    name: 'richTextEditor',
    data() {
      return {
        scrollFn: null,
        containerEl: null,
        content: '',
        editorOption: {
          modules: {
            toolbar: '#toolbar',
            history: {
              delay: 1000,
              maxStack: 50,
              userOnly: false
            },
            imageImport: true,
            imageResize: {
              displaySize: true
            }
          }
        },
      }
    },

    props: {
      value: {
        type: String
      },

      uploadUrl: {
        type: String,
        default: `/api/upload`
      },

      fileName: {
        type: String,
        default: 'file'
      },

      scrollEl: {
        type: String,
        default: ''
      }
    },

    components: {
      quillEditor,
    },

    computed: {
      richTextEditor() {
        return this.$refs.richTextEditor.quill
      }
    },

    watch: {
      'value'(val) {
        if (this.richTextEditor) {
          this.content = val;
        }
      },
    },

    mounted() {
      this.content = this.value;
      // this.scrollFn = this.fixToolbar();
      window.quill = this.richTextEditor;
    },

    destroyed() {
      if (this.containerEl) {
        // this.containerEl.removeEventListener('scroll', this.scrollFn);
      }
    },

    methods: {

      fixToolbar() {
        let containerEl = this.containerEl = document.querySelector(this.scrollEl);
        let toolbarEl = document.querySelector('#toolbar');

        if (containerEl) {
          let toolbarRect = toolbarEl.getBoundingClientRect();
          let containerRect = containerEl.getBoundingClientRect();
          let len = toolbarRect.top - containerRect.top;

          function scrollHandle() {
            if (containerEl.scrollTop >= len) {
              toolbarEl.style.position = 'fixed';
              toolbarEl.style.top = containerRect.top + 'px';
              toolbarEl.style.width = toolbarRect.width - 6 + 'px';
              toolbarEl.style.zIndex = 2;
              toolbarEl.style.backgroundColor = 'beige';
            } else {
              toolbarEl.style.position = 'static';
              toolbarEl.style.width = '100%';
              toolbarEl.style.zIndex = 'auto';
              toolbarEl.style.backgroundColor = 'transparent';
            }
          }

          containerEl.addEventListener('scroll', scrollHandle);

          return scrollHandle;
        }
      },


      onChange() {
        this.$emit('input', this.content);
      },


      onFileChange(e) {
        const that = this;
        let fileInput = e.target;
        let data = new FormData();

        that.richTextEditor.focus();
        data.append(that.fileName, fileInput.files[0]);

        return new Promise(function (resolve, reject) {
          that.$emit('upLoadChange', true);
          that.$axios({
            url: that.uploadUrl,
            method: 'post',
            data: data
          }).then(
            (res) => {
              that.$emit('upLoadChange', false);
              resolve(res);
              fileInput = null;
              data = null;
            },
            err => {
              that.$emit('upLoadChange', false);
              reject(err);
              fileInput = null;
              data = null;
            }
          );
        });
      },


      fileCheck(e, size = 0) {
        const that = this;
        let fileInput = e.target;

        if (fileInput.files.length === 0) {
          fileInput = null;
          return false;
        }

        if (fileInput.files[0].size > 1024 * 1024 * size) {
          that.$alert(`文件不能大于${size}MB`, '文件过大', {
            confirmButtonText: '确定',
            type: 'warning',
          });
          fileInput = null;
          return false;
        }

        fileInput = null;
        return true;
      },


      onImgChange(e) {
        const that = this;
        if (that.fileCheck(e, 5)) {
          that.onFileChange(e).then(res => {
            if (res.data && res.data.status === 1) {
              that.proxyLoad(res.data.data, 'img').then(() => {
                //插入
                let prevIndex = that.richTextEditor.getSelection().index;
                that.richTextEditor.insertText(prevIndex++, '\n');
                that.richTextEditor.insertEmbed(prevIndex, 'image', res.data.data);
                that.richTextEditor.insertText(prevIndex + 1, '\n');

                //设置样式
                that.richTextEditor.setSelection(prevIndex, 1);
                let rect = that.richTextEditor.getBounds(prevIndex, 1);

                //设置宽度
                if (rect.width > 600) {
                  that.richTextEditor.format('width', '90%');
                }

                //设置对齐
                that.richTextEditor.formatLine(prevIndex, 1, {'align': 'center'});
                that.richTextEditor.setSelection(prevIndex + 2, 0);
              });
            } else {
              that.$Notice.warning({
                title: '提示',
                desc: res.data.msg
              });
            }
          });
        }
      },


      onVideoChange(e) {
        const that = this;
        if (that.fileCheck(e, 200)) {
          that.onFileChange(e).then(res => {
            if (res.data && res.data.status === 1) {
              //插入
              let prevIndex = that.richTextEditor.getSelection().index;
              that.richTextEditor.insertText(prevIndex++, '\n');
              that.richTextEditor.insertEmbed(prevIndex, 'video', res.data.data);
              that.richTextEditor.insertText(prevIndex + 1, '\n');

              //设置样式
              that.richTextEditor.setSelection(prevIndex, 1);

              //设置宽高
              that.richTextEditor.format('width', 700);
              that.richTextEditor.format('height', 9 / 16 * 700);


              //设置对齐
              that.richTextEditor.formatLine(prevIndex, 1, {'align': 'center'});
              that.richTextEditor.setSelection(prevIndex + 2, 0);
            } else {
              that.$Notice.warning({
                title: '提示',
                desc: res.data.msg
              });
            }
          });
        }
      },


      imgClick() {
        let input = document.createElement('input');
        input.type = 'file';
        input.name = this.fileName;
        input.accept = 'image/*';
        input.onchange = this.onImgChange;
        input.click();
      },


      videoClick() {
        let input = document.createElement('input');
        input.type = 'file';
        input.name = this.fileName;
        input.accept = 'video/*';
        input.onchange = this.onVideoChange;
        input.click();
      },


      proxyLoad: (function () {
        let el = null;
        return function (src, type) {
          if (type && src) {
            el = el ? el : document.createElement(type);
            return new Promise(function (resolve) {
              el.onload = () => resolve(el);
              el.src = src;
            });
          }
        }
      })()

    }
  }

</script>
