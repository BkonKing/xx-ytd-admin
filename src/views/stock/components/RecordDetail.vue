<template>
  <a-modal
    :title="`查看-${typeText}单`"
    :visible="visible"
    :footer="null"
    width="900px"
    @cancel="visible = false"
  >
    <a-descriptions size="small" :column="2">
      <a-descriptions-item label="项目名称">
        {{ data.projectName || "--" }}
      </a-descriptions-item>
      <a-descriptions-item v-if="isRK" label="入库订单号">
        <router-link
          v-if="data.orderNo"
          :to="{ name: 'OrderDetail', query: { id: data.orderId } }"
          target="_blank"
          >{{ data.orderNo }}</router-link
        >
        <template v-else>
          --
        </template>
      </a-descriptions-item>
      <a-descriptions-item v-if="!isRK" :label="`${typeText}日期`">
        {{ data.cktime || "--" }}
      </a-descriptions-item>
      <a-descriptions-item v-if="!isRK" label="领料部门">
        {{ data.department || "--" }}
      </a-descriptions-item>
      <a-descriptions-item v-if="!isRK" label="领料人">
        {{ data.stockMen || "--" }}
      </a-descriptions-item>
      <a-descriptions-item :label="`${typeText}人`">
        {{ data.clkAdmin || "--" }}
      </a-descriptions-item>
      <a-descriptions-item :label="`系统${typeText}`">
        {{ data.ctime || "--" }}
      </a-descriptions-item>
      <a-descriptions-item label="物料" :span="2">
        种类{{ data.materiaCount }}<span style="margin-left: 14px"></span>数量{{
          data.materiaNum
        }}
      </a-descriptions-item>
      <a-descriptions-item label="上传凭证" :span="2">
        <t-image :images="data.stockPz"></t-image>
      </a-descriptions-item>
    </a-descriptions>
    <a-table
      ref="table"
      size="default"
      rowKey="stockId"
      :columns="columns"
      :data-source="data.materia"
      :pagination="false"
    >
      <span slot="index" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="materialName" slot-scope="text, record">
        <router-link
          :to="{ name: 'stockDetail', query: { id: record.stockId } }"
          target="_blank"
        >
          {{ record.materialNo }} {{ text }} </router-link
        >/{{ record.brand }}/{{ record.model }}
      </span>
      <div slot="stockNum" slot-scope="text, record" style="min-width: 70px;">
        {{ text }} {{ record.unitv }}
      </div>
    </a-table>
    <a-row
      class="table-total-row"
      type="flex"
      align="middle"
      style="border-bottom: 1px solid #e8e8e8;"
    >
      <a-col flex="1">总计</a-col>
      <a-col :flex="`0 0 ${isRK ? '21.9%' : '57%'}`">{{ data.materiaNum }}</a-col>
    </a-row>
  </a-modal>
</template>

<script>
import { TImage } from '@/components'
export default {
  name: '',
  components: {
    TImage
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      visible: this.value,
      columns: [
        {
          title: '序号',
          dataIndex: 'id',
          scopedSlots: { customRender: 'index' },
          width: '8%'
        },
        {
          title: '物料',
          dataIndex: 'materialName',
          scopedSlots: { customRender: 'materialName' },
          width: '35%'
        },
        {
          title: '数量',
          dataIndex: 'stockNum',
          scopedSlots: { customRender: 'stockNum' },
          width: '12%'
        },
        {
          title: '物料用途',
          dataIndex: 'remarks'
        }
      ]
    }
  },
  computed: {
    isRK () {
      return this.data.stockType === '1'
    },
    typeText () {
      return this.isRK ? '入库' : '出库'
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('input', val)
    },
    isRK (val) {
      const index = this.columns.findIndex(
        column => column.dataIndex === 'remarks'
      )
      // 入库单不显示物料用途
      if (val && index > 0) {
        this.columns.pop()
      } else if (!val && index === -1) {
        this.columns.push({
          title: '物料用途',
          dataIndex: 'remarks'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-form-item {
  margin-bottom: 0;
}
/deep/ .ant-descriptions-item-label {
  width: 120px;
  text-align: right;
  vertical-align: top;
}
/deep/ .ant-descriptions-small .ant-descriptions-row > th,
/deep/ .ant-descriptions-small .ant-descriptions-row > td {
  padding-bottom: 16px;
}
</style>
