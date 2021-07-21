<template>
  <a-select v-model="data" v-bind="$attrs"  placeholder="请选择">
    <a-select-option
      v-for="option in options"
      :value="option.typeId"
      :key="option.typeId"
    >
      {{ option.typeName }}
    </a-select-option>
  </a-select>
</template>

<script>
import { getAllSupplierType } from '@/api/common'
export default {
  name: 'SupplierTypeSelect',
  props: {
    value: {
      type: [String, Number, Array],
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
    getAllSupplierType().then(({ data }) => {
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
