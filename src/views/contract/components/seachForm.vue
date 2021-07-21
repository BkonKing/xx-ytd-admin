<template>
  <a-form layout="inline">
    <a-row :gutter="48">
      <a-col :md="8" :sm="24">
      <a-form-item label="审核状态">
        <a-select
          v-model="queryParam.status"
          placeholder="请选择"
          :disabled="statusAble"
        >
          <a-select-option
            v-for="option in statusOptions"
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
        <a-col v-if="isParentCompany" :md="8" :sm="24">
          <a-form-item label="所属公司">
            <company-select v-model="queryParam.companyId"></company-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="合同状态">
            <a-select
              v-model="queryParam.contractStatus"
              placeholder="请选择"
              :disabled="contractStatusAble"
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
        <a-col :md="8" :sm="24">
          <a-form-item label="合同类型">
            <contract-type-select
              v-model="queryParam.categoryId"
            ></contract-type-select>
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
          <a-form-item label="订单">
            <a-input v-model="queryParam.orderId" placeholder="ID"></a-input>
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
        <a-col :md="8" :sm="24">
          <a-form-item label="创建时间">
            <a-range-picker
              v-model="queryParam.time"
              valueFormat="YYYY-MM-DD"
            />
          </a-form-item>
        </a-col>
      </template>
      <advanced-form
        v-model="advanced"
        :md="isParentCompany ? 16 : 24"
        @search="$refs.table.refresh(true)"
        @reset="reset"
      ></advanced-form>
    </a-row>
  </a-form>
</template>

<script>
import {
  ProjectSelect,
  CompanySelect,
  ContractTypeSelect,
  PayStatusSelect,
  AdvancedForm
} from '@/components'
export default {
  name: 'contractSearchForm',
  components: {
    ProjectSelect,
    CompanySelect,
    ContractTypeSelect,
    PayStatusSelect,
    AdvancedForm
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    statusAble: {
      type: Boolean,
      default: false
    },
    contractStatusAble: {
      type: Boolean,
      default: false
    },
    activeIndex: {
      type: [Number, String],
      default: 0
    }
  },
  data () {
    return {
      queryParam: this.value,
      advanced: false,
      // 审核状态：0=全部、1=待审核、2=已通过、3=未通过
      statusOptions: [
        { value: '0', text: '全部' },
        { value: '1', text: '待审核' },
        { value: '2', text: '已通过' },
        { value: '3', text: '未通过' }
      ],
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
      ]
    }
  },
  methods: {
    search () {
      this.$emit('input', this.queryParam)
      this.$emit('search')
    },
    reset () {
      let status = ''
      let contractStatus = ''
      const index = +this.tabActiveKey
      if (index !== 0) {
        if (index < 10) {
          status = String(index)
        } else {
          contractStatus = index - 10
        }
      }
      this.queryParam = {
        status,
        contractStatus
      }
      this.$emit('input', this.queryParam)
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  },
  watch: {
    value (val) {
      this.queryParam = val
    },
    activeIndex (val) {
      const index = +val
      console.log(index)
      if (index !== 0) {
        if (index < 10) {
          this.queryParam.status = String(index)
          console.log('status', this.queryParam.status)
        } else {
          this.queryParam.contractStatus = index - 10
        }
      } else {
        this.queryParam.status = ''
        this.queryParam.contractStatus = ''
      }
    }
  }
}
</script>

<style></style>
