<template>
  <div class="print-page">
    <button v-show="false" ref="button" v-print="'#print-table'">打印</button>
    <div id="print-table">
      <template v-for="(tableData, index) in CKData">
        <div class="print-page-title" :key="index">出库单</div>
        <table
          class="print-table"
          :key="`table${index}`"
          style="page-break-after: always"
        >
          <tbody>
            <tr class="print-text-tr">
              <th colspan="4">领料部门：{{ tableData.department }}</th>
              <th colspan="3">出库日期：{{ tableData.clktime }}</th>
              <th colspan="3">单据编号：{{ tableData.djNo }}</th>
            </tr>
            <tr class="print-thead-tr-border">
              <th width="10%">序号</th>
              <th width="10%">物料编号</th>
              <th width="10%">品牌</th>
              <th width="10%">名称</th>
              <th width="10%">规格</th>
              <th width="10%">单位</th>
              <th width="10%">数量</th>
              <th width="10%">金额</th>
              <th width="10%">备注</th>
            </tr>
            <tr
              v-for="(item, i) in tableData.children"
              :key="i"
              class="print-tbody-tr-border"
            >
              <td>{{ item.xh }}</td>
              <td>{{ item.materialNo }}</td>
              <td>{{ item.brand }}</td>
              <td>{{ item.materialName }}</td>
              <td>{{ item.model }}</td>
              <td>{{ item.unitv }}</td>
              <td>{{ item.stockNum }}</td>
              <td><span style="float: left">￥</span
                ><span style="float: right;margin-right: 30px;">-</span></td>
              <td></td>
            </tr>
            <tr class="print-tbody-tr-border">
              <td colspan="2">合计（大写）:</td>
              <td colspan="4"></td>
              <td>（小写）:</td>
              <td colspan="2">
                <span style="float: left">￥</span
                ><span style="float: right;margin-right: 30px;">-</span>
              </td>
            </tr>
            <tr>
              <td colspan="4">审核人：</td>
              <td colspan="3">领料人：{{ tableData.stockMen }}</td>
              <td colspan="3">经办人：</td>
            </tr>
            <tr>
              <td colspan="10"></td>
            </tr>
            <tr>
              <td>备注：</td>
              <td colspan="9"></td>
            </tr>
          </tbody>
        </table>
      </template>
    </div>
  </div>
</template>

<script>
import print from 'vue-print-nb'
import { getStockCkBill } from '@/api/stock'
export default {
  directives: {
    print
  },
  data () {
    return {
      id: '',
      CKData: []
    }
  },
  mounted () {
    this.id = this.$route.query.id
    this.getStockCkBill()
  },
  methods: {
    // 获取出库单打印详情
    getStockCkBill () {
      getStockCkBill({
        ids: this.id
      }).then(({ data }) => {
        this.CKData = data
        this.$nextTick(() => {
          this.$refs.button.click()
        })
      })
    }
  }
}
</script>

<style scoped>
#print-table {
  padding: 2px;
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
.print-table > tbody > tr > th,
.print-table > tbody > tr > td {
  word-break: break-all;
  padding: 8px;
  overflow-wrap: break-word;
}
.print-table > tbody > .print-thead-tr-border > th,
.print-table > tbody > .print-tbody-tr-border > td {
  text-align: center;
  border-right: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
}
.print-table > tbody > .print-thead-tr-border > th:first-child,
.print-table > tbody > .print-tbody-tr-border > td:first-child {
  border-left: 1px solid #e8e8e8;
}
.print-table > tbody > .print-thead-tr-border > th {
  font-weight: 500;
  background: #fafafa;
  border-top: 1px solid #e8e8e8;
}
.print-table > tbody > tr > th {
  color: rgba(0, 0, 0, 0.85);
  text-align: left;
  transition: background 0.3s ease;
}
.print-table > tbody > tr > td {
  transition: background 0.3s;
}
/* .print-table > thead > tr:first-child > th:first-child {
  border-top-left-radius: 2px;
} */
/* .print-table > thead > .print-text-tr > th {
  background: #fff;
  border-bottom: 1px solid #e8e8e880;
  border-right: 1px solid #e8e8e880;
} */
</style>
