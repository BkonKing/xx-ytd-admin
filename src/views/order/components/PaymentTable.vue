<template>
  <a-card :bordered="false" title="付款信息" style="margin-top: 24px;">
    <s-table
      ref="table"
      rowKey="id"
      size="default"
      :columns="columns"
      :data="loadData"
    >
      <span slot="index" slot-scope="text, record, index">
        {{ data.records.length - index }}
      </span>
      <span slot="payPz" slot-scope="text, record">
        <a v-if="+text !== 0" @click="previewImage(record.payPz)"
          >{{ text }}张</a
        >
        <template v-else>--</template>
      </span>
      <span slot="kpPz" slot-scope="text, record">
        <a v-if="+text !== 0" @click="previewImage(record.kpPz)"
          >{{ text }}张</a
        >
        <template v-else>--</template>
      </span>
      <span class="table-action" slot="action" slot-scope="text, recode">
        <a v-if="permissions.UpdatePermission" @click="OpenEdit(recode)"
          >编辑</a
        >
        <a v-if="permissions.RemovePermission" @click="handleRemove(recode)"
          >删除</a
        >
      </span>
    </s-table>
    <a-row
      v-if="data.allMoney"
      class="table-total-row"
      type="flex"
      align="middle"
      style="border-bottom: 1px solid #e8e8e8;"
    >
      <div style="width: 44%;">总计({{ `${data.records.length || 0}` }})</div>
      <div style="width: 18%;">￥{{ parseFloat(data.allMoney) ? data.allMoney : 0 }}</div>
      <div>
        已开{{ data.kpNum }} (￥{{ parseFloat(data.kpMoney) ? data.kpMoney : 0 }})，未开{{
          data.unKpNum
        }}
        (￥{{ parseFloat(data.unKpMoney) ? data.unKpMoney : 0 }})
      </div>
    </a-row>
    <a-button
      v-if="permissions.CreatePermission"
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
      :width="660"
      :maskClosable="false"
      :keyboard="false"
      class="payment-form-modal"
      @ok="handleOk"
      @cancel="closeModal"
    >
      <payment-edit-form
        ref="PaymentForm"
        :material="clonedeep(material)"
        :unpaid="unpaid"
      ></payment-edit-form>
    </a-modal>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import PaymentEditForm from './PaymentEditForm'
import clonedeep from 'lodash.clonedeep'
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
    },
    material: {
      type: Array,
      default: () => []
    },
    unpaid: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'index' },
          width: '7%'
        },
        {
          title: '付款ID',
          dataIndex: 'id',
          width: '10%'
        },
        {
          title: '付款情况',
          dataIndex: 'isPayName',
          width: '8%'
        },
        {
          title: '付款时间',
          dataIndex: 'payTime',
          width: '10%'
        },
        {
          title: '付款方式',
          dataIndex: 'payTypeName',
          width: '9%'
        },
        {
          title: '付款金额',
          dataIndex: 'paid',
          width: '9%',
          customRender (text) {
            return `￥${text}`
          }
        },
        {
          title: '付款凭证',
          dataIndex: 'payPzNum',
          scopedSlots: { customRender: 'payPz' },
          width: '9%'
        },
        {
          title: '开票情况',
          dataIndex: 'isKpName',
          width: '9%'
        },
        {
          title: '开票凭证',
          dataIndex: 'kpPzNum',
          scopedSlots: { customRender: 'kpPz' },
          width: '9%'
        },
        {
          title: '创建时间',
          dataIndex: 'ctime',
          width: '10%'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          width: '10%'
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
      confirmLoading: false,
      clonedeep
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
        this.$refs.PaymentForm.setFieldsValue(clonedeep(obj))
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
            this.$emit('changePay')
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
            this.$message.success('提交成功')
            this.$refs.table.refresh()
            this.$emit('changePay')
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
        icon: h => <a-icon theme="filled" type="exclamation-circle" />,
        onOk () {
          removeOrderPay({
            id
          }).then(({ data }) => {
            that.$message.success('删除成功')
            that.$emit('changePay')
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

<style lang="less">
.payment-form-modal .ant-modal-body {
  padding-bottom: 7px;
}
</style>
