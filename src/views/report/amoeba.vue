<template>
  <page-header-wrapper>
    <a-card
      class="search-card table-page-search-wrapper"
      style="margin-top: 24px"
      :bordered="false"
    >
      <a-form ref="form" layout="inline">
        <standard-form-row
          class="type-row"
          title="报表类型"
          block
          style="padding-bottom: 11px;"
        >
          <a-form-item style="margin-bottom: 0;">
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
        <standard-form-row class="other-row" title="其它选项" last>
          <a-row :gutter="48">
            <a-col :span="8">
              <a-form-item label="选择项目">
                <project-select
                  v-model="queryParam.projectId"
                  @change="
                    (value, label) => {
                      projectName = label;
                    }
                  "
                ></project-select>
              </a-form-item>
            </a-col>
            <a-col v-if="isParentCompany" :span="8">
              <a-form-item label="选择公司">
                <company-select
                  v-model="queryParam.companyId"
                  @change="
                    (value, label) => {
                      componyName = label;
                    }
                  "
                ></company-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="选择月份">
                <a-month-picker
                  v-model="queryParam.month"
                  valueFormat="YYYY-MM"
                  placeholder="选择月份"
                  :disabledDate="disabledDate"
                  style="width: 100%;"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row type="flex" justify="end" style="margin-bottom: 20px;">
            <a-button type="primary" @click="validat(1)">生成报表</a-button>
            <a-button style="margin-left: 10px;" @click="validat(0)"
              >导出报表</a-button
            >
          </a-row>
        </standard-form-row>
      </a-form>
    </a-card>
    <a-card
      v-if="updateTypes.includes('1')"
      style="margin-top: 24px"
      :bordered="false"
    >
      <div class="print-page">
        <div class="print-page-title">
          {{ componyNameC }}{{ projectNameC }}项目部（{{
            monthText
          }}）成本费用完成情况表
        </div>
        <a-row style="margin: 20px 0 10px;">
          <a-col :span="10">单位：</a-col>
          <a-col :span="7">填报日期：</a-col>
          <a-col :span="7" style="text-align: right;">单位：万元</a-col>
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
                <td>{{ tr.xh }}</td>
                <td>{{ tr.categoryName }}</td>
                <td>
                  <a-input
                    v-model="tr.masterBudgets"
                    v-number-input
                    placeholder="请输入"
                    class="no-border-input"
                    @blur="updateAmbReport(tr)"
                  ></a-input>
                </td>
                <td>{{ tr.payableTotal }}</td>
                <td>
                  <a-input
                    v-model="tr.monthBudget"
                    v-number-input
                    placeholder="请输入"
                    class="no-border-input"
                    @blur="updateAmbReport(tr)"
                  ></a-input>
                </td>
                <td>{{ tr.monthPayTotal }}</td>
                <td>{{ tr.allPayTotal }}</td>
                <td>
                  {{ tr.allUnPayTotal || "--" }}
                </td>
                <td>
                  {{ tr.monthBalance || "--" }}
                </td>
                <td>
                  {{ tr.budgetsBalance || "--" }}
                </td>
              </tr>
              <template v-if="tr.children && tr.children.length">
                <template v-for="(trc, i) in tr.children">
                  <tr
                    v-if="i !== tr.children.length - 1"
                    class="print-tbody-tr-border"
                    :key="`${index}${i}`"
                  >
                    <td></td>
                    <td>{{ trc.categoryName }}</td>
                    <td>
                      <a-input
                        v-model="trc.masterBudgets"
                        v-number-input
                        placeholder="请输入"
                        class="no-border-input"
                        @blur="updateAmbReport(tr)"
                      ></a-input>
                    </td>
                    <td>{{ trc.payableTotal }}</td>
                    <td>
                      <a-input
                        v-model="trc.monthBudget"
                        v-number-input
                        placeholder="请输入"
                        class="no-border-input"
                        @blur="updateAmbReport(tr)"
                      ></a-input>
                    </td>
                    <td>{{ trc.monthPayTotal }}</td>
                    <td>{{ trc.allPayTotal }}</td>
                    <td>
                      {{ trc.allUnPayTotal || "--" }}
                    </td>
                    <td>
                      {{ trc.monthBalance || "--" }}
                    </td>
                    <td>
                      {{ trc.budgetsBalance || "--" }}
                    </td>
                  </tr>
                  <tr
                    v-else
                    class="print-tbody-tr-border"
                    :key="`${index}${i}`"
                  >
                    <td></td>
                    <td>{{ trc.categoryName }}</td>
                    <td>{{ trc.masterBudgets }}</td>
                    <td>{{ trc.payableTotal }}</td>
                    <td>{{ trc.monthBudget }}</td>
                    <td>{{ trc.monthPayTotal }}</td>
                    <td>{{ trc.allPayTotal }}</td>
                    <td>
                      {{ trc.allUnPayTotal || "--" }}
                    </td>
                    <td>
                      {{ trc.monthBalance || "--" }}
                    </td>
                    <td>
                      {{ trc.budgetsBalance || "--" }}
                    </td>
                  </tr>
                </template>
              </template>
            </template>
            <tr class="print-tbody-tr-border">
              <td colspan="2">总合计</td>
              <td>{{ masterBudgets }}</td>
              <td>{{ payableTotal }}</td>
              <td>{{ monthBudget }}</td>
              <td>{{ monthPayTotal }}</td>
              <td>{{ allPayTotal }}</td>
              <td>{{ allUnPayTotal }}</td>
              <td>{{ monthBalance }}</td>
              <td>{{ budgetsBalance }}</td>
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

    <a-card
      v-if="updateTypes.includes('2')"
      style="margin-top: 24px"
      :bordered="false"
    >
      <div class="print-page">
        <div class="print-page-title">
          {{ componyNameC }}{{ projectNameC }}项目部（{{
            monthText
          }}）收支计划执行情况表
        </div>
        <a-row style="margin: 20px 0 10px;">
          <a-col :span="10">单位：</a-col>
          <a-col :span="7">填报日期：</a-col>
          <a-col :span="7" style="text-align: right;">单位：万元</a-col>
        </a-row>
        <table class="print-table" id="print-table">
          <thead>
            <tr class="print-thead-tr-border">
              <th rowspan="2" colspan="2" width="90px">收支项目</th>
              <th>整体项目计划金额</th>
              <th>至上月完成金额</th>
              <th>本月计划数</th>
              <th>本月完成金额</th>
              <th>至本月完成金额</th>
              <th>本月差异</th>
              <th>完成情况与计划对比</th>
              <th rowspan="2">备注</th>
            </tr>
            <tr class="print-thead-tr-border">
              <th>(A)</th>
              <th>(B)</th>
              <th>(C)</th>
              <th>(D)</th>
              <th>(E)</th>
              <th>(G)=(C)-(D)</th>
              <th>(H)=(A)-(E)</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(tr, index) in completeData">
              <tr class="print-tbody-tr-border" :key="index">
                <td v-if="index === 0" :rowspan="completeData.length + 1">
                  资<br />金<br />流<br />出
                </td>
                <td>{{ tr.categoryName }}</td>
                <td>{{ tr.children[tr.children.length - 1].masterBudgets }}</td>
                <td>{{ tr.children[tr.children.length - 1].payableLastMonthTotal }}</td>
                <td>{{ tr.children[tr.children.length - 1].monthBudget }}</td>
                <td>{{ tr.children[tr.children.length - 1].monthPayTotal }}</td>
                <td>{{ tr.children[tr.children.length - 1].allPayTotal }}</td>
                <td>{{ tr.children[tr.children.length - 1].monthBalance || "--" }}</td>
                <td>{{ tr.children[tr.children.length - 1].budgetsBalance || "--" }}</td>
                <td></td>
              </tr>
            </template>
            <tr class="print-tbody-tr-border">
              <td v-if="!completeData || !completeData.length">
                资金流出
              </td>
              <td>支出合计</td>
              <td>{{ masterBudgets }}</td>
              <td>{{ payableLastMonthTotal }}</td>
              <td>{{ monthBudget }}</td>
              <td>{{ monthPayTotal }}</td>
              <td>{{ allPayTotal }}</td>
              <td>{{ monthBalance }}</td>
              <td>{{ budgetsBalance }}</td>
              <td v-if="!completeData || !completeData.length"></td>
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

    <export-type-modal
      v-model="visible"
      eUrl="/operate/report/ambReportExcel"
      wUrl="/operate/report/ambReportWord"
      :params="queryParam"
    ></export-type-modal>
  </page-header-wrapper>
