<template>
  <a-tree-select
    v-model="data"
    :show-search="showSearch"
    style="width: 100%"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    placeholder="请选择"
    allow-clear
    tree-default-expand-all
  >
    <a-tree-select-node
      v-for="(option, index) in options"
      :key="index"
      :value="option.id"
      :title="option.categoryName"
    >
      <template v-if="option.children && option.children.length">
        <a-tree-select-node
          v-for="(node, i) in option.children"
          :key="`${index}-${i}`"
          :value="node.id"
          :title="node.categoryName"
        >
          <template v-if="node.children && node.children.length">
            <a-tree-select-node
              v-for="(leaf, ileaf) in node.children"
              :key="`${index}-${i}-${ileaf}`"
              :value="leaf.id"
              :title="leaf.categoryName"
            >
            </a-tree-select-node>
          </template>
        </a-tree-select-node>
      </template>
    </a-tree-select-node>
  </a-tree-select>
</template>

<script>
import { getAllContractType } from '@/api/common'
export default {
  name: 'ContractTypeSelect',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    showSearch: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      data: this.value || undefined,
      options: []
    }
  },
  created () {
    getAllContractType().then(({ data }) => {
      this.options = data
    })
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
