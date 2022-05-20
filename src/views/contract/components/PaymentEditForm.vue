<template>
  <a-form-model
    ref="paymentForm"
    :model="form"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-model-item label="合同未付款">
      ￥{{unpaid}}
    </a-form-model-item>
    <a-form-model-item label="付款金额" prop="paid" required>
      <a-input
        v-model="form.paid"
        v-number-input="{ min: 0.1, decimal: 1 }"
        :maxLength="20"
        prefix="￥"
        placeholder="请输入"
      ></a-input>
    </a-form-model-item>
    <a-form-model-item label="付款时间" prop="payTime" required>
      <a-date-picker
        v-model="form.payTime"
        placeholder="请选择"
        valueFormat="YYYY-MM-DD"
        style="width:100%;"
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
    <a-form-model-item label="付款凭证" prop="payPz">
      <upload-file
        v-model="form.payPz"
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
import { getPayType } from '@/api/contract'

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
        paid: undefined,
        payTime: undefined,
        payType: undefined,
        payPz: [],
        bz: undefined
      },
      rules: {
        paid: [{ required: true, message: '请输入付款金额' }],
        payTime: [{ required: true, message: '请选择付款时间' }],
        payType: [{ required: true, message: '请选择付款方式' }]
      },
      payTypeOptions: []
    }
  },
  created () {
    this.getPayType()
  },
  methods: {
    // 付款类型
    getPayType () {
      getPayType().then(({ data }) => {
        this.payTypeOptions = data
      })
    },
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
    // （回填）设置表单数据和付款表格数据
    setFieldsValue (data) {
      this.form = data
    },
    // 重置表单数据
    resetFields () {
      this.$refs.paymentForm.resetFields()
      this.form = {
        paid: undefined,
        payTime: undefined,
        payType: undefined,
        payPz: [],
        bz: undefined
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
