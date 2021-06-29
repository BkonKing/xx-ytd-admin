<template>
  <a-modal
    :title="`查看-${typeText}单`"
    :visible="visible"
    :footer="null"
    @cancel="visible = false"
  >
    <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="物料">
        A01 混凝土 - 规格型号
      </a-form-model-item>
      <a-form-model-item :label="`${typeText}数量`">
        1000
      </a-form-model-item>
      <a-form-model-item :label="`${typeText}日期`">
        123123
      </a-form-model-item>
      <a-form-model-item :label="`${typeText}人`">
        sdfa
      </a-form-model-item>
      <a-form-model-item v-if="typeText === '入库'" label="物料用途">
        阿斯顿发
      </a-form-model-item>
      <a-form-model-item v-else label="入库订单号">
        000000
      </a-form-model-item>
      <a-form-model-item label="上传凭证">
        A01 混凝土 - 规格型号
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
export default {
  name: '',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      visible: this.value,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 }
    }
  },
  computed: {
    typeText () {
      return this.type === 1 ? '入库' : '出库'
    }
  },
  watch: {
    value (val) {
      this.visible = val
    },
    visible (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-form-item {
  margin-bottom: 0;
}
</style>
