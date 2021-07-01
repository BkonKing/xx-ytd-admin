<template>
  <a-modal v-model="data" title="选择导出格式" :footer="null">
    <a-row :gutter="40">
      <a-col :span="12">
        <a-button
          type="primary"
          style="width:100%;"
          @click="$emit('select', 'Word')"
          >Word</a-button
        >
      </a-col>
      <a-col :span="12">
        <a-button
          type="primary"
          style="width:100%;"
          @click="$emit('select', 'Excel')"
          >Excel</a-button
        >
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
export default {
  name: 'exportTypeModal',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      data: this.value
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
