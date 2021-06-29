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
              <material-type-select
                v-model="record.materialId"
                :show-search="true"
              ></material-type-select>
            </a-form-model-item>
          </a-col>
          <a-col flex="1">
            <a-form-model-item prop="brand" required>
              <a-input
                v-model="record.brand"
                placeholder="请输入"
                :maxLength="50"
              />
            </a-form-model-item>
          </a-col>
          <a-col flex="1">
            <a-form-model-item prop="model" required>
              <a-input
                v-model="record.model"
                placeholder="请输入"
                :maxLength="50"
              />
            </a-form-model-item>
          </a-col>
          <a-col flex="200px">
            <a-row type="flex">
              <a-col flex="50px">
                <a-form-model-item prop="unit">
                  <a-select v-model="record.unit" style="width: 100%;">
                    <a-select-option
                      v-for="option in unitOptions"
                      :value="option.value"
                      :key="option.value"
                    >
                      {{ option.text }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col flex="1">
                <a-form-model-item prop="originalNum" required>
                  <a-input-number
                    v-model="record.originalNum"
                    placeholder="请输入"
                    :min="0"
                    :maxLength="15"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-col>
          <a-col flex="150px">
            <a-form-model-item prop="remarks">
              <a-input v-model="record.remarks" placeholder="请输入" />
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
import { ProjectSelect, MaterialTypeSelect } from '@/components'
import { addStock } from '@/api/stock'
import NP from 'number-precision'
// import cloneDeep from 'lodash.clonedeep'

export default {
  name: 'AddModal',
  components: {
    ProjectSelect,
    MaterialTypeSelect
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
      unitOptions: [
        {
          text: '件',
          value: '1'
        }
      ],
      tableRules: {
        materialId: [{ required: true, message: '必填' }],
        brand: [{ required: true, message: '必填' }],
        model: [{ required: true, message: '必填' }],
        originalNum: [{ required: true, message: '必填' }]
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
  methods: {
    handleAdd () {
      this.tableData.push({
        materialId: '',
        brand: '',
        model: '',
        unit: this.unitOptions[0].value,
        originalNum: '',
        remarks: ''
      })
    },
    remove (index) {
      this.tableData.splice(index, 1)
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

      Promise.all([basic, ...material])
        .then(() => {
          const params = {
            ...this.form,
            material: this.tableData
          }
          addStock(params).then(() => {
            this.$message.success('提交成功')
            this.$emit('submit')
            this.visible = false
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
