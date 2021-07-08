<template>
  <div class="infomationSet">
    <a-card>
      <a-table :columns="columns" :data-source="tableData" :pagination="false">
        <template slot="opera" slot-scope="text, record">
          <div>
            <a-button type="link" :disabled="!permissions.UpdatePermission" @click="toEditContent(record)"
              >编辑内容</a-button
            >
          </div>
        </template>
        <template slot="webSend" slot-scope="text, record">
          <div>
            <a-checkbox
              :checked="record.webSend == 1 ? true : false"
              :disabled="!permissions.webSendSet"
              @change="sendWeb(record)"
            >
              是否发送
            </a-checkbox>
          </div>
        </template>
        <template slot="wxSend" slot-scope="text, record">
          <div>
            <a-checkbox
              :checked="record.wxSend == 1 ? true : false"
              :disabled="!permissions.wxSendSet"
              @change="sendWx(record)"
            >
              是否发送
            </a-checkbox>
          </div>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { toSetData, toWebSendSet, toWxSendSet } from '@/api/basicSet'

export default {
  data () {
    return {
      tableData: [],
      columns: [
        {
          title: '消息类型',
          dataIndex: 'messageName',
          key: 'messageName'
          // scopedSlots: { customRender: 'name' }
        },
        {
          title: '站内消息',
          dataIndex: 'webSend',
          key: 'webSend',
          scopedSlots: { customRender: 'webSend' }
          // width: 80
        },
        {
          title: '微信公众号',
          dataIndex: 'wxSend',
          key: 'wxSend',
          scopedSlots: { customRender: 'wxSend' }
        },
        {
          title: '操作',
          dataIndex: 'opera',
          key: 'opera',
          scopedSlots: { customRender: 'opera' }
        }
      ],
      pagination: {
        // 任务流水列表页码
        sizes: ['1', '5', '10', '15'], // 页容量
        currentPage: 1, // 默认页
        total: 50, // 总数
        pageSize: 10 // 默认页容量
      },
      flag: 1
    }
  },
  methods: {
    // 跳转到编辑内容
    toEditContent (record) {
      this.$router.push('/basicSet/editContent?id=' + record.id)
    },
    // 设置微信消息
    sendWx (record) {
      if (this.flag !== 1) {
        const hide = this.$message.loading('正在设置中，请稍后..', 0)
        setTimeout(hide, 1000)
        return
      }
      if (+record.wxSend === 1) {
        this.flag = 0
        setTimeout(() => {
          toWxSendSet({
            id: record.id,
            wxSend: 0
          }).then(res => {
            record.wxSend = 0
            this.flag = 1
            this.$message.success(res.message)
            this.getData()
          })
        }, 1000)
      } else {
        this.flag = 0
        setTimeout(() => {
          toWxSendSet({
            id: record.id,
            wxSend: 1
          }).then(res => {
            record.wxSend = 1
            this.flag = 1
            this.$message.success(res.message)
            this.getData()
          })
        }, 1000)
      }

      console.log('发送站内消息', record)
    },
    // 设置站内消息
    sendWeb (record) {
      if (this.flag !== 1) {
        const hide = this.$message.loading('正在设置中，请稍后..', 0)
        setTimeout(hide, 1000)
        return
      }
      if (+record.webSend === 1) {
        this.flag = 0
        setTimeout(() => {
          toWebSendSet({
            id: record.id,
            webSend: 0
          }).then(res => {
            record.webSend = 0
            this.flag = 1
            this.$message.success(res.message)
            this.getData()
          })
        }, 1000)
      } else {
        this.flag = 0
        setTimeout(() => {
          toWebSendSet({
            id: record.id,
            webSend: 1
          }).then(res => {
            record.webSend = 1
            this.flag = 1
            this.$message.success(res.message)
            this.getData()
          })
        }, 1000)
      }

      console.log('发送站内消息', record)
    },
    // 获取消息设置数据
    getData () {
      toSetData().then(res => {
        this.tableData = res.data
        console.log('获取消息设置数据', res)
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
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style></style>
