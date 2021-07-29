<template>
  <div>
    <a-card title="合同信息" style="margin-top: 24px" :bordered="false">
      <div class="table-page-search-wrapper table-page-fw-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="合同状态">
                <a-select
                  v-model="queryParam.contractStatus"
                  placeholder="请选择"
                >
                  <a-select-option
                    v-for="option in contractStatusOptions"
                    :value="option.value"
                    :key="option.value"
                  >
                    {{ option.text }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col v-if="isParentCompany" :md="8" :sm="24">
              <a-form-item label="所属公司">
                <company-select v-model="queryParam.companyId"></company-select>
              </a-form-item>
            </a-col>
            <template v-if="!isParentCompany || advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="合同类型">
                  <contract-type-select
                    v-model="queryParam.categoryId"
                  ></contract-type-select>
                </a-form-item>
              </a-col>
            </template>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="合同">
                  <a-input
                    v-model="queryParam.serachText"
                    placeholder="编号、名称"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="供应商">
                  <a-input
                    v-model="queryParam.serachSupplierText"
                    placeholder="ID、名称"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="付款情况">
                  <pay-status-select
                    v-model="queryParam.payStatus"
                  ></pay-status-select>
                </a-form-item>
              </a-col>
            </template>
            <a-col
              :md="(!advanced && 8) || (isParentCompany ? 24 : 8)"
              :sm="24"
            >
              <span
                class="table-page-search-submitButtons"
                :style="
                  (advanced && { float: 'right', overflow: 'hidden' }) || {}
                "
              >
                <a-button type="primary" @click="search">查询</a-button>
                <a-button style="margin-left: 8px" @click="reset"
                  >重置</a-button
                >
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? "收起" : "展开" }}
                  <a-icon :type="advanced ? 'up' : 'down'" />
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <s-table
        ref="table"
        rowKey="id"
        size="default"
        :columns="columns"
        :data="loadData"
      >
        <span slot="contractNo" slot-scope="text, record">
          <router-link
            :to="{ name: 'ContractDetail', query: { id: record.id } }"
            target="_blank"
            >{{ text }}</router-link
          >
        </span>
      </s-table>
    </a-card>
    <log-list :typeId="10" :sourceId="id"></log-list>
  </div>
</template>

<script>
import {
  STable,
  LogList,
  CompanySelect,
  ContractTypeSelect,
  PayStatusSelect
} from '@/components'
import { getProjectContractList } from '@/api/project'
export default {
  name: 'contractTab',
  components: {
    STable,
    LogList,
    CompanySelect,
    ContractTypeSelect,
    PayStatusSelect
  },
  props: {
    projectId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      queryParam: {},
      advanced: false,
      // 合同状态：0=全部、1=正常、2=延期、3=终止
      contractStatusOptions: [
        {
          value: 0,
          text: '全部'
        },
        {
          value: 1,
          text: '正常'
        },
        {
          value: 2,
          text: '延期'
        },
        {
          value: 3,
          text: '终止'
        }
      ],
      columns: [
        {
          title: '审核状态',
          dataIndex: 'statusv'
        },
        {
          title: '所属公司',
          dataIndex: 'companyName'
        },
        {
          title: '合同编号',
          dataIndex: 'contractNo',
          scopedSlots: { customRender: 'contractNo' }
        },
        {
          title: '合同名称',
          dataIndex: 'contractName'
        },
        {
          title: '订单',
          dataIndex: 'orderNum',
          sorter: true
        },
        {
          title: '金额',
          dataIndex: 'contractMoney',
          sorter: true
        },
        {
          title: '创建时间',
          dataIndex: 'ctime'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        this.queryParam.projectId = this.projectId
        return getProjectContractList(
          Object.assign(parameter, this.queryParam)
        )
      }
    }
  },
  methods: {
    search () {
      this.$refs.table.refresh(true)
    },
    reset () {
      this.queryParam = {}
      this.$refs.table.refresh(true)
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  }
}
</script>

<style></style>
