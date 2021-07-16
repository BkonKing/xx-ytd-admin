<template>
  <a-modal
    title="新增入库"
    width="80%"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="validate"
    @cancel="handleCheckCancel"
  >
    <a-form-model
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{ lg: { span: 7 }, sm: { span: 7 } }"
      :wrapper-col="{ lg: { span: 10 }, sm: { span: 17 } }"
    >
      <a-form-model-item required prop="projectId" label="入库项目">
        <project-select v-model="form.projectId"></project-select>
      </a-form-model-item>
    </a-form-model>
    <div class="edit-table">
      <a-row class="edit-table-header" type="flex">
        <a-col flex="1">物料</a-col>
        <a-col flex="1">物料品牌</a-col>
        <a-col flex="1">规格型号</a-col>
        <a-col flex="200px">数量</a-col>
        <a-col flex="150px">备注</a-col>
        <a-col flex="60px">操作</a-col>
      </a-row>
      <a-form-model
        v-for="(record, index) in tableData"
        :key="index"
        :ref="`tableForm${index}`"
        :model="record"
        :rules="tableRules"
        class="edit-table-body"
      >
        <a-row type="flex">
          <a-col flex="1">
            <a-form-model-item prop="materialId" required>
              <a-row type="flex">
                <a-col
                  v-if="record.error"
                  flex="14px"
                  style="margin-right: 10px;"
                >
                  <a-icon
                    type="close-circle"
                    theme="filled"
                    style="color: red;"
                  />
                </a-col>
                <a-col flex="1">
                  <material-type-select
                    v-model="record.materialId"
                    :show-search="true"
                    @change="value => getUnit(value, index)"
                  ></material-type-select>
                </a-col>
              </a-row>
            </a-form-model-item>
          </a-col>
          <a-col flex="1">
            <a-form-model-item prop="brand" required>
              <a-input
                v-model="record.brand"
                placeholder="请输入"
                :maxLength="50"
                @change="changeError(index)"
              />
            </a-form-model-item>
          </a-col>
          <a-col flex="1">
            <a-form-model-item prop="model" required>
              <a-input
                v-model="record.model"
                placeholder="请输入"
                :maxLength="50"
                @change="changeError(index)"
              />
            </a-form-model-item>
          </a-col>
          <a-col flex="200px">
            <a-row type="flex">
              <a-col flex="50px">
                <a-form-model-item prop="unit">
                  <unit-select
                    v-model="record.unit"
                    :options="record.unitOptions"
                    :dropdownMatchSelectWidth="false"
                    style="width: 100%;"
                    @change="changeError(index)"
                  ></unit-select>
                </a-form-model-item>
              </a-col>
              <a-col flex="1">
                <a-form-model-item prop="originalNum" required>
                  <a-input-number
                    v-model="record.originalNum"
                    placeholder="请输入"
                    :min="0"
                    :maxLength="15"
                    @change="changeError(index)"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-col>
          <a-col flex="150px">
            <a-form-model-item prop="remarks">
              <a-input
                v-model="record.remarks"
                placeholder="请输入"
                @change="changeError(index)"
              />
            </a-form-model-item>
          </a-col>
          <a-col flex="60px">
            <span>
              <a-popconfirm title="是否要删除此行？" @confirm="remove(index)">
                <a>删除</a>
              </a-popconfirm>
            </span>
          </a-col>
        </a-row>
      </a-form-model>
      <a-row
        v-if="tableData && tableData.length"
        class="table-total"
        type="flex"
      >
        <a-col flex="3">总计</a-col>
        <a-col flex="200px">{{ totalNum }}</a-col>
        <a-col flex="160px"></a-col>
      </a-row>
      <a-button
        style="width: 100%; margin-top: 16px; margin-bottom: 8px"
        type="dashed"
        icon="plus"
        @click="handleAdd"
        >新增规格型号</a-button
      >
    </div>
  </a-modal>
</template>

<script>
import { ProjectSelect, MaterialTypeSelect, UnitSelect } from '@/components'
import { addStock } from '@/api/stock'
import { getMaterialUnit } from '@/api/common'
import NP from 'number-precision'
// import cloneDeep from 'lodash.clonedeep'

export default {
  name: 'AddModal',
  components: {
    ProjectSelect,
    MaterialTypeSelect,
    UnitSelect
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: this.value,
      confirmLoading: false,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      form: {
        projectId: ''
      },
      rules: {
        projectId: [{ required: true, message: '请选择' }]
      },
      tableRules: {
        materialId: [{ required: true, message: '请填写' }],
        brand: [{ required: true, message: '请填写' }],
        model: [{ required: true, message: '请填写' }],
        originalNum: [{ required: true, message: '请填写' }]
      },
      tableData: []
    }
  },
  computed: {
    totalNum () {
      let num = 0
      this.tableData.forEach(obj => {
        num = NP.plus(num, obj.originalNum)
      })
      return num
    }
  },
  created () {
  },
  methods: {
    getUnit (value, index) {
      getMaterialUnit({
        id: value
      }).then(({ data }) => {
        this.$set(this.tableData[index], 'unitOptions', data)
        this.$set(this.tableData[index], 'unit', data[0].unit)
      })
      this.changeError(index)
    },
    handleAdd () {
      this.tableData.push({
        materialId: '',
        brand: '',
        model: '',
        unit: '',
        unitOptions: [],
        originalNum: 0,
        remarks: ''
      })
    },
    remove (index) {
      this.tableData.splice(index, 1)
    },
    changeError (index) {
      if (this.tableData[index].error) {
        this.$set(this.tableData[index], 'error', false)
      }
    },
    handleSubmit (ref, data) {
      return new Promise((resolve, reject) => {
        ref.validate(valid => {
          if (valid) {
            resolve()
          } else {
            reject(new Error(false))
            return false
          }
        })
      })
    },
    validate () {
      this.loading = true
      const basic = this.handleSubmit(this.$refs.form)
      const material = this.tableData.map((data, index) => {
        const ref = this.$refs[`tableForm${index}`][0]
        return this.handleSubmit(ref)
      })

      if (!this.tableData || this.tableData.length === 0) {
        this.$message.error('请添加物料信息')
        this.loading = false
        return
      }

      Promise.all([basic, ...material])
        .then(() => {
          const params = {
            ...this.form,
            material: this.tableData
          }
          addStock(params)
            .then(() => {
              this.$message.success('提交成功')
              this.$emit('submit')
              this.visible = false
            })
            .catch(res => {
              res.date.forEach(key => {
                this.$set(this.tableData[key], 'error', true)
              })
            })
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    handleCheckCancel () {
      const that = this
      this.$confirm({
        title: '提示',
        content: '是否放弃当前信息关闭弹窗？',
        onOk () {
          that.visible = false
        }
      })
    }
  },
  watch: {
    visible (val) {
      this.$emit('input', val)
    },
    value (val) {
      if (val) {
        this.form.projectId = ''
        this.tableData = []
      }
      this.visible = val
    }
  }
}
</script>

<style lang="less" scoped>
.edit-table {
  &-header {
    background: #fafafa;
    border-bottom: 1px solid #e8e8e8;
    > .ant-col {
      padding: 16px;
    }
  }
  &-body {
    > .ant-row-flex {
      border-bottom: 1px solid #e8e8e8;
      > .ant-col {
        padding: 16px;
      }
    }
  }

  .ant-form-item {
    margin-bottom: 0;
  }
}
.table-total {
  .ant-col {
    padding: 6px 8px;
  }
}
</style>
