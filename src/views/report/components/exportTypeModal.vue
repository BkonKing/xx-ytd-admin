<template>
  <a-modal v-model="data" title="选择导出格式" :footer="null">
    <a-row :gutter="40">
      <a-col :span="12">
        <a-button
          type="primary"
          style="width:100%;"
           @click="exportWord"
          >Word</a-button
        >
      </a-col>
      <a-col :span="12">
        <a-button type="primary" style="width:100%;" @click="exportExcel"
          >Excel</a-button
        >
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
import { changeJSON2QueryString } from '@/utils/util'
export default {
  name: 'exportTypeModal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    // Excel导出路径
    eUrl: {
      type: String,
      default: ''
    },
    // Word导出路径
    wUrl: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      data: this.value
    }
  },
  methods: {
    exportExcel () {
      const baseUrl = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : '/api'
      location.href = `${baseUrl}${this.eUrl}?${changeJSON2QueryString(this.params)}`
    },
    exportWord () {
      const baseUrl = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : '/api'
      location.href = `${baseUrl}${this.wUrl}?${changeJSON2QueryString(this.params)}`
    }
  },
  watch: {
    data (val) {
      this.$emit('input', val)
    },
    value (val) {
      this.data = val
    }
  }
}
</script>

<style></style>
