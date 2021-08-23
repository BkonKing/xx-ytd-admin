<template>
  <a-form-model
    ref="projectForm"
    :model="form"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-model-item label="付款金额" prop="payDetailed">
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
      <upload-image v-model="form.payPz" maxLength="8"></upload-image>
    </a-form-model-item>
    <a-form-model-item label="开票情况" prop="isKp" required>
      <a-radio-group v-model="form.isKp">
        <a-radio value="0">
          未开
        </a-radio>
        <a-radio value="1">
          已开
        </a-radio>
      </a-radio-group>
    </a-form-model-item>
    <a-form-model-item
      v-if="+form.isKp"
      label="开票凭证"
      prop="kpPz"
      style="margin-bottom: 0;"
    >
      <upload-image v-model="form.kpPz" maxLength="8"></upload-image>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import { UploadImage } from '@/components'
import { getPayType } from '@/api/contract'
import NP from 'number-precision'

export default {
  name: 'PaymentEditForm',
  components: {
    UploadImage
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
      wrapperCol: { span: 19 },
      form: {
        isPay: '1',
        payTime: '',
        payType: '',
        payPz: [],
        isKp: '0',
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
    },
    handleSubmit () {
      return new Promise((resolve, reject) => {
        this.$refs.projectForm.validate(valid => {
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
        const paid = data.payDetailed[index].paid
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
      this.$refs.projectForm.resetFields()
      this.form = {
        isPay: '1',
        payTime: '',
        payType: '',
        payPz: [],
        isKp: '0',
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
