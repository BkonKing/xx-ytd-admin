<template>
  <page-header-wrapper :title="title">
    <a-card class="card" :bordered="false">
      <a-form-model
        ref="supplierForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="供应商名称" prop="supplierName" required>
          <a-input
            v-model="form.supplierName"
            :maxLength="50"
            placeholder="名称"
          />
        </a-form-model-item>
        <a-form-model-item label="类型" prop="supplierType" required>
          <supplier-type-select
            v-model="form.supplierType"
            mode="multiple"
          ></supplier-type-select>
        </a-form-model-item>
        <a-form-model-item label="供应物料" prop="materia">
          <a-select type="multiple" v-model="form.materia" placeholder="请选择">
            <a-select-option
              v-for="option in materialOptions"
              :value="option.value"
              :key="option.value"
            >
              {{ option.text }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="联系人" required>
          <a-row type="flex">
            <a-col flex="1">
              <a-form-model-item prop="contactsMen">
                <a-input
                  v-model="form.contactsMen"
                  placeholder="姓名"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col flex="30px" style="text-align: center;">--</a-col>
            <a-col flex="1">
              <a-form-model-item prop="contactsMobile">
                <a-input
                  v-model="form.contactsMobile"
                  placeholder="联系电话"
                  :maxLength="11"
                  v-number-input
                ></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item label="统一社会信用代码" prop="socialCode" required>
          <a-input
            v-model="form.socialCode"
            :maxLength="18"
            placeholder="请输入"
            v-number-input.EnNum
          />
        </a-form-model-item>
        <a-form-model-item label="法人代表" prop="legalPerson" required>
          <a-input
            v-model="form.legalPerson"
            :maxLength="50"
            placeholder="请输入"
          />
        </a-form-model-item>
        <a-form-model-item label="法人身份证" prop="legalPersonPz" required>
          <upload-image
            v-model="form.legalPersonPz"
            maxLength="5"
          ></upload-image>
        </a-form-model-item>
        <a-form-model-item label="成立日期" prop="createDate">
          <a-date-picker
            v-model="form.createDate"
            placeholder="请选择"
            style="width: 100%;"
          />
        </a-form-model-item>
        <a-form-model-item label="营业期限" prop="businessTerm">
          <a-range-picker
            v-model="form.businessTerm"
            valueFormat="YYYY-MM-DD"
            style="width: 100%;"
          ></a-range-picker>
        </a-form-model-item>
        <a-form-model-item label="营业执照" prop="licensePz" required>
          <upload-image v-model="form.licensePz" maxLength="5"></upload-image>
        </a-form-model-item>
        <a-form-model-item label="注册资金" prop="registeredCapital">
          <a-input
            v-model="form.registeredCapital"
            :maxLength="50"
            placeholder="请输入"
            suffix="元人民币"
            v-number-input
          />
        </a-form-model-item>
        <a-form-model-item label="注册地址" prop="registeredAddress">
          <a-textarea
            v-model="form.registeredAddress"
            :maxLength="200"
            placeholder="请输入"
            :rows="4"
          />
        </a-form-model-item>
        <a-form-model-item label="资质证件" prop="qualificationsPz" required>
          <upload-image
            v-model="form.qualificationsPz"
            maxLength="5"
          ></upload-image>
        </a-form-model-item>
        <a-form-model-item
          :wrapper-col="{ span: wrapperCol.span, offset: labelCol.span }"
        >
          <a-button type="primary" @click="onSubmit">
            提交
          </a-button>
          <a-button style="margin-left: 10px;" @click="resetForm">
            取消
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { UploadImage, SupplierTypeSelect } from '@/components'
import { addSupplier, updateSupplier, getSuppInfo } from '@/api/supplier'

export default {
  name: 'SupplierEdit',
  components: {
    UploadImage,
    SupplierTypeSelect
  },
  data () {
    return {
      id: '',
      title: '新增供应商',
      loading: false,
      memberLoading: false,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      materialOptions: [], // todo:缺接口
      form: {
        supplierName: '',
        supplierType: [],
        materia: [],
        contactsMen: '',
        contactsMobile: '',
        socialCode: '',
        legalPerson: '',
        legalPersonPz: [],
        createDate: '',
        businessTerm: [],
        licensePz: [],
        registeredCapital: '',
        registeredAddress: '',
        qualificationsPz: []
      },
      rules: {
        supplierName: [
          {
            required: true,
            message: '请输入供应商名称'
            // trigger: 'blur'
          }
          // {
          //   min: 3,
          //   max: 5,
          //   message: 'Length should be 3 to 5'
          //   // trigger: 'blur'
          // }
        ],
        supplierType: [
          {
            required: true,
            message: '请选择类型'
            // trigger: 'change'
          }
        ],
        contactsMen: [{ required: true, message: '请输入联系人姓名' }],
        contactsMobile: [{ required: true, message: '请输入联系人联系电话' }],
        socialCode: [{ required: true, message: '请输入统一社会信用代码' }],
        legalPerson: [{ required: true, message: '请输入法人代表' }],
        legalPersonPz: [{ required: true, message: '请上传法人身份证' }],
        licensePz: [{ required: true, message: '请上传营业执照' }],
        qualificationsPz: [{ required: true, message: '请上传资质证件' }]
      }
    }
  },
  created () {
    this.id = this.$route.query.id
    if (this.id) {
      this.title = '编辑供应商'
      this.getSuppInfo()
    }
  },
  methods: {
    getSuppInfo () {
      getSuppInfo({ id: this.id }).then(({ data }) => {
        this.form = data
      })
    },
    onSubmit () {
      console.log(this.form)
      this.$refs.supplierForm.validate(valid => {
        if (valid) {
          const api = this.id ? updateSupplier : addSupplier
          api(this.form).then(({ success }) => {
            if (success) {
              this.$message.success('提交成功')
              this.$router.go(-1)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  margin-bottom: 24px;
}
.popover-wrapper {
  /deep/ .antd-pro-pages-forms-style-errorPopover .ant-popover-inner-content {
    min-width: 256px;
    max-height: 290px;
    padding: 0;
    overflow: auto;
  }
}
.antd-pro-pages-forms-style-errorIcon {
  user-select: none;
  margin-right: 24px;
  color: #f5222d;
  cursor: pointer;
  i {
    margin-right: 4px;
  }
}
.antd-pro-pages-forms-style-errorListItem {
  padding: 8px 16px;
  list-style: none;
  border-bottom: 1px solid #e8e8e8;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #e6f7ff;
  }
  .antd-pro-pages-forms-style-errorIcon {
    float: left;
    margin-top: 4px;
    margin-right: 12px;
    padding-bottom: 22px;
    color: #f5222d;
  }
  .antd-pro-pages-forms-style-errorField {
    margin-top: 2px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
  }
}
</style>
