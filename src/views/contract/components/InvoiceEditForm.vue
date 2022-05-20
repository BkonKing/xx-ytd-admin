<template>
  <a-form-model
    ref="paymentForm"
    :model="form"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-model-item label="合同未开票">
      ￥{{unpaid}}
    </a-form-model-item>
    <a-form-model-item label="开票金额" prop="kpMoney" required>
      <a-input
        v-model="form.kpMoney"
        v-number-input="{ min: 0.1, decimal: 1 }"
        :maxLength="20"
        prefix="￥"
        placeholder="请输入"
      ></a-input>
    </a-form-model-item>
    <a-form-model-item label="开票时间" prop="kpTime" required>
      <a-date-picker
        v-model="form.kpTime"
        placeholder="请选择"
        valueFormat="YYYY-MM-DD"
        style="width:100%;"
      ></a-date-picker>
    </a-form-model-item>
    <a-form-model-item label="开票凭证" prop="kpPz">
      <upload-file
        v-model="form.kpPz"
        maxLength="0"
        accept=".jpg,.jpeg,.pdf,.png"
      ></upload-file>
    </a-form-model-item>
    <a-form-model-item label="备注" prop="bz">
      <a-textarea v-model="form.bz"></a-textarea>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import { UploadFile } from '@/components'

export default {
  name: 'PaymentEditForm',
  components: {
    UploadFile
  },
  props: {
    unpaid: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
      form: {
        kpMoney: undefined,
        kpTime: undefined,
        kpPz: [],
        bz: undefined
      },
      rules: {
        kpMoney: [{ required: true, message: '请输入开票金额' }],
        kpTime: [{ required: true, message: '请选择开票时间' }]
      }
    }
  },
  created () {
  },
  methods: {
    handleSubmit () {
      return new Promise((resolve, reject) => {
        this.$refs.paymentForm.validate(valid => {
          if (valid) {
            resolve(this.form)
          } else {
            reject(new Error(false))
            return false
          }
        })
      })
    },
    // （回填）设置表单数据和开票表格数据
    setFieldsValue (data) {
      this.form = data
    },
    // 重置表单数据
    resetFields () {
      this.$refs.paymentForm.resetFields()
      this.form = {
        kpMoney: undefined,
        kpTime: undefined,
        kpPz: [],
        bz: undefined
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
