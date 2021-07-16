<template>
  <page-header-wrapper>
    <a-card
      class="search-card table-page-search-wrapper"
      style="margin-top: 24px"
      :bordered="false"
    >
      <a-form ref="form" layout="inline">
        <standard-form-row title="报表类型" block style="padding-bottom: 11px;">
          <a-form-item>
            <tag-select v-model="types">
              <tag-select-option
                v-for="tag in typeList"
                :key="tag.value"
                :value="tag.value"
                >{{ tag.text }}</tag-select-option
              >
            </tag-select>
          </a-form-item>
        </standard-form-row>
        <standard-form-row title="其它选项" last>
          <a-row type="flex" :gutter="48">
            <a-col flex="1">
              <a-form-item label="选择项目">
                <project-select v-model="queryParam.projectId"></project-select>
              </a-form-item>
            </a-col>
            <a-col flex="1">
              <a-form-item label="选择公司">
                <company-select v-model="queryParam.companyId"></company-select>
              </a-form-item>
            </a-col>
            <a-col flex="1">
              <a-form-item label="选择月份">
                <a-month-picker
                  v-model="queryParam.month"
                  placeholder="选择月份"
                  style="width: 100%;"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row type="flex" justify="end" style="margin-bottom: 20px;">
            <a-button type="primary" @click="validat">生成报表</a-button>
            <a-button style="margin-left: 10px;">导出报表</a-button>
          </a-row>
        </standard-form-row>
      </a-form>
    </a-card>
    <a-card style="margin-top: 24px" :bordered="false">
      <div class="print-page">
        <div class="print-page-title">
          {{ 1 }}建筑公司{{ 1 }}项目部（{{ 1 }}年{{ 1 }}月）成本费用完成情况表
        </div>
        <a-row style="margin: 20px 0 10px;">
          <a-col :span="10">单位：</a-col>
          <a-col :span="7">填报日期：</a-col>
          <a-col :span="7" style="text-align: right;"
            >单位：<span style="margin-left: 100px;">万元</span></a-col
          >
        </a-row>
        <table class="print-table" id="print-table">
          <thead>
            <tr class="print-thead-tr-border">
              <th rowspan="2" width="90px">序号</th>
              <th rowspan="2">费用项目</th>
              <th>整体预算金额</th>
              <th>累计应付金额</th>
              <th>本月计划数</th>
              <th>本月支付金额</th>
              <th>累计支付金额</th>
              <th>未支付金额</th>
              <th>本月差异</th>
              <th>预算差异金额</th>
            </tr>
            <tr class="print-thead-tr-border">
              <th>(A)</th>
              <th>(B)</th>
              <th>(C)</th>
              <th>(D)</th>
              <th>(E)</th>
              <th>(F)=(B)-(E)</th>
              <th>(G)=(C)-(D)</th>
              <th>(H)=(A)-(E)</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(tr, index) in completeData">
              <tr class="print-tbody-tr-border" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ tr.name }}</td>
                <td>
                  <template v-if="tr.children && tr.children.length">{{
                    tr.A
                  }}</template>
                  <template v-else>
                    <a-input
                      v-model="tr.A"
                      v-number-input
                      placeholder="请输入"
                    ></a-input
                  ></template>
                </td>
                <td>{{ tr.B }}</td>
                <td>
                  <template v-if="tr.children && tr.children.length">{{
                    tr.C
                  }}</template>
                  <template v-else>
                    <a-input
                      v-model="tr.C"
                      v-number-input
                      placeholder="请输入"
                    ></a-input
                  ></template>
                </td>
                <td>{{ tr.D }}</td>
                <td>{{ tr.E }}</td>
                <td>{{ tr.B - tr.E || "--" }}</td>
                <td>{{ tr.C - tr.D || "--" }}</td>
                <td>{{ tr.A - tr.E || "--" }}</td>
              </tr>
              <template v-if="tr.children && tr.children.length">
                <tr
                  v-for="(trc, i) in tr.children"
                  class="print-tbody-tr-border"
                  :key="`${index}${i}`"
                >
                  <td></td>
                  <td>{{ trc.name }}</td>
                  <td>
                    <a-input
                      v-model="trc.A"
                      v-number-input
                      placeholder="请输入"
                      @blur="changeA(tr)"
                    ></a-input>
                  </td>
                  <td>{{ trc.B }}</td>
                  <td>
                    <a-input
                      v-model="trc.C"
                      v-number-input
                      placeholder="请输入"
                      @blur="changeC(tr)"
                    ></a-input>
                  </td>
                  <td>{{ trc.D }}</td>
                  <td>{{ trc.E }}</td>
                  <td>{{ trc.B - trc.E || "--" }}</td>
                  <td>{{ trc.C - trc.D || "--" }}</td>
                  <td>{{ trc.A - trc.E || "--" }}</td>
                </tr>
              </template>
            </template>
            <tr class="print-tbody-tr-border">
              <td colspan="2">总合计</td>
              <td>{{ totalA }}</td>
              <td></td>
              <td>{{ totalC }}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <a-row style="margin: 20px 0 10px;">
          <a-col :span="6">填报人：</a-col>
          <a-col :span="6">审核人：</a-col>
          <a-col :span="6">报送日期：</a-col>
          <a-col :span="6">报表接收人：</a-col>
        </a-row>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import {
  ProjectSelect,
  CompanySelect,
  TagSelect,
  StandardFormRow
} from '@/components'
const TagSelectOption = TagSelect.Option

