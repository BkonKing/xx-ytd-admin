<template>
  <a-form layout="inline">
    <a-row :gutter="48">
      <a-col :md="8" :sm="24">
        <a-form-item label="合同状态">
          <a-select v-model="queryParam.contractStatus" placeholder="请选择">
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
      <a-col :md="8" :sm="24">
        <a-form-item label="所属项目">
          <project-select v-model="queryParam.projectId"></project-select>
        </a-form-item>
      </a-col>
      <template v-if="advanced">
        <a-col :md="8" :sm="24">
          <a-form-item label="所属公司">
            <company-select v-model="queryParam.companyId"></company-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="合同类型">
            <contract-type-select
              v-model="queryParam.categoryId"
            ></contract-type-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="订单">
            <a-input v-model="queryParam.orderId" placeholder="ID"></a-input>
          </a-form-item>
        </a-col>
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
            <a-select v-model="queryParam.payStatus" placeholder="请选择">
              <a-select-option
                v-for="option in payStatusOptions"
                :value="option.value"
                :key="option.value"
              >
                {{ option.text }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="创建时间">
            <a-range-picker
              v-model="queryParam.time"
              valueFormat="YYYY-MM-DD"
            />
          </a-form-item>
        </a-col>
      </template>
      <a-col :md="(!advanced && 8) || 24" :sm="24">
        <span
          class="table-page-search-submitButtons"
          :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
        >
          <a-button type="primary" @click="search">查询</a-button>
          <a-button style="margin-left: 8px" @click="reset">重置</a-button>
          <a @click="toggleAdvanced" style="margin-left: 8px">
            {{ advanced ? "收起" : "展开" }}
            <a-icon :type="advanced ? 'up' : 'down'" />
          </a>
        </span>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
import { ProjectSelect, CompanySelect, ContractTypeSelect } from '@/components'
export default {
  name: 'contractSearchForm',
  components: {
    ProjectSelect,
    CompanySelect,
    ContractTypeSelect
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      queryParam: this.value,
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
      // 付款情况：0=全部、1=全部已付、2=全部未付、3=部分已付/未付
      payStatusOptions: [
        {
          value: 0,
          text: '全部'
        },
        {
          value: 1,
          text: '全部已付'
        },
        {
          value: 2,
          text: '全部未付'
        },
        {
          value: 3,
          text: '部分已付/未付'
        }
      ]
    }
  },
  methods: {
    search () {
      this.$emit('input', this.queryParam)
      this.$emit('search')
    },
    reset () {
      this.queryParam = {}
      this.$emit('input', this.queryParam)
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  },
  watch: {
    value (val) {
      this.queryParam = val
    }
  }
}
</script>

<style></style>
