<template>
  <page-header-wrapper>
    <template v-slot:content>
      订单审核通过则自动入库；出库需填出库单，创建出库单则自动出库。
    </template>
    <template v-slot:extraContent>
      <a-row class="status-list">
        <a-col :xs="24" :sm="24">
          <div class="text">现有库存</div>
          <div class="heading">{{ currentNums }}</div>
        </a-col>
      </a-row>
    </template>
    <a-card class="search-card" style="margin-top: 24px" :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form ref="form" layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="所属项目">
                <project-select v-model="queryParam.projectId"></project-select>
              </a-form-item>
            </a-col>
            <a-col v-if="isParentCompany" :md="8" :sm="24">
              <a-form-item label="所属公司">
                <company-select v-model="queryParam.companyId"></company-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="物料">
                <a-input
                  v-model="queryParam.serachMaterialText"
                  placeholder="编码、名称"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="规格型号">
                <a-input
                  v-model="queryParam.serachModelText"
                  placeholder="请输入"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="物料品牌">
                <a-input
                  v-model="queryParam.serachBrandText"
                  placeholder="请输入"
                ></a-input>
              </a-form-item>
            </a-col>
            <template v-if="!isParentCompany || advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="备注">
                  <a-input
                    v-model="queryParam.serachRemarksText"
                    placeholder="请输入"
                  ></a-input>
                </a-form-item>
              </a-col>
            </template>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="供应商">
                  <a-input
                    v-model="queryParam.serachSupplierText"
                    placeholder="ID、名称"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="订单">
                  <a-input
                    v-model="queryParam.orderId"
                    placeholder="ID"
                  ></a-input>
                </a-form-item>
              </a-col>
            </template>
            <advanced-form
              v-model="advanced"
              :md="isParentCompany ? 8 : 16"
              @search="$refs.table.refresh(true)"
              @reset="reset"
            ></advanced-form>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card style="margin-top: 24px" :bordered="false">
      <div class="table-operator">
        <a-button v-if="permissions.CreatePermission" @click="openAdd"
          >新增入库</a-button
        >
      </div>

      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :showPagination="true"
      >
        <template slot="materialName" slot-scope="text, record">
          <div class="two-Multi">{{ record.materialNo }} {{ text }}</div>
        </template>
        <template slot="originalNum" slot-scope="text, record">
          <a-input-number
            v-if="record.editable"
            v-model="record.originalNum"
            :min="0"
            style="width: 70px;"
          />
          <template v-else>
            {{ text }}
          </template>
        </template>
        <template slot="remarks" slot-scope="text, record">
          <a-input
            v-if="record.editable"
            v-model="record.remarks"
            :maxLength="100"
            style="min-width: 96px;"
          />
          <template v-else>
            {{ text }}
          </template>
        </template>

        <template slot="action" slot-scope="text, record, index">
          <span class="table-action" v-if="record.editable">
            <a @click="save(index, record)">保存</a>
            <a @click="cancel(index)">取消</a>
          </span>
          <span class="table-action" v-else>
            <a @click="goDetail(record)">查看</a>
            <a
              v-if="
                permissions.UpdatePermission &&
                  userCompanyId == record.companyId
              "
              @click="handleEdit(index)"
              >编辑</a
            >
            <a
              v-if="
                permissions.RemovePermission &&
                  +record.totalLknum + +record.totalCknum <= 0 &&
                  userCompanyId == record.companyId
              "
              @click="handleRemove(record)"
              >删除</a
            >
          </span>
        </template>
      </s-table>
    </a-card>

    <!-- 新增 -->
    <add-modal
      v-model="visible"
      @submit="$refs.table.refresh(true)"
    ></add-modal>
  </page-header-wrapper>
</template>

<script>
// import moment from 'moment'
import {
  STable,
  ProjectSelect,
  CompanySelect,
  AdvancedForm
} from '@/components'
import { getStockList, updateStock, removeStock } from '@/api/stock'
import AddModal from './components/AddModal'
import clonedeep from 'lodash.clonedeep'
import setCompanyId from '@/mixins/setCompanyId'

