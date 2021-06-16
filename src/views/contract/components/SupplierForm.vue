<template>
  <a-form @submit="handleSubmit" :form="form" class="form">
    <a-form-item
      label="合同金额"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
      required
    >
      <a-input
        v-decorator="[
          'money',
          {
            rules: [{ required: true, message: '请输入合同金额' }]
          }
        ]"
        name="money"
        placeholder="请输入"
      >
        <a-tooltip slot="suffix">
          元
        </a-tooltip>
      </a-input>
    </a-form-item>
    <a-form-item
      label="合同总量"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
      required
    >
      <a-input
        v-decorator="[
          'total',
          {
            rules: [{ required: true, message: '请输入合同总量' }]
          }
        ]"
        name="total"
        placeholder="请输入"
      >
        <a-tooltip slot="suffix">
          件
        </a-tooltip>
      </a-input>
    </a-form-item>
    <a-form-item
      label="税率"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
      required
    >
      <a-input-number
        :default-value="100"
        :min="0"
        :max="100"
        :formatter="value => `${value}%`"
        :parser="value => value.replace('%', '')"
        v-decorator="[
          'shuilv',
          {
            rules: [{ required: true, message: '请输入合同总量' }]
          }
        ]"
        name="shuilv"
      />
    </a-form-item>
    <a-form-item
      label="供应商"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
      required
    >
      <a-select
        name="gys"
        v-decorator="[
          'gys',
          {
            rules: [{ required: true, message: '请选择合同状态' }]
          }
        ]"
      >
        <a-select-option value="4">施工前期准备</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item
      label="材料"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
      required
    >
      <a-select
        mode="multiple"
        name="cl"
        v-decorator="[
          'cl',
          {
            rules: [{ required: true, message: '请选择材料' }]
          }
        ]"
      >
        <a-select-option value="4">施工前期准备</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item
      label="结算方式"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
      required
    >
      <a-select
        name="js"
        v-decorator="[
          'js',
          {
            rules: [{ required: true, message: '请选择材料' }]
          }
        ]"
      >
        <a-select-option value="4">施工前期准备</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item
      label="付款方式"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
      required
    >
      <a-select
        name="fk"
        v-decorator="[
          'fk',
          {
            rules: [{ required: true, message: '请选择材料' }]
          }
        ]"
      >
        <a-select-option value="4">施工前期准备</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item v-if="showSubmit">
      <a-button htmlType="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
export default {
  name: 'SupplierForm',
  props: {
    showSubmit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      options: [
        { label: 'Apple', value: 'Apple' },
        { label: 'Pear', value: 'Pear' },
        { label: 'Orange', value: 'Orange' }
      ],
      fileList: []
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$notification.error({
            message: 'Received values of form:',
            description: values
          })
        }
      })
    },
    async handlePreview (file) {
      if (!file.url && !file.preview) {
        // file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange ({ fileList }) {
      this.fileList = fileList
    }
  }
}
</script>

<style scoped></style>
