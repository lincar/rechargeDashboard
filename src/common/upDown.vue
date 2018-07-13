<style scoped>
  .up-down {
    position: fixed;
    right: 50px;
    bottom: 60px;
    z-index: 2;
    cursor: default;
  }

  .up-down > * {
    display: block;
    width: 40px;
    height: 40px;
    font-size: 32px;
    text-align: center;
  }

  .up-down > *:hover {
    opacity: .5;
  }
</style>

<template>
  <section v-if="el && (el.scrollHeight-rect.height)" class="up-down">
    <i @click="up" size="32" class="el-icon-caret-top"></i>
    <i @click="down" size="32" class="el-icon-caret-bottom"></i>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        el: null,
        rect: null,
        isUp: false,
        isDown: false
      }
    },

    props: {
      srcollEl: {
        type: String,
        required: true
      }
    },

    watch: {
      '$route': function () {
        this.init();
      }
    },

    mounted() {
      this.init();
    },

    methods: {
      init() {
        this.el = document.querySelector(this.srcollEl) || null;
        this.el && (this.rect = this.el.getBoundingClientRect());
      },

      up() {
        const that = this;
        if (!that.isDown) {
          that.isUp = that.el.scrollTop > 0;
          if (that.el.scrollTop > 0) {
            that.el.scrollTop = that.el.scrollTop - 100;
            setTimeout(function () {
              that.up();
            }, 10);
          }
        }
      },

      down() {
        const that = this;
        if (!that.isUp) {
          that.isDown = (that.el.scrollTop + that.rect.height < that.el.scrollHeight);
          if (that.el.scrollTop + that.rect.height < that.el.scrollHeight) {
            that.el.scrollTop = that.el.scrollTop + 100;
            setTimeout(function () {
              that.down();
            }, 10);
          }
        }
      }
    }
  }
</script>
