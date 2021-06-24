<template>
  <a-card
    class="search-card"
    :bordered="false"
    title="供应物料"
    style="margin-top: 24px;"
  >
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="关联项目">
              <project-select v-model="queryParam.projectId"></project-select>
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
      <span slot="project" slot-scope="text, record">
        <a-button type="link" @click="goProject(record.projectId)"
          >text</a-button
        >
      </span>
    </s-table>
  </a-card>
</template>

<script>
import { STable, ProjectSelect, MaterialTypeSelect } from '@/components'
import { getSuppMaterialList } from '@/api/supplier'
export default {
  name: '',
  components: {
    STable,
    ProjectSelect,
    MaterialTypeSelect
  },
  props: {
    type: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      queryParam: {},
      columns: [
        {
          title: '物料',
          dataIndex: 'materialName'
        },
        {
          title: '数量',
          dataIndex: 'mtotal'
        },
        {
          title: '金额',
          dataIndex: 'allPrice',
          width: '10%'
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
