<template>
  <a-form-model
    ref="projectForm"
    :model="form"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-model-item label="付款时间" prop="payTime" required>
      <a-date-picker
        v-model="form.payTime"
        placeholder="请选择"
        valueFormat="YYYY-MM-DD"
        style="width: 100%;"
      ></a-date-picker>
    </a-form-model-item>
    <a-form-model-item label="付款方式" prop="payType" required>
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
              v-if="+item.unpaid || +item.paid"
              v-model="item.paid"
              placeholder="请输入"
              prefix="￥"
              v-number-input="{ min: 0, max: item.unpaid }"
              :maxLength="20"
              :key="`paid${index}`"
            >
            </a-input>
          </a-col>
        </a-row>
      </template>
      <a-row class="pay-row pay-row-strong" type="flex" :gutter="10">
        <a-col class="textOverflow" flex="140px">
          总计
        </a-col>
        <a-col flex="140px">未付￥{{ unpaid }}</a-col>
        <a-col flex="180px" style="margin-left: 12px;"> ￥{{ total }} </a-col>
      </a-row>
    </a-form-model-item>
    <a-form-model-item
      label="付款凭证"
      prop="payPz"
      style="margin-bottom: 7px;"
    >
      <upload-image v-model="form.payPz" maxLength="8"></upload-image>
    </a-form-model-item>
    <a-form-model-item label="开票情况" prop="isKp" required>
      <a-select v-model="form.isKp" placeholder="请选择">
        <a-select-option value="1">已开</a-select-option>
        <a-select-option value="0">未开</a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item label="开票凭证" prop="kpPz" style="margin-bottom: 0;">
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
    }
  },
  computed: {
    unpaid () {
      let num = 0
      this.payDetailed.forEach(obj => {
        num = NP.plus(num, obj.unpaid || 0)
      })
      return num
    },
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
      form: {},
      rules: {
        payTime: [{ required: true, message: '请选择付款时间' }],
        payType: [{ required: true, message: '请选择付款方式' }],
        // payDetailed: [
        //   { required: true, message: '请输入付款金额' },
        //   { validator: GreaterZero, trigger: 'blur' }
        // ],
        isKp: [{ required: true, message: '请选择开票情况' }]
      },
      payTypeOptions: [],
      payDetailed: this.material
    }
  },
  created () {
    this.getPayType()
    this.setPayDetailed(this.material)
  },
  methods: {
    getPayType () {
      getPayType().then(({ data }) => {
        this.payTypeOptions = data
      })
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
    setFieldsValue (data) {
      this.form = data
      this.payDetailed = this.material.map((obj, index) => {
        const paid = data.payDetailed[index].paid
        obj.unpaid = NP.plus(obj.unpaid, paid)
        obj.paid = parseFloat(paid)
        return obj
      })
    },
    setPayDetailed (data) {
      this.payDetailed = data.map(obj => {
        obj.paid = ''
        return obj
      })
    },
    resetFields () {
      this.$refs.projectForm.resetFields()
      this.form = {}
      this.payDetailed = []
    }
  },
  watch: {
    material (val) {
      this.setPayDetailed(val)
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
