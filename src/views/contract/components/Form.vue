<template>
  <div>
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
            <a-select-option value="4">施工前期准备</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="上传合同" prop="legalPersonPz">
          <upload-image
            v-model="form.legalPersonPz"
            maxLength="50"
          ></upload-image>
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
          <a-select v-model="form.supplierId">
            <a-select-option value="4">施工前期准备</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="物料" prop="material" required>
          <a-select mode="multiple" v-model="form.material">
            <a-select-option value="4">施工前期准备</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="结算方式" prop="settleType" required>
          <a-select v-model="form.settleType">
            <a-select-option value="4">施工前期准备</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="付款方式" prop="payType" required>
          <a-select v-model="form.payType">
            <a-select-option value="4">施工前期准备</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </div>
</template>

<script>
import clonedeep from 'lodash.clonedeep'
import { UploadImage, ProjectSelect, ContractTypeSelect } from '@/components'
const form = {
  projectId: '',
  contractNo: '',
  categoryId: '',
  contractName: '',
  signDate: '',
  rtime: [],
  contractStatus: '',
  legalPersonPz: [],
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
  name: 'Form',
  components: {
    UploadImage,
    ProjectSelect,
    ContractTypeSelect
  },
  data () {
    return {
      labelCol: { lg: { span: 7 }, sm: { span: 7 } },
      wrapperCol: { lg: { span: 10 }, sm: { span: 17 } },
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
  methods: {
    formValidate (form) {
      return new Promise((resolve, reject) => {
        this.$refs[form].validate(valid => {
          if (valid) {
            if (this.form.rtime && this.form.rtime.length) {
              this.startDate = this.form.rtime[0]
              this.endDate = this.form.rtime[1]
            }
            resolve(this.form)
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
    setFieldsValue (data) {
      this.form = data
    },
    resetFields () {
      this.$refs.form.resetFields()
      this.form = clonedeep(form)
    }
  }
}
</script>

<style></style>
