<template>
  <a-form-model
    ref="paymentForm"
    :model="form"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-model-item
      label="付款金额"
      prop="payDetailed"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 19 }"
    >
      <template v-for="(item, index) in payDetailed">
        <a-row class="pay-row" type="flex" :gutter="10" :key="index">
          <a-col class="textOverflow" flex="140px">
            {{ item.materialNo }} {{ item.materialName }}
            <div class="brand">{{ item.brand }} {{ item.model }}</div>
          </a-col>
          <a-col flex="140px">未付￥{{ parseFloat(item.unpaid) || 0 }}</a-col>
          <a-col flex="180px">
            <a-input
              v-model="item.paid"
              placeholder="请输入"
              prefix="￥"
              v-number-input="{ min: 0 }"
              :maxLength="20"
              :key="`paid${index}`"
              @blur="countPaid(item)"
            >
            </a-input>
          </a-col>
        </a-row>
      </template>
      <a-row class="pay-row pay-row-strong" type="flex" :gutter="10">
        <a-col class="textOverflow" flex="140px">
          总计
        </a-col>
        <a-col flex="140px">未付￥{{ unpaidTotal }}</a-col>
        <a-col flex="180px" style="margin-left: 12px;"> ￥{{ total }} </a-col>
      </a-row>
    </a-form-model-item>
    <a-form-model-item label="付款情况" prop="isPay" required>
      <a-radio-group v-model="form.isPay">
        <a-radio value="0">
          未付款
        </a-radio>
        <a-radio value="1">
          已付款
        </a-radio>
      </a-radio-group>
    </a-form-model-item>
    <a-form-model-item
      v-if="+form.isPay"
      label="付款时间"
      prop="payTime"
      :rules="{ required: true, message: '请选择付款时间' }"
      required
    >
      <a-date-picker
        v-model="form.payTime"
        placeholder="请选择"
        valueFormat="YYYY-MM-DD"
        style="width: 100%;"
      ></a-date-picker>
    </a-form-model-item>
    <a-form-model-item
      v-if="+form.isPay"
      label="付款方式"
      prop="payType"
      :rules="{ required: true, message: '请选择付款方式' }"
      required
    >
      <a-select v-model="form.payType" placeholder="请选择">
        <a-select-option
          v-for="option in payTypeOptions"
          :value="option.typeId"
          :key="option.typeId"
        >
          {{ option.typeName }}
        </a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item
      v-if="+form.isPay"
      label="付款凭证"
      prop="payPz"
      style="margin-bottom: 7px;"
    >
      <upload-file
        v-model="form.payPz"
        maxLength="0"
        accept=".jpg,.jpeg,.pdf,.png"
      ></upload-file>
    </a-form-model-item>
    <a-form-model-item label="开票情况" prop="isKp" required>
      <a-radio-group v-model="form.isKp">
        <a-radio value="0">
          全部未开
        </a-radio>
        <a-radio value="2">
          部分已开
        </a-radio>
        <a-radio value="1">
          全部已开
        </a-radio>
      </a-radio-group>
      <a-form-model-item
        v-if="form.isKp === '2'"
        prop="kpMoney"
        :rules="[{ validator: kpMoneyCount }]"
        style="margin-top: 16px;"
      >
        <a-input
          v-model="form.kpMoney"
          placeholder="请输入"
          prefix="￥"
          v-number-input
        >
        </a-input>
      </a-form-model-item>
    </a-form-model-item>
    <a-form-model-item
      v-if="+form.isKp"
      label="开票凭证"
      prop="kpPz"
      style="margin-bottom: 0;"
    >
      <upload-file
        v-model="form.kpPz"
        maxLength="0"
        accept=".jpg,.jpeg,.pdf,.png"
      ></upload-file>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import { UploadFile } from '@/components'
import { getPayType } from '@/api/contract'
import NP from 'number-precision'

