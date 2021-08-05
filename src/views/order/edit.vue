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
          <contract-select
            v-model="form.contractId"
            @change="getSupplier"
          ></contract-select>
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
          <a-col class="form-required-after" flex="1">物料</a-col>
          <a-col class="form-required-after" flex="1">物料品牌</a-col>
          <a-col class="form-required-after" flex="1">规格型号</a-col>
          <a-col class="form-required-after" flex="110px">税率</a-col>
          <a-col class="form-required-after" flex="120px">采购单价(元)</a-col>
          <a-col class="form-required-after" flex="180px">数量</a-col>
          <a-col flex="1">金额</a-col>
          <a-col flex="78px">排序</a-col>
          <a-col flex="50px">操作</a-col>
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
            <a-col flex="1" style="width: 0">
              <a-form-model-item prop="materialId" required>
                <material-type-select
                  v-model="record.materialId"
                  :show-search="true"
                  @change="value => getUnit(value, index)"
                ></material-type-select>
              </a-form-model-item>
            </a-col>
            <a-col flex="1">
              <a-form-model-item prop="brand" required>
                <a-input
                  v-model="record.brand"
                  placeholder="请输入"
                  :maxLength="50"
                  style="width: 100%;"
                />
              </a-form-model-item>
            </a-col>
            <a-col flex="1">
              <a-form-model-item prop="model" required>
                <a-input
                  v-model="record.model"
                  placeholder="请输入"
                  :maxLength="50"
                  style="width: 100%;"
                />
              </a-form-model-item>
            </a-col>
            <a-col flex="110px">
              <a-form-model-item prop="taxRate" required>
                <a-input
                  v-model="record.taxRate"
                  v-number-input="{ decimal: 2, min: 0, max: 100 }"
                  placeholder="请输入"
                  suffix="%"
                  :disabled="isDisabled"
                />
              </a-form-model-item>
            </a-col>
            <a-col flex="120px">
              <a-form-model-item prop="unitPrice" required>
                <a-input
                  v-model="record.unitPrice"
                  v-number-input
                  placeholder="请输入"
                  prefix="￥"
                  :maxLength="15"
                  :disabled="isDisabled"
                />
              </a-form-model-item>
            </a-col>
            <a-col flex="180px">
              <a-row type="flex">
                <a-col flex="80px">
                  <a-form-model-item prop="unit">
                    <unit-select
                      v-model="record.unit"
                      :options="record.unitOptions"
                      :dropdownMatchSelectWidth="false"
                      style="width: 100%;"
                    ></unit-select>
                  </a-form-model-item>
                </a-col>
                <a-col flex="1">
                  <a-form-model-item prop="total" required>
                    <a-input
                      v-model="record.total"
                      v-number-input="{min:0}"
                      placeholder="请输入"
                      :disabled="isDisabled"
                      style="width: 100%;"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-col>
            <a-col flex="1">
              <span class="td-block" style="word-break: break-all;"
                >￥{{
                  NPTimes(
                    record.unitPrice,
                    parseFloat(record.total) || 0
                  ).toFixed(2)
                }}</span
              >
            </a-col>
            <a-col flex="78px">
              <a-form-model-item prop="listOrder">
                <a-input
                  v-model="record.listOrder"
                  placeholder="请输入"
                  @blur="changeSort"
                  v-number-input.int
                />
              </a-form-model-item>
            </a-col>
            <a-col flex="50px">
              <a class="td-block" @click="remove(index)">删除</a>
            </a-col>
          </a-row>
        </a-form-model>
        <a-row
          v-if="tableData && tableData.length"
          class="table-total"
          type="flex"
        >
          <a-col flex="1">总计</a-col>
          <a-col flex="1"></a-col>
          <a-col flex="1"></a-col>
          <a-col flex="230px"></a-col>
          <a-col flex="180px" style="padding-left: 100px;">{{ totalNum }}</a-col>
          <a-col flex="1" style="word-break: break-all;"
            >￥{{ totalMoney }}</a-col
          >
          <a-col flex="128px"></a-col>
        </a-row>
        <a-button
          style="width: 100%; margin-top: 16px; margin-bottom: 8px"
          type="dashed"
          icon="plus"
          @click="handleAdd"
          >新增物料</a-button
        >
      </div>
    </a-card>
    <footer-tool-bar :is-mobile="isMobile" :collapsed="sideCollapsed">
      <a-button @click="$router.go(-1)" style="margin-right: 15px;">
        取消
      </a-button>
      <a-button type="primary" @click="validate" :loading="loading"
        >提交</a-button
      >
    </footer-tool-bar>
  </page-header-wrapper>
