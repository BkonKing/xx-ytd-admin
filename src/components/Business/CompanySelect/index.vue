<template>
  <a-select v-model="data" placeholder="请选择" @change="handleChange">
    <a-select-option
      v-for="option in options"
      :value="option.companyId"
      :key="option.companyId"
      >{{ option.companyName }}</a-select-option
    >
  </a-select>
</template>

<script>
import { getAllCompany } from '@/api/common'
export default {
  name: 'CompanySelect',
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
    getAllCompany().then(({ data }) => {
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
      this.data = val || undefined
    },
    data (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style></style>
