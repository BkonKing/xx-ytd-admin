<template>
  <a-card class="card">
    <a-form-model
      :model="form"
      ref="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="结算方式" required>
        <div class="box">
          <div
            class="item"
            v-for="(item, index) in form.settleTypeList"
            :key="item.id"
          >
            <a-form-model-item
              :prop="'settleTypeList.' + index + '.categoryName'"
              :rules="{
                required: true,
                message: '必填',
                trigger: 'change'
              }"
            >
              <a-input
                v-model="item.categoryName"
                placeholder="必填"
              ></a-input>
            </a-form-model-item>
            <a-form-model-item
              :prop="'settleTypeList.' + index + '.listOrder'"
              :rules="{
                required: true,
                message: '必填',
                trigger: 'change'
              }"
            >
              <a-input v-model="item.listOrder" placeholder="排序"></a-input>
            </a-form-model-item>
            <a-icon
              type="minus-circle"
              class="circle"
              @click="removeApiData(item.id, index)"
            />
          </div>
          <div class="item2" v-for="(item, index) in arr1" :key="item.id">
            <a-input
              v-model="item.categoryName"
              placeholder="结算方式"
            ></a-input>
            <a-input v-model="item.listOrder" placeholder="排序"></a-input>
            <a-icon
              type="minus-circle"
              class="circle"
              @click="remove1(index)"
            />
          </div>
        </div>
        <div class="addArea" @click="add1">
          + 添加
        </div>
      </a-form-model-item>
      <a-form-model-item label="付款方式" required>
        <div class="box">
          <div
            class="item"
            v-for="(item, index) in form.payTypeList"
            :key="item.id"
          >
             <a-form-model-item
              :prop="'payTypeList.' + index + '.categoryName'"
              :rules="{
                required: true,
                message: '必填',
                trigger: 'change'
              }"
            >
            <a-input
              v-model="item.categoryName"
              placeholder="结算方式"
            ></a-input>
             </a-form-model-item>
               <a-form-model-item
              :prop="'payTypeList.' + index + '.listOrder'"
              :rules="{
                required: true,
                message: '必填',
                trigger: 'change'
              }"
            >
            <a-input v-model="item.listOrder" placeholder="排序"></a-input>
               </a-form-model-item>
            <a-icon
              type="minus-circle"
              class="circle"
              @click="removeApiData2(item.id, index)"
            />
          </div>
          <div class="item2" v-for="item in arr2" :key="item.id">
            <a-input
              v-model="item.categoryName"
              placeholder="结算方式"
            ></a-input>
            <a-input v-model="item.listOrder" placeholder="排序"></a-input>
            <a-icon type="minus-circle" class="circle" @click="remove2" />
          </div>
        </div>
        <div class="addArea" @click="add2">
          + 添加
        </div>
      </a-form-model-item>
    </a-form-model>
    <div class="btn">
      <a-button type="primary" @click="save" :disabled="bol">保存</a-button>
    </div>
  </a-card>
</template>