export default {
  name: 'reportAmoeba',
  components: {
    ProjectSelect,
    CompanySelect,
    TagSelect,
    TagSelectOption,
    StandardFormRow
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      typeList: [
        {
          text: '成本费用完成情况',
          value: 1
        },
        {
          text: '收支计划执行情况表',
          value: 2
        }
      ],
      types: [],
      completeData: [
        {
          name: '一级',
          A: 10,
          B: 10,
          C: 10,
          D: 10,
          E: 10,
          children: [
            {
              name: '二级',
              A: 10,
              B: 10,
              C: 10,
              D: 10,
              E: 10
            }
          ]
        },
        {
          name: '一级1',
          A: 20,
          B: 10,
          C: 20,
          D: 10,
          E: 10,
          children: [
            {
              name: '二级1',
              A: 10,
              B: 10,
              C: 10,
              D: 10,
              E: 10
            },
            {
              name: '二级2',
              A: 10,
              B: 10,
              C: 10,
              D: 10,
              E: 10
            }
          ]
        },
        {
          name: '一级2',
          A: 10,
          B: 10,
          C: 10,
          D: 10,
          E: 10
        }
      ]
    }
  },
  computed: {
    totalA () {
      let total = 0
      this.completeData.forEach(obj => {
        total += parseFloat(obj.A) || 0
      })
      return total || '--'
    },
    totalC () {
      let total = 0
      this.completeData.forEach(obj => {
        total += parseFloat(obj.C) || 0
      })
      return total || '--'
    }
  },
  methods: {
    validat () {
      if (!this.queryParam.projectId) {
        this.$message.warning('请选择项目')
        return
      } else if (!this.queryParam.companyId) {
        this.$message.warning('请选择公司')
        return
      } else if (!this.queryParam.month) {
        this.$message.warning('请选择月份')
        return
      }
      this.create()
    },
    // 生成报表
    create () {},
    // 导出
    openExport () {
      if (!this.queryParam.projectId) {
        this.$message.warning('请选择项目')
      } else if (!this.tableData || !this.tableData.length) {
        this.$message.warning('当前项目有没有数据')
      } else {
        this.visible = true
      }
    },
    exportReport () {},
    changeA (item) {
      let num = 0
      item.children.forEach(obj => {
        num += parseFloat(obj.A)
      })
      console.log(num)
      item.A = num
    },
    changeC (item) {
      let num = 0
      item.children.forEach(obj => {
        num += parseFloat(obj.C)
      })
      item.C = num
    }
  }
}
</script>

<style lang="less" scoped>
.table-page-search-wrapper {
  /deep/ .ant-form-inline .ant-form-item > .ant-form-item-label {
    width: 80px;
  }
}
.print-page {
  width: 100%;
  padding: 24px;
  background: #fff;
}
.print-page-title {
  margin-bottom: 10px;
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  color: #000;
}
.print-table {
  width: 100%;
  /* border: 1px solid #e8e8e8; */
  border-right: 0;
  border-bottom: 0;
}
.print-table > thead > tr > th,
.print-table > tbody > tr > td {
  word-break: break-all;
  padding: 8px;
  overflow-wrap: break-word;
}
.print-table > thead > .print-thead-tr-border > th,
.print-table > tbody > .print-tbody-tr-border > td {
  border-right: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
}
.print-table > thead > .print-thead-tr-border > th:first-child,
.print-table > tbody > .print-tbody-tr-border > td:first-child {
  border-left: 1px solid #e8e8e8;
}
.print-table > thead > .print-thead-tr-border > th {
  font-weight: 500;
  background: #fafafa;
  border-top: 1px solid #e8e8e8;
}
.print-table > thead > tr > th {
  color: rgba(0, 0, 0, 0.85);
  text-align: center;
  transition: background 0.3s ease;
}
.print-table > tbody > tr > td {
  transition: background 0.3s;
}
</style>
