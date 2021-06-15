<template>
  <a-form @submit="handleSubmit" :form="form" class="form">
    <a-form-item
      label="项目名称"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
    >
      <a-input
        v-decorator="[
          'projectName',
          {
            rules: [{ required: true, message: '请输入项目名称' }]
          }
        ]"
        :maxLength="50"
        name="projectName"
        placeholder="请输入"
      />
    </a-form-item>
    <a-form-item
      label="项目阶段"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
    >
      <a-select mode="multiple" name="stage">
        <a-select-option value="4">施工前期准备</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item
      label="参与公司"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
    >
      <a-checkbox-group
        :options="options"
        :value="['Pear']"
        name="companyIds"
      />
    </a-form-item>
    <a-form-item
      label="开竣工日期"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
    >
      <a-range-picker
        name="buildTime"
        style="width: 100%"
        v-decorator="['buildTime']"
        :placeholder="['开工日期', '竣工日期']"
      />
    </a-form-item>
    <a-form-item
      label="施工许可证"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
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
      label="项目地址"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
    >
      <a-cascader :options="area" name="area" />
      <a-textarea rows="4" name="address" :placeholder="详细地址" />
    </a-form-item>
    <a-form-item v-if="showSubmit">
      <a-button htmlType="submit">Submit</a-button>
    </a-form-item>
    <div>相关人员</div>
    <a-form-item
      label="项目负责人"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
      required
    >
      <a-input placeholder="姓名" :maxLength="10"></a-input>--<a-input
        placeholder="手机号"
        :maxLength="11"
      ></a-input>
    </a-form-item>
  </a-form>
</template>

<script>
import chinaArea from '@/utils/chinaArea'
export default {
  name: 'RepositoryForm',
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
      area: chinaArea,
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
        file.preview = await getBase64(file.originFileObj)
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
