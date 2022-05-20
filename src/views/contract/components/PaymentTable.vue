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
        <a v-if="+text !== 0" @click="previewFile(record.payPz, '付款凭证')"
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
      <div style="width: 17%;">总计({{ `${data.records.length || 0}` }})</div>
      <div style="width: 20%;">
        ￥{{ parseFloat(data.allMoney) ? data.allMoney : 0 }}
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
        :unpaid="unpaid"
      ></payment-edit-form>
    </a-modal>
    <file-list-modal
      v-model="previewVisible"
      :title="previewTitle"
      :data="previewFileData"
    ></file-list-modal>
  </a-card>
</template>

<script>
import clonedeep from 'lodash.clonedeep'
import { FileListModal, STable } from '@/components'
import PaymentEditForm from './PaymentEditForm'
import {
  getContractPayByContractId,
  addContractPay,
  updateContractPay,
  removeContractPay
} from '@/api/contract'
export default {
  name: 'PaymentTable',
  components: {
    FileListModal,
    STable,
    PaymentEditForm
  },
  props: {
    id: {
      type: [String, Number],
      default: ''
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
          title: '付款金额',
          dataIndex: 'paid',
          width: '10%',
          customRender (text) {
            return `￥${text}`
          }
        },
        {
          title: '付款时间',
          dataIndex: 'payTime',
          width: '10%'
        },
        {
          title: '付款方式',
          dataIndex: 'payTypeName',
          width: '10%'
        },
        {
          title: '付款凭证',
          dataIndex: 'payPzNum',
          scopedSlots: { customRender: 'payPz' },
          width: '10%'
        },
        {
          title: '备注',
          dataIndex: 'bz',
          width: '20%'
        },
        {
          title: '创建时间',
          dataIndex: 'ctime',
          width: '13%'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          width: '10%'
        }
      ],
      data: {},
      loadData: parameter => {
        return getContractPayByContractId({
          contractId: this.id
        }).then(res => {
          this.data = res.data
          return res
        })
      },
      title: '',
      visible: false,
      confirmLoading: false,
      clonedeep,
      previewVisible: false,
      previewTitle: '',
      previewFileData: []
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
          this.updateContractPay(res)
        } else {
          this.addContractPay(res)
        }
      })
    },
    addContractPay (data) {
      addContractPay({ ...data, contractId: this.id })
        .then(({ success }) => {
          if (success) {
            this.$message.success('添加成功')
            this.$refs.table.refresh()
            this.$emit('change')
            this.visible = false
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    updateContractPay (data) {
      updateContractPay({ ...data, contractId: this.id, payId: data.id })
        .then(({ success }) => {
          if (success) {
            this.$message.success('提交成功')
            this.$refs.table.refresh()
            this.$emit('change')
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
          removeContractPay({
            id
          }).then(({ data }) => {
            that.$message.success('删除成功')
            that.$emit('change')
            that.$refs.table.refresh()
          })
        }
      })
    },
    // 查看订单凭证
    previewFile (files, title) {
      const isOnlyImage = files.some(obj => !obj.name)
      if (isOnlyImage) {
        this.$viewerApi({
          images: files.map(obj => obj.url)
        })
        return
      }
      this.previewTitle = title
      this.previewFileData = files
      this.previewVisible = true
    }
  }
}
</script>

<style lang="less">
.payment-form-modal .ant-modal-body {
  padding-bottom: 7px;
}
</style>
