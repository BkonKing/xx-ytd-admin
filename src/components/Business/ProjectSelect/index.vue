<template>
  <a-select v-model="data" placeholder="请选择" @change="handleChange">
    <a-select-option
      v-for="option in options"
      :value="option.projectId"
      :key="option.projectId"
      >{{ option.projectName }}</a-select-option
    >
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
      data: this.value || undefined,
      options: []
    }
  },
  created () {
    getAllProject().then(({ data }) => {
      this.options = data
    })
  },
  methods: {
    handleChange (value, option) {
      this.$emit(
        'change',
        value,
        option.componentOptions && option.componentOptions.children[0].text
      )
    }
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
