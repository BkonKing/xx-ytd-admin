<template>
  <div>
    <a-card title="订单信息" style="margin-top: 24px">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="所属公司">
                <a-select v-model="queryParam.status" placeholder="请选择">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="订单">
                <a-input
                  v-model="queryParam.contract"
                  placeholder="ID"
                ></a-input>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col v-if="type === '0'" :md="8" :sm="24">
                <a-form-item label="合同">
                  <a-input
                    v-model="queryParam.contract"
                    placeholder="编号、名称"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="供应商">
                  <a-input
                    v-model="queryParam.gys"
                    placeholder="ID、名称"
                  ></a-input>
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
                <a-form-item label="开票情况">
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
                <a-form-item label="材料">
                  <a-input
                    v-model="queryParam.contract"
                    placeholder="ID、名称"
                  ></a-input>
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="(!advanced && 8) || md" :sm="24">
              <span
                class="table-page-search-submitButtons"
                :style="
                  (advanced && { float: 'right', overflow: 'hidden' }) || {}
                "
              >
                <a-button type="primary" @click="$refs.orderTable.refresh(true)"
                  >查询</a-button
                >
                <a-button
                  style="margin-left: 8px"
                  @click="() => (this.queryParam = {})"
                  >重置</a-button
                >
                <a @click="advanced = !advanced" style="margin-left: 8px">
                  {{ advanced ? "收起" : "展开" }}
                  <a-icon :type="advanced ? 'up' : 'down'" />
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <s-table
        ref="orderTable"
        size="default"
        rowKey="key"
        :columns="orderColumns"
        :data="orderLoadData"
        showPagination="auto"
      >
        <span slot="actions" slot-scope="text">
          <a-button type="link" @click="goOrderDetail(text)">查看</a-button>
        </span>
      </s-table>
    </a-card>
    <a-card title="付款信息" style="margin-top: 24px" :bordered="false">
      <s-table ref="table" size="default" :columns="columns" :data="loadData">
        <span slot="contract" slot-scope="text">{{ text }}</span>
        <span slot="actions" slot-scope="text">
          <a-button type="link" @click="goOrderDetail(text)">查看</a-button>
        </span>
      </s-table>
      <a-row class="table-total" type="flex" align="middle">
        <a-col flex="1">总计(4)</a-col>
        <a-col flex="1">￥40,000.00</a-col>
        <a-col flex="1">已开3 (￥30,000.00)，未开1 (￥30,000.00)</a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getPermissions } from '@/api/manage'
export default {
  name: 'contractTab',
  components: {
    STable
  },
  props: {
    type: {
      type: String,
      default: '0' // 0：项目下的订单、1：合同下的订单
    }
  },
  data () {
    return {
      // 展开后的展开占比
      md: 16,
      // 查询参数
      queryParam: {},
      advanced: false,
      columns: [
        {
          title: '序号',
          dataIndex: 'id'
        },
        {
          title: '付款时间',
          dataIndex: 'name'
        },
        {
          title: '付款ID',
          dataIndex: 'name1',
          scopedSlots: { customRender: 'contract' }
        },
        {
          title: '付款方式',
          dataIndex: 'name2'
        },
        {
          title: '付款金额',
          dataIndex: 'name3'
        },
        {
          title: '付款凭证',
          dataIndex: 'name4'
        },
        {
          title: '开票情况',
          dataIndex: 'name5'
        },
        {
          title: '开票凭证',
          dataIndex: 'name6'
        },
        {
          title: '创建时间',
          dataIndex: 'name7'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getPermissions({
          params: Object.assign(parameter, this.queryParam)
        }).then(res => {
          return res.result
        })
      },
      orderColumns: [
        {
          title: '审核时间',
          dataIndex: 'no',
          scopedSlots: { customRender: 'checkTime' }
        },
        {
          title: '所属公司',
          dataIndex: 'no1'
        },
        {
          title: '订单ID',
          dataIndex: 'description'
        },
        {
          title: '材料数量',
          dataIndex: 'callNo',
          sorter: true
        },
        {
          title: '金额',
          dataIndex: 'status',
          sorter: true
        },
        {
          title: '付款情况',
          dataIndex: 'updatedAt'
        },
        {
          title: '创建时间',
          dataIndex: 'updatedAt2'
        }
      ],
      orderLoadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        console.log('loadData request parameters:', requestParameters)
        return getPermissions(requestParameters).then(res => {
          return res.result
        })
      }
    }
  },
  created () {
    if (this.type === '1') {
      this.md = 24
      this.orderColumns.push({
        title: '操作',
        dataIndex: 'no333',
        scopedSlots: { customRender: 'actins' }
      })
      this.columns.push({
        title: '操作',
        dataIndex: 'no333',
        scopedSlots: { customRender: 'actins' }
      })
    }
  },
  methods: {
    goOrderDetail ({ id }) {
      this.$router.push({
        name: 'OrderDetail',
        query: {
          id
        }
      })
    }
  }
}
</script>
