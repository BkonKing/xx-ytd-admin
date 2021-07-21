<template>
  <a-select v-model="data" placeholder="请选择" v-bind="$attrs">
    <a-select-option
      v-for="option in uOptions"
      :value="option.unit"
      :key="option.unit"
    >
      {{ option.unitName }}
    </a-select-option>
  </a-select>
</template>

<script>
import { getAllUnit } from '@/api/common'
export default {
  name: 'UnitSelect',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      data: this.value || undefined,
      uOptions: this.options
    }
  },
  // created () {
  //   !(this.uOptions && this.uOptions.length) && this.getAllUnit()
  // },
  methods: {
    getAllUnit () {
      getAllUnit().then(({ data }) => {
        this.uOptions = data
      })
    }
  },
  watch: {
    value (val) {
      this.data = val
    },
    data (val) {
      this.$emit('input', val)
    },
    options (val) {
      this.uOptions = val
    }
  }
}
</script>

<style></style>
