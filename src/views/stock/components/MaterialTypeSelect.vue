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
      options: [
        {
          label: '项目归属',
          value: 1,
          isLeaf: false
        },
        {
          label: '无项目归属',
          value: 0,
          isLeaf: false
        }
      ]
    }
  },
  created () {
    // this.projectId && this.changeProjectId()
  },
  methods: {
    changeProjectId () {
      console.log(this.data)
    },
    async setOptions () {
      if (this.options && this.options.length) {
        const root = this.options.find(obj => obj.value === this.data[0])
        await this.loadData([root])
        // console.log(root)
        const secondLevel = root.children.find(
          obj => obj.value === this.data[1]
        )
        await this.loadData([root, secondLevel])
        const thirdlyLevel = secondLevel.children.find(
          obj => obj.value === this.data[2]
        )
        await this.loadData([root, secondLevel, thirdlyLevel])
      } else {
        setTimeout(() => {
          this.setOptions()
        }, 200)
      }
    },
    async loadData (selectedOptions) {
      const len = selectedOptions.length
      const targetOption = selectedOptions[len - 1]
      targetOption.loading = true
      let data = []
      if (len === 1) {
        data = await this.getAllProMaterial(targetOption.value)
      } else if (len === 2) {
        data = await this.getAllProMaterialBand(targetOption.value, selectedOptions[0].value)
      } else if (len === 3) {
        data = await this.getAllProMatBanModel(
          selectedOptions[1].value,
          targetOption.value, selectedOptions[0].value
        )
      }
      targetOption.loading = false
      if (data && data.length) {
        if (len === 1) {
          targetOption.children = this.formatMaterialData(data)
        } else if (len > 1) {
          targetOption.children = this.formatData(
            data,
            len === 2 ? 'brand' : 'model',
            len === 3
          )
        }
      } else {
        targetOption.isLeaf = true
      }
      this.options = [...this.options]
    },
    onChange (value) {
      this.$emit('change', value)
      this.$emit('input', value)
    },
    // 获取物料
    async getAllProMaterial (value) {
      const { data } = await getAllProMaterial({
        projectId: +value ? this.projectId : '0'
      })
      return data
    },
    // 获取品牌
    async getAllProMaterialBand (value, projectId) {
      const { data } = await getAllProMaterialBand({
        projectId: +projectId ? this.projectId : '0',
        materialId: value
      })
      return data
    },
    // 获取规格
    async getAllProMatBanModel (materialId, brand, projectId) {
      const { data } = await getAllProMatBanModel({
        projectId: +projectId ? this.projectId : '0',
        materialId,
        brand
      })
      return data
    },
    // 数据格式化
    formatData (data, key, isLeaf) {
      return data.map(obj => {
        return {
          label: obj[key],
          value: obj[key],
          isLeaf
        }
      })
    },
    // 物料信息格式化（拼接No和名称）
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
      this.changeProjectId()
    }
  }
}
</script>

<style></style>
