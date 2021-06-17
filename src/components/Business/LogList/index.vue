<template>
  <a-card title="操作日志" style="margin-top: 24px" :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="模块">
              <a-select
                mode="multiple"
                v-model="queryParam.status"
                placeholder="请选择"
              >
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="操作员">
              <a-select v-model="queryParam.projectId" placeholder="请选择">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="操作时间">
                <a-range-picker @change="onChange" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="操作类型">
                <a-input
                  v-model="queryParam.contract"
                  placeholder="关键字"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="操作说明">
                <a-input
                  v-model="queryParam.gys"
                  placeholder="关键字"
                ></a-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="8" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="
                (advanced && { float: 'right', overflow: 'hidden' }) || {}
              "
            >
              <a-button type="primary" @click="$refs.table.refresh(true)"
                >查询</a-button
              >
              <a-button
                style="margin-left: 8px"
                @click="() => (this.queryParam = {})"
                >重置</a-button
              >
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? "收起" : "展开" }}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table ref="table" size="default" :columns="columns" :data="load">
      <span slot="contract" slot-scope="text">{{ text }}</span>
    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'
export default {
  name: 'logList',
  components: {
    STable
  },
  props: {
    load: Function,
    columns: {
      type: Array,
      default: () => [
        {
          title: 'id',
          dataIndex: 'id'
        },
        {
          title: '操作时间',
          dataIndex: 'name'
        },
        {
          title: '模块',
          dataIndex: 'name1',
          scopedSlots: { customRender: 'contract' }
        },
        {
          title: '操作员',
          dataIndex: 'name2'
        },
        {
          title: '操作类型',
          dataIndex: 'name3'
        },
        {
          title: '操作说明',
          dataIndex: 'name4'
        }
      ]
    }
  },
  data () {
    return {
      queryParam: {},
      advanced: false,
      loadData: parameter => {
        return this.load({
          params: Object.assign(parameter, this.queryParam)
        }).then(res => {
          return res.result
        })
      }
    }
  },
  methods: {
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  }
}
</script>

<style></style>
