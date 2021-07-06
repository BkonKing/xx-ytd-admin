<template>
  <a-card :bordered="false" title="供应物料" style="margin-top: 24px;">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="关联项目">
              <a-select v-model="queryParam.projectId" placeholder="请选择">
                <a-select-option
                  v-for="option in options"
                  :value="option.projectId"
                  :key="option.projectId"
                >
                  {{ option.projectName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="供应物料">
              <material-type-select
                v-model="queryParam.materialId"
              ></material-type-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24" style="text-align: right;">
            <a-button type="primary" @click="$refs.table.refresh(true)"
              >查询</a-button
            >
            <a-button
              style="margin-left: 8px"
              @click="() => (this.queryParam = {})"
              >重置</a-button
            >
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table ref="table" size="default" :columns="columns" :data="loadData">
      <span slot="name" slot-scope="text, record"
        >{{ record.materialNo }} {{ text }}</span
      >
      <span slot="project" slot-scope="text, record">
        <a @click="goProject(record.projectId)">{{ text }}</a>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import { STable, MaterialTypeSelect } from '@/components'
import { getSuppMaterialList } from '@/api/supplier'
export default {
  name: '',
  components: {
    STable,
    MaterialTypeSelect
  },
  props: {
    supplierId: {
      type: [Number, String],
      default: 0
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      queryParam: {},
      columns: [
        {
          title: '物料',
          dataIndex: 'materialName',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '数量',
          dataIndex: 'mtotal'
        },
        {
          title: '金额',
          dataIndex: 'allPrice',
          width: '20%'
        },
        {
          title: '订单',
          dataIndex: 'orderNum'
        },
        {
          title: '所属项目',
          dataIndex: 'projectName',
          scopedSlots: { customRender: 'project' }
        }
      ],
      loadData: parameter => {
        this.queryParam.supplierId = this.supplierId
        return getSuppMaterialList(Object.assign(parameter, this.queryParam))
      }
    }
  },
  methods: {
    goProject (id) {
      this.$router.push({
        name: 'ProjectDetail',
        query: {
          id
        }
      })
    }
  }
}
</script>

<style></style>
