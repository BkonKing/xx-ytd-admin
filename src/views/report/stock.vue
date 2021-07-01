<template>
  <page-header-wrapper
    :tab-list="tabList"
    :tab-active-key="tabActiveKey"
    :tab-change="handleTabChange"
  >
    <StockDTab v-show="tabActiveKey === '0'"></StockDTab>
    <CLKTab key="1" v-show="tabActiveKey === '1'" type="1"></CLKTab>
    <CLKTab key="2" v-show="tabActiveKey === '2'" type="2"></CLKTab>
  </page-header-wrapper>
</template>

<script>
import StockDTab from './components/StockDTab'
import CLKTab from './components/CLKTab'

export default {
  name: 'reportStock',
  components: {
    StockDTab,
    CLKTab
  },
  data () {
    return {
      tabList: [
        { key: '0', tab: '库存明细' },
        { key: '1', tab: '入库明细' },
        { key: '2', tab: '出库明细' }
      ],
      tabActiveKey: '0'
    }
  },
  methods: {
    handleTabChange (key) {
      this.tabActiveKey = key
    }
  }
}
</script>

<style lang="less" scoped>
</style>
