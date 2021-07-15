<template>
  <a-form-model
    ref="projectForm"
    :model="form"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-model-item label="付款时间" prop="payTime" required>
      <a-date-picker
        v-model="form.payTime"
        placeholder="请选择"
        valueFormat="YYYY-MM-DD"
      ></a-date-picker>
    </a-form-model-item>
    <a-form-model-item label="付款方式" prop="payType" required>
      <a-select v-model="form.payType" placeholder="请选择">
        <a-select-option
          v-for="option in payTypeOptions"
          :value="option.typeId"
          :key="option.typeId"
        >
          {{ option.typeName }}
        </a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item label="付款金额" prop="paid" required>
      <a-input v-model="form.paid" placeholder="请输入" addon-before="￥" v-number-input>
      </a-input>
    </a-form-model-item>
    <a-form-model-item label="付款凭证" prop="payPz">
      <upload-image v-model="form.payPz" maxLength="3"></upload-image>
    </a-form-model-item>
    <a-form-model-item label="是否开票" prop="isKp" required>
      <a-select v-model="form.isKp" placeholder="请选择">
        <a-select-option value="1">是</a-select-option>
        <a-select-option value="0">否</a-select-option>
      </a-select>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import { UploadImage } from '@/components'
import { getPayType } from '@/api/contract'
import { GreaterZero } from '@/utils/formValidator'
export default {
  name: 'PaymentEditForm',
  components: {
    UploadImage
  },
  data () {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {},
      rules: {
        payTime: [{ required: true, message: '请输入项目名称' }],
        payType: [{ required: true, message: '请选择付款方式' }],
        paid: [{ required: true, message: '请输入付款金额' }, { validator: GreaterZero, trigger: 'blur' }],
        isKp: [{ required: true, message: '请选择是否开票' }]
      },
      payTypeOptions: []
    }
  },
  created () {
    this.getPayType()
  },
  methods: {
    getPayType () {
      getPayType().then(({ data }) => {
        this.payTypeOptions = data
      })
    },
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
      this.form = {}
    }
  }
}
</script>

<style scoped></style>
