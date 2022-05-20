<template>
  <a-card :bordered="false" title="物料信息" style="margin-top: 24px;">
    <a-table
      ref="table"
      size="default"
      rowKey="orderMaterialId"
      :columns="columns"
      :dataSource="data"
      :pagination="false"
    >
      <span slot="material" slot-scope="text, record">
        <div class="two-Multi">{{ record.materialNo }} {{ text }}</div>
      </span>
      <span slot="taxRate" slot-scope="text">
        {{ +text ? `${parseFloat(text)}%` : "无" }}
      </span>
      <span slot="action">
        <router-link
          :to="{ name: 'OrderEdit', query: { id: id } }"
          target="_blank"
          >编辑</router-link
        >
      </span>
    </a-table>
    <a-row
      class="table-total-row"
      type="flex"
      align="middle"
      style="border-bottom: 1px solid #e8e8e8;"
    >
      <div style="width: 71%;">总计</div>
      <div style="width: 9%;">{{ number }}</div>
      <div style="width: 13%;">￥{{ money }}</div>
    </a-row>
  </a-card>
</template>

<script>
export default {
  name: 'MaterialList',
  props: {
    updatePermission: {
      type: [Number, Boolean],
      default: false
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
    },
    paid: {
      type: [Number, String],
      default: 0
    },
    unpaid: {
      type: [Number, String],
      default: 0
    },
    id: {
      type: [Number, String],
      default: ''
    }
  },
  data () {
    return {
      columns: [
        {
          title: '物料',
          dataIndex: 'materialName',
          width: '17%',
          scopedSlots: { customRender: 'material' }
        },
        {
          title: '物料品牌',
          dataIndex: 'brand',
          width: '15%',
          customRender: (text) => {
            return <div class="two-Multi">{text}</div>
          }
        },
        {
          title: '规格型号',
          dataIndex: 'model',
          width: '17%',
          customRender: (text) => {
            return <div class="two-Multi">{text}</div>
          }
        },
        {
          title: '税率',
          dataIndex: 'taxRate',
          scopedSlots: { customRender: 'taxRate' },
          width: '8%'
        },
        {
          title: '采购单价(元)',
          dataIndex: 'unitPrice',
          width: '14%',
          customRender (text) {
            return `￥${text}`
          }
        },
        {
          title: '数量',
          dataIndex: 'total',
          width: '9%',
          customRender (text, record) {
            return `${text}${record.unitv || ''}`
          }
        },
        {
          title: '金额',
          dataIndex: 'allPrice',
          width: '13%',
          customRender (text) {
            return `￥${text}`
          }
        }
      ]
    }
  },
  watch: {
    updatePermission (val) {
      if (
        val &&
        this.columns[this.columns.length - 1].dataIndex !== 'orderId'
      ) {
        this.columns.push({
          title: '操作',
          dataIndex: 'orderId',
          width: '7%',
          scopedSlots: { customRender: 'action' }
        })
      }
    }
  }
}
</script>

<style></style>
