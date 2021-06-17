<template>
  <a-upload
    v-bind="$attrs"
    action="/api/file/uploads/uImages"
    list-type="picture-card"
    name="imgFile"
    :file-list="fileList"
    multiple
    @preview="handlePreview"
    @change="handleChange"
  >
    <div v-if="fileList.length < maxLength">
      <a-icon type="plus" />
      <div class="ant-upload-text">
        上传
      </div>
    </div>
  </a-upload>
</template>

<script>
import { getBase64 } from '@/utils/util'
export default {
  name: 'UploadImage',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    maxLength: {
      type: [Number, String],
      default: 9
    }
  },
  data () {
    return {
      fileList: this.format(this.value)
    }
  },
  methods: {
    genId (length) {
      return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36)
    },
    format (list) {
      return list.map(item => {
        const index = this.genId(5)
        return {
          uid: index,
          name: index,
          status: 'done',
          url: item
        }
      })
    },
    async handlePreview (file) {
      console.log(file)
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      const url = file.response ? file.response.data : file.url
      this.$viewerApi({
        options: {
          toolbar: true,
          initialViewIndex: this.value.findIndex(
            obj => url === obj
          )
        },
        images: this.value
      })
    },
    handleChange ({ file, fileList }) {
      this.fileList = fileList
      if (file.status === 'done' || file.status === 'removed') {
        const uploadList = fileList.map(obj => {
          return (obj.response && obj.response.data) || obj.url
        })
        this.$emit('input', uploadList)
      }
    }
  },
  watch: {
    value (val) {
      this.fileList = this.format(val)
    }
  }
}
</script>

<style></style>
