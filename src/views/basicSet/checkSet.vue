<template>
  <div class="checkSet">
    <a-card>
      <a-form-model :label-col="labelCol" :wrapper-col="wrapperCol">
        <div class="title">订单审核</div>
        <a-form-model-item label="审核处理时间">
          <a-input v-model="orderCheck.auditHours" style="width:88px"></a-input>
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
                v-model="item.jibie"
                style="width:88px"
              ></a-input>
              <span style="padding:0 10px">--</span>
              <a-select
              v-model="item.level"
                mode="multiple"
                style="width:330px"
                placeholder="select one country"
                option-label-prop="label"
              >
                <a-select-option
                  v-for="(item, index) in checkPeoPleList"
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
        <a-form-model-item label="审核处理时间">
          <a-input
            v-model="contractCheck.auditHours"
            style="width:88px"
          ></a-input>
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
                v-model="item.jibie"
                style="width:88px"
              ></a-input>
              <span style="padding:0 10px">--</span>
          <a-select
              v-model="item.level"
                mode="multiple"
                style="width:330px"
                placeholder="select one country"
                option-label-prop="label"
              >
                <a-select-option
                  v-for="(item, index) in checkPeoPleList"
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
        <a-form-model-item label="审核处理时间">
          <a-input
            v-model="supplierCheck.auditHours"
            style="width:88px"
          ></a-input>
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
                v-model="item.jibie"
                style="width:88px"
              ></a-input>
              <span style="padding:0 10px">--</span>
              <a-select
              v-model="item.level"
                mode="multiple"
                style="width:330px"
                placeholder="select one country"
                option-label-prop="label"
              >
                <a-select-option
                  v-for="(item, index) in checkPeoPleList"
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
        <a-button type="primary" @click="save">保存</a-button>
      </div>
    </a-card>
  </div>
</template>

