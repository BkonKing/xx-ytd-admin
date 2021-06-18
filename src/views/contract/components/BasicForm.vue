<template>
  <a-form-model
    ref="form"
    :model="form"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-model-item label="项目" prop="id" required>
      <a-select v-model="form.id" placeholder="请选择">
        <a-select-option value="4">施工前期准备</a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item label="合同编号" prop="code" required>
      <a-input v-model="form.code" :maxLength="50" placeholder="请输入" />
    </a-form-model-item>
    <a-form-model-item label="合同类型" prop="type" required>
      <a-select v-model="form.type">
        <a-select-option value="4">施工前期准备</a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item label="合同名称" prop="name" required>
      <a-input v-model="form.name" :maxLength="50" placeholder="请输入" />
    </a-form-model-item>
    <a-form-model-item label="签订日期" prop="time" required>
      <a-date-picker v-model="form.time" placeholder="请选择"></a-date-picker>
    </a-form-model-item>
    <a-form-model-item label="合同有效期" prop="rtime" required>
      <a-range-picker v-model="form.rtime"></a-range-picker>
    </a-form-model-item>
    <a-form-model-item label="合同状态" prop="status" required>
      <a-select v-model="form.status" name="status">
        <a-select-option value="4">施工前期准备</a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item label="上传合同" prop="fileList">
      <upload-image v-model="form.fileList" maxLength="50"></upload-image>
      <div style="margin-top: -20px;">最多50张；支持扩展名：.png .jpg；</div>
    </a-form-model-item>
    <a-form-model-item label="备注" prop="desc">
      <a-textarea
        v-model="form.desc"
        placeholder="请输入"
        rows="4"
        :maxLength="500"
      ></a-textarea>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import clonedeep from 'lodash.clonedeep'
import { UploadImage } from '@/components'
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
  name: 'BasicForm',
  components: {
    UploadImage
  },
  data () {
    return {
      labelCol: { lg: { span: 7 }, sm: { span: 7 } },
      wrapperCol: { lg: { span: 10 }, sm: { span: 17 } },
      form: clonedeep(form),
      rules: {
        id: [{ required: true, message: '请选择项目' }],
        code: [{ required: true, message: '请输入合同编号' }],
        type: [{ required: true, message: '请选择合同类型' }],
        name: [{ required: true, message: '请输入合同名称' }],
        time: [{ required: true, message: '请选择签订日期' }],
        rtime: [{ required: true, message: '请选择合同有效期' }],
        status: [{ required: true, message: '请选择合同状态' }]
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
