<template>
  <a-card class="card" title="消息中心" :bordered="false">
    <a slot="extra" @click="readAll">全部已读</a>
    <a-row class="message-item" v-for="i in 10" :key="i" type="flex">
      <a-col flex="auto">1</a-col>
      <a-col flex="130px">2021-10-12 00:00:00</a-col>
    </a-row>
    <a-pagination
      class="ant-pagination ant-table-pagination"
      show-quick-jumper
      v-model="current"
      :total="total"
      :pageSize="defaultPageSize"
      :showTotal="showTotal"
      @change="onChange"
    />
  </a-card>
</template>

<script>
import { getAllStockClkList } from '@/api/stock'
export default {
  name: 'MessageCenter',
  data () {
    return {
      current: 0,
      total: 0,
      defaultPageSize: 20,
      columns: [],
      loadData: parameter => {
        return getAllStockClkList(parameter)
      }
    }
  },
  methods: {
    onChange () {},
    readAll () {},
    showTotal (total) {
      let pageTotal = 0
      if (total % this.defaultPageSize > 0) {
        pageTotal = parseInt(total / this.defaultPageSize) + 1
      } else {
        pageTotal = parseInt(total / this.defaultPageSize)
      }
      return (
        '共 ' + total + ' 条记录 第 ' + this.current + ' / ' + pageTotal + ' 页'
      )
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-card-body {
  padding: 0 24px;
}
.message-item {
  width: 100%;
  padding: 12px 0;
}
</style>
