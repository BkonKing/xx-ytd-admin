<template>
  <a-form-model
    ref="projectForm"
    :model="form"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-model-item label="付款时间" prop="projectName" required>
      <a-date-picker
        v-model="form.projectName"
        placeholder="请选择"
      ></a-date-picker>
    </a-form-model-item>
    <a-form-model-item label="付款方式" prop="stage" required>
      <a-select v-model="form.stage" placeholder="请选择">
        <a-select-option
          v-for="option in stageList"
          :key="option.stageId"
          :value="option.stageId"
          >{{ option.stageText }}</a-select-option
        >
      </a-select>
    </a-form-model-item>
    <a-form-model-item label="付款金额" prop="money" required>
      <a-input v-model="form.money" placeholder="请输入" addon-before="￥">
      </a-input>
    </a-form-model-item>
    <a-form-model-item label="付款凭证" prop="licence">
      <upload-image v-model="form.licence" maxLength="3"></upload-image>
    </a-form-model-item>
    <a-form-model-item label="是否开票" prop="ispiao" required>
      <a-select v-model="form.ispiao" placeholder="请选择">
        <a-select-option :value="1">是</a-select-option>
        <a-select-option :value="0">否</a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item label="票据凭证" prop="licence1">
      <upload-image v-model="form.licence1" maxLength="3"></upload-image>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import { UploadImage } from '@/components'
import cloneDeep from 'lodash.clonedeep'
const initialForm = {
  projectName: '',
  stage: '',
  companyIds: [],
  buildTime: [],
  licence: [],
  area: [],
  address: '',
  manage: '',
  manageMobile: '',
  buyer: '',
  buyerMobile: '',
  technician: '',
  technicianMobile: ''
}
export default {
  name: 'PaymentEditForm',
  components: {
    UploadImage
  },
  props: {
    showSubmit: {
      type: Boolean,
      default: false
    },
    companyList: {
      type: Array,
      default: () => []
    },
    stageList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: cloneDeep(initialForm),
      rules: {
        projectName: [{ required: true, message: '请输入项目名称' }],
        stage: [{ required: true, message: '请选择付款方式' }],
        money: [{ required: true, message: '请输入付款金额' }],
        ispiao: [{ required: true, message: '请选择是否开票' }]
      }
    }
  },
  computed: {
    options () {
      return this.companyList.map(option => {
        return {
          label: option.companyName,
          value: option.companyId
        }
      })
    }
  },
  methods: {
    handleSubmit () {
      return new Promise((resolve, reject) => {
        this.$refs.projectForm.validate(valid => {
          if (valid) {
            resolve(this.form)
          } else {
            reject(new Error(false))
            return false
          }
        })
      })
    },
    setFieldsValue (data) {
      this.form = data
    },
    resetFields () {
      this.$refs.projectForm.resetFields()
      this.form = cloneDeep(initialForm)
    }
  }
}
</script>

<style scoped></style>
