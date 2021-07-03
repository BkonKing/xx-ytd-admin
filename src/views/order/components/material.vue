<template>
  <a-card :bordered="false" title="物料信息" style="margin-top: 24px;">
    <a-table ref="table" size="default" :columns="columns" :dataSource="data">
      <span slot="material" slot-scope="text, record">
        {{ record.materialNo }} {{ text }}
      </span>
      <span slot="actions" slot-scope="text">
        <router-link :to="{ name: 'OrderDetail', query: { id: text } }"
          >查看</router-link
        >
      </span>
      <template slot="footer"> 总计 {{number}} ￥{{money}} </template>
    </a-table>
  </a-card>
</template>

<script>
export default {
  name: 'MaterialList',
  props: {
    type: {
      type: Number,
      default: 1
    },
    data: {
      type: Array,
      default: () => []
    },
    number: {
      type: [Number, String],
      default: 0
    },
    money: {
      type: [Number, String],
      default: 0
    }
  },
  data () {
    return {
      columns: [
        {
          title: '物料',
          dataIndex: 'materialName',
          width: '150px',
          scopedSlots: { customRender: 'material' }
        },
        {
          title: '物料品牌',
          dataIndex: 'brand'
        },
        {
          title: '规格型号',
          dataIndex: 'model'
        },
        {
          title: '采购单价（元）',
          dataIndex: 'unitPrice'
        },
        {
          title: '数量',
          dataIndex: 'total'
        },
        {
          title: '金额',
          dataIndex: 'allPrice'
        }
      ]
    }
  },
  created () {
    if (this.type === '1') {
      this.columns.push({
        title: '操作',
        dataIndex: 'orderId',
        width: '100px',
        scopedSlots: { customRender: 'action' }
      })
    }
  }
}
</script>

<style></style>
