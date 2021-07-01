<template>
  <a-cascader
    v-model="data"
    :options="options"
    :load-data="loadData"
    placeholder="请选择"
    change-on-select
    @change="onChange"
  >
  </a-cascader>
</template>

<script>
import {
  getAllProMaterial,
  getAllProMaterialBand,
  getAllProMatBanModel
} from '@/api/stock'
export default {
  name: 'ContractTypeSelect',
  props: {
    value: {
      type: [Array],
      default: () => []
    },
    projectId: {
      type: String,
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
    console.log(11111)
    this.projectId && this.getAllProMaterial()
  },
  methods: {
    getAllProMaterial () {
      getAllProMaterial({
        projectId: this.projectId
      }).then(({ data }) => {
        console.log(123)
        this.options = this.formatMaterialData(data)
      })
    },
    onChange (value) {
      console.log(value)
      this.$emit('change', value)
    },
    async setOptions () {
      if (this.options && this.options.length) {
        const root = this.options.find(obj => obj.value === this.data[0])
        await this.loadData([root])
        // console.log(root)
        const secondLevel = root.children.find(obj => obj.value === this.data[1])
        this.loadData([root, secondLevel])
      } else {
        setTimeout(() => {
          this.setOptions()
        }, 200)
      }
    },
    async loadData (selectedOptions) {
      console.log(selectedOptions)
      const len = selectedOptions.length
      const targetOption = selectedOptions[len - 1]
      targetOption.loading = true
      let data = []
      if (len === 2) {
        data = await this.getAllProMatBanModel(
          selectedOptions[0].value,
          targetOption.value
        )
      } else {
        data = await this.getAllProMaterialBand(targetOption.value)
      }
      targetOption.loading = false
      if (data && data.length) {
        targetOption.children = this.formatData(
          data,
          len === 2 ? 'model' : 'brand',
          len === 2
        )
      } else {
        targetOption.isLeaf = true
      }
      this.options = [...this.options]
    },
    async getAllProMaterialBand (value) {
      const { data } = await getAllProMaterialBand({
        projectId: this.projectId,
        materialId: value
      })
      return data
    },
    async getAllProMatBanModel (materialId, brand) {
      const { data } = await getAllProMatBanModel({
        projectId: this.projectId,
        materialId,
        brand
      })
      return data
    },
    formatData (data, key, isLeaf) {
      return data.map(obj => {
        return {
          label: obj[key],
          value: obj[key],
          isLeaf
        }
      })
    },
    formatMaterialData (data) {
      return data.map(obj => {
        return {
          label: obj.materialNo + ' ' + obj.materialName,
          value: obj.materialId,
          isLeaf: false
        }
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
    projectId () {
      console.log(222222)
      this.getAllProMaterial()
    }
  }
}
</script>

<style></style>
