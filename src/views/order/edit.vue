<template>
  <page-header-wrapper :title="title">
    <a-card title="基本信息" style="margin-top: 24px;">
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="{ lg: { span: 7 }, sm: { span: 7 } }"
        :wrapper-col="{ lg: { span: 10 }, sm: { span: 17 } }"
      >
        <a-form-model-item required prop="contractId" label="关联合同">
          <a-select
            v-model="form.contractId"
            @change="getSupplier"
            placeholder="请选择"
          >
            <a-select-option value="shanghai">
              Zone one
            </a-select-option>
            <a-select-option value="beijing">
              Zone two
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item v-if="form.contractId" label="供应商">
          {{ form.supplier }}
        </a-form-model-item>
        <a-form-model-item label="订单凭证">
          <upload-image v-model="form.orderPz" maxLength="10"></upload-image>
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <a-card title="物料信息" style="margin-top: 24px;">
      <div class="edit-table">
        <a-row class="edit-table-header" type="flex">
          <a-col flex="2">物料</a-col>
          <a-col flex="2">物料品牌</a-col>
          <a-col flex="2">规格型号</a-col>
          <a-col flex="180px">采购单价（元）</a-col>
          <a-col flex="180px">数量</a-col>
          <a-col flex="1">金额</a-col>
          <a-col flex="100px">排序</a-col>
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
            <a-col flex="2">
              <a-form-model-item prop="materialId" required>
                <a-select v-model="record.materialId">
                  <a-select-option
                    v-for="option in materialOptions"
                    :value="option.value"
                    :key="option.value"
                  >
                    {{ option.text }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col flex="2">
              <a-form-model-item prop="brand" required>
                <a-input
                  v-model="record.brand"
                  placeholder="请输入"
                  :maxLength="50"
                />
              </a-form-model-item>
            </a-col>
            <a-col flex="2">
              <a-form-model-item prop="model" required>
                <a-input
                  v-model="record.model"
                  placeholder="请输入"
                  :maxLength="50"
                />
              </a-form-model-item>
            </a-col>
            <a-col flex="180px">
              <a-row type="flex">
                <a-col flex="50px">
                  <a-form-model-item prop="taxRate" required>
                    <a-select
                      v-model="record.taxRate"
                      @change="handleTaxChange"
                      style="width: 100%;"
                    >
                      <a-select-option :value="1">
                        含税
                      </a-select-option>
                      <a-select-option :value="0">
                        不含税
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col flex="1">
                  <a-form-model-item prop="unitPrice" required>
                    <a-input
                      v-model="record.unitPrice"
                      placeholder="请输入"
                      :maxLength="15"
                      v-number-input
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-col>
            <a-col flex="180px">
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
                  <a-form-model-item prop="total" required>
                    <a-input-number
                      v-model="record.total"
                      placeholder="请输入"
                      :min="0"
                      :maxLength="15"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-col>
            <a-col flex="1">
              <span>{{NPTimes(record.unitPrice, record.total)}}</span>
            </a-col>
            <a-col flex="100px">
              <a-form-model-item prop="listOrder">
                <a-input
                  v-model="record.listOrder"
                  placeholder="请输入"
                  @blur="changeSort"
                  v-number-input.int
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
        <div>总计 100 ￥10,000.00</div>
        <a-button
          style="width: 100%; margin-top: 16px; margin-bottom: 8px"
          type="dashed"
          icon="plus"
          @click="handleAdd"
          >新增成员</a-button
        >
      </div>
    </a-card>
    <footer-tool-bar :is-mobile="isMobile" :collapsed="sideCollapsed">
      <a-button type="primary" @click="validate" :loading="loading"
        >提交</a-button
      >
    </footer-tool-bar>
  </page-header-wrapper>
</template>

<script>
import FooterToolBar from '@/components/FooterToolbar'
import NP from 'number-precision'
import { UploadImage } from '@/components'
import { appMixin } from '@/store/mixin'
import { addOrder, updateOrder } from '@/api/order'
export default {
  name: '',
  mixins: [appMixin],
  components: {
    FooterToolBar,
    UploadImage
  },
  data () {
    return {
      id: '',
      title: '新增订单',
      loading: false,
      NPTimes: NP.times,
      form: {
        contractId: '',
        supplier: '',
        orderPz: []
      },
      materialOptions: [
        {
          text: '111',
          value: '1'
        }
      ],
      unitOptions: [
        {
          text: '件',
          value: '1'
        }
      ],
      rules: {
        contractId: [{ required: true, message: '必填' }]
      },
      tableRules: {
        materialId: [{ required: true, message: '必填' }],
        brand: [{ required: true, message: '必填' }],
        model: [{ required: true, message: '必填' }],
        unitPrice: [{ required: true, message: '必填' }],
        total: [{ required: true, message: '必填' }]
      },
      tableData: [
        {
          materialId: '',
          brand: '',
          model: '',
          taxRate: 1,
          unitPrice: '',
          unit: '',
          total: '',
          listOrder: ''
        }
      ]
    }
  },
  created () {
    this.id = this.$route.query.id
    if (this.id) {
      this.title = '编辑订单'
      this.getCont()
    }
  },
  methods: {
    getData () {
      this.form.id = ''
      this.tableData = []
    },
    getSupplier () {
      this.form.supplier = '供应商名称'
    },
    handleAdd () {
      this.tableData.push({
        materialId: '',
        brand: '',
        model: '',
        taxRate: this.tableData[0].taxRate || 1,
        unitPrice: '',
        unit: this.unitOptions[0].value,
        total: '',
        listOrder: ''
      })
    },
    // 是否含税
    handleTaxChange (value) {
      this.tableData.forEach(obj => {
        obj.taxRate = value
      })
    },
    // 排序实时更改
    changeSort () {
      this.$nextTick(() => {
        this.tableData.sort((current, last) => {
          if (!last.listOrder && !current.listOrder) {
            return 0
          }
          if (!last.listOrder) {
            return -1
          }
          if (!current.listOrder) {
            return 1
          }
          if (parseInt(current.listOrder) < parseInt(last.listOrder)) {
            return 1
          } else if (parseInt(current.listOrder) === parseInt(last.listOrder)) {
          } else {
            return -1
          }
        })
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
          const api = this.id ? updateOrder : addOrder
          api(params).then(() => {
            this.$message.success('提交成功')
            this.$router.go(-1)
          })
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
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
    > .ant-row-flex > .ant-col {
      padding: 16px;
    }
  }

  .ant-form-item {
    margin-bottom: 0;
  }
}
</style>