</template>

<script>
import {
  ProjectSelect,
  CompanySelect,
  TagSelect,
  StandardFormRow
} from '@/components'
import { getAmbReport, updateAmbReport } from '@/api/report'
import exportTypeModal from './components/exportTypeModal'
import clonedeep from 'lodash.clonedeep'
import NP from 'number-precision'
import moment from 'moment'
const TagSelectOption = TagSelect.Option

export default {
  name: 'reportAmoeba',
  components: {
    ProjectSelect,
    CompanySelect,
    TagSelect,
    TagSelectOption,
    StandardFormRow,
    exportTypeModal
  },
  data () {
    return {
      visible: false,
      // 查询参数
      queryParam: {},
      updateParam: {},
      typeList: [
        {
          text: '成本费用完成情况',
          value: '1'
        },
        {
          text: '收支计划执行情况表',
          value: '2'
        }
      ],
      types: [],
      updateTypes: [],
      completeData: [],
      projectName: '',
      projectNameC: '',
      componyName: '',
      componyNameC: '',
      monthText: '',
      masterBudgets: '',
      payableTotal: '',
      monthBudget: '',
      monthPayTotal: '',
      allPayTotal: '',
      allUnPayTotal: '',
      monthBalance: '',
      budgetsBalance: '',
      payableLastMonthTotal: ''
    }
  },
  created () {
    this.queryParam.companyId = this.userCompanyId
    this.componyName = this.$store.state.user.info.companyName
  },
  methods: {
    validat (type) {
      if (!this.queryParam.projectId) {
        this.$message.warning('请选择项目')
        return
      } else if (!this.queryParam.companyId && this.isParentCompany) {
        this.$message.warning('请选择公司')
        return
      } else if (!this.queryParam.month) {
        this.$message.warning('请选择月份')
        return
      } else if (!this.types.length && type) {
        this.$message.warning('请选择报表类型')
        return
      }
      if (type) {
        this.getAmbReport()
      } else {
        this.openExport()
      }
    },
    // 生成报表
    getAmbReport () {
      this.projectNameC = this.projectName
      this.componyNameC = this.componyName
      const [y, m] = this.queryParam.month.split('-')
      this.monthText = `${y}年${m}月`
      getAmbReport(this.queryParam).then(({ data }) => {
        this.completeData = data
        this.updateParam = clonedeep(this.queryParam)
        this.updateTypes = this.types
        this.count()
      })
    },
    // 更新报表
    updateAmbReport () {
      const materialObj = {}
      this.completeData.forEach(obj => {
        materialObj[obj.materialId] = {
          masterBudgets: obj.masterBudgets,
          monthBudget: obj.monthBudget
        }
        if (obj.children) {
          const arr = obj.children.map(material => {
            return {
              [material.materialId]: {
                masterBudgets: material.masterBudgets,
                monthBudget: material.monthBudget
              }
            }
          })
          Object.assign(materialObj, ...arr)
        }
      })
      updateAmbReport({ ...this.updateParam, material: materialObj }).then(
        ({ data }) => {
          this.getAmbReport()
        }
      )
    },
    // 计算合计值
    count () {
      let masterBudgets = 0
      let payableTotal = 0
      let monthBudget = 0
      let monthPayTotal = 0
      let allPayTotal = 0
      let allUnPayTotal = 0
      let monthBalance = 0
      let budgetsBalance = 0
      let payableLastMonthTotal = 0
      let isNullMasterBudgets = true // 所有的预算金额全部都是空字符串
      let isNullMonthBudget = true // 所有的本月计划数都是空字符串
      let isNullMonthBalance = true // 整体本月差异全部都是——
      let isNullBudgetsBalance = true // 整体预算差异金额全部都是——
      this.completeData.forEach(obj => {
        const index = obj.children.length - 1
        const countRow = obj.children[index]
        countRow.masterBudgets !== '' && (isNullMasterBudgets = false)
        countRow.monthBudget !== '' && (isNullMonthBudget = false)
        countRow.monthBalance !== '——' && (isNullMonthBalance = false)
        countRow.budgetsBalance !== '——' && (isNullBudgetsBalance = false)
        masterBudgets = NP.plus(
          masterBudgets,
          parseFloat(countRow.masterBudgets) || 0
        )
        payableTotal = NP.plus(
          payableTotal,
          parseFloat(countRow.payableTotal) || 0
        )
        monthBudget = NP.plus(monthBudget, parseFloat(countRow.monthBudget) || 0)
        monthPayTotal = NP.plus(
          monthPayTotal,
          parseFloat(countRow.monthPayTotal) || 0
        )
        allPayTotal = NP.plus(allPayTotal, parseFloat(countRow.allPayTotal) || 0)
        allUnPayTotal = NP.plus(
          allUnPayTotal,
          parseFloat(countRow.allUnPayTotal) || 0
        )
        monthBalance = NP.plus(
          monthBalance,
          parseFloat(countRow.monthBalance) || 0
        )
        budgetsBalance = NP.plus(
          budgetsBalance,
          parseFloat(countRow.budgetsBalance) || 0
        )
        payableLastMonthTotal = NP.plus(
          payableLastMonthTotal,
          parseFloat(countRow.payableLastMonthTotal) || 0
        )
      })
      this.masterBudgets = isNullMasterBudgets ? '' : masterBudgets
      this.payableTotal = payableTotal
      this.monthBudget = isNullMonthBudget ? '' : monthBudget
      this.monthPayTotal = monthPayTotal
      this.allPayTotal = allPayTotal
      this.allUnPayTotal = allUnPayTotal
      this.monthBalance = isNullMonthBalance ? '——' : monthBalance
      this.budgetsBalance = isNullBudgetsBalance ? '——' : budgetsBalance
      this.payableLastMonthTotal = payableLastMonthTotal
    },
    // 动态渲染要禁用的日期
    disabledDate (current) {
      return current && current > moment().date(0)
    },
    // 导出
    openExport () {
      this.visible = true
    }
  }
  // watch: {
  //   completeData: {
  //     deep: true,
  //     handler (val) {
  //       this.count()
  //     }
  //   }
  // }
}
</script>

<style lang="less" scoped>
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
  text-align: center;
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
.no-border-input {
  padding: 0;
  height: 22px;
  border: none;
  text-align: center;
  &:focus {
    box-shadow: none;
  }
}
.table-page-search-wrapper /deep/ .type-row .ant-form-item-control-wrapper {
  width: auto;
}
.other-row /deep/ .ant-form-item-control-wrappe {
  width: 0;
}
</style>
