<template>
  <div>
    <div class="selected" v-if="selectedRowKeys.length > 0">
      <a-icon class="icon" type="info-circle" />
      已选择 <span class="span1">{{ selectedRowKeys.length }}</span> 项
    </div>
    <a-form-model
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="是否通过" prop="is_check">
        <a-radio-group v-model="form.is_check">
          <a-radio :value="1">
            通过
          </a-radio>
          <a-radio :value="2">
            不通过
          </a-radio>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item
        v-if="form.is_check !== 1"
        label="违规原因"
        prop="violation_type"
      >
        <a-select
          v-model="form.violation_type"
          placeholder="请选择"
          style="width: 274px"
        >
          <a-select-option
            v-for="(item, index) in reasonList"
            :key="index"
            :value="item.id"
          >
            {{ item.violation }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="审核说明">
        <a-textarea
          v-model="form.check_desc"
          placeholder="请输入"
          :auto-size="{ minRows: 3, maxRows: 5 }"
        />
      </a-form-model-item>
      <a-form-model-item label="图片">
        <upload-image v-model="form.fileList" maxLength="10"></upload-image>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import UploadImage from '../../UploadImage/index.vue'
export default {
  name: 'CheckForm',
  components: {
    UploadImage
  },
  props: {
    selectedRowKeys: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isShow: false,
      form: {
        is_check: 1,
        check_desc: '',
        fileList: [],
        violation_type: undefined
      },
      rules: {
        is_check: [{ required: true, message: '必填', trigger: 'change' }],
        violation_type: [{ required: true, message: '必填', trigger: 'change' }]
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      reasonList: [] // 违规原因列表
    }
  },
  watch: {
    isShow () {
      this.form.check_desc = ''
      this.form.violation_type = undefined
      this.form.is_check = 1
      this.form.fileList = []
    },
    'form.is_check' () {
      // console.log('改变了')
      this.form.check_desc = ''
      this.form.fileList = []
      this.form.violation_type = undefined
    }
  },
  methods: {
    // 审核
    handleSubmit () {
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
    resetFields () {
      this.$refs.form.resetFields()
      this.form.check_desc = ''
      this.form.violation_type = undefined
      this.form.is_check = 1
      this.form.fileList = []
    }
  }
}
</script>

<style lang="less" scoped>
.selected {
  margin-top: 10px;
  width: 100%;
  height: 40px;
  padding-left: 15px;
  line-height: 40px;
  background-color: rgba(230, 247, 255, 1);
  border-width: 1px;
  border-style: solid;
  border-color: rgba(186, 231, 255, 1);
  border-radius: 4px;
  .icon {
    color: #0e77d1;
    margin-right: 10px;
  }
  .span1 {
    color: #0e77d1;
  }
  .span2 {
    cursor: pointer;
    color: #0e77d1;
    margin-left: 10px;
  }
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
