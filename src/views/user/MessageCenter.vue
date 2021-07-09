<template>
  <a-card class="card" title="消息中心" :bordered="false">
    <a slot="extra" @click="readAll">全部已读</a>
    <s-table
      ref="table"
      size="default"
      class="message-table"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :showHeader="false"
      :showPagination="true"
    >
      <a-row
        slot="content"
        class="message-item"
        slot-scope="text, record"
        type="flex"
      >
        <a-col
          flex="auto"
          :style="{
            color: record.isRead === '1' ? '#c0c0c0' : '',
            cursor: 'pointer'
          }"
          @click="openPage(record)"
          >{{ record.content }}</a-col
        >
        <a-col
          flex="130px"
          :style="{ color: record.isRead === '1' ? '#c0c0c0' : '' }"
          >{{ record.ctime }}</a-col
        >
      </a-row>
    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import {
  toGetMessageList,
  toReadMessageById,
  toReadAllMessage
} from '@/api/user'
export default {
  name: 'MessageCenter',
  components: {
    STable
  },
  data () {
    return {
      columns: [
        {
          dataIndex: 'content',
          scopedSlots: { customRender: 'content' }
        }
      ],
      loadData: parameter => {
        return toGetMessageList(parameter)
      }
    }
  },
  methods: {
    // 打开新窗口
    openPage (item) {
      toReadMessageById({ messageId: item.id })
      // 打开项目
      if (item.sourceType === '1') {
        window.open(`/project/detail?id=${item.sourceId}`, '_blank')
        // 打开合同
      } else if (item.sourceType === '2') {
        window.open(`/contract/detail?id=${item.sourceId}`, '_blank')
        // 打开供应商
      } else if (item.sourceType === '3') {
        window.open(`/supplier/detail?id=${item.sourceId}`, '_blank')
        // 打开订单
      } else {
        window.open(`/order/detail?id=${item.sourceId}`, '_blank')
      }
    },
    readAll () {
      toReadAllMessage().then(() => {
        this.$message.success('全部已读成功')
        this.$refs.table.reload()
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-table-tbody > tr > td {
  background: #fff !important;
}
.message-item {
  width: 100%;
}
</style>
