<template>
  <page-header-wrapper>
    <a-card class="search-card" style="margin-top: 24px" :bordered="false">
      <a-form ref="form" layout="inline">
        <standard-form-row title="报表类型" block style="padding-bottom: 11px;">
          <a-form-item>
            <tag-select v-model="types">
              <tag-select-option
                v-for="tag in typeList"
                :key="tag.companyId"
                :value="tag.companyId"
                >{{ tag.companyName }}</tag-select-option
              >
            </tag-select>
          </a-form-item>
        </standard-form-row>
        <standard-form-row title="其它选项" grid last>
          <a-row :gutter="48" style="margin-bottom: 20px;">
            <a-col :md="8" :sm="24">
              <a-form-item label="选择项目">
                <project-select v-model="queryParam.projectId"></project-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="选择公司">
                <company-select v-model="queryParam.companyId"></company-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row type="flex" justify="end" style="margin-bottom: 20px;">
            <a-button type="primary">生成报表</a-button>
            <a-button style="margin-left: 10px;">导出报表</a-button>
          </a-row>
        </standard-form-row>
      </a-form>
    </a-card>
    <a-card style="margin-top: 24px" :bordered="false">
      <div class="table-operator"></div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import {
  ProjectSelect,
  CompanySelect,
  TagSelect,
  StandardFormRow
} from '@/components'
import { getStockList, updatePaidRepBz } from '@/api/report'

export default {
  name: 'reportAmoeba',
  components: {
    ProjectSelect,
    CompanySelect,
    TagSelect,
    StandardFormRow
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      typeList: [],
      types: []
    }
  },
  methods: {
    // 导出
    openExport () {
      if (!this.queryParam.projectId) {
        this.$message.warning('请选择项目')
      } else if (!this.tableData || !this.tableData.length) {
        this.$message.warning('当前项目有没有数据')
      } else {
        this.visible = true
      }
    },
    exportReport () {}
  }
}
</script>

<style lang="less" scoped>
.table-page-search-wrapper {
  /deep/ .ant-form-inline .ant-form-item > .ant-form-item-label {
    width: 80px;
  }
}
</style>