<script>
import { toSetCheckData, toGetAllAdminList, toUpdateSetData } from '@/api/basicSet'
export default {
  data () {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      orderCheck: {
        auditHours: 24,
        arr: []
      },
      contractCheck: {
        auditHours: 24,
        arr: []
      },
      supplierCheck: {
        auditHours: 24,
        arr: []
      },
      checkPeoPleList: []
    }
  },
  methods: {
    // 保存
    save () {
      // alert(1)
      const setData = []
      setData[0] = {}
      setData[0].auditType = 1
      setData[0].auditHours = this.orderCheck.auditHours
      this.orderCheck.arr.forEach(item => {
        console.log(item)
        if (item.jibie === '一级审核') {
          setData[0].oneLevel = item.level
        } else if (item.jibie === '二级审核') {
          setData[0].twoLevel = item.level
        } else if (item.jibie === '三级审核') {
          setData[0].threeLevel = item.level
        } else if (item.jibie === '四级审核') {
          setData[0].fourLevel = item.level
        } else {
          setData[0].fiveLevel = item.level
        }
      })

      setData[1] = {}
      setData[1].auditType = 2
      setData[1].auditHours = this.contractCheck.auditHours
      this.contractCheck.arr.forEach(item => {
        if (item.jibie === '一级审核') {
          setData[1].oneLevel = item.level
        } else if (item.jibie === '二级审核') {
          setData[1].twoLevel = item.level
        } else if (item.jibie === '三级审核') {
          setData[1].threeLevel = item.threeLevel
        } else if (item.jibie === '四级审核') {
          setData[1].fourLevel = item.level
        } else {
          setData[1].fiveLevel = item.level
        }
      })
      setData[2] = {}
      setData[2].auditType = 3
      setData[2].auditHours = this.supplierCheck.auditHours
      this.supplierCheck.arr.forEach(item => {
        if (item.jibie === '一级审核') {
          setData[2].oneLevel = item.level
        } else if (item.jibie === '二级审核') {
          setData[2].twoLevel = item.level
        } else if (item.jibie === '三级审核') {
          setData[2].threeLevel = item.level
        } else if (item.jibie === '四级审核') {
          setData[2].fourLevel = item.level
        } else {
          setData[2].fiveLevel = item.level
        }
      })
      toUpdateSetData({
        setData: setData
      }).then(res => {
        console.log(res)
      })
    },
    // 获取审批设置数据
    getData () {
      toSetCheckData().then(({ data }) => {
        console.log('获取审批数据', data)
        this.orderCheck.auditHours = data[0].auditHours
        data[0].oneLevel.length > 0 &&
          this.orderCheck.arr.push({
            id: Math.random() * 999,
            jibie: '一级审核',
            level: data[0].oneLevel.map(item => {
              return item.adminId
            })
          })
        data[0].twoLevel.length > 0 &&
          this.orderCheck.arr.push({
            id: Math.random() * 999,
            jibie: '二级审核',
            level: data[0].twoLevel
          })
        data[0].threeLevel.length > 0 &&
          this.orderCheck.arr.push({
            id: Math.random() * 999,
            jibie: '三级审核',
            level: data[0].threeLevel
          })
        data[0].fourLevel.length > 0 &&
          this.orderCheck.arr.push({
            id: Math.random() * 999,
            jibie: '四级审核',
            level: data[0].fourLevel
          })
        data[0].fiveLevel.length > 0 &&
          this.orderCheck.arr.push({
            id: Math.random() * 999,
            jibie: '五级审核',
            level: data[0].fiveLevel
          })
        this.contractCheck.auditHours = data[1].auditHours
        data[1].oneLevel.length > 0 &&
          this.contractCheck.arr.push({
            id: Math.random() * 999,
            jibie: '一级审核',
            level: data[1].oneLevel.map(item => {
              return item.adminId
            })
          })
        data[1].twoLevel.length > 0 &&
          this.contractCheck.arr.push({
            id: Math.random() * 999,
            jibie: '二级审核',
            level: data[1].twoLevel
          })
        data[1].threeLevel.length > 0 &&
          this.contractCheck.arr.push({
            id: Math.random() * 999,
            jibie: '三级审核',
            level: data[1].threeLevel
          })
        data[1].fourLevel.length > 0 &&
          this.contractCheck.arr.push({
            id: Math.random() * 999,
            jibie: '四级审核',
            level: data[1].fourLevel
          })
        data[1].fiveLevel.length > 0 &&
          this.contractCheck.arr.push({
            id: Math.random() * 999,
            jibie: '五级审核',
            level: data[1].fiveLevel
          })
        this.supplierCheck.auditHours = data[2].auditHours
        data[2].oneLevel.length > 0 &&
          this.supplierCheck.arr.push({
            id: Math.random() * 999,
            jibie: '一级审核',
            level: data[2].oneLevel.map(item => {
              return item.adminId
            })
          })
        data[2].twoLevel.length > 0 &&
          this.supplierCheck.arr.push({
            id: Math.random() * 999,
            jibie: '二级审核',
            level: data[2].twoLevel
          })
        data[2].threeLevel.length > 0 &&
          this.supplierCheck.arr.push({
            id: Math.random() * 999,
            jibie: '三级审核',
            level: data[2].threeLevel
          })
        data[2].fourLevel.length > 0 &&
          this.supplierCheck.arr.push({
            id: Math.random() * 999,
            jibie: '四级审核',
            level: data[2].fourLevel
          })
        data[2].fiveLevel.length > 0 &&
          this.supplierCheck.arr.push({
            id: Math.random() * 999,
            jibie: '五级审核',
            level: data[2].fiveLevel
          })
      })
    },
    // 增加审核人员
    add (item) {
      if (this[item].arr.length === 1) {
        this[item].arr.push({
          id: Math.random() * 999,
          jibie: '二级审核',
          name: ['china']
        })
      } else if (this[item].arr.length === 2) {
        this[item].arr.push({
          id: Math.random() * 999,
          jibie: '三级审核',
          name: ['china']
        })
      } else if (this[item].arr.length === 3) {
        this[item].arr.push({
          id: Math.random() * 999,
          jibie: '四级审核',
          name: ['china']
        })
      } else if (this[item].arr.length === 4) {
        this[item].arr.push({
          id: Math.random() * 999,
          jibie: '五级审核',
          name: ['china']
        })
      }
    },
    // 删除审核人员
    del (index, item) {
      if (this[item].arr.length === 1) {
        this[item].arr = [
          { id: Math.random() * 999, jibie: '一级审核', name: [] }
        ]
        return
      }
      this[item].arr.splice(index, 1)
      if (index === 0) {
        this[item].arr.forEach((item, index) => {
          if (index === 0) {
            item.jibie = '一级审核'
          } else if (index === 1) {
            item.jibie = '二级审核'
          } else if (index === 2) {
            item.jibie = '三级审核'
          } else if (index === 3) {
            item.jibie = '四级审核'
          }
        })
      } else if (index === 1) {
        this[item].arr.forEach((item, index) => {
          if (index === 0) {
            item.jibie = '一级审核'
          } else if (index === 1) {
            item.jibie = '二级审核'
          } else if (index === 2) {
            item.jibie = '三级审核'
          } else if (index === 3) {
            item.jibie = '四级审核'
          }
        })
      } else if (index === 2) {
        this[item].arr.forEach((item, index) => {
          if (index === 0) {
            item.jibie = '一级审核'
          } else if (index === 1) {
            item.jibie = '二级审核'
          } else if (index === 2) {
            item.jibie = '三级审核'
          } else if (index === 3) {
            item.jibie = '四级审核'
          }
        })
      } else if (index === 3) {
        this[item].arr.forEach((item, index) => {
          if (index === 0) {
            item.jibie = '一级审核'
          } else if (index === 1) {
            item.jibie = '二级审核'
          } else if (index === 2) {
            item.jibie = '三级审核'
          } else if (index === 3) {
            item.jibie = '四级审核'
          }
        })
      } else if (index === 4) {
        this[item].arr.forEach((item, index) => {
          if (index === 0) {
            item.jibie = '一级审核'
          } else if (index === 1) {
            item.jibie = '二级审核'
          } else if (index === 2) {
            item.jibie = '三级审核'
          } else if (index === 3) {
            item.jibie = '四级审核'
          }
        })
      }
    }
  },
  created () {
    this.getData()
    toGetAllAdminList().then(({ data }) => {
      this.checkPeoPleList = data
      console.log('获取审核人员', data)
    })
  }
}
</script>

<style lang="less" scoped>
.checkSet {
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
