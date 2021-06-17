<template>
  <div>
    <a-card title="付款信息" style="margin-top: 24px" :bordered="false">
      <s-table ref="table" size="default" :columns="columns" :data="loadData">
        <span slot="contract" slot-scope="text">{{ text }}</span>
      </s-table>
      <a-row class="table-total" type="flex" align="middle">
        <a-col flex="1">总计(4)</a-col>
        <a-col flex="1">￥40,000.00</a-col>
        <a-col flex="1">已开3 (￥30,000.00)，未开1 (￥30,000.00)</a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getPermissions } from '@/api/manage'
export default {
  name: 'contractTab',
  components: {
    STable
  },
  data () {
    return {
      queryParam: {
        status: [],
        projectId: '0',
        system: '',
        type: '',
        contract: '',
        gys: '',
        fk: ''
      },
      advanced: false,
      columns: [
        {
          title: '序号',
          dataIndex: 'id'
        },
        {
          title: '付款时间',
          dataIndex: 'name'
        },
        {
          title: '付款ID',
          dataIndex: 'name1',
          scopedSlots: { customRender: 'contract' }
        },
        {
          title: '付款方式',
          dataIndex: 'name2'
        },
        {
          title: '付款金额',
          dataIndex: 'name3'
        },
        {
          title: '付款凭证',
          dataIndex: 'name4'
        },
        {
          title: '开票情况',
          dataIndex: 'name5'
        },
        {
          title: '开票凭证',
          dataIndex: 'name6'
        },
        {
          title: '创建时间',
          dataIndex: 'name7'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getPermissions({
          params: Object.assign(parameter, this.queryParam)
        }).then(res => {
          return res.result
        })
      },
      logLoadData: getPermissions
    }
  }
}
</script>

<style lang="less" scoped>
.table-total {
  height: 52px;
  border-bottom: 1px solid #ccc;
}
</style>
