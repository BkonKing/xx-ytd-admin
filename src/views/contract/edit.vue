<template>
  <page-header-wrapper :title="title">
    <a-card class="card" title="基本信息" :bordered="false">
      <basic-form ref="BasicForm" :showSubmit="false" />
    </a-card>
    <a-card class="card" title="供应商信息" :bordered="false">
      <supplier-form ref="SupplierForm" :showSubmit="false" />
    </a-card>

    <!-- fixed footer toolbar -->
    <footer-tool-bar :is-mobile="isMobile" :collapsed="sideCollapsed">
      <a-button type="primary" @click="validate" :loading="loading"
        >提交</a-button
      >
    </footer-tool-bar>
  </page-header-wrapper>
</template>

<script>
import BasicForm from './components/BasicForm'
import SupplierForm from './components/SupplierForm'
import FooterToolBar from '@/components/FooterToolbar'
import { appMixin } from '@/store/mixin'

export default {
  name: 'AdvancedForm',
  mixins: [appMixin],
  components: {
    FooterToolBar,
    BasicForm,
    SupplierForm
  },
  data () {
    return {
      title: '新增合同',
      loading: false,
      memberLoading: false
    }
  },
  methods: {
    // 最终全页面提交
    validate () {
      const {
        $refs: { BasicForm, SupplierForm }
      } = this
      const BasicFormValid = BasicForm.handleSubmit()
      const SupplierFormValid = SupplierForm.handleSubmit()

      // clean this.errors
      Promise.all([BasicFormValid, SupplierFormValid])
        .then(values => {
          console.log({
            ...values[0],
            ...values[1]
          })
        })
        .catch(() => {
        })
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  margin-bottom: 24px;
}
</style>
