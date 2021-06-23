<template>
  <a-card :bordered="false" title="付款信息" style="margin-top: 24px;">
    <s-table ref="table" size="default" :columns="columns" :data="loadData">
      <span slot="actions" slot-scope="text, recode">
        <a-button type="link" @click="OpenEdit(recode)">编辑</a-button>
        <a-button type="link" @click="handleRemove(recode)">删除</a-button>
      </span>
      <template slot="footer">
        总计 100 ￥10,000.00
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
      @ok="handleOkProject"
      @cancel="closeModal"
    >
      <payment-edit-form
        ref="PaymentForm"
        :company-list="companyList"
        :stage-list="projectStageList"
      ></payment-edit-form>
    </a-modal>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import PaymentEditForm from './PaymentEditForm'
import cloneDeep from 'lodash.clonedeep'
import moment from 'moment'
import { getPermissions } from '@/api/manage'
import {
  addProject,
  updateProject,
  removeProject
} from '@/api/project'
export default {
  name: 'PaymentTable',
  components: {
    STable,
    PaymentEditForm
  },
  props: {
    type: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      columns: [
        {
          title: '序号',
          dataIndex: 'name',
          key: 'name',
          width: '150px'
        },
        {
          title: '付款时间',
          dataIndex: 'name11',
          key: 'name',
          width: '150px'
        },
        {
          title: '付款ID',
          dataIndex: 'workId',
          key: 'workId',
          width: '20%'
        },
        {
          title: '付款方式',
          dataIndex: 'department',
          key: 'department',
          width: '20%'
        },
        {
          title: '付款金额',
          dataIndex: 'number',
          key: 'number',
          width: '20%'
        },
        {
          title: '付款凭证',
          dataIndex: 'money',
          key: 'money',
          width: '10%'
        },
        {
          title: '开票情况',
          dataIndex: 'money1',
          key: 'money',
          width: '10%'
        },
        {
          title: '创建时间',
          dataIndex: 'money2',
          key: 'money',
          width: '10%'
        },
        {
          title: '操作',
          dataIndex: 'no333',
          width: '100px',
          scopedSlots: { customRender: 'actins' }
        }
      ],
      loadData: parameter => {
        return getPermissions({
          params: Object.assign(parameter, this.queryParam)
        }).then(res => {
          return res.result
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
        // const data = cloneDeep(obj)
        this.$refs.PaymentForm.setFieldsValue(obj)
      })
    },
    showModal () {
      this.visible = true
    },
    handleOkProject (e) {
      this.$refs.PaymentForm.handleSubmit().then(res => {
        this.confirmLoading = true
        const data = cloneDeep(res)
        if (data.id) {
          this.updateProject(data)
        } else {
          this.addProject(data)
        }
      })
    },
    addProject (data) {
      addProject(data)
        .then(({ success }) => {
          if (success) {
            this.$message.success('添加项目成功')
            this.getProjectList()
            this.visible = false
          }
        })
        .finally(() => {
          this.confirmLoading = false
        })
    },
    updateProject (data) {
      updateProject(data)
        .then(({ success }) => {
          if (success) {
            this.$message.success('修改项目成功')
            this.getProjectList()
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
        content: '是否删除该项目？',
        onOk () {
          removeProject({
            id
          }).then(({ data }) => {
            that.$message.success('删除项目成功')
            that.getProjectList()
          })
        }
      })
    }
  }
}
</script>

<style></style>
