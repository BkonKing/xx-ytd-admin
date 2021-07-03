<template>
  <a-card :bordered="false" title="物料信息" style="margin-top: 24px;">
    <s-table ref="table" size="default" :columns="columns" :data="loadData">
      <span slot="actions" slot-scope="text">
        <a-button type="link" @click="goOrderDetail(text)">查看</a-button>
      </span>
      <template slot="footer">
        总计 100 ￥10,000.00
      </template>
    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getSuppMaterialList } from '@/api/supplier'
export default {
  name: '',
  components: {
    STable
  },
  props: {
    type: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      columns: [
        {
          title: '物料',
          dataIndex: 'materialName',
          width: '150px'
        },
        {
          title: '物料品牌',
          dataIndex: 'name11',
          width: '150px'
        },
        {
          title: '规格型号',
          dataIndex: 'workId',
          width: '20%'
        },
        {
          title: '采购单价（元）',
          dataIndex: 'department',
          width: '20%'
        },
        {
          title: '数量',
          dataIndex: 'number',
          width: '20%'
        },
        {
          title: '金额',
          dataIndex: 'money',
          width: '10%'
        }
      ],
      loadData: parameter => {
        return getSuppMaterialList(parameter)
      }
    }
  },
  created () {
    if (this.type === '1') {
      this.columns.push({
        title: '操作',
        dataIndex: 'id',
        width: '100px',
        scopedSlots: { customRender: 'action' }
      })
    }
  }
}
</script>

<style></style>
