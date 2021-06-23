<template>
  <a-select v-model="data" placeholder="请选择">
    <a-select-option
      v-for="option in options"
      :value="option.projectId"
      :key="option.projectId"
    >
      {{ option.projectName }}
    </a-select-option>
  </a-select>
</template>

<script>
import { getAllProject } from '@/api/common'
export default {
  name: 'ProjectSelect',
  props: {
    value: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      data: this.value,
      options: []
    }
  },
  created () {
    getAllProject().then(({ data }) => {
      this.options = data
    })
  },
  watch: {
    value (val) {
      this.data = val
    },
    data (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style></style>
