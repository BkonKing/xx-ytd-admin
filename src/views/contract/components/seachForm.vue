<template>
  <a-form layout="inline">
    <a-row :gutter="48">
      <a-col :md="8" :sm="24">
        <a-form-item label="合同状态">
          <a-select v-model="queryParam.status" placeholder="请选择">
            <a-select-option value="0">全部</a-select-option>
            <a-select-option value="1">关闭</a-select-option>
            <a-select-option value="2">运行中</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :md="8" :sm="24">
        <a-form-item label="所属项目">
          <a-select v-model="queryParam.projectId" placeholder="请选择">
            <a-select-option value="0">全部</a-select-option>
            <a-select-option value="1">关闭</a-select-option>
            <a-select-option value="2">运行中</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <template v-if="advanced">
        <a-col :md="8" :sm="24">
          <a-form-item label="所属公司">
            <a-select v-model="queryParam.system" placeholder="请选择">
              <a-select-option value="0">全部</a-select-option>
              <a-select-option value="1">关闭</a-select-option>
              <a-select-option value="2">运行中</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="合同类型">
            <a-select v-model="queryParam.type" placeholder="请选择">
              <a-select-option value="0">全部</a-select-option>
              <a-select-option value="1">关闭</a-select-option>
              <a-select-option value="2">运行中</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="订单">
            <a-input v-model="queryParam.contract" placeholder="ID"></a-input>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="合同">
            <a-input
              v-model="queryParam.contract"
              placeholder="编号、名称"
            ></a-input>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="供应商">
            <a-input v-model="queryParam.gys" placeholder="ID、名称"></a-input>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="付款情况">
            <a-select
              v-model="queryParam.fk"
              placeholder="请选择"
              default-value="0"
            >
              <a-select-option value="0">全部</a-select-option>
              <a-select-option value="1">关闭</a-select-option>
              <a-select-option value="2">运行中</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="创建时间">
            <a-range-picker v-model="queryParam.time" />
          </a-form-item>
        </a-col>
      </template>
      <a-col :md="(!advanced && 8) || 24" :sm="24">
        <span
          class="table-page-search-submitButtons"
          :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
        >
          <a-button type="primary" @click="search">查询</a-button>
          <a-button style="margin-left: 8px" @click="reset">重置</a-button>
          <a @click="toggleAdvanced" style="margin-left: 8px">
            {{ advanced ? "收起" : "展开" }}
            <a-icon :type="advanced ? 'up' : 'down'" />
          </a>
        </span>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
export default {
  name: 'contractSearchForm',
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      queryParam: this.value,
      advanced: false
    }
  },
  methods: {
    search () {
      this.$emit('input', this.queryParam)
      this.$emit('search')
    },
    reset () {
      this.queryParam = {}
      this.$emit('input', this.queryParam)
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  },
  watch: {
    value (val) {
      this.queryParam = val
    }
  }
}
</script>

<style></style>
