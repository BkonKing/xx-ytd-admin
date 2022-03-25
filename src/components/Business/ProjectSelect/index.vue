<template>
  <a-select v-model="data" placeholder="请选择" :mode="mode" @change="handleChange">
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
      type: [String, Number, Array],
      default: ''
    },
    addOther: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: 'default'
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
      if (this.addOther) {
        this.options.unshift({
          projectId: -1,
          projectName: '--'
        })
      }
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
      this.data = val || undefined
    },
    data (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style></style>
