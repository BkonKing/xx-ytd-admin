<template>
  <page-header-wrapper :title="title">
    <a-card class="card" title="基本信息" :bordered="false">
      <a-form-model
        ref="BasicForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="项目" prop="projectId" required>
          <project-select v-model="form.projectId"></project-select>
        </a-form-model-item>
        <a-form-model-item label="合同编号" prop="contractNo" required>
          <a-input
            v-model="form.contractNo"
            :maxLength="50"
            placeholder="请输入"
          />
        </a-form-model-item>
        <a-form-model-item label="合同类型" prop="categoryId" required>
          <contract-type-select
            v-model="form.categoryId"
          ></contract-type-select>
        </a-form-model-item>
        <a-form-model-item label="合同名称" prop="contractName" required>
          <a-input
            v-model="form.contractName"
            :maxLength="50"
            placeholder="请输入"
          />
        </a-form-model-item>
        <a-form-model-item label="签订日期" prop="signDate" required>
          <a-date-picker
            v-model="form.signDate"
            placeholder="请选择"
            valueFormat="YYYY-MM-DD"
          ></a-date-picker>
        </a-form-model-item>
        <a-form-model-item label="合同有效期" prop="rtime" required>
          <a-range-picker
            v-model="form.rtime"
            valueFormat="YYYY-MM-DD"
          ></a-range-picker>
        </a-form-model-item>
        <a-form-model-item label="合同状态" prop="contractStatus" required>
          <a-select v-model="form.contractStatus">
            <a-select-option
              v-for="option in contractStatusOptions"
              :value="option.value"
              :key="option.value"
            >
              {{ option.text }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="上传合同" prop="contractPz">
          <upload-image v-model="form.contractPz" maxLength="50"></upload-image>
          <div style="margin-top: -20px;">
            最多50张；支持扩展名：.png .jpg；
          </div>
        </a-form-model-item>
        <a-form-model-item label="备注" prop="remarks">
          <a-textarea
            v-model="form.remarks"
            placeholder="请输入"
            rows="4"
            :maxLength="500"
          ></a-textarea>
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <a-card class="card" title="供应商信息" :bordered="false">
      <a-form-model
        ref="SupplierForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="合同金额" prop="contractMoney" required>
          <a-input
            v-model="form.contractMoney"
            v-number-input
            placeholder="请输入"
            :maxLength="20"
          >
            <a-tooltip slot="suffix">
              元
            </a-tooltip>
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="合同总量" prop="contractTotal" required>
          <a-input
            v-model="form.contractTotal"
            v-number-input
            placeholder="请输入"
            :maxLength="20"
          >
            <a-tooltip slot="suffix">
              件
            </a-tooltip>
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="税率" prop="taxRate" required>
          <a-input-number v-model="form.taxRate" :min="0" :max="100" />
          <span style="margin-left: 10px;">%</span>
        </a-form-model-item>
        <a-form-model-item label="供应商" prop="supplierId" required>
          <supplier-select v-model="form.supplierId"></supplier-select>
        </a-form-model-item>
        <a-form-model-item label="物料" prop="material" required>
          <material-type-select
            v-model="form.material"
            tree-checkable
          ></material-type-select>
        </a-form-model-item>
        <a-form-model-item label="结算方式" prop="settleType" required>
          <a-select v-model="form.settleType">
            <a-select-option
              v-for="option in settleTypeOptions"
              :value="option.typeId"
              :key="option.typeId"
            >
              {{ option.typeName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="付款方式" prop="payType" required>
          <a-select v-model="form.payType">
            <a-select-option
              v-for="option in payTypeOptions"
              :value="option.typeId"
              :key="option.typeId"
            >
              {{ option.typeName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-card>

    <!-- fixed footer toolbar -->
    <footer-tool-bar :is-mobile="isMobile" :collapsed="sideCollapsed">
      <a-button @click="$router.go(-1)" style="margin-right: 20px;">
        取消
      </a-button>
      <a-button type="primary" @click="validate" :loading="loading">
        提交
      </a-button>
    </footer-tool-bar>
  </page-header-wrapper>
</template>

<script>
import clonedeep from 'lodash.clonedeep'
import {
  UploadImage,
  ProjectSelect,
  ContractTypeSelect,
  SupplierSelect,
  MaterialTypeSelect
} from '@/components'
import FooterToolBar from '@/components/FooterToolbar'
import { appMixin } from '@/store/mixin'
import {
  addCont,
  updateCont,
  getSettleType,
  getPayType,
  getContractInfo
} from '@/api/contract'
const form = {
  projectId: '',
  contractNo: '',
  categoryId: '',
  contractName: '',
  signDate: '',
  rtime: [],
  contractStatus: '',
  contractPz: [],
  remarks: '',
  contractMoney: '',
  contractTotal: '',
  taxRate: 0,
  supplierId: '',
  material: [],
  settleType: '',
  payType: ''
}
export default {
  name: 'ContractEdit',
  mixins: [appMixin],
  components: {
    FooterToolBar,
    UploadImage,
    ProjectSelect,
    ContractTypeSelect,
    SupplierSelect,
    MaterialTypeSelect
  },
  data () {
    return {
      id: '',
      title: '新增合同',
      loading: false,
      memberLoading: false,
      labelCol: { lg: { span: 7 }, sm: { span: 7 } },
      wrapperCol: { lg: { span: 10 }, sm: { span: 17 } },
      // 合同状态：1=正常、2=延期、3=终止
      contractStatusOptions: [
        {
          text: '正常',
          value: '1'
        },
        {
          text: '延期',
          value: '2'
        },
        {
          text: '终止',
          value: '3'
        }
      ],
      settleTypeOptions: [],
      payTypeOptions: [],
      form: clonedeep(form),
      rules: {
        projectId: [{ required: true, message: '请选择项目' }],
        contractNo: [{ required: true, message: '请输入合同编号' }],
        categoryId: [{ required: true, message: '请选择合同类型' }],
        contractName: [{ required: true, message: '请输入合同名称' }],
        signDate: [{ required: true, message: '请选择签订日期' }],
        rtime: [{ required: true, message: '请选择合同有效期' }],
        contractStatus: [{ required: true, message: '请选择合同状态' }],
        contractMoney: [{ required: true, message: '请输入合同金额' }],
        contractTotal: [{ required: true, message: '请输入合同总量' }],
        taxRate: [{ required: true, message: '请输入税率' }],
        supplierId: [{ required: true, message: '请选择供应商' }],
        material: [{ required: true, message: '请选择物料' }],
        settleType: [{ required: true, message: '请选择结算方式' }],
        payType: [{ required: true, message: '请选择付款方式' }]
      }
    }
  },
  created () {
    this.id = this.$route.query.id
    this.getSettleType()
    this.getPayType()
    if (this.id) {
      this.title = '编辑合同'
      this.getContractInfo()
    }
  },
  methods: {
    // 获取合同详情
    getContractInfo () {
      getContractInfo({
        id: this.id
      }).then(({ data }) => {
        if (data.startDate) {
          data.rtime = [data.startDate, data.endDate]
        }
        this.form = data
      })
    },
    getSettleType () {
      getSettleType().then(({ data }) => {
        this.settleTypeOptions = data
      })
    },
    getPayType () {
      getPayType().then(({ data }) => {
        this.payTypeOptions = data
      })
    },
    formValidate (form) {
      return new Promise((resolve, reject) => {
        this.$refs[form].validate(valid => {
          if (valid) {
            resolve()
          } else {
            reject(new Error(false))
            return false
          }
        })
      })
    },
    handleSubmit () {
      return Promise.all([
        this.formValidate('BasicForm'),
        this.formValidate('SupplierForm')
      ])
    },
    // 最终全页面提交
    validate () {
      this.handleSubmit()
        .then(() => {
          if (this.form.rtime && this.form.rtime.length) {
            this.form.startDate = this.form.rtime[0]
            this.form.endDate = this.form.rtime[1]
          }
          if (this.id) {
            this.updateCont(this.form)
          } else {
            this.addCont(this.form)
          }
        })
        .catch(() => {})
    },
    addCont (params) {
      addCont(params).then(() => {
        this.$message.success('提交成功')
        this.$router.go(-1)
      })
    },
    updateCont (params) {
      updateCont({
        ...params,
        id: this.id
      }).then(() => {
        this.$message.success('提交成功')
        this.$router.go(-1)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  margin-bottom: 24px;
}
</style>
