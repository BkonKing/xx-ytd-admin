<template>
  <a-form-model
    ref="supplierForm"
    :model="form"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-model-item label="供应商名称" prop="supplierName" required>
      <a-input v-model="form.supplierName" :maxLength="50" placeholder="名称" />
    </a-form-model-item>
    <a-form-model-item label="类型" prop="supplierType" required>
      <a-select
        type="multiple"
        v-model="form.supplierType"
        placeholder="请选择"
      >
        <a-select-option
          v-for="option in supplierTypeOptions"
          :value="option.value"
          :key="option.value"
        >
          {{ option.text }}
        </a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item label="供应材料" prop="materia">
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
            <a-input v-model="form.contactsMen" placeholder="姓名"></a-input>
          </a-form-model-item>
        </a-col>
        <a-col flex="30px" style="text-align: center;">--</a-col>
        <a-col flex="1">
          <a-form-model-item prop="contactsMobile">
            <a-input
              v-model="form.contactsMobile"
              placeholder="联系电话"
              :maxLength="11"
            ></a-input>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model-item>
    <a-form-model-item label="统一社会信用代码" prop="socialCode" required>
      <a-input v-model="form.socialCode" :maxLength="50" placeholder="请输入" />
    </a-form-model-item>
    <a-form-model-item label="法人代表" prop="legalPerson" required>
      <a-input
        v-model="form.legalPerson"
        :maxLength="50"
        placeholder="请输入"
      />
    </a-form-model-item>
    <a-form-model-item label="法人身份证" prop="legalPersonPz" required>
      <upload-image v-model="form.legalPersonPz" maxLength="5"></upload-image>
    </a-form-model-item>
    <a-form-model-item label="成立日期" prop="createDate">
      <a-date-picker
        v-model="form.createDate"
        show-time
        type="date"
        placeholder="请选择"
        style="width: 100%;"
      />
    </a-form-model-item>
    <a-form-model-item label="营业期限" prop="businessTerm">
      <a-range-picker
        v-model="form.businessTerm"
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
</template>
<script>
// import moment from 'moment'
import { UploadImage } from '@/components'
import { addSupplier, updateSupplier } from '@/api/supplier'
export default {
  components: {
    UploadImage
  },
  data () {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      supplierTypeOptions: [
        {
          value: '1',
          text: '测试'
        }
      ], // todo:缺接口
      materialOptions: [], // todo:缺接口
      form: {
        supplierName: '',
        supplierType: [],
        materia: [],
        contactsMen: '',
        contactsMobile: '',
        socialCode: '',
        legalPerson: '',
        legalPersonPz: [
          'https://ytdwz.tosolomo.com/upload/images/202106/17/1623901302_711111.jpg',
          'https://ytdwz.tosolomo.com/upload/images/202106/17/1623901310_907121.png'
        ],
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
  methods: {
    onSubmit () {
      console.log(this.form)
      this.$refs.supplierForm.validate(valid => {
        if (valid) {
          this.addSupplier()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addSupplier () {
      addSupplier(this.form).then(({ success }) => {
        if (success) {
          this.$message.success('新增成功')
          this.$router.go(-1)
        }
      })
    },
    updateSupplier () {
      updateSupplier()
    },
    resetForm () {
      this.$router.go(-1)
    }
  }
}
</script>
