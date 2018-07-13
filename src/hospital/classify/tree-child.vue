<style scoped>

</style>

<template>
  <section>
    <tree-root :level="level" :list="list"></tree-root>
  </section>
</template>

<script>
  import treeRoot from './tree-root'

  export default {
    props: {
      list: {
        type: Array
      },
      level: {
        type: Number,
        default: 1
      }
    },
    components: {
      treeRoot
    }
  }
</script>
