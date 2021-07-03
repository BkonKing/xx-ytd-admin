<template>
  <div class="contracSet">
    <page-header-wrapper>
      <template #content>
        <div class="task-top">
          <div
            class="item"
             @click="changeTab(0)"
            :class="{ active: currentIndex === 0 }"
          >
            分类
          </div>
          <div
            class="item"
            @click="changeTab(1)"
            :class="{ active: currentIndex === 1 }"
          >
            其他
          </div>
        </div>
      </template>
    </page-header-wrapper>
    <sort v-if="currentIndex===0"></sort>
    <other v-else></other>
  </div>
</template>

<script>
import sort from './components/sort.vue'
import other from './components/other.vue'
export default {
  components: {
    sort,
    other
  },
  data () {
    return {
      currentIndex: 1
    }
  },
  methods: {
    // 切换tab
    changeTab (index) {
      this.currentIndex = index
    }
  }
}
</script>

<style lang='less' scoped>
.contracSet{
  /deep/ .ant-page-header {
  padding-bottom: 0px !important;
}
  .task-top {
  display: flex;
  align-items: center;

  .item {
    padding: 8px;
    margin-right: 32px;
    cursor: pointer;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
    font-family: "MicrosoftYaHei", "Microsoft YaHei";
    // line-height: 50px;
    border-bottom: 2px solid transparent;
  }
  .active {
    color: #1890ff;
    border-bottom: 2px solid #1890ff;
  }
}
}
</style>
