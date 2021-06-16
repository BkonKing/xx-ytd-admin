<template>
  <a-form :form="form" class="form">
    <div class="form-title">项目信息</div>
    <a-form-item
      label="项目名称"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 14 }, sm: { span: 17 } }"
      required
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
      :wrapperCol="{ lg: { span: 14 }, sm: { span: 17 } }"
    >
      <a-select name="stage" placeholder="请选择" v-decorator="['stage']">
        <a-select-option
          v-for="option in stageList"
          :key="option.stageId"
          :value="option.stageId"
          >{{ option.stageText }}</a-select-option
        >
      </a-select>
    </a-form-item>
    <!-- <a-form-item
      label="参与公司"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 14 }, sm: { span: 17 } }"
    >
      <a-checkbox-group
        :options="options"
        name="companyIds"
        v-decorator="['companyIds']"
      />
    </a-form-item> -->
    <a-form-item
      label="开竣工日期"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 14 }, sm: { span: 17 } }"
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
      :wrapperCol="{ lg: { span: 14 }, sm: { span: 17 } }"
    >
      <a-upload
        action="/api/file/uploads/uImages"
        list-type="picture-card"
        name="imgFile"
        v-decorator="['licence']"
        :file-list="fileList"
        multiple
        @preview="handlePreview"
        @change="handleChange"
      >
        <div v-if="fileList.length < 3">
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
      :wrapperCol="{ lg: { span: 14 }, sm: { span: 17 } }"
    >
      <a-cascader
        :options="area"
        name="area"
        placeholder="请选择地址"
        v-decorator="['area']"
      />
      <a-form-item></a-form-item
      ><a-textarea
        rows="4"
        name="address"
        placeholder="详细地址"
        v-decorator="['address']"
      />
    </a-form-item>
    <a-form-item v-if="showSubmit">
      <a-button htmlType="submit">Submit</a-button>
    </a-form-item>
    <div class="form-title">相关人员</div>
    <a-form-item
      label="项目负责人"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 14 }, sm: { span: 17 } }"
      required
    >
      <a-row type="flex">
        <a-col flex="1">
          <a-input
            placeholder="姓名"
            :maxLength="10"
            name="manage"
            v-decorator="[
              'manage',
              {
                rules: [{ required: true, message: '请输入项目负责人姓名' }]
              }
            ]"
          ></a-input>
        </a-col>
        <a-col flex="30px" style="text-align: center;">--</a-col>
        <a-col flex="1">
          <a-form-item>
            <a-input
              placeholder="手机号"
              :maxLength="11"
              name="manageMobile"
              v-decorator="[
                'manageMobile',
                {
                  rules: [{ required: true, message: '请输入项目负责人手机号' }]
                }
              ]"
            ></a-input>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item
      label="项目采购员"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 14 }, sm: { span: 17 } }"
    >
      <a-row type="flex">
        <a-col flex="1">
          <a-input
            placeholder="姓名"
            :maxLength="10"
            name="buyer"
            v-decorator="['buyer']"
          ></a-input>
        </a-col>
        <a-col flex="30px" style="text-align: center;">--</a-col>
        <a-col flex="1">
          <a-form-item
            ><a-input
              placeholder="手机号"
              :maxLength="11"
              name="buyerMobile"
              v-decorator="['buyerMobile']"
            ></a-input
          ></a-form-item>
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item
      label="技术负责人"
      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapperCol="{ lg: { span: 14 }, sm: { span: 17 } }"
    >
      <a-row type="flex">
        <a-col flex="1">
          <a-input
            placeholder="姓名"
            :maxLength="10"
            name="technician"
            v-decorator="['technician']"
          ></a-input>
        </a-col>
        <a-col flex="30px" style="text-align: center;">--</a-col>
        <a-col flex="1">
          <a-form-item>
            <a-input
              placeholder="手机号"
              :maxLength="11"
              name="technicianMobile"
              v-decorator="['technicianMobile']"
            ></a-input>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item v-show="false">
      <a-input name="id" v-decorator="['id']"></a-input>
    </a-form-item>
  </a-form>
</template>

<script>
import chinaArea from '@/utils/chinaArea'
import { getBase64 } from '@/utils/util'
export default {
  name: 'RepositoryForm',
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
      form: this.$form.createForm(this),
      area: chinaArea,
      fileList: [],
      uploadList: []
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
    // handleSubmit (e) {
    //   e.preventDefault()
    //   this.form.validateFields((err, values) => {
    //     if (!err) {
    //       this.$notification.error({
    //         message: 'Received values of form:',
    //         description: values
    //       })
    //     }
    //   })
    // },
    async handlePreview (file) {
      console.log(file)
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.$viewerApi({
        options: {
          toolbar: true,
          initialViewIndex: this.uploadList.findIndex(
            obj => file.response.data === obj
          )
        },
        images: this.uploadList
      })
    },
    handleChange ({ file, fileList }) {
      this.fileList = fileList
      if (file.status === 'done' || file.status === 'removed') {
        this.uploadList = fileList.map(obj => {
          return obj.response.data
        })
      }
    }
  }
}
</script>

<style scoped>
.form-title {
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #000;
}
</style>
