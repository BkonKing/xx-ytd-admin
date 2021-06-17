<template>
  <div>
    <a-card title="合同信息" style="margin-top: 24px" :bordered="false">
      <div class="table-page-search-wrapper">
        <contract-search-form
          v-model="queryParam"
          ref="contractSearchForm"
          @search="$refs.table.refresh(true)"
        ></contract-search-form>
      </div>

      <s-table ref="table" size="default" :columns="columns" :data="loadData">
        <span slot="contract" slot-scope="text">{{ text }}</span>
      </s-table>
    </a-card>
    <log-list :load="logLoadData"></log-list>
  </div>
</template>

<script>
import { STable, LogList } from '@/components'
import contractSearchForm from '@/views/contract/components/seachForm.vue'
import { getPermissions } from '@/api/manage'
export default {
  name: 'contractTab',
  components: {
    STable,
    contractSearchForm,
    LogList
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
      columns: [
        {
          title: '审核状态',
          dataIndex: 'id'
        },
        {
          title: '所属公司',
          dataIndex: 'name'
        },
        {
          title: '合同编号',
          dataIndex: 'name1',
          scopedSlots: { customRender: 'contract' }
        },
        {
          title: '合同名称',
          dataIndex: 'name2'
        },
        {
          title: '订单',
          dataIndex: 'name3'
        },
        {
          title: '金额',
          dataIndex: 'name4'
        },
        {
          title: '创建时间',
          dataIndex: 'name5'
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

<style></style>