export default {
  name: 'PaymentEditForm',
  components: {
    UploadFile
  },
  props: {
    material: {
      type: Array,
      default: () => []
    },
    unpaid: {
      type: [String, Number],
      default: ''
    }
  },
  computed: {
    total () {
      let num = 0
      this.payDetailed.forEach(obj => {
        num = NP.plus(num, obj.paid || 0)
      })
      return num
    }
  },
  data () {
    return {
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
      form: {
        isPay: '1',
        payTime: '',
        payType: '',
        payPz: [],
        isKp: '0',
        kpMoney: '',
        kpPz: []
      },
      rules: {
        isKp: [{ required: true, message: '请选择开票情况' }]
      },
      payTypeOptions: [],
      payDetailed: this.material,
      unpaidTotal: parseFloat(this.unpaid)
    }
  },
  created () {
    this.getPayType()
    this.setPayDetailed(this.material)
  },
  watch: {
    // 付款情况切换清空付款时间、方式、凭证
    'form.isPay': {
      handler (val) {
        if (!+val) {
          this.form.payTime = ''
          this.form.payType = ''
          this.form.payPz = []
        }
      }
    },
    // 开票情况切换清空凭证
    'form.isKp': {
      handler (val) {
        if (!+val) {
          this.form.kpPz = []
        }
        if (val !== '2') {
          this.form.kpMoney = ''
        }
      }
    },
    material (val) {
      this.setPayDetailed(val)
    }
  },
  methods: {
    // 付款类型
    getPayType () {
      getPayType().then(({ data }) => {
        this.payTypeOptions = data
      })
    },
    // （付款金额blur）计算付款总金额是否大于未付总金额，超过则重新计算当前付款金额
    countPaid (item) {
      if (this.total > this.unpaidTotal) {
        item.paid = NP.plus(NP.minus(this.unpaidTotal, this.total), item.paid)
      }
      this.$refs.paymentForm && this.$refs.paymentForm.validateField('kpMoney')
    },
    kpMoneyCount (rule, value, callback) {
      if (!value) {
        callback(new Error('请输入开票金额'))
      } else if (parseFloat(value) <= 0) {
        callback(new Error('开票金额必须大于0'))
      } else if (parseFloat(value) >= this.total) {
        callback(new Error('开票金额必须小于付款金额'))
      } else {
        callback()
      }
    },
    handleSubmit () {
      return new Promise((resolve, reject) => {
        this.$refs.paymentForm.validate(valid => {
          if (valid) {
            this.form.payDetailed = this.payDetailed.map(obj => {
              return {
                orderMaterialId: obj.orderMaterialId,
                paid: obj.paid
              }
            })
            resolve(this.form)
          } else {
            reject(new Error(false))
            return false
          }
        })
      })
    },
    // （回填）设置表单数据和付款表格数据
    setFieldsValue (data) {
      this.form = data
      let sum = 0
      this.payDetailed = this.material.map((obj, index) => {
        const payData = data.payDetailed[index]
        if (!payData) {
          return obj
        }
        const { paid } = payData
        if (+this.form.isPay) {
          obj.unpaid = NP.plus(obj.unpaid, paid)
          sum = NP.plus(sum, paid)
        }
        obj.paid = parseFloat(paid)
        return obj
      })
      this.unpaidTotal = parseFloat(this.unpaid) + sum
    },
    // 设置付款金额表格数据（根据物料信息）
    setPayDetailed (data) {
      this.payDetailed = data.map(obj => {
        obj.paid = ''
        return obj
      })
      this.unpaidTotal = parseFloat(this.unpaid)
    },
    // 重置表单数据
    resetFields () {
      this.$refs.paymentForm.resetFields()
      this.form = {
        isPay: '1',
        payTime: '',
        payType: '',
        payPz: [],
        isKp: '0',
        kpMoney: '',
        kpPz: []
      }
      this.payDetailed = []
    }
  }
}
</script>

<style lang="less" scoped>
.pay-row {
  .textOverflow {
    .textOverflow();
  }
  .brand {
    width: 100%;
    color: #0000003f;
    line-height: 1;
    .textOverflow();
  }
}
.pay-row + .pay-row {
  margin-top: 12px;
}
.pay-row-strong {
  font-weight: bold;
  color: rgba(0, 0, 0, 0.85);
}
</style>
