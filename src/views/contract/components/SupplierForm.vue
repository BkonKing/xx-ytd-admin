<template>
  <a-form-model
    ref="form"
    :model="form"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-model-item label="合同金额" prop="money" required>
      <a-input v-model="form.money" placeholder="请输入">
        <a-tooltip slot="suffix">
          元
        </a-tooltip>
      </a-input>
    </a-form-model-item>
    <a-form-model-item label="合同总量" prop="total" required>
      <a-input v-model="form.total" placeholder="请输入">
        <a-tooltip slot="suffix">
          件
        </a-tooltip>
      </a-input>
    </a-form-model-item>
    <a-form-model-item label="税率" prop="shuilv" required>
      <a-input-number v-model="form.shuilv" :min="0" :max="100" />
      <span style="margin-left: 10px;">%</span>
    </a-form-model-item>
    <a-form-model-item label="供应商" prop="gys" required>
      <a-select v-model="form.gys">
        <a-select-option value="4">施工前期准备</a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item label="材料" prop="cl" required>
      <a-select mode="multiple" v-model="form.cl">
        <a-select-option value="4">施工前期准备</a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item label="结算方式" prop="js" required>
      <a-select v-model="form.js">
        <a-select-option value="4">施工前期准备</a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item label="付款方式" prop="fk" required>
      <a-select v-model="form.fk">
        <a-select-option value="4">施工前期准备</a-select-option>
      </a-select>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import clonedeep from 'lodash.clonedeep'
const form = {
  money: '',
  total: '',
  shuilv: 0,
  gys: '',
  cl: [],
  js: '',
  fk: ''
}
export default {
  name: 'SupplierForm',
  data () {
    return {
      labelCol: { lg: { span: 7 }, sm: { span: 7 } },
      wrapperCol: { lg: { span: 10 }, sm: { span: 17 } },
      form: clonedeep(form),
      rules: {
        money: [{ required: true, message: '请输入合同金额' }],
        total: [{ required: true, message: '请输入合同总量' }],
        shuilv: [{ required: true, message: '请输入税率' }],
        gys: [{ required: true, message: '请选择供应商' }],
        cl: [{ required: true, message: '请选择材料' }],
        js: [{ required: true, message: '请选择结算方式' }],
        fk: [{ required: true, message: '请选择付款方式' }]
      },
      options: [
        { label: 'Apple', value: 'Apple' },
        { label: 'Pear', value: 'Pear' },
        { label: 'Orange', value: 'Orange' }
      ]
    }
  },
  methods: {
    handleSubmit (e) {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
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
      this.$refs.form.resetFields()
      this.form = clonedeep(form)
    }
  }
}
</script>

<style scoped></style>
