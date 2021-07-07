<template>
  <a-card class="card" title="消息中心" :bordered="false">
    <a slot="extra" @click="readAll">全部已读</a>
    <a-row class="message-item" v-for="(item,index) in msgList" :key="index" type="flex">
      <a-col flex="auto" :style="{color:item.isRead==='1'?'#c0c0c0':'',cursor: 'pointer'}" @click="openPage(item)">{{item.content}}</a-col>
      <a-col flex="130px" :style="{color:item.isRead==='1'?'#c0c0c0':''}">{{item.ctime}}</a-col>
    </a-row>
    <div class="pagination">
        <!-- :default-current="pagination.currentPage" -->
        <a-pagination
          v-model="pagination.currentPage"
          show-quick-jumper
          show-size-changer
          :page-size-options="pagination.sizes"
          :total="pagination.total"
          :page-size.sync="pagination.pageSize"
          :show-total="
            (total, range) =>
              `共 ${total} 条记录 第${pagination.currentPage}/${Math.ceil(
                total / pagination.pageSize
              )}页`
          "
          @change="onChange"
          @showSizeChange="sizeChange"
        />
      </div>
  </a-card>
</template>

<script>
import { getAllStockClkList } from '@/api/stock'
import { toGetMessageList, toReadMessageById, toReadAllMessage } from '@/api/user'
export default {
  name: 'MessageCenter',
  data () {
    return {
      pagination: {
        // 任务流水列表页码
        sizes: ['1', '5', '10', '15'], // 页容量
        currentPage: 1, // 默认页
        total: 50, // 总数
        pageSize: 10 // 默认页容量
      },
      columns: [],
      loadData: parameter => {
        return getAllStockClkList(parameter)
      },
      msgList: []
    }
  },
  methods: {
    // 打开新窗口
    openPage (item) {
      toReadMessageById({ messageId: item.id })
      // 打开项目
      if (item.sourceType === '1') {
        window.open(
        `/project/detail?id=${item.sourceId}`,
        '_blank'
        )
        // 打开合同
      } else if (item.sourceType === '2') {
        window.open(
        `/contract/detail?id=${item.sourceId}`,
        '_blank'
        )
        // 打开供应商
      } else if (item.sourceType === '3') {
        window.open(
        `/supplier/detail?id=${item.sourceId}`,
        '_blank'
        )
        // 打开订单
      } else {
        window.open(
        `/order/detail?id=${item.sourceId}`,
        '_blank'
        )
      }
    },
    // 获取消息列表
    getData () {
      toGetMessageList({
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      }).then(({ data }) => {
        console.log('获取消息列表', data)
        this.msgList = data.records
        this.pagination.total = +data.total
      })
    },
    // 任务流水页码改变事件
    onChange (page, size) {
      // console.log('Page: ', page)
      this.pagination.currentPage = page
      this.getData()
    },
    // 任务流水页容量改变事件
    sizeChange (current, size) {
      // console.log('size: ', size)
      this.pagination.currentPage = 1
      this.pagination.pageSize = size
      this.getData()
    },
    readAll () {
      toReadAllMessage().then(() => {
        this.$message.success('全部已读成功')
        this.getData()
      })
    }

  },
  created () {
    this.getData()
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
  border-bottom: 1px solid #e9e9e9;
}
.pagination {
      margin-top: 10px;
      /deep/ .ant-pagination {
        padding-top: 10px;
        padding-bottom: 20px;
        text-align: right;
      }
      /deep/ .ant-pagination-total-text {
        float: left;

        // margin-left: 20px;
        // margin-right: 300px;
      }
    }
</style>
