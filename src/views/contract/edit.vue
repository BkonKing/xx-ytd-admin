<template>
  <page-header-wrapper :title="title">
    <contract-form ref="form"></contract-form>

    <!-- fixed footer toolbar -->
    <footer-tool-bar :is-mobile="isMobile" :collapsed="sideCollapsed">
      <a-button type="primary" @click="validate" :loading="loading">
        提交
      </a-button>
    </footer-tool-bar>
  </page-header-wrapper>
</template>

<script>
import ContractForm from './components/Form'
import FooterToolBar from '@/components/FooterToolbar'
import { appMixin } from '@/store/mixin'
import { addCont, updateCont } from '@/api/contract'

export default {
  name: 'AdvancedForm',
  mixins: [appMixin],
  components: {
    FooterToolBar,
    ContractForm
  },
  data () {
    return {
      id: '',
      title: '新增合同',
      loading: false,
      memberLoading: false
    }
  },
  created () {
    this.id = this.$route.query.id
    if (this.id) {
      this.title = '编辑合同'
      this.getCont()
    }
  },
  methods: {
    // 获取合同详情
    getCont () {},
    // 最终全页面提交
    validate () {
      this.$refs.form.handleSubmit()
        .then(values => {
          const params = {
            ...values[0],
            ...values[1]
          }
          console.log(params)
          if (this.id) {
            this.updateCont(params)
          } else {
            this.addCont(params)
          }
        })
        .catch(() => {})
    },
    addCont () {
      addCont().then(() => {
        this.$message.success('提交成功')
        this.$router.go(-1)
      })
    },
    updateCont () {
      updateCont().then(() => {
        this.$message.success('提交成功')
        this.$router.go(-1)
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
