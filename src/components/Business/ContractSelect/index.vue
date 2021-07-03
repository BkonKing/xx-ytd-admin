<template>
  <a-select
    v-model="data"
    placeholder="请选择"
    show-search
    :filter-option="filterOption"
    option-filter-prop="children"
    @change="handleChange"
  >
    <a-select-option
      v-for="option in options"
      :value="option.contractId"
      :key="option.contractId"
    >
      {{ option.contractName }}
    </a-select-option>
  </a-select>
</template>

<script>
import { getAllContract } from '@/api/common'
export default {
  name: 'ContractSelect',
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
    getAllContract().then(({ data }) => {
      this.options = data
    })
  },
  methods: {
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    handleChange (value, option) {
      console.log(value)
      const index = this.options.findIndex(obj => obj.contractId === value)
      this.$emit('change', value, this.options[index])
    }
  },
  watch: {
    value (val) {
      this.data = val
      // this.$nextTick(() => {
      //   const index = this.options.findIndex(obj => obj.contractId === val)
      //   this.$emit('change', val, this.options[index])
      // })
    },
    data (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style></style>
