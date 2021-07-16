<template>
  <div class="print-page">
    <button ref="button" v-print="'#print-table'">打印</button>
    <div class="print-page-title">出库单</div>
    <table class="print-table" id="print-table">
      <thead>
        <tr class="print-text-tr">
          <th colspan="4">领料部门：</th>
          <th>出库日期：</th>
          <th colspan="2"></th>
          <th>单据编号：</th>
          <th colspan="2"></th>
        </tr>
        <tr class="print-thead-tr-border">
          <th width="90px">序号</th>
          <th>物料编号</th>
          <th>品牌</th>
          <th>名称</th>
          <th>规格</th>
          <th>单位</th>
          <th>数量</th>
          <th></th>
          <th>金额</th>
          <th>备注</th>
        </tr>
      </thead>
      <tbody>
        <tr class="print-tbody-tr-border">
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>￥</td>
          <td></td>
        </tr>
        <tr class="print-tbody-tr-border">
          <td colspan="2">合计（大写）</td>
          <td colspan="5"></td>
          <td>（小写）</td>
          <td colspan="2">￥</td>
        </tr>
        <tr>
          <td>审核人：</td>
          <td colspan="3"></td>
          <td>领料人：</td>
          <td colspan="2"></td>
          <td>经办人：</td>
          <td colspan="2"></td>
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
  </div>
</template>

<script>
import print from 'vue-print-nb'
export default {
  directives: {
    print
  },
  mounted () {
    this.$refs.button.click()
  }
}
</script>

<style scoped>
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
