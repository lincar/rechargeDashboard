<style lang="less" src="./uploadImg.less" scoped></style>

<template>
  <div class="center-flex" style="flex-wrap: wrap;align-items: flex-start;">
    <div class="preview-img" v-for="(img ,index) in imgList">
      <img :src="img.isLocal?img.url:img.url">
      <div style="margin-top: 5px;">
        <Checkbox v-if="showMainImg" v-model="img.isMain">设为主图</Checkbox>
        <Button type="error" size="small" @click.native="deleteImg(index)">删除</Button>
      </div>
    </div>
    <div v-if="imgList.length < length" class="upload">
      <Icon class="upload-icon" type="ios-plus-empty" size="60"></Icon>
      <input type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="addImg"/>
    </div>
  </div>
</template>

<script>
  /**
   * 图片上传组件
   * @module uploadImg
   */
  export default {
    data() {
      return {};
    },
    props: {
      imgList: {
        type: Array,
        required: true,
      },
      length: {
        type: Number,
        default: 1000
      },
      showMainImg: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      /**
       * 从显示图片列表中删除一个元素
       * @method deleteImg
       */
      deleteImg(index) {
        const that = this;
        that.imgList.splice(index, 1);
      },
      /**
       * 读取本地图片，添加一个显示图片元素
       * @method addImg
       */
      addImg(e) {
        const that = this;
        let file = e.target.files[0];
        let reader = new FileReader();
        if (file.size > 2 * 1024 * 1024) {
          that.$Modal.warning({
            title: '提示',
            content: '图片不能大于2M'
          });
        } else {
          reader.onload = () => {
            that.imgList.push({
              url: reader.result,
              isMain: false,
              isLocal: true
            });
            reader.onload = null;
          };
          reader.readAsDataURL(file);
        }
      },
    }
  };
</script>
