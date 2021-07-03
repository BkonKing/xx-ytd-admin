<template>
  <a-form-model
    ref="projectForm"
    :model="form"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <div class="form-title">项目信息</div>
    <a-form-model-item label="项目名称" prop="projectName" required>
      <a-input
        v-model="form.projectName"
        :maxLength="50"
        placeholder="请输入"
      />
    </a-form-model-item>
    <a-form-model-item label="项目阶段" prop="stage">
      <a-select v-model="form.stage" placeholder="请选择">
        <a-select-option
          v-for="option in stageList"
          :key="option.stageId"
          :value="option.stageId"
          >{{ option.stageText }}</a-select-option
        >
      </a-select>
    </a-form-model-item>
    <a-form-model-item label="参与公司" prop="companyIds">
      <a-checkbox-group v-model="form.companyIds" :options="options" />
    </a-form-model-item>
    <a-form-model-item label="开竣工日期" prop="buildTime">
      <a-range-picker
        v-model="form.buildTime"
        style="width: 100%"
        :placeholder="['开工日期', '竣工日期']"
      />
    </a-form-model-item>
    <a-form-model-item label="施工许可证" prop="licence">
      <upload-image v-model="form.licence" maxLength="3"></upload-image>
    </a-form-model-item>
    <a-form-model-item label="项目地址" prop="area">
      <a-cascader
        v-model="form.area"
        :options="area"
        placeholder="请选择地址"
      />
      <a-form-model-item prop="address"
        ><a-textarea v-model="form.address" rows="4" placeholder="详细地址" />
      </a-form-model-item>
    </a-form-model-item>
    <div class="form-title">相关人员</div>
    <a-form-model-item label="项目负责人" required>
      <a-row type="flex">
        <a-col flex="1">
          <a-form-model-item prop="manage">
            <a-input
              v-model="form.manage"
              placeholder="姓名"
              :maxLength="10"
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col flex="30px" style="text-align: center;">--</a-col>
        <a-col flex="1">
          <a-form-model-item prop="manageMobile">
            <a-input
              v-model="form.manageMobile"
              placeholder="手机号"
              :maxLength="11"
              v-number-input
            ></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model-item>
    <a-form-model-item label="项目采购员">
      <a-row type="flex">
        <a-col flex="1">
          <a-form-model-item prop="buyer">
            <a-input
              v-model="form.buyer"
              placeholder="姓名"
              :maxLength="10"
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col flex="30px" style="text-align: center;">--</a-col>
        <a-col flex="1">
          <a-form-model-item prop="buyerMobile">
            <a-input
              v-model="form.buyerMobile"
              placeholder="手机号"
              :maxLength="11"
              v-number-input
            ></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model-item>
    <a-form-model-item label="技术负责人">
      <a-row type="flex">
        <a-col flex="1">
          <a-form-model-item prop="technician">
            <a-input
              v-model="form.technician"
              placeholder="姓名"
              :maxLength="10"
            ></a-input>
          </a-form-model-item>
        </a-col>
        <a-col flex="30px" style="text-align: center;">--</a-col>
        <a-col flex="1">
          <a-form-model-item prop="technicianMobile">
            <a-input
              v-model="form.technicianMobile"
              placeholder="手机号"
              :maxLength="11"
              v-number-input
            ></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import chinaArea from '@/utils/chinaArea'
import { UploadImage } from '@/components'
import clonedeep from 'lodash.clonedeep'
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
  name: 'RepositoryForm',
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
      form: clonedeep(initialForm),
      rules: {
        projectName: [{ required: true, message: '请输入项目名称' }],
        manage: [{ required: true, message: '请输入项目负责人姓名' }],
        manageMobile: [{ required: true, message: '请输入项目负责人手机号' }]
      },
      area: chinaArea
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
      this.form = clonedeep(initialForm)
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
