<template>
  <a-tree-select
    v-model="data"
    v-bind="$attrs"
    :show-search="showSearch"
    style="width: 100%"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    placeholder="请选择"
    allow-clear
    tree-default-expand-all
    :show-checked-strategy="SHOW_PARENT"
    treeNodeFilterProp="title"
    @change="handleChange"
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
import { getAllMaterialType } from '@/api/common'
import { TreeSelect } from 'ant-design-vue'
const SHOW_PARENT = TreeSelect.SHOW_PARENT
export default {
  name: 'ContractTypeSelect',
  props: {
    value: {
      type: [String, Number, Array],
      default: ''
    },
    showSearch: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      data: this.value,
      options: [],
      SHOW_PARENT
    }
  },
  created () {
    getAllMaterialType().then(({ data }) => {
      this.options = data
    })
  },
  methods: {
    handleChange () {
      this.$nextTick(() => {
        this.$emit('change')
      })
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
