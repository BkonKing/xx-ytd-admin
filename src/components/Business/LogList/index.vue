<template>
  <a-card title="操作日志" style="margin-top: 24px" :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="模块">
              <a-tree-select
                v-model="queryParam.logType"
                style="width: 100%"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="请选择"
                allow-clear
                tree-default-expand-all
                :show-checked-strategy="SHOW_PARENT"
              >
                <a-tree-select-node
                  v-for="(option, index) in typeOptions"
                  :key="index"
                  :value="option.typeId"
                  :title="option.logType"
                >
                  <template v-if="option.children && option.children.length">
                    <a-tree-select-node
                      v-for="(node, i) in option.children"
                      :key="`${index}-${i}`"
                      :value="node.typeId"
                      :title="node.logType"
                    >
                      <template v-if="node.children && node.children.length">
                        <a-tree-select-node
                          v-for="(leaf, ileaf) in node.children"
                          :key="`${index}-${i}-${ileaf}`"
                          :value="leaf.typeId"
                          :title="leaf.logType"
                        >
                        </a-tree-select-node>
                      </template>
                    </a-tree-select-node>
                  </template>
                </a-tree-select-node>
              </a-tree-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="操作员">
              <a-select v-model="queryParam.adminId" placeholder="请选择">
                <a-select-option
                  v-for="option in adminOptions"
                  :value="option.adminId"
                  :key="option.adminId"
                >
                  {{ option.admin }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="操作时间">
                <a-range-picker
                  v-model="queryParam.time"
                  valueFormat="YYYY-MM-DD"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="操作类型">
                <a-input
                  v-model="queryParam.operationType"
                  placeholder="关键字"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="操作说明">
                <a-input
                  v-model="queryParam.serachText"
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

    <s-table
      ref="table"
      row-key="id"
      size="default"
      :columns="columns"
      :data="loadData"
    >
    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getLogType, getLogAdmin, getLogsList } from '@/api/common'
import { TreeSelect } from 'ant-design-vue'
const SHOW_PARENT = TreeSelect.SHOW_PARENT
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
          dataIndex: 'id',
          width: '90px'
        },
        {
          title: '操作时间',
          dataIndex: 'ctime',
          width: '165px'
        },
        {
          title: '模块',
          dataIndex: 'logType'
        },
        {
          title: '操作员',
          dataIndex: 'admin'
        },
        {
          title: '操作类型',
          dataIndex: 'operationType'
        },
        {
          title: '操作说明',
          dataIndex: 'content'
        }
      ]
    },
    typeId: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      queryParam: {},
      advanced: false,
      typeOptions: [],
      adminOptions: [],
      SHOW_PARENT,
      loadData: parameter => {
        const time = this.queryParam.time
        if (time) {
          this.queryParam.startDate = time[0]
          this.queryParam.endDate = time[1]
        }
        return getLogsList(Object.assign(parameter, this.queryParam))
      }
    }
  },
  created () {
    this.getLogType()
    this.getLogAdmin()
    this.queryParam.logType = parseInt(this.typeId)
  },
  methods: {
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    // 获取操作日志模块接口
    getLogType () {
      getLogType({
        pId: this.typeId
      }).then(({ data }) => {
        this.typeOptions = data
      })
    },
    // 获取日志操作员接口
    getLogAdmin () {
      getLogAdmin().then(({ data }) => {
        this.adminOptions = data
      })
    }
  }
}
</script>

<style></style>
