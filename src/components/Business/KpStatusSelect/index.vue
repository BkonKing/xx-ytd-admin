<template>
  <a-select v-model="data" placeholder="请选择">
    <a-select-option
      v-for="option in options"
      :value="option.value"
      :key="option.value"
    >
      {{ option.text }}
    </a-select-option>
  </a-select>
</template>

<script>
export default {
  name: 'KpStatusSelect',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      data: this.value || undefined,
      // 开票情况：0=全部、1=全部已付、2=全部未付、3=部分已付/未付
      options: [
        {
          value: 1,
          text: '全部已开'
        },
        {
          value: 2,
          text: '全部未开'
        },
        {
          value: 3,
          text: '部分已开/未开'
        },
        {
          value: 4,
          text: '--'
        }
      ]
    }
  },
  created () {
    this.type && this.options.pop()
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
