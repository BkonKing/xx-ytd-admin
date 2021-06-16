<template>
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
</template>

<script>
export default {}
</script>

<style></style>
