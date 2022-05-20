<template>
  <a-card :bordered="false" title="开票信息" style="margin-top: 24px;">
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
      <span slot="kpPz" slot-scope="text, record">
        <a v-if="+text !== 0" @click="previewFile(record.kpPz, '开票凭证')"
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
      <div style="width: 19%;">总计({{ `${data.records.length || 0}` }})</div>
      <div style="width: 22%;">
        ￥{{ parseFloat(data.allMoney) ? data.allMoney : 0 }}
      </div>
    </a-row>
    <a-button
      v-if="permissions.CreatePermission"
      style="width: 100%; margin-top: 16px; margin-bottom: 8px"
      type="dashed"
      icon="plus"
      @click="openAdd"
      >新增开票</a-button
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
      <invoice-edit-form
        ref="PaymentForm"
        :unpaid="unpaid"
      ></invoice-edit-form>
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
import InvoiceEditForm from './InvoiceEditForm'
import {
  getContractKpByContractId,
  addContractKp,
  updateContractKp,
  removeContractKp
} from '@/api/contract'
export default {
  name: 'PaymentTable',
  components: {
    FileListModal,
    STable,
    InvoiceEditForm
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
          width: '8%'
        },
        {
          title: '开票ID',
          dataIndex: 'id',
          width: '11%'
        },
        {
          title: '开票金额',
          dataIndex: 'kpMoney',
          width: '11%',
          customRender (text) {
            return `￥${text}`
          }
        },
        {
          title: '开票时间',
          dataIndex: 'kpTime',
          width: '11%'
        },
        {
          title: '开票凭证',
          dataIndex: 'kpPzNum',
          scopedSlots: { customRender: 'kpPz' },
          width: '11%'
        },
        {
          title: '备注',
          dataIndex: 'bz',
          width: '23%'
        },
        {
          title: '创建时间',
          dataIndex: 'ctime',
          width: '15%'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' },
          width: '10%'
        }
      ],
      data: {},
      loadData: parameter => {
        return getContractKpByContractId({
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
      this.title = '新增开票'
      this.showModal()
      this.$refs.PaymentForm && this.$refs.PaymentForm.resetFields()
    },
    // 打开编辑弹窗
    OpenEdit (obj) {
      this.title = '编辑开票'
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
          this.updateContractKp(res)
        } else {
          this.addContractKp(res)
        }
      })
    },
    addContractKp (data) {
      addContractKp({ ...data, contractId: this.id })
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
    updateContractKp (data) {
      updateContractKp({ ...data, contractId: this.id, kpId: data.id })
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
        title: '删除开票',
        content: '确定删除吗？',
        icon: h => <a-icon theme="filled" type="exclamation-circle" />,
        onOk () {
          removeContractKp({
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