export default {
  name: 'stockIndex',
  mixins: [setCompanyId],
  components: {
    STable,
    ProjectSelect,
    CompanySelect,
    AddModal,
    AdvancedForm
  },
  data () {
    return {
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      // 弹窗
      visible: false,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      columns: [
        {
          title: '库存ID',
          dataIndex: 'id',
          width: '52px'
        },
        {
          title: '所属项目',
          dataIndex: 'projectName',
          width: '11%',
          customRender: (text) => {
            return <div class="two-Multi">{text}</div>
          }
        },
        {
          title: '物料名称',
          dataIndex: 'materialName',
          scopedSlots: { customRender: 'materialName' },
          width: '11%'
        },
        {
          title: '物料品牌',
          dataIndex: 'brand',
          width: '11%',
          customRender: (text) => {
            return <div class="two-Multi">{text}</div>
          }
        },
        {
          title: '规格型号',
          dataIndex: 'model',
          width: '11%',
          customRender: (text) => {
            return <div class="two-Multi">{text}</div>
          }
        },
        {
          title: '单位',
          dataIndex: 'unitv',
          width: '50px'
        },
        {
          title: '现有库存',
          dataIndex: 'currentNum',
          sorter: true,
          width: '84px'
        },
        {
          title: '期初库存',
          dataIndex: 'originalNum',
          sorter: true,
          width: '84px',
          scopedSlots: { customRender: 'originalNum' }
        },
        {
          title: '总入库',
          dataIndex: 'totalLknum',
          sorter: true,
          width: '70px'
        },
        {
          title: '总出库',
          dataIndex: 'totalCknum',
          sorter: true,
          width: '70px'
        },
        {
          title: '备注',
          dataIndex: 'remarks',
          width: '140px',
          scopedSlots: { customRender: 'remarks' }
        },
        {
          title: '操作',
          class: 'nowrap max-width',
          scopedSlots: { customRender: 'action' }
        }
      ],
      tableData: [],
      cacheData: [],
      currentNums: 0,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const requestParameters = Object.assign({}, parameter, this.queryParam)
        return getStockList(requestParameters).then(res => {
          this.currentNums = res.data.currentNums
          this.tableData = res.data.records
          this.cacheData = clonedeep(res.data.records)
          return res
        })
      }
    }
  },
  methods: {
    openAdd () {
      this.visible = true
    },
    handleRemove ({ id }) {
      const that = this
      this.$confirm({
        title: '删除库存',
        content: `确定删除“库存ID${id}”吗？`,
        icon: () =>
          this.$createElement('a-icon', {
            props: {
              type: 'exclamation-circle',
              theme: 'filled'
            }
          }),
        onOk () {
          removeStock({
            id
          }).then(({ data }) => {
            that.$message.success('删除库存成功')
            that.$refs.table.refresh(true)
          })
        }
      })
    },
    handleEdit (index) {
      const target = this.tableData[index]
      if (target) {
        this.setEditable(index, true)
      }
    },
    save (index, { id, originalNum, remarks }) {
      updateStock({
        id,
        originalNum,
        remarks
      }).then(({ data }) => {
        this.setEditable(index, false)
        this.$refs.table.refresh()
      })
    },
    cancel (index) {
      this.$set(this.tableData, index, clonedeep(this.cacheData[index]))
      this.setEditable(index, false)
    },
    setEditable (index, value) {
      this.$set(this.tableData[index], 'editable', value)
    },
    goDetail ({ id }) {
      this.$router.push({
        name: 'stockDetail',
        query: {
          id
        }
      })
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name !== 'stockDetail') {
      this.$destroy()
    }
    next()
  }
}
</script>

<style lang="less" scoped>
.status-list {
  position: absolute;
  right: 24px;
  bottom: 16px;
  .text {
    color: #00000072;
  }
  .heading {
    font-size: 20px;
    color: #000000d8;
  }
}
/deep/ .ant-table-thead > tr > th,
/deep/ .ant-table-tbody > tr > td {
  padding-left: 8px;
  padding-right: 0;
}
/deep/ .ant-table-thead > tr > th:last-child,
/deep/ .ant-table-tbody > tr > td:last-child {
  padding-right: 8px;
}
/deep/ .max-width {
  max-width: 116px;
  width: 52px;
}
</style>
