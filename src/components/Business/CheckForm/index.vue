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
        <a-upload
          multiple
          :data="uploadData"
          :headers="headers"
          :action="uploadUrl"
          list-type="picture-card"
          :file-list="fileList"
          @preview="handlePreview"
          @change="handleChange"
        >
          <div v-if="fileList.length < 10">
            <a-icon type="plus" />
            <div class="ant-upload-text">
              上传
            </div>
          </div>
        </a-upload>
        <a-modal
          :visible="previewVisible"
          :footer="null"
          @cancel="handleCancel"
        >
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}
export default {
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
        violation_type: undefined
      },
      rules: {
        is_check: [{ required: true, message: '必填', trigger: 'change' }],
        violation_type: [{ required: true, message: '必填', trigger: 'change' }]
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      previewVisible: false,
      previewImage: '',
      fileList: [],
      uploadUrl: '', // 上传图片接口
      uploadData: {
        field_name: 'file'
      },
      fileList2: [], // 处理图片
      reasonList: [], // 违规原因列表
      headers: {
        Authorization: Cookies.get('access_token')
        // Authorization: '801ea07a89da8ee893176dbdd982627688960d80'
      }
    }
  },
  watch: {
    isShow () {
      this.form.check_desc = ''
      this.form.violation_type = undefined
      this.form.is_check = 1
      this.fileList = []
      this.fileList2 = []
    },
    'form.is_check' () {
      // console.log('改变了')
      this.form.check_desc = ''
      this.fileList = []
      this.fileList2 = []
      this.form.violation_type = undefined
    }
  },
  methods: {
    // 审核
    submit () {
      this.$refs.form.validate(async result => {
        if (result) {
          this.$emit('submit', this.form)
        }
      })
    },
    handleCancel () {
      this.previewVisible = false
    },
    async handlePreview (file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    // 上传和删除图片时触发
    handleChange ({ fileList }) {
      // console.log('上传和删除图片时触发')
      this.fileList = fileList
      console.log(fileList)
      const arr1 = this.fileList.map(item => {
        if (item.response) {
          return item.response.data
        }
      })
      const arr2 = arr1.filter(item => {
        return item
      })
      this.fileList2 = arr2
      console.log('上传和删除图片时触发', arr2)
    }
  },
  async created () {
    // const res = await toViolationReason({ type: 2 })
    // this.reasonList = res.list
    // console.log('获取违规原因', res)
    this.uploadUrl =
      process.env.NODE_ENV === 'production'
        ? '/nsolid/spi/v1/upload/uploads/uImages'
        : '/api/upload/uploads/uImages'
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
