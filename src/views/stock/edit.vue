<template>
  <page-header-wrapper :title="title">
    <a-card title="基本信息" class="base-info-card" style="margin-top: 24px;">
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="{ lg: { span: 7 }, sm: { span: 7 } }"
        :wrapper-col="{ lg: { span: 10 }, sm: { span: 17 } }"
      >
        <a-form-model-item required prop="projectId" label="申请项目">
          <project-select
            v-model="form.projectId"
            @input="$refs.form.validateField('projectId')"
          ></project-select>
        </a-form-model-item>
        <a-form-model-item required prop="department" label="领料部门">
          <a-input v-model="form.department" :maxLength="20"></a-input>
        </a-form-model-item>
        <a-form-model-item required prop="stockMen" label="领料人">
          <a-input v-model="form.stockMen" :maxLength="15"></a-input>
        </a-form-model-item>
        <a-form-model-item required prop="clktime" label="出库日期">
          <a-date-picker
            v-model="form.clktime"
            :show-time="{defaultValue:moment('00:00:00','HH:mm:ss')}"
            placeholder="请选择"
            valueFormat="YYYY-MM-DD HH:mm:ss"
            style="width: 100%;"
          />
        </a-form-model-item>
        <a-form-model-item label="上传凭证" prop="stockPz">
          <upload-image v-model="form.stockPz" maxLength="10"></upload-image>
        </a-form-model-item>
      </a-form-model>
    </a-card>
    <a-card title="物料信息" style="margin-top: 24px;">
      <div class="edit-table">
        <a-row class="edit-table-header" type="flex">
          <a-col flex="2">物料</a-col>
          <a-col flex="320px">数量</a-col>
          <a-col flex="1">物料用途</a-col>
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
              <a-form-model-item prop="materialIdArr" required>
                <material-type-select
                  v-model="record.materialIdArr"
                  :projectId="form.projectId"
                  :ref="`material${index}`"
                  @change="value => handleChange(value, index)"
                  @input="
                    $refs[`tableForm${index}`][0].validateField('materialIdArr')
                  "
                ></material-type-select>
              </a-form-model-item>
            </a-col>
            <a-col flex="320px">
              <a-row type="flex">
                <a-col flex="90px">
                  <a-form-model-item prop="unit">
                    <a-select
                      v-model="record.unit"
                      style="width: 100%;"
                      :dropdownMatchSelectWidth="false"
                      @change="
                        value => {
                          unitChange(value, index);
                        }
                      "
                    >
                      <a-select-option
                        v-for="option in record.unitOptions"
                        :value="option.unit"
                        :key="option.unit"
                      >
                        {{ option.unitV }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col flex="1">
                  <a-form-model-item prop="stockNum" required>
                    <a-input-number
                      v-model="record.stockNum"
                      placeholder="请输入"
                      :min="0"
                      :max="parseFloat(record.currentNum)"
                      :maxLength="15"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col flex="100px">
                  <a-form-model-item style="color: #0000003F;">
                    库存
                    {{ record.currentNum }}
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-col>
            <a-col flex="1">
              <a-form-model-item prop="remarks">
                <a-input
                  v-model="record.remarks"
                  placeholder="请输入"
                  :maxLength="50"
                />
              </a-form-model-item>
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
              <a
                style="display: block;margin-top: 9px;line-height: 1;"
                @click="remove(index)"
                >删除</a
              >
            </a-col>
          </a-row>
        </a-form-model>
        <a-row
          v-if="tableData && tableData.length"
          class="table-total"
          type="flex"
          style="border-bottom: 1px solid #e8e8e8;"
        >
          <a-col flex="2">总计</a-col>
          <a-col flex="101px"></a-col>
          <a-col flex="219px">{{ totalNum }}</a-col>
          <a-col flex="1"></a-col>
          <a-col flex="160px"></a-col>
        </a-row>
        <a-button
          style="width: 100%; margin-top: 16px;"
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
import moment from 'moment'
import FooterToolBar from '@/components/FooterToolbar'
import NP from 'number-precision'
import { UploadImage, ProjectSelect } from '@/components'
import { appMixin } from '@/store/mixin'
import MaterialTypeSelect from './components/MaterialTypeSelect'
import {
  addStockCk,
  updateStockCk,
  getStockClkInfo,
  getAllProMatBanModelUnit
} from '@/api/stock'
export default {
  name: '',
  mixins: [appMixin],
  components: {
    FooterToolBar,
    UploadImage,
    ProjectSelect,
    MaterialTypeSelect
  },
  data () {
    return {
      id: '',
      title: '新增出库单',
      loading: false,
      NPPlus: NP.plus,
      form: {
        projectId: '',
        department: '',
        stockMen: '',
        clktime: '',
        stockPz: []
      },
      rules: {
        projectId: [{ required: true, message: '请填写' }],
        department: [{ required: true, message: '请填写' }],
        stockMen: [{ required: true, message: '请填写' }],
        clktime: [{ required: true, message: '请填写' }]
      },
      tableRules: {
        materialIdArr: [{ required: true, message: '请填写' }],
        stockNum: [{ required: true, message: '请填写' }]
        // stockNum: [{ required: true, message: '请填写' }],
      },
      tableData: [],
      reTableIndexs: [],
      moment
    }
  },
  computed: {
    totalNum () {
      let num = 0
      this.tableData.forEach(obj => {
        num = this.NPPlus(num, obj.stockNum)
      })
      return num
    }
  },
  mounted () {
    this.id = this.$route.query.id
    if (this.id) {
      this.title = '编辑出库单'
      this.getStockClkInfo()
    }
  },
  methods: {
    getStockClkInfo () {
      getStockClkInfo({
        id: this.id
      }).then(({ data }) => {
        data.clktime = data.cktime
        const { materia, ...form } = data
        this.form = form
        this.form.ckId = this.id
        this.tableData = materia.map(obj => {
          obj.materialIdArr = [obj.materialId, obj.brand, obj.model]
          return obj
        })
        this.tableData.forEach((obj, index) => {
          this.handleChange(obj.materialIdArr, index).then(() => {
            this.unitChange(obj.unit, index)
          })
        })
        this.$nextTick(() => {
          this.tableData.forEach((obj, index) => {
            this.$refs[`material${index}`][0].setOptions()
          })
        })
      })
    },
    handleAdd () {
      this.tableData.push({
        materialIdArr: [],
        remarks: '',
        unit: '',
        stockNum: 0,
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
    // 获取项目-物料-品牌-规格，对应的单位和库存
    handleChange (value, index) {
      // console.log(value)
      if (value && value.length < 3) {
        return
      }
      return getAllProMatBanModelUnit({
        projectId: this.form.projectId,
        materialId: value[0],
        brand: value[1],
        model: value[2]
      }).then(({ data }) => {
        // console.log(data)
        this.$set(this.tableData[index], 'unitOptions', data)
        this.$set(this.tableData[index], 'unit', data[0].unit)
        this.$set(this.tableData[index], 'currentNum', data[0].currentNum)
      })
    },
    changeDatePicker (date, dateString) {
      console.log(date)
    },
    unitChange (value, index) {
      const targetOption = this.tableData[index].unitOptions.find(
        obj => obj.unit === value
      )
      this.$set(this.tableData[index], 'currentNum', targetOption.currentNum)
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
            material: this.tableData.map(obj => {
              const arr = obj.materialIdArr
              obj.materialId = arr[0]
              obj.brand = arr[1]
              obj.model = arr[2]
              return obj
            })
          }
          // console.log(params)
          const api = this.id ? updateStockCk : addStockCk
          api(params).then(() => {
            this.$message.success('提交成功')
            this.$router.go(-1)
          }).catch((res) => {
            if (res.code === 202) {
              const text = res.date.map(index => index + 1)
              // this.reTableIndexs = res.date
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
.base-info-card {
  /deep/ .ant-card-body {
    padding-bottom: 3px;
  }
}
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
        padding: 6px 8px;
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
