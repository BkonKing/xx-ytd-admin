<template>
  <div class="cardInfo">
    <div>
      <p>公司</p>
      <p>{{ companyNum }}</p>
    </div>
    <div>
      <p>合同</p>
      <p>{{ contractNum }}</p>
    </div>
    <div>
      <p>订单</p>
      <p>{{ orderNum }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardInfo',
  props: {
    companyNum: {
      type: [String, Number],
      default: 0
    },
    contractNum: {
      type: [String, Number],
      default: 0
    },
    orderNum: {
      type: [String, Number],
      default: 0
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.cardInfo {
  .clearfix();

  margin-top: 16px;
  margin-left: 40px;
  & > div {
    position: relative;
    float: left;
    width: 33.33%;
    text-align: left;
    p {
      margin: 0;
      font-size: 24px;
      line-height: 32px;
    }
    p:first-child {
      margin-bottom: 4px;
      color: @text-color-secondary;
      font-size: 12px;
      line-height: 20px;
    }
  }
}
</style>