</template>

<script>
import FooterToolBar from '@/components/FooterToolbar'
import NP from 'number-precision'
import {
  UploadImage,
  ContractSelect,
  MaterialTypeSelect,
  UnitSelect
} from '@/components'
import { appMixin } from '@/store/mixin'
import { getMaterialUnit } from '@/api/common'
import { addOrder, updateOrder, getOrderInfo } from '@/api/order'
import { getAllots } from '@/api/user'
export default {
  name: '',
  mixins: [appMixin],
  components: {
    FooterToolBar,
    UploadImage,
    ContractSelect,
    MaterialTypeSelect,
    UnitSelect
  },
  data () {
    return {
      id: '',
      UpdatePermission: 0,
      title: '新增订单',
      loading: false,
      NPTimes: NP.times,
      NPPlus: NP.plus,
      form: {
        contractId: '',
        supplier: '',
        orderPz: []
      },
      rules: {
        contractId: [{ required: true, message: '请选择关联合同' }]
      },
      tableRules: {
        materialId: [{ required: true, message: '请填写' }],
        brand: [{ required: true, message: '请填写' }],
        model: [{ required: true, message: '请填写' }],
        taxRate: [{ required: true, message: '请填写' }],
        unitPrice: [{ required: true, message: '请填写' }],
        unit: [{ required: true, message: '请选择' }],
        total: [{ required: true, message: '请填写' }]
      },
      tableData: []
    }
  },
  computed: {
    totalMoney () {
      let num = 0
      this.tableData.forEach(obj => {
        num += this.NPTimes(obj.unitPrice, obj.total)
      })
      return num.toFixed(2)
    },
    totalNum () {
      let num = 0
      this.tableData.forEach(obj => {
        num = this.NPPlus(num, obj.total)
      })
      return num
    },
    isDisabled () {
      return this.UpdatePermission !== 1 && this.form.status === '1'
    }
  },
  mounted () {
    this.id = this.$route.query.id
    if (this.id) {
      this.title = '编辑订单'
      this.getOrderInfo()
      this.getAllots()
    }
  },
  methods: {
    getOrderInfo () {
      getOrderInfo({
        id: this.id
      }).then(({ data }) => {
        this.form.id = this.id
        this.form.contractId = data.contractId
        this.form.status = data.status
        this.form.orderPz = data.orderPz
        this.form.supplier = data.supplierName
        this.tableData = data.material
        this.tableData.forEach((obj, index) => {
          this.getUnit(obj.materialId, index, obj.unit)
        })
      })
    },
    // 获取编辑权限
    getAllots () {
      getAllots({
        limitsPath: '/order/index'
      }).then(({ data }) => {
        this.UpdatePermission = data.UpdatePermission
      })
    },
    getSupplier (value, option) {
      this.form.supplier = option.supplierName
    },
    getUnit (value, index, unit) {
      getMaterialUnit({
        id: value
      }).then(({ data }) => {
        this.$set(this.tableData[index], 'unitOptions', data)
        this.$set(
          this.tableData[index],
          'unit',
          unit || (data[0] && data[0].unit) || ''
        )
      })
    },
    handleAdd () {
      this.tableData.push({
        materialId: '',
        brand: '',
        model: '',
        taxRate: '',
        unitPrice: '',
        unit: '',
        unitOptions: [],
        total: '',
        listOrder: ''
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
          const api = this.id ? updateOrder : addOrder
          api(params).then(({ id }) => {
            this.$message.success('提交成功')
            this.$router.replace({
              name: 'OrderDetail',
              query: {
                id: this.id || id
              }
            })
          }).catch((res) => {
            if (res.code === 202) {
              const text = res.data.map(index => index + 1)
              this.$message.warning(`物料第${text.join('，')}条重复创建，请合并为一行`)
            } else {
              this.$message.error(res.message)
            }
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
      padding: 12px 4px 12px 8px;
    }
  }
  &-body {
    > .ant-row-flex {
      border-bottom: 1px solid #e8e8e8;
      > .ant-col {
        padding: 6px 4px 6px 8px;
      }
    }
  }

  .ant-form-item {
    margin-bottom: 0;
  }
}
.table-total {
  font-weight: bold;
  .ant-col {
    padding: 6px 8px;
  }
}

.td-block {
  display: block;
  margin-top: 9px;
  line-height: 1;
}
</style>
