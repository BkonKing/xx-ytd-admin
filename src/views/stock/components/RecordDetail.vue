<template>
  <a-modal
    :title="`查看-${typeText}单`"
    :visible="visible"
    :footer="null"
    width="80%"
    @cancel="visible = false"
  >
    <a-descriptions size="small" :column="2">
      <a-descriptions-item label="项目名称">
        {{ data.projectName || "--" }}
      </a-descriptions-item>
      <a-descriptions-item :label="`${typeText}日期`">
        {{ data.cktime || "--" }}
      </a-descriptions-item>
      <a-descriptions-item label="领料部门">
        {{ data.department || "--" }}
      </a-descriptions-item>
      <a-descriptions-item label="领料人">
        {{ data.stockMen || "--" }}
      </a-descriptions-item>
      <a-descriptions-item :label="`${typeText}人`">
        {{ data.clkAdmin || "--" }}
      </a-descriptions-item>
      <a-descriptions-item :label="`系统${typeText}`">
        {{ data.ctime || "--" }}
      </a-descriptions-item>
      <a-descriptions-item label="物料" :span="2">
        种类{{ data.materiaCount }} 数量{{ data.materiaNum }}
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
        >
          {{ record.materialNo }} {{ text }} </router-link
        >/{{ record.brand }}/{{ record.model }}
      </span>
      <span slot="stockNum" slot-scope="text, record">
        {{ text }} {{ record.unitv }}
      </span>
    </a-table>
    <a-row
      class="table-total-row"
      type="flex"
      align="middle"
      style="border-bottom: 1px solid #e8e8e8;"
    >
      <div style="width: calc(40% + 80px);">总计</div>
      <div>{{ data.materiaNum }}</div>
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
          width: '80px'
        },
        {
          title: '物料',
          dataIndex: 'materialName',
          scopedSlots: { customRender: 'materialName' },
          width: '40%'
        },
        {
          title: '数量',
          dataIndex: 'stockNum',
          scopedSlots: { customRender: 'stockNum' },
          width: '150px'
        },
        {
          title: '物料用途',
          dataIndex: 'remarks'
        }
      ]
    }
  },
  computed: {
    typeText () {
      return this.data.stockType === '1' ? '入库' : '出库'
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-form-item {
  margin-bottom: 0;
}
</style>
