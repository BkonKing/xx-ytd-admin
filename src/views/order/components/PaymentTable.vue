<template>
  <a-card :bordered="false" title="付款信息" style="margin-top: 24px;">
    <s-table ref="table" size="default" :columns="columns" :data="loadData">
      <span slot="index" slot-scope="text, record, index">
        {{ data.records.length - index }}
      </span>
      <span slot="payPz" slot-scope="text, record">
        <a v-if="text" @click="previewImage(record.payPz)">{{text}}张</a>
        <template v-else>--</template>
      </span>
      <span class="table-action" slot="action" slot-scope="text, recode">
        <a @click="OpenEdit(recode)">编辑</a>
        <a @click="handleRemove(recode)">删除</a>
      </span>
      <template v-if="data.allMoney" slot="footer">
        <span> 总计({{ `${data.unKpNum + data.kpNum}` }}) </span>
        <span>￥{{ data.allMoney }}</span>
        <span>
          已开{{ data.kpNum }} (￥{{ data.kpMoney }}) 未开{{
            data.unKpNum
          }}
          (￥{{ data.unKpMoney }})
        </span>
      </template>
    </s-table>
    <a-button
      style="width: 100%; margin-top: 16px; margin-bottom: 8px"
      type="dashed"
      icon="plus"
      @click="openAdd"
      >新增付款</a-button
    >
    <a-modal
      :title="title"
      :visible="visible"
      :confirm-loading="confirmLoading"
      :width="640"
      :maskClosable="false"
      :keyboard="false"
      @ok="handleOk"
      @cancel="closeModal"
    >
      <payment-edit-form ref="PaymentForm"></payment-edit-form>
    </a-modal>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import PaymentEditForm from './PaymentEditForm'
// import cloneDeep from 'lodash.clonedeep'
import {
  getOrderPayByOrderId,
  addOrderPay,
  updateOrderPay,
  removeOrderPay
} from '@/api/order'
export default {
  name: 'PaymentTable',
  components: {
    STable,
    PaymentEditForm
  },
  props: {
    id: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'index' }
        },
        {
          title: '付款时间',
          dataIndex: 'payTime'
        },
        {
          title: '付款ID',
          dataIndex: 'id'
        },
        {
          title: '付款方式',
          dataIndex: 'payTypeName'
        },
        {
          title: '付款金额',
          dataIndex: 'paid',
          key: 'paid'
        },
        {
          title: '付款凭证',
          dataIndex: 'payPzNum',
          scopedSlots: { customRender: 'payPz' }
        },
        {
          title: '开票情况',
          dataIndex: 'isKpName'
        },
        {
          title: '创建时间',
          dataIndex: 'ctime'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ],
      data: {},
      loadData: parameter => {
        return getOrderPayByOrderId(
          Object.assign(parameter, {
            orderId: this.id
          })
        ).then(res => {
          this.data = res.data
          return res
        })
      },
      title: '',
      visible: false,
      confirmLoading: false
    }
  },
  methods: {
    // 打开新增弹窗
    openAdd () {
      this.title = '新增付款'
      this.showModal()
      this.$refs.PaymentForm && this.$refs.PaymentForm.resetFields()
    },
    // 打开编辑弹窗
    OpenEdit (obj) {
      this.title = '编辑付款'
      this.showModal()
      this.$refs.PaymentForm && this.$refs.PaymentForm.resetFields()
      this.$nextTick(() => {
        this.$refs.PaymentForm.setFieldsValue(obj)
      })
    },
    showModal () {
      this.visible = true
    },
    handleOk (e) {
      this.$refs.PaymentForm.handleSubmit().then(res => {
        this.confirmLoading = true
        if (res.id) {
          this.updateOrderPay(res)
        } else {
          this.addOrderPay(res)
        }
      })
    },
    addOrderPay (data) {
      addOrderPay({ ...data, orderId: this.id })
        .then(({ success }) => {
          if (success) {
            this.$message.success('添加项目成功')
            this.$refs.table.refresh()
            this.visible = false
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    updateOrderPay (data) {
      updateOrderPay({ ...data, orderId: this.id })
        .then(({ success }) => {
          if (success) {
            this.$message.success('修改项目成功')
            this.$refs.table.refresh()
            this.visible = false
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    closeModal () {
      this.visible = false
    },
    handleRemove ({ id }) {
      const that = this
      this.$confirm({
        title: '删除付款',
        content: '确定删除吗？',
        onOk () {
          removeOrderPay({
            id
          }).then(({ data }) => {
            that.$message.success('删除成功')
            that.$refs.table.refresh()
          })
        }
      })
    },
    // 查看订单凭证
    previewImage (images) {
      this.$viewerApi({
        images
      })
    }
  }
}
</script>

<style></style>
