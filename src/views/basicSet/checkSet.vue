<template>
  <div class="checkSet">
    <a-card>
      <a-form-model
        ref="form"
        :model="form"
        :label-col="labelCol"
        :rules="rules"
        :wrapper-col="wrapperCol"
      >
        <div class="title">订单审核</div>
        <a-form-model-item label="审核处理时间" prop="auditHours1">
          <a-input v-model="form.auditHours1" style="width:88px"></a-input>
          <span style="marginLeft:10px">小时内</span>
          <div>需要在设定时间内进行审核处理，超时则提醒</div>
        </a-form-model-item>
        <a-form-model-item label="审核人员">
          <div>同一级审核，多人时，任意一人同意即可</div>
          <div class="checkInputs">
            <div
              class="item"
              v-for="(item, index) in orderCheck.arr"
              :key="index"
            >
              <a-input
                :disabled="true"
                :defaultValue="index | jibie"
                style="width:88px"
              ></a-input>
              <span style="padding:0 10px">--</span>
              <a-select
                v-model="item.level"
                mode="multiple"
                style="width:330px"
                placeholder="请选择"
                option-label-prop="label"
              >
                <a-select-option
                  v-for="(item, i) in orderPeopleObj[index]"
                  :key="i"
                  :value="item.id"
                  :label="item.realName"
                >
                  {{ item.realName }}
                </a-select-option>
              </a-select>
              <a-icon
                type="minus-circle"
                class="icon"
                @click="del(index, 'orderCheck')"
              />
            </div>
          </div>
          <div
            class="addArea"
            @click="add('orderCheck')"
            v-if="orderCheck.arr.length < 5"
          >
            +添加
          </div>
        </a-form-model-item>
        <div class="title">合同审核</div>
        <a-form-model-item label="审核处理时间" prop="auditHours2">
          <a-input v-model="form.auditHours2" style="width:88px"></a-input>
          <span style="marginLeft:10px">小时内</span>
          <div>需要在设定时间内进行审核处理，超时则提醒</div>
        </a-form-model-item>
        <a-form-model-item label="审核人员">
          <div>同一级审核，多人时，任意一人同意即可</div>
          <div class="checkInputs">
            <div
              class="item"
              v-for="(item, index) in contractCheck.arr"
              :key="index"
            >
              <a-input
                :disabled="true"
                :defaultValue="index | jibie"
                style="width:88px"
              ></a-input>
              <span style="padding:0 10px">--</span>
              <a-select
                v-model="item.level"
                mode="multiple"
                style="width:330px"
                placeholder="请选择"
                option-label-prop="label"
              >
                <a-select-option
                  v-for="(item, index) in contractPeoPleObj[index]"
                  :key="index"
                  :value="item.id"
                  :label="item.realName"
                >
                  {{ item.realName }}
                </a-select-option>
              </a-select>
              <a-icon
                type="minus-circle"
                class="icon"
                @click="del(index, 'contractCheck')"
              />
            </div>
          </div>
          <div
            class="addArea"
            @click="add('contractCheck')"
            v-if="contractCheck.arr.length < 5"
          >
            +添加
          </div>
        </a-form-model-item>
        <div class="title">供应商审核</div>
        <a-form-model-item label="审核处理时间" prop="auditHours3">
          <a-input v-model="form.auditHours3" style="width:88px"></a-input>
          <span style="marginLeft:10px">小时内</span>
          <div>需要在设定时间内进行审核处理，超时则提醒</div>
        </a-form-model-item>
        <a-form-model-item label="审核人员">
          <div>同一级审核，多人时，任意一人同意即可</div>
          <div class="checkInputs">
            <div
              class="item"
              v-for="(item, index) in supplierCheck.arr"
              :key="index"
            >
              <a-input
                :disabled="true"
                :defaultValue="index | jibie"
                style="width:88px"
              ></a-input>
              <span style="padding:0 10px">--</span>
              <a-select
                v-model="item.level"
                mode="multiple"
                style="width:330px"
                placeholder="请选择"
                option-label-prop="label"
              >
                <a-select-option
                  v-for="(item, i) in supplierPeoPleObj[index]"
                  :key="i"
                  :value="item.id"
                  :label="item.realName"
                >
                  {{ item.realName }}
                </a-select-option>
              </a-select>
              <a-icon
                type="minus-circle"
                class="icon"
                @click="del(index, 'supplierCheck')"
              />
            </div>
          </div>
          <div
            class="addArea"
            @click="add('supplierCheck')"
            v-if="supplierCheck.arr.length < 5"
          >
            +添加
          </div>
        </a-form-model-item>
      </a-form-model>
      <div class="btn">
        <a-button type="primary" @click="save" :disabled="bol">保存</a-button>
      </div>
    </a-card>
  </div>
