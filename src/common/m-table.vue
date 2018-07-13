<style scoped>
  .table-tr {
    display: flex;
    background-color: white;
    padding: 15px 10px;
    font-size: 14px;
    flex-wrap: nowrap;
    overflow-x: auto;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
  }

  .table-tr:nth-child(even) {
    /*background-color: #f9f9f9;*/
  }

  .table-tr:nth-child(odd) {
    background-color: #f9f9f9;
  }

  .table-th {
    flex: 1 0 15%;
    font-weight: bolder;
    text-align: center;
  }

  .table-td {
    flex: 1 0 15%;
    text-align: center;
  }

  .table-td img {
    width: 40px;
    display: block;
    margin: 0 auto;
  }

  @media screen and (min-width: 768px) {
    .hide-pc {
      display: none;
    }
  }

  @media screen and (max-width: 768px) {
    .hide-mobile {
      display: none;
    }

    .table-tr {
      border: 1px solid rgba(187, 187, 187, .5);
      padding: 0 20px;
      border-radius: 4px;
      margin: 15px 0;
      flex-wrap: wrap;
    }

    .table-td {
      text-align: right;
      padding: 15px;
      flex: 1 0 100%;
    }

    .table-td_label {
      float: left;
      font-weight: bolder;
    }

  }

</style>

<template>
  <section>
    <div class="table-tr hide-mobile">
      <div class="table-th" v-for="item in config">{{item.label}}</div>
    </div>
    <div class="table-tr" v-for="(row,rowIndex) in data">
      <div class="table-td" v-for="item in pureLabel">
        <span class="hide-pc table-td_label">{{item.label}}</span>
        <img v-if="item.img" :src="getRealValue(row,item.img)"/>
        <span>{{getRealValue(row,item.property)}}</span>
      </div>
      <div v-if="pureLabel.length !== config.length" class="table-td">
        <span class="hide-pc table-td_label">操作</span>
        <slot name="operating" :index="rowIndex" :item="row"></slot>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    props: {
      data: {
        type: Array,
        required: true
      },
      config: {
        type: Array,
        required: true
      }
    },
    computed: {
      pureLabel: function () {
        let list = [];
        this.config.forEach(item => {
          if (!item.type) {
            list.push(item);
          }
        });
        return list;
      }
    },
    methods: {
      getRealValue(obj, property) {
        let value = obj;
        let propertyList = property.split('.');
        propertyList.forEach(name => {
          if (value) {
            value = value[name];
          }
        });
        return value;
      }
    }
  }
</script>
