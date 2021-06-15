<template>
  <page-header-wrapper
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    :tab-change="handleTabChange"
  >
  </page-header-wrapper>
</template>

<script>
export default {
  name: 'projectIndex',
  data () {
    return {
      tabList: [
        { key: '1', tab: '文章' },
        { key: '2', tab: '项目' },
        { key: '3', tab: '应用' }
      ],
      tabActiveKey: '1'
    }
  },
  methods: {
    handleTabChange (key) {
      this.tabActiveKey = key
    }
  }
}
</script>