</template>

<script>
import {
  toSetCheckData,
  toGetAllAuditAdminList,
  toUpdateSetData
} from '@/api/basicSet'

const LevelKey = [
  'oneLevel',
  'twoLevel',
  'threeLevel',
  'fourLevel',
  'fiveLevel'
]
export default {
  data () {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        auditHours1: 24,
        auditHours2: 24,
        auditHours3: 24
      },
      rules: {
        auditHours1: [{ required: true, message: '请填写', trigger: 'change' }],
        auditHours2: [{ required: true, message: '请填写', trigger: 'change' }],
        auditHours3: [{ required: true, message: '请填写', trigger: 'change' }]
      },
      orderCheck: {
        arr: [
          {
            id: Math.random() * 999,
            level: []
          }
        ]
      },
      contractCheck: {
        arr: [
          {
            id: Math.random() * 999,
            level: []
          }
        ]
      },
      supplierCheck: {
        arr: [
          {
            id: Math.random() * 999,
            level: []
          }
        ]
      },
      checkPeoPleList: [],
      bol: true,
      orderPeoPleList: [], // 订单审核人员
      contractPeoPleList: [], // 合同审核人员
      supplierPeoPleList: [] // 供应商审核人员
    }
  },
  watch: {
    orderCheck: {
      handler () {
        this.bol = false
      },
      deep: true
    },
    contractCheck: {
      handler () {
        this.bol = false
      },
      deep: true
    },
    supplierCheck: {
      handler () {
        this.bol = false
      },
      deep: true
    },
    form: {
      handler () {
        this.bol = false
      },
      deep: true
    }
  },
  computed: {
    orderPeopleObj () {
      const options = this.orderPeoPleList
      const checkOptions = this.orderCheck.arr
      return this.filterAdmin(checkOptions, options)
    },
    contractPeoPleObj () {
      const options = this.contractPeoPleList
      const checkOptions = this.contractCheck.arr
      return this.filterAdmin(checkOptions, options)
    },
    supplierPeoPleObj () {
      const options = this.supplierPeoPleList
      const checkOptions = this.supplierCheck.arr
      return this.filterAdmin(checkOptions, options)
    }
  },
  methods: {
    // 获取订单审核人员
    getOrderCheck () {
      toGetAllAuditAdminList({ auditType: 1 }).then(({ data }) => {
        this.orderPeoPleList = data
        console.log('获取订单人员', data)
      })
    },
    // 获取合同审核人员
    getContractCheck () {
      toGetAllAuditAdminList({ auditType: 2 }).then(({ data }) => {
        this.contractPeoPleList = data
        console.log('获取合同人员', data)
      })
    },
    // 获取供应商审核人员
    getSupplierCheck () {
      toGetAllAuditAdminList({ auditType: 3 }).then(({ data }) => {
        this.supplierPeoPleList = data
        console.log('获取供应商人员', data)
      })
    },
    // 保存
    save () {
      this.$refs.form.validate(result => {
        if (result) {
          const setData = []
          setData[0] = {}
          setData[0].auditType = 1
          setData[0].auditHours = this.form.auditHours1
          const setData0 = this.convertData(this.orderCheck.arr)
          Object.assign(setData[0], setData0)

          setData[1] = {}
          setData[1].auditType = 2
          setData[1].auditHours = this.form.auditHours2
          const setData1 = this.convertData(this.contractCheck.arr)
          Object.assign(setData[1], setData1)

          setData[2] = {}
          setData[2].auditType = 3
          setData[2].auditHours = this.form.auditHours3
          const setData2 = this.convertData(this.supplierCheck.arr)
          Object.assign(setData[2], setData2)

          toUpdateSetData({
            setData: setData
          }).then(res => {
            this.$message.success(res.message)
            this.$nextTick(() => {
              this.bol = true
            })
          })
        } else {
          return false
        }
      })
    },
    // 保存前用户信息数据转换
    convertData (data) {
      const setData = {}
      data.forEach((item, index) => {
        setData[LevelKey[index]] = item.level.length > 0 && item.level.join(',')
      })
      return setData
    },
    // 获取审批设置数据
    getData () {
      toSetCheckData().then(({ data }) => {
        data[0].oneLevel.length > 0 && (this.orderCheck.arr = [])
        data[1].oneLevel.length > 0 && (this.contractCheck.arr = [])
        data[2].oneLevel.length > 0 && (this.supplierCheck.arr = [])
        console.log('获取审批数据', data)

        this.form.auditHours1 = data[0].auditHours
        this.setCheckData(data[0], this.orderCheck.arr)

        this.form.auditHours2 = data[1].auditHours
        this.setCheckData(data[1], this.contractCheck.arr)

        this.form.auditHours3 = data[2].auditHours
        this.setCheckData(data[2], this.supplierCheck.arr)

        this.$nextTick(() => {
          this.bol = true
        })
      })
    },
    // 设置审批数据
    setCheckData (data, arr) {
      LevelKey.forEach((key, index) => {
        data[key].length > 0 &&
          arr.push({
            id: Math.random() * 999,
            level: data[key].map(item => {
              return item.adminId
            })
          })
      })
    },
    // 过滤已经选择过的人员
    filterAdmin (checkOptions, options) {
      const arr = []
      checkOptions.forEach((item, index) => {
        const otherAdmin = []
        checkOptions.forEach((level, i) => {
          if (index !== i) {
            otherAdmin.push(...level.level)
          }
        })
        const newOrderP = options.filter((peo) => {
          return !otherAdmin.includes(peo.id)
        })
        arr.push(newOrderP)
      })
      return arr
    },
    // 增加审核人员
    add (item) {
      this[item].arr.push({
        id: Math.random() * 999,
        level: []
      })
    },
    // 删除审核人员
    del (index, item) {
      if (this[item].arr.length === 1) {
        this[item].arr = [{ id: Math.random() * 999, level: [] }]
        return
      }
      this[item].arr.splice(index, 1)
    }
  },
  filters: {
    jibie (index) {
      let jibie = '一级审核'
      switch (index) {
        case 1:
          jibie = '二级审核'
          break
        case 2:
          jibie = '三级审核'
          break
        case 3:
          jibie = '四级审核'
          break
        case 4:
          jibie = '五级审核'
          break
      }
      return jibie
    }
  },
  created () {
    this.getData()
    this.getOrderCheck()
    this.getContractCheck()
    this.getSupplierCheck()
  }
}
</script>

<style lang="less" scoped>
.checkSet {
  /deep/ .ant-form-item {
    margin-bottom: 14px;
  }
  .title {
    margin-left: 150px;
    font-family: "PingFang SC Bold", "PingFang SC";
    font-weight: 650;
    font-style: normal;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.847);
    line-height: 24px;
    margin-bottom: 24px;
  }
  .checkInputs {
    .item {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      .icon {
        margin-left: 10px;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.427450980392157);
      }
    }
  }
  .addArea {
    cursor: pointer;
    width: 450px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border: 1px dashed #e9e9e9;
  }
  .btn {
    margin-left: 268px;
  }
}
</style>
