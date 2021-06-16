<template>
  <a-form @submit="handleSubmit" :form="form" class="form">
    <a-form-item
      label="名称"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
      required
    >
      <a-select
        name="id"
        v-decorator="[
          'id',
          {
            rules: [{ required: true, message: '请选择项目' }]
          }
        ]"
      >
        <a-select-option value="4">施工前期准备</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item
      label="合同编号"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
      required
    >
      <a-input
        v-decorator="[
          'code',
          {
            rules: [{ required: true, message: '请输入项目名称' }]
          }
        ]"
        :maxLength="50"
        name="code"
        placeholder="请选择"
      />
    </a-form-item>
    <a-form-item
      label="合同类型"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
      required
    >
      <a-select
        name="type"
        v-decorator="[
          'type',
          {
            rules: [{ required: true, message: '请选择类型' }]
          }
        ]"
      >
        <a-select-option value="4">施工前期准备</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item
      label="合同名称"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
      required
    >
      <a-input
        v-decorator="[
          'code',
          {
            rules: [{ required: true, message: '请输入合同名称' }]
          }
        ]"
        :maxLength="50"
        name="code"
        placeholder="请输入"
      />
    </a-form-item>
    <a-form-item
      label="签订日期"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
      required
    >
      <a-date-picker
        v-decorator="[
          'time',
          {
            rules: [{ required: true, message: '请选择签订日期' }]
          }
        ]"
        name="time"
        placeholder="请选择"
      ></a-date-picker>
    </a-form-item>
    <a-form-item
      label="合同有效期"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
      required
    >
      <a-range-picker
        v-decorator="[
          'rtime',
          {
            rules: [{ required: true, message: '请选择合同有效期' }]
          }
        ]"
        name="rtime"
      ></a-range-picker>
    </a-form-item>
    <a-form-item
      label="合同状态"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
      required
    >
      <a-select
        name="status"
        v-decorator="[
          'status',
          {
            rules: [{ required: true, message: '请选择合同状态' }]
          }
        ]"
      >
        <a-select-option value="4">施工前期准备</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item
      label="上传合同"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
      required
    >
      <a-upload
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        list-type="picture-card"
        :file-list="fileList"
        @preview="handlePreview"
        @change="handleChange"
      >
        <div v-if="fileList.length < 8">
          <a-icon type="plus" />
          <div class="ant-upload-text">
            上传
          </div>
        </div>
      </a-upload>
    </a-form-item>
    <a-form-item
      label="备注"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
      required
    >
      <a-textarea
        v-decorator="[
          'desc',
          {
            rules: [{ required: true, message: '请选择签订日期' }]
          }
        ]"
        name="desc"
        placeholder="请输入"
        rows="4"
      ></a-textarea>
    </a-form-item>
    <a-form-item v-if="showSubmit">
      <a-button htmlType="submit">Submit</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
export default {
  name: 'BasicForm',
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