<script>
import {
  toSettleType,
  toUpdateBatchSettleType,
  toRemoveBatchSettleType,
  toPayType,
  toUpdateBatchPayType,
  toRemoveBatchPayType
} from '@/api/basicSet'
export default {
  data () {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        settleTypeList: [],
        payTypeList: []
      },

      arr1: [],
      idApiArr: [],

      arr2: [],
      idApiArr2: [],
      bol: true
    }
  },
  watch: {
    form: {
      handler () {
        this.bol = false
      },
      deep: true
    },
    payTypeList: {
      handler () {
        this.bol = false
      },
      deep: true
    },
    arr1: {
      handler () {
        this.bol = false
      },
      deep: true
    },
    arr2: {
      handler () {
        this.bol = false
      },
      deep: true
    }
  },
  methods: {
    // 获取支付数据
    getPayTypeData () {
      toPayType().then(({ data }) => {
        this.form.payTypeList = data
        this.$nextTick(() => {
          this.bol = true
        })
        console.log('获取支付数据', data)
      })
    },
    // 删除接口返回的数据
    removeApiData (id, index) {
      this.idApiArr.push(id)
      if (this.form.settleTypeList.length === 1) {
        this.form.settleTypeList = [
          { id: 0, categoryName: '', listOrder: '', parentId: 0 }
        ]
        return
      }

      this.form.settleTypeList.splice(index, 1)
    },
    removeApiData2 (id, index) {
      this.idApiArr2.push(id)
      if (this.form.payTypeList.length === 1) {
        this.form.payTypeList = [
          { id: 0, categoryName: '', listOrder: '', parentId: 0 }
        ]
        return
      }

      this.form.payTypeList.splice(index, 1)
    },
    remove1 (index) {
      this.arr1.splice(index, 1)
    },
    remove2 (index) {
      this.arr2.splice(index, 1)
    },
    // 保存
    save () {
      this.$refs.form.validate(result => {
        if (result) {
          if (this.idApiArr.length > 0) {
            toRemoveBatchSettleType({ ids: this.idApiArr })
            this.idApiArr = []
          }
          if (this.idApiArr2.length > 0) {
            toRemoveBatchPayType({ ids: this.idApiArr2 })
            this.idApiArr2 = []
          }
          let arrSum = []
          const newArr1 = this.arr1.map(item => {
            return {
              id: 0,
              categoryName: item.categoryName,
              listOrder: item.listOrder,
              parentId: 0
            }
          })
          let newArr2 = []
          if (this.form.settleTypeList.length > 0) {
            newArr2 = this.form.settleTypeList.map(item => {
              return {
                id: item.id,
                categoryName: item.categoryName,
                listOrder: item.listOrder,
                parentId: 0
              }
            })
          }

          arrSum = [...newArr2, ...newArr1]
          if (arrSum.length > 0) {
            toUpdateBatchSettleType({
              category: arrSum
            }).then(res => {
              // console.log('保存结算', res)
              this.arr1 = []
              this.getSettleTypeData()
              // this.$message.success(res.message)
            })
          }
          let arrSum2 = []
          const twoArr1 = this.arr2.map(item => {
            return {
              id: 0,
              categoryName: item.categoryName,
              listOrder: item.listOrder,
              parentId: 0
            }
          })
          console.log('twoArr1', twoArr1)
          let twoArr2 = []
          if (this.form.payTypeList.length > 0) {
            twoArr2 = this.form.payTypeList.map(item => {
              return {
                id: item.id,
                categoryName: item.categoryName,
                listOrder: item.listOrder,
                parentId: 0
              }
            })
          }

          arrSum2 = [...twoArr1, ...twoArr2]
          if (arrSum2.length > 0) {
            toUpdateBatchPayType({
              category: arrSum2
            }).then(res => {
              // console.log('保存结算', res)
              this.arr2 = []
              this.getPayTypeData()
              // this.$message.success(res.message)
            })
          }
          this.$nextTick(() => {
            this.bol = true
          })
          this.$message.success('保存成功')
        }
      })
    },
    // 结算方式数据
    getSettleTypeData () {
      toSettleType().then(({ data }) => {
        this.form.settleTypeList = data
        this.$nextTick(() => {
          this.bol = true
        })
        console.log('获取结算数据', data)
      })
    },
    // 添加结算方式输入框
    add1 () {
      this.arr1.push({
        id: Math.random() * 999,
        categoryName: '',
        listOrder: ''
      })
    },
    // 添加支付方式输入框
    add2 () {
      this.arr2.push({
        id: Math.random() * 999,
        categoryName: '',
        listOrder: ''
      })
    }
  },
  created () {
    this.getSettleTypeData()
    this.getPayTypeData()
  }
}
</script>

<style lang="less" scoped>
.card {
  margin-top: 20px;
  .box {
    .item {
      display: flex;
      align-items: center;
      input {
        width: 216px;
        margin-left: 10px;
        margin-bottom: 10px;
      }
      .circle {
        font-size: 16px;
        color: #adadad;
        margin-left: 10px;
      }
    }
    .item2 {
      display: flex;
      align-items: center;
      input {
        width: 216px;
        margin-left: 10px;
        margin-bottom: 10px;
      }
      .circle {
        font-size: 16px;
        color: #adadad;
        margin-left: 10px;
      }
    }
  }
  .addArea {
    margin-top: 12px;
    margin-left: 10px;
    width: 440px;
    height: 32px;
    border-radius: 4px;
    border: 2px dashed #eeeeee;
    text-align: center;
    line-height: 28px;
    cursor: pointer;
  }
  .btn {
    margin-left: 280px;
  }
}
</style>
